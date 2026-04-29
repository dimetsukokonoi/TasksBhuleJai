import { ExpoRoot } from 'expo-router';

// This is the main component for the app when using expo-router
export default function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}
