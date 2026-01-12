// bagagem.js - MODIFICADO COM TRAUMAS AJUSTADO NO CABEÇALHO
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Search, X, Sword } from "lucide-react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Importando dados das planilhas
import { armas as dadosArmas } from "./armas";
import { armaduras as dadosArmaduras } from "./armaduras";
import { projeteis as dadosProjeteis } from "./projeteis";
import { flechasVirotes as dadosFlechasVirotes } from "./flechas-virotes";
import { ferramentas as dadosFerramentas } from "./ferramentas";
import { escudos as dadosEscudos } from "./escudos";
import { armadilhas as dadosArmadilhas } from "./armadilhas";
import { manobras as dadosManobras } from "./manobras";
import {
  IncrementDecrementButton,
  IconButton,
  SectionHeader,
  AccordionSection,
  SelectableCard,
  ViewCard,
  ModeIndicator,
  LockToggleButton,
  HeaderRecursos,
  ToggleEditarItem,
  StatusPanel,
  BonusInput,
} from "./ui-components";

// Import do contexto
import { useFicha } from "./FichaContext";

const Bagagem = () => {
  // Usar o contexto em vez de props
  const { state, actions } = useFicha();
  const {
    atributos,
    fichaTrancada,
    itensBagagem,
    itensEquipados,
    manobrasSelecionadas,
    recursos,
    editandoItem,
  } = state;

  // Estados locais (que não precisam ser persistidos)
  const [sugestoes, setSugestoes] = useState([]);
  const [manobrasAbertas, setManobrasAbertas] = useState({});
  const [idItemComSugestoesAbertas, setIdItemComSugestoesAbertas] =
    useState(null);

  // Calcular número de espaços disponíveis (AGORA EXCLUINDO ITENS EQUIPADOS)
  const calcularEspacos = () => {
    const int =
      atributos.INT.base + atributos.INT.ancestral + atributos.INT.bonus;
    const res =
      atributos.RES.base + atributos.RES.ancestral + atributos.RES.bonus;
    return (int + res) * 4;
  };

  // Itens que ocupam espaço são apenas os NÃO equipados
  const itensOcupandoEspaco = itensBagagem.filter(
    (item) => !itensEquipados.some((equipado) => equipado.id === item.id)
  );

  const espacosBase = calcularEspacos();
  const bonusEspacos = recursos.bonusEspacos ?? 0;
  const espacosDisponiveis = espacosBase + bonusEspacos;

  const espacosUsados = itensOcupandoEspaco.length;

  // Func dos botões +/- para bônus de espaços

  const incrementarBonusEspacos = () => {
  const bonusAtual = recursos.bonusEspacos ?? 0;
    atualizarRecursos({ bonusEspacos: bonusAtual + 1 });
  };

  const decrementarBonusEspacos = () => {
    const bonusAtual = recursos.bonusEspacos ?? 0;
    atualizarRecursos({ bonusEspacos: Math.max(0, bonusAtual - 1) });
  };

  // Processar dados de todas as categorias para autocompletar
  useEffect(() => {
    const todosItens = [
      ...dadosArmas.map((arma) => ({
        ...arma,
        tipo: "arma",
        nomeCompleto: `${arma.Arma} (${arma.Características})`,
      })),
      ...dadosArmaduras.map((armadura) => ({
        ...armadura,
        tipo: "armadura",
        nomeCompleto: `${armadura.Armadura} (${armadura.Tipo})`,
      })),
      ...dadosProjeteis.map((projetil) => ({
        ...projetil,
        tipo: "projetil",
        nomeCompleto: `${projetil["Projétil para Arma de F. (x6)"]} (Projétil)`,
      })),
      ...dadosFlechasVirotes.map((flecha) => ({
        ...flecha,
        tipo: "flecha",
        nomeCompleto: `${flecha["Flechas e Virotes (x20)"]} (Flecha/Virote)`,
      })),
      ...dadosFerramentas.map((ferramenta) => ({
        ...ferramenta,
        tipo: "ferramenta",
        nomeCompleto: `${ferramenta.Ferramentas} (Ferramenta)`,
      })),
      ...dadosEscudos.map((escudo) => ({
        ...escudo,
        tipo: "escudo",
        nomeCompleto: `${escudo.Escudo} (Escudo)`,
      })),
      ...dadosArmadilhas.map((armadilha) => ({
        ...armadilha,
        tipo: "armadilha",
        nomeCompleto: `${armadilha.Armadilha} (Armadilha)`,
      })),
    ];
    setSugestoes(todosItens);
  }, []);

  // Processar manobras agrupadas por tipo
  const manobrasAgrupadas = React.useMemo(() => {
    const agrupado = {};
    dadosManobras.forEach((manobra) => {
      if (!agrupado[manobra.tipo]) {
        agrupado[manobra.tipo] = [];
      }
      agrupado[manobra.tipo].push({
        ...manobra,
        id: `${manobra.tipo}-${manobra.nome}`,
      });
    });
    return Object.keys(agrupado).map((tipo) => ({
      tipo,
      manobras: agrupado[tipo],
    }));
  }, []);

  // Adicionar novo item vazio
  const adicionarItem = () => {
    if (espacosUsados >= espacosDisponiveis) return;

    const novoItem = {
      id: Date.now(),
      nome: "",
      qualidade: "I",
      tipo: "custom",
      preco: "",
      descricao: "",
      dadosItem: null,
      caracteristicas: "",
      ingredientes: "",
      extra: "",
      cdRd: "",
      editando: true,
    };

    const novosItens = [...itensBagagem, novoItem];
    actions.updateBagagem({ itensBagagem: novosItens });
  };

  // Remover item (remove tanto da bagagem quanto dos equipados se estiver equipado)
  const removerItem = (id) => {
    const novosItensBagagem = itensBagagem.filter((item) => item.id !== id);
    const novosItensEquipados = itensEquipados.filter((item) => item.id !== id);
    actions.updateBagagem({
      itensBagagem: novosItensBagagem,
      itensEquipados: novosItensEquipados,
    });
  };

  // Atualizar item
  const atualizarItem = (id, campo, valor) => {
    const novosItens = itensBagagem.map((item) => {
      if (item.id === id) {
        if (campo === "nome") {
          const itemEncontrado = sugestoes.find(
            (s) =>
              s.nomeCompleto.toLowerCase().includes(valor.toLowerCase()) ||
              s.Arma?.toLowerCase().includes(valor.toLowerCase()) ||
              s.Armadura?.toLowerCase().includes(valor.toLowerCase())
          );

          if (itemEncontrado) {
            return {
              ...item,
              nome: valor,
              tipo: itemEncontrado.tipo,
              dadosItem: itemEncontrado,
              qualidade: item.qualidade,
            };
          } else {
            return {
              ...item,
              nome: valor,
              tipo: "custom",
              dadosItem: null,
              // mantém os campos manuais
              caracteristicas: item.caracteristicas || "",
              ingredientes: item.ingredientes || "",
              extra: item.extra || "",
              cdRd: item.cdRd || "",
            };
          }
        }

        return { ...item, [campo]: valor };
      }
      return item;
    });
    actions.updateBagagem({ itensBagagem: novosItens });
  };

  // NOVAS FUNÇÕES: Equipar e Desequipar itens
  const equiparItem = (item) => {
    // Verifica se o item já está equipado
    if (itensEquipados.some((equipado) => equipado.id === item.id)) {
      return;
    }

    const novosEquipados = [...itensEquipados, item];
    actions.updateBagagem({ itensEquipados: novosEquipados });
  };

  const desequiparItem = (itemId) => {
    const novosEquipados = itensEquipados.filter((item) => item.id !== itemId);
    actions.updateBagagem({ itensEquipados: novosEquipados });
  };

  // Verificar se um item está equipado
  const estaEquipado = (itemId) => {
    return itensEquipados.some((item) => item.id === itemId);
  };

  // NOVAS FUNÇÕES PARA MANOBRAS
  const toggleManobras = (tipo) => {
    if (fichaTrancada) return;
    setManobrasAbertas((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  const toggleManobra = (manobraId) => {
    if (fichaTrancada) return;
    const novasManobras = {
      ...manobrasSelecionadas,
      [manobraId]: !manobrasSelecionadas[manobraId],
    };
    actions.updateManobras(novasManobras);
  };

  // Função para alternar trava da ficha
  const alternarTrancaFicha = () => {
    actions.setFichaTrancada(!fichaTrancada);
  };

  const alternarEdicaoItem = () => {
    actions.setEditarItem(!editandoItem);
  };

  // NOVA FUNÇÃO: Atualizar recursos
  const atualizarRecursos = (novosRecursos) => {
    actions.updateRecursos(novosRecursos);
  };

  // Renderizar campos específicos baseados no tipo de item
  const renderCamposEspecificos = (item) => {
    if (item.dadosItem === null && item.editando) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Características
            </label>
            <input
              type="text"
              value={item.caracteristicas}
              onChange={(e) =>
                atualizarItem(item.id, "caracteristicas", e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Características"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">CD/RD</label>
            <input
              type="text"
              value={item.cdRd}
              onChange={(e) => atualizarItem(item.id, "cdRd", e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="CD/RD"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Extra</label>
            <input
              type="text"
              value={item.extra}
              onChange={(e) => atualizarItem(item.id, "extra", e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Extra"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Ingredientes
            </label>
            <input
              type="text"
              value={item.ingredientes}
              onChange={(e) =>
                atualizarItem(item.id, "ingredientes", e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Intredientes"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Preço</label>
            <input
              type="text"
              value={item.preco}
              onChange={(e) => atualizarItem(item.id, "preco", e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Preço"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Descrição
            </label>
            <textarea
              value={item.descricao}
              onChange={(e) =>
                atualizarItem(item.id, "descricao", e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="Descrição do item"
              rows="2"
            />
          </div>
        </div>
      );
    }

    if (item.dadosItem === null && !item.editando) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Características:</strong> {item.caracteristicas || "—"}
          </div>
          <div>
            <strong>CD/RD:</strong> {item.cdRd || "—"}
          </div>
          {item.extra && (
            <div>
              <strong>Extra:</strong> {item.extra}
            </div>
          )}
          <div>
            <strong>Ingredientes:</strong> {item.ingredientes || "—"}
          </div>
          <div className="col-span-2">
            <strong>Preço:</strong> {item.preco || "—"}
          </div>
          <div className="col-span-2">
            <strong>Descrição:</strong> {item.descricao || "—"}
          </div>
        </div>
      );
    }

    const dados = item.dadosItem;

    if (dados.tipo === "custom") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Características:</strong> {dados.Características}
          </div>
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          {dados.Extra && (
            <div className="col-span-2">
              <strong>Extra:</strong> {dados.Extra}
            </div>
          )}
          <div>
            <strong>CD/RD {item.qualidade}:</strong>{" "}
            {dados[`CD/RD ${item.qualidade}`]}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
        </div>
      );
    }

    if (dados.tipo === "arma") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Características:</strong> {dados.Características}
          </div>
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          {dados.Extra && (
            <div className="col-span-2">
              <strong>Extra:</strong> {dados.Extra}
            </div>
          )}
          <div>
            <strong>CD/RD {item.qualidade}:</strong>{" "}
            {dados[`CD/RD ${item.qualidade}`]}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
        </div>
      );
    }

    if (dados.tipo === "armadura") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Tipo:</strong> {dados.Tipo}
          </div>
          <div>
            <strong>RD:</strong> {dados.RD}
          </div>
          <div>
            <strong>Redução Mov:</strong> {dados["Redução de Mov."]}
          </div>
          <div>
            <strong>Penalidade Evasão:</strong> {dados["Penalidade de Evasão"]}
          </div>
          <div>
            <strong>Deflexão+ {item.qualidade}:</strong>{" "}
            {dados[`Deflexão+ ${item.qualidade}`]}
          </div>
          <div>
            <strong>PFs+ {item.qualidade}:</strong>{" "}
            {dados[`PFs+ ${item.qualidade}`]}
          </div>
        </div>
      );
    }

    if (dados.tipo === "projetil") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
          {dados.Efeito && dados.Efeito !== "—" && (
            <div className="col-span-2">
              <strong>Efeito:</strong> {dados.Efeito}
            </div>
          )}
        </div>
      );
    }

    if (dados.tipo === "flecha") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
          {dados.Efeito && dados.Efeito !== "—" && (
            <div className="col-span-2">
              <strong>Efeito:</strong> {dados.Efeito}
            </div>
          )}
        </div>
      );
    }

    if (dados.tipo === "ferramenta") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`] ||
              dados[`Preço base ${item.qualidade}`]}
          </div>
          {dados.Extra && dados.Extra !== "—" && (
            <div className="col-span-2">
              <strong>Extra:</strong> {dados.Extra}
            </div>
          )}
        </div>
      );
    }

    if (dados.tipo === "escudo") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Ingredientes:</strong> {dados.Ingr}
          </div>
          <div>
            <strong>Redução Mov:</strong> {dados["Redução de Mov."]}
          </div>
          <div>
            <strong>Deflexão+ {item.qualidade}:</strong>{" "}
            {dados[`=+ Defl ${item.qualidade}(maestria)`]}
          </div>
          <div>
            <strong>CD/RD {item.qualidade}:</strong>{" "}
            {dados[`CD/RD ${item.qualidade}`]}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
        </div>
      );
    }

    if (dados.tipo === "armadilha") {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div>
            <strong>Tipo:</strong> {dados.Tipo}
          </div>
          <div>
            <strong>Ingredientes:</strong> {dados.Ingredientes}
          </div>
          <div>
            <strong>Preço {item.qualidade}:</strong>{" "}
            {dados[`Preço ${item.qualidade}`]}
          </div>
          {dados.Dano && (
            <div className="col-span-2">
              <strong>Dano:</strong> {dados.Dano}
            </div>
          )}
          {dados.Efeito && (
            <div className="col-span-2">
              <strong>Efeito:</strong> {dados.Efeito}
            </div>
          )}
        </div>
      );
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho MODIFICADO - Adicionado recursos E TRAUMAS AJUSTADO no cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Equipamentos e Bagagem
              </h1> 
            </div>

                          {/* <div className="text-sm text-gray-600">
                <br />
                (INT:{" "}
                {atributos.INT.base +
                  atributos.INT.ancestral +
                  atributos.INT.bonus}{" "}
                + RES:{" "}
                {atributos.RES.base +
                  atributos.RES.ancestral +
                  atributos.RES.bonus}{" "}
                × 4)
              </div>*/}

            {/* NOVO: Recursos E TRAUMAS AJUSTADO no cabeçalho */}
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

              {/* Campo de Traumas AJUSTADO - sem label, largura total, uma linha */}
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
        </div>

        {/* Layout das colunas 60%/40% */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna da Bagagem - 60% da largura */}
          <div className="flex-1 lg:flex-[3]">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex-1 gap-2 mb-4">
                {/* Esquerda: título Bagagem */}
                <SectionHeader
                  title="Bagagem"
                  action={true}
                  actionText="Adicionar Item"
                  onAction={adicionarItem}
                />

                {/* Direita: status + bônus */}
                <div className="flex items-center gap-2">
                  <StatusPanel  
                    icon={espacosUsados === 0 ? CheckCircle2 : AlertCircle}
                    iconColor={espacosDisponiveis === 0 ? "red" : "blue"}
                    title="Restantes"
                    value={espacosDisponiveis}
                    valueColor="blue"
                  />

                  <BonusInput
                    value={bonusEspacos}
                    onIncrement={incrementarBonusEspacos}
                    onDecrement={decrementarBonusEspacos}
                    onChange={(e) =>
                      atualizarRecursos({ bonusEspacos: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="space-y-4">
                {itensBagagem.map((item) => {
                  const equipado = estaEquipado(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 ${
                        equipado
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Dropdown de Qualidade */}
                        <div className="w-20">
                          <label className="block text-xs text-gray-500 mb-1">
                            Qualidade
                          </label>
                          <select
                            value={item.qualidade}
                            onChange={(e) =>
                              atualizarItem(
                                item.id,
                                "qualidade",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                          </select>
                        </div>

                        {/* Input de Nome */}
                        <div className="flex-1 relative">
                          <label className="block text-xs text-gray-500 mb-1">
                            Nome do Item
                          </label>
                          <input
                            type="text"
                            value={item.nome}
                            onFocus={() =>
                              setIdItemComSugestoesAbertas(item.id)
                            }
                            onBlur={() =>
                              setTimeout(
                                () => setIdItemComSugestoesAbertas(null),
                                120
                              )
                            }
                            onChange={(e) =>
                              atualizarItem(item.id, "nome", e.target.value)
                            }
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Digite o nome ou busque na lista..."
                          />

                          {idItemComSugestoesAbertas === item.id &&
                            item.nome && (
                              <div className="absolute top-full z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow max-h-48 overflow-auto">
                                {sugestoes
                                  .filter((sugestao) =>
                                    sugestao.nomeCompleto
                                      .toLowerCase()
                                      .includes(item.nome.toLowerCase())
                                  )
                                  .slice(0, 12)
                                  .map((sugestao) => (
                                    <button
                                      key={sugestao.nomeCompleto}
                                      type="button"
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      onMouseDown={() => {
                                        // onMouseDown evita perder o foco antes do clique registrar
                                        atualizarItem(
                                          item.id,
                                          "nome",
                                          sugestao.nomeCompleto
                                        );
                                      }}
                                    >
                                      {sugestao.nomeCompleto}
                                    </button>
                                  ))}
                              </div>
                            )}
                        </div>

                        {/* Botões: Equipar/Remover*/}
                        <div className="flex items-end gap-1">
                          {item.dadosItem === null && (
                            <ToggleEditarItem
                              isLocked={!item.editando}
                              onToggle={() =>
                                atualizarItem(
                                  item.id,
                                  "editando",
                                  !item.editando
                                )
                              }
                            />
                          )}
                          {!equipado && (
                            <IconButton
                              onClick={() => equiparItem(item)}
                              icon={Sword}
                              title="Equipar item"
                              variant="blue"
                              size="sm"
                            />
                          )}

                          <IconButton
                            onClick={() => removerItem(item.id)}
                            icon={Trash2}
                            title="Remover item"
                            variant="red"
                            size="sm"
                          />
                        </div>
                      </div>

                      {/* Indicador de equipado */}
                      {equipado && (
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-xs">
                          <Sword size={12} />
                          <span>Equipado</span>
                        </div>
                      )}

                      {/* Campos Específicos */}
                      {renderCamposEspecificos(item)}
                    </div>
                  );
                })}

                {/* Espaços Vazios */}
                {Array.from(
                  { length: espacosDisponiveis - espacosUsados },
                  (_, index) => (
                    <div
                      key={`vazio-${index}`}
                      className="border border-gray-200 border-dashed rounded-lg p-4 bg-gray-50 text-gray-400 text-center"
                    >
                      Espaço Disponível
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Coluna para Equipamentos e Manobras - 40% da largura */}
          <div className="flex-1 lg:flex-[2]">
            {/* SEÇÃO DE EQUIPAMENTOS */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Equipamentos
              </h2>

              {itensEquipados.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Nenhum item equipado
                </div>
              ) : (
                <div className="space-y-3">
                  {itensEquipados.map((item) => (
                    <div
                      key={item.id}
                      className="border border-green-200 bg-green-50 rounded-lg p-3 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {item.nome || "Item sem nome"}
                        </div>
                        {item.qualidade && (
                          <div className="text-xs text-gray-600">
                            Qualidade: {item.qualidade}
                          </div>
                        )}
                      </div>

                      {/* MODIFICADO: removida verificação de fichaTrancada */}
                      <IconButton
                        onClick={() => desequiparItem(item.id)}
                        icon={X}
                        title="Desequipar item"
                        variant="red"
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEÇÃO DE MANOBRAS - MANTIDA como estava (só editável quando ficha destravada) */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Manobras</h2>
                <ModeIndicator isLocked={fichaTrancada} />
              </div>

              {/* Área de rolagem para as manobras - MANTIDA a lógica original */}
              <div
                className={`space-y-4 overflow-y-auto pr-2 ${
                  fichaTrancada ? "max-h-[500px]" : ""
                }`}
              >
                {fichaTrancada ? (
                  // MODO LEITURA - Apenas manobras selecionadas
                  <div>
                    {Object.keys(manobrasSelecionadas).filter(
                      (id) => manobrasSelecionadas[id]
                    ).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">Nenhuma manobra selecionada.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.keys(manobrasSelecionadas)
                          .filter((id) => manobrasSelecionadas[id])
                          .map((manobraId) => {
                            // Encontrar a manobra pelo id
                            let manobra = null;
                            for (const categoria of manobrasAgrupadas) {
                              manobra = categoria.manobras.find(
                                (m) => m.id === manobraId
                              );
                              if (manobra) break;
                            }
                            if (!manobra) return null;

                            return (
                              <ViewCard key={manobra.id}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-base">
                                    {manobra.nome}
                                  </span>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {manobra.tipo}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {manobra.descricao}
                                </p>
                              </ViewCard>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ) : (
                  // MODO EDIÇÃO - Lista completa para seleção
                  manobrasAgrupadas.map((categoria) => (
                    <AccordionSection
                      key={categoria.tipo}
                      title={categoria.tipo}
                      isOpen={manobrasAbertas[categoria.tipo]}
                      onToggle={() => toggleManobras(categoria.tipo)}
                    >
                      {categoria.manobras.map((manobra) => (
                        <SelectableCard
                          key={manobra.id}
                          isSelected={manobrasSelecionadas[manobra.id]}
                          onSelect={() => toggleManobra(manobra.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={
                                manobrasSelecionadas[manobra.id] || false
                              }
                              onChange={() => toggleManobra(manobra.id)}
                              className="mt-1 w-4 h-4"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-base">
                                  {manobra.nome}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {manobra.tipo}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {manobra.descricao}
                              </p>
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
};

export default Bagagem;
