// @ts-nocheck
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import {
  salvarFicha,
  carregarFicha,
  exportarFicha,
  validarDadosFicha,
  lerArquivoFicha,
} from "../util/persistence";
import { initialState } from "../util/initialState";

// Ações
const ACTION_TYPES = {
  UPDATE_DESCRICAO: "UPDATE_DESCRICAO",
  UPDATE_ATRIBUTOS: "UPDATE_ATRIBUTOS",
  UPDATE_ANOTACOES: "UPDATE_ANOTACOES",
  SET_FICHA_TRANCADA: "SET_FICHA_TRANCADA",
  SET_EDITAR_ITEM: "SET_EDITAR_ITEM",
  SET_ATRIBUTOS_TRANCADOS: "SET_ATRIBUTOS_TRANCADOS",
  UPDATE_ANCESTRALIDADES: "UPDATE_ANCESTRALIDADES",
  UPDATE_ORIGENS: "UPDATE_ORIGENS",
  UPDATE_HABILIDADES: "UPDATE_HABILIDADES",
  UPDATE_TALENTOS: "UPDATE_TALENTOS",
  UPDATE_BAGAGEM: "UPDATE_BAGAGEM",
  UPDATE_MANOBRAS: "UPDATE_MANOBRAS",
  UPDATE_MAGIAS: "UPDATE_MAGIAS",
  UPDATE_REGISTROS_ARCANA: "UPDATE_REGISTROS_ARCANA",
  UPDATE_CRIACAO: "UPDATE_CRIACAO",
  UPDATE_RECURSOS: "UPDATE_RECURSOS",
  UPDATE_MOVIMENTACAO: "UPDATE_MOVIMENTACAO",
  LOAD_FICHA: "LOAD_FICHA",
  RESET_FICHA: "RESET_FICHA",
};

// Reducer
const fichaReducer = (state, action) => {
  if (!action || !action.type) {
    console.error("[fichaReducer] action inválida recebida:", action);
    return state;
  }

  switch (action.type) {
    case ACTION_TYPES.UPDATE_DESCRICAO:
      return {
        ...state,
        descricao: { ...state.descricao, ...action.payload },
      };
      
      case ACTION_TYPES.UPDATE_ATRIBUTOS:
        return {
          ...state,
          atributos: { ...action.payload },
        };
        
        case ACTION_TYPES.UPDATE_ANOTACOES:
          return {
            ...state,
            anotacoes: { ...state.anotacoes, ...action.payload },
          };
          
    case ACTION_TYPES.SET_FICHA_TRANCADA:
      return {
        ...state,
        fichaTrancada: action.payload,
      };

    case ACTION_TYPES.SET_EDITAR_ITEM:
      return {
        ...state,
        editandoItem: action.payload,
      };

    case ACTION_TYPES.SET_ATRIBUTOS_TRANCADOS:
      return {
        ...state,
        atributosTrancados: action.payload,
      };

    case ACTION_TYPES.UPDATE_ANCESTRALIDADES:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] UPDATE_ANCESTRALIDADES payload inválido:", action.payload);
        return state;
      }
      return {
        ...state,
        ...(action.payload.caracteristicasSelecionadas !== undefined && {
          caracteristicasSelecionadas: action.payload.caracteristicasSelecionadas,
        }),
        ...(action.payload.caracteristicasConfirmadas !== undefined && {
          caracteristicasConfirmadas: action.payload.caracteristicasConfirmadas,
        }),
        ...(action.payload.ancestralidadesConfirmadas !== undefined && {
          ancestralidadesConfirmadas: action.payload.ancestralidadesConfirmadas,
        }),
        ...(action.payload.pontosAtributoAncestralidade !== undefined && {
          pontosAtributoAncestralidade: action.payload.pontosAtributoAncestralidade,
        }),
        ...(action.payload.distribuicaoAncestralConfirmada !== undefined && {
          distribuicaoAncestralConfirmada: action.payload.distribuicaoAncestralConfirmada,
        }),
        ...(action.payload.distribuicaoAtributoAncestralidadeConfirmada !== undefined && {
          distribuicaoAtributoAncestralidadeConfirmada: action.payload.distribuicaoAtributoAncestralidadeConfirmada,
        }),
      };

    case ACTION_TYPES.UPDATE_ORIGENS:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] UPDATE_ORIGENS payload inválido:", action.payload);
        return state;
      }
      return {
        ...state,
        ...(action.payload.origensSelecionadas !== undefined && {
          origensSelecionadas: action.payload.origensSelecionadas,
        }),
        ...(action.payload.origensConfirmadas !== undefined && {
          origensConfirmadas: action.payload.origensConfirmadas,
        }),
        ...(action.payload.andrilhagemSelecionada !== undefined && {
          andrilhagemSelecionada: action.payload.andrilhagemSelecionada,
        }),
        ...(action.payload.magiaDespertaSelecionada !== undefined && {
          magiaDespertaSelecionada: action.payload.magiaDespertaSelecionada,
        }),
      };

    case ACTION_TYPES.UPDATE_HABILIDADES:
      return {
        ...state,
        habilidades: action.payload,
      };

    case ACTION_TYPES.UPDATE_TALENTOS:
      return {
        ...state,
        talentosSelecionados: action.payload,
      };

    case ACTION_TYPES.UPDATE_BAGAGEM:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] UPDATE_BAGAGEM payload inválido:", action.payload);
        return state;
      }
      return {
        ...state,
        ...(action.payload.itensBagagem !== undefined && {
          itensBagagem: action.payload.itensBagagem,
        }),
        ...(action.payload.itensEquipados !== undefined && {
          itensEquipados: action.payload.itensEquipados,
        }),
      };

    case ACTION_TYPES.UPDATE_MANOBRAS:
      return {
        ...state,
        manobrasSelecionadas: action.payload,
      };

    case ACTION_TYPES.UPDATE_MAGIAS:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] UPDATE_MAGIAS payload inválido:", action.payload);
        return state;
      }
      return {
        ...state,
        ...(action.payload.atosEspirituais !== undefined && {
          atosEspirituais: action.payload.atosEspirituais,
        }),
        ...(action.payload.subtiposArcana !== undefined && {
          subtiposArcana: action.payload.subtiposArcana,
        }),
        ...(action.payload.feitosAtuais !== undefined && {
          feitosAtuais: action.payload.feitosAtuais,
        }),
        ...(action.payload.circsAutAtuais !== undefined && {
          circsAutAtuais: action.payload.circsAutAtuais,
        }),
        ...(action.payload.magiasAlteracaoSelecionadas !== undefined && {
          magiasAlteracaoSelecionadas: action.payload.magiasAlteracaoSelecionadas,
        }),
        ...(action.payload.formasSelecionadas !== undefined && {
          formasSelecionadas: action.payload.formasSelecionadas,
        }),
        ...(action.payload.efeitosArcana !== undefined && {
          efeitosArcana: action.payload.efeitosArcana,
        }),
        ...(action.payload.registrosArcana !== undefined && {
          registrosArcana: action.payload.registrosArcana,
        }),
      };

    case ACTION_TYPES.UPDATE_REGISTROS_ARCANA:
      return {
        ...state,
        registrosArcana: action.payload,
      };

    case ACTION_TYPES.UPDATE_CRIACAO:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] UPDATE_CRIACAO payload inválido:", action.payload);
        return state;
      }
      return {
        ...state,
        ...(action.payload.tiposCriacao !== undefined && {
          tiposCriacao: action.payload.tiposCriacao,
        }),
        ...(action.payload.negocios !== undefined && {
          negocios: action.payload.negocios,
        }),
        ...(action.payload.receitas !== undefined && {
          receitas: action.payload.receitas,
        }),
      };

    case ACTION_TYPES.UPDATE_RECURSOS:
      return {
        ...state,
        recursos: { ...state.recursos, ...action.payload },
      };

    case ACTION_TYPES.UPDATE_MOVIMENTACAO:
      return {
        ...state,
        movimentacao: { ...state.movimentacao, ...action.payload },
      };

    case ACTION_TYPES.LOAD_FICHA:
      if (!action.payload || typeof action.payload !== "object") {
        console.error("[fichaReducer] LOAD_FICHA payload inválido:", action.payload);
        return state;
      }
      // Merge com initialState garante que campos ausentes em fichas antigas
      // não cheguem como undefined nos componentes
      return {
        ...initialState,
        ...action.payload,
      };

    case ACTION_TYPES.RESET_FICHA:
      return initialState;

    default:
      return state;
  }
};

// Criar contexto
export const FichaContext = createContext();

// Provider
export const FichaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(fichaReducer, initialState);

  // Ações regulares - não dependem do state
  const actions = useMemo(() => {
    const updateDescricao = (descricao) =>
      dispatch({ type: ACTION_TYPES.UPDATE_DESCRICAO, payload: descricao });

    const updateAtributos = (atributos) =>
      dispatch({ type: ACTION_TYPES.UPDATE_ATRIBUTOS, payload: atributos });

    const updateAnotacoes = (anotacoes) =>
      dispatch({ type: ACTION_TYPES.UPDATE_ANOTACOES, payload: anotacoes });

    const setFichaTrancada = (trancada) =>
      dispatch({ type: ACTION_TYPES.SET_FICHA_TRANCADA, payload: trancada });

    const setEditarItem = (editando) =>
      dispatch({ type: ACTION_TYPES.SET_EDITAR_ITEM, payload: editando });

    const setAtributosTrancados = (trancados) =>
      dispatch({
        type: ACTION_TYPES.SET_ATRIBUTOS_TRANCADOS,
        payload: trancados,
      });

    const updateAncestralidades = (ancestralidades) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_ANCESTRALIDADES,
        payload: ancestralidades,
      });

    const updateOrigens = (origens) =>
      dispatch({ type: ACTION_TYPES.UPDATE_ORIGENS, payload: origens });

    const updateHabilidades = (habilidades) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_HABILIDADES,
        payload: habilidades,
      });

    const updateTalentos = (talentos) =>
      dispatch({ type: ACTION_TYPES.UPDATE_TALENTOS, payload: talentos });

    const updateBagagem = (bagagem) =>
      dispatch({ type: ACTION_TYPES.UPDATE_BAGAGEM, payload: bagagem });

    const updateManobras = (manobras) =>
      dispatch({ type: ACTION_TYPES.UPDATE_MANOBRAS, payload: manobras });

    const updateMagias = (magias) =>
      dispatch({ type: ACTION_TYPES.UPDATE_MAGIAS, payload: magias });

    const updateEfeitosArcana = (efeitos) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_MAGIAS,
        payload: { efeitosArcana: efeitos },
      });

    const updateRegistrosArcana = (registros) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_REGISTROS_ARCANA,
        payload: registros,
      });

    const updateCriacao = (dadosCriacao) =>
      dispatch({ type: ACTION_TYPES.UPDATE_CRIACAO, payload: dadosCriacao });

    const updateTiposCriacao = (tiposCriacao) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_CRIACAO,
        payload: { tiposCriacao },
      });

    const updateNegocios = (negocios) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_CRIACAO,
        payload: { negocios },
      });

    const updateReceitas = (receitas) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_CRIACAO,
        payload: { receitas },
      });

    const updateRecursos = (recursos) =>
      dispatch({ type: ACTION_TYPES.UPDATE_RECURSOS, payload: recursos });

    const updateMovimentacao = (movimentacao) =>
      dispatch({
        type: ACTION_TYPES.UPDATE_MOVIMENTACAO,
        payload: movimentacao,
      });

    const resetFicha = () => dispatch({ type: ACTION_TYPES.RESET_FICHA });

    return {
      updateDescricao,
      updateAtributos,
      updateAnotacoes,
      setEditarItem,
      setFichaTrancada,
      setAtributosTrancados,
      updateAncestralidades,
      updateOrigens,
      updateHabilidades,
      updateTalentos,
      updateBagagem,
      updateManobras,
      updateMagias,
      updateEfeitosArcana,
      updateRegistrosArcana,
      updateCriacao,
      updateTiposCriacao,
      updateNegocios,
      updateReceitas,
      updateRecursos,
      updateMovimentacao,
      resetFicha,
    };
  }, []);

  // Ações de persistência
  const persistenceActions = useMemo(
    () => ({
      salvarFicha: () => salvarFicha(state),
      exportarFicha: (nomePersonagem) => exportarFicha(state, nomePersonagem),
      carregarFicha: (dadosSalvos) => {
        try {
          const estadoCarregado = carregarFicha(dadosSalvos);
          if (validarDadosFicha(estadoCarregado)) {
            dispatch({
              type: ACTION_TYPES.LOAD_FICHA,
              payload: estadoCarregado,
            });
            return true;
          } else {
            console.error("Dados da ficha inválidos:", estadoCarregado);
            return false;
          }
        } catch (error) {
          console.error("Erro ao carregar ficha:", error);
          return false;
        }
      },
      lerArquivoFicha: (file) => lerArquivoFicha(file),
    }),
    [state]
  );

  // Combinar todas as ações
  const allActions = useMemo(
    () => ({
      ...actions,
      ...persistenceActions,
    }),
    [actions, persistenceActions]
  );

  const contextValue = useMemo(
    () => ({
      state,
      actions: allActions,
    }),
    [state, allActions]
  );

  return (
    <FichaContext.Provider value={contextValue}>
      {children}
    </FichaContext.Provider>
  );
};

// Hook em arquivo separado: ./useFicha.js
// Separação necessária para compatibilidade com Vite HMR.