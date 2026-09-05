import { StyleSheet, Text, View } from 'react-native';

export default function QuizListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quizzes</Text>
      <Text style={styles.subtitle}>
        Offline quizzes coming next.
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