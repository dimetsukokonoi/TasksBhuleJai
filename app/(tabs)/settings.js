import React from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function Settings() {
  const { palette, highContrast, setHighContrast, autoArchiveDone, setAutoArchiveDone } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>General Preferences</Text>

        <View style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.textWrap}>
            <Text style={[styles.label, { color: palette.textPrimary }]}>High Contrast Mode</Text>
            <Text style={[styles.hint, { color: palette.textSecondary }]}>Improve visibility with high contrast colors.</Text>
          </View>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>

        <View style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.textWrap}>
            <Text style={[styles.label, { color: palette.textPrimary }]}>Auto-Archive</Text>
            <Text style={[styles.hint, { color: palette.textSecondary }]}>Automatically hide completed tasks.</Text>
          </View>
          <Switch value={autoArchiveDone} onValueChange={setAutoArchiveDone} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: palette.textSecondary }]}>TasksBhuleJai v2.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  textWrap: { flex: 1, marginRight: 15 },
  label: { fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 13, marginTop: 4 },
  footer: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  version: { fontSize: 12 }
});
