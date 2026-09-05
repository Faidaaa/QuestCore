import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDatabase } from '../database/database';
import { useFocusEffect } from '@react-navigation/native';
export default function DashboardScreen({ navigation }: any) {
    const [activeStudents, setActiveStudents] = useState(0);
    const [presentToday, setPresentToday] = useState(0);

 async function loadDashboardData() {
  try {
    const db = await getDatabase();

    const today = new Date().toISOString().split('T')[0];

    const studentResult = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM students'
    );

    const attendanceResult = await db.getFirstAsync<{ count: number }>(
      `
      SELECT COUNT(*) as count
      FROM attendance
      WHERE date = ?
      AND status = 'PRESENT'
      `,
      today
    );

    setActiveStudents(studentResult?.count ?? 0);
    setPresentToday(attendanceResult?.count ?? 0);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

 useFocusEffect(
  useCallback(() => {
    loadDashboardData();
  }, [])
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuestCore</Text>

      <Text style={styles.subtitle}>
        Offline Classroom Engine
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>● Offline Data Secure</Text>
        <Text style={styles.statusText}>
          Your classroom data is stored locally.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{activeStudents}</Text>
          <Text style={styles.metricLabel}>Active Students</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{presentToday}</Text>
          <Text style={styles.metricLabel}>Present Today</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Students')}
      >
        <Text style={styles.buttonText}>Students</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Attendance')}
      >
        <Text style={styles.buttonText}>Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quizzes')}
      >
        <Text style={styles.buttonText}>Quizzes</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: '700',
    marginTop: 20,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },

  statusCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },

  statusTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },

  statusText: {
    color: '#94A3B8',
    marginTop: 6,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  metricCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 18,
  },

  metricNumber: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },

  metricLabel: {
    color: '#94A3B8',
    marginTop: 4,
  },

  button: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  buttonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});