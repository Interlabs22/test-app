import { StyleSheet, TextInput } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
};

// Поле поиска по названию клуба.
export function SearchField({ value, onChange }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Поиск по клубу"
      placeholderTextColor="#9ca3af"
      autoCorrect={false}
      autoCapitalize="none"
      accessibilityLabel="Поиск по названию клуба"
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  // Та же ширина, что у карточек, тулбара и вкладок.
  input: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
  },
});
