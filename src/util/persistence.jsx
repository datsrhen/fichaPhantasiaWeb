// persistence.js
import { initialState } from "./initialState";

/**
 * Serializa o estado completo da ficha para uma string JSON
 * @param {Object} state - Estado completo da ficha
 * @returns {string} String JSON compactada
 */
export const salvarFicha = (state) => {
  try {
    const estadoParaSalvar = {
      ...state,
    };

    const jsonString = JSON.stringify(estadoParaSalvar);
    const compressed = btoa(unescape(encodeURIComponent(jsonString)));

    return compressed;
  } catch (error) {
    console.error("Erro ao salvar ficha:", error);
    throw new Error("Falha ao salvar a ficha");
  }
};

/**
 * Desserializa uma string salva de volta para o estado da ficha
 * @param {string} savedData - String salva (comprimida ou não)
 * @returns {Object} Estado da ficha reconstruído
 */
export const carregarFicha = (savedData) => {
  try {
    if (!savedData || typeof savedData !== "string") {
      throw new Error("Dados inválidos: string vazia ou não definida");
    }

    const dadosLimpos = savedData.trim();

    let jsonString;

    // Tenta decodificar se estiver em Base64
    try {
      jsonString = decodeURIComponent(escape(atob(dadosLimpos)));
    } catch (base64Error) {
      // Se falhar, assume que não está comprimido
      console.log("Arquivo não está em Base64, tentando como JSON direto...");
      jsonString = dadosLimpos;
    }

    const loadedState = JSON.parse(jsonString);

    // CORREÇÃO: Mesclagem direta e simples - preserva TUDO do estado carregado
    const estadoRecuperado = {
      ...initialState,
      ...loadedState,
    };

    return estadoRecuperado;
  } catch (error) {
    console.error("Erro detalhado ao carregar ficha:", error);
    throw new Error(
      "Falha ao carregar a ficha - arquivo corrompido ou formato inválido"
    );
  }
};

/**
 * Gera um arquivo de download para a ficha
 * @param {Object} state - Estado da ficha
 * @param {string} nomePersonagem - Nome para o arquivo
 */
export const exportarFicha = (state, nomePersonagem = "personagem") => {
  try {
    const dados = salvarFicha(state);
    const blob = new Blob([dados], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${nomePersonagem.replace(/\s+/g, "_")}_phantasia.ficha`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Erro ao exportar ficha:", error);
    return false;
  }
};

/**
 * Valida se os dados carregados têm a estrutura esperada
 * @param {Object} data - Dados a serem validados
 * @returns {boolean} True se válido
 */
export const validarDadosFicha = (data) => {
  if (!data || typeof data !== "object") {
    console.error("Dados inválidos: não é um objeto");
    return false;
  }

  // Validação básica - apenas verifica se existe descricao
  const isValid = data.hasOwnProperty("descricao");

  if (!isValid) {
    console.error("Estrutura da ficha inválida. Campo 'descricao' faltando");
  }

  return isValid;
};

/**
 * Lê um arquivo e retorna seu conteúdo
 * @param {File} file - Arquivo selecionado
 * @returns {Promise<string>} Conteúdo do arquivo
 */
export const lerArquivoFicha = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const conteudo = event.target.result;
        resolve(conteudo);
      } catch (error) {
        reject(new Error("Erro ao ler arquivo"));
      }
    };

    reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
    reader.readAsText(file);
  });
};
