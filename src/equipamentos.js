// equipamentos.js - NOVA PÁGINA
import React from "react";
import Bagagem from "./bagagem";

const Equipamentos = ({ atributos, fichaTrancada }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Bagagem atributos={atributos} fichaTrancada={fichaTrancada} />
    </div>
  );
};

export default Equipamentos;
