import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, ArrowLeft, ChevronDown } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export default function SignupStep2Screen() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showOccupationOptions, setShowOccupationOptions] = useState(false);
  const { updateSignupData } = useStore();

  const genderOptions = ['Male', 'Female', 'Other'];
  const occupationOptions = [
    'Student',
    'Freelancer',
    'Employee',
    'Entrepreneur',
    'Healthcare Worker',
    'Teacher',
    'Engineer',
    'Artist',
    'Other',
  ];

  const handleNext = () => {
    updateSignupData({ 
      age: age ? parseInt(age) : undefined, 
      gender: gender as any, 
      occupation 
    });
    router.push('/signup/step3');
  };

  const SelectDropdown = ({ 
    value, 
    onSelect, 
    options, 
    placeholder, 
    isOpen, 
    setIsOpen 
  }: {
    value: string;
    onSelect: (value: string) => void;
    options: string[];
    placeholder: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.textLight} />
      </TouchableOpacity>
      
      {isOpen && (
        <Card style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </View>
  );

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
            <Text style={styles.title}>Personal Info</Text>
            <Text style={styles.subtitle}>
              Step 2 of 3: Tell us about yourself
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            <Text style={styles.progressText}>2 of 3</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Age (Optional)"
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
            />

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender (Optional)</Text>
              <SelectDropdown
                value={gender}
                onSelect={setGender}
                options={genderOptions}
                placeholder="Select your gender"
                isOpen={showGenderOptions}
                setIsOpen={setShowGenderOptions}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Occupation (Optional)</Text>
              <SelectDropdown
                value={occupation}
                onSelect={setOccupation}
                options={occupationOptions}
                placeholder="Select your occupation"
                isOpen={showOccupationOptions}
                setIsOpen={setShowOccupationOptions}
              />
            </View>

            <Text style={styles.note}>
              This information helps us personalize your experience. 
              You can skip any field you're not comfortable sharing.
            </Text>

            <Button
              title="Next"
              onPress={handleNext}
              style={styles.nextButton}
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
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 8,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.textLight,
  },
  dropdownOptions: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    maxHeight: 200,
    zIndex: 1001,
    padding: 0,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownOptionText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  note: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
  },
  nextButton: {
    marginTop: 8,
  },
});