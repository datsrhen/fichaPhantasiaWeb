// calculations.js
import { PONTOS_ANCESTRALIDADE } from "./constants";

// Calcular custo total das características selecionadas
export const calcularCustoTotal = (
  caracteristicasSelecionadas,
  ancestralidades
) => {
  return Object.keys(caracteristicasSelecionadas)
    .filter((id) => caracteristicasSelecionadas[id])
    .reduce((total, id) => {
      // CORREÇÃO: Usar lastIndexOf para lidar com ancestralidades com hífen
      const lastHyphenIndex = id.lastIndexOf("-");
      const ancestralidadeNome = id.substring(0, lastHyphenIndex);
      const caracteristicaNome = id.substring(lastHyphenIndex + 1);

      const ancestral = ancestralidades.find(
        (a) => a.nome === ancestralidadeNome
      );
      if (ancestral) {
        const caracteristica = ancestral.caracteristicas.find(
          (c) => c.nome === caracteristicaNome
        );
        if (caracteristica) {
          return total + caracteristica.custo;
        }
      }
      return total;
    }, 0);
};

// Calcular ancestralidades ativas
export const calcularAncestralidadesAtivas = (caracteristicasSelecionadas) => {
  const ativas = new Set();
  Object.keys(caracteristicasSelecionadas).forEach((id) => {
    if (caracteristicasSelecionadas[id]) {
      const [ancestralidade] = id.split("-");
      ativas.add(ancestralidade);
    }
  });
  return Array.from(ativas);
};

// Calcular atributos permitidos com base nas ancestralidades ativas
export const calcularAtributosPermitidos = (
  ancestralidadesAtivas,
  atributosPorAncestralidade
) => {
  const permitidos = new Set();

  console.log("=== DEBUG CALCULAR ATRIBUTOS ===");
  console.log("Ancestralidades ativas recebidas:", ancestralidadesAtivas);

  ancestralidadesAtivas.forEach((ancestralidade) => {
    const atributosDaAncestralidade =
      atributosPorAncestralidade[ancestralidade] || [];
    console.log(
      `Ancestralidade: ${ancestralidade}, Atributos:`,
      atributosDaAncestralidade
    );

    atributosDaAncestralidade.forEach((atributo) => permitidos.add(atributo));
  });

  console.log("Atributos permitidos calculados:", Array.from(permitidos));
  console.log("=== FIM DEBUG CALCULAR ATRIBUTOS ===");

  return Array.from(permitidos);
};

// Calcular pontos para distribuir nos atributos de ancestralidade
export const calcularPontosParaDistribuir = (
  pontosAncestralidadeDisponiveis,
  MAX_PONTOS_ANCESTRAL_ATRIBUTOS
) => {
  return Math.min(
    Math.max(0, pontosAncestralidadeDisponiveis),
    MAX_PONTOS_ANCESTRAL_ATRIBUTOS
  );
};

// Calcular bonus total de uma habilidade
export const calcularBonusHabilidade = (
  habilidade,
  atributos,
  pontosAtributoAncestralidade
) => {
  const getTotal = (attr) => {
    const base = atributos[attr].base || 0;
    const ancestral = atributos[attr].ancestral || 0;
    const pontosAncestralidade = pontosAtributoAncestralidade[attr] || 0;
    const bonus = atributos[attr].bonus || 0;
    return base + ancestral + pontosAncestralidade + bonus;
  };

  const valor1 = getTotal(habilidade.atributo1) || 0;
  const valor2 = getTotal(habilidade.atributo2) || 0;
  return valor1 + valor2;
};

// Calcular total de origens selecionadas
export const calcularTotalOrigensSelecionadas = (
  origensSelecionadas,
  andrilhagemSelecionada,
  magiaDespertaSelecionada
) => {
  const categoriasPrincipais =
    Object.values(origensSelecionadas).filter(Boolean).length;
  const opcoesEspeciais =
    (andrilhagemSelecionada ? 1 : 0) + (magiaDespertaSelecionada ? 1 : 0);
  return categoriasPrincipais + opcoesEspeciais;
};

// Obter características agrupadas por ancestralidade
export const obterCaracteristicasAgrupadas = (
  caracteristicasConfirmadas,
  ancestralidades
) => {
  const agrupadas = {};

  Object.keys(caracteristicasConfirmadas)
    .filter((id) => caracteristicasConfirmadas[id])
    .forEach((id) => {
      // CORREÇÃO: Usar lastIndexOf para lidar com ancestralidades com hífen
      const lastHyphenIndex = id.lastIndexOf("-");
      const ancestralidadeNome = id.substring(0, lastHyphenIndex);
      const caracteristicaNome = id.substring(lastHyphenIndex + 1);

      const ancestralidade = ancestralidades.find(
        (a) => a.nome === ancestralidadeNome
      );
      if (!ancestralidade) return;

      const caracteristica = ancestralidade.caracteristicas.find(
        (c) => c.nome === caracteristicaNome
      );
      if (!caracteristica) return;

      if (!agrupadas[ancestralidadeNome]) {
        agrupadas[ancestralidadeNome] = [];
      }

      agrupadas[ancestralidadeNome].push({
        ...caracteristica,
        id,
      });
    });

  return agrupadas;
};

// Obter origens selecionadas
export const obterOrigensSelecionadas = (
  origensSelecionadas,
  origens,
  andrilhagemSelecionada,
  magiaDespertaSelecionada
) => {
  const selecionadas = [];

  // Adicionar opções normais selecionadas
  Object.values(origensSelecionadas).forEach((opcaoId) => {
    if (opcaoId) {
      const [tipo, nome] = opcaoId.split("-");
      const origem = origens.find((o) => o.tipo === tipo);
      if (origem) {
        const opcao = origem.opcoes.find((op) => op.nome === nome);
        if (opcao) {
          selecionadas.push(opcao);
        }
      }
    }
  });

  // Adicionar opções especiais selecionadas
  if (andrilhagemSelecionada) {
    const andrilhagem = origens.find((o) => o.tipo === "Andrilhagem");
    if (andrilhagem) {
      selecionadas.push(...andrilhagem.opcoes);
    }
  }

  if (magiaDespertaSelecionada) {
    const magiaDesperta = origens.find((o) => o.tipo === "Magia Desperta");
    if (magiaDesperta) {
      selecionadas.push(...magiaDesperta.opcoes);
    }
  }

  return selecionadas;
};
