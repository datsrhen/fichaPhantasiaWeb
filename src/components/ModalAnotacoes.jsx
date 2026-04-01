// ModalAnotacoes.jsx
// Componente de modal de anotações por seção.

import React, { memo, useState, useEffect } from "react";

// Formata ISO string para pt-BR — definida no nível de módulo
// para ser acessível por anexarEntradaComData no mesmo arquivo.
export function formatarDataPtBr(isoString) {
  if (!isoString) return "";
  try {
    const agora = new Date(isoString);
    if (isNaN(agora.getTime())) {
      console.warn("[formatarDataPtBr] data inválida:", isoString);
      return "";
    }
    return agora.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch (err) {
    console.error("[formatarDataPtBr] erro ao formatar:", err);
    return "";
  }
}

// Anexa nova entrada com carimbo de data ao histórico existente.
function anexarEntradaComData(historicoAnterior, textoNovo) {
  const textoLimpo = (textoNovo ?? "").trim();
  if (!textoLimpo) return historicoAnterior ?? "";

  const carimbo = formatarDataPtBr(new Date().toISOString());
  const entrada = `${carimbo}: ${textoLimpo}\n\n`;
  return `${historicoAnterior ?? ""}${entrada}`;
}

const ModalAnotacoes = memo(function ModalAnotacoes({
  isOpen,
  secaoId,
  tituloSecao,
  textoInicial,
  onSave,
  onClose,
}) {
  const [historico, setHistorico] = useState("");
  const [novaEntrada, setNovaEntrada] = useState("");

  // Carrega o texto da seção toda vez que o modal abre ou troca de seção
  useEffect(() => {
    if (!isOpen) return;
    setHistorico(textoInicial ?? "");
    setNovaEntrada("");
  }, [isOpen, secaoId, textoInicial]);

  if (!isOpen) return null;

  function handleSalvarEFechar() {
    if (!secaoId) {
      console.warn("[ModalAnotacoes] secaoId ausente ao salvar");
      return;
    }
    const historicoAtualizado = anexarEntradaComData(historico, novaEntrada);
    setHistorico(historicoAtualizado);
    setNovaEntrada("");
    onSave(secaoId, historicoAtualizado);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Fechar anotações"
      />

      {/* Card */}
      <div
        className="relative z-10 w-[min(520px,92vw)] rounded-2xl bg-white p-4 shadow-xl text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Anotações{tituloSecao ? ` — ${tituloSecao}` : ""}
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
              Fechar
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); handleSalvarEFechar(); }}
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Histórico — somente leitura */}
        <textarea
          className="mt-3 w-full min-h-[160px] rounded-xl border border-gray-300 p-3 text-sm outline-none bg-gray-50"
          value={historico}
          readOnly
          aria-label="Histórico de anotações"
        />

        {/* Nova entrada */}
        <textarea
          className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-300 p-3 text-sm outline-none"
          placeholder="Nova anotação..."
          value={novaEntrada}
          onChange={(e) => setNovaEntrada(e.target.value)}
          autoFocus
          aria-label="Nova anotação"
        />
      </div>
    </div>
  );
});

export default ModalAnotacoes;