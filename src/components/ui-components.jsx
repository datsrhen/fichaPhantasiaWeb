<<<<<<< HEAD
<<<<<<< HEAD
// ui-components.js
=======
// ui-components.js - COMPLETAMENTE MODIFICADO COM NOVOS COMPONENTES
>>>>>>> 52cabf2 (feat(icons): replace lucide-react with local SVG components)
=======
// ui-components.js
>>>>>>> b26b847 (build ready)
import { ChevronDown, ChevronUp, Lock, Unlock, Plus, Check, Trash2, AlertCircle, CheckCircle2, Edit3, Hammer } from "./icons";
import React from "react";

// Componente de botão de incremento/decremento
export const IncrementDecrementButton = ({
  onIncrement,
  onDecrement,
  value,
  incrementDisabled = false,
  decrementDisabled = false,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
    indigo: "bg-indigo-500 hover:bg-indigo-600 text-white",
    gray: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onIncrement}
        disabled={incrementDisabled}
        className={`w-6 h-4 flex items-center justify-center rounded-t text-xs font-bold ${colorClasses[color]} disabled:bg-gray-300 disabled:cursor-not-allowed`}
      >
        +
      </button>
      <div className="text-base font-bold w-6 text-center border-x border-gray-300 py-0.5">
        {value}
      </div>
      <button
        onClick={onDecrement}
        disabled={decrementDisabled}
        className={`w-6 h-4 flex items-center justify-center rounded-b text-xs font-bold ${colorClasses[color]} disabled:bg-gray-300 disabled:cursor-not-allowed`}
      >
        -
      </button>
    </div>
  );
};

// Componente de input de bônus
export const BonusInput = ({ value, onIncrement, onDecrement, onChange }) => {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onIncrement}
        className="w-6 h-4 flex items-center justify-center rounded-t bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold"
      >
        +
      </button>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-6 text-center border-x border-gray-300 py-0.5 text-sm focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={onDecrement}
        className="w-6 h-4 flex items-center justify-center rounded-b bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold"
      >
        -
      </button>
    </div>
  );
};

// Componente de botão de confirmação
export const ConfirmButton = ({
  onClick,
  disabled = false,
  children,
  variant = "green",
}) => {
  const variantClasses = {
    green: "bg-green-500 hover:bg-green-600 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    gray: "bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${variantClasses[variant]} disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

// Componente de botão com ícone
export const IconButton = ({
  onClick,
  icon: Icon,
  title,
  variant = "blue",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
  };

  const variantClasses = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded transition-colors ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <Icon size={size === "sm" ? 16 : 20} />
    </button>
  );
};

// Componente de seção com accordion
export const AccordionSection = ({ title, toggleId, isOpen, onToggle, children }) => {
  // toggleId permite que o pai use um único handler estável para todos os accordions
  const handleClick = toggleId != null ? () => onToggle(toggleId) : onToggle;
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={handleClick}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 space-y-3 bg-white rounded-b-lg">{children}</div>
      )}
    </div>
  );
};

// Componente de card selecionável
export const SelectableCard = ({
  isSelected,
  onSelect,
  disabled = false,
  children,
}) => {
  return (
    <div
      className={`border rounded-lg p-3 transition-all cursor-pointer ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onSelect}
    >
      {children}
    </div>
  );
};

// Componente de card de visualização
export const ViewCard = ({ children }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {children}
    </div>
  );
};

// Componente de painel de status - MODIFICADO para layout compacto
export const StatusPanel = ({
  icon: Icon,
  iconColor = "blue",
  title,
  value,
  valueColor = "blue",
  action = false,
  actionText = "",
  onAction,
  children,
  className = "",
}) => {
  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    red: "text-red-600",
  };

  const valueColorClasses = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    indigo: "text-indigo-700",
    red: "text-red-700",
  };

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-2 mb-3 text-xs ${className}`}
    >
      {/* Linha superior: Ícone, Título e Valor na mesma linha */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <Icon className={iconColorClasses[iconColor]} size={14} />
          <span className="font-medium text-gray-700">{title}</span>
        </div>
        <span className={`font-bold px-2 ${valueColorClasses[valueColor]}`}>
          {value}
        </span>
      </div>

      {/* Conteúdo adicional (como atributos permitidos) */}
      {children}

      {/* Botão de ação - sempre na parte inferior */}
      {action && (
        <div className="mt-1">
          <button
            onClick={onAction}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

// Componente de cabeçalho de seção
export const SectionHeader = ({
  title,
  badge,
  action = false,
  actionText = "",
  onAction,
  children,
}) => {
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {badge && (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {action && (
          <button
            onClick={onAction}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export const abrirAnotacoes = (secaoId) => {
  setSecaoIdAtiva(secaoId);
  setIsAnotacoesOpen(true);
}

export const fecharAnotacoes = () => {
setIsAnotacoesOpen(false);
setSecaoIdAtiva(null);
}

export const renderCabecalhoSecao = (secaoId) => {
  return (
    <div className="flex items-center justify-between gap-2">
      {secaoId && (
        <button
          type="button"
          className="rounded-lg px-3 py-1 text-sm text-gray-800 font-medium hover:bg-gray-100"
          onClick={() => abrirAnotacoes(secaoId)}
        >
          Anotações
        </button>
      )}
    </div>
  );
};

// Componente de indicador de modo
export const ModeIndicator = ({ isLocked }) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isLocked
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {isLocked ? (
        <>
          <Lock size={16} />
          <span>Modo Leitura</span>
        </>
      ) : (
        <>
          <Edit3 size={16} />
          <span>Modo Edição</span>
        </>
      )}
    </div>
  );
};

// Componente de botão de travar/destravar
export const LockToggleButton = ({ isLocked, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-lg transition-colors ${
        isLocked
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-yellow-500 hover:bg-yellow-600 text-white"
      }`}
      title={isLocked ? "Destravar ficha" : "Travar ficha"}
    >
      {isLocked ? <Lock size={24} /> : <Unlock size={24} />}
    </button>
  );
};

export const ToggleEditarItem = ({ isLocked, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-1 rounded-md transition-colors ${
        isLocked
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-yellow-500 hover:bg-yellow-600 text-white"
      }`}
      title={isLocked ? "Editar item" : "Concluir"}
    >
      {isLocked ? <Edit3 size={16} /> : <Check size={16} />}
    </button>
  );
};

// NOVO COMPONENTE: Campo de Recursos (PFs/PEs/PCs)
export const RecursoField = ({
  label,
  current,
  max,
  onCurrentChange,
  onMaxChange,
  disabled = false,
  color = "red",
}) => {
  const colorClasses = {
    red: "border-red-300 bg-red-50 text-red-700",
    blue: "border-blue-300 bg-blue-50 text-blue-700",
    green: "border-green-300 bg-green-50 text-green-700",
    purple: "border-purple-300 bg-purple-50 text-purple-700",
  };

  return (
    <div className={`border-2 rounded-lg p-2 ${colorClasses[color]}`}>
      <label className="block text-xs font-medium mb-1">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={current}
          onChange={(e) => onCurrentChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          className="w-12 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
          min="0"
        />
        <span className="font-bold">/</span>
        <input
          type="number"
          value={max}
          onChange={(e) => onMaxChange(parseInt(e.target.value) || 0)}
          disabled={disabled}
          className="w-12 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
          min="0"
        />
      </div>
    </div>
  );
};

// NOVO COMPONENTE: Campo de Traumas
export const TraumaField = ({
  current,
  max,
  description,
  onCurrentChange,
  onMaxChange,
  onDescriptionChange,
  disabled = false,
}) => {
  return (
    <div className="border-2 border-orange-300 bg-orange-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-orange-700">Traumas</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={current}
            onChange={(e) => onCurrentChange(parseInt(e.target.value) || 0)}
            disabled={disabled}
            className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
          <span className="font-bold text-xs">/</span>
          <input
            type="number"
            value={max}
            onChange={(e) => onMaxChange(parseInt(e.target.value) || 0)}
            disabled={disabled}
            className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
        </div>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
        placeholder="Descrição dos traumas..."
        className="w-full h-20 px-2 py-1 border border-gray-300 rounded text-xs focus:border-orange-500 focus:outline-none disabled:bg-gray-100 resize-none overflow-y-auto"
        rows="3"
      />
    </div>
  );
};

// NOVO COMPONENTE: Recursos compactos para cabeçalho - VERSÃO CORRIGIDA
export const HeaderRecursos = ({
  pfs = { current: 0, max: 0 },
  pes = { current: 0, max: 0 },
  pcs = { current: 0, max: 0 },
  traumas = { current: 0, max: 0, description: "" },
  onPfsChange,
  onPesChange,
  onPcsChange,
  onTraumasChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* PFs */}
      <div className="text-center">
        <div className="text-xs font-medium text-red-700 mb-1">PFs</div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={pfs.current || 0}
            onChange={(e) =>
              onPfsChange({ ...pfs, current: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
          <span className="font-bold">/</span>
          <input
            type="number"
            value={pfs.max || 0}
            onChange={(e) =>
              onPfsChange({ ...pfs, max: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
        </div>
      </div>

      {/* PEs */}
      <div className="text-center">
        <div className="text-xs font-medium text-blue-700 mb-1">PEs</div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={pes.current || 0}
            onChange={(e) =>
              onPesChange({ ...pes, current: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
          <span className="font-bold">/</span>
          <input
            type="number"
            value={pes.max || 0}
            onChange={(e) =>
              onPesChange({ ...pes, max: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
        </div>
      </div>

      {/* PCs */}
      <div className="text-center">
        <div className="text-xs font-medium text-green-700 mb-1">PCs</div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={pcs.current || 0}
            onChange={(e) =>
              onPcsChange({ ...pcs, current: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
          <span className="font-bold">/</span>
          <input
            type="number"
            value={pcs.max || 0}
            onChange={(e) =>
              onPcsChange({ ...pcs, max: parseInt(e.target.value) || 0 })
            }
            disabled={disabled}
            className="w-10 px-1 py-0.5 border border-gray-300 rounded text-sm text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
        </div>
      </div>

      {/* Traumas Compacto */}
      <div className="text-center">
        <div className="text-xs font-medium text-orange-700 mb-1">Traumas</div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={traumas.current || 0}
            onChange={(e) =>
              onTraumasChange({
                ...traumas,
                current: parseInt(e.target.value) || 0,
              })
            }
            disabled={disabled}
            className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
          <span className="font-bold text-xs">/</span>
          <input
            type="number"
            value={traumas.max || 0}
            onChange={(e) =>
              onTraumasChange({
                ...traumas,
                max: parseInt(e.target.value) || 0,
              })
            }
            disabled={disabled}
            className="w-8 px-1 py-0.5 border border-gray-300 rounded text-xs text-center font-bold focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};