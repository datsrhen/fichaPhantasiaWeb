// staticData.js
// Processamento dos arquivos de dados estáticos.
// Executado uma única vez no carregamento do módulo — nunca dentro de componentes.

import { ancestralidades as dadosPlanilhaAncestralidades } from "../data/ancestralidades";
import { origens as dadosPlanilhaOrigens } from "../data/origens";
import { talentos as dadosPlanilhaTalentos } from "../data/talentos";

// ─── Helpers ────────────────────────────────────────────────────────────────

const agrupar = (lista, chave) => {
  if (!Array.isArray(lista)) {
    console.error("[staticData] esperava array, recebeu:", typeof lista);
    return {};
  }
  return lista.reduce((acc, item) => {
    const grupo = item[chave];
    if (!grupo) {
      console.warn("[staticData] item sem chave de agrupamento:", chave, item);
      return acc;
    }
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(item);
    return acc;
  }, {});
};

// ─── Ancestralidades ─────────────────────────────────────────────────────────

const processarAncestralidades = () => {
  try {
    const agrupado = agrupar(dadosPlanilhaAncestralidades, "Ancestralidade");
    return Object.keys(agrupado).map((nome) => ({
      nome,
      caracteristicas: agrupado[nome].map((item) => ({
        nome: item.Nome,
        descricao: item.Descrição,
        custo: item.Custo,
        id: `${item.Ancestralidade}-${item.Nome}`,
      })),
    }));
  } catch (err) {
    console.error("[staticData] erro ao processar ancestralidades:", err);
    return [];
  }
};

// ─── Origens ─────────────────────────────────────────────────────────────────

const processarOrigens = () => {
  try {
    const agrupado = agrupar(dadosPlanilhaOrigens, "Tipo");
    return Object.keys(agrupado).map((tipo) => ({
      tipo,
      opcoes: agrupado[tipo].map((item) => ({
        nome: item.Nome,
        descricao: item.Descrição,
        id: `${item.Tipo}-${item.Nome}`,
      })),
    }));
  } catch (err) {
    console.error("[staticData] erro ao processar origens:", err);
    return [];
  }
};

// ─── Talentos ─────────────────────────────────────────────────────────────────

const processarTalentos = () => {
  try {
    const agrupado = agrupar(dadosPlanilhaTalentos, "Tipo");
    return Object.keys(agrupado).map((tipo) => ({
      tipo,
      talentos: agrupado[tipo].map((item) => ({
        nome: item.Talento,
        pfsPes: item["PFs/PEs+"],
        prerequisito: item["Pré-requisito"],
        descricao: item.Descrição,
        tipo: item.Tipo,
        dif: item["Dif+"],
        circs: item["Circs+"],
        fts: item["Fts+"],
        subtipoCriacao: item["Subtipo de Criação"],
        escolaMagiaArcana: item["Escola de Magia Arcana"],
        atoMagiaEspiritual: item["Ato de Magia Espiritual"],
        id: `${item.Tipo}-${item.Talento}`,
      })),
    }));
  } catch (err) {
    console.error("[staticData] erro ao processar talentos:", err);
    return [];
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const ancestralidadesProcessadas = processarAncestralidades();
export const origensProcessadas = processarOrigens();
export const talentosProcessados = processarTalentos();

// Estado inicial dos accordions — todos fechados.
// Exportado para inicializar useState diretamente, sem useEffect.
export const ancestralidadesAbertasInicial = Object.fromEntries(
  ancestralidadesProcessadas.map((a) => [a.nome, false])
);
export const origensAbertasInicial = Object.fromEntries(
  origensProcessadas.map((o) => [o.tipo, false])
);
export const talentosAbertosInicial = Object.fromEntries(
  talentosProcessados.map((t) => [t.tipo, false])
);