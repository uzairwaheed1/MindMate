import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Target, Plus, Check, X } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

export default function GoalsHabitsScreen() {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const { goals, addGoal, toggleGoal, user } = useStore();

  const predefinedGoals = [
    {
      title: 'Daily Meditation',
      description: 'Practice mindfulness for 10 minutes each day',
    },
    {
      title: 'Gratitude Journal',
      description: 'Write down 3 things I\'m grateful for daily',
    },
    {
      title: 'Regular Exercise',
      description: 'Get 30 minutes of physical activity daily',
    },
    {
      title: 'Better Sleep',
      description: 'Go to bed by 10 PM and wake up at 7 AM',
    },
    {
      title: 'Social Connection',
      description: 'Reach out to a friend or family member daily',
    },
    {
      title: 'Limit Screen Time',
      description: 'Reduce recreational screen time to 2 hours per day',
    },
  ];

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (!user) return;

    const newGoal = {
      id: Date.now().toString(),
      userId: user.id,
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim() || undefined,
      completed: false,
      createdAt: new Date(),
    };

    addGoal(newGoal);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setShowAddGoal(false);
  };

  const handleAddPredefinedGoal = (goal: { title: string; description: string }) => {
    if (!user) return;

    const newGoal = {
      id: Date.now().toString(),
      userId: user.id,
      title: goal.title,
      description: goal.description,
      completed: false,
      createdAt: new Date(),
    };

    addGoal(newGoal);
  };

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.completed).length;
  };

  const getCompletionPercentage = () => {
    if (goals.length === 0) return 0;
    return Math.round((getCompletedGoalsCount() / goals.length) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Goals & Habits</Text>
          <Text style={styles.subtitle}>
            Build healthy habits for better mental wellness
          </Text>
        </View>

        {/* Progress Overview */}
        <Card style={styles.progressCard}>
          <Text style={styles.cardTitle}>Your Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>
                {getCompletionPercentage()}%
              </Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
            <View style={styles.progressDetails}>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{getCompletedGoalsCount()}</Text>
                <Text style={styles.progressText}>Completed</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{goals.length - getCompletedGoalsCount()}</Text>
                <Text style={styles.progressText}>In Progress</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressNumber}>{goals.length}</Text>
                <Text style={styles.progressText}>Total Goals</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Current Goals */}
        <Card style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <Text style={styles.cardTitle}>My Goals</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddGoal(!showAddGoal)}
            >
              {showAddGoal ? (
                <X size={20} color={Colors.primary} />
              ) : (
                <Plus size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Add Goal Form */}
          {showAddGoal && (
            <View style={styles.addGoalForm}>
              <TextInput
                style={styles.goalInput}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
                placeholder="Goal title"
                placeholderTextColor={Colors.textLight}
              />
              <TextInput
                style={[styles.goalInput, styles.goalDescriptionInput]}
                value={newGoalDescription}
                onChangeText={setNewGoalDescription}
                placeholder="Description (optional)"
                placeholderTextColor={Colors.textLight}
                multiline
              />
              <Button
                title="Add Goal"
                onPress={handleAddGoal}
                size="sm"
                style={styles.addGoalButton}
              />
            </View>
          )}

          {/* Goals List */}
          {goals.length > 0 ? (
            <View style={styles.goalsList}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.goalItem}
                  onPress={() => toggleGoal(goal.id)}
                >
                  <View style={[
                    styles.goalCheckbox,
                    goal.completed && styles.goalCheckboxCompleted,
                  ]}>
                    {goal.completed && <Check size={16} color={Colors.surface} />}
                  </View>
                  <View style={styles.goalContent}>
                    <Text style={[
                      styles.goalTitle,
                      goal.completed && styles.goalTitleCompleted,
                    ]}>
                      {goal.title}
                    </Text>
                    {goal.description && (
                      <Text style={[
                        styles.goalDescription,
                        goal.completed && styles.goalDescriptionCompleted,
                      ]}>
                        {goal.description}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noGoalsText}>
              No goals yet. Add your first goal above or choose from suggestions below.
            </Text>
          )}
        </Card>

        {/* Suggested Goals */}
        <Card style={styles.suggestionsCard}>
          <Text style={styles.cardTitle}>Suggested Goals</Text>
          <Text style={styles.suggestionsDescription}>
            Tap to add these evidence-based wellness goals
          </Text>
          
          <View style={styles.suggestionsList}>
            {predefinedGoals.map((goal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleAddPredefinedGoal(goal)}
              >
                <View style={styles.suggestionIcon}>
                  <Target size={20} color={Colors.primary} />
                </View>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{goal.title}</Text>
                  <Text style={styles.suggestionDescription}>{goal.description}</Text>
                </View>
                <Plus size={20} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <Text style={styles.cardTitle}>Goal Setting Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>
              • Start small - choose 1-3 goals to focus on
            </Text>
            <Text style={styles.tipItem}>
              • Make goals specific and measurable
            </Text>
            <Text style={styles.tipItem}>
              • Track your progress daily
            </Text>
            <Text style={styles.tipItem}>
              • Celebrate small wins along the way
            </Text>
            <Text style={styles.tipItem}>
              • Be patient with yourself - habits take time to form
            </Text>
          </View>
        </Card>
      </ScrollView>
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
  progressCard: {
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
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  progressPercentage: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  progressLabel: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  progressDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  progressText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  goalsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addGoalForm: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
  },
  goalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    backgroundColor: Colors.surface,
    marginBottom: 12,
  },
  goalDescriptionInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  addGoalButton: {
    marginTop: 8,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  goalCheckboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  goalDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  goalDescriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  noGoalsText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  suggestionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  suggestionsDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
});