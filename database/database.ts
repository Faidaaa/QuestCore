import * as SQLite from 'expo-sqlite';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync('questcore.db');

  return database;
}

export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('TEACHER', 'STUDENT')),
  student_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON DELETE CASCADE
);

    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY NOT NULL,
      student_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PRESENT', 'ABSENT')),
      FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      questions_json TEXT NOT NULL
    );
    

    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY NOT NULL,
      student_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      earned_xp INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
      FOREIGN KEY (quiz_id)
        REFERENCES quizzes(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attendance_student
      ON attendance(student_id);

    CREATE INDEX IF NOT EXISTS idx_attendance_date
      ON attendance(date);

    CREATE INDEX IF NOT EXISTS idx_scores_student
      ON scores(student_id);

    CREATE INDEX IF NOT EXISTS idx_scores_quiz
      ON scores(quiz_id);
  `);
}