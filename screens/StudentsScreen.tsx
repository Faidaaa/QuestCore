import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getDatabase } from '../database/database';
import { Student } from '../types/database';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  async function loadStudents() {
    try {
      const db = await getDatabase();

      const result = await db.getAllAsync<Student>(
        'SELECT * FROM students ORDER BY name ASC'
      );

      setStudents(result);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  }

  async function addStudent() {
    if (!name.trim() || !grade.trim()) {
      Alert.alert(
        'Missing information',
        'Please enter the student name and grade.'
      );
      return;
    }

    try {
      const db = await getDatabase();

      const id = `STU-${Date.now()}`;
      const createdAt = new Date().toISOString();

      await db.runAsync(
        `
        INSERT INTO students
          (id, name, grade, created_at)
        VALUES (?, ?, ?, ?)
        `,
        id,
        name.trim(),
        grade.trim(),
        createdAt
      );

      setName('');
      setGrade('');

      await loadStudents();

      Alert.alert('Student Added', `${name.trim()} has been added.`);
    } catch (error) {
      console.error('Failed to add student:', error);

      Alert.alert(
        'Error',
        'Could not add the student.'
      );
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>

      <Text style={styles.subtitle}>
        {students.length} students in your classroom
      </Text>

      {/* Add Student */}
      <View style={styles.addCard}>
        <Text style={styles.sectionTitle}>
          Add Student
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Student name"
          placeholderTextColor="#64748B"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Grade"
          placeholderTextColor="#64748B"
          value={grade}
          onChangeText={setGrade}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addStudent}
        >
          <Text style={styles.addButtonText}>
            + Add Student
          </Text>
        </TouchableOpacity>
      </View>

      {/* Student List */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.studentCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {item.name}
              </Text>

              <Text style={styles.studentGrade}>
                Grade {item.grade}
              </Text>
            </View>

            <Text style={styles.studentNumber}>
              #{index + 1}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
  },

  addCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  list: {
    paddingBottom: 30,
  },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },

  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  studentName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },

  studentGrade: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 3,
  },

  studentNumber: {
    color: '#64748B',
    fontSize: 12,
  },
});