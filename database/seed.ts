import { getDatabase } from './database';

const students = [
  ['STU001', 'Aarav Menon', '8'],
  ['STU002', 'Ananya Nair', '8'],
  ['STU003', 'Arjun Thomas', '8'],
  ['STU004', 'Diya Joseph', '8'],
  ['STU005', 'Ethan Mathew', '8'],
  ['STU006', 'Fathima Rahman', '9'],
  ['STU007', 'Gowri Krishnan', '9'],
  ['STU008', 'Ishan Kumar', '9'],
  ['STU009', 'Meera Suresh', '9'],
  ['STU010', 'Neha Varghese', '9'],
  ['STU011', 'Adithya Raj', '10'],
  ['STU012', 'Aisha Ali', '10'],
  ['STU013', 'Dev Menon', '10'],
  ['STU014', 'Sara Thomas', '10'],
  ['STU015', 'Vishnu Prasad', '10'],
];

const quizzes = [
  {
    id: 'QUIZ001',
    title: 'Math Fundamentals',
    subject: 'Mathematics',
    questions: [
      {
        id: 'Q1',
        question: 'What is 12 × 8?',
        options: ['86', '96', '108', '112'],
        correctAnswer: 1,
        xp: 10,
      },
      {
        id: 'Q2',
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '14'],
        correctAnswer: 2,
        xp: 10,
      },
      {
        id: 'Q3',
        question: 'What is 25% of 200?',
        options: ['25', '40', '50', '75'],
        correctAnswer: 2,
        xp: 10,
      },
    ],
  },

  {
    id: 'QUIZ002',
    title: 'Computer Science Basics',
    subject: 'Computer Science',
    questions: [
      {
        id: 'Q1',
        question: 'What does CPU stand for?',
        options: [
          'Central Processing Unit',
          'Computer Personal Unit',
          'Central Program Utility',
          'Core Processing User',
        ],
        correctAnswer: 0,
        xp: 10,
      },
      {
        id: 'Q2',
        question: 'Which data structure follows LIFO?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctAnswer: 1,
        xp: 10,
      },
      {
        id: 'Q3',
        question: 'Which language is primarily used to style web pages?',
        options: ['HTML', 'Python', 'CSS', 'C++'],
        correctAnswer: 2,
        xp: 10,
      },
    ],
  },

  {
    id: 'QUIZ003',
    title: 'Science Explorer',
    subject: 'Science',
    questions: [
      {
        id: 'Q1',
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
        correctAnswer: 2,
        xp: 10,
      },
      {
        id: 'Q2',
        question: 'What gas do plants absorb during photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        correctAnswer: 2,
        xp: 10,
      },
      {
        id: 'Q3',
        question: 'What is H₂O commonly known as?',
        options: ['Hydrogen', 'Water', 'Oxygen', 'Salt'],
        correctAnswer: 1,
        xp: 10,
      },
    ],
  },
];

export async function seedDatabase(): Promise<void> {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    const existingStudents = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM students'
    );

    const existingQuizzes = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM quizzes'
    );

    if ((existingStudents?.count ?? 0) === 0) {
      const now = new Date().toISOString();

      for (const [id, name, grade] of students) {
        await db.runAsync(
          `
          INSERT INTO students
            (id, name, grade, created_at)
          VALUES (?, ?, ?, ?)
          `,
          id,
          name,
          grade,
          now
        );
      }
    }

    if ((existingQuizzes?.count ?? 0) === 0) {
      for (const quiz of quizzes) {
        await db.runAsync(
          `
          INSERT INTO quizzes
            (id, title, subject, questions_json)
          VALUES (?, ?, ?, ?)
          `,
          quiz.id,
          quiz.title,
          quiz.subject,
          JSON.stringify(quiz.questions)
        );
      }
    }
  });

  console.log('QuestCore database seeded successfully.');
}