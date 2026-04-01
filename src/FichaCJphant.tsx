// @ts-nocheck
// FichaCJphant.js
import React, { useState, useEffect, memo } from "react";
import {
  AlertCircle, Plus, Lock, Unlock, ChevronDown, ChevronUp, Edit3,
} from "./components/icons";
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
import IdentidadeSection from "./components/IdentidadeSection";
import { useDebouncedField } from "./util/useDebounce";


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

  const alternarTrancaFicha = React.useCallback(() => {
    actions.setFichaTrancada(!fichaTrancada);
  }, [actions, fichaTrancada]);

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
  const atualizarDescricao = React.useCallback((campo, valor) => {
    actions.updateDescricao({ [campo]: valor });
  }, [actions]);

  const atualizarRecursos = React.useCallback((novosRecursos) => {
    actions.updateRecursos(novosRecursos);
  }, [actions]);

  const historicoDaSecao =
    normalizarAnotacaoComoString(state.anotacoes?.[secaoIdAtiva]);
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Identidade — componente isolado com React.memo */}
        <IdentidadeSection
          descricao={descricao}
          recursos={recursos}
          fichaTrancada={fichaTrancada}
          isAnotacoesOpen={isAnotacoesOpen}
          secaoIdAtiva={secaoIdAtiva}
          historicoDaSecao={historicoDaSecao}
          onSalvarAnotacoes={handleSalvarAnotacoes}
          onFecharModal={handleFecharModal}
          onTrancaFicha={alternarTrancaFicha}
          onAtualizarDescricao={atualizarDescricao}
          onAtualizarRecursos={atualizarRecursos}
        />
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
export default FichaCJphant;