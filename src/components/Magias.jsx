// Magias.jsx
import React, { useState, useRef, useEffect } from "react";
import { useFicha } from "../context/useFicha";
import { LockToggleButton, HeaderRecursos } from "./ui-components"; // NOVO: HeaderRecursos importado
import { talentos as dadosTalento } from "../data/talentos";
import { nivelMaestria } from "../util/constants";
import { Plus, Trash2, Search, CheckCircle2, Sparkles, Book } from "./icons";

// NOVA IMPORTACAO - dados das magias do arquivo separado
import { magiasEspirituais } from "../data/magias-espirituais";
import { truques } from "../data/truques";
import { formas as dadosFormas } from "../data/formas";

const Magias = () => {
  const { state, actions } = useFicha();
  const {
    fichaTrancada,
    talentosSelecionados,
    atributos,
    pontosAtributoAncestralidade,
    atosEspirituais,
    subtiposArcana,
    feitosAtuais,
    circsAutAtuais,
    magiasAlteracaoSelecionadas = [],
    formasSelecionadas = {},
    efeitosArcana = [],
    registrosArcana = [],
    recursos, // NOVO: recursos do contexto
  } = state;

  const [abaAtiva, setAbaAtiva] = useState("arcana");

  // Usar as magias importadas do arquivo separado
  const magiasAlteracao = magiasEspirituais.alteracao;
  const truquesDisponiveis = truques.truques;

  // Combinar magias de alteração e truques em uma única lista para busca
  const todosOsTruquesEMagias = [
    ...magiasAlteracao.map((magia) => ({ ...magia, tipo: "magia" })),
    ...truquesDisponiveis.map((truque) => ({ ...truque, tipo: "truque" })),
  ];

  // Adicionar magia ou truque à lista de selecionadas
  const adicionarMagia = (item) => {
    if (fichaTrancada) return;

    const novoItem = {
      ...item,
      idUnico: `${item.id}-${Date.now()}`,
    };

    const novasMagias = [...magiasAlteracaoSelecionadas, novoItem];
    actions.updateMagias({ magiasAlteracaoSelecionadas: novasMagias });
  };

  // Remover magia da lista
  const removerMagia = (idUnico) => {
    if (fichaTrancada) return;

    const novasMagias = magiasAlteracaoSelecionadas.filter(
      (magia) => magia.idUnico !== idUnico
    );
    actions.updateMagias({ magiasAlteracaoSelecionadas: novasMagias });
  };

  const alternarTrancaFicha = () => {
    actions.setFichaTrancada(!fichaTrancada);
  };

  // NOVA FUNÇÃO: Atualizar recursos
  const atualizarRecursos = (novosRecursos) => {
    actions.updateRecursos(novosRecursos);
  };

  // CÁLCULOS PARA MAGIA ESPIRITUAL
  const calcularModificadorEspiritual = () => {
    const getTotalAtributo = (atributo) => {
      const base = atributos[atributo]?.base || 0;
      const ancestral = atributos[atributo]?.ancestral || 0;
      const pontosAncestralidade = pontosAtributoAncestralidade[atributo] || 0;
      const bonus = atributos[atributo]?.bonus || 0;
      return base + ancestral + pontosAncestralidade + bonus;
    };
    return getTotalAtributo("SAB") + getTotalAtributo("ESP");
  };

  const calcularConcentracao = () => {
    const getTotalAtributo = (atributo) => {
      const base = atributos[atributo]?.base || 0;
      const ancestral = atributos[atributo]?.ancestral || 0;
      const pontosAncestralidade = pontosAtributoAncestralidade[atributo] || 0;
      const bonus = atributos[atributo]?.bonus || 0;
      return base + ancestral + pontosAncestralidade + bonus;
    };
    return getTotalAtributo("SAB") + getTotalAtributo("RES");
  };

  const calcularFeitosMaximos = () => {
    const getTotalAtributo = (atributo) => {
      const base = atributos[atributo]?.base || 0;
      const ancestral = atributos[atributo]?.ancestral || 0;
      const pontosAncestralidade = pontosAtributoAncestralidade[atributo] || 0;
      const bonus = atributos[atributo]?.bonus || 0;
      return base + ancestral + pontosAncestralidade + bonus;
    };

    const numTalentosEspirituais = Object.keys(talentosSelecionados).filter(
      (id) => talentosSelecionados[id] && id.includes("Magia Espiritual")
    ).length;

    return (
      getTotalAtributo("SAB") + getTotalAtributo("ESP") + numTalentosEspirituais
    );
  };

  // CÁLCULOS PARA MAGIA ARCANA
  const calcularModificadorArcana = () => {
    const getTotalAtributo = (atributo) => {
      const base = atributos[atributo]?.base || 0;
      const ancestral = atributos[atributo]?.ancestral || 0;
      const pontosAncestralidade = pontosAtributoAncestralidade[atributo] || 0;
      const bonus = atributos[atributo]?.bonus || 0;
      return base + ancestral + pontosAncestralidade + bonus;
    };
    return getTotalAtributo("LOG") + getTotalAtributo("ESP");
  };

  const calcularCircsAutMaximos = () => {
    return Object.keys(talentosSelecionados).filter(
      (id) => talentosSelecionados[id] && id.includes("Magia Arcana")
    ).length;
  };

  const modificadorEspiritual = calcularModificadorEspiritual();
  const concentracao = calcularConcentracao();
  const feitosMaximos = calcularFeitosMaximos();
  const modificadorArcana = calcularModificadorArcana();
  const circsAutMaximos = calcularCircsAutMaximos();

  const atualizarMaestriaAto = (ato, novaMaestria) => {
    if (fichaTrancada) return;
    const novosAtos = { ...atosEspirituais, [ato]: novaMaestria };
    actions.updateMagias({ atosEspirituais: novosAtos });
  };

  const atualizarMaestriaSubtipo = (subtipo, novaMaestria) => {
    if (fichaTrancada) return;
    const novosSubtipos = { ...subtiposArcana, [subtipo]: novaMaestria };
    actions.updateMagias({ subtiposArcana: novosSubtipos });
  };

  const atualizarFeitosAtuais = (valor) => {
    const novoValor = Math.max(0, Math.min(feitosMaximos, valor));
    actions.updateMagias({ feitosAtuais: novoValor });
  };

  // Referência para o container de formas
  const formasContainerRef = useRef(null);

  // Funções para formas - CORRIGIDA com preservação do scroll
  const toggleForma = (formaId, distanciaId) => {
    if (fichaTrancada) return;

    // Salvar a posição atual do scroll
    const scrollTop = formasContainerRef.current?.scrollTop || 0;

    const chave = `${formaId}-${distanciaId}`;
    const formasAtuais = formasSelecionadas || {};
    const novaSelecao = !formasAtuais[chave];

    const novasFormas = {
      ...formasAtuais,
      [chave]: novaSelecao,
    };

    // Atualiza o estado global
    actions.updateMagias({
      formasSelecionadas: novasFormas,
    });

    // Restaurar a posição do scroll após a atualização
    setTimeout(() => {
      if (formasContainerRef.current) {
        formasContainerRef.current.scrollTop = scrollTop;
      }
    }, 0);
  };

  const talentosMagiaEspiritual = React.useMemo(() => {
    const idsSelecionados = Object.keys(talentosSelecionados).filter(
      (id) => talentosSelecionados[id]
    );
    return idsSelecionados
      .map((id) => {
        const [tipo, nomeTalento] = id.split("-");
        const talentoEncontrado = dadosTalento.find(
          (talento) => talento.Talento === nomeTalento && talento.Tipo === tipo
        );
        return talentoEncontrado ? { ...talentoEncontrado, id } : null;
      })
      .filter(Boolean)
      .filter((talento) => talento["Ato de Magia Espiritual"] !== "");
  }, [talentosSelecionados, dadosTalento]);

  const talentosMagiaArcana = React.useMemo(() => {
    const idsSelecionados = Object.keys(talentosSelecionados).filter(
      (id) => talentosSelecionados[id]
    );
    return idsSelecionados
      .map((id) => {
        const [tipo, nomeTalento] = id.split("-");
        const talentoEncontrado = dadosTalento.find(
          (talento) => talento.Talento === nomeTalento && talento.Tipo === tipo
        );
        return talentoEncontrado ? { ...talentoEncontrado, id } : null;
      })
      .filter(Boolean)
      .filter((talento) => talento["Escola de Magia Arcana"] !== "");
  }, [talentosSelecionados, dadosTalento]);

  // Função auxiliar para renderizar campo condicional
  const renderCampo = (rotulo, valor) => {
    if (!valor || valor === "" || valor === "0" || valor === 0) return null;
    return (
      <div className="flex text-sm">
        <span className="font-semibold text-gray-700 min-w-[120px]">
          {rotulo}:
        </span>
        <span className="text-gray-600 flex-1">{valor}</span>
      </div>
    );
  };

  // Componente separado para o campo de busca com estado interno
  const CampoBuscaMagias = React.memo(({ adicionarMagia, fichaTrancada }) => {
    const [buscaLocal, setBuscaLocal] = useState("");
    const inputRef = React.useRef(null);

    const handleChange = (e) => {
      setBuscaLocal(e.target.value);
    };

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    const magiasFiltradasLocal = todosOsTruquesEMagias.filter((item) =>
      item.nome.toLowerCase().includes(buscaLocal.toLowerCase())
    );

    return (
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={buscaLocal}
              onChange={handleChange}
              placeholder="Buscar magia ou truque..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              disabled={fichaTrancada}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={16}
            />
          </div>
          {buscaLocal && (
            <button
              onClick={() => {
                setBuscaLocal("");
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {buscaLocal && magiasFiltradasLocal.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
            {magiasFiltradasLocal.map((item) => (
              <div
                key={item.id}
                className="p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => {
                  adicionarMagia(item);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <div className="font-medium text-gray-800">{item.nome}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.tipo === "truque"
                    ? "Truque Espiritual"
                    : "Magia de Alteração"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });

  const AbaMagiaArcana = () => {
    // Estados locais para o novo efeito
    const [novoEfeitoTexto, setNovoEfeitoTexto] = useState("");
    const [novaCategoriaMagia, setNovaCategoriaMagia] = useState("I");
    const novoEfeitoRef = useRef(null);

    // Estados locais para o novo registro
    const [novoRegistro, setNovoRegistro] = useState({
      nome: "",
      efeitoId: "",
      formaId: "",
      categoriaMagia: "",
      circulos: 0,
    });

    // Função para adicionar efeito
    const adicionarEfeito = () => {
      if (!novoEfeitoTexto.trim() || fichaTrancada) return;

      const novoEfeito = {
        id: Date.now().toString(),
        texto: novoEfeitoTexto.trim(),
        categoria: novaCategoriaMagia,
        dataCriacao: new Date().toISOString(),
      };

      // Adiciona no TOPO da lista
      const novosEfeitos = [novoEfeito, ...efeitosArcana];
      actions.updateEfeitosArcana(novosEfeitos);

      // Limpa o formulário
      setNovoEfeitoTexto("");
      setNovaCategoriaMagia("I");

      // Foca no input novamente
      if (novoEfeitoRef.current) {
        novoEfeitoRef.current.focus();
      }
    };

    // Função para remover efeito
    const removerEfeito = (id) => {
      if (fichaTrancada) return;

      const novosEfeitos = efeitosArcana.filter((efeito) => efeito.id !== id);
      actions.updateEfeitosArcana(novosEfeitos);
    };

    // FUNÇÃO ATUALIZADA - mais robusta
    const obterFormaPorId = (formaCompletaId) => {
      if (!formaCompletaId) return null;

      console.log("Buscando forma por ID:", formaCompletaId); // Para debug

      // Procura a forma correspondente em todas as formas
      for (const forma of dadosFormas.formas) {
        for (const distancia of forma.distancias) {
          const chaveTeste = `${forma.id}-${distancia.id}`;
          if (chaveTeste === formaCompletaId) {
            return {
              formaId: forma.id,
              formaNome: forma.nome,
              distanciaId: distancia.id,
              distanciaNome: distancia.nome,
              custo: distancia.custo,
            };
          }
        }
      }

      console.warn("Forma não encontrada para ID:", formaCompletaId);
      return null;
    };

    // Função para calcular círculos automaticamente
    const calcularCirculosAutomatico = () => {
      if (!novoRegistro.efeitoId || !novoRegistro.formaId) return 0;

      const efeitoSelecionado = efeitosArcana.find(
        (e) => e.id === novoRegistro.efeitoId
      );
      const formaSelecionada = obterFormaPorId(novoRegistro.formaId);

      if (!efeitoSelecionado || !formaSelecionada) return 0;

      const circulosPorCategoria = {
        I: 8,
        II: 16,
        III: 24,
        IV: 32,
      };

      return (
        circulosPorCategoria[efeitoSelecionado.categoria] +
        formaSelecionada.custo
      );
    };

    // Função para adicionar registro
    const adicionarRegistro = () => {
      if (
        fichaTrancada ||
        !novoRegistro.nome.trim() ||
        !novoRegistro.efeitoId ||
        !novoRegistro.formaId
      )
        return;

      const efeitoSelecionado = efeitosArcana.find(
        (e) => e.id === novoRegistro.efeitoId
      );
      const formaSelecionada = obterFormaPorId(novoRegistro.formaId);

      // CALCULAR CÍRCULOS AUTOMATICAMENTE
      const calcularCirculos = (categoria, custoForma) => {
        const circulosPorCategoria = {
          I: 8,
          II: 16,
          III: 24,
          IV: 32,
        };
        return circulosPorCategoria[categoria] + custoForma;
      };

      const circulosCalculados = calcularCirculos(
        efeitoSelecionado.categoria,
        formaSelecionada.custo
      );

      const novoRegistroCompleto = {
        id: Date.now().toString(),
        nome: novoRegistro.nome.trim(),
        efeito: {
          id: efeitoSelecionado.id,
          texto: efeitoSelecionado.texto,
          categoria: efeitoSelecionado.categoria,
        },
        forma: formaSelecionada,
        categoriaMagia: efeitoSelecionado.categoria,
        circulos: circulosCalculados, // ← USAR CÍRCULOS CALCULADOS
        dataCriacao: new Date().toISOString(),
      };

      const novosRegistros = [novoRegistroCompleto, ...registrosArcana];
      actions.updateMagias({ registrosArcana: novosRegistros });

      // Limpa o formulário
      setNovoRegistro({
        nome: "",
        efeitoId: "",
        formaId: "",
        categoriaMagia: "",
        circulos: 0,
      });
    };

    // Função para remover registro
    const removerRegistro = (id) => {
      if (fichaTrancada) return;

      const novosRegistros = registrosArcana.filter(
        (registro) => registro.id !== id
      );
      actions.updateMagias({ registrosArcana: novosRegistros });
    };

    // NOVA VERSÃO CORRIGIDA - substitua a função formasParaDropdown
    const formasParaDropdown = React.useMemo(() => {
      const formas = [];
      dadosFormas.formas.forEach((forma) => {
        forma.distancias.forEach((distancia) => {
          const chave = `${forma.id}-${distancia.id}`;
          if (formasSelecionadas[chave]) {
            formas.push({
              id: chave, // ← ESTE É O ID CORRETO que será usado no registro
              nome: `${forma.nome} - ${distancia.nome}`,
              formaId: forma.id,
              distanciaId: distancia.id,
              custo: distancia.custo,
            });
          }
        });
      });
      return formas;
    }, [formasSelecionadas]);

    // Calcular formas selecionadas
    const formasSelecionadasCount = Object.keys(formasSelecionadas).filter(
      (chave) => formasSelecionadas[chave]
    ).length;

    // Calcular altura dinâmica para Efeitos - INDEPENDENTE
    const calcularAlturaEfeitos = () => {
      const baseHeight = 200;
      const itemHeight = 40;
      const maxHeight = 600; // Aumentei o maxHeight para ser independente

      const calculatedHeight = baseHeight + efeitosArcana.length * itemHeight;
      return Math.min(calculatedHeight, maxHeight);
    };

    // Calcular altura dinâmica para Formas - INDEPENDENTE
    const calcularAlturaFormas = () => {
      const baseHeight = 300;
      const itemHeight = 120;
      const maxHeight = 800; // Aumentei o maxHeight para ser independente

      const formasVisiveis = fichaTrancada
        ? dadosFormas.formas.filter((forma) =>
            forma.distancias.some(
              (distancia) => formasSelecionadas[`${forma.id}-${distancia.id}`]
            )
          ).length
        : dadosFormas.formas.length;

      const calculatedHeight = baseHeight + formasVisiveis * itemHeight;
      return Math.min(calculatedHeight, maxHeight);
    };

    // Calcular altura dinâmica para Registros - INDEPENDENTE
    const calcularAlturaRegistros = () => {
      const baseHeight = 200;
      const itemHeight = 60;
      const maxHeight = 600; // Aumentei o maxHeight para ser independente

      const calculatedHeight = baseHeight + registrosArcana.length * itemHeight;
      return Math.min(calculatedHeight, maxHeight);
    };

    // Atualizar categoria magia quando efeito for selecionado
    useEffect(() => {
      if (novoRegistro.efeitoId) {
        const efeitoSelecionado = efeitosArcana.find(
          (e) => e.id === novoRegistro.efeitoId
        );
        if (efeitoSelecionado) {
          setNovoRegistro((prev) => ({
            ...prev,
            categoriaMagia: efeitoSelecionado.categoria,
          }));
        }
      }
    }, [novoRegistro.efeitoId, efeitosArcana]);

    return (
      <div className="space-y-6">
        {/* TRÊS CAMPOS LADO A LADO */}
        <div className="flex gap-4 items-start">
          {/* CAIXA AZUL - RECURSOS */}
          <div className="w-32 flex-shrink-0 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-medium text-blue-700">Bônus</div>
                <div className="text-lg font-bold text-blue-800">
                  +{modificadorArcana}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-blue-700">
                  Concentração
                </div>
                <div className="text-lg font-bold text-blue-800">
                  +{concentracao}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-blue-700">
                  Circs. Aut.
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {circsAutMaximos}
                </div>
              </div>
            </div>
          </div>

          {/* CAIXA ROXA - SUBTIPOS */}
          <div className="w-48 flex-shrink-0 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-center mb-2">
              <div className="text-xs font-medium text-purple-700">
                Escolas Arcanas
              </div>
            </div>
            <div className="space-y-1">
              {Object.keys(subtiposArcana).map((subtipo) => (
                <div
                  key={subtipo}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-gray-700">{subtipo}</span>
                  {fichaTrancada ? (
                    <span className="font-medium text-purple-600 bg-white px-1 py-0.5 rounded border border-purple-200 min-w-[40px] text-center text-xs">
                      {subtiposArcana[subtipo]}
                    </span>
                  ) : (
                    <select
                      value={subtiposArcana[subtipo]}
                      onChange={(e) =>
                        atualizarMaestriaSubtipo(subtipo, e.target.value)
                      }
                      className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:border-blue-500 focus:outline-none min-w-[50px] bg-white"
                    >
                      {Object.keys(nivelMaestria).map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CAIXA REGISTRO - VERSÃO IMPLEMENTADA */}
          <div className="flex-1 min-w-0 border border-gray-200 rounded-lg flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Registro</h3>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de registro de magias arcanas
              </p>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              {/* Formulário para criar novo registro */}
              {!fichaTrancada && (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 mb-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                    {/* Campo Nome */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        placeholder="Nome da magia..."
                        value={novoRegistro.nome}
                        onChange={(e) =>
                          setNovoRegistro((prev) => ({
                            ...prev,
                            nome: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Efeito - Dropdown */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Efeito
                      </label>
                      <select
                        value={novoRegistro.efeitoId}
                        onChange={(e) =>
                          setNovoRegistro((prev) => ({
                            ...prev,
                            efeitoId: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none bg-white"
                      >
                        <option value="">Selecione um efeito</option>
                        {efeitosArcana.map((efeito) => (
                          <option key={efeito.id} value={efeito.id}>
                            {efeito.texto.length > 30
                              ? efeito.texto.substring(0, 30) + "..."
                              : efeito.texto}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Campo Forma - Dropdown */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Forma
                      </label>
                      <select
                        value={novoRegistro.formaId}
                        onChange={(e) =>
                          setNovoRegistro((prev) => ({
                            ...prev,
                            formaId: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none bg-white"
                      >
                        <option value="">Selecione uma forma</option>
                        {formasParaDropdown.map((forma) => (
                          <option key={forma.id} value={forma.id}>
                            {forma.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Campo Cat. Magia - Readonly */}
                    <div className="lg:col-span-1">
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Cat. Magia
                      </label>
                      <input
                        type="text"
                        value={novoRegistro.categoriaMagia}
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 text-gray-700 text-center"
                      />
                    </div>

                    {/* Campo Círculos Calculados - NOVO */}
                    <div className="lg:col-span-1">
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Círculos
                      </label>
                      <input
                        type="text"
                        value={
                          novoRegistro.efeitoId && novoRegistro.formaId
                            ? `${calcularCirculosAutomatico()}`
                            : "0"
                        }
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 text-gray-700 text-center font-bold"
                        title="Cálculo automático: Categoria + Forma"
                      />
                    </div>

                    {/* Botão de adicionar */}
                    <div className="lg:col-span-1">
                      <button
                        onClick={adicionarRegistro}
                        disabled={
                          !novoRegistro.nome.trim() ||
                          !novoRegistro.efeitoId ||
                          !novoRegistro.formaId
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-1 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Adicionar Magia ao Registro"
                      >
                        <Book size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de registros */}
              <div
                className="space-y-3 overflow-y-auto pr-1 flex-1"
                style={{
                  minHeight: "150px",
                  maxHeight: `${calcularAlturaRegistros()}px`,
                }}
              >
                {registrosArcana.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
                    <div>
                      <p className="text-sm">Nenhuma magia criada</p>
                      {!fichaTrancada && (
                        <p className="text-xs mt-1">
                          Use o formulário acima para criar magias
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  registrosArcana.map((registro) => (
                    <div
                      key={registro.id}
                      className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800 text-sm">
                              {registro.nome}
                            </h4>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">
                              Cat. {registro.categoriaMagia}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                              {registro.circulos} círculo(s)
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-semibold text-gray-700">
                                Efeito:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {registro.efeito.texto}
                              </p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">
                                Forma:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {registro.forma
                                  ? `${registro.forma.formaNome} - ${registro.forma.distanciaNome}`
                                  : "Forma não encontrada"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botão de ação */}
                        <div className="flex-shrink-0">
                          {!fichaTrancada ? (
                            <button
                              onClick={() => removerRegistro(registro.id)}
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Remover registro"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <div className="text-blue-500 p-1">
                              <CheckCircle2 size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CAIXAS EFEITOS E FORMAS */}
        <div className="grid grid-cols-2 gap-4">
          {/* CAIXA EFEITOS - VERSÃO COMPACTA COM ALTURA DINÂMICA */}
          <div className="border border-gray-200 rounded-lg flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Efeitos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Efeitos mágicos arcanos criados pelo jogador
              </p>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              {/* Formulário para criar novo efeito - VERSÃO COMPACTA */}
              {!fichaTrancada && (
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 bg-purple-50 mb-4">
                  <div className="flex gap-2 items-end">
                    {/* Campo Efeito - UMA LINHA SÓ */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-purple-700 mb-1">
                        Efeito
                      </label>
                      <input
                        type="text"
                        placeholder="Descreva o efeito mágico arcano..."
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:border-purple-500 focus:outline-none"
                        ref={novoEfeitoRef}
                        onChange={(e) => setNovoEfeitoTexto(e.target.value)}
                        value={novoEfeitoTexto}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            adicionarEfeito();
                          }
                        }}
                      />
                    </div>

                    {/* Campo Cat. Magia - Menu dropdown COMPACTO */}
                    <div className="w-20">
                      <label className="block text-xs font-medium text-purple-700 mb-1">
                        Cat. Magia
                      </label>
                      <select
                        value={novaCategoriaMagia}
                        onChange={(e) => setNovaCategoriaMagia(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-purple-500 focus:outline-none bg-white"
                      >
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                    </div>

                    {/* Botão de adicionar - ÍCONE MÁGICO ROXO */}
                    <div className="w-8">
                      <button
                        onClick={adicionarEfeito}
                        disabled={!novoEfeitoTexto.trim()}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white p-1 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Adicionar efeito mágico"
                      >
                        <Sparkles size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de efeitos - VERSÃO COMPACTA COM ALTURA DINÂMICA */}
              <div
                className="space-y-2 overflow-y-auto pr-1 flex-1"
                style={{
                  minHeight: "150px",
                  maxHeight: `${calcularAlturaEfeitos()}px`,
                }}
              >
                {efeitosArcana.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
                    <div>
                      <p className="text-sm">Nenhum efeito criado</p>
                      {!fichaTrancada && (
                        <p className="text-xs mt-1">
                          Use o formulário acima para criar efeitos
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  efeitosArcana.map((efeito) => (
                    <div
                      key={efeito.id}
                      className="border border-gray-200 rounded p-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center gap-2">
                        {/* Conteúdo do efeito - LAYOUT COMPACTO */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {/* Categoria - BADGE PEQUENO */}
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0">
                            {efeito.categoria}
                          </span>

                          {/* Texto do efeito - UMA LINHA */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm text-gray-800 truncate"
                              title={efeito.texto}
                            >
                              {efeito.texto}
                            </p>
                          </div>
                        </div>

                        {/* Botão de ação - PEQUENO */}
                        <div className="flex-shrink-0">
                          {!fichaTrancada ? (
                            <button
                              onClick={() => removerEfeito(efeito.id)}
                              className="text-red-500 hover:text-red-700 p-0.5 transition-colors"
                              title="Remover efeito"
                            >
                              <Trash2 size={12} />
                            </button>
                          ) : (
                            <div className="text-purple-500 p-0.5">
                              <CheckCircle2 size={12} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* CAIXA FORMAS - VERSÃO CORRIGIDA COM ALTURA DINÂMICA */}
          <div className="border border-gray-200 rounded-lg flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Formas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Formas de conjuração arcana ({formasSelecionadasCount}{" "}
                selecionadas)
              </p>
            </div>

            <div className="p-4 flex-1">
              {!fichaTrancada ? (
                // MODO EDIÇÃO - COM SCROLL PRESERVADO E ALTURA DINÂMICA
                <div
                  ref={formasContainerRef}
                  className="space-y-4 overflow-y-auto pr-2"
                  style={{
                    minHeight: "200px",
                    maxHeight: `${calcularAlturaFormas()}px`,
                  }}
                >
                  {dadosFormas.formas.map((forma) => (
                    <div
                      key={forma.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="mb-3">
                        <h4 className="font-bold text-gray-800 text-base">
                          {forma.nome}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {forma.descricao}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {forma.distancias.map((distancia) => {
                          const chave = `${forma.id}-${distancia.id}`;
                          const selecionada =
                            formasSelecionadas[chave] || false;

                          return (
                            <div
                              key={distancia.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selecionada
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleForma(forma.id, distancia.id);
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm text-gray-800">
                                  {distancia.nome}
                                </span>
                                <span
                                  className={`text-xs font-bold px-2 py-1 rounded ${
                                    distancia.custo === 0
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {distancia.custo} círculo(s)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selecionada}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleForma(forma.id, distancia.id);
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-xs text-gray-600">
                                  {selecionada ? "Selecionada" : "Selecionar"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // MODO LEITURA - APENAS FORMAS SELECIONADAS COM ALTURA DINÂMICA
                <div
                  className="overflow-y-auto pr-2 flex-1"
                  style={{
                    minHeight: "200px",
                    maxHeight: `${calcularAlturaFormas()}px`,
                  }}
                >
                  {formasSelecionadasCount === 0 ? (
                    <div className="flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg h-full">
                      <div className="text-center">
                        <p className="text-sm">Nenhuma forma selecionada</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dadosFormas.formas.map((forma) => {
                        // Filtrar apenas as distâncias selecionadas desta forma
                        const distanciasSelecionadas = forma.distancias.filter(
                          (distancia) => {
                            const chave = `${forma.id}-${distancia.id}`;
                            return formasSelecionadas[chave];
                          }
                        );

                        // Se não há distâncias selecionadas nesta forma, não renderizar
                        if (distanciasSelecionadas.length === 0) return null;

                        return (
                          <div
                            key={forma.id}
                            className="border border-green-200 rounded-lg p-4 bg-green-50"
                          >
                            <div className="mb-3">
                              <h4 className="font-bold text-gray-800 text-base">
                                {forma.nome}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {forma.descricao}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {distanciasSelecionadas.map((distancia) => (
                                <div
                                  key={distancia.id}
                                  className="border border-green-300 rounded-lg p-3 bg-white"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-sm text-gray-800">
                                      {distancia.nome}
                                    </span>
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                                      {distancia.custo} círculo(s)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TALENTOS DE MAGIA ARCANA */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Talentos de Magia Arcana
          </h3>
          {talentosMagiaArcana.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-lg">Nenhum talento arcano selecionado</p>
              <p className="text-sm mt-2">
                Os talentos de Magia Arcana selecionados na página Identidade
                aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {talentosMagiaArcana.map((talento) => (
                <div
                  key={talento.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-800">
                      {talento.Talento}
                    </h4>
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {talento.Tipo}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {renderCampo("Pré-requisito", talento["Pré-requisito"])}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {talento.Descrição}
                    </p>
                    {renderCampo("Dificuldade+", talento["Dif+"])}
                    {renderCampo("Círculos Adicionais", talento["Circs+"])}
                    {renderCampo("Feitos Adicionais", talento["Fts+"])}
                    {renderCampo(
                      "Subtipo de Criação",
                      talento["Subtipo de Criação"]
                    )}
                    {renderCampo(
                      "Escola de Magia Arcana",
                      talento["Escola de Magia Arcana"]
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const AbaMagiaEspiritual = () => (
    <div className="space-y-6">
      {/* TRÊS CAMPOS LADO A LADO */}
      <div className="flex gap-4 items-start">
        <div className="w-32 flex-shrink-0 bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-xs font-medium text-blue-700">Bônus</div>
              <div className="text-lg font-bold text-blue-800">
                +{modificadorEspiritual}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-blue-700">
                Concentração
              </div>
              <div className="text-lg font-bold text-blue-800">
                +{concentracao}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium text-blue-700">Feitos</div>
              <div className="text-lg font-bold text-blue-800">
                <div className="flex items-center justify-center gap-1">
                  <input
                    type="number"
                    value={feitosAtuais}
                    onChange={(e) =>
                      atualizarFeitosAtuais(parseInt(e.target.value) || 0)
                    }
                    className="w-10 text-center border border-gray-300 rounded text-sm py-0.5"
                    min="0"
                    max={feitosMaximos}
                  />
                  <span>/</span>
                  <span>{feitosMaximos}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-48 flex-shrink-0 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-center mb-2">
            <div className="text-xs font-medium text-purple-700">
              Atos Espirituais
            </div>
          </div>
          <div className="space-y-1">
            {Object.keys(atosEspirituais).map((ato) => (
              <div key={ato} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{ato}</span>
                {fichaTrancada ? (
                  <span className="font-medium text-purple-600 bg-white px-1 py-0.5 rounded border border-purple-200 min-w-[40px] text-center text-xs">
                    {atosEspirituais[ato]}
                  </span>
                ) : (
                  <select
                    value={atosEspirituais[ato]}
                    onChange={(e) => atualizarMaestriaAto(ato, e.target.value)}
                    className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:border-blue-500 focus:outline-none min-w-[50px] bg-white"
                  >
                    {Object.keys(nivelMaestria).map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivel}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 border border-gray-200 rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Magias de Alteração e Truques Espirituais
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Magias do Ato de Alteração e Truques Espirituais disponíveis
            </p>
          </div>

          <div className="p-4">
            <CampoBuscaMagias
              adicionarMagia={adicionarMagia}
              fichaTrancada={fichaTrancada}
            />

            <div>
              <h4 className="font-medium text-gray-700 mb-2 text-sm">
                Magias e Truques Selecionados (
                {(magiasAlteracaoSelecionadas || []).length})
              </h4>

              {(magiasAlteracaoSelecionadas || []).length === 0 ? (
                <div className="text-center py-4 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg text-sm">
                  <p>Nenhuma magia selecionada</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {(magiasAlteracaoSelecionadas || []).map((item) => (
                    <div
                      key={item.idUnico}
                      className="border border-gray-200 rounded-lg p-3 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-bold text-gray-800 text-sm">
                            {item.nome}
                          </h5>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {item.tipo === "truque"
                              ? "Truque Espiritual"
                              : "Magia de Alteração"}
                          </span>
                        </div>
                        {!fichaTrancada && (
                          <button
                            onClick={() => removerMagia(item.idUnico)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remover magia"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                        {item.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TALENTOS DE MAGIA ESPIRITUAL */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Talentos de Magia Espiritual
        </h3>
        {talentosMagiaEspiritual.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-lg">Nenhum talento espiritual selecionado</p>
            <p className="text-sm mt-2">
              Os talentos de Magia Espiritual selecionados na página Identidade
              aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {talentosMagiaEspiritual.map((talento) => (
              <div
                key={talento.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    {talento.Talento}
                  </h4>
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {talento.Tipo}
                  </span>
                </div>
                <div className="space-y-2">
                  {renderCampo("Pré-requisito", talento["Pré-requisito"])}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {talento.Descrição}
                  </p>
                  {renderCampo("Dificuldade+", talento["Dif+"])}
                  {renderCampo("Círculos Adicionais", talento["Circs+"])}
                  {renderCampo("Feitos Adicionais", talento["Fts+"])}
                  {renderCampo(
                    "Subtipo de Criação",
                    talento["Subtipo de Criação"]
                  )}
                  {renderCampo(
                    "Ato de Magia Espiritual",
                    talento["Ato de Magia Espiritual"]
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* CABEÇALHO MODIFICADO - Adicionado recursos E TRAUMAS no cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Magias</h1>
            </div>

            {/* NOVO: Recursos E TRAUMAS no cabeçalho */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-4">
                {/* Recursos (PFs, PEs, PCs) */}
                <HeaderRecursos
                  pfs={recursos.pfs}
                  pes={recursos.pes}
                  pcs={recursos.pcs}
                  traumas={recursos.traumas}
                  onPfsChange={(novoPfs) => atualizarRecursos({ pfs: novoPfs })}
                  onPesChange={(novoPes) => atualizarRecursos({ pes: novoPes })}
                  onPcsChange={(novoPcs) => atualizarRecursos({ pcs: novoPcs })}
                  onTraumasChange={(novoTraumas) =>
                    atualizarRecursos({ traumas: novoTraumas })
                  }
                  disabled={fichaTrancada}
                />

                <LockToggleButton
                  isLocked={fichaTrancada}
                  onToggle={alternarTrancaFicha}
                />
              </div>

              {/* Campo de Traumas - EXATAMENTE IGUAL ÀS OUTRAS PÁGINAS */}
              <div className="w-full">
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
                  disabled={fichaTrancada}
                  placeholder="Traumas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  rows="1"
                />
              </div>
            </div>
          </div>

          {/* Abas de navegação */}
          <div className="flex border-b border-gray-200 mt-4">
            <button
              onClick={() => setAbaAtiva("arcana")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                abaAtiva === "arcana"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Magia Arcana
              {talentosMagiaArcana.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {talentosMagiaArcana.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setAbaAtiva("espiritual")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                abaAtiva === "espiritual"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Magia Espiritual
              {talentosMagiaEspiritual.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {talentosMagiaEspiritual.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {abaAtiva === "arcana" ? <AbaMagiaArcana /> : <AbaMagiaEspiritual />}
        </div>
      </div>
    </div>
  );
};

export default Magias;