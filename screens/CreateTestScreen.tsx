import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getDatabase } from '../database/database';

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  xp: number;
};

export default function CreateTestScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [xp, setXp] = useState('10');

  const [questions, setQuestions] = useState<Question[]>([]);

  function updateOption(index: number, value: string) {
    setOptions((current) =>
      current.map((option, i) => (i === index ? value : option))
    );
  }

  function addQuestion() {
    if (!questionText.trim()) {
      Alert.alert('Missing Question', 'Please enter the question.');
      return;
    }

    if (options.some((option) => !option.trim())) {
      Alert.alert(
        'Missing Options',
        'Please fill in all four options.'
      );
      return;
    }

    const xpValue = Number(xp);

    if (!xp.trim() || Number.isNaN(xpValue) || xpValue < 0) {
      Alert.alert('Invalid XP', 'Please enter a valid XP value.');
      return;
    }

    const newQuestion: Question = {
      id: `Q${questions.length + 1}`,
      question: questionText.trim(),
      options: options.map((option) => option.trim()),
      correctAnswer,
      xp: xpValue,
    };

    setQuestions((current) => [...current, newQuestion]);

    // Clear the question form for the next question
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setXp('10');
  }

  function removeQuestion(index: number) {
    setQuestions((current) => current.filter((_, i) => i !== index));
  }

  async function saveTest() {
    if (!title.trim()) {
      Alert.alert('Missing Test Title', 'Please enter a test title.');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Missing Subject', 'Please enter the subject.');
      return;
    }

    if (questions.length === 0) {
      Alert.alert(
        'No Questions',
        'Please add at least one question before saving.'
      );
      return;
    }

    try {
      const db = await getDatabase();

      const quizId = `QUIZ-${Date.now()}`;

      await db.runAsync(
        `
        INSERT INTO quizzes
          (id, title, subject, questions_json)
        VALUES (?, ?, ?, ?)
        `,
        quizId,
        title.trim(),
        subject.trim(),
        JSON.stringify(questions)
      );

      Alert.alert(
        'Test Saved',
        `${title.trim()} has been saved successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Quizzes'),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to save test:', error);

      Alert.alert(
        'Error',
        'Could not save the test. Please try again.'
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Create New Test</Text>

      <Text style={styles.label}>Test Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Mathematics Unit Test"
        placeholderTextColor="#64748B"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Mathematics"
        placeholderTextColor="#64748B"
        value={subject}
        onChangeText={setSubject}
      />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Add Question</Text>

      <Text style={styles.label}>Question</Text>
      <TextInput
        style={[styles.input, styles.questionInput]}
        placeholder="Enter the question..."
        placeholderTextColor="#64748B"
        value={questionText}
        onChangeText={setQuestionText}
        multiline
      />

      <Text style={styles.label}>Options</Text>

      {options.map((option, index) => (
        <View key={index} style={styles.optionRow}>
          <Text style={styles.optionLabel}>
            {String.fromCharCode(65 + index)}
          </Text>

          <TextInput
            style={styles.optionInput}
            placeholder={`Option ${String.fromCharCode(65 + index)}`}
            placeholderTextColor="#64748B"
            value={option}
            onChangeText={(value) => updateOption(index, value)}
          />
        </View>
      ))}

      <Text style={styles.label}>Correct Answer</Text>

      <View style={styles.correctContainer}>
        {options.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              correctAnswer === index && styles.answerButtonSelected,
            ]}
            onPress={() => setCorrectAnswer(index)}
          >
            <Text
              style={[
                styles.answerButtonText,
                correctAnswer === index &&
                  styles.answerButtonTextSelected,
              ]}
            >
              {String.fromCharCode(65 + index)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>XP for this question</Text>

      <TextInput
        style={styles.input}
        placeholder="10"
        placeholderTextColor="#64748B"
        value={xp}
        onChangeText={setXp}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={addQuestion}
      >
        <Text style={styles.addButtonText}>+ Add Question</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        Questions Added: {questions.length}
      </Text>

      {questions.map((item, index) => (
        <View key={item.id} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Question {index + 1}
            </Text>

            <TouchableOpacity
              onPress={() => removeQuestion(index)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.questionPreview}>
            {item.question}
          </Text>

          {item.options.map((option, optionIndex) => (
            <Text
              key={optionIndex}
              style={[
                styles.previewOption,
                optionIndex === item.correctAnswer &&
                  styles.correctOption,
              ]}
            >
              {String.fromCharCode(65 + optionIndex)}. {option}
              {optionIndex === item.correctAnswer ? ' ✓' : ''}
            </Text>
          ))}

          <Text style={styles.xpText}>
            XP: {item.xp}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.saveButton,
          questions.length === 0 && styles.saveButtonDisabled,
        ]}
        onPress={saveTest}
      >
        <Text style={styles.saveButtonText}>
          SAVE TEST
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  heading: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },

  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#F8FAFC',
    fontSize: 15,
  },

  questionInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  optionLabel: {
    color: '#94A3B8',
    width: 30,
    fontSize: 16,
    fontWeight: '700',
  },

  optionInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
  },

  correctContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  answerButton: {
    width: 55,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  answerButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },

  answerButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },

  answerButtonTextSelected: {
    color: '#F8FAFC',
  },

  addButton: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },

  addButtonText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 28,
  },

  questionCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  questionNumber: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  removeText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },

  questionPreview: {
    color: '#F8FAFC',
    fontSize: 15,
    marginBottom: 10,
  },

  previewOption: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 5,
  },

  correctOption: {
    color: '#F8FAFC',
    fontWeight: '700',
  },

  xpText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 12,
  },

  saveButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
});