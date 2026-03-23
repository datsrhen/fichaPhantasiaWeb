// constants.js
export const PONTOS_DISPONIVEIS = 14;
export const VALOR_MINIMO = 1;
export const PONTOS_ANCESTRALIDADE = 10;
export const MAX_PONTOS_ANCESTRAL_ATRIBUTOS = 5;

export const nomeCompleto = {
  INT: "Intensidade",
  VEL: "Velocidade",
  RES: "Resiliência",
  DES: "Destreza",
  LOG: "Lógica",
  SAB: "Sabedoria",
  ESP: "Esperteza",
};

export const nivelMaestria = {
  "--": "--", // NOVO NÍVEL
  I: { nome: "Iniciante", dado: "2d6" },
  II: { nome: "Adepto", dado: "3d8" },
  III: { nome: "Apto", dado: "4d10" },
  IV: { nome: "Mestre", dado: "5d12" },
};

export const atributosPorAncestralidade = {
  FEY: ["DES", "SAB", "ESP"],
  FERALES: ["INT", "VEL", "RES", "DES", "LOG", "SAB", "ESP"],
  HUMANE: ["INT", "VEL", "RES", "DES", "LOG", "SAB", "ESP"],
  PEQUENE: ["DES", "VEL"],
  GIGANTE: ["INT", "RES"],
  SUBTERRÂNEA: ["INT", "LOG", "RES"],
  DRACOS: ["INT", "LOG"],
  PRIMORDIAL: ["INT", "VEL", "RES", "DES", "LOG", "SAB", "ESP"],
  EXTRAPLANAR: ["INT", "VEL", "RES", "DES", "LOG", "SAB", "ESP"],
  VEGETAL: ["SAB", "RES"],
  FUNGI: ["SAB", "LOG"],
  "NÃO-VIVE": ["INT", "VEL", "DES", "LOG", "SAB", "ESP"],
};
