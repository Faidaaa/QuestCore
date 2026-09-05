import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDatabase } from '../database/database';

type TeacherResultItem = {
  studentName: string;
  testName: string;
  subject: string;
  score: number;
  xpEarned: number;
};

export default function TeacherResultsScreen() {
  const [results, setResults] = useState<TeacherResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDatabase();

      const rows = await db.getAllAsync<TeacherResultItem>(
        `SELECT
          students.name AS studentName,
          quizzes.title AS testName,
          quizzes.subject AS subject,
          scores.score AS score,
          scores.earned_xp AS xpEarned
         FROM scores
         INNER JOIN students ON students.id = scores.student_id
         INNER JOIN quizzes ON quizzes.id = scores.quiz_id
         ORDER BY students.name ASC, quizzes.title ASC`
      );

      setResults(rows);
    } catch (error) {
      console.error('Failed to load teacher results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [loadResults])
  );

  const submissionCount = results.length;
  const averageScore =
    submissionCount > 0
      ? Math.round(
          results.reduce((sum, item) => sum + item.score, 0) /
            submissionCount
        )
      : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Results</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Submissions</Text>
          <Text style={styles.summaryValue}>{submissionCount}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Average Score</Text>
          <Text style={styles.summaryValue}>{averageScore}%</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#F8FAFC" />
          <Text style={styles.subtitle}>Loading results...</Text>
        </View>
      ) : results.length === 0 ? (
        <Text style={styles.subtitle}>
          No submitted tests yet.
        </Text>
      ) : (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
        >
          {results.map((item, index) => (
            <View key={`${item.studentName}-${item.testName}-${index}`} style={styles.resultCard}>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.testName}>{item.testName}</Text>
              <Text style={styles.subject}>{item.subject}</Text>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Score</Text>
                <Text style={styles.metricValue}>{item.score}%</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>XP Earned</Text>
                <Text style={styles.metricValue}>{item.xpEarned} XP</Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
  },

  summaryValue: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
  },

  listContainer: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 24,
  },

  resultCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },

  studentName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },

  testName: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  subject: {
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },

  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  metricLabel: {
    color: '#94A3B8',
  },

  metricValue: {
    color: '#F8FAFC',
    fontWeight: '700',
  },

  subtitle: {
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});