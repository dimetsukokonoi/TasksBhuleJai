import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@tasksbhulejai/tasks';
const PROJECTS_STORAGE_KEY = '@tasksbhulejai/projects';
const SETTINGS_STORAGE_KEY = '@tasksbhulejai/settings';

const defaultProjects = ['CSE 422', 'CSE 260', 'CSE 370'];

const defaultTasks = [
  {
    id: 'cse422-lab-report',
    title: 'Lab Report',
    dueDate: '03/05/2026',
    project: 'CSE 422',
    priority: 'Normal',
    completed: false
  },
  {
    id: 'cse422-theory-assignment',
    title: 'Theory Assignment',
    dueDate: '07/05/2026',
    project: 'CSE 422',
    priority: 'Normal',
    completed: false
  },
  {
    id: 'cse422-theory-quiz',
    title: 'Theory Quiz',
    dueDate: '30/04/2026',
    project: 'CSE 422',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse260-lab-mid',
    title: 'Lab Mid',
    dueDate: '30/04/2026',
    project: 'CSE 260',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse260-lab-report',
    title: 'Lab Report',
    dueDate: '30/04/2026',
    project: 'CSE 260',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse260-lab-project',
    title: 'Lab Project',
    dueDate: '07/05/2026',
    project: 'CSE 260',
    priority: 'Normal',
    completed: false
  },
  {
    id: 'cse260-theory-quiz',
    title: 'Theory Quiz',
    dueDate: '01/05/2026',
    project: 'CSE 260',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse370-theory-quiz',
    title: 'Theory Quiz',
    dueDate: '30/04/2026',
    project: 'CSE 370',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse370-lab-report',
    title: 'Lab Report',
    dueDate: '28/04/2026',
    project: 'CSE 370',
    priority: 'High',
    completed: false
  },
  {
    id: 'cse370-lab-project',
    title: 'Lab Project',
    dueDate: '28/04/2026',
    project: 'CSE 370',
    priority: 'High',
    completed: false
  }
];

const defaultSettings = {
  autoArchiveDone: false,
  highContrast: false
};

function parseDueDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value?.trim() ?? '');
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
}

function getDaysUntil(dateValue) {
  const date = parseDueDate(dateValue);
  if (!date) {
    return Number.POSITIVE_INFINITY;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = date.getTime() - today.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function isValidDueDate(value) {
  return parseDueDate(value) !== null;
}

function stylesForContrast(highContrast) {
  if (highContrast) {
    return {
      background: '#000000',
      surface: '#111111',
      card: '#1b1b1b',
      textPrimary: '#ffffff',
      textSecondary: '#d4d4d4',
      accent: '#facc15',
      accentSoft: '#422006',
      border: '#3f3f46',
      danger: '#fb7185',
      inputBackground: '#18181b'
    };
  }

  return {
    background: '#f4f7fb',
    surface: '#ffffff',
    card: '#f8fafc',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    accent: '#0f766e',
    accentSoft: '#ccfbf1',
    border: '#dbe4ef',
    danger: '#e11d48',
    inputBackground: '#ffffff'
  };
}

export default function App() {
  const { width, height } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [tasks, setTasks] = useState(defaultTasks);
  const [projects, setProjects] = useState(defaultProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('All');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(defaultProjects[0]);
  const [newTaskPriority, setNewTaskPriority] = useState('Normal');

  const [newProjectName, setNewProjectName] = useState('');
  const [taskFormMessage, setTaskFormMessage] = useState('');
  const [projectFormMessage, setProjectFormMessage] = useState('');

  const [autoArchiveDone, setAutoArchiveDone] = useState(defaultSettings.autoArchiveDone);
  const [highContrast, setHighContrast] = useState(defaultSettings.highContrast);
  const [isHydrated, setIsHydrated] = useState(false);

  const palette = stylesForContrast(highContrast);
  const isCompactPhone = width < 360;
  const isSmallPhone = width < 400;
  const isTablet = width >= 768;
  const horizontalPadding = isCompactPhone ? 10 : isTablet ? 24 : 16;
  const contentMaxWidth = isTablet ? 760 : 520;
  const contentBottomPadding = Math.max(24, Math.round(height * 0.05));

  useEffect(() => {
    let mounted = true;

    async function hydrateState() {
      try {
        const [storedTasks, storedProjects, storedSettings] = await Promise.all([
          AsyncStorage.getItem(TASKS_STORAGE_KEY),
          AsyncStorage.getItem(PROJECTS_STORAGE_KEY),
          AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
        ]);

        if (!mounted) {
          return;
        }

        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects);
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            setProjects(parsedProjects);
            setNewTaskProject(parsedProjects[0]);
          }
        }

        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
            // Merge any new default tasks that are not yet in the stored tasks
            const existingTaskIds = new Set(parsedTasks.map(t => t.id));
            const missingDefaultTasks = defaultTasks.filter(t => !existingTaskIds.has(t.id));
            setTasks([...missingDefaultTasks, ...parsedTasks]);
          } else {
            setTasks(defaultTasks);
          }
        } else {
          setTasks(defaultTasks);
        }

        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          if (parsedSettings && typeof parsedSettings === 'object') {
            setAutoArchiveDone(Boolean(parsedSettings.autoArchiveDone));
            setHighContrast(Boolean(parsedSettings.highContrast));
          }
        }
      } catch (error) {
        console.error('Failed to hydrate app data', error);
      } finally {
        if (mounted) {
          setIsHydrated(true);
        }
      }
    }

    hydrateState();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks)).catch((error) => {
      console.error('Failed to save tasks', error);
    });
  }, [isHydrated, tasks]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects)).catch((error) => {
      console.error('Failed to save projects', error);
    });
  }, [isHydrated, projects]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const payload = {
      autoArchiveDone,
      highContrast
    };

    AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload)).catch((error) => {
      console.error('Failed to save settings', error);
    });
  }, [autoArchiveDone, highContrast, isHydrated]);

  useEffect(() => {
    if (projects.length === 0) {
      return;
    }

    if (!projects.includes(newTaskProject)) {
      setNewTaskProject(projects[0]);
    }

    if (selectedProjectFilter !== 'All' && !projects.includes(selectedProjectFilter)) {
      setSelectedProjectFilter('All');
    }
  }, [newTaskProject, projects, selectedProjectFilter]);

  const filteredTasks = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (selectedProjectFilter !== 'All' && task.project !== selectedProjectFilter) {
          return false;
        }

        if (!search) {
          return true;
        }

        return (
          task.title.toLowerCase().includes(search) ||
          task.project.toLowerCase().includes(search) ||
          task.dueDate.toLowerCase().includes(search) ||
          task.priority.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        return getDaysUntil(a.dueDate) - getDaysUntil(b.dueDate);
      });
  }, [searchQuery, selectedProjectFilter, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const dueSoonCount = tasks.filter((task) => !task.completed && getDaysUntil(task.dueDate) <= 3).length;

  const projectCounts = useMemo(() => {
    return projects.map((project) => {
      const total = tasks.filter((task) => task.project === project).length;
      const pending = tasks.filter((task) => task.project === project && !task.completed).length;
      return { project, total, pending };
    });
  }, [projects, tasks]);

  const addProject = () => {
    const trimmed = newProjectName.trim();
    if (!trimmed) {
      setProjectFormMessage('Project name cannot be empty.');
      return;
    }

    const duplicate = projects.some((project) => project.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) {
      setProjectFormMessage('That project already exists.');
      return;
    }

    setProjects((currentProjects) => [...currentProjects, trimmed]);
    setNewTaskProject(trimmed);
    setNewProjectName('');
    setProjectFormMessage('Project created successfully.');
  };

  const createTask = () => {
    const title = newTaskTitle.trim();

    if (!title) {
      setTaskFormMessage('Please enter a task title.');
      return;
    }

    if (!isValidDueDate(newTaskDueDate)) {
      setTaskFormMessage('Please use a valid due date in DD/MM/YYYY format.');
      return;
    }

    if (!newTaskProject) {
      setTaskFormMessage('Please select a project.');
      return;
    }

    const task = {
      id: `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
      title,
      dueDate: newTaskDueDate.trim(),
      project: newTaskProject,
      priority: newTaskPriority,
      completed: false
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPriority('Normal');
    setTaskFormMessage('Task created.');
    setActiveTab('Dashboard');
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.flatMap((task) => {
        if (task.id !== taskId) {
          return [task];
        }

        const nextCompleted = !task.completed;

        if (autoArchiveDone && nextCompleted) {
          return [];
        }

        return [{
          ...task,
          completed: nextCompleted
        }];
      })
    );
  };

  const removeTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar style={highContrast ? 'light' : 'dark'} />
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: isCompactPhone ? 6 : 8
          }
        ]}
      >
        <View style={[styles.screenFrame, { maxWidth: contentMaxWidth }]}>
          <View
            style={[
              styles.headerCard,
              isSmallPhone && styles.headerCardCompact,
              { backgroundColor: palette.surface, borderColor: palette.border }
            ]}
          >
            <Text style={[styles.title, isSmallPhone && styles.titleCompact, { color: palette.textPrimary }]}>TasksBhuleJai Mobile</Text>
            <Text style={[styles.subtitle, isSmallPhone && styles.subtitleCompact, { color: palette.textSecondary }]}>Track coursework, deadlines, and progress from your phone.</Text>

            <View style={[styles.tabRow, isSmallPhone && styles.tabRowCompact]}>
            {['Dashboard', 'Projects', 'Settings'].map((tab) => {
              const active = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    isSmallPhone && styles.tabButtonCompact,
                    {
                      backgroundColor: active ? palette.accent : palette.card,
                      borderColor: palette.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      isSmallPhone && styles.tabButtonTextCompact,
                      { color: active ? '#ffffff' : palette.textSecondary }
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, project, due date, priority"
              placeholderTextColor={highContrast ? '#71717a' : '#94a3b8'}
              style={[
                styles.searchInput,
                isSmallPhone && styles.searchInputCompact,
                {
                  backgroundColor: palette.inputBackground,
                  color: palette.textPrimary,
                  borderColor: palette.border
                }
              ]}
            />
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: contentBottomPadding }]}
            keyboardShouldPersistTaps="handled"
          >
          {activeTab === 'Dashboard' && (
            <>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, isCompactPhone && styles.statCardCompact, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Pending</Text>
                  <Text style={[styles.statValue, isCompactPhone && styles.statValueCompact, { color: palette.textPrimary }]}>{pendingCount}</Text>
                </View>
                <View style={[styles.statCard, isCompactPhone && styles.statCardCompact, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Completed</Text>
                  <Text style={[styles.statValue, isCompactPhone && styles.statValueCompact, { color: palette.textPrimary }]}>{completedCount}</Text>
                </View>
                <View style={[styles.statCard, isCompactPhone && styles.statCardCompact, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                  <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Due in 3 days</Text>
                  <Text style={[styles.statValue, isCompactPhone && styles.statValueCompact, { color: palette.textPrimary }]}>{dueSoonCount}</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {['All', ...projects].map((project) => {
                  const selected = selectedProjectFilter === project;
                  return (
                    <TouchableOpacity
                      key={project}
                      onPress={() => setSelectedProjectFilter(project)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: selected ? palette.accentSoft : palette.surface,
                          borderColor: selected ? palette.accent : palette.border
                        }
                      ]}
                    >
                      <Text style={[styles.filterChipText, { color: palette.textPrimary }]}>{project}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={[styles.sectionCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Upcoming Tasks</Text>
                {filteredTasks.length === 0 && (
                  <Text style={[styles.emptyText, { color: palette.textSecondary }]}>No tasks match your search.</Text>
                )}

                {filteredTasks.map((task) => {
                  const daysLeft = getDaysUntil(task.dueDate);
                  const dueHint = daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Due today' : `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;

                  return (
                    <View key={task.id} style={[styles.taskRow, isCompactPhone && styles.taskRowCompact, { borderColor: palette.border }]}>
                      <TouchableOpacity
                        onPress={() => toggleTaskCompletion(task.id)}
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
                            isCompactPhone && styles.taskTitleCompact,
                            {
                              color: task.completed ? palette.textSecondary : palette.textPrimary,
                              textDecorationLine: task.completed ? 'line-through' : 'none'
                            }
                          ]}
                        >
                          {task.title}
                        </Text>
                        <Text numberOfLines={2} style={[styles.taskMeta, isCompactPhone && styles.taskMetaCompact, { color: palette.textSecondary }]}>
                          {task.project} • {task.dueDate} • {dueHint}
                        </Text>
                      </View>

                      <View style={[styles.taskActions, isCompactPhone && styles.taskActionsCompact]}>
                        <Text
                          style={[
                            styles.priorityBadge,
                            isCompactPhone && styles.priorityBadgeCompact,
                            {
                              color: task.priority === 'High' ? '#be123c' : palette.textSecondary,
                              backgroundColor: task.priority === 'High' ? '#ffe4e6' : palette.card,
                              borderColor: task.priority === 'High' ? '#fecdd3' : palette.border
                            }
                          ]}
                        >
                          {task.priority}
                        </Text>
                        <TouchableOpacity onPress={() => removeTask(task.id)}>
                          <Text style={[styles.deleteText, isCompactPhone && styles.deleteTextCompact, { color: palette.danger }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={[styles.sectionCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Add New Task</Text>

                <TextInput
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder="Task title"
                  placeholderTextColor={highContrast ? '#71717a' : '#94a3b8'}
                  style={[
                    styles.formInput,
                    isSmallPhone && styles.formInputCompact,
                    {
                      backgroundColor: palette.inputBackground,
                      color: palette.textPrimary,
                      borderColor: palette.border
                    }
                  ]}
                />

                <TextInput
                  value={newTaskDueDate}
                  onChangeText={setNewTaskDueDate}
                  placeholder="Due date (DD/MM/YYYY)"
                  placeholderTextColor={highContrast ? '#71717a' : '#94a3b8'}
                  style={[
                    styles.formInput,
                    isSmallPhone && styles.formInputCompact,
                    {
                      backgroundColor: palette.inputBackground,
                      color: palette.textPrimary,
                      borderColor: palette.border
                    }
                  ]}
                />

                <Text style={[styles.label, { color: palette.textSecondary }]}>Project</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
                  {projects.map((project) => {
                    const selected = newTaskProject === project;
                    return (
                      <TouchableOpacity
                        key={project}
                        onPress={() => setNewTaskProject(project)}
                        style={[
                          styles.selectorChip,
                          {
                            backgroundColor: selected ? palette.accentSoft : palette.card,
                            borderColor: selected ? palette.accent : palette.border
                          }
                        ]}
                      >
                        <Text style={[styles.selectorChipText, { color: palette.textPrimary }]}>{project}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={[styles.label, { color: palette.textSecondary }]}>Priority</Text>
                <View style={[styles.priorityRow, isCompactPhone && styles.priorityRowCompact]}>
                  {['Normal', 'High'].map((priority) => {
                    const selected = newTaskPriority === priority;
                    return (
                      <TouchableOpacity
                        key={priority}
                        onPress={() => setNewTaskPriority(priority)}
                        style={[
                          styles.priorityOption,
                          isCompactPhone && styles.priorityOptionCompact,
                          {
                            backgroundColor: selected ? palette.accent : palette.card,
                            borderColor: selected ? palette.accent : palette.border
                          }
                        ]}
                      >
                        <Text style={[styles.priorityOptionText, isCompactPhone && styles.priorityOptionTextCompact, { color: selected ? '#ffffff' : palette.textPrimary }]}>{priority}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity onPress={createTask} style={[styles.primaryButton, { backgroundColor: palette.accent }]}>
                  <Text style={styles.primaryButtonText}>Create Task</Text>
                </TouchableOpacity>

                {taskFormMessage ? <Text style={[styles.feedbackText, { color: palette.textSecondary }]}>{taskFormMessage}</Text> : null}
              </View>
            </>
          )}

          {activeTab === 'Projects' && (
            <>
              <View style={[styles.sectionCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Create Project</Text>
                <TextInput
                  value={newProjectName}
                  onChangeText={setNewProjectName}
                  placeholder="Project name"
                  placeholderTextColor={highContrast ? '#71717a' : '#94a3b8'}
                  style={[
                    styles.formInput,
                    isSmallPhone && styles.formInputCompact,
                    {
                      backgroundColor: palette.inputBackground,
                      color: palette.textPrimary,
                      borderColor: palette.border
                    }
                  ]}
                />
                <TouchableOpacity onPress={addProject} style={[styles.primaryButton, { backgroundColor: palette.accent }]}>
                  <Text style={styles.primaryButtonText}>Save Project</Text>
                </TouchableOpacity>

                {projectFormMessage ? <Text style={[styles.feedbackText, { color: palette.textSecondary }]}>{projectFormMessage}</Text> : null}
              </View>

              <View style={[styles.sectionCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Project Overview</Text>
                {projectCounts.map((item) => (
                  <View key={item.project} style={[styles.projectRow, isCompactPhone && styles.projectRowCompact, { borderColor: palette.border }]}>
                    <View style={styles.projectInfoWrap}>
                      <Text numberOfLines={1} style={[styles.projectName, isCompactPhone && styles.projectNameCompact, { color: palette.textPrimary }]}>{item.project}</Text>
                      <Text numberOfLines={1} style={[styles.projectMeta, isCompactPhone && styles.projectMetaCompact, { color: palette.textSecondary }]}>{item.pending} pending • {item.total} total</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedProjectFilter(item.project);
                        setActiveTab('Dashboard');
                      }}
                      style={[styles.jumpButton, isCompactPhone && styles.jumpButtonCompact, { borderColor: palette.border, backgroundColor: palette.card }]}
                    >
                      <Text style={[styles.jumpButtonText, isCompactPhone && styles.jumpButtonTextCompact, { color: palette.textPrimary }]}>Open</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {activeTab === 'Settings' && (
            <View style={[styles.sectionCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Preferences</Text>

              <View style={[styles.settingRow, isCompactPhone && styles.settingRowCompact]}>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, isCompactPhone && styles.settingLabelCompact, { color: palette.textPrimary }]}>Auto archive completed tasks</Text>
                  <Text style={[styles.settingHint, isCompactPhone && styles.settingHintCompact, { color: palette.textSecondary }]}>Completed tasks are removed instantly.</Text>
                </View>
                <Switch value={autoArchiveDone} onValueChange={setAutoArchiveDone} />
              </View>

              <View style={[styles.settingRow, isCompactPhone && styles.settingRowCompact, { marginBottom: 0 }]}>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, isCompactPhone && styles.settingLabelCompact, { color: palette.textPrimary }]}>High contrast mode</Text>
                  <Text style={[styles.settingHint, isCompactPhone && styles.settingHintCompact, { color: palette.textSecondary }]}>Improves readability in low-light environments.</Text>
                </View>
                <Switch value={highContrast} onValueChange={setHighContrast} />
              </View>
            </View>
          )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1
  },
  screenFrame: {
    flex: 1,
    width: '100%',
    alignSelf: 'center'
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14
  },
  headerCardCompact: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: '800'
  },
  titleCompact: {
    fontSize: 21
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18
  },
  subtitleCompact: {
    fontSize: 12,
    lineHeight: 16
  },
  tabRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8
  },
  tabRowCompact: {
    marginTop: 10,
    gap: 6
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tabButtonCompact: {
    borderRadius: 10,
    paddingVertical: 8
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700'
  },
  tabButtonTextCompact: {
    fontSize: 12
  },
  searchInput: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  searchInputCompact: {
    marginTop: 10,
    borderRadius: 10,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  scrollContent: {
    gap: 12
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 96,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  statCardCompact: {
    minWidth: 136,
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  statLabel: {
    fontSize: 12
  },
  statValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '800'
  },
  statValueCompact: {
    fontSize: 21
  },
  filterRow: {
    gap: 8,
    paddingVertical: 2
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600'
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },
  emptyText: {
    fontSize: 13,
    marginBottom: 4
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 8
  },
  taskRowCompact: {
    borderRadius: 12,
    padding: 8
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
  taskTitleCompact: {
    fontSize: 13
  },
  taskMeta: {
    marginTop: 4,
    fontSize: 12
  },
  taskMetaCompact: {
    fontSize: 11,
    lineHeight: 15
  },
  taskActions: {
    alignItems: 'flex-end',
    minWidth: 70,
    gap: 6
  },
  taskActionsCompact: {
    minWidth: 58,
    gap: 4
  },
  priorityBadge: {
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  priorityBadgeCompact: {
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 6
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700'
  },
  deleteTextCompact: {
    fontSize: 11
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8
  },
  formInputCompact: {
    borderRadius: 10,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  label: {
    marginTop: 4,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '600'
  },
  selectorRow: {
    gap: 8,
    paddingBottom: 2,
    marginBottom: 6
  },
  selectorChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  selectorChipText: {
    fontSize: 12,
    fontWeight: '600'
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  priorityRowCompact: {
    gap: 6,
    marginBottom: 8
  },
  priorityOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10
  },
  priorityOptionCompact: {
    borderRadius: 8,
    paddingVertical: 8
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: '700'
  },
  priorityOptionTextCompact: {
    fontSize: 11
  },
  primaryButton: {
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  feedbackText: {
    marginTop: 8,
    fontSize: 12
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  projectRowCompact: {
    padding: 8,
    borderRadius: 10,
    gap: 8
  },
  projectInfoWrap: {
    flex: 1,
    marginRight: 8
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700'
  },
  projectNameCompact: {
    fontSize: 13
  },
  projectMeta: {
    marginTop: 2,
    fontSize: 12
  },
  projectMetaCompact: {
    fontSize: 11
  },
  jumpButton: {
    borderWidth: 1,
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  jumpButtonCompact: {
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8
  },
  jumpButtonText: {
    fontSize: 12,
    fontWeight: '600'
  },
  jumpButtonTextCompact: {
    fontSize: 11
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12
  },
  settingRowCompact: {
    marginBottom: 12,
    gap: 8
  },
  settingTextWrap: {
    flex: 1
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700'
  },
  settingLabelCompact: {
    fontSize: 13
  },
  settingHint: {
    marginTop: 2,
    fontSize: 12
  },
  settingHintCompact: {
    fontSize: 11
  }
});
