import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TeacherResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Results</Text>

      <Text style={styles.subtitle}>
        Results review will be implemented in Step 11.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },
});