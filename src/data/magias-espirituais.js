// magias-espirituais.js
export const magiasEspirituais = {
  alteracao: [
    {
      nome: "Criar comida",
      descricao:
        "Cria uma unidade de comida por feito utilizado na conjuração em um espaço adjacente à criatura conjuradora.",
      id: "alteracao-criar-comida",
    },
    {
      nome: "Falar com plantas",
      descricao:
        "Estabelece uma conexão telepática com uma quantidade de criaturas do tipo planta igual à quantidade de feitos usados na conjuração que a criatura conjuradora consiga enxergar ou de outra forma perceber dentro de uma distância curta de si. O efeito dura enquanto durar sua concentração no feito.",
      id: "alteracao-falar-plantas",
    },
    {
      nome: "Falar com animais",
      descricao:
        "Estabelece uma conexão telepática com uma quantidade de criaturas do tipo animal igual à quantidade de feitos usados na conjuração que a criatura conjuradora consiga enxergar ou de outra forma perceber dentro de uma distância curta de si. O efeito dura enquanto durar sua concentração no feito.",
      id: "alteracao-falar-animais",
    },
    {
      nome: "Controlar plantas",
      descricao:
        "Uma quantidade de criaturas do tipo planta igual ao número de feitos usados na magia que o conjurador consiga enxergar ou de outra maneira perceber dentro de uma distância curta de si devem ser bem-sucedidas em um confronto contra o teste de conjuração. Caso falhem, são consideradas encantadas e sob controle da criatura conjuradora enquanto durar sua concentração no feito.",
      id: "alteracao-controlar-plantas",
    },
    {
      nome: "Controlar animais",
      descricao:
        "Uma quantidade de criaturas do tipo animal igual ao número de feitos usados na magia que a criatura conjuradora consiga enxergar ou de outra maneira perceber dentro de uma distância curta de si devem ser bem-sucedidas em um confronto contra o teste de conjuração. Caso falhem, são consideradas encantadas e sob controle da criatura conjuradora enquanto durar sua concentração no feito.",
      id: "alteracao-controlar-animais",
    },
    {
      nome: "Controlar o clima",
      descricao:
        "A criatura conjuradora é capaz de influenciar o clima do local onde encontra-se (1km de diâmetro em torno de si por feito usado na conjuração da magia). Após ser bem sucedida em um teste de conjuração contra cat. perigo do local onde se encontra, a criatura conjuradora pode manipular a tabela de clima, adicionando valores para 'clima melhora', 'clima piora' e 'clima permanece'. A magia influencia o próximo teste de clima realizado no mesmo dia ou no dia seguinte, sem necessidade de concentração.",
      id: "alteracao-controlar-clima",
    },
    {
      nome: "Causar desastre natural",
      descricao:
        "Intensifica o clima do local onde a criatura conjuradora se encontra (1km de diâmetro em torno de si por feito usado na conjuração da magia), forçando todas as criaturas relevantes que estejam na área a realizar uma defesa contra a cat. perigo do local onde se encontra, usando um dos efeitos climáticos que seja justificado pelo local e clima no local em que a magia é conjurada. As criaturas afetadas são forçadas a realizar testes de Defesa a cada turno contra os efeitos climáticos, caso afetadas por eles, enquanto durar a concentração da criatura conjuradora.",
      id: "alteracao-causar-desastre-natural",
    },
    {
      nome: "Forma animal",
      descricao:
        "Transforma uma criatura na qual a criatura conjuradora toque em uma outra criatura do tipo animal. A transformação dura até que a criatura conjuradora desfaça-a ou até que seus PFs sejam reduzidos a zero. Enquanto estiver nessa forma a criatura conjuradora perde acesso às suas magias e poderes, utiliza todos os atributos, velocidades de movimento, Habilidades e limites de PF/PE da criatura na qual se transformar. Os PF/PE recebidos em sua forma animal são transferidos para a criatura afetada quando termina a conjuração.",
      id: "alteracao-forma-animal",
    },
    {
      nome: "Caminho Selvagem",
      descricao:
        "A criatura conjuradora consegue aumentar a distância diária de viagem de quem estiver viajando com ela sobre um terreno do tipo em que a magia foi conjurada. A magia é finalizada caso as criaturas por ela afetadas precisem passar por qualquer distância de um terreno que não seja aquele na qual a magia foi conjurada. Cada feito investido na magia adiciona 25 km de distância diária de viagem, ou até que a viagem seja interrompida.",
      id: "alteracao-caminho-selvagem",
    },
    {
      nome: "Apodrecer",
      descricao:
        "Causa um número de d4 pontos de dano necrótico em um alvo que a criatura conjuradora consiga enxergar ou de outra forma perceber dentro de uma distância curta de si. O alvo da magia pode evitar o efeito caso seja bem-sucedido em defender-se através de um confronto. A quantidade de d4 é igual ao número de feitos investido na conjuração da magia.",
      id: "alteracao-apodrecer",
    },
    {
      nome: "Conjurar animal",
      descricao:
        "Conjura uma quantidade de criaturas do tipo animal em pontos escolhidos pela criatura conjuradora dentro de uma distância média em torno de si. Criaturas conjuradas duram enquanto mantiver-se a concentração da criatura conjuradora na magia, e quando a concentração acaba, elas somem. As criaturas conjuradas são resistentes a dano não mágico.",
      id: "alteracao-conjurar-animal",
    },
    {
      nome: "Conhecer ermo",
      descricao:
        "A criatura conjuradora pode adicionar seu dado de maestria de Alteração em usos de Habilidades relacionadas à natureza e sobrevivência em locais selvagens. Além disso, ela ganha +1 ponto de bônus por feito investido na magia contra a Dificuldade da cat. perigo do local onde se encontra. Cada 3 pontos que a criatura conjuradora alcançar acima Dificuldade do teste revela um espaço da tabela de encontros aleatórios do local ou um ponto de interesse que exista no local à critério do DM.",
      id: "alteracao-conhecer-ermo",
    },
    {
      nome: "Purificar",
      descricao:
        "Uma criatura na qual a criatura conjuradora toque é forçada a realizar um teste de resistir Doença/Toxina finalizar uma doença ou toxina que esteja lhe afetando. A criatura afetada recebe um bônus no teste de acordo com o número de feitos usados na conjuração. Esse efeito não pode afetar a mesma criatura mais que uma vez por dia. Essa magia também pode afetar um objeto no qual a criatura conjuradora encoste, neutralizando venenos de acordo com a categoria.",
      id: "alteracao-purificar",
    },
    {
      nome: "Regenerar",
      descricao:
        "Cura um número de d4 pontos de dano em uma criatura que a criatura conjuradora consiga enxergar ou de outra forma perceber dentro de uma distância curta de si. A quantidade de d4 é igual ao número de feitos investido na conjuração da magia, mas a criatura afetada pode rolar apenas 1d4 no início de cada um de seus turnos.",
      id: "alteracao-regenerar",
    },
    {
      nome: "Controlar elemento",
      descricao:
        "Pode alterar a forma física de uma quantidade de elemento (que ocupe uma área de até 1x1 por feito usado na magia) presente dentro da área de efeito da magia, como um pedaço de pedra ou água de uma fonte, ou uma quantidade de ar, ou uma chama (de vela, tocha, fogueira, incêndio, etc) apontada pela criatura conjuradora, alterando sua forma, mudando seu estado de matéria ou movimentando-o.",
      id: "alteracao-controlar-elemento",
    },
    {
      nome: "Chamar elemento",
      descricao:
        "Cria uma unidade do elemento escolhido pela criatura conjuradora por feito investido na magia dentro de uma distância curta em volta de si, sob seu controle. Essas unidades de elemento não contam para o limite de unidades que podem ser controladas pela criatura conjuradora, mas qualquer unidade possuída pela criatura conjuradora que exceda esse limite ainda se desfaz no final da rodada.",
      id: "alteracao-chamar-elemento",
    },
    {
      nome: "Resistir elemento",
      descricao:
        "A criatura conjuradora protege alvos dentro da área de efeito da magia contra um elemento entre os seguintes: frio, fogo, eletricidade, ácido. Criaturas afetadas pela magia recebem RD igual a duas vezes o número de feitos investidos na conjuração da magia. O efeito dura enquanto durar a concentração da criatura conjuradora.",
      id: "alteracao-resistir-elemento",
    },
    {
      nome: "Tornar-se elemento",
      descricao:
        "A criatura conjuradora pode transformar seu corpo em uma quantidade de unidades do seu elemento chave até o início de seu próximo turno. Suas velocidades de movimento são dobradas mas o efeito da magia cessa imediatamente se as unidades de elemento que compõe a criatura conjuradora se desfizerem.",
      id: "alteracao-tornar-se-elemento",
    },
    {
      nome: "Arma elemental",
      descricao:
        "A criatura conjuradora encanta uma arma na qual toque com o seu elemento-chave. A arma encantada passa a adicionar uma quantidade de d4 no teste de ataque que podem ser usadas apenas como dano do elemento escolhido em cada ataque bem sucedido pela duração da magia.",
      id: "alteracao-arma-elemental",
    },
    {
      nome: "Chamar elemental",
      descricao:
        "Conjura uma quantidade de criaturas do tipo elemental alinhadas com seu elemento-chave em pontos escolhidos pela criatura conjuradora dentro de uma distância média em torno de si. Criaturas conjuradas duram enquanto mantiver-se a concentração do conjurador na magia, e quando a concentração acaba, elas somem.",
      id: "alteracao-chamar-elemental",
    },
    {
      nome: "Banir elemental",
      descricao:
        "Transforma alvos que sejam criaturas do tipo elemental em unidades de elemento, ou envia-os de volta para seu plano de origem (no caso de elementais extraplanares). Alvos devem defender-se contra o teste de conjuração para resistir o efeito, e podem repeti-lo no final de cada um de seus turnos caso tenham sido transformados em unidades de elemento, enquanto durar a concentração da criatura conjuradora.",
      id: "alteracao-banir-elemental",
    },
    {
      nome: "Aprisionar elemental",
      descricao:
        "Aprisiona uma criatura do tipo elemental no local onde ela se encontra quando a magia toma efeito. Criaturas alvo afetadas têm suas velocidades de movimento zeradas e recebem a condição contenção. Alvos devem realizar uma defesa contra o teste de conjuração para resistir o efeito, e podem realizar o teste novamente no início de cada um de seus turnos.",
      id: "alteracao-aprisionar-elemental",
    },
    {
      nome: "Forma elemental",
      descricao:
        "A criatura conjuradora transforma-se em uma criatura do tipo elemental de categoria equivalente ao número de feitos investidos na conjuração. A transformação dura até que a criatura desfaça a magia ou até que forma transformada atinja seu limite de PFs/PEs, momento no qual ela será destransformada.",
      id: "alteracao-forma-elemental",
    },
    {
      nome: "Armadura elemental",
      descricao:
        "A criatura conjuradora é capaz de proteger um número de alvos à sua escolha que estejam dentro de uma distância curta de si. Alvos recebem resistência contra um tipo de dano elemental (fogo, frio, eletricidade, ácido) e caso esse dano seja um elemento-chave da criatura conjuradora, também causam dano desse tipo a criaturas que realizarem ataques corpo-a-corpo contra os alvos da magia pela sua duração.",
      id: "alteracao-armadura-elemental",
    },
    {
      nome: "Criar luz",
      descricao:
        "Cria pontos de luz em locais determinados pela criatura conjuradora dentro de uma distância curta em torno de si. A conjuração das luzes causa um efeito adicional no momento de sua conjuração de acordo com sua categoria quando o ponto de luz é conjurado no mesmo espaço que a uma criatura, além de iluminar o ambiente e criaturas enquanto durar a concentração da criatura conjuradora.",
      id: "alteracao-criar-luz",
    },
    {
      nome: "Telecinese",
      descricao:
        "A criatura conjuradora ganha três comandos: Atrair, Repelir e Prender. Atrair e repelir adicionam mov. de choque na direção da criatura conjuradora ou para longe dela, respectivamente. Prender reduz todas as vel. mov. da criatura afetada. Criaturas atingidas pelo efeito devem ser bem-sucedidas em uma defesa contra o teste de conjuração para evitarem o efeito.",
      id: "alteracao-telecinese",
    },
    {
      nome: "Polimorfia",
      descricao:
        "Transforma uma criatura na qual a criatura conjuradora toque em uma outra criatura ou objeto. Caso não seja voluntária, a criatura realiza uma defesa contra o teste de conjuração. Sendo bem-sucedida, a transformação dura enquanto a concentração da criatura conjuradora se mantiver, até que a criatura conjuradora desfaça-a ou até que os PFs do alvo transformado sejam reduzidos a zero.",
      id: "alteracao-polimorfia",
    },
    {
      nome: "Escudo",
      descricao:
        "Usa energia mágica bruta para defletir um ou mais ataques com tipo cortante, perfurante ou de impacto, mágico e mundano. Efeito se aplica diretamente na frente do alvo designado pela criatura conjuradora, criando uma barreira a partir dela que protege uma área curta, evitando ataques para todas as criaturas que estejam sob cobertura.",
      id: "alteracao-escudo",
    },
    {
      nome: "Criar escuridão",
      descricao:
        "Cria pontos de escuridão em locais determinados pela criatura conjuradora dentro de uma distância curta em torno de si. Cada ponto de escuridão torna uma área de distância corpo-a-corpo em torno de si escurecida, além de uma área de distância curta obscurecida em todas as direções.",
      id: "alteracao-criar-escuridao",
    },
    {
      nome: "Levitação",
      descricao:
        "Escolhe uma quantidade de criaturas que estejam dentro de uma distância curta em torno de si para ganharem uma vel. de vôo.",
      id: "alteracao-levitacao",
    },
    {
      nome: "Teleportar",
      descricao:
        "Teleporta uma quantidade de criaturas igual ao número de feitos investidos na conjuração que escolha que estejam dentro de uma distância curta em torno de si. Criaturas que desejem podem resistir ao efeito tentando defender-se. A criatura conjuradora deve escolher um local no qual já tenha estado fisicamente como destino do teleporte.",
      id: "alteracao-teleportar",
    },
    {
      nome: "Conjurar objeto",
      descricao:
        "Cria unidades de um único objeto (uma ferramenta ou miscelânea) em um espaço adjacente à criatura conjuradora. Esse objeto desaparece quando finalizada a duração da magia.",
      id: "alteracao-conjurar-objeto",
    },
    {
      nome: "Detectar magia",
      descricao:
        "A criatura conjuradora envia um sinal que cobre uma distância curta por feito investido na magia em torno de si, parando no efeito mágico ativo - conjuração, magia autônoma, concentração ou encantamento de local ou item - mais próximo e informando a criatura conjuradora de seu local e cat. magia.",
      id: "alteracao-detectar-magia",
    },
    {
      nome: "Identificar magia",
      descricao:
        "A criatura conjuradora usa energia mágica para interagir com outra energia mágica e aprender seus efeitos. A criatura conjuradora adiciona um bônus de +1 por feito investido na magia no uso de uma Habilidade para aprender qual é o subtipo e efeitos de um efeito mágico ativo que esteja dentro de uma distância curta de si.",
      id: "alteracao-identificar-magia",
    },
    {
      nome: "Telepatia",
      descricao:
        "A criatura conjuradora conecta a mente de um número de criaturas voluntárias que estejam dentro de uma distância curta de si mesma. Pela duração da magia, as criaturas assim conectadas podem conversar verbalmente de forma telepática. Cada criatura escolhe os pensamentos que deseja enviar para as outras.",
      id: "alteracao-telepatia",
    },
    {
      nome: "Melhoramento de atributo",
      descricao:
        "Confere um bônus em INT, VEL, RES, DES, LOG, SAB ou CAR para uma quantidade de criaturas escolhidas pela criatura conjuradora que estejam dentro de uma distância curta de si. A criatura conjuradora deve escolher um atributo para ser bonificado em todos os alvos (max. 7). O efeito dura enquanto durar a concentração da criatura conjuradora.",
      id: "alteracao-melhoramento-atributo",
    },
    {
      nome: "Desfazer magia",
      descricao:
        "Desfaz um efeito mágico nos alvos e área afetada. Caso o efeito mágico seja sustentado por uma criatura através de concentração, força a criatura a realizar um teste de concentração.",
      id: "alteracao-desfazer-magia",
    },
    {
      nome: "Criar abrigo",
      descricao:
        "Transporta uma quantidade de criaturas voluntárias para um demiplano pessoal que tem o aspecto que a criatura conjuradora escolher, com o imperativo que seja uma construção sem acesso para o exterior. Criaturas podem permanecer em um abrigo por uma quantidade máxima de tempo, depois do qual serão expulsas magicamente de volta para o local onde a magia foi conjurada.",
      id: "alteracao-criar-abrigo",
    },
    {
      nome: "Delimitar área",
      descricao:
        "Conjura duas magias ao mesmo tempo, gastando feitos para ambas, mas realizando o teste de conjuração apenas da magia a ser utilizada junto com Delimitar área. A magia conjurada toma efeito quando uma criatura entra na área de efeito de Delimitar área. Alternativamente, a criatura conjuradora pode acionar a magia remotamente.",
      id: "alteracao-delimitar-area",
    },
    {
      nome: "Faísca mágica",
      descricao:
        "Cria um feixe de raios de energia mágica pura, causando dano de força em uma criatura ou objeto. A criatura conjuradora indica uma criatura que estiver dentro de uma distância curta de si e essa criatura pode evitar o efeito com uma defesa contra o teste de conjuração da magia.",
      id: "alteracao-faisca-magica",
    },
    {
      nome: "Visão verdadeira",
      descricao:
        "Criaturas escolhidas pela criatura conjuradora que estejam dentro de uma distância curta de si passam a conseguir enxergar através do véu e dentro do plano astral, ao mesmo tempo que o plano material. O número de criaturas que a criatura conjuradora pode afetar com essa magia é igual ao número de feitos utilizados na conjuração, e o efeito dura enquanto se mantiver a concentração da criatura conjuradora.",
      id: "alteracao-visao-verdadeira",
    },
    {
      nome: "Divinação",
      descricao:
        "Ao encostar em um objeto, a criatura conjuradora pode ter uma visão momentânea (durante um turno) do que ocorreu com e no entorno (distância curta) do objeto durante toda uma extensão de tempo, com foco específico e mais detalhado dependendo de quão relevante seja o objeto para a informação buscada pela criatura conjuradora.",
      id: "alteracao-divinacao",
    },
    {
      nome: "Projeção astral",
      descricao:
        "Um número de criaturas escolhidas pela criatura conjuradora que estejam dentro de uma distância curta em torno de si caem em um sono profundo (recebem a condição inconsciência) enquanto acordam em seus corpos astrais na mesma localização deixada para trás, mas podendo navegar livremente entre o plano astral e o plano material, usando uma ação.",
      id: "alteracao-projecao-astral",
    },
    {
      nome: "Salto astral",
      descricao:
        "Um número de criaturas escolhidas pela criatura conjuradora que estejam dentro de uma distância curta em torno de si atravessam o véu e entram no plano astral. Criaturas que desejarem resistir ao efeito podem realizar um teste oposto de ESP, LOG ou SAB para evitar serem transportados.",
      id: "alteracao-salto-astral",
    },
    {
      nome: "Conjurar criatura",
      descricao:
        "Conjura uma quantidade de criaturas do tipo animal, humanoide, monstruosiade, elemental ou planta, em um ponto da área de efeito da magia. As criaturas conjuradas aparecem em pontos escolhidos pela criatura conjuradora dentro de uma distância curta em torno de si. Criaturas conjuradas duram enquanto se mantiver a concentração da criatura conjuradora na magia, e quando a concentração acaba, elas somem.",
      id: "alteracao-conjurar-criatura",
    },
  ],
};
