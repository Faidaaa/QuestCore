export type RootStackParamList = {
  Login: undefined;

  TeacherDashboard: {
    userId: string;
    name: string;
  };

  StudentDashboard: {
    userId: string;
    name: string;
    studentId: string;
  };

  Dashboard: undefined;

  Students: undefined;

  Attendance: undefined;

  Quizzes: {
  studentId?: string;
} | undefined;

  CreateTest: undefined;

  Quiz: {
  quizId: string;
  studentId?: string;
};

  TeacherResults: undefined;

  StudentResults: {
    studentId: string;
    result?: {
      testName: string;
      quizId: string;
      score: number;
      correctAnswers: number;
      totalQuestions: number;
      xpEarned: number;
    };
  };
};