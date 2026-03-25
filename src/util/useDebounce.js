// useDebounce.js
import { useState, useEffect, useRef } from "react";

/**
 * Retorna um valor atrasado — só atualiza após `delay` ms sem novas mudanças.
 * Usado para evitar dispatches a cada tecla em campos de texto longo.
 *
 * @param {*} value - Valor a ser debounced
 * @param {number} delay - Delay em ms (padrão 400)
 * @returns {*} Valor debounced
 */
export const useDebounceValue = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (delay == null || delay < 0) {
      console.warn("[useDebounceValue] delay inválido:", delay);
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Gerencia estado local de um campo de texto com sync debounced para o Context.
 * O campo responde imediatamente na UI, mas só dispara o callback
 * após o usuário parar de digitar.
 *
 * @param {string} initialValue - Valor inicial vindo do Context
 * @param {function} onCommit - Callback chamado com o valor final (ex: actions.updateDescricao)
 * @param {number} delay - Delay em ms (padrão 400)
 * @returns {{ localValue, handleChange }} - Valor local e handler de onChange
 */
export const useDebouncedField = (initialValue, onCommit, delay = 400) => {
  if (typeof onCommit !== "function") {
    console.error("[useDebouncedField] onCommit deve ser uma função, recebeu:", typeof onCommit);
  }

  const [localValue, setLocalValue] = useState(initialValue ?? "");

  // Mantém localValue em sync quando o Context mudar externamente
  // (ex: LOAD_FICHA ao carregar uma ficha salva)
  const prevInitialRef = useRef(initialValue);
  useEffect(() => {
    if (prevInitialRef.current !== initialValue) {
      prevInitialRef.current = initialValue;
      setLocalValue(initialValue ?? "");
    }
  }, [initialValue]);

  const timerRef = useRef(null);

  const handleChange = (e) => {
    const valor = e?.target?.value ?? e;

    setLocalValue(valor);

    if (typeof onCommit !== "function") return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onCommit(valor);
    }, delay);
  };

  // Garante flush do timer pendente ao desmontar
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return { localValue, handleChange };
};