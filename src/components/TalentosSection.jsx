// TalentosSection.jsx
// 463 itens em 5 categorias — accordion fecha/abre para controlar o que é montado.
import React, { memo, useCallback } from "react";
import { useVirtualList } from "../util/useVirtualList";
import {
  SectionHeader,
  ModeIndicator,
  AccordionSection,
  SelectableCard,
  ViewCard,
} from "./ui-components";

// Renderiza um campo condicional (só exibe se tiver valor)
const renderCampo = (rotulo, valor) => {
  if (!valor || valor === "" || valor === "0" || valor === 0) return null;
  return (
    <div className="flex">
      <span className="text-xs font-semibold text-gray-500 mr-1">{rotulo}:</span>
      <span className="text-xs text-gray-700">{valor}</span>
    </div>
  );
};

// Card de talento — memoizado para não rerenderizar ao abrir outro accordion
const TalentoCard = memo(({ talento, isSelected, onToggle }) => {
  if (!talento?.id) {
    console.warn("[TalentoCard] talento inválido:", talento);
    return null;
  }

  return (
    <SelectableCard
      isSelected={isSelected}
      onSelect={() => onToggle(talento.id)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected || false}
          onChange={() => onToggle(talento.id)}
          className="mt-1 w-4 h-4"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-base">{talento.nome}</span>
            {talento.pfsPes && (
              <span className="text-base font-bold px-3 py-1 rounded bg-green-100 text-green-700">
                {talento.pfsPes}
              </span>
            )}
          </div>
          {renderCampo("Pré-requisito", talento.prerequisito)}
          <p className="text-sm text-gray-700 leading-relaxed">{talento.descricao}</p>
          {renderCampo("Dificuldade+", talento.dif)}
          {renderCampo("Círculos Adicionais", talento.circs)}
          {renderCampo("Feitos Adicionais", talento.fts)}
          {renderCampo("Subtipo de Criação", talento.subtipoCriacao)}
          {renderCampo("Escola de Magia Arcana", talento.escolaMagiaArcana)}
          {renderCampo("Ato de Magia Espiritual", talento.atoMagiaEspiritual)}
        </div>
      </div>
    </SelectableCard>
  );
});

TalentoCard.displayName = "TalentoCard";

// Card de talento em modo leitura
const TalentoViewCard = memo(({ talento }) => {
  if (!talento?.id) return null;
  return (
    <ViewCard>
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-base">{talento.nome}</span>
        {talento.pfsPes && (
          <span className="text-base font-bold px-3 py-1 rounded bg-green-100 text-green-700">
            {talento.pfsPes}
          </span>
        )}
      </div>
      {renderCampo("Pré-requisito", talento.prerequisito)}
      <p className="text-sm text-gray-700 leading-relaxed">{talento.descricao}</p>
      {renderCampo("Dificuldade+", talento.dif)}
      {renderCampo("Círculos Adicionais", talento.circs)}
      {renderCampo("Feitos Adicionais", talento.fts)}
      {renderCampo("Subtipo de Criação", talento.subtipoCriacao)}
      {renderCampo("Escola de Magia Arcana", talento.escolaMagiaArcana)}
      {renderCampo("Ato de Magia Espiritual", talento.atoMagiaEspiritual)}
    </ViewCard>
  );
});

TalentoViewCard.displayName = "TalentoViewCard";

const TalentosSection = memo(({
  talentos,
  talentosSelecionados,
  talentosAbertos,
  fichaTrancada,
  onToggleTalentos,
  onToggleTalento,
  onAnotacoes,
}) => {
  if (!Array.isArray(talentos)) {
    console.warn("[TalentosSection] talentos não é array:", talentos);
    return null;
  }
  if (!talentosSelecionados || typeof talentosSelecionados !== "object") {
    console.warn("[TalentosSection] talentosSelecionados inválido:", talentosSelecionados);
    return null;
  }

  // Talentos selecionados para modo leitura — derivado aqui para não
  // passar a busca para o pai
  const talentosSelecionadosLista = React.useMemo(() => {
    const selecionados = [];
    Object.keys(talentosSelecionados)
      .filter((id) => talentosSelecionados[id])
      .forEach((talentoId) => {
        for (const categoria of talentos) {
          const talento = categoria.talentos.find((t) => t.id === talentoId);
          if (talento) { selecionados.push(talento); break; }
        }
      });
    return selecionados;
  }, [talentos, talentosSelecionados]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <SectionHeader title="Talentos" action={false}>
        <ModeIndicator isLocked={fichaTrancada} />
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-lg px-3 py-1 text-sm text-gray-800 font-bold hover:bg-gray-100"
            onClick={() => onAnotacoes("talentos")}
          >
            Anotações
          </button>
        </div>
      </SectionHeader>

      <div
        className={`flex-1 space-y-4 overflow-y-auto pr-2 ${
          fichaTrancada ? "max-h-[500px]" : ""
        }`}
      >
        {fichaTrancada ? (
          <div>
            {talentosSelecionadosLista.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">Nenhum talento selecionado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {talentosSelecionadosLista.map((talento) => (
                  <TalentoViewCard key={talento.id} talento={talento} />
                ))}
              </div>
            )}
          </div>
        ) : (
          talentos.map((categoria) => (
            <AccordionSection
              key={categoria.tipo}
              title={categoria.tipo}
              toggleId={categoria.tipo}
              isOpen={talentosAbertos[categoria.tipo]}
              onToggle={onToggleTalentos}
            >
              <VirtualizedTalentos
                talentos={categoria.talentos}
                talentosSelecionados={talentosSelecionados}
                onToggle={onToggleTalento}
              />
            </AccordionSection>
          ))
        )}
      </div>
    </div>
  );
});

TalentosSection.displayName = "TalentosSection";

// Lista virtualizada de talentos dentro de um accordion aberto.
// Renderiza apenas os cards visíveis — essencial para Magia Espiritual (213 itens).
const CARD_HEIGHT = 130; // altura estimada por card (px) — ajustar se o layout mudar

const VirtualizedTalentos = memo(({ talentos, talentosSelecionados, onToggle }) => {
  if (!Array.isArray(talentos) || talentos.length === 0) return null;

  // Para listas pequenas, não vale a pena virtualizar
  if (talentos.length <= 20) {
    return (
      <>
        {talentos.map((talento) => (
          <TalentoCard
            key={talento.id}
            talento={talento}
            isSelected={talentosSelecionados[talento.id]}
            onToggle={onToggle}
          />
        ))}
      </>
    );
  }

  const { containerRef, handleScroll, virtualItems, totalHeight } =
    useVirtualList(talentos, CARD_HEIGHT);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: "480px", overflowY: "auto", position: "relative" }}
      aria-label={`Lista de ${talentos.length} talentos`}
    >
      {/* Espaçador que dá a altura total ao container */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {virtualItems.map(({ index, item: talento, offsetTop }) => (
          <div
            key={talento.id}
            style={{
              position: "absolute",
              top: offsetTop,
              left: 0,
              right: 0,
            }}
          >
            <TalentoCard
              talento={talento}
              isSelected={talentosSelecionados[talento.id]}
              onToggle={onToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualizedTalentos.displayName = "VirtualizedTalentos";

export default TalentosSection;