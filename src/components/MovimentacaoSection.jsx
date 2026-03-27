// MovimentacaoSection.jsx
// Extraído de FichaCJphant.tsx — isolado para que mudanças em movimentação
// não rerenderizem o componente pai inteiro.
import React, { memo } from "react";
import { SectionHeader } from "./ui-components";

const MovimentacaoSection = memo(({
  atributos,
  movimentacao,
  fichaTrancada,
  pontosAtributoAncestralidade,
  onAtualizar,
  onAtualizarChoque,
  onAtualizarRestricao,
  onAtualizarEvasao,
}) => {
  if (!movimentacao || typeof movimentacao !== "object") {
    console.warn("[MovimentacaoSection] movimentacao inválido:", movimentacao);
    return null;
  }
  if (!atributos || typeof atributos !== "object") {
    console.warn("[MovimentacaoSection] atributos inválido:", atributos);
    return null;
  }

  const totalAtributo = (attr) => {
    if (!atributos[attr]) return 0;
    return (
      atributos[attr].base +
      atributos[attr].ancestral +
      (pontosAtributoAncestralidade[attr] || 0) +
      atributos[attr].bonus
    );
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4">
      <SectionHeader title="Movimentação" />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 min-w-[50px]">
            Veloc.
          </label>
          <input
            type="text"
            value={movimentacao.velocidade || ""}
            onChange={(e) => onAtualizar("velocidade", e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Velocidade de movimento"
            disabled={fichaTrancada}
          />
        </div>

        <div className="border border-gray-200 rounded">
          <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50">
            <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">mov.</div>
            <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">causado</div>
            <div className="p-2 text-xs font-medium text-gray-700">mitigado</div>
          </div>

          {/* Choque */}
          <div className="grid grid-cols-3 border-b border-gray-200">
            <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">Choque</div>
            <div className="p-2 border-r border-gray-200">
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  value={movimentacao.choque?.atual || 0}
                  onChange={(e) => onAtualizarChoque("atual", parseInt(e.target.value) || 0)}
                  className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                  min="0"
                />
                <span className="text-xs">/</span>
                <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                  {Math.floor(totalAtributo("INT") / 2)}
                </span>
              </div>
            </div>
            <div className="p-2">
              <input
                type="number"
                value={movimentacao.mitigadoChoque || 0}
                onChange={(e) => onAtualizar("mitigadoChoque", parseInt(e.target.value) || 0)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                disabled={fichaTrancada}
                min="0"
              />
            </div>
          </div>

          {/* Restrição */}
          <div className="grid grid-cols-3 border-b border-gray-200">
            <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">Restrição</div>
            <div className="p-2 border-r border-gray-200">
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  value={movimentacao.restricao?.atual || 0}
                  onChange={(e) => onAtualizarRestricao("atual", parseInt(e.target.value) || 0)}
                  className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                  min="0"
                />
                <span className="text-xs">/</span>
                <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                  {Math.floor(totalAtributo("DES") / 2)}
                </span>
              </div>
            </div>
            <div className="p-2">
              <input
                type="number"
                value={movimentacao.mitigadoRestricao || 0}
                onChange={(e) => onAtualizar("mitigadoRestricao", parseInt(e.target.value) || 0)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                disabled={fichaTrancada}
                min="0"
              />
            </div>
          </div>

          {/* Evasão */}
          <div className="grid grid-cols-3">
            <div className="p-2 text-xs font-medium text-gray-700 border-r border-gray-200">Evasão</div>
            <div className="p-2 border-r border-gray-200">
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  value={movimentacao.evasao?.atual || 0}
                  onChange={(e) => onAtualizarEvasao("atual", parseInt(e.target.value) || 0)}
                  className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none"
                  min="0"
                />
                <span className="text-xs">/</span>
                <span className="w-8 px-1 py-0.5 text-xs text-center font-medium">
                  {Math.floor(totalAtributo("VEL") / 2)}
                </span>
              </div>
            </div>
            <div className="p-2">
              <input
                type="number"
                value={movimentacao.mitigadoEvasao || 0}
                onChange={(e) => onAtualizar("mitigadoEvasao", parseInt(e.target.value) || 0)}
                className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                disabled={fichaTrancada}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MovimentacaoSection.displayName = "MovimentacaoSection";
export default MovimentacaoSection;