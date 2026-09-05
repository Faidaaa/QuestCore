import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getDatabase } from '../database/database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;
type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  xp: number;
};

type Quiz = {
  id: string;
  title: string;
  subject: string;
  questions_json: string;
};

export default function QuizScreen({ navigation, route }: Props) {
  const { quizId, studentId } = route.params;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const db = await getDatabase();

      const result = await db.getFirstAsync<Quiz>(
        `
        SELECT *
        FROM quizzes
        WHERE id = ?
        `,
        quizId
      );

      if (!result) {
        Alert.alert('Error', 'Test could not be found.');
        navigation.goBack();
        return;
      }

      const parsedQuestions: Question[] = JSON.parse(
        result.questions_json
      );

      setQuiz(result);
      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(-1));
    } catch (error) {
      console.error('Failed to load quiz:', error);

      Alert.alert(
        'Error',
        'Unable to load the test.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optionIndex: number) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = optionIndex;

    setAnswers(updatedAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = () => {
    const unanswered = answers.filter(
      (answer) => answer === -1
    ).length;

    if (unanswered > 0) {
      Alert.alert(
        'Incomplete Test',
        `Please answer all questions before submitting.\n\n${unanswered} question${
          unanswered === 1 ? '' : 's'
        } remaining.`
      );

      return;
    }

    Alert.alert(
      'Test Submitted',
      'Your test has been submitted successfully.\n\nResults and XP will be added in the next step.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading test...
        </Text>
      </View>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          No questions found.
        </Text>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Test Header */}

        <Text style={styles.testTitle}>
          {quiz.title}
        </Text>

        <Text style={styles.subject}>
          {quiz.subject}
        </Text>

        {/* Progress */}

        <View style={styles.progressCard}>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    ((currentQuestion + 1) /
                      questions.length) *
                    100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Question */}

        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            QUESTION {currentQuestion + 1}
          </Text>

          <Text style={styles.questionText}>
            {question.question}
          </Text>

          {/* Options */}

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const isSelected =
                selectedAnswer === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => selectAnswer(index)}
                >
                  <View
                    style={[
                      styles.optionLetter,
                      isSelected &&
                        styles.selectedOptionLetter,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetterText,
                        isSelected &&
                          styles.selectedOptionLetterText,
                      ]}
                    >
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      isSelected &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Navigation */}

        <View style={styles.navigationRow}>
          <TouchableOpacity
            style={[
              styles.navButton,
              currentQuestion === 0 &&
                styles.disabledButton,
            ]}
            disabled={currentQuestion === 0}
            onPress={goToPrevious}
          >
            <Text style={styles.navButtonText}>
              ← Previous
            </Text>
          </TouchableOpacity>

          {!isLastQuestion ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={goToNext}
            >
              <Text style={styles.nextButtonText}>
                Next →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitTest}
            >
              <Text style={styles.submitButtonText}>
                SUBMIT TEST
              </Text>
            </TouchableOpacity>
          )}
        </View>
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

  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
  },

  testTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '700',
  },

  subject: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 5,
  },

  progressCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 16,
  },

  progressText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  progressBarBackground: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBar: {
    height: 6,
    backgroundColor: '#3B82F6',
  },

  questionCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 20,
  },

  questionNumber: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },

  questionText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 29,
    marginBottom: 22,
  },

  optionsContainer: {
    gap: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 14,
  },

  selectedOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A5F',
  },

  optionLetter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  selectedOptionLetter: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },

  optionLetterText: {
    color: '#94A3B8',
    fontWeight: '700',
  },

  selectedOptionLetterText: {
    color: '#F8FAFC',
  },

  optionText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 21,
  },

  selectedOptionText: {
    color: '#F8FAFC',
    fontWeight: '600',
  },

  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },

  navButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.35,
  },

  navButtonText: {
    color: '#CBD5E1',
    fontWeight: '600',
  },

  nextButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
  },

  nextButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },

  submitButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
});