# Le Réseau de Pierre : Là où les pierres répondent

Lorsque l'équipe de fouille ne trouva aucun accès physique à la cavité souterraine, Maran proposa de relire la surface avant d'ouvrir davantage le sol. Les images diurnes des vols précédents avaient été utiles, mais les lignes très faibles entre les pierres disparaissaient à mesure que le soleil montait. Cette fois, la mission du drone aurait lieu juste après le coucher du soleil, pendant la courte période où la lumière naturelle diminuait rapidement.

Le plan de vol fut conçu de manière strictement reproductible. Le drone suivit les mêmes trajectoires à trois altitudes différentes ; à chaque passage, la caméra regardait une fois directement vers le sol et une fois selon un angle oblique. GPS, altitude, direction, heure et réglages de la caméra furent associés à chaque image. La même rangée de pierres fut enregistrée de nouveau sous différents angles. Le but n'était pas de produire une belle image, mais de vérifier si un détail n'apparaissait que sur une seule image ou s'il se répétait aussi lors de vols différents.

Maran conserva les enregistrements bruts sans les modifier. Il en remit ensuite une seconde copie au système open source **Tapetum Sentinel**.

L'en-tête du projet apparut à l'écran :

> TAPETUM SENTINEL  
> DRONE / FIELD VIDEO INTELLIGENCE  
> SOURCE / https://github.com/human-centered-computing/tapetum-sentinel

La version de terrain améliorait les images en basse lumière avec Retinex Tapetum, exécutait le modèle de mission, suivait les traces d'une image à l'autre, combinait GPS, altitude, temps et données de mission, reliait chaque résultat à un index de preuves et obligeait la couche locale de questions-réponses à répondre uniquement à partir des enregistrements auxquels elle avait réellement accès. Pour Maran, cette dernière capacité était la plus importante. Le système ne devait pas seulement dire **ce qu'il voyait**, mais aussi montrer **sur quelle image, à quel emplacement et à partir de quel traitement** il fondait cette affirmation.

Elena ajouta une règle : l'image améliorée ne remplacerait jamais l'image brute. Si un détail n'apparaissait qu'après amélioration, cela devait être signalé séparément ; le traitement d'image ne serait pas considéré comme équivalent à une preuve archéologique.

Maran écrivit la première question.

> **MARAN :** Existe-t-il en basse lumière un motif que l'œil humain pourrait manquer, mais qui se répète au même endroit lors de vols différents ?

Tapetum Sentinel répondit en quelques secondes.

> **TAPETUM SENTINEL :** Oui. Des limites linéaires et courbes à faible contraste se répètent dans sept zones.  
> **PREUVE :** Elles réapparaissent dans les mêmes groupes de coordonnées lors de passages de vol indépendants.  
> **INFÉRENCE :** Il peut exister une relation structurelle plus durable qu'une simple différence de couleur ou d'ombre à la surface.  
> **INCERTITUDE :** Élevée. Ces enregistrements ne constituent pas à eux seuls une preuve de murs, de pièces ou de structures souterraines construites par l'homme.

Elena lut la réponse à voix haute et hocha la tête.

« C'est comme ça que je veux qu'il parle », dit-elle. « S'il ne sait pas, qu'il dise qu'il ne sait pas. »

Maran posa une deuxième question.

> **MARAN :** Ces limites pourraient-elles être distribuées au hasard ?

> **TAPETUM SENTINEL :** Oui. Évaluées séparément, le hasard, l'érosion, la densité des pierres, les traces d'anciennes fouilles ou les conditions d'image font partie des explications possibles. Toutefois, la répétition des mêmes relations géométriques sous différents angles de vol et à différents moments affaiblit les explications purement liées à l'image. Une comparaison avec des scans du sous-sol est recommandée.

Cette réponse changea l'orientation de la fouille. L'équipe examina les sept zones indiquées par les images du drone, d'abord avec des mesures géophysiques, puis avec des scanners tridimensionnels dans les parties accessibles. Les nouveaux scans révélèrent sous terre des séries de murs imbriqués, de petites pièces, des couloirs étroits et des passages courbes qui ne menaient nulle part. À première vue, il pouvait s'agir de zones d'habitation agrandies à différentes périodes, de dépôts, de salles rituelles ou de passages défensifs.

Les ouvriers de la fouille commencèrent à les appeler entre eux « villes souterraines ». Elena protesta de nouveau.

« Des murs ne suffisent pas pour appeler une structure une ville », dit-elle. « Il faut des traces montrant la continuité de la vie. »

De nouveaux relevés de terrain furent ajoutés à l'index de preuves de Tapetum Sentinel. Cette fois, Maran formula la question de manière plus précise.

> **MARAN :** Existe-t-il dans les sept zones des traces communes et denses indiquant une occupation continue ?

> **TAPETUM SENTINEL :** Les données disponibles ne le confirment pas. Certaines zones contiennent des traces compatibles avec un usage humain ; toutefois, l'ensemble du réseau ne présente pas de distribution dense et cohérente de foyers, récipients, couchages, fosses à déchets ou autres indicateurs d'un établissement permanent.  
> **CONCLUSION :** L'explication de « ville souterraine » est une possibilité ; elle n'est pas une conclusion nécessaire au vu des preuves actuelles.

Priya expliqua que les plans ne suffisaient pas. Les gens avaient l'habitude de voir les structures d'en haut ; pourtant la hauteur et l'épaisseur des murs, les creux des surfaces, les passages aveugles et l'angle formé avec le mur opposé pouvaient aussi faire partie de l'organisation. Toutes les surfaces accessibles furent donc scannées en trois dimensions avec une précision millimétrique. Les faces avant et arrière des pierres, les fissures, les cavités bouchées et les maçonneries éventuellement ajoutées plus tard furent enregistrées dans des couches distinctes.

Kawa demanda que le nom local soit conservé avec chaque jeu de données. Un endroit affiché sur l'ordinateur comme SECTEUR-4 pouvait être connu par les villageois sous le nom d'un ancien sentier, d'une source asséchée ou d'une vieille complainte.

« N'effacez pas la mémoire en simplifiant la carte », dit-il. « Peut-être que ce que vous appelez du bruit est l'adresse de la structure. »

Lorsque Maran ouvrit le modèle tridimensionnel, il ne vit d'abord que des millions de surfaces, de limites de pierres et de vides. Puis il essaya de représenter l'architecture non comme un bâtiment, mais comme un système de connexions. Chaque pièce et intersection devint un nœud, chaque passage entre deux nœuds une connexion, et les goulots étroits accessibles seulement par certaines routes furent marqués comme des portes. Ce graphe fut lui aussi ajouté à la couche de preuves de Tapetum Sentinel, mais le système reçut l'instruction explicite de ne pas sauter aux conclusions.

Maran demanda :

> **MARAN :** Compare ces structures sans supposer qu'il s'agit de sept établissements distincts. Existe-t-il un schéma de connexion récurrent ?

> **TAPETUM SENTINEL :** Oui. Chacune des sept zones constitue à elle seule un graphe incomplet. Le nombre de connexions de certains passages aveugles d'une zone correspond à des passages ouverts dans d'autres. Certains motifs de nœuds se comportent de manière complémentaire dans différentes régions géographiques.  
> **INFÉRENCE :** Si les zones sont modélisées non comme des structures indépendantes mais comme des sous-réseaux d'une topologie plus vaste, il reste moins de résidus inexpliqués.  
> **AVERTISSEMENT :** Une cohérence mathématique ne prouve ni un objectif de construction commun ni une même période historique.

Kenji se pencha vers l'écran.

« Redemande », dit-il. « Mais demande si c'est un ordinateur. »

Maran écrivit :

> **MARAN :** Est-ce un ordinateur antique ?

La réponse arriva immédiatement.

> **TAPETUM SENTINEL :** Aucune preuve ne soutient cette conclusion. Aucun composant électronique, réseau conducteur, élément de commutation, trace de calcul ou mécanisme physique montrant que les pierres traitaient de l'information n'a été identifié.  
> **FORMULATION PLUS ÉTROITE :** Le graphe de connexions de la structure peut être comparé à certaines topologies de réseaux modernes. La ressemblance n'implique pas l'équivalence fonctionnelle.

Kenji sourit.

« Maintenant, nous pouvons en parler. »

Maran calcula les mesures de centralité des nœuds. Comme il s'y attendait, aucun nœud principal unique n'apparut. Selon le point de départ, la métrique utilisée et l'itinéraire suivi, le « centre » se déplaçait. Certains passages devenaient critiques dans un calcul et insignifiants dans un autre.

Cette fois, Kawa posa la question.

> **KAWA :** Où est le centre ?

Tapetum Sentinel plaça plusieurs mesures côte à côte.

> **TAPETUM SENTINEL :** Aucun centre fixe ne peut être déterminé. Le centre se déplace selon la relation mesurée.  
> **RÉSULTAT SUPPLÉMENTAIRE :** Lorsque les sept sous-réseaux sont évalués ensemble, un modèle de nœud qui n'a été physiquement confirmé dans aucune fouille connue améliore nettement l'explication.  
> **ÉTAT :** NŒUD MANQUANT / NON TROUVÉ PHYSIQUEMENT.

Maran regarda la carte. Le nœud manquant n'était pas directement la coordonnée d'une pièce. Il ressemblait plutôt à un point de relation dont l'ensemble des chemins avait besoin lorsqu'ils étaient tous pris en compte. Le modèle fonctionnait sans lui ; mais les détours inutiles augmentaient et la complémentarité entre les sept zones diminuait.

Aroha rompit le silence.

« Peut-être que notre erreur était de les considérer comme des structures séparées », dit-elle. « Si tu places les organes d'un corps dans des pièces différentes, tu pourrais croire que chaque pièce est un organisme distinct. »

Maran pensa à l'intrication. Avant qu'il ne pose la question, Kenji le regarda.

« Écris-la quand même », dit-il. « Que le système l'enregistre aussi. »

> **MARAN :** Ce résultat pourrait-il être une intrication quantique ?

> **TAPETUM SENTINEL :** Non. Les données actuelles ne constituent pas une preuve d'intrication quantique physique. Aucune corrélation d'états quantiques n'a été mesurée entre les structures.  
> **RESSEMBLANCE NARRATIVE :** Le fait que des parties éloignées forment un ensemble plus significatif lorsqu'elles sont considérées ensemble peut servir d'analogie rappelant l'intrication. Une analogie n'est pas une preuve physique.

Elena sauvegarda cette ligne comme note distincte.

« Que cette phrase reste dans la marge du livre », dit-elle. « Une analogie est une porte ; pas une preuve. »

Maran écrivit une dernière question.

> **MARAN :** Quel est le résultat le plus solide jusqu'à présent ?

Cette fois, Tapetum Sentinel attendit longtemps. Puis il donna une seule réponse.

> **TAPETUM SENTINEL :** Le résultat le plus solide n'est ni une pierre, ni une pièce, ni une image isolée. C'est le fait que des couches de preuves indépendantes indiquent la même relation de différentes manières : limites récurrentes dans les images de drone, transitions dans les scans souterrains, géométrie tridimensionnelle des surfaces et nœuds complémentaires dans le graphe de connexions.  
> **LIMITE :** Cette relation ne permet pas à elle seule de conclure à la fonction de la structure, à l'identité de ses constructeurs ou à leur système de croyance.

Kawa observa longtemps les sept sous-réseaux à l'écran et l'espace entre eux.

« Sept chemins », dit-il enfin. « Vous comprenez maintenant pourquoi le récit parlait de chemins ? »

Maran ne ferma pas la fenêtre de questions-réponses. Le système attendait une nouvelle question de l'utilisateur. Tandis que le curseur clignotait sur la ligne vide, une autre phrase vint à l'esprit de Maran :

> **QUESTION :** Que relie ce réseau ?

Il ne l'écrivit pas.

Parce que la réponse à cette question ne se trouvait désormais plus seulement dans les pierres.
