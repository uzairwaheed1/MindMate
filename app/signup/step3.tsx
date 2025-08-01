import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, ArrowLeft, Check } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';

export default function SignupStep3Screen() {
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signupData, updateSignupData, setUser, setAuthenticated, resetSignupData } = useStore();

  const contextOptions = [
    { id: 'stress', label: 'Stress Management', icon: '😰' },
    { id: 'anxiety', label: 'Anxiety Support', icon: '😟' },
    { id: 'depression', label: 'Depression Help', icon: '😔' },
    { id: 'self-awareness', label: 'Self-awareness', icon: '🧘' },
    { id: 'exploring', label: 'Just Exploring', icon: '🌟' },
  ];

  const toggleContext = (contextId: string) => {
    setSelectedContexts(prev => 
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    );
  };

  const handleCreateAccount = async () => {
    if (selectedContexts.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one area of interest');
      return;
    }

    if (!consentGiven) {
      Alert.alert('Consent Required', 'Please acknowledge the medical advice disclaimer');
      return;
    }

    setIsLoading(true);

    // Simulate account creation
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        fullName: signupData.fullName || '',
        email: signupData.email || '',
        age: signupData.age,
        gender: signupData.gender,
        occupation: signupData.occupation,
        mentalWellnessContext: selectedContexts,
        createdAt: new Date(),
      };

      setUser(user);
      setAuthenticated(true);
      resetSignupData();
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surfaceLight]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Heart size={48} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Mental Wellness</Text>
            <Text style={styles.subtitle}>
              Step 3 of 3: What brings you here?
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.progressText}>3 of 3</Text>
          </View>

          {/* Context Selection */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>
              Select areas you'd like support with:
            </Text>

            <View style={styles.contextGrid}>
              {contextOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.contextOption,
                    selectedContexts.includes(option.id) && styles.contextOptionSelected,
                  ]}
                  onPress={() => toggleContext(option.id)}
                >
                  <Text style={styles.contextIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.contextLabel,
                    selectedContexts.includes(option.id) && styles.contextLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  {selectedContexts.includes(option.id) && (
                    <View style={styles.checkIcon}>
                      <Check size={16} color={Colors.surface} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Consent Checkbox */}
            <TouchableOpacity
              style={styles.consentContainer}
              onPress={() => setConsentGiven(!consentGiven)}
            >
              <View style={[
                styles.checkbox,
                consentGiven && styles.checkboxChecked,
              ]}>
                {consentGiven && <Check size={16} color={Colors.surface} />}
              </View>
              <Text style={styles.consentText}>
                I understand that this app does not replace professional medical advice, 
                diagnosis, or treatment. If you're experiencing a mental health crisis, 
                please contact emergency services or a mental health professional immediately.
              </Text>
            </TouchableOpacity>

            <Button
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleCreateAccount}
              disabled={isLoading}
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
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
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: Fonts.sizes['3xl'],
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  contextGrid: {
    gap: 12,
    marginBottom: 32,
  },
  contextOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  contextOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  contextIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contextLabel: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  contextLabelSelected: {
    color: Colors.primary,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  consentText: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
  },
  createButton: {
    marginTop: 8,
  },
});