import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function BreathingExerciseScreen() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(0.3);

  const breathingPatterns = [
    {
      name: '4-7-8 Relaxation',
      description: 'Inhale 4s, Hold 7s, Exhale 8s - Great for anxiety and sleep',
      inhale: 4,
      hold: 7,
      exhale: 8,
      cycles: 4,
    },
    {
      name: 'Box Breathing',
      description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s - Builds focus',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
      cycles: 5,
    },
    {
      name: 'Simple Deep Breathing',
      description: 'Inhale 4s, Exhale 6s - Perfect for beginners',
      inhale: 4,
      hold: 0,
      exhale: 6,
      cycles: 8,
    },
  ];

  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handlePhaseTransition();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, cycle]);

  const handlePhaseTransition = () => {
    if (phase === 'inhale') {
      if (selectedPattern.hold > 0) {
        setPhase('hold');
        setTimeLeft(selectedPattern.hold);
      } else {
        setPhase('exhale');
        setTimeLeft(selectedPattern.exhale);
      }
    } else if (phase === 'hold') {
      setPhase('exhale');
      setTimeLeft(selectedPattern.exhale);
    } else if (phase === 'exhale') {
      if (selectedPattern.holdAfterExhale) {
        setPhase('hold');
        setTimeLeft(selectedPattern.holdAfterExhale);
      } else {
        // Complete cycle
        const newCycle = cycle + 1;
        if (newCycle >= selectedPattern.cycles) {
          // Exercise complete
          setIsActive(false);
          setCycle(0);
          setPhase('inhale');
          setTimeLeft(selectedPattern.inhale);
        } else {
          setCycle(newCycle);
          setPhase('inhale');
          setTimeLeft(selectedPattern.inhale);
        }
      }
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCycle(0);
    startAnimation();
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCycle(0);
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.3);
  };

  const startAnimation = () => {
    const breatheIn = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: selectedPattern.inhale * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: selectedPattern.inhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const breatheOut = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: selectedPattern.exhale * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: selectedPattern.exhale * 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (phase === 'inhale') {
      breatheIn();
    } else if (phase === 'exhale') {
      breatheOut();
    }
  };

  useEffect(() => {
    if (isActive) {
      startAnimation();
    }
  }, [phase, isActive]);

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return Colors.primary;
      case 'hold':
        return Colors.warning;
      case 'exhale':
        return Colors.secondary;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Breathing Exercise</Text>
        <Text style={styles.subtitle}>
          Guided breathing for relaxation and focus
        </Text>
      </View>

      {/* Pattern Selection */}
      {!isActive && (
        <Card style={styles.patternsCard}>
          <Text style={styles.cardTitle}>Choose a Breathing Pattern</Text>
          {breathingPatterns.map((pattern, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.patternOption,
                selectedPattern.name === pattern.name && styles.selectedPattern,
              ]}
              onPress={() => setSelectedPattern(pattern)}
            >
              <Text style={[
                styles.patternName,
                selectedPattern.name === pattern.name && styles.selectedPatternText,
              ]}>
                {pattern.name}
              </Text>
              <Text style={[
                styles.patternDescription,
                selectedPattern.name === pattern.name && styles.selectedPatternDescription,
              ]}>
                {pattern.description}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* Breathing Circle */}
      <View style={styles.breathingContainer}>
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              backgroundColor: getPhaseColor(),
            },
          ]}
        >
          <View style={styles.breathingContent}>
            <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
              {getPhaseInstruction()}
            </Text>
            <Text style={styles.timerText}>{timeLeft}</Text>
            <Text style={styles.cycleText}>
              Cycle {cycle + 1} of {selectedPattern.cycles}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!isActive ? (
          <Button
            title="Start Exercise"
            onPress={startExercise}
            style={styles.controlButton}
          />
        ) : (
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={styles.controlIcon}
              onPress={pauseExercise}
            >
              <Pause size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlIcon}
              onPress={resetExercise}
            >
              <RotateCcw size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Benefits */}
      <Card style={styles.benefitsCard}>
        <Text style={styles.cardTitle}>Benefits of Breathing Exercises</Text>
        <View style={styles.benefitsList}>
          <Text style={styles.benefitItem}>• Reduces stress and anxiety</Text>
          <Text style={styles.benefitItem}>• Improves focus and concentration</Text>
          <Text style={styles.benefitItem}>• Lowers blood pressure</Text>
          <Text style={styles.benefitItem}>• Promotes better sleep</Text>
          <Text style={styles.benefitItem}>• Increases mindfulness</Text>
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: Fonts.sizes['3xl'],
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  patternsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  patternOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  selectedPattern: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  patternName: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  selectedPatternText: {
    color: Colors.primary,
  },
  patternDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  selectedPatternDescription: {
    color: Colors.text,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breathingContent: {
    alignItems: 'center',
  },
  phaseText: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  timerText: {
    fontSize: Fonts.sizes['4xl'],
    fontFamily: Fonts.bold,
    color: Colors.surface,
    marginBottom: 8,
  },
  cycleText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.surface,
    opacity: 0.8,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlButton: {
    marginBottom: 20,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
});