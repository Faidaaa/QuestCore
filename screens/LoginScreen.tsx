import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDatabase } from '../database/database';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing Details', 'Please enter username and password.');
      return;
    }

    try {
      const db = await getDatabase();

      const user = await db.getFirstAsync<{
        id: string;
        name: string;
        username: string;
        role: 'TEACHER' | 'STUDENT';
        student_id: string | null;
      }>(
        `SELECT id, name, username, role, student_id
         FROM users
         WHERE username = ? AND password = ?`,
        username.trim(),
        password
      );

      if (!user) {
        Alert.alert('Login Failed', 'Invalid username or password.');
        return;
      }

      if (user.role === 'TEACHER') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TeacherDashboard',
              params: {
                userId: user.id,
                name: user.name,
              },
            },
          ],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'StudentDashboard',
              params: {
                userId: user.id,
                name: user.name,
                studentId: user.student_id ?? '',
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong during login.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QUESTCORE</Text>

      <Text style={styles.subtitle}>
        Offline Classroom Engine
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Welcome Back</Text>

        <Text style={styles.label}>Username</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter username"
          placeholderTextColor="#64748B"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.demoTitle}>Demo Accounts</Text>

        <Text style={styles.demoText}>
          Teacher: teacher / 1234
        </Text>

        <Text style={styles.demoText}>
          Student: aarav / 1234
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
  },

  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
    fontSize: 14,
  },

  card: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 24,
  },

  heading: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },

  label: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  demoTitle: {
    color: '#F8FAFC',
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },

  demoText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
});