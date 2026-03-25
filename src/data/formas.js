// formas.js
export const formas = {
  formas: [
    {
      id: "linha-primeiro-alvo",
      nome: "Linha (Primeiro Alvo)",
      descricao:
        "Linha a partir da criatura conjuradora que para na primeira criatura atingida. Caso a criatura alvo consiga evitar o ataque, a próxima criatura na linha deve realizar o teste e assim sucessivamente, até o limite da distância - ou caso a magia atinja um objeto inanimado ou terreno. Não pode ser defendido com deflexão.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 3 },
        { id: "media", nome: "Média", custo: 6 },
        { id: "longa", nome: "Longa", custo: 12 },
      ],
    },
    {
      id: "linha-todos-alvos",
      nome: "Linha (Todos os Alvos)",
      descricao:
        "Atinge todas as criaturas que estão na linha. Para ao atingir o primeiro terreno, a não ser que tenha potência o suficiente para destruí-lo. Não pode ser defendido com deflexão.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 5 },
        { id: "media", nome: "Média", custo: 10 },
        { id: "longa", nome: "Longa", custo: 20 },
      ],
    },
    {
      id: "area",
      nome: "Área",
      descricao:
        "A área deve ter seu formato (um cone, um tubo, um cubo, uma forma irregular, etc) declarado de forma que justifique as criaturas afetadas.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo (Área Curta)", custo: 1 },
        { id: "curta", nome: "Curta (Área Média)", custo: 6 },
        { id: "media", nome: "Média (Área Longa)", custo: 12 },
        { id: "longa", nome: "Longa (Área Longa)", custo: 24 },
      ],
    },
    {
      id: "projetil-mirado",
      nome: "Projétil Mirado",
      descricao:
        "Projétil do tamanho do punho da criatura conjuradora ou menor que para na primeira criatura atingida em uma linha a partir da criatura conjuradora e desfaz-se caso não encontre o alvo desejado por ela.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 2 },
        { id: "media", nome: "Média", custo: 4 },
        { id: "longa", nome: "Longa", custo: 8 },
      ],
    },
    {
      id: "projetil-teleguiado",
      nome: "Projétil Teleguiado",
      descricao:
        "Projétil do tamanho do punho da criatura conjuradora ou menor que persegue um alvo que ela consiga ver ao conjurar a magia. O projétil desvia de objetos, terreno e criaturas e desfaz-se caso não atinja o alvo até o final do turno da criatura conjuradora. Ignora cobertura.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 3 },
        { id: "media", nome: "Média", custo: 6 },
        { id: "longa", nome: "Longa", custo: 12 },
      ],
    },
    {
      id: "alvo-a-vista",
      nome: "Alvo à vista",
      descricao:
        "A magia toma efeito no local ocupado pelo alvo, sem precisar de um trajeto da criatura conjuradora até ele, caso ela consiga vê-lo. A própria criatura conjuradora é considerada um alvo à vista. No final da conjuração, caso a pessoa arcanista não saiba onde está a criatura alvejada ela falha.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 4 },
        { id: "media", nome: "Média", custo: 8 },
        { id: "longa", nome: "Longa", custo: 16 },
      ],
    },
    {
      id: "alvo-fora-vista-conhecido",
      nome: "Alvo fora de vista conhecido",
      descricao:
        "A magia toma efeito no local ocupado pelo alvo, sem precisar de um trajeto da criatura conjuradora até ele, caso ela saiba sua posição exata.",
      distancias: [
        { id: "corpo-a-corpo", nome: "Corpo-a-Corpo", custo: 1 },
        { id: "curta", nome: "Curta", custo: 7 },
        { id: "media", nome: "Média", custo: 14 },
        { id: "longa", nome: "Longa", custo: 28 },
      ],
    },
    {
      id: "alvo-fora-vista-presumido",
      nome: "Alvo fora de vista presumido",
      descricao:
        "A magia toma efeito no local ocupado pelo alvo, sem precisar de um trajeto da criatura conjuradora até ele, case ele encontre-se dentro da área de feito.",
      distancias: [
        {
          id: "corpo-a-corpo",
          nome: "Corpo-a-Corpo (Distância/Área)",
          custo: 1,
        },
        { id: "curta", nome: "Curta (Distância/Área)", custo: 8 },
        { id: "media", nome: "Média (Distância/Área)", custo: 16 },
        { id: "longa", nome: "Longa (Distância/Área)", custo: 32 },
      ],
    },
  ],
};
