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

  Quizzes: undefined;

  CreateTest: undefined;

  Quiz: {
    quizId: string;
  };

  TeacherResults: undefined;

  StudentResults: {
    studentId: string;
  };
};