import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

function elapsedSeconds(since: Date): number {
  return Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));
}

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const sinceMs = since.getTime();
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [sinceMs]);

  const seconds = elapsedSeconds(since);

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
