import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

export default function AddTaskModal({ visible, onClose, onAdd, projects }) {
  const { palette } = useTheme();
  const [title, setTitle] = useState('');
  const [project, setProject] = useState(projects[0]);
  const [priority, setPriority] = useState('Normal');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dueDate = `${day}/${month}/${year}`;

    onAdd({
      title,
      project,
      priority,
      dueDate
    });

    setTitle('');
    onClose();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Modal visible={!!visible} animationType="slide" transparent>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.modalTitle, { color: palette.textPrimary }]}>Add New Task</Text>

          <TextInput
            style={[styles.input, { backgroundColor: palette.inputBackground, color: palette.textPrimary, borderColor: palette.border }]}
            placeholder="Task title"
            placeholderTextColor={palette.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: palette.textSecondary }]}>Project</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {projects.map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setProject(p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: project === p ? palette.accent : palette.card,
                    borderColor: palette.border
                  }
                ]}
              >
                <Text style={{ color: project === p ? '#fff' : palette.textPrimary }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.label, { color: palette.textSecondary }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {['Normal', 'High'].map((p, idx) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor: priority === p ? palette.accent : palette.card,
                    borderColor: palette.border,
                    marginLeft: idx > 0 ? 10 : 0
                  }
                ]}
              >
                <Text style={{ color: priority === p ? '#fff' : palette.textPrimary }}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateBtn, { borderColor: palette.border, backgroundColor: palette.card }]}
          >
            <Text style={{ color: palette.textPrimary }}>Due Date: {date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, { backgroundColor: palette.card }]}>
              <Text style={{ color: palette.textPrimary }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={[styles.btn, { backgroundColor: palette.accent, marginLeft: 10 }]}>
              <Text style={{ color: '#fff' }}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20
  },
  modalView: {
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  chipScroll: {
    marginBottom: 15
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1
  },
  priorityRow: {
    flexDirection: 'row',
    marginBottom: 15
  },
  priorityBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1
  },
  dateBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20
  },
  actionRow: {
    flexDirection: 'row'
  },
  btn: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  }
});
