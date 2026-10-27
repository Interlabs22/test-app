import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  // Set вместо массива: проверка наличия — O(1) вместо O(n), и «набор id»
  // семантически именно множество, а не последовательность.
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  // Новый Set вместо prev.add/prev.delete: мутация оставляет ту же ссылку,
  // и React не видит изменений, потому что сравнивает ссылки.
  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  return { favorites, isFavorite, toggle };
}
