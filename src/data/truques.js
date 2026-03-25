// truques.js
export const truques = {
  truques: [
    {
      nome: "Retribuir",
      descricao:
        "custo 1 ação. Duração 1 ataque. O próximo teste de ataque realizado pela criatura conjuradora até o início de seu próximo turno ganha um bônus de 1d4 no teste de ataque.",
      id: "truque-retribuir",
    },
    {
      nome: "Iluminar",
      descricao:
        "custo 1 ação. Duração 1 minuto. A criatura conjuradora designa tochas, velas, lâmpadas, lareiras ou demais fontes mundanas de iluminação que saiba existir dentro de uma distância curta de si e as acende. A criatura conjuradora pode optar por conjurar um ponto de luz no seu espaço (ilumina uma distância corpo-a-corpo e deixa uma área curta obscurecida até que encontre outra fonte de luz), e caso opte por fazê-lo o ponto de luz irá mover-se junto com a criatura conjuradora pela sua duração.",
      id: "truque-iluminar",
    },
    {
      nome: "Extinguir luzes",
      descricao:
        "custo 1 ação. Duração instantânea. A criatura conjuradora designa tochas, velas, lâmpadas, lareiras ou demais fontes mundanas de iluminação que saiba existir dentro de uma distância curta de si e as apaga.",
      id: "truque-extinguir-luzes",
    },
    {
      nome: "Magnetizar",
      descricao:
        "custo 1 ação. Duração 1 ataque. A criatura conjuradora magnetiza o local de impacto de de seu próximo ataque corpo a corpo. A criatura alvo do ataque não recebe mov. Choque por esse ataque e seu mov. Evasão é reduzido pela metade (arredondado para baixo).",
      id: "truque-magnetizar",
    },
    {
      nome: "Alarme",
      descricao:
        "custo 30 ações (1 minuto de conjuração). Duração 10 minutos. A criatura conjuradora designa um perímetro de tamanho curto e informa a criatura conjuradora quando uma criatura cruzá-lo. A criatura conjuradora pode usar o alarme na criação de seus glifos.",
      id: "truque-alarme",
    },
    {
      nome: "Encontrar Presa",
      descricao:
        "custo 3 ações. Duração instantânea. A criatura com menor número de PVs atuais dentro de uma área média em volta da criatura conjuradora sofre 1 ponto de dano psíquico e a criatura conjuradora é informada de sua localização atual.",
      id: "truque-encontrar-presa",
    },
    {
      nome: "Controlar Elemento Menor",
      descricao:
        "custo 1 ação. Duração instantânea. Efeitos elementais quase mágicos, inofensivos e pequenos (no máx 50cm em seu lado mais longo). Usar essa magia fornece um incremento ao uso de uma Habilidade relacionada à impressionar ou intimidar.",
      id: "truque-controlar-elemento-menor",
    },
    {
      nome: "Adaga Mental",
      descricao:
        "custo 2 ações. Duração instantânea + 1 Habilidade do alvo. Alvo que a criatura conjuradora consiga enxergar dentro de uma distância curta de si deve ser bem sucedido em um confronto contra um teste de conjuração de Espiritualidade da criatura conjuradora ou receber 1 ponto de dano psíquico e uma penalidade de 1d4 no próximo uso de Habilidade do alvo.",
      id: "truque-adaga-mental",
    },
    {
      nome: "Afeiçoar",
      descricao:
        "custo 3 ações. Duração instantânea + 1 Habilidade da criatura conjuradora. Alvo com quem a criatura conjuradora esteja falando torna-se mais vulnerável à sua lábia. A criatura conjuradora ganha um adicional de 1d4 no próximo uso de Habilidade para convencer ou persuadir o alvo de forma positiva.",
      id: "truque-afeicoar",
    },
    {
      nome: "Prestidigitação",
      descricao:
        "custo 1 ação. Duração instantânea. Cria um objeto de valor irrisório na mão da criatura conjuradora. O objeto deve ser feito de apenas um material, não pode ser uma ferramenta, não pode ser usado como ingrediente ou ter dureza relevante. Exemplos são uma moeda de cortiça, uma flor, um punhado de confete, um lenço, uma carta de baralho, etc.",
      id: "truque-prestidigitacao",
    },
    {
      nome: "Mensagem Secreta",
      descricao:
        "custo 1 ação e um texto designado pelo conjurador. Duração indefinida até que seja dita a palavra chave. Uma mensagem escrita é tornada magicamente invisível. Ela pode ser tornada visível com uma palavra chave decidida pela criatura conjuradora.",
      id: "truque-mensagem-secreta",
    },
    {
      nome: "Reparar",
      descricao:
        "custo 3 ações. Duração instantânea. Repara um objeto do tipo miscelânea. Pelo menos 90% do objeto deve estar intacto para que esse truque funcione.",
      id: "truque-reparar",
    },
    {
      nome: "Ilusão Menor",
      descricao:
        "custo 3 ações. Duração 1 minuto ou até que a criatura conjuradora conjure outra magia. Cria uma imagem ilusória de no máximo 50cm de tamanho em seu maior lado em um espaço dentro de uma distância corpo-a-corpo do conjurador. A imagem possui uma única cor, permanece imóvel e é levemente brilhante e transparente, e dissipa-se quando a criatura conjuradora comandar ou quando ela afastar-se da ilusão para uma distância maior do que corpo-a-corpo.",
      id: "truque-ilusao-menor",
    },
    {
      nome: "Taumaturgia",
      descricao:
        "custo 1 ação. Duração 1 rodada (ou seis segundos). Cria um efeito luminoso ou sonoro inofensivo e pequeno (no máx 50cm em seu lado mais longo, ou não mais do que um flash de luz) dentro de uma distância curta da criatura conjuradora. Usar essa magia fornece um incremento ao uso de uma Habilidade relacionada a impressionar ou intimidar.",
      id: "truque-taumaturgia",
    },
    {
      nome: "Toque Vampírico",
      descricao:
        "custo 2 ações. Duração instantânea. Uma criatura alvo no qual a criatura conjuradora toque deve ser bem sucedida em defender-se em um confronto contra um teste de conjuração de Espiritualidade da criatura conjuradora ou sofrer 1d6 pontos de dano necrótico. A criatura conjuradora cura PVs no mesmo valor. Uma criatura que alimenta-se de sangue é considerada alimentada após usar esse Truque.",
      id: "truque-toque-vampirico",
    },
    {
      nome: "Investigação de Capacidades",
      descricao:
        "custo 3 ações. Duração instantânea. Um alvo que a criatura conjuradora consiga enxergar ou de outra maneira perceber deve ser bem sucedido em um confronto contra uma conjuração de Espiritualidade da criatura conjuradora ou ter revelada à criatura conjuradora uma de suas resistências ou redução de dano OU descrição do efeito de um de seus poderes.",
      id: "truque-investigar-capacidades",
    },
    {
      nome: "Potencializar Toxina",
      descricao:
        "custo 3 ações. Duração instantânea. Uma criatura alvo que a criatura conjuradora tocar que esteja afetado por uma toxina deve ser bem sucedido em um confronto contra uma conjuração de Espiritualidade da criatura conjuradora. Caso falhe, o efeito inicial da toxina (incluindo qualquer dano de toxina, sem contar aprimoramentos adicionados por magias ou talentos) ocorre novamente, e caso a toxina possua um estágio 2, ela avança para o novo estágio. A mesma criatura não pode ser alvo desta magia mais do que uma vez por dia.",
      id: "truque-potencializar-toxina",
    },
    {
      nome: "Combater Toxina",
      descricao:
        "custo 3 ações. Duração instantânea. Uma criatura alvo que a criatura conjuradora tocar que esteja afetado por uma toxina é forçado a realizar um teste contra a Dificuldade da toxina dividido por 2 (arredondado para baixo). Caso seja bem sucedida, o efeito da toxina é suspenso por 1d6 horas. O próximo teste ou magia realizada para remover a toxina recebe um incremento. A mesma criatura não pode ser alvo desta magia mais do que uma vez por dia.",
      id: "truque-combater-toxina",
    },
    {
      nome: "Toque Desconcertante",
      descricao:
        "custo 1 ação. Duração instantânea. Uma criatura alvo que a criatura conjuradora tocar deve ser bem sucedido em um confronto contra uma conjuração de Espiritualidade da criatura conjuradora ou receberá a condição surpresa.",
      id: "truque-toque-desconcertante",
    },
    {
      nome: "Inflamar Vontades",
      descricao:
        "custo 3 ações. Duração 5 turnos. Uma quantidade de criaturas aliadas igual ao maior dado de maestria de Virtude da criatura conjuradora (6/8/10/12 criaturas) que estejam dentro de uma distância curta dela recebem um aumento temporário de limite de PF/PE igual a 5 PV e resistência a dano psíquico por 30 segundos (ou cinco turnos). A mesma criatura não pode ser alvo desse efeito mais do que uma vez por hora.",
      id: "truque-inflamar-vontades",
    },
    {
      nome: "Estabilizar",
      descricao:
        "custo 3 ações. Duração instantânea. A criatura alvo na qual a conjurado é considerada estabilizada e não recebe mais PFs durante seu último Trauma. A criatura alvo permanece desacordada até que cure pelo menos um Trauma.",
      id: "truque-estabilizar",
    },
    {
      nome: "Orientar",
      descricao:
        "custo 3 ações. Duração Instantânea. A criatura alvo recebe 1d4 adicional para usar no próximo uso de Habilidade até o final de seu próximo turno.",
      id: "truque-orientar",
    },
  ],
};
