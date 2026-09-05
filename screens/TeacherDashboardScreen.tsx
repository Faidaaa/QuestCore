import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'TeacherDashboard'
>;

export default function TeacherDashboardScreen({
  navigation,
  route,
}: Props) {
  const { name } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.smallText}>WELCOME BACK</Text>

          <Text style={styles.title}>
            {name}
          </Text>

          <Text style={styles.subtitle}>
            Teacher Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Classroom
      </Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Students')}
        >
          <Text style={styles.icon}>👥</Text>
          <Text style={styles.cardTitle}>Students</Text>
          <Text style={styles.cardDescription}>
            Manage student roster
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Attendance')}
        >
          <Text style={styles.icon}>✓</Text>
          <Text style={styles.cardTitle}>Attendance</Text>
          <Text style={styles.cardDescription}>
            Mark today's attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CreateTest')}
        >
          <Text style={styles.icon}>＋</Text>
          <Text style={styles.cardTitle}>Create Test</Text>
          <Text style={styles.cardDescription}>
            Create a new quiz
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Quizzes')}
        >
          <Text style={styles.icon}>▣</Text>
          <Text style={styles.cardTitle}>Tests</Text>
          <Text style={styles.cardDescription}>
            View available tests
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Performance
      </Text>

      <TouchableOpacity
        style={styles.wideCard}
        onPress={() => navigation.navigate('TeacherResults')}
      >
        <View>
          <Text style={styles.cardTitle}>
            Review Results
          </Text>

          <Text style={styles.cardDescription}>
            View student test performance
          </Text>
        </View>

        <Text style={styles.arrow}>→</Text>
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
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },

  smallText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 28,
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

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  card: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    minHeight: 145,
  },

  icon: {
    color: '#3B82F6',
    fontSize: 25,
    marginBottom: 15,
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
    marginTop: 6,
  },

  wideCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  arrow: {
    color: '#3B82F6',
    fontSize: 24,
  },
});