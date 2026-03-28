<<<<<<< HEAD
<<<<<<< HEAD
// Criacao.jsx
=======
// Criacao.js
>>>>>>> 52cabf2 (feat(icons): replace lucide-react with local SVG components)
=======
// Criacao.jsx
>>>>>>> b26b847 (build ready)
import React, { useMemo, useState, useRef } from "react";
import { useFicha } from "../context/useFicha";
import { talentos as dadosTalento } from "../data/talentos";
import { nivelMaestria } from "../util/constants";
import { calcularBonusHabilidade } from "../util/calculations";
import {
  LockToggleButton,
  SectionHeader,
  ViewCard,
  HeaderRecursos,
} from "./ui-components";
import { Plus, Trash2, CheckCircle2 } from "./icons";

const Criacao = () => {
  const {
    state: {
      fichaTrancada,
      talentosSelecionados,
      habilidades,
      tiposCriacao,
      negocios,
      receitas,
      atributos,
      pontosAtributoAncestralidade,
      recursos, // recursos do contexto
    },
    actions,
  } = useFicha();

  // bonusHabilidades removido do state — calculado localmente como derivado
  const bonusHabilidades = useMemo(() => {
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

  // Estado local apenas para o formulário de nova receita
  const [novaReceita, setNovaReceita] = useState({
    nome: "",
    tipoCriacao: "",
    ingredientes: "",
    agua: "",
    tempo: "",
    catQualidade: "I",
    dificuldade: "",
    preco: "",
    circulosAdicionais: "",
    feitosAdicionais: "",
    formaAlvo: "",
    efeitoDescricao: "",
  });

  const novaReceitaRef = useRef(null);

  // Função para calcular o total de um atributo (incluindo base, ancestral, pontos de ancestralidade e bônus)
  const calcularTotalAtributo = (atributo) => {
    const base = atributos[atributo]?.base || 0;
    const ancestral = atributos[atributo]?.ancestral || 0;
    const pontosAncestralidade = pontosAtributoAncestralidade[atributo] || 0;
    const bonus = atributos[atributo]?.bonus || 0;
    return base + ancestral + pontosAncestralidade + bonus;
  };

  // Calcular bônus de Criação (LOG + DES)
  const bonusCriacao = useMemo(() => {
    const log = calcularTotalAtributo("LOG");
    const des = calcularTotalAtributo("DES");
    return log + des;
  }, [atributos, pontosAtributoAncestralidade]);

  // Calcular bônus de Encantamento (SAB + LOG)
  const bonusEncantamento = useMemo(() => {
    const sab = calcularTotalAtributo("SAB");
    const log = calcularTotalAtributo("LOG");
    return sab + log;
  }, [atributos, pontosAtributoAncestralidade]);

  // Função para alternar trava da ficha (igual à página Identidade)
  const alternarTrancaFicha = () => {
    actions.setFichaTrancada(!fichaTrancada);
  };

  // NOVA FUNÇÃO: Atualizar recursos
  const atualizarRecursos = (novosRecursos) => {
    actions.updateRecursos(novosRecursos);
  };

  // Função para adicionar receita (usando contexto)
  const adicionarReceita = () => {
    if (!novaReceita.nome.trim() || fichaTrancada) return;

    const receitaCompleta = {
      id: Date.now().toString(),
      ...novaReceita,
      dataCriacao: new Date().toISOString(),
    };

    // Adiciona no TOPO da lista usando o contexto
    const novasReceitas = [receitaCompleta, ...receitas];
    actions.updateReceitas(novasReceitas);

    // Limpa o formulário
    setNovaReceita({
      nome: "",
      tipoCriacao: "",
      ingredientes: "",
      agua: "",
      tempo: "",
      catQualidade: "I",
      dificuldade: "",
      preco: "",
      circulosAdicionais: "",
      feitosAdicionais: "",
      formaAlvo: "",
      efeitoDescricao: "",
    });

    // Foca no input novamente
    if (novaReceitaRef.current) {
      novaReceitaRef.current.focus();
    }
  };

  // Função para remover receita (usando contexto)
  const removerReceita = (id) => {
    if (fichaTrancada) return;
    const novasReceitas = receitas.filter((receita) => receita.id !== id);
    actions.updateReceitas(novasReceitas);
  };

  // Função para atualizar maestria do tipo de criação (usando contexto)
  const atualizarMaestriaTipo = (tipo, novaMaestria) => {
    if (fichaTrancada) return;
    const novosTipos = { ...tiposCriacao, [tipo]: novaMaestria };
    actions.updateTiposCriacao(novosTipos);
  };

  // Função para atualizar habilidade nos negócios (usando contexto)
  const atualizarHabilidadeNegocio = (categoria, habilidadeNome) => {
    if (fichaTrancada) return;
    const novosNegocios = {
      ...negocios,
      [categoria]: {
        habilidade: habilidadeNome,
      },
    };
    actions.updateNegocios(novosNegocios);
  };

  // Calcular altura dinâmica para Receitas
  const calcularAlturaReceitas = () => {
    const baseHeight = 200;
    const itemHeight = 60;
    const maxHeight = 600;

    const calculatedHeight = baseHeight + receitas.length * itemHeight;
    return Math.min(calculatedHeight, maxHeight);
  };

  // Função para obter a maestria real da habilidade selecionada
  const obterMaestriaHabilidade = (categoria) => {
    const habilidadeNome = negocios[categoria].habilidade;
    if (!habilidadeNome) return "";

    const habilidade = habilidades.find(
      (hab) => hab.nome === habilidadeNome && hab.trancada
    );
    return habilidade ? habilidade.maestria : "";
  };

  // Função para obter o bônus da habilidade selecionada
  const obterBonusHabilidade = (categoria) => {
    const habilidadeNome = negocios[categoria].habilidade;
    if (!habilidadeNome) return "";

    const habilidade = habilidades.find(
      (hab) => hab.nome === habilidadeNome && hab.trancada
    );
    if (!habilidade) return "";

    return bonusHabilidades[habilidade.id] || "";
  };

  // Filtrar apenas talentos de criação que estão selecionados - SOMENTE LEITURA
  const talentosCriacaoSelecionados = useMemo(() => {
    const selecionados = [];

    Object.keys(talentosSelecionados).forEach((talentoId) => {
      if (talentosSelecionados[talentoId]) {
        const [tipo, nomeTalento] = talentoId.split("-");
        const talentoCompleto = dadosTalento.find(
          (t) => t.Talento === nomeTalento && t.Tipo === tipo
        );

        if (talentoCompleto) {
          const isTalentoCriacao =
            talentoCompleto.Tipo.includes("Criação") ||
            talentoCompleto["Subtipo de Criação"] !== "" ||
            talentoCompleto.Tipo === "Armeiro" ||
            talentoCompleto.Tipo === "Alquimista" ||
            talentoCompleto.Tipo === "Artesão";

          if (isTalentoCriacao) {
            selecionados.push({
              nome: talentoCompleto.Talento,
              prerequisito: talentoCompleto["Pré-requisito"],
              descricao: talentoCompleto.Descrição,
              tipo: talentoCompleto.Tipo,
              dif: talentoCompleto["Dif+"],
              circs: talentoCompleto["Circs+"],
              fts: talentoCompleto["Fts+"],
              subtipoCriacao: talentoCompleto["Subtipo de Criação"],
              escolaMagiaArcana: talentoCompleto["Escola de Magia Arcana"],
              atoMagiaEspiritual: talentoCompleto["Ato de Magia Espiritual"],
              id: talentoId,
            });
          }
        }
      }
    });

    return selecionados;
  }, [talentosSelecionados]);

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
        {/* Cabeçalho MODIFICADO - Adicionado recursos E TRAUMAS no cabeçalho */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Criação</h1>
              <p className="text-gray-600 mt-2">
                Sistema de criação de itens e equipamentos
              </p>
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

              {/* Campo de Traumas - EXATAMENTE IGUAL À PÁGINA DE BAGAGEM */}
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

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Coluna Esquerda - Tipos de Criação e Negócios */}
          <div className="lg:w-48 flex-shrink-0 space-y-4">
            {/* Caixa Tipos de Criação - COR ALTERADA PARA AMARELO */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-yellow-700">
                  Tipos de Criação
                </div>
              </div>
              <div className="space-y-1">
                {Object.keys(tiposCriacao).map((tipo) => (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">{tipo}</span>
                    {fichaTrancada ? (
                      <span className="font-medium text-yellow-600 bg-white px-1 py-0.5 rounded border border-yellow-200 min-w-[40px] text-center text-xs">
                        {tiposCriacao[tipo]}
                      </span>
                    ) : (
                      <select
                        value={tiposCriacao[tipo]}
                        onChange={(e) =>
                          atualizarMaestriaTipo(tipo, e.target.value)
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

            {/* CAIXA NEGÓCIOS */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-blue-700">
                  Negócios
                </div>
              </div>
              <div className="space-y-3">
                {Object.keys(negocios).map((categoria) => {
                  const maestriaHabilidade = obterMaestriaHabilidade(categoria);
                  const bonusHabilidade = obterBonusHabilidade(categoria);

                  return (
                    <div key={categoria} className="space-y-1">
                      <div className="text-xs font-medium text-gray-700 text-center">
                        {categoria}
                      </div>

                      <div className="mb-1">
                        <select
                          value={negocios[categoria].habilidade}
                          onChange={(e) =>
                            atualizarHabilidadeNegocio(
                              categoria,
                              e.target.value
                            )
                          }
                          disabled={fichaTrancada}
                          className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white"
                        >
                          <option value="">Selecionar Habilidade</option>
                          {habilidades
                            .filter((hab) => hab.trancada)
                            .map((habilidade) => (
                              <option
                                key={habilidade.id}
                                value={habilidade.nome}
                              >
                                {habilidade.nome || "Habilidade sem nome"}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Maestria:</span>
                        <span className="font-medium text-blue-600 bg-white px-1 py-0.5 rounded border border-blue-200 min-w-[40px] text-center text-xs">
                          {maestriaHabilidade || "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Bônus:</span>
                        <span className="font-medium text-green-600 bg-white px-1 py-0.5 rounded border border-green-200 min-w-[40px] text-center text-xs">
                          {bonusHabilidade ? `+${bonusHabilidade}` : "-"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna Central - Talentos de Criação (TAMANHO ORIGINAL) */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SectionHeader title="Talentos de Criação" action={false} />

              <div className="space-y-4 overflow-y-auto pr-2">
                {talentosCriacaoSelecionados.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">
                      Nenhum talento de criação selecionado.
                    </p>
                    <p className="text-sm mt-2">
                      Os talentos de criação selecionados na página Identidade
                      aparecerão aqui
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {talentosCriacaoSelecionados.map((talento) => (
                      <ViewCard key={talento.id}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-base">
                            {talento.nome}
                          </span>
                        </div>
                        {renderCampo("Pré-requisito", talento.prerequisito)}
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {talento.descricao}
                        </p>
                        {renderCampo("Dificuldade+", talento.dif)}
                        {renderCampo("Círculos Adicionais", talento.circs)}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO INFERIOR - BÔNUS E RECEITAS */}
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Coluna Esquerda - BÔNUS POSICIONADOS ACIMA DAS RECEITAS NA MARGEM DIREITA */}
          <div className="lg:w-48 flex-shrink-0">
            {/* Caixa Bônus de Criação - COMPACTA - COR ALTERADA PARA AMARELO */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="text-center">
                <div className="text-xs font-medium text-yellow-700 mb-1">
                  Criação
                </div>
                <div className="text-lg font-bold text-yellow-800">
                  +{bonusCriacao}
                </div>
                <div className="text-xs text-yellow-600 mt-1">LOG + DES</div>
              </div>
            </div>

            {/* Caixa Bônus de Encantamento - COMPACTA */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-purple-700 mb-1">
                  Encantamento
                </div>
                <div className="text-lg font-bold text-purple-800">
                  +{bonusEncantamento}
                </div>
                <div className="text-xs text-purple-600 mt-1">SAB + LOG</div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - RECEITAS */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SectionHeader title="Receitas" action={false} />

              {/* Formulário para criar nova receita - APENAS QUANDO FICHA NÃO ESTÁ TRANCADA */}
              {!fichaTrancada && (
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50 mb-6">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Campo Nome */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        placeholder="Nome..."
                        value={novaReceita.nome}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            nome: e.target.value,
                          }))
                        }
                        ref={novaReceitaRef}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Tipo de Criação */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Tipo
                      </label>
                      <input
                        type="text"
                        placeholder="Tipo..."
                        value={novaReceita.tipoCriacao}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            tipoCriacao: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Ingredientes */}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Ingredientes
                      </label>
                      <input
                        type="text"
                        placeholder="Ingredientes..."
                        value={novaReceita.ingredientes}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            ingredientes: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Água */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Água
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.agua}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            agua: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Tempo */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Tempo
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.tempo}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            tempo: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Cat. Qualidade */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Cat. Qual.
                      </label>
                      <select
                        value={novaReceita.catQualidade}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            catQualidade: e.target.value,
                          }))
                        }
                        className="w-full px-1 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none bg-white"
                      >
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                      </select>
                    </div>

                    {/* Campo Dificuldade */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Dificuldade
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.dificuldade}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            dificuldade: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Preço */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Preço
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.preco}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            preco: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Círculos Adicionais */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Circs. Adic.
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.circulosAdicionais}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            circulosAdicionais: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Feitos Adicionais */}
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Feitos Adic.
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={novaReceita.feitosAdicionais}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            feitosAdicionais: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Forma/Alvo */}
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Forma/Alvo
                      </label>
                      <input
                        type="text"
                        placeholder="Forma/Alvo..."
                        value={novaReceita.formaAlvo}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            formaAlvo: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Campo Efeito/Descrição */}
                    <div className="col-span-6">
                      <label className="block text-xs font-medium text-green-700 mb-1">
                        Efeito/Descrição
                      </label>
                      <input
                        type="text"
                        placeholder="Efeito/Descrição..."
                        value={novaReceita.efeitoDescricao}
                        onChange={(e) =>
                          setNovaReceita((prev) => ({
                            ...prev,
                            efeitoDescricao: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    {/* Botão de adicionar */}
                    <div className="col-span-1">
                      <button
                        onClick={adicionarReceita}
                        disabled={!novaReceita.nome.trim()}
                        className="w-full bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Adicionar receita"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de receitas - FUNCIONA EM AMBOS OS MODOS */}
              <div
                className="space-y-2 overflow-y-auto pr-1"
                style={{
                  minHeight: "150px",
                  maxHeight: `${calcularAlturaReceitas()}px`,
                }}
              >
                {receitas.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <div>
                      <p className="text-sm">Nenhuma receita criada</p>
                      {!fichaTrancada && (
                        <p className="text-xs mt-1">
                          Use o formulário acima para criar receitas
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  receitas.map((receita) => (
                    <div
                      key={receita.id}
                      className="border border-gray-200 rounded p-3 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        {/* Conteúdo da receita - LAYOUT COMPACTO */}
                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-12 gap-2 text-xs mb-2">
                            <div className="col-span-2">
                              <span className="font-semibold text-gray-700">
                                Nome:
                              </span>
                              <p className="text-gray-600 mt-1 truncate">
                                {receita.nome}
                              </p>
                            </div>

                            <div className="col-span-2">
                              <span className="font-semibold text-gray-700">
                                Tipo:
                              </span>
                              <p className="text-gray-600 mt-1 truncate">
                                {receita.tipoCriacao}
                              </p>
                            </div>

                            <div className="col-span-2">
                              <span className="font-semibold text-gray-700">
                                Ingredientes:
                              </span>
                              <p className="text-gray-600 mt-1 truncate">
                                {receita.ingredientes}
                              </p>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Água:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.agua}
                              </p>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Tempo:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.tempo}
                              </p>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Cat. Qual.:
                              </span>
                              <span className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs font-bold mt-1 inline-block">
                                {receita.catQualidade}
                              </span>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Dificuldade:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.dificuldade}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-12 gap-2 text-xs">
                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Preço:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.preco}
                              </p>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Circs. Adic.:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.circulosAdicionais}
                              </p>
                            </div>

                            <div className="col-span-1">
                              <span className="font-semibold text-gray-700">
                                Feitos Adic.:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {receita.feitosAdicionais}
                              </p>
                            </div>

                            <div className="col-span-3">
                              <span className="font-semibold text-gray-700">
                                Forma/Alvo:
                              </span>
                              <p className="text-gray-600 mt-1 truncate">
                                {receita.formaAlvo}
                              </p>
                            </div>

                            <div className="col-span-6">
                              <span className="font-semibold text-gray-700">
                                Efeito/Descrição:
                              </span>
                              <p className="text-gray-600 mt-1 truncate">
                                {receita.efeitoDescricao}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botão de ação - MOSTRA APENAS NO MODO EDIÇÃO */}
                        <div className="flex-shrink-0">
                          {!fichaTrancada ? (
                            <button
                              onClick={() => removerReceita(receita.id)}
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Remover receita"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <div className="text-green-500 p-1">
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
      </div>
    </div>
  );
};

export default Criacao;