import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const favoritesStorageKey = 'favorite-match-ids';
const favoriteIdsSchema = z.array(z.string().min(1));

type UseFavoritesResult = {
  favorites: readonly string[];
  isReady: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
};

function parseFavoriteIds(serializedFavoriteIds: string): string[] {
  const parsedFavoriteIds: unknown = JSON.parse(serializedFavoriteIds);
  const validationResult = favoriteIdsSchema.safeParse(parsedFavoriteIds);

  return validationResult.success ? validationResult.data : [];
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let isMounted = true;

    const restoreFavorites = async (): Promise<void> => {
      try {
        const serializedFavoriteIds = await AsyncStorage.getItem(favoritesStorageKey);

        if (serializedFavoriteIds !== null && isMounted) {
          setFavorites(parseFavoriteIds(serializedFavoriteIds));
        }
      } catch {
        if (isMounted) {
          setFavorites([]);
        }
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    void restoreFavorites();

    return (): void => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      const serializedFavoriteIds = JSON.stringify(favorites);

      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(() => AsyncStorage.setItem(favoritesStorageKey, serializedFavoriteIds))
        .catch(() => undefined);
    }
  }, [favorites, isReady]);

  const isFavorite = (id: string): boolean => favorites.includes(id);

  const toggle = (id: string): void => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(id)) {
        return currentFavorites.filter((favoriteId) => favoriteId !== id);
      }

      return [...currentFavorites, id];
    });
  };

  return { favorites, isReady, isFavorite, toggle };
}
