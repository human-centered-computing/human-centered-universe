# A Rede de Pedra: Onde as pedras respondem

Quando a equipe de escavação não conseguiu encontrar uma entrada física para o vazio subterrâneo, Maran propôs reler a superfície antes de abrir mais terreno. As imagens diurnas dos voos anteriores haviam sido úteis, mas as linhas muito fracas entre as pedras desapareciam à medida que o sol subia. Desta vez, a missão do drone seria realizada logo após o pôr do sol, no curto intervalo em que a luz natural diminuía rapidamente.

O plano de voo foi preparado de forma especialmente repetível. O drone percorreu as mesmas rotas em três altitudes diferentes; em cada passagem, a câmera olhou uma vez diretamente para baixo e outra em ângulo oblíquo. GPS, altitude, direção, horário e configurações da câmera foram vinculados a cada quadro. A mesma fileira de pedras foi registrada novamente de diferentes ângulos. O objetivo não era obter uma imagem bonita, mas testar se um detalhe aparecia apenas em um quadro ou se também se repetia em voos diferentes.

Maran preservou os registros brutos sem modificá-los. Depois entregou uma segunda cópia ao sistema de código aberto **Tapetum Sentinel**.

O título do projeto apareceu na tela:

> TAPETUM SENTINEL  
> DRONE / FIELD VIDEO INTELLIGENCE  
> SOURCE / https://github.com/human-centered-computing/tapetum-sentinel

A versão de campo melhorava quadros com pouca luz usando Retinex Tapetum, executava o modelo de missão, acompanhava rastros ao longo dos quadros, combinava GPS, altitude, tempo e dados de missão, vinculava cada descoberta a um índice de evidências e fazia com que a camada local de perguntas e respostas respondesse apenas com base nos registros aos quais realmente tinha acesso. Para Maran, essa última característica era a mais importante. O sistema não deveria apenas dizer **o que viu**, mas também mostrar **em qual quadro, localização e processamento** aquela afirmação se apoiava.

Elena acrescentou outra regra: a imagem aprimorada nunca substituiria a imagem bruta. Se um detalhe aparecesse somente após o aprimoramento, isso seria marcado separadamente; processamento de imagem não seria considerado equivalente a evidência arqueológica.

Maran escreveu a primeira pergunta.

> **MARAN:** Em baixa iluminação existe algum padrão que o olho humano possa deixar passar, mas que se repita no mesmo lugar em voos diferentes?

Tapetum Sentinel respondeu em poucos segundos.

> **TAPETUM SENTINEL:** Sim. Foram detectados limites lineares e curvos de baixo contraste que se repetem em sete áreas.  
> **EVIDÊNCIA:** Eles reaparecem nos mesmos conjuntos de coordenadas em passagens de voo independentes.  
> **INFERÊNCIA:** Pode existir uma relação estrutural mais permanente do que uma simples diferença de cor ou sombra na superfície.  
> **INCERTEZA:** Alta. Esses registros, sozinhos, não constituem prova de paredes, salas ou estruturas subterrâneas construídas por seres humanos.

Elena leu a resposta em voz alta e assentiu.

“É assim que eu quero que fale”, disse. “Se não souber, que diga que não sabe.”

Maran fez a segunda pergunta.

> **MARAN:** Esses limites podem estar distribuídos aleatoriamente?

> **TAPETUM SENTINEL:** Sim. Quando avaliados individualmente, acaso, erosão, densidade das pedras, marcas de escavações antigas ou condições da imagem estão entre as explicações possíveis. No entanto, a repetição das mesmas relações geométricas em diferentes ângulos de voo e horários enfraquece explicações baseadas apenas na imagem. Recomenda-se comparação com varredura do subsolo.

Essa resposta mudou a direção da escavação. A equipe examinou as sete áreas indicadas pelas imagens do drone primeiro por medições geofísicas e depois, nas partes acessíveis, por scanners tridimensionais. As novas varreduras mostraram sob a terra sequências de paredes interligadas, pequenas salas, corredores estreitos e passagens curvas que não levavam a lugar algum. À primeira vista, poderiam ser áreas de moradia expandidas em épocas diferentes, depósitos, espaços rituais ou passagens defensivas.

Os trabalhadores começaram a chamá-las entre si de “cidades subterrâneas”. Elena voltou a discordar.

“Paredes não bastam para chamar uma estrutura de cidade”, disse. “Precisamos de vestígios que mostrem continuidade da vida.”

Novos registros de campo foram acrescentados ao índice de evidências do Tapetum Sentinel. Desta vez, Maran formulou a pergunta de modo mais restrito.

> **MARAN:** Há nas sete áreas vestígios comuns e densos que indiquem ocupação contínua?

> **TAPETUM SENTINEL:** Os registros atuais não sustentam isso. Em algumas áreas existem vestígios compatíveis com uso humano; porém, em toda a rede não aparece uma distribuição densa e consistente de fogueiras, recipientes, locais de descanso, fossas de resíduos ou outros indicadores de assentamento contínuo.  
> **RESULTADO:** A explicação de “cidade subterrânea” é uma possibilidade; com a evidência atual não é uma conclusão obrigatória.

Priya disse que as plantas não eram suficientes. As pessoas estavam acostumadas a ver estruturas de cima, mas altura e espessura das paredes, reentrâncias nas superfícies, passagens cegas e o ângulo com a parede oposta também podiam fazer parte da organização. Por isso todas as superfícies acessíveis foram escaneadas em três dimensões com precisão milimétrica. As faces frontal e posterior das pedras, rachaduras, vazios fechados e alvenarias possivelmente acrescentadas depois foram registradas em camadas separadas.

Kawa pediu que o nome local também fosse preservado junto de cada conjunto de dados. Um lugar que aparecia no computador como SETOR-4 podia ser conhecido entre os moradores pelo nome de uma trilha esquecida, de uma nascente seca ou de um antigo lamento.

“Não apaguem a memória ao simplificar o mapa”, disse. “Talvez aquilo que vocês chamam de ruído seja o endereço da estrutura.”

Quando Maran abriu o modelo tridimensional, a princípio não viu nada além de milhões de superfícies, limites de pedras e vazios. Depois tentou representar a arquitetura não como um edifício, mas como um sistema de conexões. Marcou cada sala e interseção como nó, a passagem entre dois nós como conexão e os gargalos estreitos acessíveis apenas por determinadas rotas como portas. Esse grafo também foi acrescentado à camada de evidências do Tapetum Sentinel, mas o sistema recebeu instrução explícita para não saltar para conclusões.

Maran perguntou:

> **MARAN:** Compare essas estruturas sem presumir que sejam sete assentamentos separados. Existe um padrão recorrente de conexão?

> **TAPETUM SENTINEL:** Sim. Cada uma das sete áreas, isoladamente, forma um grafo incompleto. O número de conexões de algumas passagens cegas em uma área corresponde a passagens abertas em outras. Alguns padrões de nós apresentam comportamento complementar em regiões geográficas diferentes.  
> **INFERÊNCIA:** Se as áreas forem modeladas não como estruturas independentes, mas como sub-redes de uma topologia maior, restam menos resíduos sem explicação.  
> **AVISO:** Compatibilidade matemática não constitui prova de um objetivo de construção comum nem de um mesmo período histórico.

Kenji se aproximou da tela.

“Pergunte de novo”, disse. “Mas pergunte se é um computador.”

Maran escreveu:

> **MARAN:** Isto é um computador antigo?

A resposta veio imediatamente.

> **TAPETUM SENTINEL:** Não há evidência que sustente essa conclusão. Não foram identificados componentes eletrônicos, redes condutoras, elementos de comutação, registros de cálculo ou mecanismos físicos que mostrem que as pedras processavam informação.  
> **FORMULAÇÃO MAIS RESTRITA:** O grafo de conexões da estrutura pode ser comparado a algumas topologias de redes modernas. Semelhança não significa equivalência funcional.

Kenji sorriu.

“Agora podemos conversar.”

Maran calculou medidas de centralidade dos nós. Como esperava, não apareceu um único nó principal. À medida que mudavam o ponto de partida, a métrica usada e a rota seguida, o “centro” também mudava. Algumas passagens se tornavam críticas em um cálculo e pouco importantes em outro.

Desta vez, Kawa fez a pergunta.

> **KAWA:** Onde está o centro?

Tapetum Sentinel colocou várias medições lado a lado.

> **TAPETUM SENTINEL:** Não é possível determinar um centro fixo. O centro muda conforme a relação que está sendo medida.  
> **DESCOBERTA ADICIONAL:** Quando as sete sub-redes são avaliadas em conjunto, um modelo de nó que não foi fisicamente confirmado em nenhuma das escavações atuais melhora significativamente a explicação.  
> **STATUS:** NÓ AUSENTE / NÃO ENCONTRADO FISICAMENTE.

Maran olhou para o mapa. O nó ausente não era diretamente a coordenada de uma sala. Era mais como um ponto relacional de que o conjunto dos caminhos parecia precisar quando todos eram considerados. O modelo funcionava sem ele; porém, aumentavam os desvios desnecessários e a complementaridade entre as sete áreas diminuía.

Aroha quebrou o silêncio.

“Talvez o erro tenha sido tratá-las como estruturas separadas”, disse. “Se você colocar os órgãos de um corpo em salas diferentes, pode achar que cada sala é um ser vivo diferente.”

Maran pensou em entrelaçamento. Antes que ele fizesse a pergunta, Kenji olhou para ele.

“Escreva mesmo assim”, disse. “Que o sistema registre também.”

> **MARAN:** Esse resultado poderia ser entrelaçamento quântico?

> **TAPETUM SENTINEL:** Não. Os dados atuais não são evidência de entrelaçamento quântico físico. Nenhuma correlação de estados quânticos foi medida entre as estruturas.  
> **SEMELHANÇA NARRATIVA:** O fato de partes distantes formarem um todo mais significativo quando consideradas em conjunto pode ser usado como analogia que lembra o entrelaçamento. Uma analogia não é evidência física.

Elena salvou essa linha como uma nota separada.

“Que esta frase fique na margem do livro”, disse. “A analogia é uma porta; não uma prova.”

Maran escreveu uma última pergunta.

> **MARAN:** Qual é a descoberta mais forte até agora?

Desta vez, Tapetum Sentinel esperou por um longo período. Depois deu uma única resposta.

> **TAPETUM SENTINEL:** A descoberta mais forte não é uma pedra, uma sala ou uma imagem isolada. É o fato de camadas independentes de evidência apontarem de maneiras diferentes para a mesma relação: limites recorrentes nas imagens do drone, transições nas varreduras subterrâneas, geometria tridimensional das superfícies e nós complementares no grafo de conexões.  
> **LIMITE:** Essa relação, sozinha, não permite determinar o propósito da estrutura, a identidade de seus construtores ou seu sistema de crenças.

Kawa observou por muito tempo as sete sub-redes na tela e o espaço entre elas.

“Sete caminhos”, disse por fim. “Agora entendem por que a história dizia caminhos?”

Maran não fechou a janela de perguntas e respostas. O sistema esperava uma nova pergunta do usuário. Enquanto o cursor piscava na linha vazia, outra frase surgiu na mente de Maran:

> **PERGUNTA:** O que esta rede conecta?

Ele não a escreveu.

Porque a resposta para essa pergunta já não estava apenas nas pedras.
