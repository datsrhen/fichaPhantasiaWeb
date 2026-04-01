// IdentidadeSection.jsx
// Estado debounced de aparencia e historia vive aqui — não no pai.
import React, { memo } from "react";
import { LockToggleButton } from "./ui-components";
import { useDebouncedField } from "../util/useDebounce";
import ModalAnotacoes from "./ModalAnotacoes";

const RecursoField = ({ label, value, onChangeCurrent, onChangeMax }) => (
  <div className="flex-1">
    <label className="block text-xs font-medium text-red-700 mb-1">{label}</label>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value?.current || 0}
        onChange={onChangeCurrent}
        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
        min="0"
      />
      <span className="font-bold">/</span>
      <input
        type="number"
        value={value?.max || 0}
        onChange={onChangeMax}
        className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400"
        min="0"
      />
    </div>
  </div>
);

const IdentidadeSection = memo(({
  descricao,
  recursos,
  fichaTrancada,
  isAnotacoesOpen,
  secaoIdAtiva,
  historicoDaSecao,
  onSalvarAnotacoes,
  onFecharModal,
  onTrancaFicha,
  onAtualizarDescricao,
  onAtualizarRecursos
}) => {
  if (!descricao || typeof descricao !== "object") {
    console.warn("[IdentidadeSection] descricao inválido:", descricao);
    return null;
  }
  if (!recursos || typeof recursos !== "object") {
    console.warn("[IdentidadeSection] recursos inválido:", recursos);
    return null;
  }

  // Estado debounced local — não sobe para o Context a cada tecla
  const { localValue: aparenciaLocal, handleChange: handleAparenciaChange } =
    useDebouncedField(descricao.aparencia, (v) => onAtualizarDescricao("aparencia", v));

  const { localValue: historiaLocal, handleChange: handleHistoriaChange } =
    useDebouncedField(descricao.historia, (v) => onAtualizarDescricao("historia", v));

  return (
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
          onSave={onSalvarAnotacoes}
          onClose={onFecharModal}
        />
        <LockToggleButton isLocked={fichaTrancada} onToggle={onTrancaFicha} />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Coluna 1-2: Nome, Idade, Convicção, Vício */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
              <input
                type="text"
                value={descricao.nome}
                onChange={(e) => onAtualizarDescricao("nome", e.target.value)}
                disabled={fichaTrancada}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Nome do personagem"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Idade</label>
              <input
                type="text"
                value={descricao.idade}
                onChange={(e) => onAtualizarDescricao("idade", e.target.value)}
                disabled={fichaTrancada}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Idade"
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Convicção</label>
              <input
                type="text"
                value={descricao.conviccao}
                onChange={(e) => onAtualizarDescricao("conviccao", e.target.value)}
                disabled={fichaTrancada}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Crenças e princípios"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Vício</label>
              <input
                type="text"
                value={descricao.vicio}
                onChange={(e) => onAtualizarDescricao("vicio", e.target.value)}
                disabled={fichaTrancada}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Vícios e fraquezas"
              />
            </div>
          </div>
        </div>

        {/* Coluna 3-5: Aparência, História e Recursos */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Aparência</label>
              <textarea
                value={aparenciaLocal}
                onChange={handleAparenciaChange}
                disabled={fichaTrancada}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                placeholder="Descrição física"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">História</label>
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

          {/* Recursos */}
          <div className="border-2 border-red-300 bg-red-50 rounded-lg p-3">
            <div className="flex items-center justify-between gap-2 mb-3">
              <RecursoField
                label="PFs"
                value={recursos.pfs}
                onChangeCurrent={(e) => onAtualizarRecursos({ pfs: { ...recursos.pfs, current: parseInt(e.target.value) || 0 } })}
                onChangeMax={(e) => onAtualizarRecursos({ pfs: { ...recursos.pfs, max: parseInt(e.target.value) || 0 } })}
              />
              <RecursoField
                label="PEs"
                value={recursos.pes}
                onChangeCurrent={(e) => onAtualizarRecursos({ pes: { ...recursos.pes, current: parseInt(e.target.value) || 0 } })}
                onChangeMax={(e) => onAtualizarRecursos({ pes: { ...recursos.pes, max: parseInt(e.target.value) || 0 } })}
              />
              <RecursoField
                label="PCs"
                value={recursos.pcs}
                onChangeCurrent={(e) => onAtualizarRecursos({ pcs: { ...recursos.pcs, current: parseInt(e.target.value) || 0 } })}
                onChangeMax={(e) => onAtualizarRecursos({ pcs: { ...recursos.pcs, max: parseInt(e.target.value) || 0 } })}
              />
              <RecursoField
                label="DD"
                value={recursos.dd}
                onChangeCurrent={(e) => onAtualizarRecursos({ dd: { ...recursos.dd, current: parseInt(e.target.value) || 0 } })}
                onChangeMax={(e) => onAtualizarRecursos({ dd: { ...recursos.dd, max: parseInt(e.target.value) || 0 } })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-red-700">Traumas</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={recursos.traumas?.current || 0}
                    onChange={(e) => onAtualizarRecursos({ traumas: { ...recursos.traumas, current: parseInt(e.target.value) || 0 } })}
                    className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400"
                    min="0"
                  />
                  <span className="font-bold text-xs">/</span>
                  <input
                    type="number"
                    value={recursos.traumas?.max || 0}
                    onChange={(e) => onAtualizarRecursos({ traumas: { ...recursos.traumas, max: parseInt(e.target.value) || 0 } })}
                    className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400"
                    min="0"
                  />
                </div>
              </div>
              <textarea
                value={recursos.traumas?.description || ""}
                onChange={(e) => onAtualizarRecursos({ traumas: { ...recursos.traumas, description: e.target.value } })}
                placeholder="Descrição dos traumas..."
                className="w-full h-16 px-2 py-1 border border-gray-300 rounded text-xs focus:border-red-500 focus:outline-none resize-none overflow-y-auto"
                rows="2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

IdentidadeSection.displayName = "IdentidadeSection";
export default IdentidadeSection;