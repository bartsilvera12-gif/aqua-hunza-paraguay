/* ============================================================
   Aqua Hunza — datos de Preguntas Frecuentes (Supabase + respaldo)
   - Si Supabase está configurado (window.sb), lee/escribe aquahunza.faqs.
   - Si no, usa FAQ_SEED (respaldo). API asíncrona (Promesas).
   ============================================================ */
window.FAQ_SEED = [
  { category:"Tecnología y salud familiar", sort:10, published:true, link_href:"como-funciona.html", link_label:"¿Cómo funciona?",
    question:"¿Qué diferencia a los purificadores Aqua Hunza de un filtro convencional?",
    answer:"Los filtros comunes solo retienen sedimentos gruesos. Los sistemas Aqua Hunza combinan múltiples etapas de tratamiento para eliminar sedimentos, cloro, metales pesados, bacterias y virus, transformando el agua de red en agua purificada en el punto de uso." },
  { category:"Tecnología y salud familiar", sort:20, published:true, link_href:"notas-tecnicas.html", link_label:"Notas técnicas",
    question:"¿Qué tecnologías utilizan en sus plantas y purificadores?",
    answer:"Cada fuente de agua tiene una composición fisicoquímica distinta —dureza, pH, sólidos disueltos totales (TDS), cloro, metales pesados y carga microbiológica—, por lo que no existe una solución única. Analizamos el tipo de agua a tratar y configuramos un sistema modular a su medida. Integramos tecnologías como ósmosis inversa, intercambio iónico, filtración catalítica, absorción/adsorción, ozonización, alcalinización, hidrogenación y mineralización, logrando la calidad de agua que su hogar o industria requiere." },
  { category:"Tecnología y salud familiar", sort:30, published:true, link_href:"agua-alcalina.html", link_label:"Agua alcalina",
    question:"¿Qué es el agua alcalina y cuáles son sus beneficios?",
    answer:"Es agua con un nivel de pH balanceado y propiedades antioxidantes. Ayuda a optimizar la hidratación del cuerpo, neutraliza la acidez metabólica y favorece el bienestar general de toda la familia." },
  { category:"Tecnología y salud familiar", sort:40, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Cómo ayuda el agua purificada a los bebés con dermatitis atópica o pieles muy sensibles?",
    answer:"La piel de los bebés es extremadamente delgada. El cloro y el sarro del agua común actúan como irritantes químicos que destruyen sus aceites grasos naturales. Aqua Hunza remueve estos elementos, reduciendo drásticamente los brotes de eccema, el enrojecimiento y la comezón." },
  { category:"Tecnología y salud familiar", sort:50, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Es seguro bañar a un recién nacido con el agua de estos filtros?",
    answer:"Sí, es lo ideal. Al eliminar metales pesados, pesticidas y sedimentos orgánicos, evitás exponer su sistema inmune en desarrollo a químicos agresivos, manteniendo su piel suave e hidratada desde el primer día." },
  { category:"Tecnología y salud familiar", sort:60, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Qué es exactamente el agua hidrogenada y cómo se produce?",
    answer:"Es agua común enriquecida con gas hidrógeno molecular (H₂) disuelto mediante electrólisis o microelectrólisis controlada. Este proceso no altera la molécula del agua, sino que inyecta burbujas microscópicas de hidrógeno libre, transformándola en un potente antioxidante líquido." },
  { category:"Tecnología y salud familiar", sort:70, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Cuál es la diferencia entre el agua alcalina y el agua hidrogenada?",
    answer:"El agua alcalina regula el pH (acidez) y aporta minerales esenciales. El agua hidrogenada se enfoca en el potencial antioxidante y celular. Los equipos avanzados de Aqua Hunza combinan ambos beneficios en un solo sistema." },
  { category:"Tecnología y salud familiar", sort:80, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Cómo actúa el hidrógeno en nuestro cuerpo?",
    answer:"Al ser la molécula más pequeña del universo, el hidrógeno penetra con facilidad las membranas celulares y llega hasta las mitocondrias. Allí neutraliza exclusivamente a los radicales libres más dañinos (responsables del envejecimiento y la inflamación), convirtiéndolos en agua inocua para el organismo." },
  { category:"Tecnología y salud familiar", sort:90, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Qué beneficios tiene para el rendimiento deportivo y la energía?",
    answer:"Reduce drásticamente la acumulación de ácido láctico en los músculos durante el entrenamiento, disminuyendo la fatiga y el dolor post-ejercicio. Además, optimiza la producción de energía celular, acelerando la recuperación de los atletas." },
  { category:"Tecnología y salud familiar", sort:100, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Existe algún riesgo o contraindicación al consumir agua hidrogenada?",
    answer:"Ninguno. El hidrógeno molecular es completamente seguro, no es tóxico y el cuerpo tolera cualquier cantidad. Si consumís más de lo necesario, el organismo simplemente lo elimina de forma natural a través de la respiración. Es apta para personas de todas las edades." },
  { category:"Tecnología y salud familiar", sort:110, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿El agua hidrogenada pierde sus propiedades si se expone al aire?",
    answer:"Sí. El hidrógeno es un gas muy volátil y tiende a evaporarse con las horas. Para aprovechar al máximo su poder antioxidante, se recomienda consumirla fresca, recién extraída del equipo, o conservarla en botellas de acero inoxidable o vidrio hermético por no más de 12 a 24 horas." },

  { category:"Estética, skincare y cuidado capilar", sort:120, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Es verdad que el agua sin purificar reduce drásticamente la efectividad de las lociones y cosméticos?",
    answer:"Sí, es verdad: produce un bloqueo físico que obstruye los poros, arruina la base sobre la que se aplican las cremas e inactiva los limpiadores faciales, entre otros efectos." },
  { category:"Estética, skincare y cuidado capilar", sort:130, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Cómo afecta el agua corriente de la canilla a la salud de mi piel y cabello?",
    answer:"El agua sin purificar contiene sedimentos, cloro y metales pesados que arrasan con los aceites naturales de la dermis. Esto provoca deshidratación, picazón en el cuero cabelludo, poros obstruidos y un cabello opaco, quebradizo y áspero." },
  { category:"Estética, skincare y cuidado capilar", sort:140, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Qué beneficios estéticos aporta lavarse el rostro con agua purificada?",
    answer:"Tu piel recupera su elasticidad y equilibrio natural. Al actuar como un agente de limpieza suave, previene brotes de acné, calma las pieles sensibles o con rosácea y potencia la absorción de tus cremas y sérums de skincare, logrando así el máximo efecto rejuvenecedor." },
  { category:"Estética, skincare y cuidado capilar", sort:150, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Es verdad que el agua purificada ayuda a mantener el color y brillo del cabello?",
    answer:"Sí. El cloro es un agente blanqueador que oxida el pelo. Bañarse con agua purificada protege la fibra capilar, extiende notablemente la duración de las tinturas o tratamientos de queratina y evita que las puntas se abran." },
  { category:"Estética, skincare y cuidado capilar", sort:160, published:true, link_href:"agua-hidrogenada.html", link_label:"Agua hidrogenada",
    question:"¿Qué propiedades antienvejecimiento tiene el agua hidrogenada en la piel?",
    answer:"Al aplicarla o beberla, el hidrógeno penetra profundamente en los tejidos para neutralizar los radicales libres responsables del envejecimiento prematuro, mejorando visiblemente la firmeza y luminosidad cutánea." },
  { category:"Estética, skincare y cuidado capilar", sort:170, published:true, link_href:"piel-y-cabello.html", link_label:"Piel y cabello",
    question:"¿Un purificador Aqua Hunza central puede disminuir la resequedad corporal y la caspa?",
    answer:"Totalmente. Al eliminar el sarro y los químicos irritantes de la ducha, evitás la descamación del cuero cabelludo (caspa por resequedad) y disminuís drásticamente la necesidad de usar cremas humectantes en exceso después del baño." },

  { category:"Instalación, mantenimiento y compra", sort:180, published:true, link_href:"como-funciona.html", link_label:"¿Cómo funciona?",
    question:"¿Cómo se realiza la instalación de los equipos bajo mesada?",
    answer:"Nuestro equipo técnico se encarga de una instalación discreta y funcional directamente bajo tu cocina, conectando el purificador a un grifo independiente exclusivo para tu consumo." },
  { category:"Instalación, mantenimiento y compra", sort:190, published:true, link_href:"como-funciona.html", link_label:"¿Cómo funciona?",
    question:"¿Qué tipo de mantenimiento requieren y cada cuánto se cambian los filtros?",
    answer:"Para garantizar la máxima pureza, los cartuchos internos requieren un recambio periódico. La frecuencia exacta depende del volumen de consumo de tu hogar y de las características del agua de tu zona, pero nuestro servicio técnico te notificará de manera proactiva cuando sea el momento de realizarlo." },
  { category:"Instalación, mantenimiento y compra", sort:200, published:true, link_href:"contacto.html", link_label:"Contacto",
    question:"¿Los purificadores de agua cuentan con garantía?",
    answer:"Todos nuestros equipos cuentan con garantía en Paraguay, asegurando la provisión constante de repuestos y cartuchos originales." },
  { category:"Instalación, mantenimiento y compra", sort:210, published:true, link_href:"contacto.html", link_label:"Contacto",
    question:"¿Tienen envíos e instalación en todo el país?",
    answer:"Ofrecemos cobertura de entrega y asesoramiento técnico en Asunción, Gran Asunción y los principales puntos del territorio nacional." },

  { category:"Soluciones comerciales, profesionales e industriales", sort:220, published:true, link_href:"comercial.html", link_label:"Comercial",
    question:"¿Qué ventajas tienen sus dispensadores para empresas frente a los bidones tradicionales?",
    answer:"Se conectan directo a la red pública, eliminando el gasto constante en bidones, ahorrando espacio de almacenamiento, evitando la carga de peso por parte del personal y garantizando agua fría y caliente ilimitada de máxima pureza." },
  { category:"Soluciones comerciales, profesionales e industriales", sort:230, published:true, link_href:"comercial.html", link_label:"Comercial",
    question:"¿Por qué los salones de belleza y spas deberían incorporar sistemas Aqua Hunza?",
    answer:"El agua es la materia prima de tus servicios. Ofrecer lavados libres de cloro, metales pesados y sedimentos duplica la durabilidad y efectividad de tus alisados, coloraciones y tratamientos de hidratación, logrando clientes notablemente más satisfechos." },
  { category:"Soluciones comerciales, profesionales e industriales", sort:240, published:true, link_href:"comercial.html", link_label:"Comercial",
    question:"¿De qué manera un purificador optimiza los costos de una peluquería o centro de estética?",
    answer:"El exceso de sarro satura las fibras capilares, obligando a usar el doble de champú y mascarillas. Al trabajar con agua blanda y purificada, optimizás el rendimiento de tus insumos cosméticos hasta en un 40% y protegés las tuberías y termotanques contra obstrucciones." },
  { category:"Soluciones comerciales, profesionales e industriales", sort:250, published:true, link_href:"industrial.html", link_label:"Industrial",
    question:"¿Sus sistemas cumplen con los estándares para sanatorios u hospitales?",
    answer:"Absolutamente. Contamos con tecnología certificada como equipo médico en Japón y Corea. Diseñamos plantas de tratamiento y ósmosis inversa de alta ingeniería aptas para centros de diálisis, laboratorios farmacéuticos y clínicas médicas." },
  { category:"Soluciones comerciales, profesionales e industriales", sort:260, published:true, link_href:"industrial.html", link_label:"Industrial",
    question:"¿Se adaptan a procesos de fabricación de alimentos y embotelladoras?",
    answer:"Sí. Desarrollamos proyectos industriales a medida de cada proceso productivo. Eliminamos por completo cualquier residuo químico, cloro o variación de sabor que pueda alterar las recetas o normativas de calidad de tus productos." },

  { category:"Soluciones rurales y agropecuarias", sort:270, published:true, link_href:"rural.html", link_label:"Agro",
    question:"¿Se pueden usar los sistemas Aqua Hunza con agua de pozo o tajamar?",
    answer:"Sí. Nuestros equipos para el sector agropecuario están preparados para tratar aguas de pozos, tajamares y lagunas, eliminando el exceso de sales, turbiedad, metales pesados, pesticidas y patógenos biológicos." },
  { category:"Soluciones rurales y agropecuarias", sort:280, published:true, link_href:"ganaderia-rentable.html", link_label:"Ganadería rentable",
    question:"¿Cómo beneficia este sistema a la ganadería y la producción del campo?",
    answer:"Al remover los contaminantes, se mejora significativamente la palatabilidad del agua para el ganado. Esto incrementa el consumo de pasturas y forrajes, optimiza la asimilación de nutrientes, mantiene más saludable a todo el rodeo y aumenta la productividad de carne." }
];

window.AquaFaq = (function () {
  function seed() { return JSON.parse(JSON.stringify(window.FAQ_SEED)); }
  function sb() { return window.sb || null; }
  function pubSeed() {
    return seed().filter(function (f) { return f.published !== false; })
      .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
  }
  function getFaqs() { // publicadas, para la página
    var c = sb();
    if (!c) return Promise.resolve(pubSeed());
    return c.from("faqs").select("*").eq("published", true).order("sort", { ascending: true })
      .then(function (r) { if (r.error) throw r.error; return (r.data && r.data.length) ? r.data : pubSeed(); })
      .catch(function (e) { console.warn("[faq] Supabase falló, uso seed:", e.message || e); return pubSeed(); });
  }
  function getAll() { // todas, para el panel
    var c = sb();
    if (!c) return Promise.resolve(seed().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); }));
    return c.from("faqs").select("*").order("sort", { ascending: true })
      .then(function (r) { if (r.error) throw r.error; return r.data || []; });
  }
  function insert(faq) { return sb().from("faqs").insert(faq).select(); }
  function update(id, fields) { return sb().from("faqs").update(fields).eq("id", id); }
  function remove(id) { return sb().from("faqs").delete().eq("id", id); }
  function configured() { return !!sb(); }

  return { getFaqs: getFaqs, getAll: getAll, insert: insert, update: update, remove: remove, configured: configured };
})();
