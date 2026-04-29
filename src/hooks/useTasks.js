import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TASKS_STORAGE_KEY, PROJECTS_STORAGE_KEY, defaultTasks, defaultProjects } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { autoArchiveDone } = useTheme();

  useEffect(() => {
    async function loadData() {
      try {
        const [storedTasks, storedProjects] = await Promise.all([
          AsyncStorage.getItem(TASKS_STORAGE_KEY),
          AsyncStorage.getItem(PROJECTS_STORAGE_KEY)
        ]);

        let loadedTasks = defaultTasks;
        if (storedTasks) {
          const parsed = JSON.parse(storedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map(t => t.id));
            const missingDefaults = defaultTasks.filter(t => !existingIds.has(t.id));
            loadedTasks = [...missingDefaults, ...parsed];
          }
        }
        setTasks(loadedTasks);

        let loadedProjects = defaultProjects;
        if (storedProjects) {
          const parsed = JSON.parse(storedProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedProjects = parsed;
          }
        }
        setProjects(loadedProjects);
      } catch (e) {
        console.error('Failed to load tasks/projects', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects, isLoaded]);

  const addTask = (task) => {
    const newTask = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      completed: false,
      ...task
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.flatMap(t => {
      if (t.id !== taskId) return [t];
      const nextCompleted = !t.completed;
      if (autoArchiveDone && nextCompleted) return [];
      return [{ ...t, completed: nextCompleted }];
    }));
  };

  const removeTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addProject = (projectName) => {
    if (!projectName.trim()) return { success: false, message: 'Name cannot be empty' };
    if (projects.some(p => p.toLowerCase() === projectName.trim().toLowerCase())) {
      return { success: false, message: 'Project already exists' };
    }
    setProjects(prev => [...prev, projectName.trim()]);
    return { success: true };
  };

  return {
    tasks,
    projects,
    isLoaded,
    addTask,
    toggleTask,
    removeTask,
    addProject
  };
}
