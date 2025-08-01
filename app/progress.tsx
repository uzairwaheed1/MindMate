import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, TrendingUp, Calendar, Award, Target } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';

export default function ProgressTrackingScreen() {
  const { moodEntries, goals, sleepEntries, quizResults } = useStore();

  const getStreakDays = () => {
    // Calculate consecutive days with mood entries
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = moodEntries.some(entry => 
        entry.date.toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeeklyMoodTrend = () => {
    const lastWeek = moodEntries.slice(-7);
    if (lastWeek.length < 2) return 'stable';
    
    const firstHalf = lastWeek.slice(0, Math.floor(lastWeek.length / 2));
    const secondHalf = lastWeek.slice(Math.floor(lastWeek.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.5) return 'improving';
    if (secondAvg < firstAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getCompletedGoalsCount = () => {
    return goals.filter(goal => goal.completed).length;
  };

  const getAverageSleepDuration = () => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round((total / sleepEntries.length) * 10) / 10;
  };

  const getLatestQuizResult = () => {
    if (quizResults.length === 0) return null;
    return quizResults[quizResults.length - 1];
  };

  const achievements = [
    {
      id: 'first_mood',
      title: 'First Mood Entry',
      description: 'Logged your first mood',
      earned: moodEntries.length > 0,
      icon: '🎯',
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: '7 days of mood tracking',
      earned: getStreakDays() >= 7,
      icon: '🔥',
    },
    {
      id: 'goal_setter',
      title: 'Goal Setter',
      description: 'Created your first goal',
      earned: goals.length > 0,
      icon: '🎯',
    },
    {
      id: 'goal_achiever',
      title: 'Goal Achiever',
      description: 'Completed your first goal',
      earned: getCompletedGoalsCount() > 0,
      icon: '🏆',
    },
    {
      id: 'sleep_tracker',
      title: 'Sleep Tracker',
      description: 'Logged your sleep patterns',
      earned: sleepEntries.length > 0,
      icon: '😴',
    },
    {
      id: 'wellness_check',
      title: 'Wellness Check',
      description: 'Completed mental wellness quiz',
      earned: quizResults.length > 0,
      icon: '🧠',
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return { icon: '📈', color: Colors.success, text: 'Improving' };
      case 'declining':
        return { icon: '📉', color: Colors.warning, text: 'Needs Attention' };
      default:
        return { icon: '➡️', color: Colors.textSecondary, text: 'Stable' };
    }
  };

  const moodTrend = getTrendIcon(getWeeklyMoodTrend());
  const latestQuiz = getLatestQuizResult();

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
          <Text style={styles.title}>Progress Tracking</Text>
          <Text style={styles.subtitle}>
            Your mental wellness journey overview
          </Text>
        </View>

        {/* Key Metrics */}
        <Card style={styles.metricsCard}>
          <Text style={styles.cardTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Calendar size={24} color={Colors.primary} />
              <Text style={styles.metricNumber}>{getStreakDays()}</Text>
              <Text style={styles.metricLabel}>Day Streak</Text>
            </View>
            <View style={styles.metricItem}>
              <TrendingUp size={24} color={moodTrend.color} />
              <Text style={[styles.metricNumber, { color: moodTrend.color }]}>
                {moodTrend.icon}
              </Text>
              <Text style={styles.metricLabel}>{moodTrend.text}</Text>
            </View>
            <View style={styles.metricItem}>
              <Target size={24} color={Colors.success} />
              <Text style={styles.metricNumber}>{getCompletedGoalsCount()}</Text>
              <Text style={styles.metricLabel}>Goals Done</Text>
            </View>
          </View>
        </Card>

        {/* Weekly Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>This Week's Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Mood Entries</Text>
            <Text style={styles.summaryValue}>{moodEntries.slice(-7).length}/7 days</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Average Sleep</Text>
            <Text style={styles.summaryValue}>{getAverageSleepDuration()}h per night</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Goals Progress</Text>
            <Text style={styles.summaryValue}>
              {getCompletedGoalsCount()}/{goals.length} completed
            </Text>
          </View>

          {latestQuiz && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Latest Wellness Check</Text>
              <Text style={[
                styles.summaryValue,
                { color: latestQuiz.level === 'Normal' ? Colors.success : 
                         latestQuiz.level === 'Moderate' ? Colors.warning : Colors.error }
              ]}>
                {latestQuiz.level}
              </Text>
            </View>
          )}
        </Card>

        {/* Achievements */}
        <Card style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  achievement.earned && styles.achievementEarned,
                ]}
              >
                <Text style={styles.achievementIcon}>
                  {achievement.earned ? achievement.icon : '🔒'}
                </Text>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.achievementTitleLocked,
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.earned && styles.achievementDescriptionLocked,
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <Award size={20} color={Colors.success} />
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Insights & Recommendations</Text>
          
          <View style={styles.insightsList}>
            {getStreakDays() === 0 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  🎯 Start tracking your mood daily to build a healthy habit
                </Text>
              </View>
            )}
            
            {getStreakDays() >= 7 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  🔥 Great job maintaining your {getStreakDays()}-day streak!
                </Text>
              </View>
            )}
            
            {goals.length === 0 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  🎯 Set some wellness goals to track your progress
                </Text>
              </View>
            )}
            
            {sleepEntries.length > 0 && getAverageSleepDuration() < 7 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  😴 Consider getting more sleep - aim for 7-9 hours per night
                </Text>
              </View>
            )}
            
            {moodTrend.text === 'Improving' && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  📈 Your mood has been improving - keep up the great work!
                </Text>
              </View>
            )}
            
            {moodTrend.text === 'Needs Attention' && (
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  💙 Your mood seems to need some attention. Consider talking to someone or trying relaxation techniques.
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Motivational Quote */}
        <Card style={styles.quoteCard}>
          <Text style={styles.quote}>
            "Progress, not perfection, is the goal. Every small step forward is a victory worth celebrating."
          </Text>
          <Text style={styles.quoteAuthor}>- MindMate AI</Text>
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
  metricsCard: {
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
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: Fonts.sizes['2xl'],
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  summaryValue: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  achievementsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.surfaceLight,
    opacity: 0.6,
  },
  achievementEarned: {
    opacity: 1,
    backgroundColor: Colors.success + '10',
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: Colors.textLight,
  },
  achievementDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  achievementDescriptionLocked: {
    color: Colors.textLight,
  },
  insightsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
  },
  insightText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  quote: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: Fonts.lineHeights.relaxed * Fonts.sizes.base,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
});