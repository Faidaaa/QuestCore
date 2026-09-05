import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

import { initializeDatabase } from './database/database';
import { seedDatabase } from './database/seed';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initializeDatabase();
        await seedDatabase();

        setReady(true);
      } catch (err) {
        console.error('QuestCore bootstrap failed:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize QuestCore.'
        );
      }
    }

    bootstrap();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorTitle}>
          QuestCore failed to start
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Initializing offline classroom...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        QuestCore
      </Text>

      <Text style={styles.subtitle}>
        Offline Classroom Engine
      </Text>

      <Text style={styles.status}>
        ● Offline Data Secure
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    marginBottom: 24,
  },

  status: {
    color: '#94A3B8',
    fontSize: 14,
  },

  loadingText: {
    color: '#94A3B8',
    marginTop: 16,
  },

  errorTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  errorText: {
    color: '#94A3B8',
    textAlign: 'center',
  },
});