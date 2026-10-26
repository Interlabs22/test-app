import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<Array<string>>([]);

  // indexOf возвращает индекс, а не признак наличия: 
  // 0 — «не избран», -1 — «избран». Поэтому именно includes.
  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  // Новый массив вместо мутации: push/splice меняют тот же ref, и React
  // не видит изменений, потому что сравнивает ссылки.
  const toggle = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
