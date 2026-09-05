import { StyleSheet, Text, View } from 'react-native';

export default function StudentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>
        Student roster coming next.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },

  subtitle: {
    color: '#94A3B8',
    marginTop: 8,
  },
});