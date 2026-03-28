// OrigensSection.jsx
import React, { memo, useMemo } from "react";
import { AlertCircle } from "./icons";
import {
  SectionHeader,
  AccordionSection,
  SelectableCard,
  ViewCard,
  ConfirmButton,
} from "./ui-components";
import { calcularTotalOrigensSelecionadas } from "../util/calculations";

const OrigensSection = memo(({
  origens,
  origensConfirmadas,
  origensSelecionadas,
  andrilhagemSelecionada,
  magiaDespertaSelecionada,
  origensSelecionadasLista,
  origensAbertas,
  onToggleOrigem,
  onToggleOpcao,
  onConfirmar,
  onAnotacoes,
}) => {
  if (!Array.isArray(origens)) {
    console.warn("[OrigensSection] origens inválido:", origens);
    return null;
  }

  // Total calculado localmente para uso nos cards especiais
  const totalSelecionadas = useMemo(
    () => calcularTotalOrigensSelecionadas(
      origensSelecionadas, andrilhagemSelecionada, magiaDespertaSelecionada
    ),
    [origensSelecionadas, andrilhagemSelecionada, magiaDespertaSelecionada]
  );

  const origemPrincipais = useMemo(
    () => origens.filter((o) =>
      o.tipo === "Infância" || o.tipo === "Estudos" || o.tipo === "Ofícios"
    ),
    [origens]
  );

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <SectionHeader
        title="Origens"
        badge={!origensConfirmadas ? `(${totalSelecionadas}/3)` : ""}
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-lg px-3 py-1 text-sm text-gray-800 font-bold hover:bg-gray-100"
            onClick={() => onAnotacoes("origens")}
          >
            Anotações
          </button>
        </div>
      </SectionHeader>

      {!origensConfirmadas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-blue-600" size={20} />
            <span className="text-sm text-blue-700">
              Selecione no máximo 3 origens no total (categorias principais +
              Andrilhagem/Magia Desperta)
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[500px]">
        {!origensConfirmadas ? (
          <>
            {origemPrincipais.map((origem) => (
              <AccordionSection
                key={origem.tipo}
                title={origem.tipo}
                toggleId={origem.tipo}
                isOpen={origensAbertas[origem.tipo]}
                onToggle={onToggleOrigem}
              >
                {origem.opcoes.map((opcao) => {
                  const disabled =
                    totalSelecionadas >= 3 && !origensSelecionadas[origem.tipo];
                  return (
                    <SelectableCard
                      key={opcao.id}
                      isSelected={origensSelecionadas[origem.tipo] === opcao.id}
                      onSelect={() => onToggleOpcao(opcao.id)}
                      disabled={disabled}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          checked={origensSelecionadas[origem.tipo] === opcao.id}
                          onChange={() => { if (!disabled) onToggleOpcao(opcao.id); }}
                          className="mt-1 w-4 h-4"
                          name={origem.tipo}
                          disabled={disabled}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-base">{opcao.nome}</span>
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

            {/* Opções especiais */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-4 space-y-4">
                <EspecialCard
                  label="Andrilhagem"
                  descricao="1 metro em todas as velocidades de movimento nos níveis 1, 4, 8, 12, 16. Um talento de sobrevivência. Uma habilidade extra em nível iniciante relacionada a sociedades, sobrevivência ou intuição."
                  isSelected={andrilhagemSelecionada}
                  disabled={totalSelecionadas >= 3 && !andrilhagemSelecionada}
                  onToggle={() => onToggleOpcao("Andrilhagem-especial")}
                />
                <EspecialCard
                  label="Magia Desperta"
                  descricao="um talento de Magia Arcana ou Espiritual."
                  isSelected={magiaDespertaSelecionada}
                  disabled={totalSelecionadas >= 3 && !magiaDespertaSelecionada}
                  onToggle={() => onToggleOpcao("Magia Desperta-especial")}
                />
              </div>
            </div>
          </>
        ) : (
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
                      <span className="font-semibold text-base">{opcao.nome}</span>
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

      {!origensConfirmadas && (
        <div className="pt-4 mt-4 border-t border-gray-200">
          <ConfirmButton onClick={onConfirmar}>Confirmar Seleção</ConfirmButton>
        </div>
      )}
    </div>
  );
});

OrigensSection.displayName = "OrigensSection";

// Card para opções especiais (Andrilhagem / Magia Desperta)
const EspecialCard = memo(({ label, descricao, isSelected, disabled, onToggle }) => (
  <SelectableCard isSelected={isSelected} onSelect={onToggle} disabled={disabled}>
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="mt-1 w-4 h-4"
        disabled={disabled}
      />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="font-semibold text-base">{label}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {descricao}
        </p>
      </div>
    </div>
  </SelectableCard>
));

EspecialCard.displayName = "EspecialCard";

export default OrigensSection;