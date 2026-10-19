import { useState } from 'react';

type UseFavoritesResult = {
  favorites: readonly string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
};

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<string[]>([]);

  const isFavorite = (id: string): boolean => favorites.includes(id);

  const toggle = (id: string): void => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        return currentFavorites.filter((favoriteId) => favoriteId !== id);
      }

      return [...currentFavorites, id];
    });
  };

  return { favorites, isFavorite, toggle };
}
