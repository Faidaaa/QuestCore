import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getDatabase } from '../database/database';
import { AttendanceStatus, Student } from '../types/database';

type AttendanceStudent = Student & {
  status: AttendanceStatus;
};

export default function AttendanceScreen() {
  const [students, setStudents] = useState<AttendanceStudent[]>([]);

  const today = new Date().toISOString().split('T')[0];

  async function loadAttendance() {
    try {
      const db = await getDatabase();

      const result = await db.getAllAsync<AttendanceStudent>(
        `
        SELECT
          students.*,
          COALESCE(attendance.status, 'ABSENT') AS status
        FROM students
        LEFT JOIN attendance
          ON students.id = attendance.student_id
          AND attendance.date = ?
        ORDER BY students.name ASC
        `,
        today
      );

      setStudents(result);
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  }

  async function toggleAttendance(student: AttendanceStudent) {
    try {
      const db = await getDatabase();

      const newStatus: AttendanceStatus =
        student.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';

      const attendanceId = `${student.id}-${today}`;

      await db.runAsync(
        `
        INSERT OR REPLACE INTO attendance
          (id, student_id, date, status)
        VALUES (?, ?, ?, ?)
        `,
        attendanceId,
        student.id,
        today,
        newStatus
      );

      await loadAttendance();
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const presentCount = students.filter(
    (student) => student.status === 'PRESENT'
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance</Text>

      <Text style={styles.date}>
        {today}
      </Text>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryNumber}>
            {presentCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Present Today
          </Text>
        </View>

        <View>
          <Text style={styles.summaryNumber}>
            {students.length - presentCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Absent
          </Text>
        </View>

        <View>
          <Text style={styles.summaryNumber}>
            {students.length}
          </Text>
          <Text style={styles.summaryLabel}>
            Total
          </Text>
        </View>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentCard}
            onPress={() => toggleAttendance(item)}
          >
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {item.name}
              </Text>

              <Text style={styles.studentGrade}>
                Grade {item.grade}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === 'PRESENT'
                  ? styles.presentBadge
                  : styles.absentBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },

  date: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 20,
  },

  summaryCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  summaryNumber: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  list: {
    paddingBottom: 20,
  },

  studentCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },

  studentGrade: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },

  presentBadge: {
    backgroundColor: '#1E3A2F',
    borderColor: '#2F6B50',
  },

  absentBadge: {
    backgroundColor: '#3A2930',
    borderColor: '#6B3B49',
  },

  statusText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
});