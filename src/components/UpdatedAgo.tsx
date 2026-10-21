import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Time of the last successful fetch.
  since: Date;
};

function elapsedSeconds(since: Date): number {
  return Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));
}

// Label "updated N seconds ago", recomputed from `since`.
export function UpdatedAgo({ since }: Props) {
  const [seconds, setSeconds] = useState(() => elapsedSeconds(since));

  useEffect(() => {
    const update = () => setSeconds(elapsedSeconds(since));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [since]);

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
