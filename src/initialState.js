// initialState.js - ATUALIZADO COM CAMPO DE MOVIMENTAÇÃO E CAMPO DD
export const initialState = {
  // Dados da página Identidade
  descricao: {
    nome: "",
    idade: "",
    conviccao: "",
    vicio: "",
    aparencia: "",
    historia: "",
  },
  atributos: {
    INT: { base: 1, ancestral: 0, bonus: 0 },
    VEL: { base: 1, ancestral: 0, bonus: 0 },
    RES: { base: 1, ancestral: 0, bonus: 0 },
    DES: { base: 1, ancestral: 0, bonus: 0 },
    LOG: { base: 1, ancestral: 0, bonus: 0 },
    SAB: { base: 1, ancestral: 0, bonus: 0 },
    ESP: { base: 1, ancestral: 0, bonus: 0 },
  },
  fichaTrancada: false,
  atributosTrancados: false,

  // NOVO CAMPO: Movimentação
  movimentacao: {
    velocidade: "",
    choque: { atual: 0, total: 0 },
    restricao: { atual: 0, total: 0 },
    evasao: { atual: 0, total: 0 },
    mitigadoChoque: 0,
    mitigadoRestricao: 0,
    mitigadoEvasao: 0,
  },

  // Recursos e Traumas - ATUALIZADO COM CAMPO DD
  recursos: {
    pfs: { current: 0, max: 0 },
    pes: { current: 0, max: 0 },
    pcs: { current: 0, max: 0 },
    dd: { current: 0, max: 0 }, // NOVO CAMPO DD
    traumas: { current: 0, max: 0, description: "" },
  },

  // Dados de Ancestralidades
  ancestralidadesConfirmadas: false,
  caracteristicasSelecionadas: {},
  caracteristicasConfirmadas: {},
  pontosAtributoAncestralidade: {},
  distribuicaoAncestralConfirmada: false,
  distribuicaoAtributoAncestralidadeConfirmada: false,

  // Dados de Origens
  origensConfirmadas: false,
  origensSelecionadas: {
    Infância: null,
    Estudos: null,
    Ofícios: null,
  },
  andrilhagemSelecionada: false,
  magiaDespertaSelecionada: false,

  // Dados de Habilidades
  habilidades: [],
  bonusHabilidades: {},

  // Dados de Talentos
  talentosSelecionados: {},

  // Dados de Bagagem
  itensBagagem: [],
  itensEquipados: [],

  // Dados de Manobras
  manobrasSelecionadas: {},

  // Dados de Magias
  atosEspirituais: {
    Castigo: "--",
    Virtude: "--",
    Praga: "--",
    Deslumbramento: "--",
    Alteração: "--",
  },
  subtiposArcana: {
    Genesimancia: "--",
    Hypnomancia: "--",
    Metatromancia: "--",
    Protegomancia: "--",
    Thanatomancia: "--",
  },
  feitosAtuais: 0,
  circsAutAtuais: 0,
  magiasAlteracaoSelecionadas: [],
  formasSelecionadas: {},
  efeitosArcana: [],

  // Registros Arcana
  registrosArcana: [],

  // Dados: Página de Criação
  tiposCriacao: {
    Alquimia: "--",
    Encantamento: "--",
    Pergaminhos: "--",
    Ferramentaria: "--",
    Venenofício: "--",
  },
  negocios: {
    Vendas: { habilidade: "" },
    Entretenimento: { habilidade: "" },
    Trapaça: { habilidade: "" },
  },
  receitas: [],
};
