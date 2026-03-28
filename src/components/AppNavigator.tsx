// @ts-nocheck
// AppNavigator
import React, { useState, useRef } from "react";
import { Package, Download, Upload, Plus } from "./icons";

// Import das páginas
import FichaCJphant from "../FichaCJphant";
import Equipamentos from "./Equipamentos";
import Magias from "./Magias";
import Criacao from "../util/criacao";

// Import do contexto
import { FichaProvider } from "../context/FichaContext";
import { useFicha } from "../context/useFicha";

// Componente separado para usar o hook useFicha
const AppContent = () => {
  const [paginaAtual, setPaginaAtual] = useState("ficha");
  const { state, actions } = useFicha();
  const fileInputRef = useRef(null);

  const handleExportar = () => {
    try {
      const nomePersonagem = state.descricao.nome || "personagem";
      const sucesso = actions.exportarFicha(nomePersonagem);
      if (sucesso) {
        alert(`Ficha "${nomePersonagem}" exportada com sucesso!`);
      } else {
        alert("Erro ao exportar a ficha. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar a ficha: " + error.message);
    }
  };

  const handleImportarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const conteudo = await actions.lerArquivoFicha(file);
      const sucesso = actions.carregarFicha(conteudo);
      if (sucesso) {
        alert("Ficha carregada com sucesso!");
        event.target.value = "";
      } else {
        alert("Erro ao carregar a ficha. Arquivo inválido ou corrompido.");
      }
    } catch (error) {
      console.error("Erro ao importar:", error);
      alert("Erro ao ler o arquivo: " + error.message);
    }
  };

  const handleNovaFicha = () => {
    if (
      window.confirm("Isso irá limpar todos os dados atuais. Deseja continuar?")
    ) {
      actions.resetFicha();
      alert("Nova ficha criada!");
    }
  };

  const NavigationBar = () => (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-800">
              Sistema Phantasia
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaginaAtual("ficha")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaAtual === "ficha"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Identidade
            </button>

            <button
              onClick={() => setPaginaAtual("equipamentos")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaAtual === "equipamentos"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bagagem
            </button>

            <button
              onClick={() => setPaginaAtual("magias")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaAtual === "magias"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Magias
            </button>

            <button
              onClick={() => setPaginaAtual("criacao")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginaAtual === "criacao"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Criação
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNovaFicha}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              title="Nova Ficha"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova</span>
            </button>

            <button
              onClick={handleImportarClick}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              title="Importar Ficha"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Importar</span>
            </button>

            <button
              onClick={handleExportar}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              title="Exportar Ficha"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".ficha,application/json"
              className="hidden"
            />
          </div>

          <div className="text-sm text-gray-500 hidden lg:block">
            {paginaAtual === "ficha"
              ? "Identidade do Personagem"
              : paginaAtual === "equipamentos"
              ? "Bagagem e Equipamentos"
              : paginaAtual === "magias"
              ? "Sistema de Magias"
              : "Sistema de Criação"}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPagina = () => {
    switch (paginaAtual) {
      case "ficha":
        return <FichaCJphant />;
      case "equipamentos":
        return <Equipamentos />;
      case "magias":
        return <Magias />;
      case "criacao":
        return <Criacao />;
      default:
        return <FichaCJphant />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <main className="max-w-7xl mx-auto py-6 px-4">{renderPagina()}</main>
    </div>
  );
};

// Componente principal que envolve com o Provider
const AppNavigator = () => {
  return (
    <FichaProvider>
      <AppContent />
    </FichaProvider>
  );
};

export default AppNavigator;