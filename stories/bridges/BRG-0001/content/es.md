# La Red de Piedra: Donde las piedras responden

Cuando el equipo de excavación no logró encontrar una entrada física al vacío subterráneo, Maran propuso volver a leer la superficie antes de abrir más terreno. Las imágenes diurnas de vuelos anteriores habían sido útiles, pero las líneas extremadamente débiles entre las piedras desaparecían a medida que el sol ascendía. Esta vez la misión del dron se realizaría justo después de la puesta del sol, durante el breve intervalo en que la luz natural disminuía rápidamente.

El plan de vuelo se preparó de forma especialmente reproducible. El dron recorrió las mismas rutas a tres alturas diferentes; en cada pasada, la cámara miró una vez directamente hacia abajo y otra en ángulo oblicuo. GPS, altitud, orientación, hora y ajustes de cámara quedaron vinculados a cada fotograma. La misma hilera de piedras volvió a registrarse desde distintos ángulos. El objetivo no era conseguir una imagen bonita, sino comprobar si un detalle aparecía solo en un fotograma o se repetía también en vuelos diferentes.

Maran conservó intactos los registros originales. Después entregó una segunda copia al sistema de código abierto **Tapetum Sentinel**.

En la pantalla apareció el encabezado del proyecto:

> TAPETUM SENTINEL  
> DRONE / FIELD VIDEO INTELLIGENCE  
> SOURCE / https://github.com/human-centered-computing/tapetum-sentinel

La versión de campo mejoraba los fotogramas con poca luz mediante Retinex Tapetum, ejecutaba el modelo de tarea, seguía rastros a lo largo de los fotogramas, combinaba GPS, altitud, tiempo y datos de misión, vinculaba cada hallazgo a un índice de evidencia y obligaba a la capa local de preguntas y respuestas a responder únicamente a partir de registros a los que realmente tenía acceso. Para Maran, esta última característica era la más importante. El sistema no debía limitarse a decir **qué veía**; debía mostrar también **en qué fotograma, en qué ubicación y en qué procesamiento** se apoyaba para decirlo.

Elena añadió otra regla: la imagen mejorada nunca reemplazaría a la imagen original. Si un detalle solo aparecía después del procesamiento, debía marcarse por separado; el procesamiento de imagen no se consideraría equivalente a evidencia arqueológica.

Maran escribió la primera pregunta.

> **MARAN:** ¿Hay, con poca luz, algún patrón que el ojo humano pueda pasar por alto pero que se repita en el mismo lugar en vuelos diferentes?

Tapetum Sentinel respondió en pocos segundos.

> **TAPETUM SENTINEL:** Sí. Se detectaron límites lineales y curvos de bajo contraste que se repiten en siete zonas.  
> **EVIDENCIA:** Vuelven a aparecer en los mismos conjuntos de coordenadas en pasadas de vuelo independientes entre sí.  
> **INFERENCIA:** Puede existir una relación estructural más permanente que una simple diferencia de color o sombra en la superficie.  
> **INCERTIDUMBRE:** Alta. Estos registros por sí solos no constituyen prueba de muros, habitaciones o estructuras construidas por seres humanos bajo tierra.

Elena leyó la respuesta en voz alta y asintió.

«Así quiero que hable», dijo. «Si no sabe algo, que diga que no lo sabe.»

Maran hizo la segunda pregunta.

> **MARAN:** ¿Podrían estos límites estar distribuidos al azar?

> **TAPETUM SENTINEL:** Sí. Evaluados por separado, el azar, la erosión, la densidad de piedras, huellas de excavaciones antiguas o las condiciones de imagen están entre las posibles explicaciones. Sin embargo, que las mismas relaciones geométricas se repitan en diferentes ángulos de vuelo y momentos debilita las explicaciones basadas únicamente en la imagen. Se recomienda comparar con escaneo del subsuelo.

Esta respuesta cambió la dirección de la excavación. El equipo examinó las siete zonas señaladas por las imágenes del dron primero mediante mediciones geofísicas y después, en los sectores accesibles, con escáneres tridimensionales. Los nuevos escaneos mostraron bajo tierra secuencias de muros entrelazados, pequeñas habitaciones, pasillos estrechos y corredores curvos que no llevaban a ninguna parte. A primera vista, podían ser espacios habitacionales ampliados en diferentes periodos, almacenes, salas rituales o pasadizos defensivos.

Los trabajadores comenzaron a llamarlos entre ellos «ciudades subterráneas». Elena volvió a objetar.

«No basta con tener muros para llamar ciudad a una estructura», dijo. «Necesitamos rastros que indiquen continuidad de vida.»

Se añadieron nuevos registros de campo al índice de evidencia de Tapetum Sentinel. Esta vez Maran formuló la pregunta de manera más estrecha.

> **MARAN:** ¿Hay en las siete zonas rastros comunes y densos que indiquen ocupación continua?

> **TAPETUM SENTINEL:** Los registros disponibles no lo apoyan. En algunas zonas hay rastros compatibles con uso humano; sin embargo, en toda la red no aparece una distribución densa y coherente de hogares, recipientes, lugares de descanso, fosas de residuos u otros indicadores de asentamiento continuo.  
> **RESULTADO:** La explicación de «ciudad subterránea» es una opción posible; con la evidencia actual no es una conclusión obligatoria.

Priya dijo que los planos no eran suficientes. Las personas estaban acostumbradas a ver las estructuras desde arriba, pero la altura y el grosor de los muros, las hendiduras de las superficies, los corredores ciegos y el ángulo con el muro opuesto también podían formar parte del orden. Por ello, todas las superficies accesibles fueron escaneadas tridimensionalmente con precisión milimétrica. Las caras delanteras y traseras de las piedras, las grietas, los huecos cerrados y las mamposterías posiblemente añadidas después se registraron en capas separadas.

Kawa pidió que junto a cada conjunto de datos también se conservara el nombre local. Un lugar que en el ordenador aparecía como SECTOR-4 podía ser conocido por los aldeanos con el nombre de un sendero olvidado, un manantial seco o un antiguo lamento.

«No borren la memoria cuando simplifiquen el mapa», dijo. «Tal vez lo que ustedes llaman ruido sea la dirección de la estructura.»

Cuando Maran abrió el modelo tridimensional, al principio no vio nada más que millones de superficies, límites de piedras y vacíos. Después intentó representar la arquitectura no como un edificio, sino como un sistema de conexiones. Marcó cada habitación e intersección como nodo, el paso entre dos nodos como conexión y los cuellos estrechos accesibles solo a través de ciertas rutas como puertas. Este grafo también se añadió a la capa de evidencia de Tapetum Sentinel, pero se pidió expresamente al sistema que no saltara a conclusiones.

Maran preguntó:

> **MARAN:** Compara estas estructuras sin asumir que son siete asentamientos separados. ¿Existe un patrón de conexión recurrente?

> **TAPETUM SENTINEL:** Sí. Cada una de las siete zonas forma por sí sola un grafo incompleto. El número de conexiones de algunos corredores ciegos en una zona coincide con pasajes abiertos en otras. Algunos patrones de nodos muestran comportamientos complementarios en regiones geográficas diferentes.  
> **INFERENCIA:** Si las zonas se modelan no como estructuras independientes, sino como subredes de una topología mayor, quedan menos residuos sin explicación.  
> **ADVERTENCIA:** La compatibilidad matemática no constituye prueba de una finalidad constructiva común ni de un mismo periodo histórico.

Kenji se acercó a la pantalla.

«Pregunta otra vez», dijo. «Pero pregunta si es un ordenador.»

Maran escribió:

> **MARAN:** ¿Es esto un ordenador antiguo?

La respuesta llegó de inmediato.

> **TAPETUM SENTINEL:** No hay evidencia que apoye esa conclusión. No se han identificado componentes electrónicos, redes conductoras, elementos de conmutación, registros de cálculo ni mecanismos físicos que demuestren que las piedras procesaban información.  
> **FORMULACIÓN MÁS PRECISA:** El grafo de conexiones de la estructura puede compararse con algunas topologías de redes modernas. La semejanza no implica equivalencia funcional.

Kenji sonrió.

«Ahora sí podemos hablar.»

Maran calculó medidas de centralidad de los nodos. Como esperaba, no apareció un único nodo principal. A medida que cambiaban el punto de partida, la métrica utilizada y la ruta seguida, también cambiaba el «centro». Algunos pasos se volvían críticos en un cálculo y poco importantes en otro.

Esta vez fue Kawa quien preguntó.

> **KAWA:** ¿Dónde está el centro?

Tapetum Sentinel colocó varias mediciones una al lado de la otra.

> **TAPETUM SENTINEL:** No puede determinarse un centro fijo. El centro cambia según la relación que se mida.  
> **HALLAZGO ADICIONAL:** Cuando las siete subredes se evalúan conjuntamente, un modelo de nodo que no ha sido verificado físicamente en ninguna excavación conocida mejora de manera significativa la explicación.  
> **ESTADO:** NODO FALTANTE / NO ENCONTRADO FÍSICAMENTE.

Maran miró el mapa. El nodo faltante no era directamente la coordenada de una habitación. Era más bien un punto relacional que el conjunto de caminos parecía necesitar cuando se consideraban todos a la vez. El modelo funcionaba sin colocarlo; sin embargo, aumentaban los desvíos innecesarios y se debilitaba la complementariedad entre las siete zonas.

Aroha rompió el silencio.

«Tal vez el error fue considerarlas estructuras separadas», dijo. «Si colocas los órganos de un cuerpo en habitaciones distintas, podrías pensar que cada habitación es un ser vivo diferente.»

Maran pensó en el entrelazamiento. Antes de que pudiera hacer la pregunta, Kenji lo miró.

«Escríbela de todos modos», dijo. «Que el sistema también la deje registrada.»

> **MARAN:** ¿Podría este resultado ser entrelazamiento cuántico?

> **TAPETUM SENTINEL:** No. Los datos actuales no son evidencia de entrelazamiento cuántico físico. No se ha medido ninguna correlación de estados cuánticos entre las estructuras.  
> **SEMEJANZA NARRATIVA:** El hecho de que partes distantes formen un conjunto más significativo cuando se consideran juntas puede utilizarse como una analogía que recuerda al entrelazamiento. Una analogía no es evidencia física.

Elena guardó esa línea como una nota separada.

«Que esta frase permanezca en el margen del libro», dijo. «La analogía es una puerta; no una prueba.»

Maran escribió una última pregunta.

> **MARAN:** ¿Cuál es el hallazgo más fuerte hasta ahora?

Esta vez Tapetum Sentinel esperó durante mucho tiempo. Después dio una sola respuesta.

> **TAPETUM SENTINEL:** El hallazgo más fuerte no es una sola piedra, habitación o imagen. Es que capas de evidencia independientes señalan de maneras diferentes la misma relación: límites repetidos en las imágenes del dron, transiciones en los escaneos subterráneos, geometría tridimensional de las superficies y nodos complementarios en el grafo de conexiones.  
> **LÍMITE:** Esta relación por sí sola no permite establecer el propósito de la estructura, la identidad de quienes la construyeron ni su sistema de creencias.

Kawa observó durante mucho tiempo las siete subredes de la pantalla y el espacio entre ellas.

«Siete caminos», dijo finalmente. «¿Entienden ahora por qué la historia hablaba de caminos?»

Maran no cerró la ventana de preguntas y respuestas. El sistema esperaba una nueva pregunta del usuario. Mientras el cursor parpadeaba en la línea vacía, a Maran se le ocurrió otra frase:

> **PREGUNTA:** ¿Qué conecta esta red?

No la escribió.

Porque la respuesta a esa pregunta ya no estaba solo en las piedras.
