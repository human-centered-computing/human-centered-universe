# La Rete di Pietra: Dove le pietre rispondono

Quando la squadra di scavo non riuscì a trovare un ingresso fisico alla cavità sotterranea, Maran propose di rileggere la superficie prima di aprire altro terreno. Le immagini diurne dei voli precedenti erano state utili, ma le linee molto deboli tra le pietre scomparivano man mano che il sole saliva. Questa volta la missione del drone sarebbe stata eseguita subito dopo il tramonto, nel breve intervallo in cui la luce naturale diminuiva rapidamente.

Il piano di volo fu preparato in modo particolarmente ripetibile. Il drone percorse le stesse rotte a tre diverse altitudini; a ogni passaggio la camera guardava una volta direttamente verso il basso e una volta con un angolo obliquo. GPS, altitudine, direzione, ora e impostazioni della camera furono associati a ogni fotogramma. La stessa fila di pietre venne ripresa nuovamente da angoli diversi. L'obiettivo non era ottenere una bella immagine, ma verificare se un dettaglio compariva soltanto in un singolo fotogramma oppure si ripeteva anche in voli differenti.

Maran conservò le registrazioni grezze senza modificarle. Poi consegnò una seconda copia al sistema open source **Tapetum Sentinel**.

Sul display apparve l'intestazione del progetto:

> TAPETUM SENTINEL  
> DRONE / FIELD VIDEO INTELLIGENCE  
> SOURCE / https://github.com/human-centered-computing/tapetum-sentinel

La versione da campo migliorava i fotogrammi in scarsa illuminazione con Retinex Tapetum, eseguiva il modello di missione, seguiva le tracce attraverso i fotogrammi, combinava GPS, altitudine, tempo e dati della missione, collegava ogni risultato a un indice delle prove e obbligava il livello locale di domande e risposte a rispondere solo sulla base dei registri a cui aveva realmente accesso. Per Maran, l'ultima caratteristica era la più importante. Il sistema non doveva soltanto dire **che cosa vedeva**, ma anche mostrare **su quale fotogramma, posizione e processo** si basava per affermarlo.

Elena aggiunse un'altra regola: l'immagine migliorata non avrebbe mai sostituito l'immagine grezza. Se un dettaglio diventava visibile soltanto dopo l'elaborazione, questo doveva essere indicato separatamente; l'elaborazione delle immagini non sarebbe stata considerata equivalente a una prova archeologica.

Maran scrisse la prima domanda.

> **MARAN:** In condizioni di scarsa illuminazione esiste un motivo che l'occhio umano potrebbe non vedere, ma che ricorre nello stesso luogo in voli differenti?

Tapetum Sentinel rispose in pochi secondi.

> **TAPETUM SENTINEL:** Sì. In sette aree sono stati rilevati limiti lineari e curvi a basso contrasto che si ripetono.  
> **PROVA:** Ricompaiono negli stessi gruppi di coordinate durante passaggi di volo indipendenti.  
> **INFERENZA:** Potrebbe esistere una relazione strutturale più stabile di una semplice differenza di colore o ombra sulla superficie.  
> **INCERTEZZA:** Alta. Queste registrazioni da sole non sono prova di muri, stanze o strutture sotterranee costruite dall'uomo.

Elena lesse la risposta ad alta voce e annuì.

«Voglio che parli così», disse. «Se non sa, deve dire che non sa.»

Maran pose una seconda domanda.

> **MARAN:** Questi limiti potrebbero essere distribuiti casualmente?

> **TAPETUM SENTINEL:** Sì. Considerati singolarmente, casualità, erosione, densità delle pietre, tracce di vecchi scavi o condizioni di ripresa sono tra le possibili spiegazioni. Tuttavia, il ripetersi delle stesse relazioni geometriche con angoli di volo e in momenti diversi indebolisce le spiegazioni dovute soltanto all'immagine. Si consiglia un confronto con scansioni del sottosuolo.

Questa risposta cambiò la direzione dello scavo. La squadra esaminò le sette aree indicate dalle immagini del drone prima con misurazioni geofisiche, poi con scanner tridimensionali nelle parti accessibili. Le nuove scansioni mostrarono sotto terra sequenze di muri interconnesse, piccole stanze, corridoi stretti e passaggi curvi che non portavano da nessuna parte. A prima vista potevano essere aree abitative ampliate in epoche differenti, depositi, sale rituali o passaggi difensivi.

Gli operai iniziarono a chiamarle tra loro «città sotterranee». Elena protestò di nuovo.

«I muri non bastano per chiamare città una struttura», disse. «Servono tracce che dimostrino continuità della vita.»

Nuovi dati di campo furono aggiunti all'indice delle prove di Tapetum Sentinel. Questa volta Maran pose una domanda più specifica.

> **MARAN:** Nelle sette aree ci sono tracce comuni e dense che indichino un'occupazione continua?

> **TAPETUM SENTINEL:** I dati disponibili non lo supportano. In alcune aree ci sono tracce compatibili con l'uso umano; tuttavia, nell'intera rete non compare una distribuzione densa e coerente di focolari, recipienti, giacigli, fosse di rifiuti o altri indicatori di insediamento continuo.  
> **RISULTATO:** L'ipotesi di «città sotterranea» è una possibilità; con le prove attuali non è una conclusione necessaria.

Priya disse che le planimetrie non bastavano. Le persone erano abituate a vedere le strutture dall'alto, ma anche l'altezza e lo spessore dei muri, le rientranze delle superfici, i passaggi ciechi e l'angolo con il muro opposto potevano far parte dell'ordine. Tutte le superfici accessibili furono quindi scansionate tridimensionalmente con precisione millimetrica. Le facce anteriori e posteriori delle pietre, le crepe, i vuoti chiusi e le murature forse aggiunte in seguito furono registrate in livelli separati.

Kawa chiese che accanto a ogni insieme di dati fosse conservato anche il nome locale. Un luogo che sul computer appariva come SETTORE-4 poteva essere conosciuto dagli abitanti con il nome di un sentiero dimenticato, di una sorgente prosciugata o di un antico lamento.

«Non cancellate la memoria quando semplificate la mappa», disse. «Forse ciò che chiamate rumore è l'indirizzo della struttura.»

Quando Maran aprì il modello tridimensionale, all'inizio vide soltanto milioni di superfici, limiti delle pietre e vuoti. Poi provò a rappresentare l'architettura non come un edificio, ma come un sistema di connessioni. Segnò ogni stanza e intersezione come nodo, il passaggio tra due nodi come collegamento e gli stretti colli di bottiglia accessibili solo da determinate rotte come porte. Anche questo grafo fu aggiunto al livello delle prove di Tapetum Sentinel, ma al sistema fu chiesto esplicitamente di non saltare alle conclusioni.

Maran chiese:

> **MARAN:** Confronta queste strutture senza presumere che siano sette insediamenti separati. C'è uno schema di connessione ricorrente?

> **TAPETUM SENTINEL:** Sì. Ognuna delle sette aree forma da sola un grafo incompleto. Il numero di collegamenti di alcuni passaggi ciechi in un'area corrisponde a passaggi aperti in altre. Alcuni schemi di nodi mostrano comportamenti complementari in regioni geografiche diverse.  
> **INFERENZA:** Se le aree vengono modellate non come strutture indipendenti, ma come sottoreti di una topologia più ampia, rimangono meno residui inspiegati.  
> **AVVISO:** La compatibilità matematica non costituisce prova di uno scopo costruttivo comune né dello stesso periodo storico.

Kenji si avvicinò allo schermo.

«Chiedi ancora», disse. «Ma chiedi se è un computer.»

Maran scrisse:

> **MARAN:** È un computer antico?

La risposta arrivò subito.

> **TAPETUM SENTINEL:** Non esistono prove che sostengano questa conclusione. Non sono stati rilevati componenti elettronici, reti conduttive, elementi di commutazione, registrazioni di calcolo o meccanismi fisici che dimostrino che le pietre elaboravano informazioni.  
> **FORMULAZIONE PIÙ PRECISA:** Il grafo delle connessioni della struttura può essere confrontato con alcune topologie di rete moderne. La somiglianza non significa equivalenza funzionale.

Kenji sorrise.

«Adesso possiamo parlarne.»

Maran calcolò le misure di centralità dei nodi. Come si aspettava, non emerse un unico nodo principale. Cambiando il punto di partenza, la metrica usata e il percorso seguito, cambiava anche il «centro». Alcuni passaggi diventavano critici in un calcolo e insignificanti in un altro.

Questa volta fu Kawa a porre la domanda.

> **KAWA:** Dov'è il centro?

Tapetum Sentinel affiancò diverse misurazioni.

> **TAPETUM SENTINEL:** Non è possibile determinare un centro fisso. Il centro cambia in base alla relazione che viene misurata.  
> **RISULTATO AGGIUNTIVO:** Quando le sette sottoreti vengono considerate insieme, un modello di nodo che non è stato fisicamente verificato in nessuno degli scavi conosciuti migliora significativamente la spiegazione.  
> **STATO:** NODO MANCANTE / NON TROVATO FISICAMENTE.

Maran guardò la mappa. Il nodo mancante non corrispondeva direttamente alle coordinate di una stanza. Era piuttosto un punto relazionale che l'insieme dei percorsi sembrava richiedere quando venivano considerati tutti insieme. Il modello funzionava anche senza inserirlo; ma aumentavano le deviazioni inutili e diminuiva la complementarità tra le sette aree.

Aroha ruppe il silenzio.

«Forse l'errore è stato considerarle strutture separate», disse. «Se metti gli organi di un corpo in stanze diverse, potresti pensare che ogni stanza sia un essere vivente distinto.»

Maran pensò all'entanglement. Prima ancora che potesse fare la domanda, Kenji lo guardò.

«Scrivila comunque», disse. «Che il sistema la registri.»

> **MARAN:** Questo risultato potrebbe essere entanglement quantistico?

> **TAPETUM SENTINEL:** No. I dati attuali non sono prova di entanglement quantistico fisico. Non è stata misurata alcuna correlazione di stati quantistici tra le strutture.  
> **SOMIGLIANZA NARRATIVA:** Il fatto che parti lontane, se considerate insieme, formino un insieme più significativo può essere usato come analogia che ricorda l'entanglement. Un'analogia non è una prova fisica.

Elena salvò quella riga come nota separata.

«Questa frase deve stare a margine del libro», disse. «L'analogia è una porta; non una prova.»

Maran scrisse un'ultima domanda.

> **MARAN:** Qual è il risultato più forte finora?

Questa volta Tapetum Sentinel rimase in attesa a lungo. Poi diede una sola risposta.

> **TAPETUM SENTINEL:** Il risultato più forte non è una singola pietra, una stanza o un'immagine. È il fatto che livelli di prova indipendenti indicano la stessa relazione in modi differenti: limiti ricorrenti nelle immagini del drone, transizioni nelle scansioni sotterranee, geometria tridimensionale delle superfici e nodi complementari nel grafo delle connessioni.  
> **LIMITE:** Questa relazione da sola non consente di stabilire lo scopo della struttura, l'identità dei suoi costruttori o il loro sistema di credenze.

Kawa osservò a lungo le sette sottoreti sullo schermo e lo spazio tra di esse.

«Sette strade», disse infine. «Ora capite perché il racconto parlava di strade?»

Maran non chiuse la finestra delle domande e risposte. Il sistema attendeva una nuova domanda dell'utente. Mentre il cursore lampeggiava sulla riga vuota, a Maran venne in mente un'altra frase:

> **DOMANDA:** Che cosa collega questa rete?

Non la scrisse.

Perché la risposta a quella domanda non era più soltanto nelle pietre.
