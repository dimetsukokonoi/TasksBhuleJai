export const lightPalette = {
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

export const highContrastPalette = {
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

export const TASKS_STORAGE_KEY = '@tasksbhulejai/tasks';
export const PROJECTS_STORAGE_KEY = '@tasksbhulejai/projects';
export const SETTINGS_STORAGE_KEY = '@tasksbhulejai/settings';

export const defaultProjects = ['CSE 422', 'CSE 260', 'CSE 370'];

export const defaultTasks = [
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
