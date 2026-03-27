// @ts-nocheck
// FichaCJphant.js
import React, { useState, useEffect, memo } from "react";
import {
  AlertCircle,
  Plus,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";
// Dados estáticos pré-processados — não dependem de estado nem de efeitos
import {
  ancestralidadesProcessadas,
  origensProcessadas,
  talentosProcessados,
  ancestralidadesAbertasInicial,
  origensAbertasInicial,
  talentosAbertosInicial,
} from "./util/staticData";
import {
  PONTOS_DISPONIVEIS,
  VALOR_MINIMO,
  PONTOS_ANCESTRALIDADE,
  MAX_PONTOS_ANCESTRAL_ATRIBUTOS,
  nomeCompleto,
  nivelMaestria,
  atributosPorAncestralidade,
} from "./util/constants";
import {
  calcularCustoTotal,
  calcularAncestralidadesAtivas,
  calcularAtributosPermitidos,
  calcularPontosParaDistribuir,
  calcularBonusHabilidade,
  calcularTotalOrigensSelecionadas,
  obterCaracteristicasAgrupadas,
  obterOrigensSelecionadas,
} from "./util/calculations";
import {
  ConfirmButton,
  IconButton,
  AccordionSection,
  SelectableCard,
  ViewCard,
  SectionHeader,
  ModeIndicator,
  LockToggleButton,
  RecursoField,
  TraumaField,
} from "./components/ui-components";
// Import do contexto
import { useFicha } from "./context/useFicha";
import HabilidadesSection from "./components/HabilidadesSection";
import TalentosSection from "./components/TalentosSection";
import AncestralSection from "./components/AncestralSection";
import OrigensSection from "./components/OrigensSection";
import AtributosSection from "./components/AtributosSection";
import MovimentacaoSection from "./components/MovimentacaoSection";
import { useDebouncedField } from "./util/useDebounce";

function anexarEntradaComData(historicoAnterior, textoNovo) {
  const textoLimpo = (textoNovo ?? "").trim();

  // Se não escreveu nada, não altera o histórico
  if (!textoLimpo) return historicoAnterior ?? "";

  const carimbo = formatarDataPtBr(new Date().toISOString());
  const entrada = `${carimbo}: ${textoLimpo}\n\n`;

  return `${historicoAnterior ?? ""}${entrada}`;
}
function normalizarAnotacaoComoString(valor) {
  if (!valor) return "";
  if (typeof valor === "string") return valor;

  // Se ainda sobrou dado antigo no formato objeto, tenta aproveitar
  if (typeof valor === "object" && valor.texto) return valor.texto;

  return "";
}

const FichaCJphant = () => {
  // Usar o contexto em vez de props
  const { state, actions } = useFicha();
  const {
    descricao,
    atributos,
    fichaTrancada,
    atributosTrancados,
    ancestralidadesConfirmadas,
    caracteristicasSelecionadas,
    caracteristicasConfirmadas,
    pontosAtributoAncestralidade,
    distribuicaoAncestralConfirmada,
    distribuicaoAtributoAncestralidadeConfirmada,
    origensConfirmadas,
    origensSelecionadas,
    andrilhagemSelecionada,
    magiaDespertaSelecionada,
    habilidades,
    talentosSelecionados,
    recursos,
    movimentacao,
    anotacoes,
  } = state;

  // Controla se o modal "Anotações" está aberto
  const [isAnotacoesOpen, setIsAnotacoesOpen] = useState(false);
  // Guarda qual seção está com o modal aberto (ex: "talentos", "magias"...)
  const [secaoIdAtiva, setSecaoIdAtiva] = useState(null);

  // Estados para Anotações
  const [historico, setHistorico] = useState("");
  const [novaEntrada, setNovaEntrada] = useState("");  

  function abrirAnotacoes(secaoId) {
     //console.log("ABRINDO", secaoId, state.anotacoes?.[secaoId])
    const textoSalvoDaSecao = state.anotacoes?.[secaoId] ?? "";
    setSecaoIdAtiva(secaoId);
    setIsAnotacoesOpen(true);
  }

  // Fecha o modal e limpa a seção ativa (boa prática)
  function handleSalvarAnotacoes(secaoId, historicoCompleto) {
    actions.updateAnotacoes({ [secaoId]: historicoCompleto });
    //console.log("SALVANDO", secaoId, historicoCompleto);
  }

  function formatarDataPtBr(isoString) {
    if (!isoString) return "";
    const agora = new Date(isoString);

    return agora.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function handleFecharModal() {
    setIsAnotacoesOpen(false);
    setSecaoIdAtiva(null);
  }

  const renderCabecalhoSecao = (secaoId) => {
    
    return (
      <div className="flex items-center justify-between gap-2">
        {secaoId && (
          <button
            type="button"
            className="rounded-lg px-3 py-1 text-sm text-gray-800 font-bold hover:bg-gray-100"
            onClick={() => abrirAnotacoes(secaoId)}
          >
            Anotações
          </button>
        )}
      </div>
    );

  };
  // Estados locais (que não precisam ser persistidos entre navegações)
  const [pontosUsados, setPontosUsados] = useState(7);

  // Dados estáticos — constantes de módulo, não precisam de estado
  const ancestralidades = ancestralidadesProcessadas;
  const origens = origensProcessadas;
  const talentos = talentosProcessados;

  // Estado de UI dos accordions — inicializado das constantes, muda com interação
  const [ancestralidadesAbertas, setAncestralidadesAbertas] = useState(ancestralidadesAbertasInicial);
  const [origensAbertas, setOrigensAbertas] = useState(origensAbertasInicial);
  const [talentosAbertos, setTalentosAbertos] = useState(talentosAbertosInicial);

  // Estados para controlar edição
  const [editandoAncestralAtributos, setEditandoAncestralAtributos] =
    useState(false);
  const [
    editandoPontosAtributoAncestralidade,
    setEditandoPontosAtributoAncestralidade,
  ] = useState(false);

  // Cálculos usando as funções importadas

  // Itera sobre todas as ancestralidades — memoizado para não rodar a cada tecla
  const custoTotal = React.useMemo(
    () => calcularCustoTotal(caracteristicasSelecionadas, ancestralidades),
    [caracteristicasSelecionadas, ancestralidades]
  );

  // Aritmética pura — barato, não justifica useMemo
  const pontosRestantes = PONTOS_DISPONIVEIS - pontosUsados;
  const pontosAncestralidadeUsados = custoTotal;
  const pontosAncestralidadeDisponiveis =
    PONTOS_ANCESTRALIDADE - pontosAncestralidadeUsados;
  const pontosParaDistribuir = calcularPontosParaDistribuir(
    pontosAncestralidadeDisponiveis,
    MAX_PONTOS_ANCESTRAL_ATRIBUTOS
  );
  
  // Calcular ancestralidades ativas
  const ancestralidadesAtivas = React.useMemo(
    () => calcularAncestralidadesAtivas(caracteristicasSelecionadas),
    [caracteristicasSelecionadas]
  );

  // Calcular atributos permitidos
  const atributosPermitidos = React.useMemo(
    () =>
      calcularAtributosPermitidos(
        ancestralidadesAtivas,
        atributosPorAncestralidade
      ),
    [ancestralidadesAtivas, atributosPorAncestralidade]
  );

  // DEBUG: Verificar se NÃO-VIVE está funcionando
  /*   console.log("=== DEBUG ATRIBUTOS PERMITIDOS ===");
  console.log("Ancestralidades ativas:", ancestralidadesAtivas);
  console.log("Atributos permitidos:", atributosPermitidos);
  console.log("Configuração NÃO-VIVE:", atributosPorAncestralidade["NÃO-VIVE"]);
  console.log("=== FIM DEBUG ATRIBUTOS PERMITIDOS ==="); */

  // Calcular pontos já distribuídos nos atributos
  const pontosAncestralDistribuidos = React.useMemo(
    () => Object.values(atributos).reduce((total, attr) => total + attr.ancestral, 0),
    [atributos]
  );

  // Calcular pontos restantes para distribuir
  const pontosAncestralRestantesParaDistribuir = Math.max(
    0,
    pontosParaDistribuir - pontosAncestralDistribuidos
  );

  // Calcular total de pontos de atributo de ancestralidade disponíveis
  const totalPontosAtributoAncestralidade = ancestralidadesAtivas.length;

  // Calcular pontos de atributo de ancestralidade já distribuídos
  const pontosAtributoAncestralidadeDistribuidos = React.useMemo(
    () => Object.values(pontosAtributoAncestralidade).reduce((total, pontos) => total + pontos, 0),
    [pontosAtributoAncestralidade]
  );

  // Calcular pontos de atributo de ancestralidade restantes para distribuir
  const pontosAtributoAncestralidadeRestantes =
    totalPontosAtributoAncestralidade -
    pontosAtributoAncestralidadeDistribuidos;

  // Obter características e origens agrupadas — iteram listas, memoizados
  const caracteristicasAgrupadas = React.useMemo(
    () => obterCaracteristicasAgrupadas(caracteristicasConfirmadas, ancestralidades),
    [caracteristicasConfirmadas, ancestralidades]
  );

  const origensSelecionadasLista = React.useMemo(
    () => obterOrigensSelecionadas(
      origensSelecionadas,
      origens,
      andrilhagemSelecionada,
      magiaDespertaSelecionada
    ),
    [origensSelecionadas, origens, andrilhagemSelecionada, magiaDespertaSelecionada]
  );

  useEffect(() => {
    const total = Object.values(atributos).reduce(
      (acc, val) => acc + val.base,
      0
    
    );
    setPontosUsados(total);
  }, [atributos]);

  // Bônus das habilidades calculado como valor derivado — sem state, sem loop
  const bonusHabilidades = React.useMemo(() => {
    const resultado = {};
    if (!Array.isArray(habilidades)) return resultado;
    habilidades.forEach((hab) => {
      if (!hab?.trancada) return;
      resultado[hab.id] = calcularBonusHabilidade(
        hab,
        atributos,
        pontosAtributoAncestralidade
      );
    });
    return resultado;
  }, [habilidades, atributos, pontosAtributoAncestralidade]);



  const alterarAtributo = (atributo, valor) => {
    if (atributosTrancados) return;

    const novoValor = parseInt(valor) || VALOR_MINIMO;

    if (novoValor < VALOR_MINIMO) {
      return;
    }

    const diferenca = novoValor - atributos[atributo].base;
    if (pontosRestantes - diferenca < 0) {
      return;
    }

    // Usar action do contexto em vez de setAtributos
    const novosAtributos = {
      ...atributos,
      [atributo]: { ...atributos[atributo], base: novoValor },
    };
    actions.updateAtributos(novosAtributos);
  };

  const incrementar = React.useCallback((atributo) => {
    if (!atributosTrancados && pontosRestantes > 0) {
      alterarAtributo(atributo, atributos[atributo].base + 1);
    }
  }, [atributosTrancados, pontosRestantes, atributos, alterarAtributo]);

  const decrementar = React.useCallback((atributo) => {
    if (!atributosTrancados && atributos[atributo].base > VALOR_MINIMO) {
      alterarAtributo(atributo, atributos[atributo].base - 1);
    }
  }, [atributosTrancados, atributos, alterarAtributo]);

  // Funções para pontos de ancestralidade nos atributos
  const incrementarAncestral = React.useCallback((atributo) => {
    if (editandoAncestralAtributos && pontosAncestralRestantesParaDistribuir > 0) {
      actions.updateAtributos({ ...atributos, [atributo]: { ...atributos[atributo], ancestral: atributos[atributo].ancestral + 1 } });
    }
  }, [editandoAncestralAtributos, pontosAncestralRestantesParaDistribuir, atributos, actions]);

  const decrementarAncestral = React.useCallback((atributo) => {
    if (editandoAncestralAtributos && atributos[atributo].ancestral > 0) {
      actions.updateAtributos({ ...atributos, [atributo]: { ...atributos[atributo], ancestral: atributos[atributo].ancestral - 1 } });
    }
  }, [editandoAncestralAtributos, atributos, actions]);

  // Funções para pontos de atributo de ancestralidade
  const incrementarAtributoAncestralidade = React.useCallback((atributo) => {
    if (editandoPontosAtributoAncestralidade && pontosAtributoAncestralidadeRestantes > 0 && atributosPermitidos.includes(atributo)) {
      actions.updateAncestralidades({ pontosAtributoAncestralidade: { ...pontosAtributoAncestralidade, [atributo]: (pontosAtributoAncestralidade[atributo] || 0) + 1 } });
    }
  }, [editandoPontosAtributoAncestralidade, pontosAtributoAncestralidadeRestantes, atributosPermitidos, pontosAtributoAncestralidade, actions]);

  const decrementarAtributoAncestralidade = React.useCallback((atributo) => {
    if (editandoPontosAtributoAncestralidade && (pontosAtributoAncestralidade[atributo] || 0) > 0) {
      actions.updateAncestralidades({ pontosAtributoAncestralidade: { ...pontosAtributoAncestralidade, [atributo]: (pontosAtributoAncestralidade[atributo] || 0) - 1 } });
    }
  }, [editandoPontosAtributoAncestralidade, pontosAtributoAncestralidade, actions]);

  const incrementarBonus = React.useCallback((atributo) => {
    actions.updateAtributos({ ...atributos, [atributo]: { ...atributos[atributo], bonus: atributos[atributo].bonus + 1 } });
  }, [atributos, actions]);

  const decrementarBonus = React.useCallback((atributo) => {
    actions.updateAtributos({ ...atributos, [atributo]: { ...atributos[atributo], bonus: atributos[atributo].bonus - 1 } });
  }, [atributos, actions]);

  const alterarBonus = React.useCallback((atributo, valor) => {
    actions.updateAtributos({ ...atributos, [atributo]: { ...atributos[atributo], bonus: parseInt(valor) || 0 } });
  }, [atributos, actions]);

  const atualizarMovimentacao = React.useCallback((campo, valor) => {
    actions.updateMovimentacao({ [campo]: valor });
  }, [actions]);

  const atualizarMovimentacaoChoque = React.useCallback((campo, valor) => {
    actions.updateMovimentacao({ choque: { ...movimentacao.choque, [campo]: valor } });
  }, [actions, movimentacao.choque]);

  const atualizarMovimentacaoRestricao = React.useCallback((campo, valor) => {
    actions.updateMovimentacao({ restricao: { ...movimentacao.restricao, [campo]: valor } });
  }, [actions, movimentacao.restricao]);

  const atualizarMovimentacaoEvasao = React.useCallback((campo, valor) => {
    actions.updateMovimentacao({ evasao: { ...movimentacao.evasao, [campo]: valor } });
  }, [actions, movimentacao.evasao]);

  const resetar = React.useCallback(() => {
    if (!atributosTrancados) {
      actions.updateAtributos({
        INT: { base: 1, ancestral: 0, bonus: 0 },
        VEL: { base: 1, ancestral: 0, bonus: 0 },
        RES: { base: 1, ancestral: 0, bonus: 0 },
        DES: { base: 1, ancestral: 0, bonus: 0 },
        LOG: { base: 1, ancestral: 0, bonus: 0 },
        SAB: { base: 1, ancestral: 0, bonus: 0 },
        ESP: { base: 1, ancestral: 0, bonus: 0 },
      });
    }
  }, [atributosTrancados, actions]);

  const trancarAtributos = React.useCallback(() => {
    if (pontosRestantes === 0) {
      actions.setAtributosTrancados(true);
    }
  }, [pontosRestantes, actions]);

  const adicionarHabilidade = React.useCallback(() => {
    const novaHabilidade = {
      id: Date.now(),
      nome: "",
      atributo1: "INT",
      atributo2: "VEL",
      maestria: "I",
      trancada: false,
    };
    const novasHabilidades = [...habilidades, novaHabilidade];
    actions.updateHabilidades(novasHabilidades);
  }, [habilidades, actions]);

  const removerHabilidade = React.useCallback((id) => {
    if (!id) { console.warn("[removerHabilidade] id inválido:", id); return; }
    const novasHabilidades = habilidades.filter((hab) => hab.id !== id);
    actions.updateHabilidades(novasHabilidades);
  }, [habilidades, actions]);

  const atualizarHabilidade = React.useCallback((id, campo, valor) => {
    if (!id || !campo) { console.warn("[atualizarHabilidade] argumentos inválidos:", { id, campo }); return; }
    const novasHabilidades = habilidades.map((hab) => {
      if (hab.id === id) {
        if (campo === "maestria" && !fichaTrancada) {
          return { ...hab, [campo]: valor };
        }
        if (
          (campo === "nome" ||
            campo === "atributo1" ||
            campo === "atributo2") &&
          !hab.trancada
        ) {
          return { ...hab, [campo]: valor };
        }
        return hab;
      }
      return hab;
    });
    actions.updateHabilidades(novasHabilidades);
  }, [habilidades, fichaTrancada, actions]);

  const trancarHabilidade = React.useCallback((id) => {
    if (!id) { console.warn("[trancarHabilidade] id inválido:", id); return; }
    const novasHabilidades = habilidades.map((hab) =>
      hab.id === id ? { ...hab, trancada: true } : hab
    );
    actions.updateHabilidades(novasHabilidades);
  }, [habilidades, actions]);

  const alternarTrancaFicha = () => {
    actions.setFichaTrancada(!fichaTrancada);
  };

  // Funções para ancestralidades - MODIFICADA COM DEBUG
  const toggleAncestralidade = React.useCallback((nome) => {
    if (ancestralidadesConfirmadas) return;
    setAncestralidadesAbertas((prev) => ({ ...prev, [nome]: !prev[nome] }));
  }, [ancestralidadesConfirmadas]);

  const toggleCaracteristica = React.useCallback((caracteristicaId) => {
    if (!caracteristicaId) { console.warn("[toggleCaracteristica] id inválido:", caracteristicaId); return; }
    if (ancestralidadesConfirmadas) return;

    const lastHyphenIndex = caracteristicaId.lastIndexOf("-");
    const ancestralidadeNome = caracteristicaId.substring(0, lastHyphenIndex);
    const caracteristicaNome = caracteristicaId.substring(lastHyphenIndex + 1);

    const ancestralidade = ancestralidades.find((a) => a.nome === ancestralidadeNome);
    if (!ancestralidade) return;

    const caracteristica = ancestralidade.caracteristicas.find((c) => c.nome === caracteristicaNome);
    if (!caracteristica) return;

    const novoCusto = caracteristicasSelecionadas[caracteristicaId]
      ? pontosAncestralidadeUsados - caracteristica.custo
      : pontosAncestralidadeUsados + caracteristica.custo;

    if (novoCusto > PONTOS_ANCESTRALIDADE) return;

    actions.updateAncestralidades({
      caracteristicasSelecionadas: {
        ...caracteristicasSelecionadas,
        [caracteristicaId]: !caracteristicasSelecionadas[caracteristicaId],
      },
    });
  }, [ancestralidadesConfirmadas, ancestralidades, caracteristicasSelecionadas, pontosAncestralidadeUsados, actions]);

  const confirmarAncestralidades = React.useCallback(() => {
    actions.updateAncestralidades({
      ancestralidadesConfirmadas: true,
      caracteristicasConfirmadas: { ...caracteristicasSelecionadas },
    });
  }, [actions, caracteristicasSelecionadas]);

  // Funções para distribuição de pontos de ancestralidade nos atributos
  const iniciarDistribuicaoAncestral = React.useCallback(() => {
    setEditandoAncestralAtributos(true);
  }, []);

  const confirmarDistribuicaoAncestral = React.useCallback(() => {
    setEditandoAncestralAtributos(false);
    actions.updateAncestralidades({ distribuicaoAncestralConfirmada: true });
  }, [actions]);

  const iniciarDistribuicaoAtributoAncestralidade = React.useCallback(() => {
    setEditandoPontosAtributoAncestralidade(true);
  }, []);

  const confirmarDistribuicaoAtributoAncestralidade = React.useCallback(() => {
    setEditandoPontosAtributoAncestralidade(false);
    actions.updateAncestralidades({ distribuicaoAtributoAncestralidadeConfirmada: true });
  }, [actions]);


  // Funções para Origens
  const toggleOrigem = React.useCallback((tipo) => {
    if (origensConfirmadas) return;
    setOrigensAbertas((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  }, [origensConfirmadas]);

  const toggleOpcaoOrigem = React.useCallback((opcaoId) => {
    if (!opcaoId) { console.warn("[toggleOpcaoOrigem] opcaoId inválido:", opcaoId); return; }
    if (origensConfirmadas) return;

    const [tipo] = opcaoId.split("-");
    const totalAtual = calcularTotalOrigensSelecionadas(
      origensSelecionadas, andrilhagemSelecionada, magiaDespertaSelecionada
    );
    const jaSelecionada =
      (tipo === "Andrilhagem" && andrilhagemSelecionada) ||
      (tipo === "Magia Desperta" && magiaDespertaSelecionada) ||
      origensSelecionadas[tipo] === opcaoId;

    if (!jaSelecionada && totalAtual >= 3) return;

    if (tipo === "Andrilhagem") {
      actions.updateOrigens({ andrilhagemSelecionada: !andrilhagemSelecionada });
      return;
    }
    if (tipo === "Magia Desperta") {
      actions.updateOrigens({ magiaDespertaSelecionada: !magiaDespertaSelecionada });
      return;
    }
    actions.updateOrigens({
      origensSelecionadas: {
        ...origensSelecionadas,
        [tipo]: origensSelecionadas[tipo] === opcaoId ? null : opcaoId,
      },
    });
  }, [origensConfirmadas, origensSelecionadas, andrilhagemSelecionada, magiaDespertaSelecionada, actions]);

  const confirmarOrigens = React.useCallback(() => {
    actions.updateOrigens({ origensConfirmadas: true });
  }, [actions]);



  // Funções para Talentos - MODIFICADAS para nova estratégia
  const toggleTalentos = React.useCallback((tipo) => {
    if (fichaTrancada) return;
    setTalentosAbertos((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  }, [fichaTrancada]);

  const toggleTalento = React.useCallback((talentoId) => {
    if (!talentoId) { console.warn("[toggleTalento] talentoId inválido:", talentoId); return; }
    if (fichaTrancada) return;
    const novosTalentos = {
      ...talentosSelecionados,
      [talentoId]: !talentosSelecionados[talentoId],
    };
    actions.updateTalentos(novosTalentos);
  }, [fichaTrancada, talentosSelecionados, actions]);



  // Função auxiliar para renderizar campo condicional
  // Funções para atualizar descrição
  const atualizarDescricao = (campo, valor) => {
    actions.updateDescricao({ [campo]: valor });
  };

  // Campos longos — estado local com sync debounced (400ms)
  // Evita dispatch global a cada tecla em textareas
  const { localValue: aparenciaLocal, handleChange: handleAparenciaChange } =
    useDebouncedField(descricao.aparencia, (v) =>
      atualizarDescricao("aparencia", v)
    );

  const { localValue: historiaLocal, handleChange: handleHistoriaChange } =
    useDebouncedField(descricao.historia, (v) =>
      atualizarDescricao("historia", v)
    );

  // NOVAS FUNÇÕES: Atualizar recursos
  const atualizarRecursos = (novosRecursos) => {
    actions.updateRecursos(novosRecursos);
  };

  const historicoDaSecao =
    normalizarAnotacaoComoString(state.anotacoes?.[secaoIdAtiva]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Ficha de Personagem - Phantasia
            </h1>
            
              <ModalAnotacoes
                isOpen={isAnotacoesOpen}
                secaoId={secaoIdAtiva}
                tituloSecao={secaoIdAtiva}
                textoInicial={historicoDaSecao}
                atualizadoEm={formatarDataPtBr(historicoDaSecao.atualizadoEm)}
                onSave={handleSalvarAnotacoes}
                onClose={handleFecharModal}
              />
            <LockToggleButton
              isLocked={fichaTrancada}
              onToggle={alternarTrancaFicha}
            />
          </div>
          {/* CAMPOS DE DESCRIÇÃO - MODIFICADO COM NOVO LAYOUT DE RECURSOS */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Coluna 1-2: Nome e Idade lado a lado + Convicção e Vício */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Campo Nome - MAIOR */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={descricao.nome}
                    onChange={(e) => atualizarDescricao("nome", e.target.value)}
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Nome do personagem"
                  />
                </div>

                {/* Campo Idade - MENOR */}
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Idade
                  </label>
                  <input
                    type="text"
                    value={descricao.idade}
                    onChange={(e) =>
                      atualizarDescricao("idade", e.target.value)
                    }
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Idade"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Convicção e Vício empilhados abaixo */}
              <div className="space-y-4">
                {/* Campo Convicção */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Convicção
                  </label>
                  <input
                    type="text"
                    value={descricao.conviccao}
                    onChange={(e) =>
                      atualizarDescricao("conviccao", e.target.value)
                    }
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Crenças e princípios"
                  />
                </div>

                {/* Campo Vício */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Vício
                  </label>
                  <input
                    type="text"
                    value={descricao.vicio}
                    onChange={(e) =>
                      atualizarDescricao("vicio", e.target.value)
                    }
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Vícios e fraquezas"
                  />
                </div>
              </div>
            </div>

            {/* Coluna 3-5: Aparência e História lado a lado + NOVA CAIXA DE RECURSOS abaixo */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Campo Aparência */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Aparência
                  </label>
                  <textarea
                    value={aparenciaLocal}
                    onChange={handleAparenciaChange}
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    placeholder="Descrição física"
                    rows="3"
                  />
                </div>

                {/* Campo História */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    História
                  </label>
                  <textarea
                    value={historiaLocal}
                    onChange={handleHistoriaChange}
                    disabled={fichaTrancada}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    placeholder="Antecedentes e história"
                    rows="3"
                  />
                </div>
              </div>

              {/* NOVA CAIXA DE RECURSOS VERMELHA - TODOS OS CAMPOS JUNTOS (SEMPRE EDITÁVEIS) */}
              <div className="border-2 border-red-300 bg-red-50 rounded-lg p-3">
                {/* Linha superior: PFs, PEs, PCs, DD lado a lado */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* PFs */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-red-700 mb-1">
                      PFs
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={recursos.pfs.current || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pfs: {
                              ...recursos.pfs,
                              current: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="font-bold">/</span>
                      <input
                        type="number"
                        value={recursos.pfs.max || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pfs: {
                              ...recursos.pfs,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* PEs */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-red-700 mb-1">
                      PEs
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={recursos.pes.current || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pes: {
                              ...recursos.pes,
                              current: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="font-bold">/</span>
                      <input
                        type="number"
                        value={recursos.pes.max || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pes: {
                              ...recursos.pes,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* PCs */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-red-700 mb-1">
                      PCs
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={recursos.pcs.current || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pcs: {
                              ...recursos.pcs,
                              current: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="font-bold">/</span>
                      <input
                        type="number"
                        value={recursos.pcs.max || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            pcs: {
                              ...recursos.pcs,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* NOVO CAMPO: DD */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-red-700 mb-1">
                      DD
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={recursos.dd?.current || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            dd: {
                              ...recursos.dd,
                              current: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="font-bold">/</span>
                      <input
                        type="number"
                        value={recursos.dd?.max || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            dd: {
                              ...recursos.dd,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Linha inferior: Traumas */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-red-700">
                      Traumas
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={recursos.traumas.current || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            traumas: {
                              ...recursos.traumas,
                              current: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="font-bold text-xs">/</span>
                      <input
                        type="number"
                        value={recursos.traumas.max || 0}
                        onChange={(e) =>
                          atualizarRecursos({
                            traumas: {
                              ...recursos.traumas,
                              max: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>
                  <textarea
                    value={recursos.traumas.description || ""}
                    onChange={(e) =>
                      atualizarRecursos({
                        traumas: {
                          ...recursos.traumas,
                          description: e.target.value,
                        },
                      })
                    }
                    placeholder="Descrição dos traumas..."
                    className="w-full h-16 px-2 py-1 border border-gray-300 rounded text-xs focus:border-red-500 focus:outline-none resize-none overflow-y-auto"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna Esquerda - Largura independente para cada caixa */}
          <div className="flex flex-col gap-6">
            {/* Seção de Atributos — componente isolado com React.memo */}
            <AtributosSection
              atributos={atributos}
              atributosTrancados={atributosTrancados}
              pontosRestantes={pontosRestantes}
              pontosAtributoAncestralidade={pontosAtributoAncestralidade}
              atributosPermitidos={atributosPermitidos}
              ancestralidadesConfirmadas={ancestralidadesConfirmadas}
              distribuicaoAncestralConfirmada={distribuicaoAncestralConfirmada}
              distribuicaoAtributoAncestralidadeConfirmada={distribuicaoAtributoAncestralidadeConfirmada}
              pontosParaDistribuir={pontosParaDistribuir}
              pontosAncestralRestantesParaDistribuir={pontosAncestralRestantesParaDistribuir}
              pontosAtributoAncestralidadeRestantes={pontosAtributoAncestralidadeRestantes}
              totalPontosAtributoAncestralidade={totalPontosAtributoAncestralidade}
              editandoAncestralAtributos={editandoAncestralAtributos}
              editandoPontosAtributoAncestralidade={editandoPontosAtributoAncestralidade}
              onAnotacoes={abrirAnotacoes}
              onTrancar={trancarAtributos}
              onResetar={resetar}
              onIncrementar={incrementar}
              onDecrementar={decrementar}
              onIncrementarAncestral={incrementarAncestral}
              onDecrementarAncestral={decrementarAncestral}
              onIncrementarAtributoAncestralidade={incrementarAtributoAncestralidade}
              onDecrementarAtributoAncestralidade={decrementarAtributoAncestralidade}
              onIncrementarBonus={incrementarBonus}
              onDecrementarBonus={decrementarBonus}
              onAlterarBonus={alterarBonus}
              onIniciarDistribuicaoAncestral={iniciarDistribuicaoAncestral}
              onConfirmarDistribuicaoAncestral={confirmarDistribuicaoAncestral}
              onIniciarDistribuicaoAtributo={iniciarDistribuicaoAtributoAncestralidade}
              onConfirmarDistribuicaoAtributo={confirmarDistribuicaoAtributoAncestralidade}
            />

            {/* Seção de Movimentação — componente isolado com React.memo */}
            <MovimentacaoSection
              atributos={atributos}
              movimentacao={movimentacao}
              fichaTrancada={fichaTrancada}
              pontosAtributoAncestralidade={pontosAtributoAncestralidade}
              onAtualizar={atualizarMovimentacao}
              onAtualizarChoque={atualizarMovimentacaoChoque}
              onAtualizarRestricao={atualizarMovimentacaoRestricao}
              onAtualizarEvasao={atualizarMovimentacaoEvasao}
            />

                        {/* Seção de Ancestralidades — componente isolado com React.memo */}
            <AncestralSection
              ancestralidades={ancestralidades}
              ancestralidadesConfirmadas={ancestralidadesConfirmadas}
              caracteristicasSelecionadas={caracteristicasSelecionadas}
              caracteristicasAgrupadas={caracteristicasAgrupadas}
              ancestralidadesAbertas={ancestralidadesAbertas}
              pontosAncestralidadeDisponiveis={pontosAncestralidadeDisponiveis}
              onToggleAncestralidade={toggleAncestralidade}
              onToggleCaracteristica={toggleCaracteristica}
              onConfirmar={confirmarAncestralidades}
            />

            {/* Seção de Origens — componente isolado com React.memo */}
            <OrigensSection
              origens={origens}
              origensConfirmadas={origensConfirmadas}
              origensSelecionadas={origensSelecionadas}
              andrilhagemSelecionada={andrilhagemSelecionada}
              magiaDespertaSelecionada={magiaDespertaSelecionada}
              origensSelecionadasLista={origensSelecionadasLista}
              origensAbertas={origensAbertas}
              onToggleOrigem={toggleOrigem}
              onToggleOpcao={toggleOpcaoOrigem}
              onConfirmar={confirmarOrigens}
              onAnotacoes={abrirAnotacoes}
            />
          </div>

          {/* Coluna Direita: Habilidades e Talentos - Altura ajustada */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Seção de Habilidades — componente isolado com React.memo */}
            <HabilidadesSection
              habilidades={habilidades}
              bonusHabilidades={bonusHabilidades}
              atributos={atributos}
              fichaTrancada={fichaTrancada}
              adicionarHabilidade={adicionarHabilidade}
              removerHabilidade={removerHabilidade}
              atualizarHabilidade={atualizarHabilidade}
              trancarHabilidade={trancarHabilidade}
            />

            {/* Seção de Talentos — componente isolado com React.memo */}
            <TalentosSection
              talentos={talentos}
              talentosSelecionados={talentosSelecionados}
              talentosAbertos={talentosAbertos}
              fichaTrancada={fichaTrancada}
              onToggleTalentos={toggleTalentos}
              onToggleTalento={toggleTalento}
              onAnotacoes={abrirAnotacoes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
const ModalAnotacoes = memo(function ModalAnotacoes({
    isOpen,
    secaoId,
    tituloSecao,
    textoInicial,
    onSave,
    onClose,
  }) {
  const [textoRascunho, setTextoRascunho] = useState("");
  const [historico, setHistorico] = useState("");
  const [novaEntrada, setNovaEntrada] = useState("");
    
    // Sempre que abrir (ou mudar de seção), carrega o texto inicial no rascunho
  useEffect(() => {
    if (!isOpen) return;

    setHistorico(textoInicial ?? "");
    setNovaEntrada("");
  }, [isOpen, secaoId, textoInicial]);

    // Se não estiver aberto, não renderiza nada
    if (!isOpen) return null;
    
  function handleSalvarEFechar() {
    if (!secaoId) return;

    const historicoAtualizado = anexarEntradaComData(historico, novaEntrada);

    // Atualiza o histórico exibido na tela também (fica consistente)
    setHistorico(historicoAtualizado);
    setNovaEntrada("");

    // Persistência: salva a string histórica inteira
    onSave(secaoId, historicoAtualizado);

    onClose();
  }    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay fecha */}
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
          aria-label="Fechar anotações"
        />

        {/* Card */}
        <div
          className="relative z-10 w-[min(520px,92vw)] rounded-2xl bg-white p-4 shadow-xl text-gray-800"
          onClick={(evento) => evento.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Anotações{tituloSecao ? ` — ${tituloSecao}` : ""}
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-100"
                onClick={(evento) => {
                  evento.stopPropagation();
                  onClose();
                }}
              >
                Fechar
              </button>

              <button
                type="button"
                className="rounded-lg px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-100"
                onClick={(evento) => {
                  evento.stopPropagation();
                  handleSalvarEFechar();
                }}
              >
                Salvar
              </button>
            </div>
          </div>
          <textarea
            className="mt-3 w-full min-h-[160px] rounded-xl border border-gray-300 p-3 text-sm outline-none bg-gray-50"
            value={historico}
            readOnly
          />
          <textarea
            className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-300 p-3 text-sm outline-none"
            placeholder="Nova anotação..."
            value={novaEntrada}
            onChange={(evento) => setNovaEntrada(evento.target.value)}
            autoFocus
          />
        </div>
      </div>
    );
});
export default FichaCJphant;