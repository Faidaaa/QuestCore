import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Results</Text>

      <Text style={styles.subtitle}>
        Your results will appear here after completing tests.
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