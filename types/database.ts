export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface Student {
  id: string;
  name: string;
  grade: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions_json: string;
}

export interface Score {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  earned_xp: number;
}