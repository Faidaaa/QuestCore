import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from './types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeDatabase } from './database/database';
import { seedDatabase } from './database/seed';

import LoginScreen from './screens/LoginScreen';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import TeacherResultsScreen from './screens/TeacherResultsScreen';
import StudentResultsScreen from './screens/StudentResultScreen';
import DashboardScreen from './screens/DashboardScreen';
import StudentsScreen from './screens/StudentsScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import QuizListScreen from './screens/QuizListScreen';
import QuizScreen from './screens/QuizScreen';
import CreateTestScreen from './screens/CreateTestScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initializeDatabase();
        await seedDatabase();

        setReady(true);
      } catch (err) {
        console.error('QuestCore bootstrap failed:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize QuestCore.'
        );
      }
    }

    bootstrap();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>
          QuestCore failed to start
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Initializing offline classroom...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },

          headerTintColor: '#F8FAFC',

          headerTitleStyle: {
            fontWeight: '700',
          },

          contentStyle: {
            backgroundColor: '#0F172A',
          },
        }}
      >
        <Stack.Screen
         name="Login"
         component={LoginScreen}
         options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherDashboardScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboardScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TeacherResults"
          component={TeacherResultsScreen}
          options={{
            title: 'Student Results',
          }}
        />

        <Stack.Screen
          name="StudentResults"
          component={StudentResultsScreen}
          options={{
            title: 'My Results',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Students"
          component={StudentsScreen}
          options={{
            title: 'Students',
          }}
        />

        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{
            title: 'Attendance',
          }}
        />

        <Stack.Screen
          name="Quizzes"
          component={QuizListScreen}
          options={{
            title: 'Quizzes',
          }}
        />
        <Stack.Screen
         name="Quiz"
         component={QuizScreen}
/>
        <Stack.Screen
          name="CreateTest"
          component={CreateTestScreen}
          options={{ title: 'Create Test' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingText: {
    color: '#94A3B8',
    marginTop: 16,
  },

  errorTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },

  errorText: {
    color: '#94A3B8',
    textAlign: 'center',
  },
});

