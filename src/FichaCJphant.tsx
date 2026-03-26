// @ts-nocheck
// FichaCJphant.js
import React, { useState, useEffect, memo } from "react";
import {
  AlertCircle,
  CheckCircle2,
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
  IncrementDecrementButton,
  ConfirmButton,
  IconButton,
  AccordionSection,
  SelectableCard,
  ViewCard,
  StatusPanel,
  SectionHeader,
  BonusInput,
  ModeIndicator,
  LockToggleButton,
  RecursoField,
  TraumaField,
} from "./components/ui-components";
// Import do contexto
import { useFicha } from "./context/useFicha";
import HabilidadesSection from "./components/HabilidadesSection";
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

  const incrementar = (atributo) => {
    if (!atributosTrancados && pontosRestantes > 0) {
      alterarAtributo(atributo, atributos[atributo].base + 1);
    }
  };

  const decrementar = (atributo) => {
    if (!atributosTrancados && atributos[atributo].base > VALOR_MINIMO) {
      alterarAtributo(atributo, atributos[atributo].base - 1);
    }
  };

  // Funções para pontos de ancestralidade nos atributos
  const incrementarAncestral = (atributo) => {
    if (
      editandoAncestralAtributos &&
      pontosAncestralRestantesParaDistribuir > 0
    ) {
      const novosAtributos = {
        ...atributos,
        [atributo]: {
          ...atributos[atributo],
          ancestral: atributos[atributo].ancestral + 1,
        },
      };
      actions.updateAtributos(novosAtributos);
    }
  };

  const decrementarAncestral = (atributo) => {
    if (editandoAncestralAtributos && atributos[atributo].ancestral > 0) {
      const novosAtributos = {
        ...atributos,
        [atributo]: {
          ...atributos[atributo],
          ancestral: atributos[atributo].ancestral - 1,
        },
      };
      actions.updateAtributos(novosAtributos);
    }
  };

  // Funções para pontos de atributo de ancestralidade
  const incrementarAtributoAncestralidade = (atributo) => {
    if (
      editandoPontosAtributoAncestralidade &&
      pontosAtributoAncestralidadeRestantes > 0 &&
      atributosPermitidos.includes(atributo)
    ) {
      const novosPontos = {
        ...pontosAtributoAncestralidade,
        [atributo]: (pontosAtributoAncestralidade[atributo] || 0) + 1,
      };
      actions.updateAncestralidades({
        pontosAtributoAncestralidade: novosPontos,
      });
    }
  };

  const decrementarAtributoAncestralidade = (atributo) => {
    if (
      editandoPontosAtributoAncestralidade &&
      (pontosAtributoAncestralidade[atributo] || 0) > 0
    ) {
      const novosPontos = {
        ...pontosAtributoAncestralidade,
        [atributo]: (pontosAtributoAncestralidade[atributo] || 0) - 1,
      };
      actions.updateAncestralidades({
        pontosAtributoAncestralidade: novosPontos,
      });
    }
  };

  // Funções para bônus (sempre editáveis) - MODIFICADAS para permitir valores negativos
  const incrementarBonus = (atributo) => {
    const novosAtributos = {
      ...atributos,
      [atributo]: {
        ...atributos[atributo],
        bonus: atributos[atributo].bonus + 1,
      },
    };
    actions.updateAtributos(novosAtributos);
  };

  const decrementarBonus = (atributo) => {
    const novosAtributos = {
      ...atributos,
      [atributo]: {
        ...atributos[atributo],
        bonus: atributos[atributo].bonus - 1,
      },
    };
    actions.updateAtributos(novosAtributos);
  };

  const alterarBonus = (atributo, valor) => {
    const novoValor = parseInt(valor) || 0;
    const novosAtributos = {
      ...atributos,
      [atributo]: {
        ...atributos[atributo],
        bonus: novoValor,
      },
    };
    actions.updateAtributos(novosAtributos);
  };

  // NOVAS FUNÇÕES: Atualizar movimentação
  const atualizarMovimentacao = (campo, valor) => {
    actions.updateMovimentacao({ [campo]: valor });
  };

  const atualizarMovimentacaoChoque = (campo, valor) => {
    actions.updateMovimentacao({
      choque: { ...movimentacao.choque, [campo]: valor },
    });
  };

  const atualizarMovimentacaoRestricao = (campo, valor) => {
    actions.updateMovimentacao({
      restricao: { ...movimentacao.restricao, [campo]: valor },
    });
  };

  const atualizarMovimentacaoEvasao = (campo, valor) => {
    actions.updateMovimentacao({
      evasao: { ...movimentacao.evasao, [campo]: valor },
    });
  };

  const resetar = () => {
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
  };

  const trancarAtributos = () => {
    if (pontosRestantes === 0) {
      actions.setAtributosTrancados(true);
    }
  };

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

  const toggleCaracteristica = (caracteristicaId) => {
    if (ancestralidadesConfirmadas) return;

/*     console.log("=== DEBUG TOGGLE CARACTERÍSTICA ===");
    console.log("Tentando alternar característica:", caracteristicaId); */

    // CORREÇÃO: Encontrar o último hífen para separar corretamente
    const lastHyphenIndex = caracteristicaId.lastIndexOf("-");
    const ancestralidadeNome = caracteristicaId.substring(0, lastHyphenIndex);
    const caracteristicaNome = caracteristicaId.substring(lastHyphenIndex + 1);

/*     console.log("Ancestralidade extraída:", ancestralidadeNome);
    console.log("Característica extraída:", caracteristicaNome); */

    const ancestralidade = ancestralidades.find(
      (a) => a.nome === ancestralidadeNome
    );

/*     console.log("Ancestralidade encontrada:", ancestralidade); */

    if (!ancestralidade) {
/*       console.log("Ancestralidade NÃO encontrada!"); */
      return;
    }

    const caracteristica = ancestralidade.caracteristicas.find(
      (c) => c.nome === caracteristicaNome
    );

/*     console.log("Característica encontrada:", caracteristica); */

    if (!caracteristica) {
/*       console.log("Característica NÃO encontrada!"); */
      return;
    }

    const novoCusto = caracteristicasSelecionadas[caracteristicaId]
      ? pontosAncestralidadeUsados - caracteristica.custo
      : pontosAncestralidadeUsados + caracteristica.custo;

/*     console.log("Custo atual:", pontosAncestralidadeUsados);
    console.log("Novo custo:", novoCusto); */

    // Verificar se excede os pontos disponíveis
    if (novoCusto > PONTOS_ANCESTRALIDADE) {
/*       console.log("Excede pontos disponíveis"); */
      return;
    }

    const novasCaracteristicas = {
      ...caracteristicasSelecionadas,
      [caracteristicaId]: !caracteristicasSelecionadas[caracteristicaId],
    };

/*     console.log("Novas características:", novasCaracteristicas);
    console.log("=== FIM DEBUG TOGGLE CARACTERÍSTICA ==="); */

    actions.updateAncestralidades({
      caracteristicasSelecionadas: novasCaracteristicas,
    });
  };

  const confirmarAncestralidades = () => {
    actions.updateAncestralidades({
      ancestralidadesConfirmadas: true,
      caracteristicasConfirmadas: { ...caracteristicasSelecionadas },
    });
  };

  // Funções para distribuição de pontos de ancestralidade nos atributos
  const iniciarDistribuicaoAncestral = () => {
    setEditandoAncestralAtributos(true);
  };

  const confirmarDistribuicaoAncestral = () => {
    setEditandoAncestralAtributos(false);
    actions.updateAncestralidades({ distribuicaoAncestralConfirmada: true });
  };

  // Funções para distribuição de pontos de atributo de ancestralidade
  const iniciarDistribuicaoAtributoAncestralidade = () => {
    setEditandoPontosAtributoAncestralidade(true);
  };

  const confirmarDistribuicaoAtributoAncestralidade = () => {
    setEditandoPontosAtributoAncestralidade(false);
    actions.updateAncestralidades({
      distribuicaoAtributoAncestralidadeConfirmada: true,
    });
  };


  // Funções para Origens
  const toggleOrigem = React.useCallback((tipo) => {
    if (origensConfirmadas) return;
    setOrigensAbertas((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  }, [origensConfirmadas]);

  const toggleOpcaoOrigem = (opcaoId) => {
    if (origensConfirmadas) return;

    const [tipo, nome] = opcaoId.split("-");
    const totalAtual = calcularTotalOrigensSelecionadas(
      origensSelecionadas,
      andrilhagemSelecionada,
      magiaDespertaSelecionada
    );

    // Verificar se está tentando selecionar uma nova opção quando já tem 3
    const jaSelecionada =
      (tipo === "Andrilhagem" && andrilhagemSelecionada) ||
      (tipo === "Magia Desperta" && magiaDespertaSelecionada) ||
      origensSelecionadas[tipo] === opcaoId;

    if (!jaSelecionada && totalAtual >= 3) {
      return; // Não permite selecionar mais de 3 opções
    }

    // Verificar se é uma das opções especiais
    if (tipo === "Andrilhagem") {
      actions.updateOrigens({
        andrilhagemSelecionada: !andrilhagemSelecionada,
      });
      return;
    }

    if (tipo === "Magia Desperta") {
      actions.updateOrigens({
        magiaDespertaSelecionada: !magiaDespertaSelecionada,
      });
      return;
    }

    // Para as opções normais, usar seleção única por tipo
    const novasOrigens = {
      ...origensSelecionadas,
      [tipo]: origensSelecionadas[tipo] === opcaoId ? null : opcaoId,
    };
    actions.updateOrigens({ origensSelecionadas: novasOrigens });
  };

  const confirmarOrigens = () => {
    actions.updateOrigens({ origensConfirmadas: true });
  };



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
  const renderCampo = (rotulo, valor) => {
    if (!valor || valor === "" || valor === "0" || valor === 0) return null;
    return (
      <div className="flex">
        <span className="font-semibold text-gray-700 min-w-[120px]">
          {rotulo}:
        </span>
        <span className="text-gray-600 flex-1">{valor}</span>
      </div>
    );
  };

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
            {/* Seção de Atributos - Mantém largura estreita */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-4">
              <SectionHeader title="Atributos">
                {renderCabecalhoSecao("atributos")}
              </SectionHeader>
                      
              {/* Seção de Pontos Restantes */}
              {!atributosTrancados && (
                <StatusPanel
                  icon={pontosRestantes === 0 ? CheckCircle2 : AlertCircle}
                  iconColor={pontosRestantes === 0 ? "green" : "blue"}
                  title="Restantes"
                  value={pontosRestantes}
                  valueColor="blue"
                  action={pontosRestantes === 0}
                  actionText="Confirmar Distribuição"
                  onAction={trancarAtributos}
                />
              )}

              {/* Seção de Pontos de Ancestralidade para Atributos */}
              {ancestralidadesConfirmadas &&
                pontosParaDistribuir > 0 &&
                !distribuicaoAncestralConfirmada && (
                  <StatusPanel
                    icon={AlertCircle}
                    iconColor="purple"
                    title="Pontos de Ancestralidade"
                    value={`${pontosAncestralRestantesParaDistribuir} / ${pontosParaDistribuir}`}
                    valueColor="purple"
                    action={true}
                    actionText={
                      !editandoAncestralAtributos ? "Distribuir" : "Confirmar"
                    }
                    onAction={
                      !editandoAncestralAtributos
                        ? iniciarDistribuicaoAncestral
                        : confirmarDistribuicaoAncestral
                    }
                    className="bg-purple-50 border-2 border-purple-200 text-xs"
                  />
                )}

              {/* Seção de Pontos de Atributo de Ancestralidade */}
              {ancestralidadesConfirmadas &&
                totalPontosAtributoAncestralidade > 0 &&
                !distribuicaoAtributoAncestralidadeConfirmada && (
                  <StatusPanel
                    icon={AlertCircle}
                    iconColor="indigo"
                    title="Pontos de Atributo de Ancestralidade"
                    value={`${pontosAtributoAncestralidadeRestantes} / ${totalPontosAtributoAncestralidade}`}
                    valueColor="indigo"
                    action={true}
                    actionText={
                      !editandoPontosAtributoAncestralidade
                        ? "Distribuir"
                        : "Confirmar"
                    }
                    onAction={
                      !editandoPontosAtributoAncestralidade
                        ? iniciarDistribuicaoAtributoAncestralidade
                        : confirmarDistribuicaoAtributoAncestralidade
                    }
                    className="bg-indigo-50 border-2 border-indigo-200 text-xs"
                  >
                    <div className="text-xs text-indigo-600 mb-2">
                      Atributos permitidos: {atributosPermitidos.join(", ")}
                    </div>
                  </StatusPanel>
                )}

              <div className="space-y-2">
                {/* CABEÇALHO DAS COLUNAS - AGORA ACIMA DE TUDO */}
                <div className="flex justify-end gap-1 pb-2 text-xs text-gray-500 border-b border-gray-200">
                  <div className="min-w-[34px] text-center">Total</div>
                  <div className="min-w-[34px] text-center">Base</div>
                  <div className="min-w-[34px] text-center">Anc.</div>
                  <div className="min-w-[34px] text-center">Bônus</div>
                </div>

                {Object.keys(atributos).map((atributo) => {
                  const total =
                    atributos[atributo].base +
                    atributos[atributo].ancestral +
                    (pontosAtributoAncestralidade[atributo] || 0) +
                    atributos[atributo].bonus;
                  const pontosAtributoAncestral =
                    pontosAtributoAncestralidade[atributo] || 0;
                  const atributoPermitido =
                    atributosPermitidos.includes(atributo);

                  return (
                    <div
                      key={atributo}
                      className={`border border-gray-200 rounded p-2 transition-colors ${
                        !atributoPermitido &&
                        editandoPontosAtributoAncestralidade
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm">{atributo}</div>
                          <div className="text-xs text-gray-600 truncate">
                            {nomeCompleto[atributo]}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="bg-gray-300 rounded px-1 py-1 min-w-[34px] text-center">
                            <div className="text-lg font-bold">{total}</div>
                          </div>

                          <div className="min-w-[34px] text-center">
                            {!atributosTrancados ? (
                              <IncrementDecrementButton
                                onIncrement={() => incrementar(atributo)}
                                onDecrement={() => decrementar(atributo)}
                                value={atributos[atributo].base}
                                incrementDisabled={pontosRestantes <= 0}
                                decrementDisabled={
                                  atributos[atributo].base <= VALOR_MINIMO
                                }
                                color="green"
                              />
                            ) : (
                              <div className="text-base font-bold">
                                {atributos[atributo].base}
                              </div>
                            )}
                          </div>

                          <div className="min-w-[34px] text-center">
                            {editandoAncestralAtributos ? (
                              <IncrementDecrementButton
                                onIncrement={() =>
                                  incrementarAncestral(atributo)
                                }
                                onDecrement={() =>
                                  decrementarAncestral(atributo)
                                }
                                value={
                                  atributos[atributo].ancestral +
                                  pontosAtributoAncestral
                                }
                                incrementDisabled={
                                  pontosAncestralRestantesParaDistribuir <= 0
                                }
                                decrementDisabled={
                                  atributos[atributo].ancestral <= 0
                                }
                                color="purple"
                              />
                            ) : editandoPontosAtributoAncestralidade ? (
                              <IncrementDecrementButton
                                onIncrement={() =>
                                  incrementarAtributoAncestralidade(atributo)
                                }
                                onDecrement={() =>
                                  decrementarAtributoAncestralidade(atributo)
                                }
                                value={
                                  atributos[atributo].ancestral +
                                  pontosAtributoAncestral
                                }
                                incrementDisabled={
                                  pontosAtributoAncestralidadeRestantes <= 0 ||
                                  !atributoPermitido
                                }
                                decrementDisabled={pontosAtributoAncestral <= 0}
                                color="indigo"
                              />
                            ) : (
                              <div className="text-base font-bold">
                                {atributos[atributo].ancestral +
                                  pontosAtributoAncestral}
                              </div>
                            )}
                          </div>

                          {/* NOVA COLUNA BÔNUS - MODIFICADA para permitir valores negativos */}
                          <div className="min-w-[34px] text-center">
                            <BonusInput
                              value={atributos[atributo].bonus}
                              onIncrement={() => incrementarBonus(atributo)}
                              onDecrement={() => decrementarBonus(atributo)}
                              onChange={(e) =>
                                alterarBonus(atributo, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!atributosTrancados && (
                <button
                  onClick={resetar}
                  className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded transition-colors text-sm"
                >
                  Resetar Atributos
                </button>
              )}
            </div>

            {/* Seção de Movimentação - NOVA SEÇÃO */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-4">
              <SectionHeader title="Movimentação" />

              <div className="space-y-3">
                {/* Campo Veloc. */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 min-w-[50px]">
                    Veloc.
                  </label>
                  <input
                    type="text"
                    value={movimentacao.velocidade || ""}
                    onChange={(e) =>
                      atualizarMovimentacao("velocidade", e.target.value)
                    }
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Velocidade de movimento"
                    disabled={fichaTrancada}
                  />
                </div>

                {/* Tabela de Movimentação */}
                <div className="border border-gray-200 rounded">
                  {/* Cabeçalho da tabela */}
                  <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50">
                    <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                      mov.
                    </div>
                    <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                      causado
                    </div>
                    <div className="p-2 text-xs font-medium text-gray-700">
                      mitigado
                    </div>
                  </div>

                  {/* Linha Choque */}
                  <div className="grid grid-cols-3 border-b border-gray-200">
                    <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                      Choque
                    </div>
                    <div className="p-2 border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={movimentacao.choque.atual || 0}
                          onChange={(e) =>
                            atualizarMovimentacaoChoque(
                              "atual",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                          min="0"
                        />
                        <span className="text-xs">/</span>
                        <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                          {Math.floor(
                            (atributos.INT.base +
                              atributos.INT.ancestral +
                              (pontosAtributoAncestralidade.INT || 0) +
                              atributos.INT.bonus) /
                              2
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <input
                        type="number"
                        value={movimentacao.mitigadoChoque || 0}
                        onChange={(e) =>
                          atualizarMovimentacao(
                            "mitigadoChoque",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                        disabled={fichaTrancada}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Linha Restrição */}
                  <div className="grid grid-cols-3 border-b border-gray-200">
                    <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                      Restrição
                    </div>
                    <div className="p-2 border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={movimentacao.restricao.atual || 0}
                          onChange={(e) =>
                            atualizarMovimentacaoRestricao(
                              "atual",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                          min="0"
                        />
                        <span className="text-xs">/</span>
                        <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                          {Math.floor(
                            (atributos.DES.base +
                              atributos.DES.ancestral +
                              (pontosAtributoAncestralidade.DES || 0) +
                              atributos.DES.bonus) /
                              2
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <input
                        type="number"
                        value={movimentacao.mitigadoRestricao || 0}
                        onChange={(e) =>
                          atualizarMovimentacao(
                            "mitigadoRestricao",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                        disabled={fichaTrancada}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Linha Evasão */}
                  <div className="grid grid-cols-3">
                    <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">
                      Evasão
                    </div>
                    <div className="p-2 border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={movimentacao.evasao.atual || 0}
                          onChange={(e) =>
                            atualizarMovimentacaoEvasao(
                              "atual",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                          min="0"
                        />
                        <span className="text-xs">/</span>
                        <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                          {Math.floor(
                            (atributos.VEL.base +
                              atributos.VEL.ancestral +
                              (pontosAtributoAncestralidade.VEL || 0) +
                              atributos.VEL.bonus) /
                              2
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="p-2">
                      <input
                        type="number"
                        value={movimentacao.mitigadoEvasao || 0}
                        onChange={(e) =>
                          atualizarMovimentacao(
                            "mitigadoEvasao",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                        disabled={fichaTrancada}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Ancestralidades - Largura fixa */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Ancestralidades
                </h2>
                {!ancestralidadesConfirmadas && (
                  <div
                    className={`text-lg font-bold px-3 py-1 rounded ${
                      pontosAncestralidadeDisponiveis < 0
                        ? "bg-red-100 text-red-700"
                        : pontosAncestralidadeDisponiveis > 0
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {pontosAncestralidadeDisponiveis}/{PONTOS_ANCESTRALIDADE}
                  </div>
                )}
              </div>

              {/* Área de rolagem para as ancestralidades */}
              <div
                className={`flex-1 space-y-4 overflow-y-auto pr-2 ${
                  ancestralidadesConfirmadas ? "max-h-[500px]" : "max-h-[500px]"
                }`}
              >
                {!ancestralidadesConfirmadas ? (
                  // Modo de seleção
                  ancestralidades.map((ancestralidade) => (
                    <AccordionSection
                      key={ancestralidade.nome}
                      title={ancestralidade.nome}
                      toggleId={ancestralidade.nome}
                      isOpen={ancestralidadesAbertas[ancestralidade.nome]}
                      onToggle={toggleAncestralidade}
                    >
                      {ancestralidade.caracteristicas.map((caracteristica) => {
                        const disabled =
                          pontosAncestralidadeDisponiveis <
                            caracteristica.custo &&
                          !caracteristicasSelecionadas[caracteristica.id];

                        return (
                          <SelectableCard
                            key={caracteristica.id}
                            isSelected={
                              caracteristicasSelecionadas[caracteristica.id]
                            }
                            onSelect={() =>
                              toggleCaracteristica(caracteristica.id)
                            }
                            disabled={disabled}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={
                                  caracteristicasSelecionadas[
                                    caracteristica.id
                                  ] || false
                                }
                                onChange={() =>
                                  toggleCaracteristica(caracteristica.id)
                                }
                                className="mt-1 w-4 h-4"
                                disabled={disabled}
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-base">
                                    {caracteristica.nome}
                                  </span>
                                  <span
                                    className={`text-base font-bold px-3 py-1 rounded ${
                                      caracteristica.custo < 0
                                        ? "bg-red-100 text-red-700"
                                        : caracteristica.custo > 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {caracteristica.custo > 0
                                      ? `+${caracteristica.custo}`
                                      : caracteristica.custo}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {caracteristica.descricao}
                                </p>
                              </div>
                            </div>
                          </SelectableCard>
                        );
                      })}
                    </AccordionSection>
                  ))
                ) : (
                  // Modo de visualização (após confirmação)
                  <div>
                    {Object.keys(caracteristicasAgrupadas).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">
                          Nenhuma característica selecionada.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.keys(caracteristicasAgrupadas).map(
                          (ancestralidadeNome) => (
                            <ViewCard key={ancestralidadeNome}>
                              <div className="bg-green-100 px-4 py-2 border-b border-green-200 mb-4 -mx-4 -mt-4">
                                <h4 className="font-bold text-lg text-green-800">
                                  {ancestralidadeNome}
                                </h4>
                              </div>
                              <div className="space-y-4">
                                {caracteristicasAgrupadas[
                                  ancestralidadeNome
                                ].map((caracteristica) => (
                                  <ViewCard key={caracteristica.id}>
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-semibold text-base">
                                        {caracteristica.nome}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {caracteristica.descricao}
                                    </p>
                                  </ViewCard>
                                ))}
                              </div>
                            </ViewCard>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão de Confirmação */}
              {!ancestralidadesConfirmadas && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <ConfirmButton
                    onClick={confirmarAncestralidades}
                    disabled={pontosAncestralidadeDisponiveis < 0}
                    variant={
                      pontosAncestralidadeDisponiveis < 0 ? "gray" : "green"
                    }
                  >
                    Confirmar Seleção
                  </ConfirmButton>
                </div>
              )}
            </div>

            {/* Seção de Origens - Corrigida */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <SectionHeader
                title="Origens"
                badge={
                  !origensConfirmadas
                    ? `(${calcularTotalOrigensSelecionadas(
                        origensSelecionadas,
                        andrilhagemSelecionada,
                        magiaDespertaSelecionada
                      )}/3)`
                    : ""
                }
              >
                {renderCabecalhoSecao("origens")}
              </SectionHeader>

              {!origensConfirmadas && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-blue-600" size={20} />
                    <span className="text-sm text-blue-700">
                      Selecione no máximo 3 origens no total (categorias
                      principais + Andrilhagem/Magia Desperta)
                    </span>
                  </div>
                </div>
              )}

              {/* Área de rolagem para as origens */}
              <div
                className={`flex-1 space-y-4 overflow-y-auto pr-2 ${
                  origensConfirmadas ? "max-h-[500px]" : "max-h-[500px]"
                }`}
              >
                {!origensConfirmadas ? (
                  // Modo de seleção
                  <>
                    {/* Categorias principais */}
                    {origens
                      .filter(
                        (origem) =>
                          origem.tipo === "Infância" ||
                          origem.tipo === "Estudos" ||
                          origem.tipo === "Ofícios"
                      )
                      .map((origem) => (
                        <AccordionSection
                          key={origem.tipo}
                          title={origem.tipo}
                          toggleId={origem.tipo}
                          isOpen={origensAbertas[origem.tipo]}
                          onToggle={toggleOrigem}
                        >
                          {origem.opcoes.map((opcao) => {
                            const totalSelecionadas =
                              calcularTotalOrigensSelecionadas(
                                origensSelecionadas,
                                andrilhagemSelecionada,
                                magiaDespertaSelecionada
                              );
                            const disabled =
                              totalSelecionadas >= 3 &&
                              !origensSelecionadas[origem.tipo];

                            return (
                              <SelectableCard
                                key={opcao.id}
                                isSelected={
                                  origensSelecionadas[origem.tipo] === opcao.id
                                }
                                onSelect={() => toggleOpcaoOrigem(opcao.id)}
                                disabled={disabled}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    checked={
                                      origensSelecionadas[origem.tipo] ===
                                      opcao.id
                                    }
                                    onChange={() => {
                                      if (!disabled) {
                                        toggleOpcaoOrigem(opcao.id);
                                      }
                                    }}
                                    className="mt-1 w-4 h-4"
                                    name={origem.tipo}
                                    disabled={disabled}
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-semibold text-base">
                                        {opcao.nome}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                      {opcao.descricao}
                                    </p>
                                  </div>
                                </div>
                              </SelectableCard>
                            );
                          })}
                        </AccordionSection>
                      ))}

                    {/* Opções especiais - Andrilhagem e Magia Desperta */}
                    <div className="border border-gray-200 rounded-lg">
                      <div className="p-4 space-y-4">
                        {/* Andrilhagem */}
                        <SelectableCard
                          isSelected={andrilhagemSelecionada}
                          onSelect={() => {
                            const totalSelecionadas =
                              calcularTotalOrigensSelecionadas(
                                origensSelecionadas,
                                andrilhagemSelecionada,
                                magiaDespertaSelecionada
                              );
                            if (
                              !(
                                totalSelecionadas >= 3 &&
                                !andrilhagemSelecionada
                              )
                            ) {
                              actions.updateOrigens({
                                andrilhagemSelecionada: !andrilhagemSelecionada,
                              });
                            }
                          }}
                          disabled={
                            calcularTotalOrigensSelecionadas(
                              origensSelecionadas,
                              andrilhagemSelecionada,
                              magiaDespertaSelecionada
                            ) >= 3 && !andrilhagemSelecionada
                          }
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={andrilhagemSelecionada}
                              onChange={() => {
                                const totalSelecionadas =
                                  calcularTotalOrigensSelecionadas(
                                    origensSelecionadas,
                                    andrilhagemSelecionada,
                                    magiaDespertaSelecionada
                                  );
                                if (
                                  !(
                                    totalSelecionadas >= 3 &&
                                    !andrilhagemSelecionada
                                  )
                                ) {
                                  actions.updateOrigens({
                                    andrilhagemSelecionada:
                                      !andrilhagemSelecionada,
                                  });
                                }
                              }}
                              className="mt-1 w-4 h-4"
                              disabled={
                                calcularTotalOrigensSelecionadas(
                                  origensSelecionadas,
                                  andrilhagemSelecionada,
                                  magiaDespertaSelecionada
                                ) >= 3 && !andrilhagemSelecionada
                              }
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-base">
                                  Andrilhagem
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                1 metro em todas as velocidades de movimento nos
                                níveis 1, 4, 8, 12, 16. Um talento de
                                sobrevivência. Uma habilidade extra em nível
                                iniciante relacionada a sociedades,
                                sobrevivência ou intuição.
                              </p>
                            </div>
                          </div>
                        </SelectableCard>

                        {/* Magia Desperta */}
                        <SelectableCard
                          isSelected={magiaDespertaSelecionada}
                          onSelect={() => {
                            const totalSelecionadas =
                              calcularTotalOrigensSelecionadas(
                                origensSelecionadas,
                                andrilhagemSelecionada,
                                magiaDespertaSelecionada
                              );
                            if (
                              !(
                                totalSelecionadas >= 3 &&
                                !magiaDespertaSelecionada
                              )
                            ) {
                              actions.updateOrigens({
                                magiaDespertaSelecionada:
                                  !magiaDespertaSelecionada,
                              });
                            }
                          }}
                          disabled={
                            calcularTotalOrigensSelecionadas(
                              origensSelecionadas,
                              andrilhagemSelecionada,
                              magiaDespertaSelecionada
                            ) >= 3 && !magiaDespertaSelecionada
                          }
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={magiaDespertaSelecionada}
                              onChange={() => {
                                const totalSelecionadas =
                                  calcularTotalOrigensSelecionadas(
                                    origensSelecionadas,
                                    andrilhagemSelecionada,
                                    magiaDespertaSelecionada
                                  );
                                if (
                                  !(
                                    totalSelecionadas >= 3 &&
                                    !magiaDespertaSelecionada
                                  )
                                ) {
                                  actions.updateOrigens({
                                    magiaDespertaSelecionada:
                                      !magiaDespertaSelecionada,
                                  });
                                }
                              }}
                              className="mt-1 w-4 h-4"
                              disabled={
                                calcularTotalOrigensSelecionadas(
                                  origensSelecionadas,
                                  andrilhagemSelecionada,
                                  magiaDespertaSelecionada
                                ) >= 3 && !magiaDespertaSelecionada
                              }
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-base">
                                  Magia Desperta
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                um talento de Magia Arcana ou Espiritual.
                              </p>
                            </div>
                          </div>
                        </SelectableCard>
                      </div>
                    </div>
                  </>
                ) : (
                  // Modo de visualização (após confirmação) - APENAS AS OPÇÕES SELECIONADAS
                  <div>
                    {origensSelecionadasLista.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">Nenhuma origem selecionada.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {origensSelecionadasLista.map((opcao) => (
                          <ViewCard key={opcao.id}>
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-base">
                                {opcao.nome}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {opcao.descricao}
                            </p>
                          </ViewCard>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão de Confirmação */}
              {!origensConfirmadas && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <ConfirmButton onClick={confirmarOrigens}>
                    Confirmar Seleção
                  </ConfirmButton>
                </div>
              )}
            </div>
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

            {/* SEÇÃO DE TALENTOS - MODIFICADA para nova estratégia */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <SectionHeader title="Talentos" action={false}>
                <ModeIndicator isLocked={fichaTrancada} />
                {renderCabecalhoSecao("talentos")}
                </SectionHeader>

              {/* Área de rolagem para os talentos - MODIFICAÇÃO: max-height condicional */}
              <div
                className={`flex-1 space-y-4 overflow-y-auto pr-2 ${
                  fichaTrancada ? "max-h-[500px]" : ""
                }`}
              >
                {fichaTrancada ? (
                  // MODO LEITURA - Apenas talentos selecionados
                  <div>
                    {Object.keys(talentosSelecionados).filter(
                      (id) => talentosSelecionados[id]
                    ).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">Nenhum talento selecionado.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Mostrar os talentos na ordem de seleção (mais antigo no topo) */}
                        {Object.keys(talentosSelecionados)
                          .filter((id) => talentosSelecionados[id])
                          .map((talentoId) => {
                            // Encontrar o talento pelo id
                            let talento = null;
                            for (const categoria of talentos) {
                              talento = categoria.talentos.find(
                                (t) => t.id === talentoId
                              );
                              if (talento) break;
                            }
                            if (!talento) return null;

                            return (
                              <ViewCard key={talento.id}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-base">
                                    {talento.nome}
                                  </span>
                                  {talento.pfsPes && (
                                    <span className="text-base font-bold px-3 py-1 rounded bg-green-100 text-green-700">
                                      {talento.pfsPes}
                                    </span>
                                  )}
                                </div>
                                {/* Renderização condicional dos campos */}
                                {renderCampo(
                                  "Pré-requisito",
                                  talento.prerequisito
                                )}
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {talento.descricao}
                                </p>
                                {renderCampo("Dificuldade+", talento.dif)}
                                {renderCampo(
                                  "Círculos Adicionais",
                                  talento.circs
                                )}
                                {renderCampo("Feitos Adicionais", talento.fts)}
                                {renderCampo(
                                  "Subtipo de Criação",
                                  talento.subtipoCriacao
                                )}
                                {renderCampo(
                                  "Escola de Magia Arcana",
                                  talento.escolaMagiaArcana
                                )}
                                {renderCampo(
                                  "Ato de Magia Espiritual",
                                  talento.atoMagiaEspiritual
                                )}
                              </ViewCard>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  // MODO EDIÇÃO - Lista completa para seleção
                  talentos.map((categoria) => (
                    <AccordionSection
                      key={categoria.tipo}
                      title={categoria.tipo}
                      toggleId={categoria.tipo}
                      isOpen={talentosAbertos[categoria.tipo]}
                      onToggle={toggleTalentos}
                    >
                      {categoria.talentos.map((talento) => (
                        <SelectableCard
                          key={talento.id}
                          isSelected={talentosSelecionados[talento.id]}
                          onSelect={() => toggleTalento(talento.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={
                                talentosSelecionados[talento.id] || false
                              }
                              onChange={() => toggleTalento(talento.id)}
                              className="mt-1 w-4 h-4"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-base">
                                  {talento.nome}
                                </span>
                                {talento.pfsPes && (
                                  <span className="text-base font-bold px-3 py-1 rounded bg-green-100 text-green-700">
                                    {talento.pfsPes}
                                  </span>
                                )}
                              </div>
                              {/* Renderização condicional dos campos */}
                              {renderCampo(
                                "Pré-requisito",
                                talento.prerequisito
                              )}
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {talento.descricao}
                              </p>
                              {renderCampo("Dificuldade+", talento.dif)}
                              {renderCampo(
                                "Círculos Adicionais",
                                talento.circs
                              )}
                              {renderCampo("Feitos Adicionais", talento.fts)}
                              {renderCampo(
                                "Subtipo de Criação",
                                talento.subtipoCriacao
                              )}
                              {renderCampo(
                                "Escola de Magia Arcana",
                                talento.escolaMagiaArcana
                              )}
                              {renderCampo(
                                "Ato de Magia Espiritual",
                                talento.atoMagiaEspiritual
                              )}
                            </div>
                          </div>
                        </SelectableCard>
                      ))}
                    </AccordionSection>
                  ))
                )}
              </div>
            </div>
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