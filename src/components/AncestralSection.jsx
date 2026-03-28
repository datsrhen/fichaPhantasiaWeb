// AncestralSection.jsx
import React, { memo } from "react";
import {
  AccordionSection,
  SelectableCard,
  ViewCard,
  ConfirmButton,
} from "./ui-components";
import { PONTOS_ANCESTRALIDADE } from "../util/constants";

const AncestralSection = memo(({
  ancestralidades,
  ancestralidadesConfirmadas,
  caracteristicasSelecionadas,
  caracteristicasAgrupadas,
  ancestralidadesAbertas,
  pontosAncestralidadeDisponiveis,
  onToggleAncestralidade,
  onToggleCaracteristica,
  onConfirmar,
}) => {
  if (!Array.isArray(ancestralidades)) {
    console.warn("[AncestralSection] ancestralidades inválido:", ancestralidades);
    return null;
  }

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ancestralidades</h2>
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

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[500px]">
        {!ancestralidadesConfirmadas ? (
          ancestralidades.map((ancestralidade) => (
            <AccordionSection
              key={ancestralidade.nome}
              title={ancestralidade.nome}
              toggleId={ancestralidade.nome}
              isOpen={ancestralidadesAbertas[ancestralidade.nome]}
              onToggle={onToggleAncestralidade}
            >
              {ancestralidade.caracteristicas.map((caracteristica) => {
                const disabled =
                  pontosAncestralidadeDisponiveis < caracteristica.custo &&
                  !caracteristicasSelecionadas[caracteristica.id];

                return (
                  <SelectableCard
                    key={caracteristica.id}
                    isSelected={caracteristicasSelecionadas[caracteristica.id]}
                    onSelect={() => onToggleCaracteristica(caracteristica.id)}
                    disabled={disabled}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={caracteristicasSelecionadas[caracteristica.id] || false}
                        onChange={() => onToggleCaracteristica(caracteristica.id)}
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
          <div>
            {Object.keys(caracteristicasAgrupadas).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">Nenhuma característica selecionada.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.keys(caracteristicasAgrupadas).map((ancestralidadeNome) => (
                  <ViewCard key={ancestralidadeNome}>
                    <div className="bg-green-100 px-4 py-2 border-b border-green-200 mb-4 -mx-4 -mt-4">
                      <h4 className="font-bold text-lg text-green-800">
                        {ancestralidadeNome}
                      </h4>
                    </div>
                    <div className="space-y-4">
                      {caracteristicasAgrupadas[ancestralidadeNome].map((caracteristica) => (
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!ancestralidadesConfirmadas && (
        <div className="pt-4 mt-4 border-t border-gray-200">
          <ConfirmButton
            onClick={onConfirmar}
            disabled={pontosAncestralidadeDisponiveis < 0}
            variant={pontosAncestralidadeDisponiveis < 0 ? "gray" : "green"}
          >
            Confirmar Seleção
          </ConfirmButton>
        </div>
      )}
    </div>
  );
});

AncestralSection.displayName = "AncestralSection";
export default AncestralSection;