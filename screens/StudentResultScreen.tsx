import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getDatabase } from '../database/database';
import { RootStackParamList } from '../types/navigation';

type CompletedResult = {
  title: string;
  subject: string;
  score: number;
  xpEarned: number;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'StudentResults'
>;

export default function StudentResultsScreen({ route }: Props) {
  const studentId = route.params?.studentId;
  const result = route.params?.result;
  const [results, setResults] = useState<CompletedResult[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    if (!studentId) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const db = await getDatabase();

      const rows = await db.getAllAsync<CompletedResult>(
        `SELECT
          q.title AS title,
          q.subject AS subject,
          s.score AS score,
          s.earned_xp AS xpEarned
         FROM scores s
         INNER JOIN quizzes q ON q.id = s.quiz_id
         WHERE s.student_id = ?
         ORDER BY q.title ASC`,
        studentId
      );

      setResults(rows);
    } catch (error) {
      console.error('Failed to load student results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [loadResults])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Results</Text>

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>{result.testName}</Text>
          <View style={styles.metricRow}>
            <Text style={styles.label}>Score</Text>
            <Text style={styles.value}>{result.score}%</Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.label}>Correct Answers</Text>
            <Text style={styles.value}>
              {result.correctAnswers}/{result.totalQuestions}
            </Text>
          </View>

          <View style={styles.metricRow}>
            <Text style={styles.label}>XP Earned</Text>
            <Text style={styles.value}>{result.xpEarned} XP</Text>
          </View>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#F8FAFC" />
          <Text style={styles.subtitle}>Loading completed tests...</Text>
        </View>
      ) : results.length > 0 ? (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
        >
          {results.map((item, index) => (
            <View key={`${item.title}-${index}`} style={styles.resultItem}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubject}>{item.subject}</Text>

              <View style={styles.itemMetaRow}>
                <Text style={styles.itemMetaLabel}>Score</Text>
                <Text style={styles.itemMetaValue}>{item.score}%</Text>
              </View>

              <View style={styles.itemMetaRow}>
                <Text style={styles.itemMetaLabel}>XP</Text>
                <Text style={styles.itemMetaValue}>{item.xpEarned} XP</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.subtitle}>
          You have not completed any tests yet.
        </Text>
      )}
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  resultCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },

  resultHeader: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  label: {
    color: '#94A3B8',
    fontSize: 16,
  },

  value: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },

  listContainer: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
  },

  resultItem: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  itemTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },

  itemSubject: {
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 12,
  },

  itemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  itemMetaLabel: {
    color: '#94A3B8',
  },

  itemMetaValue: {
    color: '#F8FAFC',
    fontWeight: '700',
  },

  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});