import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Считаем от since, а не накапливаем счётчик:
// так подпись всегда честная,
// даже если таймер сработал с задержкой.
const secondsSince = (since: Date) =>
  Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  // sinceRef нужен, чтобы setInterval не захватывал устаревшее значение
  // из замыкания: если бы он читал since из useEffect, то при каждом
  // изменении since создавался бы новый интервал. С ref интервал читает
  // актуальное значение без пересоздания.
  const sinceRef = useRef(since);
  const [seconds, setSeconds] = useState(() => secondsSince(since));

  // Обновляем ref при каждом новом since.
  useEffect(() => {
    sinceRef.current = since;
    setSeconds(secondsSince(since));
  }, [since]);

  // Один интервал на всё время жизни компонента.
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(secondsSince(sinceRef.current));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
