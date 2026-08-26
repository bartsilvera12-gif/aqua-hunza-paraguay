-- ============================================================================
-- Aqua Hunza — Esquema de Supabase (schema propio: "aquahunza")
-- ----------------------------------------------------------------------------
-- Cómo usar:
--   1) Supabase -> SQL Editor -> New query -> pegá TODO -> Run.
--   2) IMPORTANTE: exponé el schema para la API:
--        Settings -> API -> Data API -> "Exposed schemas"
--        agregá:  aquahunza   (además de public) y guardá.
--   3) El usuario admin ya lo creaste (admin@aquahunza.com). Este script
--      lo agrega solo a la allowlist de administradores.
--
-- Seguridad:
--   - La "anon public key" es pública y va en el frontend: es su función.
--   - NUNCA pongas la "service_role" key en el frontend.
--   - Quién puede administrar = quién esté en aquahunza.usuarios.
-- ============================================================================

create schema if not exists aquahunza;
grant usage on schema aquahunza to anon, authenticated;

-- ---------- Tabla de notas del blog -----------------------------------------
create table if not exists aquahunza.posts (
  id         text primary key,                 -- slug (ej: "soluciones-rurales")
  title      text not null,
  cat        text,
  excerpt    text,
  img        text,                             -- nombre en assets/img, URL, o path de Storage
  content    text,                             -- HTML de la nota
  url        text,                             -- destino del enlace
  builtin    boolean not null default false,   -- true = nota con página propia en el repo
  published  boolean not null default true,
  sort       integer not null default 0,       -- orden en el listado (menor = primero)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Allowlist de administradores ------------------------------------
create table if not exists aquahunza.usuarios (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  rol        text not null default 'admin',
  created_at timestamptz not null default now()
);

grant select on aquahunza.posts to anon, authenticated;
grant insert, update, delete on aquahunza.posts to authenticated;
grant select on aquahunza.usuarios to authenticated;

-- ---------- ¿el usuario actual es admin? ------------------------------------
create or replace function aquahunza.is_admin()
returns boolean
language sql
stable
security definer
set search_path = aquahunza
as $$
  select exists (select 1 from aquahunza.usuarios u where u.id = auth.uid());
$$;
grant execute on function aquahunza.is_admin() to anon, authenticated;

-- ---------- updated_at automático -------------------------------------------
create or replace function aquahunza.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists posts_touch on aquahunza.posts;
create trigger posts_touch before update on aquahunza.posts
  for each row execute function aquahunza.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table aquahunza.posts    enable row level security;
alter table aquahunza.usuarios enable row level security;

-- posts: cualquiera (anónimo) puede LEER las publicadas
drop policy if exists posts_public_read on aquahunza.posts;
create policy posts_public_read on aquahunza.posts
  for select using (published = true);

-- posts: los admin pueden LEER todas (incluye borradores)
drop policy if exists posts_admin_read on aquahunza.posts;
create policy posts_admin_read on aquahunza.posts
  for select to authenticated using (aquahunza.is_admin());

-- posts: los admin pueden CREAR / EDITAR / BORRAR
drop policy if exists posts_admin_insert on aquahunza.posts;
create policy posts_admin_insert on aquahunza.posts
  for insert to authenticated with check (aquahunza.is_admin());

drop policy if exists posts_admin_update on aquahunza.posts;
create policy posts_admin_update on aquahunza.posts
  for update to authenticated using (aquahunza.is_admin()) with check (aquahunza.is_admin());

drop policy if exists posts_admin_delete on aquahunza.posts;
create policy posts_admin_delete on aquahunza.posts
  for delete to authenticated using (aquahunza.is_admin());

-- usuarios: cada uno puede ver su propia fila (para chequear si es admin)
drop policy if exists usuarios_self_read on aquahunza.usuarios;
create policy usuarios_self_read on aquahunza.usuarios
  for select to authenticated using (id = auth.uid());

-- ============================================================================
-- Storage: bucket público para las imágenes que se suben desde el panel
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

drop policy if exists blog_public_read on storage.objects;
create policy blog_public_read on storage.objects
  for select using (bucket_id = 'blog');

drop policy if exists blog_admin_insert on storage.objects;
create policy blog_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'blog' and aquahunza.is_admin());

drop policy if exists blog_admin_update on storage.objects;
create policy blog_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'blog' and aquahunza.is_admin());

drop policy if exists blog_admin_delete on storage.objects;
create policy blog_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'blog' and aquahunza.is_admin());

-- ============================================================================
-- Admin: agregar admin@aquahunza.com a la allowlist
-- ============================================================================
insert into aquahunza.usuarios (id, email)
select id, email from auth.users where email = 'admin@aquahunza.com'
on conflict (id) do nothing;

-- ============================================================================
-- Seed: notas actuales (idempotente: no pisa lo que edites)
-- ============================================================================
insert into aquahunza.posts (id, title, cat, img, url, builtin, published, sort, excerpt) values
  ('como-funciona',     '¿Cómo funciona?',                                            'Tecnología',      'comof.webp',        'como-funciona.html',      true, true, 10, 'Conocé cómo funcionan los procesos de purificación de última generación para toda la casa.'),
  ('soluciones-rurales','Soluciones rurales',                                         'Sector rural',    'hero33.webp',       'soluciones-rurales.html', true, true, 20, 'Filtros de agua para tajamares del Chaco Paraguayo.'),
  ('piel-y-cabello',    'Piel y cabello',                                             'Cuidado personal','piel-cabello2.webp','piel-y-cabello.html',     true, true, 30, 'Protegé tu piel y cabello con purificadores de agua Aqua Hunza.'),
  ('ganaderia-rentable','Ganadería rentable',                                         'Ganadería',       'campo-rural33.jpg', 'ganaderia-rentable.html', true, true, 40, '¿Sabías que la calidad del agua puede ser la clave para maximizar el crecimiento y la rentabilidad de tu ganado?'),
  ('notas-tecnicas',    'Notas técnicas',                                             'Notas técnicas',  'rural-system2.webp','notas-tecnicas.html',     true, true, 50, 'Notas de Pablo Ott sobre los efectos del consumo de agua y su impacto en la performance animal.'),
  ('clean-water',       'Why Clean Water Is Essential for Cattle & Buffalo Health',   'Ganadería',       'rural-hero.webp',   'clean-water.html',        true, true, 60, 'El agua limpia es esencial para la salud, el crecimiento y la producción de leche del ganado.'),
  ('start-thinking',    'Start Thinking: Water for Livestock',                        'Ganadería',       'cow-842543_1280-696x464.webp', 'start-thinking.html', true, true, 70, 'El consumo de materia seca del ganado está directamente relacionado con el agua que bebe.'),
  ('calidad-agua',      'Evaluando la calidad del agua para el ganado',               'Ganadería',       'blog-cattle-2.jpg', 'calidad-agua.html',       true, true, 80, 'El agua es el nutriente simple más importante para el ganado.'),
  ('water-intake',      'Water Intake Errors That Reduce Weight Gain',                'Ganadería',       'blog-cattle-3.jpg', 'water-intake.html',       true, true, 90, 'Errores en el consumo de agua que reducen la ganancia de peso del ganado.'),
  ('water-more',        'Why Is Water More Important Than Feed For Fattening Cattle?','Ganadería',       'blog-cattle-4.jpg', 'water-more.html',         true, true, 100,'Por qué el agua es más importante que el alimento a la hora de engordar ganado.')
on conflict (id) do nothing;

-- ============================================================================
-- Preguntas frecuentes (FAQ)
-- ============================================================================
create table if not exists aquahunza.faqs (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,
  question   text not null,
  answer     text not null,
  link_href  text,
  link_label text,
  sort       integer not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists faqs_question_uidx on aquahunza.faqs (question);

grant select on aquahunza.faqs to anon, authenticated;
grant insert, update, delete on aquahunza.faqs to authenticated;

drop trigger if exists faqs_touch on aquahunza.faqs;
create trigger faqs_touch before update on aquahunza.faqs
  for each row execute function aquahunza.touch_updated_at();

alter table aquahunza.faqs enable row level security;

drop policy if exists faqs_public_read on aquahunza.faqs;
create policy faqs_public_read on aquahunza.faqs for select using (published = true);
drop policy if exists faqs_admin_read on aquahunza.faqs;
create policy faqs_admin_read on aquahunza.faqs for select to authenticated using (aquahunza.is_admin());
drop policy if exists faqs_admin_insert on aquahunza.faqs;
create policy faqs_admin_insert on aquahunza.faqs for insert to authenticated with check (aquahunza.is_admin());
drop policy if exists faqs_admin_update on aquahunza.faqs;
create policy faqs_admin_update on aquahunza.faqs for update to authenticated using (aquahunza.is_admin()) with check (aquahunza.is_admin());
drop policy if exists faqs_admin_delete on aquahunza.faqs;
create policy faqs_admin_delete on aquahunza.faqs for delete to authenticated using (aquahunza.is_admin());

insert into aquahunza.faqs (category, question, answer, link_href, link_label, sort, published) values
  ('Tecnología y salud familiar', '¿Qué diferencia a los purificadores Aqua Hunza de un filtro convencional?', 'Los filtros comunes solo retienen sedimentos gruesos. Los sistemas Aqua Hunza combinan múltiples etapas de tratamiento para eliminar sedimentos, cloro, metales pesados, bacterias y virus, transformando el agua de red en agua purificada en el punto de uso.', 'como-funciona.html', '¿Cómo funciona?', 10, true),
  ('Tecnología y salud familiar', '¿Qué tecnologías utilizan en sus plantas y purificadores?', 'Cada fuente de agua tiene una composición fisicoquímica distinta —dureza, pH, sólidos disueltos totales (TDS), cloro, metales pesados y carga microbiológica—, por lo que no existe una solución única. Analizamos el tipo de agua a tratar y configuramos un sistema modular a su medida. Integramos tecnologías como ósmosis inversa, intercambio iónico, filtración catalítica, absorción/adsorción, ozonización, alcalinización, hidrogenación y mineralización, logrando la calidad de agua que su hogar o industria requiere.', 'notas-tecnicas.html', 'Notas técnicas', 20, true),
  ('Tecnología y salud familiar', '¿Qué es el agua alcalina y cuáles son sus beneficios?', 'Es agua con un nivel de pH balanceado y propiedades antioxidantes. Ayuda a optimizar la hidratación del cuerpo, neutraliza la acidez metabólica y favorece el bienestar general de toda la familia.', 'agua-alcalina.html', 'Agua alcalina', 30, true),
  ('Tecnología y salud familiar', '¿Cómo ayuda el agua purificada a los bebés con dermatitis atópica o pieles muy sensibles?', 'La piel de los bebés es extremadamente delgada. El cloro y el sarro del agua común actúan como irritantes químicos que destruyen sus aceites grasos naturales. Aqua Hunza remueve estos elementos, reduciendo drásticamente los brotes de eccema, el enrojecimiento y la comezón.', 'piel-y-cabello.html', 'Piel y cabello', 40, true),
  ('Tecnología y salud familiar', '¿Es seguro bañar a un recién nacido con el agua de estos filtros?', 'Sí, es lo ideal. Al eliminar metales pesados, pesticidas y sedimentos orgánicos, evitás exponer su sistema inmune en desarrollo a químicos agresivos, manteniendo su piel suave e hidratada desde el primer día.', 'piel-y-cabello.html', 'Piel y cabello', 50, true),
  ('Tecnología y salud familiar', '¿Qué es exactamente el agua hidrogenada y cómo se produce?', 'Es agua común enriquecida con gas hidrógeno molecular (H₂) disuelto mediante electrólisis o microelectrólisis controlada. Este proceso no altera la molécula del agua, sino que inyecta burbujas microscópicas de hidrógeno libre, transformándola en un potente antioxidante líquido.', 'agua-hidrogenada.html', 'Agua hidrogenada', 60, true),
  ('Tecnología y salud familiar', '¿Cuál es la diferencia entre el agua alcalina y el agua hidrogenada?', 'El agua alcalina regula el pH (acidez) y aporta minerales esenciales. El agua hidrogenada se enfoca en el potencial antioxidante y celular. Los equipos avanzados de Aqua Hunza combinan ambos beneficios en un solo sistema.', 'agua-hidrogenada.html', 'Agua hidrogenada', 70, true),
  ('Tecnología y salud familiar', '¿Cómo actúa el hidrógeno en nuestro cuerpo?', 'Al ser la molécula más pequeña del universo, el hidrógeno penetra con facilidad las membranas celulares y llega hasta las mitocondrias. Allí neutraliza exclusivamente a los radicales libres más dañinos (responsables del envejecimiento y la inflamación), convirtiéndolos en agua inocua para el organismo.', 'agua-hidrogenada.html', 'Agua hidrogenada', 80, true),
  ('Tecnología y salud familiar', '¿Qué beneficios tiene para el rendimiento deportivo y la energía?', 'Reduce drásticamente la acumulación de ácido láctico en los músculos durante el entrenamiento, disminuyendo la fatiga y el dolor post-ejercicio. Además, optimiza la producción de energía celular, acelerando la recuperación de los atletas.', 'agua-hidrogenada.html', 'Agua hidrogenada', 90, true),
  ('Tecnología y salud familiar', '¿Existe algún riesgo o contraindicación al consumir agua hidrogenada?', 'Ninguno. El hidrógeno molecular es completamente seguro, no es tóxico y el cuerpo tolera cualquier cantidad. Si consumís más de lo necesario, el organismo simplemente lo elimina de forma natural a través de la respiración. Es apta para personas de todas las edades.', 'agua-hidrogenada.html', 'Agua hidrogenada', 100, true),
  ('Tecnología y salud familiar', '¿El agua hidrogenada pierde sus propiedades si se expone al aire?', 'Sí. El hidrógeno es un gas muy volátil y tiende a evaporarse con las horas. Para aprovechar al máximo su poder antioxidante, se recomienda consumirla fresca, recién extraída del equipo, o conservarla en botellas de acero inoxidable o vidrio hermético por no más de 12 a 24 horas.', 'agua-hidrogenada.html', 'Agua hidrogenada', 110, true),
  ('Estética, skincare y cuidado capilar', '¿Es verdad que el agua sin purificar reduce drásticamente la efectividad de las lociones y cosméticos?', 'Sí, es verdad: produce un bloqueo físico que obstruye los poros, arruina la base sobre la que se aplican las cremas e inactiva los limpiadores faciales, entre otros efectos.', 'piel-y-cabello.html', 'Piel y cabello', 120, true),
  ('Estética, skincare y cuidado capilar', '¿Cómo afecta el agua corriente de la canilla a la salud de mi piel y cabello?', 'El agua sin purificar contiene sedimentos, cloro y metales pesados que arrasan con los aceites naturales de la dermis. Esto provoca deshidratación, picazón en el cuero cabelludo, poros obstruidos y un cabello opaco, quebradizo y áspero.', 'piel-y-cabello.html', 'Piel y cabello', 130, true),
  ('Estética, skincare y cuidado capilar', '¿Qué beneficios estéticos aporta lavarse el rostro con agua purificada?', 'Tu piel recupera su elasticidad y equilibrio natural. Al actuar como un agente de limpieza suave, previene brotes de acné, calma las pieles sensibles o con rosácea y potencia la absorción de tus cremas y sérums de skincare, logrando así el máximo efecto rejuvenecedor.', 'piel-y-cabello.html', 'Piel y cabello', 140, true),
  ('Estética, skincare y cuidado capilar', '¿Es verdad que el agua purificada ayuda a mantener el color y brillo del cabello?', 'Sí. El cloro es un agente blanqueador que oxida el pelo. Bañarse con agua purificada protege la fibra capilar, extiende notablemente la duración de las tinturas o tratamientos de queratina y evita que las puntas se abran.', 'piel-y-cabello.html', 'Piel y cabello', 150, true),
  ('Estética, skincare y cuidado capilar', '¿Qué propiedades antienvejecimiento tiene el agua hidrogenada en la piel?', 'Al aplicarla o beberla, el hidrógeno penetra profundamente en los tejidos para neutralizar los radicales libres responsables del envejecimiento prematuro, mejorando visiblemente la firmeza y luminosidad cutánea.', 'agua-hidrogenada.html', 'Agua hidrogenada', 160, true),
  ('Estética, skincare y cuidado capilar', '¿Un purificador Aqua Hunza central puede disminuir la resequedad corporal y la caspa?', 'Totalmente. Al eliminar el sarro y los químicos irritantes de la ducha, evitás la descamación del cuero cabelludo (caspa por resequedad) y disminuís drásticamente la necesidad de usar cremas humectantes en exceso después del baño.', 'piel-y-cabello.html', 'Piel y cabello', 170, true),
  ('Instalación, mantenimiento y compra', '¿Cómo se realiza la instalación de los equipos bajo mesada?', 'Nuestro equipo técnico se encarga de una instalación discreta y funcional directamente bajo tu cocina, conectando el purificador a un grifo independiente exclusivo para tu consumo.', 'como-funciona.html', '¿Cómo funciona?', 180, true),
  ('Instalación, mantenimiento y compra', '¿Qué tipo de mantenimiento requieren y cada cuánto se cambian los filtros?', 'Para garantizar la máxima pureza, los cartuchos internos requieren un recambio periódico. La frecuencia exacta depende del volumen de consumo de tu hogar y de las características del agua de tu zona, pero nuestro servicio técnico te notificará de manera proactiva cuando sea el momento de realizarlo.', 'como-funciona.html', '¿Cómo funciona?', 190, true),
  ('Instalación, mantenimiento y compra', '¿Los purificadores de agua cuentan con garantía?', 'Todos nuestros equipos cuentan con garantía en Paraguay, asegurando la provisión constante de repuestos y cartuchos originales.', 'contacto.html', 'Contacto', 200, true),
  ('Instalación, mantenimiento y compra', '¿Tienen envíos e instalación en todo el país?', 'Ofrecemos cobertura de entrega y asesoramiento técnico en Asunción, Gran Asunción y los principales puntos del territorio nacional.', 'contacto.html', 'Contacto', 210, true),
  ('Soluciones comerciales, profesionales e industriales', '¿Qué ventajas tienen sus dispensadores para empresas frente a los bidones tradicionales?', 'Se conectan directo a la red pública, eliminando el gasto constante en bidones, ahorrando espacio de almacenamiento, evitando la carga de peso por parte del personal y garantizando agua fría y caliente ilimitada de máxima pureza.', 'comercial.html', 'Comercial', 220, true),
  ('Soluciones comerciales, profesionales e industriales', '¿Por qué los salones de belleza y spas deberían incorporar sistemas Aqua Hunza?', 'El agua es la materia prima de tus servicios. Ofrecer lavados libres de cloro, metales pesados y sedimentos duplica la durabilidad y efectividad de tus alisados, coloraciones y tratamientos de hidratación, logrando clientes notablemente más satisfechos.', 'comercial.html', 'Comercial', 230, true),
  ('Soluciones comerciales, profesionales e industriales', '¿De qué manera un purificador optimiza los costos de una peluquería o centro de estética?', 'El exceso de sarro satura las fibras capilares, obligando a usar el doble de champú y mascarillas. Al trabajar con agua blanda y purificada, optimizás el rendimiento de tus insumos cosméticos hasta en un 40% y protegés las tuberías y termotanques contra obstrucciones.', 'comercial.html', 'Comercial', 240, true),
  ('Soluciones comerciales, profesionales e industriales', '¿Sus sistemas cumplen con los estándares para sanatorios u hospitales?', 'Absolutamente. Contamos con tecnología certificada como equipo médico en Japón y Corea. Diseñamos plantas de tratamiento y ósmosis inversa de alta ingeniería aptas para centros de diálisis, laboratorios farmacéuticos y clínicas médicas.', 'industrial.html', 'Industrial', 250, true),
  ('Soluciones comerciales, profesionales e industriales', '¿Se adaptan a procesos de fabricación de alimentos y embotelladoras?', 'Sí. Desarrollamos proyectos industriales a medida de cada proceso productivo. Eliminamos por completo cualquier residuo químico, cloro o variación de sabor que pueda alterar las recetas o normativas de calidad de tus productos.', 'industrial.html', 'Industrial', 260, true),
  ('Soluciones rurales y agropecuarias', '¿Se pueden usar los sistemas Aqua Hunza con agua de pozo o tajamar?', 'Sí. Nuestros equipos para el sector agropecuario están preparados para tratar aguas de pozos, tajamares y lagunas, eliminando el exceso de sales, turbiedad, metales pesados, pesticidas y patógenos biológicos.', 'rural.html', 'Agro', 270, true),
  ('Soluciones rurales y agropecuarias', '¿Cómo beneficia este sistema a la ganadería y la producción del campo?', 'Al remover los contaminantes, se mejora significativamente la palatabilidad del agua para el ganado. Esto incrementa el consumo de pasturas y forrajes, optimiza la asimilación de nutrientes, mantiene más saludable a todo el rodeo y aumenta la productividad de carne.', 'ganaderia-rentable.html', 'Ganadería rentable', 280, true)
on conflict (question) do nothing;
