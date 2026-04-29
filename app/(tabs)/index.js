import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useTasks } from '../../src/hooks/useTasks';
import TaskItem from '../../src/components/TaskItem';
import AddTaskModal from '../../src/components/AddTaskModal';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const { palette } = useTheme();
  const { tasks, projects, toggleTask, removeTask, addTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterProject, setFilterProject] = useState('All');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.project.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = filterProject === 'All' || t.project === filterProject;
      return matchesSearch && matchesProject;
    }).sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
  }, [tasks, searchQuery, filterProject]);

  const stats = useMemo(() => {
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    return { pending, completed };
  }, [tasks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <TextInput
          style={[styles.search, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.textPrimary }]}
          placeholder="Search tasks..."
          placeholderTextColor={palette.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Pending</Text>
          <Text style={[styles.statValue, { color: palette.textPrimary }]}>{stats.pending}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border, marginLeft: 10 }]}>
          <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Completed</Text>
          <Text style={[styles.statValue, { color: palette.textPrimary }]}>{stats.completed}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {['All', ...projects].map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => setFilterProject(p)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filterProject === p ? palette.accentSoft : palette.surface,
                borderColor: filterProject === p ? palette.accent : palette.border
              }
            ]}
          >
            <Text style={{ color: palette.textPrimary, fontWeight: filterProject === p ? 'bold' : 'normal' }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.taskList}>
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={removeTask}
          />
        ))}
        {filteredTasks.length === 0 && (
          <Text style={[styles.empty, { color: palette.textSecondary }]}>No tasks found</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: palette.accent }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={addTask}
        projects={projects}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 15 },
  search: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15 },
  statCard: { flex: 1, padding: 15, borderRadius: 16, borderWidth: 1 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  filterRow: { paddingHorizontal: 15, marginBottom: 15, maxHeight: 40 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, justifyContent: 'center' },
  taskList: { padding: 15, paddingBottom: 100 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }
});
