// AtributosSection.jsx
// Extraído de FichaCJphant.tsx — isolado para que mudanças em atributos
// não rerenderizem o componente pai inteiro.
import React, { memo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  SectionHeader,
  StatusPanel,
  IncrementDecrementButton,
  BonusInput,
} from "./ui-components";
import {
  PONTOS_DISPONIVEIS,
  VALOR_MINIMO,
  nomeCompleto,
  nivelMaestria,
} from "../util/constants";

const AtributosSection = memo(({
  atributos,
  atributosTrancados,
  pontosRestantes,
  pontosAtributoAncestralidade,
  atributosPermitidos,
  ancestralidadesConfirmadas,
  distribuicaoAncestralConfirmada,
  distribuicaoAtributoAncestralidadeConfirmada,
  pontosParaDistribuir,
  pontosAncestralRestantesParaDistribuir,
  pontosAtributoAncestralidadeRestantes,
  totalPontosAtributoAncestralidade,
  editandoAncestralAtributos,
  editandoPontosAtributoAncestralidade,
  onAnotacoes,
  onTrancar,
  onResetar,
  onIncrementar,
  onDecrementar,
  onIncrementarAncestral,
  onDecrementarAncestral,
  onIncrementarAtributoAncestralidade,
  onDecrementarAtributoAncestralidade,
  onIncrementarBonus,
  onDecrementarBonus,
  onAlterarBonus,
  onIniciarDistribuicaoAncestral,
  onConfirmarDistribuicaoAncestral,
  onIniciarDistribuicaoAtributo,
  onConfirmarDistribuicaoAtributo,
}) => {
  if (!atributos || typeof atributos !== "object") {
    console.warn("[AtributosSection] atributos inválido:", atributos);
    return null;
  }

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4">
      <SectionHeader title="Atributos">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-lg px-3 py-1 text-sm text-gray-800 font-bold hover:bg-gray-100"
            onClick={() => onAnotacoes("atributos")}
          >
            Anotações
          </button>
        </div>
      </SectionHeader>

      {!atributosTrancados && (
        <StatusPanel
          icon={pontosRestantes === 0 ? CheckCircle2 : AlertCircle}
          iconColor={pontosRestantes === 0 ? "green" : "blue"}
          title="Restantes"
          value={pontosRestantes}
          valueColor="blue"
          action={pontosRestantes === 0}
          actionText="Confirmar Distribuição"
          onAction={onTrancar}
        />
      )}

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
            actionText={!editandoAncestralAtributos ? "Distribuir" : "Confirmar"}
            onAction={
              !editandoAncestralAtributos
                ? onIniciarDistribuicaoAncestral
                : onConfirmarDistribuicaoAncestral
            }
            className="bg-purple-50 border-2 border-purple-200 text-xs"
          />
        )}

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
              !editandoPontosAtributoAncestralidade ? "Distribuir" : "Confirmar"
            }
            onAction={
              !editandoPontosAtributoAncestralidade
                ? onIniciarDistribuicaoAtributo
                : onConfirmarDistribuicaoAtributo
            }
            className="bg-indigo-50 border-2 border-indigo-200 text-xs"
          >
            <div className="text-xs text-indigo-600 mb-2">
              Atributos permitidos: {atributosPermitidos.join(", ")}
            </div>
          </StatusPanel>
        )}

      <div className="space-y-2">
        <div className="flex justify-end gap-1 pb-2 text-xs text-gray-500 border-b border-gray-200">
          <div className="min-w-[34px] text-center">Total</div>
          <div className="min-w-[34px] text-center">Base</div>
          <div className="min-w-[34px] text-center">Anc.</div>
          <div className="min-w-[34px] text-center">Bônus</div>
        </div>

        {Object.keys(atributos).map((atributo) => {
          const attr = atributos[atributo];
          if (!attr) return null;

          const pontosAtributoAncestral = pontosAtributoAncestralidade[atributo] || 0;
          const total = attr.base + attr.ancestral + pontosAtributoAncestral + attr.bonus;
          const atributoPermitido = atributosPermitidos.includes(atributo);

          return (
            <div
              key={atributo}
              className={`border border-gray-200 rounded p-2 transition-colors ${
                !atributoPermitido && editandoPontosAtributoAncestralidade
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
                        onIncrement={() => onIncrementar(atributo)}
                        onDecrement={() => onDecrementar(atributo)}
                        value={attr.base}
                        incrementDisabled={pontosRestantes <= 0}
                        decrementDisabled={attr.base <= VALOR_MINIMO}
                        color="green"
                      />
                    ) : (
                      <div className="text-base font-bold">{attr.base}</div>
                    )}
                  </div>

                  <div className="min-w-[34px] text-center">
                    {editandoAncestralAtributos ? (
                      <IncrementDecrementButton
                        onIncrement={() => onIncrementarAncestral(atributo)}
                        onDecrement={() => onDecrementarAncestral(atributo)}
                        value={attr.ancestral + pontosAtributoAncestral}
                        incrementDisabled={pontosAncestralRestantesParaDistribuir <= 0}
                        decrementDisabled={attr.ancestral <= 0}
                        color="purple"
                      />
                    ) : editandoPontosAtributoAncestralidade ? (
                      <IncrementDecrementButton
                        onIncrement={() => onIncrementarAtributoAncestralidade(atributo)}
                        onDecrement={() => onDecrementarAtributoAncestralidade(atributo)}
                        value={attr.ancestral + pontosAtributoAncestral}
                        incrementDisabled={
                          pontosAtributoAncestralidadeRestantes <= 0 || !atributoPermitido
                        }
                        decrementDisabled={pontosAtributoAncestral <= 0}
                        color="indigo"
                      />
                    ) : (
                      <div className="text-base font-bold">
                        {attr.ancestral + pontosAtributoAncestral}
                      </div>
                    )}
                  </div>

                  <div className="min-w-[34px] text-center">
                    <BonusInput
                      value={attr.bonus}
                      onIncrement={() => onIncrementarBonus(atributo)}
                      onDecrement={() => onDecrementarBonus(atributo)}
                      onChange={(e) => onAlterarBonus(atributo, e.target.value)}
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
          onClick={onResetar}
          className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded transition-colors text-sm"
        >
          Resetar Atributos
        </button>
      )}
    </div>
  );
});

AtributosSection.displayName = "AtributosSection";
export default AtributosSection;