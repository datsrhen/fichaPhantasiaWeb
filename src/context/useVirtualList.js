// useVirtualList.js
// Virtualização simples sem dependências externas.
// Renderiza apenas os itens visíveis dentro de um container com overflow.
// Usa posicionamento absoluto — o container tem altura total, mas só monta
// os nós do DOM que estão na janela de visibilidade.
import { useState, useCallback, useRef, useEffect } from "react";

const DEFAULT_ITEM_HEIGHT = 120; // altura estimada por card de talento (px)
const OVERSCAN = 3;              // itens extras acima/abaixo da janela

/**
 * @param {Array} items - Lista completa de itens
 * @param {number} itemHeight - Altura estimada de cada item em px
 * @returns {{ containerProps, virtualItems, totalHeight }}
 */
export function useVirtualList(items, itemHeight = DEFAULT_ITEM_HEIGHT) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  if (!Array.isArray(items)) {
    console.warn("[useVirtualList] items deve ser array:", items);
    return { containerRef, virtualItems: [], totalHeight: 0 };
  }

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // ResizeObserver para medir a altura real do container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + OVERSCAN
  );

  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      item: items[i],
      offsetTop: i * itemHeight,
    });
  }

  return {
    containerRef,
    handleScroll,
    virtualItems,
    totalHeight,
  };
}