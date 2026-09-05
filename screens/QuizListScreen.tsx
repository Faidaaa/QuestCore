import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function QuizListScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tests</Text>

      <Text style={styles.subtitle}>
        Create and manage offline test papers.
      </Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateTest')}
      >
        <Text style={styles.createButtonText}>
          + Create New Test
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Teacher Mode</Text>

        <Text style={styles.infoText}>
          Create a complete test paper with your own questions,
          options, correct answers and XP.
        </Text>
      </View>
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
    marginBottom: 8,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    marginBottom: 28,
  },

  createButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  createButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },

  infoCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
  },

  infoTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },

  infoText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
  },
});