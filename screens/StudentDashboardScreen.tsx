import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { getDatabase } from '../database/database';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'StudentDashboard'
>;

export default function StudentDashboardScreen({
  navigation,
  route,
}: Props) {
  const { name, studentId } = route.params;

  const [attendancePercentage, setAttendancePercentage] =
    useState(0);

  const [testCount, setTestCount] = useState(0);

  const loadDashboard = useCallback(async () => {
    try {
      const db = await getDatabase();

      const attendance = await db.getFirstAsync<{
        total: number;
        present: number;
      }>(
        `SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present
         FROM attendance
         WHERE student_id = ?`,
        studentId
      );

      const total = attendance?.total ?? 0;
      const present = attendance?.present ?? 0;

      if (total > 0) {
        setAttendancePercentage(
          Math.round((present / total) * 100)
        );
      } else {
        setAttendancePercentage(0);
      }

      const quizzes = await db.getFirstAsync<{
        count: number;
      }>(
        `SELECT COUNT(*) as count
         FROM quizzes`
      );

      setTestCount(quizzes?.count ?? 0);
    } catch (error) {
      console.error(error);
    }
  }, [studentId]);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallText}>WELCOME</Text>

          <Text style={styles.title}>
            {name}
          </Text>

          <Text style={styles.subtitle}>
            Student Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {attendancePercentage}%
          </Text>

          <Text style={styles.statLabel}>
            Attendance
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {testCount}
          </Text>

          <Text style={styles.statLabel}>
            Available Tests
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            0
          </Text>

          <Text style={styles.statLabel}>
            XP
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Learning
      </Text>

      <TouchableOpacity
  style={styles.card}
  onPress={() =>
    navigation.navigate('Quizzes', {
      studentId,
    })
  }
>
  <Text style={styles.icon}>▣</Text>

  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>
      Take a Test
    </Text>

    <Text style={styles.cardDescription}>
      View and attempt teacher-created tests
    </Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('StudentResults', {
            studentId,
          })
        }
      >
        <Text style={styles.icon}>★</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            My Results
          </Text>

          <Text style={styles.cardDescription}>
            View your test scores and XP
          </Text>
        </View>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <View style={styles.attendanceCard}>
        <Text style={styles.attendanceTitle}>
          Attendance
        </Text>

        <Text style={styles.attendanceValue}>
          {attendancePercentage}%
        </Text>

        <Text style={styles.cardDescription}>
          Your attendance percentage will update
          automatically as attendance is recorded.
        </Text>
      </View>
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
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  smallText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 5,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  logoutText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },

  statValue: {
    color: '#3B82F6',
    fontSize: 22,
    fontWeight: '800',
  },

  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  icon: {
    color: '#3B82F6',
    fontSize: 24,
    width: 40,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  cardDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  arrow: {
    color: '#3B82F6',
    fontSize: 24,
    marginLeft: 10,
  },

  attendanceCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 20,
    marginTop: 10,
  },

  attendanceTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  attendanceValue: {
    color: '#3B82F6',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 10,
  },
});