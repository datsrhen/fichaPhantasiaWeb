// HabilidadesSection.jsx
// Extraído de FichaCJphant.tsx — isolado para que mudanças em habilidades
// não rerenderizem o componente pai inteiro.
import React, { memo } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  SectionHeader,
  IconButton,
} from "./ui-components";
import { nivelMaestria } from "../util/constants";

const HabilidadesSection = memo(({
  habilidades,
  bonusHabilidades,
  atributos,
  fichaTrancada,
  adicionarHabilidade,
  removerHabilidade,
  atualizarHabilidade,
  trancarHabilidade,
}) => {
  if (!Array.isArray(habilidades)) {
    console.warn("[HabilidadesSection] habilidades não é array:", habilidades);
    return null;
  }
  if (!atributos || typeof atributos !== "object") {
    console.warn("[HabilidadesSection] atributos inválido:", atributos);
    return null;
  }

  const atributoKeys = Object.keys(atributos);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <SectionHeader
        title="Habilidades"
        action={true}
        actionText="Adicionar"
        onAction={adicionarHabilidade}
      />

      {habilidades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">Nenhuma habilidade criada ainda.</p>
          <p className="text-sm mt-2">
            Clique em "Adicionar" para criar sua primeira habilidade!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Nome</th>
                <th className="border border-gray-300 p-2 text-center">Atrib. 1</th>
                <th className="border border-gray-300 p-2 text-center">Atrib. 2</th>
                <th className="border border-gray-300 p-2 text-center">Bônus</th>
                <th className="border border-gray-300 p-2 text-center">Maestria</th>
                <th className="border border-gray-300 p-2 text-center">Dado</th>
              </tr>
            </thead>
            <tbody>
              {habilidades.map((hab) => (
                <HabilidadeRow
                  key={hab.id}
                  hab={hab}
                  bonus={bonusHabilidades[hab.id] ?? 0}
                  atributoKeys={atributoKeys}
                  fichaTrancada={fichaTrancada}
                  onAtualizar={atualizarHabilidade}
                  onTrancar={trancarHabilidade}
                  onRemover={removerHabilidade}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

HabilidadesSection.displayName = "HabilidadesSection";

// Linha isolada — memoizada individualmente para que editar uma linha
// não rerenderize as outras
const HabilidadeRow = memo(({
  hab,
  bonus,
  atributoKeys,
  fichaTrancada,
  onAtualizar,
  onTrancar,
  onRemover,
}) => {
  if (!hab?.id) {
    console.warn("[HabilidadeRow] hab inválida:", hab);
    return null;
  }

  const maestriaInfo = nivelMaestria[hab.maestria];
  if (!maestriaInfo) {
    console.warn("[HabilidadeRow] maestria desconhecida:", hab.maestria);
  }

  return (
    <tr className="hover:bg-gray-50">
      {/* Nome */}
      <td className="border border-gray-300 p-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={hab.nome}
            onChange={(e) => onAtualizar(hab.id, "nome", e.target.value)}
            disabled={hab.trancada}
            placeholder="Nome da habilidade"
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-transparent"
          />
          {!hab.trancada ? (
            <IconButton
              onClick={() => onTrancar(hab.id)}
              icon={Check}
              title="Confirmar habilidade"
              variant="green"
              size="sm"
            />
          ) : (
            <IconButton
              onClick={() => onRemover(hab.id)}
              icon={Trash2}
              title="Remover habilidade"
              variant="red"
              size="sm"
            />
          )}
        </div>
      </td>

      {/* Atributo 1 */}
      <td className="border border-gray-300 p-2">
        {hab.trancada ? (
          <div className="px-2 py-1 text-center">{hab.atributo1}</div>
        ) : (
          <select
            value={hab.atributo1}
            onChange={(e) => onAtualizar(hab.id, "atributo1", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            {atributoKeys.map((attr) => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
        )}
      </td>

      {/* Atributo 2 */}
      <td className="border border-gray-300 p-2">
        {hab.trancada ? (
          <div className="px-2 py-1 text-center">{hab.atributo2}</div>
        ) : (
          <select
            value={hab.atributo2}
            onChange={(e) => onAtualizar(hab.id, "atributo2", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            {atributoKeys.map((attr) => (
              <option key={attr} value={attr}>{attr}</option>
            ))}
          </select>
        )}
      </td>

      {/* Bônus */}
      <td className="border border-gray-300 p-2 text-center font-bold text-lg">
        +{bonus}
      </td>

      {/* Maestria */}
      <td className="border border-gray-300 p-2">
        {fichaTrancada ? (
          <div className="px-2 py-1 text-center">
            {hab.maestria} - {maestriaInfo?.nome ?? ""}
          </div>
        ) : (
          <select
            value={hab.maestria}
            onChange={(e) => onAtualizar(hab.id, "maestria", e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          >
            {Object.keys(nivelMaestria).map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel} - {nivelMaestria[nivel].nome}
              </option>
            ))}
          </select>
        )}
      </td>

      {/* Dado */}
      <td className="border border-gray-300 p-2 text-center font-semibold">
        {maestriaInfo?.dado ?? ""}
      </td>
    </tr>
  );
});

HabilidadeRow.displayName = "HabilidadeRow";

export default HabilidadesSection;