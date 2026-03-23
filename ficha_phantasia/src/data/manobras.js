export const manobras = [
  {
    tipo: "Armas Leves",
    nome: "Jab",
    descricao:
      "a criatura atacante dá uma estocada rápida na criatura oponente para distraí-la e criar uma abertura para ataque. Uma vez por turno a criatura atacante pode escolher errar um teste de ataque que tenha feito (esta decisão deve ser comunicada antes de saber se o ataque atingiu o oponente) para ignorar a penalidade de -3 por um ataque subsequente. Um terceiro ataque feito no mesmo turno ainda deve receber uma penalidade de -6 por multi ataque.",
  },
  {
    tipo: "Armas Leves",
    nome: "Entrelaçamento",
    descricao:
      "Esta manobra funciona apenas contra criaturas inimigas de tamanho igual ao da criatura atacante ou menor. Ao utilizar uma ação em um turno para preparar esta manobra a criatura atacante irá aguardar um golpe feito contra ela até o início de seu próximo turno. Caso seja alvo de um ataque de um inimigo contra o qual essa manobra pode ser usada, a criatura atacante pode adicionar um dado de maestria do ataque no teste de deflexão. Caso seja bem-sucedida em seu teste, a criatura atacante pode usar sua arma para entrelaçar a arma ou os membros do adversário entre a lâmina e a guarda, impedindo que a criatura alvejada realize novos ataques provindos de multi ataque durante a rodada atual. O efeito dessa manobra ativa-se no primeiro teste de deflexão realizado pela criatura que a anunciou. Mov. choque recebido por qualquer uma das criaturas quebra o entrelaçamento.",
  },
  {
    tipo: "Armas Leves",
    nome: "Golpe Preciso",
    descricao:
      "Esta manobra funciona apenas contra criaturas inimigas que estejam usando armaduras leves ou nenhuma armadura. Contra criaturas inimigas que estejam usando armaduras médias ou pesadas esta manobra funciona dependente do uso bem sucedido de uma Habilidade para encontrar um ponto de vulnerabilidade. Esta manobra também é dependente de a criatura oponente possuir uma anatomia que fisiologicamente possua pontos de vulnerabilidade expostos (elementais e geléias por exemplo são imunes a este efeito). A criatura atacante irá mirar em um músculo ou articulação sensível da criatura alvejada. Caso seja bem-sucedida em um teste de ataque no qual possua incremento ou caso a criatura alvejada tenha a condição surpresa, atordoamento, paralisia ou inconsciência, a criatura atacante pode adicionar 1d6 por nível da maestria usada no ataque (1d6/2d6/3d6/4d6) no teste de ataque e a criatura alvejada recebe (à escolha da criatura atacante): reduz em um passo suas velocidades de movimento até que cure qualquer quantidade de PFs OU dano de sangramento igual ao maior número do dado de maestria usado.",
  },
  {
    tipo: "Armas Leves",
    nome: "Distração e Castigo",
    descricao:
      "a criatura atacante faz um um movimento ou ruído repentino para distrair a criatura alvejada e criar uma abertura para ataque. Ao usar uma ação para atacar, a criatura atacante pode ao invés disso usar uma Habilidade em com confronto para mentir, distrair ou confundir a criatura alvejada. Um teste de ataque subsequente contra a mesma criatura alvejada adicionará um dado de maestria da Habilidade usada pela criatura atacante.",
  },
  {
    tipo: "Armas Leves",
    nome: "Cegar",
    descricao:
      "a criatura atacante golpeia a criatura alvejada na região dos olhos, sobrancelha ou supercílio para dificultar sua visão temporariamente. Após anunciar esta manobra a criatura atacante fará seu teste de ataque com empecilho. Caso o ataque seja bem-sucedido, a criatura alvejada recebe o dano normal do ataque e é considerada cega até usar uma ação para limpar seus olhos. Um acerto crítico com esta manobra cega o alvo até que ele cure qualquer quantidade de PFs, significando que o golpe acertou os olhos a criatura alvejada diretamente.",
  },
  {
    tipo: "Armas Leves",
    nome: "Desarmar",
    descricao:
      "Esta manobra funciona apenas contra criaturas que estejam empunhando sua arma com apenas uma mão e que sejam de tamanho igual ao da criatura atacante ou inferior. A criatura atacante golpeia a mão da arma da criatura alvejada para desarmá-la. A criatura atacante pode fazer um teste de ataque incremento contra a criatura alvejada, e caso seu resultado seja um acerto crítico, ao invés de causar dano a arma equipada pela criatura alvejada é arremessada 1d10 metros na direção que a criatura atacante escolher.",
  },
  {
    tipo: "Armas Leves",
    nome: "Corte Rápido",
    descricao:
      "a criatura atacante realiza um ataque e imediatamente dá um passo para trás para evitar um contra-ataque. A criatura atacante realiza seu teste de ataque normalmente contra a criatura alvejada, e caso acerte reduz o dano da arma pela metade (antes de aplicar quaisquer outras reduções). Sendo bem-sucedida, a criatura atacante pode usar seu mov. Evasão gratuitamente.",
  },
  {
    tipo: "Armas Leves",
    nome: "Manobras Evasivas",
    descricao:
      "a criatura atacante concentra-se em evasão, utilizando sua arma para desviar ataques. Ao utilizar essa manobra a criatura atacante abre mão de atacar com suas ações durante este turno. Ela ganha um bônus igual ao maior número do dado da maestria do ataque em testes de defesa até o início de seu próximo turno.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Golpes de Peso",
    descricao:
      "os golpes mais contundentes da criatura atacante são particularmente impactantes. Ao desferir um acerto crítico com a arma, a criatura atacante pode escolher entre aplicar mov. choque na criatura alvejada ou acrescentar esse valor ao dano.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Executar",
    descricao:
      "ao declarar um teste de ataque contra uma criatura que tenha a condição restrita, a criatura atacante pode abrir mão de qualquer novo ataque em seu turno para dobrar o maior valor dos dados de seu teste de ataque. Caso o golpe seja um acerto crítico, a criatura alvejada recebe um Trauma automaticamente.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Golpe Rasteiro",
    descricao:
      "esta manobra funciona apenas com criaturas alvejadas de tamanho igual ou maior que a criatura atacante. A criatura atacante golpeia as pernas ou tornozelos da criatura alvejada para desequilibrá-la. Após acertar seu teste de ataque, a criatura atacante pode escolher reduzir o dano do ataque pela metade (arredondado para cima) para derrubar o oponente.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Golpe por Cima",
    descricao:
      "uma criatura alvejada por essa manobra que falhe em seu teste de defesa não recebe mov. choque. A criatura atacante desce a arma com grande força para esmagar o crânio ou o ombro da criatura alvejada. Uma criatura alvejada que tenha categoria de tamanho menor ou que esteja em terreno mais baixo que a criatura atacante recebe empecilho no próximo teste de deflexão.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Martelar",
    descricao:
      "a criatura atacante golpeia a criatura alvejada repetidamente com a arma para cansá-la e controlar seu movimento. Ao anunciar esta manobra, a criatura atacante se compromete em usar todas as suas ações neste turno atacando. Cada vez que a criatura alvejada decidir defletir ao invés de evadir do ataque a criatura atacante ganha um bônus adicional de +1 no próximo teste de ataque (efetivamente diminuindo a penalidade por multi ataque para -2 e -4).",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Inércia",
    descricao:
      "a criatura atacante aproveita o peso da arma após errar um golpe para impulsionar um novo ataque. Após errar um ataque e usando duas ações para atacar, a criatura atacante pode realizar um segundo ataque ignorando a penalidade por multi ataque. Caso seja feito um terceiro ataque neste turno ele ainda recebe a penalidade normal de -6 por multi ataque e assim por diante",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Tornado",
    descricao:
      "a criatura atacante desfere um golpe amplo que atinge várias criaturas. A criatura atacante utiliza duas ações para desferir um ataque contra todas as criaturas em sua volta. A criatura atacante faz um teste de ataque normal e todas as criaturas dentro do alcance da arma devem defender-se dele.",
  },
  {
    tipo: "Armas Pesadas",
    nome: "Atordoar",
    descricao:
      "a criatura atacante golpeia a criatura alvejada na cabeça ou no rosto com o cabo ou lateral da lâmina da arma, desorientando-a. Após anunciar esta manobra, a criatura atacante realiza um teste de ataque normalmente, usando duas ações. Caso ela seja bem-sucedida, o dano deste ataque é reduzido pela metade (arredondado para baixo), seu tipo muda para impacto e a criatura alvejada recebe a condição atordoada até o final de seu próximo turno.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Estocada",
    descricao:
      "a criatura atacante estoca rapidamente a arma para frente para perfurar um oponente que entre em sua área de ameaça. A criatura recebe incremento em ataques contra criaturas que estejam em movimento para dentro de sua área de ameaça.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Pregagem",
    descricao:
      "alvejando as pernas da criatura alvejada, a criatura atacante tenta dificultar seu movimento. Essa manobra funciona apenas contra criaturas alvejadas que tenham o mesmo tamanho ou sejam maiores que a criatura atacante. Quando fizer um ataque fora de seu turno contra uma criatura, a criatura atacante pode escolher realizá-lo com empecilho. Caso o ataque seja bem-sucedido a criatura alvejada recebe uma penalidade em sua vel. corrida igual ao maior número do dado de maestria que a criatura atacante usou para atacar (em metros a menos na vel. corrida).",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Ancoragem",
    descricao:
      "a criatura atacante utiliza uma ação para se preparar e abre mão de qualquer outro ataque nesse turno. Esta manobra funciona apenas contra criaturas que tenham o mesmo tamanho ou sejam menores que a criatura atacante. A criatura atacante assume uma posição de defesa e pode adicionar um dado de maestria de uma Habilidade apropriada em testes de deflexão. Caso seja bem-sucedida em três testes de deflexão antes do seu próximo turno ela pode realizar um ataque livre contra qualquer criatura dentro de sua área de ameaça cujo ataque tenha defendido. O ataque livre usa a maestria da Habilidade que bonificou a deflexão, é feito com incremento, e caso seja um acerto crítico além do dano normal a criatura alvejada será derrubada no chão.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Floreio",
    descricao:
      "a criatura atacante realiza dois ataques rápidos contra a mesma criatura usando apenas uma ação. Ao anunciar esta manobra a criatura atacante reduz o dano de um ataque bem-sucedido pela metade para realizar um novo ataque contra o mesmo oponente, cujo dano também é reduzido pela metade (o dano reduzido de ambos os ataques é arredondado para baixo). Esse ataque livre não conta como multi ataque. Essa manobra pode ser usada apenas uma vez por turno e ambos os ataques geram apenas um mov. choque.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Finta Elegante",
    descricao:
      "Essa manubra deve ser anunciada sem custo porém durante o turno da criatura que a usar para ser ativada. Ao ser alvo de um ataque, a criatura atacante pode usar uma reação para adicionar sua maestria de uma Habilidade apropriada em um teste de evasão. Caso seja bem-sucedida nesse teste de evasão, ela pode realizar um ataque livre contra a criatura que a atacou usando a Habilidade escolhida.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Riposte",
    descricao:
      "usando uma ação, a criatura atacante pode concentrar-se em retribuir golpes de uma criatura alvejada. Sempre que defletir um ataque da criatura alvejada com sucesso até o início de seu próximo turno, a criatura atacante causa nela dano perfurante igual ao maior número de seu dado da maestria usada no ataque (6/8/10/12 pontos de dano perfurante).",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Vantagem de Altura",
    descricao:
      "a criatura atacante sabe utilizar sua vantagem por ocupar terreno elevado em relação a criaturas alvejadas. Se uma criatura alvejada estiver pelo menos um metro abaixo da criatura atacante mas ainda dentro de sua área de ameaça, a criatura atacante ganha incremento em seu teste de ataque.",
  },
  {
    tipo: "Armas Perfurantes",
    nome: "Carga",
    descricao:
      "a criatura atacante corre em direção à criatura alvejada com a arma empunhada. Essa manobra deve ser utilizada após pelo menos uma distância curta de movimento ininterrupto (sem que nenhuma outra ação seja executada no decorrer do movimento). A criatura usa uma Habilidade relacionada ao tipo de movimentação executada. Se a Habilidade usada também ultrapassar o valor do teste de defesa da criatura alvejada, a criatura atacante adiciona um dado de maestria de sua arma ao dano e duplica o mov. choque causado por esse ataque.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Varredura",
    descricao:
      "a criatura atacante desfere um golpe amplo que atinge duas criaturas alvejadas ao mesmo tempo. A criatura atacante escolhe duas criaturas que estejam adjacentes uma à outra e realiza seu teste de ataque normalmente. Ambas as criaturas alvejadas realizam testes de defesa. Caso o seu teste de ataque seja bem-sucedido contra ambas as criaturas alvejadas, a criatura atacante divide seu dano igualmente entre as duas criaturas alvejadas (arredondando o valor para baixo). Caso apenas uma das criaturas sejam alvejadas, o dano do ataque ainda é reduzido pela metade. Caso o ataque seja crítico contra qualquer uma das duas criaturas alvejadas, essa criatura recebe o dano normal, sem redução pela metade imposta por essa manobra.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Cortar Tendão",
    descricao:
      "Esta manobra pode ser realizada apenas contra criaturas que possuam pernas e estejam utilizando armadura leve, média ou nenhuma armadura, e que sejam do mesmo tamanho ou maiores que a criatura atacante. A criatura atacante mira as pernas da criatura alvejada para dificultar o seu movimento. A criatura atacante realiza um teste de ataque com empecilho. Caso seja bem sucedida, o alvo sofrerá uma penalidade em sua velocidade de corrida igual ao maior número do dado de maestria arma da criatura atacante até que cure qualquer quantidade de PFs. Caso o teste resulte em um acerto crítico o tendão da criatura alvejada é cortado, ela sofre uma queda e sua vel. corrida é reduzida pela metade até que cure remova todos os PFs atuais acumulados.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Enredamento",
    descricao:
      "a criatura atacante sabe usar sua arma defensivamente, aprimorando sua deflexão contra golpes consecutivos. Essa manobra pode ser usada apenas durante os testes de deflexão da criatura atacante. Uma vez por turno a criatura atacante pode impor um empecilho em seu teste de deflexão para impor empecilho no teste de ataque da criatura alvejada. Caso o ataque seja defletido com sucesso, seu próximo teste de deflexão contra um ataque da mesma criatura alvejada recebe incremento.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Pomo",
    descricao:
      "a criatura atacante golpeia a criatura alvejada com o pomo ou a lateral da arma para atordoá-la. Após anunciar essa manobra a criatura atacante faz um teste de ataque normalmente. Caso a criatura atacante seja bem-sucedida, ela reduz o dano desse ataque pela metade (arredondado para cima), seu tipo muda para impacto e a criatura alvejada recebe a condição surpresa até o final de seu próximo turno.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Gancho",
    descricao:
      "a criatura atacante tenta desarmar a criatura alvejada através de um corte por trás de sua guarda. Essa manobra funciona apenas contra criaturas que estejam empunhando sua arma apenas com uma mão e que sejam do mesmo tamanho ou menores que a criatura atacante. A criatura atacante pode fazer um teste de ataque com incremento contra a criatura alvejada, e caso seu resultado seja um acerto crítico, o dano do ataque é reduzido pela metade e a arma da criatura alvejada é arremessada 1d6 metros na direção que a criatura atacante escolher.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Sequência",
    descricao:
      "Uma sequência de ataques é desferida pela criatura atacante. A criatura atacante compromete todas as ações de seu turno com ataques. Cada ataque bem-sucedido adiciona 1d4 no dano do ataque (para um total de 1d4 no segundo ataque e 2d4 no terceiro ataque). Uma criatura alvejada que seja atingida por todos os três ataques da sequência é considerada atordoada.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Finta Bruta",
    descricao:
      "a criatura atacante não precisa anunciar essa manobra antes de receber o ataque que a ativar. Ao receber um ataque enquanto realiza uma ação de movimento, a criatura atacante pode usar uma reação para adicionar um dado de maestria de uma Habilidade apropriada em um teste de deflexão. Caso seja bem-sucedida no teste de bloqueio, a criatura atacante pode realizar um ataque livre contra a criatura que a atacou.",
  },
  {
    tipo: "Armas Cortantes",
    nome: "Passo de Ajuste",
    descricao:
      "a criatura atacante pode aproveitar o mov. choque causado por um ataque corpo-a-corpo bem sucedido para se reposicionar, tomando proveito de aberturas na defesa do alvo. Ao fazer um segundo ataque contra a mesma criatura alvejada, a criatura atacante pode usar seu mov. Evasão.",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Esmagar",
    descricao:
      "a criatura atacante golpeia a criatura alvejada com força suficiente para danificar a sua armadura. Esta manobra pode ser utilizada apenas contra oponentes que estejam utilizando armaduras médias ou pesadas. A criatura alvejada utiliza duas ações para realizar um teste de ataque com empecilho contra a criatura alvejada. Caso o ataque seja bem sucedido, a RD da armadura da criatura alvejada é reduzida em um valor igual a 1d4 por nível de maestria da arma (1d4/2d4/3d4/4d4).",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Quebra-Galho",
    descricao:
      "a criatura atacante mira nos braços ou mãos da criatura alvejada para impedi-la de empunhar a arma efetivamente. Esta manobra pode ser utilizada apenas contra criaturas que estejam segurando uma arma com uma mão só e que sejam de mesmo tamanho ou menores que a criatura atacante. A criatura atacante pode reduzir pela metade o dano de um teste de ataque que tenha sido bem sucedido. O alvo do ataque recebe uma penalidade com Habilidades que usam suas mãos igual a INT da criatura atacante até que recupere qualquer quantidade de PFs.",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Quebra-Patela",
    descricao:
      "a criatura atacante golpeia o pé, tornozelo ou joelho da criatura alvejada para prejudicar o equilíbrio e o movimento. Após um teste de ataque que tenha sido bem-sucedido contra um teste de deflexão, o usuário da manobra pode reduzir seu dano pela metade (arredondado para cima) para impor uma penalidade nas velocidades de movimento do inimigo igual a metade do dano do ataque (arredondado para cima).",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Quebra-Coco",
    descricao:
      "O usuário sabe tomar proveito de momentos em que o oponente está desorientado. Ao realizar um teste de ataque contra um oponente surpreso ou atordoado, a criatura atacante adiciona um dado de Maestria a mais.",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Golpes de Impacto",
    descricao:
      "Golpes subsequentes da criatura atacante utilizam o peso dela em movimento para aplicar pressão adicional sobre a criatura alvejada. Multiataques realizados com essa arma ganham um bônus adicional de +1 por ataque (efetivamente diminuindo a penalidade por multiataque para -2 e -4).",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Interceptar",
    descricao:
      "a criatura atacante sabe golpear uma criatura que passe por ela com força e no local exato para interromper seu avanço. Ataques feitos contra criaturas durante seu movimento são feitos com incremento. Caso o teste de ataque seja um acerto, a velocidade de movimento utilizada pela criatura alvejada é reduzido em um valor igual ao mov. Choque da criatura atacante. Caso o golpe seja um acerto crítico, a velocidade de movimento utilizada pela criatura é reduzida a 0 e ela sofre uma queda.",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Quebra-Casco",
    descricao:
      "a criatura atacante sabe utilizar o peso de sua arma para castigar escudos. Esta manobra pode ser utilizada apenas contra criaturas que estejam usando escudos e que sejam de mesmo tamanho ou menores que a criatura alvejada. A criatura atacante utiliza duas ações para realizar três ataques consecutivos sem penalidade por multi ataque, abrindo mão de seu dano. Caso os três ataques sejam bem sucedidos um escudo não-mágico usado pela criatura alvejada é estilhaçado, não oferecendo mais nenhum efeito. Caso o escudo seja mágico ele é arremessado 1d6 metros em uma direção determinada pela criatura atacante.",
  },
  {
    tipo: "Armas de Impacto",
    nome: "Desorientar",
    descricao:
      "Com um golpe bem mirado na lateral da cabeça da criatura alvejada, a criatura atacante a desorienta. Após anunciar essa manobra, a criatura atacante usa duas ações e faz um teste de ataque com empecilho. A criatura alvejada torna-se atordoada até o final de seu próximo turno caso falhe em defender-se.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Caça-Pé",
    descricao:
      "a criatura atacante sabe usar o tamanho e forma de sua arma para fazer criaturas alvejadas caírem. Utilizando duas ações, a criatura atacante faz um teste de ataque, abrindo mão do dano. A criatura alvejada sofre uma queda caso falhe em defender-se.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Chicoteamento",
    descricao:
      "seguindo a arma por uma ponta, a criatura atacante consegue aumentar ainda mais seu alcance. Ao utilizar essa manobra a criatura atacante aumenta o alcance de sua arma em um passo por uma ação.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Golpe Acima",
    descricao:
      "A criatura atacante consegue usar a arma para enfrentar oponentes montados ou maiores que ela mesma. A criatura pode ignorar restrições de tamanho para criaturas alvejadas maiores que ela mesma de qualquer manobra que conheça.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Avanço e Estocada",
    descricao:
      "Ao correr na direção e realizar um ataque contra uma criatura, a criatura atacante pode desferir um ataque mais contundente. Essa manobra deve ser utilizada após pelo menos uma distância curta de movimento ininterrupto (sem que nenhuma outra ação seja executada no decorrer do movimento). A criatura usa uma Habilidade relacionada ao tipo de movimentação executada. Se a Habilidade usada também ultrapassar o valor do teste de defesa da criatura alvejada, a criatura atacante pode dar um bônus ao dano do ataque igual a 5.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Reversão",
    descricao:
      "a criatura atacante consegue usar o cabo de sua arma para aplicar um golpe secundário contra uma criatura que esteja adjacente a ela. Ao usar uma ação para realizar um ataque contra uma criatura dentro de sua área de ameaça, a criatura atacante pode usar o mesmo teste de ataque contra uma outra criatura que esteja dentro de sua área de ameaça. O dano do ataque secundário muda para o tipo impacto e é igual ao dano do ataque principal reduzido pela metade (arredondado para baixo)",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Golpe em Arco",
    descricao:
      "a criatura atacante realiza um ataque amplo e acerta várias criaturas de uma vez. A criatura atacante utiliza duas ações para desferir um ataque contra um grupo de criaturas. Isso significa uma ou mais criaturas que estejam adjacentes uma da outra, mas não criaturas dentro da área de ameaça da criatura atacante que não tenham aliados adjacentes. A criatura atacante faz um teste de ataque normal e todas as criaturas alvejadas desse grupo devem defender-se dele.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Prensa",
    descricao:
      "a criatura atacante consegue usar essa arma para prensar uma criatura que tenha o mesmo tamanho ou seja menor que si mesma contra uma parede, estrutura ou terreno. A criatura atacante pode abrir mão de seu teste de dano após um teste de ataque bem-sucedido. A criatura alvejada ganha a condição contenção até que a criatura atacante realize uma nova ação. Para tentar quebrar o contato a criatura alvejada deve usar uma ação para forçar um novo confronto, e caso seja bem-sucedida o efeito é finalizado.",
  },
  {
    tipo: "Armas de Alcance",
    nome: "Caça-Punho",
    descricao:
      "a criatura atacante está preparada para interceptar ataques direcionados a ela. Quando uma criatura avançar para dentro da margem de ameaça da criatura atacante vindo na sua direção, ela pode usar sua reação para para atacá-la. Caso o resultado desse ataque seja um acerto crítico, a criatura alvejada deve ser bem-sucedida em um teste oposto de DES contra o teste de ataque, ou sua arma é arremessada 1d4 metros em uma direção escolhida pela criatura atacante.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Alvo Fácil",
    descricao:
      "a criatura atacante faz seu ataque a uma distância curta, colocando menos potência no projétil. A criatura atacante pode fazer um ataque à distância contra uma criatura que esteja a menos de 10 menos da criatura atacante sem gastar a ação de mira padrão e sanso incorrer em penalidade por multi ataque. Caso seja bem-sucedida, esse ataque tem seu dano reduzido pela metade.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Antecipação",
    descricao:
      "a criatura atacante da manobra pode usar uma ação para mirar as próximas duas ações de ataque enquanto não estiver sendo alvejada por uma criatura em distância corpo a corpo. Ações de ataque além da segunda ainda recebem as penalidades normais por multi ataque a partir de +6 caso não sejam miradas.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Uma Flecha no Joelho",
    descricao:
      "a criatura atacante consegue retardar ainda mais o movimento de uma criatura alvejada ao mirar seus ataques nos membros locomotores dela. A criatura atacante utiliza duas ações para esse ataque. O mov. restrito imposto caso esse ataque seja bem-sucedido é dobrado.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Distração",
    descricao:
      "a criatura atacante consegue usar seus feitos com a arma para impressionar alvos. A criatura pode adicionar um dado de maestria a mais em usos de Habilidades para distrair, chamar atenção ou realizar uma performance que usem a arma.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Tiro Duplo",
    descricao:
      "a criatura atacante atira dois projéteis simultâneos contra uma criatura alvejada. Usando duas ações para este ataque, a criatura atacante faz dois testes de ataque. A criatura alvejada, caso seja atingida pelo primeiro ataque, recebe empecilho em testes de evasão contra o segundo.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Tiro de Desarmamento",
    descricao:
      "a criatura atacante dispara uma flecha para desarmar uma criatura alvejada. Essa manobra funciona apenas contra criaturas que estejam empunhando sua arma com uma mão e que sejam de tamanho pequeno ou médio. A criatura atacante realiza um teste de ataque contra a criatura alvejada adicionando 1d4 por nível da maestria escolhida (1d4/2d4/3d4/4d4). Caso o ataque seja um acerto crítico, a criatura alvejada deixa sua arma cair em um espaço adjacente a si. Caso o ataque seja um acerto, ele é considerado um erro.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Ricochete",
    descricao:
      "a criatura atacante sabe usar o terreno no entorno do alvo para lhe atingir com estilhaços de seus projéteis. A criatura atacante usa duas ações de mira para essa ação de ataque. Uma criatura alvejada que esteja com cobertura e próxima (dentro de uma distância corpo-a-corpo) de uma parede ou terreno além do que lhe dá cobertura tem sua cat. cobertura reduzida em 1d4.",
  },
  {
    tipo: "Armas à Distância",
    nome: "Escaramuça",
    descricao:
      "a criatura atacante consegue usar sua munição como arma improvisada contra criaturas em distância de combate corpo-a-corpo. A criatura atacante pode usar suas ações para fazer ataques corpo a corpo contra criaturas que estejam adjacentes a ela. O teste de ataque realizado com essa manobra é feito como se fosse um ataque à distância regular, sem empecilho.",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Recarregar em movimento",
    descricao:
      "a criatura consegue recarregar sua arma durante uma ação de movimento.",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Cambalhotiro",
    descricao:
      "a criatura atacante pode usar uma reação para realizar um ataque após ser bem-sucedido usando seu mov. Evasão, caso tenha munição. Se o ataque não estiver mirado, além da penalidade por multiataque ele é realizado com empecilho",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Runnin' N' Gunnin'",
    descricao:
      "a criatura atacante realiza uma ação de movimento durante a qual pode realizar um ataque livre. Caso escolha realizar esse ataque, ela ganha uma penalidade nele igual à distância que percorrer com a ação de movimento. Essa penalidade é somada a qualquer penalidade por multi ataque ou ataque à distância não mirado.",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Chumbo no bucho",
    descricao:
      "a criatura atacante sabe quando sua precisão é menos importante que sua velocidade. Contra uma criatura que esteja a menos de um número de metros de distância dela igual ao maior número do dado de maestria dela com a arma (6/8/10/12 metros), a penalidade por multiataque é reduzida em 1 por ataque após o primeiro (-4/-6 em ataques subsequentes não mirados).",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Fura-bolo",
    descricao:
      "a criatura atacante conhece o tipo de material que sua munição consegue atravessar. Ao usar duas ações para mirar, a criatura atacante pode reduzir qualquer cat. cobertura que a criatura alvejada possua abaixo de IV em 1d4 níveis.",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Coronhada",
    descricao:
      "a criatura atacante usa a coronha de sua arma de fogo para acertar uma criatura alvejada em combate corpo-a-corpo. A criatura atacante usa seu teste de ataque como se fosse à distância, e caso seja bem-sucedida o dano do ataque é reduzido pela metade, não gasta munição e o tipo de dano muda para impacto.",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Saraivada",
    descricao:
      "a criatura atacante descarrega toda munição restante em sua arma de fogo, usando duas ações. O teste de ataque é realizado com incremento, e caso seja um acerto crítico, a criatura atacante adiciona um dado extra de dano por unidade de munição que tenha em sua arma de fogo. Caso o teste de ataque não seja um acerto crítico mas ainda acerte a criatura alvejada, o dano é reduzido pela metade (arredondado para cima).",
  },
  {
    tipo: "Armas de Fogo",
    nome: "Tiro Desarmante",
    descricao:
      "a criatura atacante pode usar sua reação para atirar contra uma criatura dentro de sua área de ameaça que esteja realizando um ataque. Caso o ataque da criatura atacante seja bem-sucedido, ela impede o ataque da criatura alvejada. Caso o ataque sejam um acerto crítico, a criatura alvejada derruba sua arma cai no chão em um espaço adjacente a si.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Evasão e Troca",
    descricao:
      "a criatura pode trocar de forma após realizar usar mov. evasão.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Deflexão e Troca",
    descricao:
      "a criatura pode trocar de forma após realizar mov. Choque por conta de uma deflexão bem-sucedida.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Movimentos Fluídos",
    descricao: "a criatura pode trocar de forma durante uma ação de movimento.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Manobra de Dois Gumes",
    descricao:
      "a criatura pode escolher qualquer tipo de dano da arma para todo ataque para fins de evitar RD.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Ataques Fluídos",
    descricao:
      "uma ação de ataque pode ser usada pela criatura atacante para trocar a forma usada na próxima ação de ataque.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Redobrar",
    descricao:
      "após ser bem-sucedida em um teste de ataque usando forma de duas mãos, a criatura atacante pode usar uma reação para mudar de forma retroativamente, escolhendo novamente a manobra usada.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Reforçar",
    descricao:
      "após ser bem-sucedida em um teste de ataque usando forma de uma mão, a criatura atacante pode usar uma reação para mudar de forma retroativamente, escolhendo novamente a manobra usada.",
  },
  {
    tipo: "Armas Versáteis",
    nome: "Forma Letal",
    descricao:
      "após realizar um acerto crítico com qualquer forma em uma ação de ataque, a criatura atacante pode escolher entre aplicar o acerto crítico ou realizar uma nova ação de ataque gratuitamente.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Algemar",
    descricao:
      "a criatura atacante busca prender as mãos da criatura alvejada usando uma ação de ataque. O ataque não causa dano, mas caso a criatura alvejada falhe em defender-se contra o teste de ataque, ela é considerada agarrada pela criatura atacante. Enquanto durar esse efeito a criatura atacante não pode usar essa arma em ações de ataque, e ações de ataque realizadas pela criatura alvejada recebem empecilho.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Enforcamento",
    descricao:
      "a criatura atacante busca a criatura alvejada pelo pescoço usando duas ações de ataque. Caso seja bem-sucedida, o ataque causa 1 ponto de dano de impacto, mas caso a criatura alvejada falhe em defender-se contra o teste de ataque, ela é considerada agarrada pela criatura atacante pelo pescoço. Enquanto durar esse efeito a criatura atacante não pode usar essa arma em ações de ataque. Cada turno que a criatura alvejada iniciar agarrada dessa maneira lhe confere 1 ponto de dano de impacto e 4 pontos de exaustão, caso ela precise respirar. Pontos de exaustão ganhos dessa maneira duram até o final do turno em que o agarrão terminar. Criaturas que cheguem a 20 pontos de exaustão por conta desse efeito sofrem uma queda e recebem a condição inconsciência.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Grilhões",
    descricao:
      "a criatura atacante busca prender os pés da criatura alvejada usando uma ação de ataque. O ataque não causa dano, mas caso a criatura alvejada falhe em defender-se contra o teste de ataque, ela é considerada agarrada pela criatura atacante e sofre uma queda. Para levantar-se, além de usar metade de sua velocidade com uma ação de movimento, ela precisa usar uma Habilidade para desvencilhar-se do agarrão.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Angulação",
    descricao:
      "a criatura atacante sabe usar os padrões de movimento imprevisíveis de sua arma para dificultar a defesa de criaturas alvejadas. Usando duas ações de ataque, a criatura atacante rola 1d4 por nível da maestria escolhida (1d4/2d4/3d4/4d4) para o teste de ataque e diminui esse valor de testes de defesa da criatura alvejada.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Interceptação",
    descricao:
      "uma criatura que use sua velocidade de movimento para entrar ou sair da área de ameaça da criatura atacante pode ser interceptada durante o trajeto. A criatura atacante pode usar uma reação para atacar uma criatura alvejada que movimente-se para dentro ou para fora de sua área de ameaça. O dano do ataque é reduzido pela metade (arredondado para cima). Caso falhe, a criatura alvejada sofre uma queda e suas velocidades de movimento atual é reduzida a 0.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Parede de Aço",
    descricao:
      "a criatura usa a corrente para girar a arma em torno de si, dificultando a aproximação de outras criaturas. Ao duas ações para essa manobra, a criatura atacante abre mão de qualquer outro ataque durante esse turno. Ela realiza um teste de ataque e aplica o valor como se fosse resultante de um teste de deflexão contra qualquer criatura que a ataque até o início de seu próximo turno.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Impacto Meteoro",
    descricao:
      "o peso da corrente é usado pela criatura atacante para afastar criaturas. Usando duas ações, a criatura atacante realiza um teste de ataque. Caso falhe em defender-se, a criatura alvejada recebe o dano do ataque e o mov. choque dele é dobrado.",
  },
  {
    tipo: "Armas de Corrente",
    nome: "Impulso Abaixo",
    descricao:
      "Usando duas ações, essa manobra pode ser usada em conjunto com uma outra manobra escolhida pela criatura atacante, ignorando os seus requisitos de uso de ações Caso a criatura alvejada sofra uma queda por efeito da manobra escolhida, ela sofre 1d6 de dano de impacto a mais pela queda, mesmo que esteja de pé sobre a superfície onde irá cair.",
  },
];
