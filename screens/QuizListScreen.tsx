import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getDatabase } from '../database/database';
type Props = NativeStackScreenProps<RootStackParamList, 'Quizzes'>;
type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions_json: string;
};

export default function QuizListScreen({ navigation, route }: Props) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuizzes = async () => {
    try {
      const db = await getDatabase();

      const result = await db.getAllAsync<Quiz>(
        `
        SELECT *
        FROM quizzes
        ORDER BY rowid DESC
        `
      );

      setQuizzes(result);
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [])
  );

  function getQuestionCount(questionsJson: string) {
    try {
      const questions = JSON.parse(questionsJson);
      return Array.isArray(questions) ? questions.length : 0;
    } catch {
      return 0;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tests</Text>
            <Text style={styles.subtitle}>
              Offline test papers
            </Text>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTest')}
          >
            <Text style={styles.createButtonText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>
              Loading tests...
            </Text>
          </View>
        ) : quizzes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No tests yet
            </Text>

            <Text style={styles.emptyText}>
              Create your first offline test paper.
            </Text>
          </View>
        ) : (
          quizzes.map((quiz) => {
            const questionCount = getQuestionCount(
              quiz.questions_json
            );

            return (
              <View key={quiz.id} style={styles.quizCard}>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>
                    {quiz.title}
                  </Text>

                  <Text style={styles.quizSubject}>
                    {quiz.subject}
                  </Text>

                  <Text style={styles.questionCount}>
                    {questionCount}{' '}
                    {questionCount === 1
                      ? 'Question'
                      : 'Questions'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
  navigation.navigate('Quiz', {
    quizId: quiz.id,
    studentId: route.params?.studentId,
  })
}
                >
                  <Text style={styles.startButtonText}>
                    START TEST →
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },

  createButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 9,
  },

  createButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },

  quizCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
  },

  quizInfo: {
    marginBottom: 18,
  },

  quizTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  quizSubject: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },

  questionCount: {
    color: '#64748B',
    fontSize: 13,
  },

  startButton: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  startButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});