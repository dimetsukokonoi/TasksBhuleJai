import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';

export default function Projects() {
  const { palette } = useTheme();
  const { projects, addProject, tasks } = useTasks();
  const [newProject, setNewProject] = useState('');
  const [error, setError] = useState('');

  const handleAddProject = () => {
    const result = addProject(newProject);
    if (result.success) {
      setNewProject('');
      setError('');
    } else {
      setError(result.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.addSection}>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Create Project</Text>
        <TextInput
          style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.textPrimary }]}
          placeholder="New project name..."
          placeholderTextColor={palette.textSecondary}
          value={newProject}
          onChangeText={setNewProject}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: palette.accent }]}
          onPress={handleAddProject}
        >
          <Text style={styles.buttonText}>Add Project</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary, paddingHorizontal: 15 }]}>All Projects</Text>
        {projects.map(p => {
          const projectTasks = tasks.filter(t => t.project === p);
          const pending = projectTasks.filter(t => !t.completed).length;
          return (
            <View key={p} style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <View>
                <Text style={[styles.projectName, { color: palette.textPrimary }]}>{p}</Text>
                <Text style={[styles.projectMeta, { color: palette.textSecondary }]}>{pending} pending • {projectTasks.length} total</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 10 },
  error: { color: 'red', marginBottom: 10, fontSize: 12 },
  button: { padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  list: { paddingVertical: 10 },
  card: { marginHorizontal: 15, marginVertical: 6, padding: 15, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectName: { fontSize: 16, fontWeight: 'bold' },
  projectMeta: { fontSize: 13, marginTop: 4 }
});
