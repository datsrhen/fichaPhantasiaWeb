// useFicha.js
// Hook separado do FichaProvider para compatibilidade com Vite HMR.
// Um arquivo não deve exportar componentes e hooks ao mesmo tempo.
import { useContext } from "react";
import { FichaContext } from "./FichaContext";

export const useFicha = () => {
  const context = useContext(FichaContext);
  if (!context) {
    throw new Error("useFicha deve ser usado dentro de um FichaProvider");
  }
  return context;
};