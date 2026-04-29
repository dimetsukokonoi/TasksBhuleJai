import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function TaskItem({ task, onToggle, onDelete }) {
  const { palette } = useTheme();

  return (
    <View style={[styles.taskRow, { borderColor: palette.border }]}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        style={[
          styles.checkButton,
          {
            backgroundColor: task.completed ? palette.accent : 'transparent',
            borderColor: task.completed ? palette.accent : palette.border
          }
        ]}
      >
        <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
      </TouchableOpacity>

      <View style={styles.taskBody}>
        <Text
          numberOfLines={2}
          style={[
            styles.taskTitle,
            {
              color: task.completed ? palette.textSecondary : palette.textPrimary,
              textDecorationLine: task.completed ? 'line-through' : 'none'
            }
          ]}
        >
          {task.title}
        </Text>
        <Text numberOfLines={2} style={[styles.taskMeta, { color: palette.textSecondary }]}>
          {task.project} • {task.dueDate}
        </Text>
      </View>

      <View style={styles.taskActions}>
        <View
          style={[
            styles.priorityBadgeContainer,
            {
              backgroundColor: task.priority === 'High' ? '#ffe4e6' : palette.card,
              borderColor: task.priority === 'High' ? '#fecdd3' : palette.border
            }
          ]}
        >
          <Text
            style={[
              styles.priorityBadgeText,
              {
                color: task.priority === 'High' ? '#be123c' : palette.textSecondary,
              }
            ]}
          >
            {task.priority}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={{ marginTop: 6 }}>
          <Text style={[styles.deleteText, { color: palette.danger }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 8
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  taskBody: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  taskMeta: {
    marginTop: 4,
    fontSize: 12
  },
  taskActions: {
    alignItems: 'flex-end',
    minWidth: 70
  },
  priorityBadgeContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  priorityBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
