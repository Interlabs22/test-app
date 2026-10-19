import { type ReactElement, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type UpdatedAgoProps = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: UpdatedAgoProps): ReactElement {
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());

  useEffect(() => {
    const updateCurrentTimestamp = (): void => {
      setCurrentTimestamp(Date.now());
    };

    updateCurrentTimestamp();
    const intervalId = setInterval(updateCurrentTimestamp, 1000);

    return () => clearInterval(intervalId);
  }, [since]);

  const seconds = Math.max(0, Math.floor((currentTimestamp - since.getTime()) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
