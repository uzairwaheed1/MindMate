import { useEffect } from 'react';
import { router } from 'expo-router';
import { useStore } from '../store/useStore';

export default function Index() {
  const { isAuthenticated } = useStore();

  useEffect(() => {
    // Redirect to splash screen
    router.replace('/splash');
  }, []);

  return null;
}