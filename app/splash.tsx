import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { useStore } from '../store/useStore';

export default function SplashScreen() {
  const { isAuthenticated } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <LinearGradient
      colors={Colors.gradient.primary}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Heart size={64} color={Colors.surface} />
        </View>
        <Text style={styles.title}>MindMate AI</Text>
        <Text style={styles.subtitle}>
          Your personal mental health companion
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: Fonts.sizes['4xl'],
    fontFamily: Fonts.bold,
    color: Colors.surface,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.regular,
    color: Colors.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
});