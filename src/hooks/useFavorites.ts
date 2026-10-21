import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'matches.favorites';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

// Favorite match ids, restored from local storage.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const favoritesRef = useRef<string[]>([]);
  const touchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || touchedRef.current || raw === null) {
          return;
        }
        try {
          const parsed: unknown = JSON.parse(raw);
          if (!isStringArray(parsed)) {
            return;
          }
          favoritesRef.current = parsed;
          setFavorites(parsed);
        } catch {
          // A corrupt payload leaves the list empty.
        }
      })
      .catch(() => {
        // A storage read error leaves the list empty.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggle = (id: string) => {
    touchedRef.current = true;
    const next = favoritesRef.current.includes(id)
      ? favoritesRef.current.filter((item) => item !== id)
      : [...favoritesRef.current, id];
    favoritesRef.current = next;
    setFavorites(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return { favorites, isFavorite, toggle };
}
