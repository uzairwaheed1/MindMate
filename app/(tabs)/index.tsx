import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MessageCircle, Camera, Brain, Moon, Target, TrendingUp } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export default function DashboardScreen() {
  const { user, moodEntries } = useStore();

  const getWeeklyMoodAverage = () => {
    const lastWeek = moodEntries.slice(-7);
    if (lastWeek.length === 0) return 0;
    const sum = lastWeek.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / lastWeek.length);
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const dashboardCards = [
    {
      title: 'AI Chatbot',
      subtitle: 'Talk to your AI companion',
      icon: MessageCircle,
      color: Colors.primary,
      onPress: () => router.push('/chat'),
    },
    {
      title: 'Sentiment Check',
      subtitle: 'Analyze your emotions',
      icon: Camera,
      color: Colors.secondary,
      onPress: () => router.push('/sentiment'),
    },
    {
      title: 'Mental Wellness Quiz',
      subtitle: 'Check your mental state',
      icon: Brain,
      color: Colors.accent,
      onPress: () => router.push('/quiz'),
    },
    {
      title: 'Sleep Tracker',
      subtitle: 'Monitor your sleep',
      icon: Moon,
      color: Colors.primaryDark,
      onPress: () => router.push('/sleep'),
    },
    {
      title: 'Goals & Habits',
      subtitle: 'Track your progress',
      icon: Target,
      color: Colors.success,
      onPress: () => router.push('/goals'),
    },
    {
      title: 'Progress Tracking',
      subtitle: 'View your trends',
      icon: TrendingUp,
      color: Colors.warning,
      onPress: () => router.push('/progress'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.surfaceLight]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Hello, {user?.fullName?.split(' ')[0] || 'Friend'} 👋
            </Text>
            <Text style={styles.subtitle}>
              How are you feeling today?
            </Text>
          </View>

          {/* Weekly Mood Summary */}
          <Card style={styles.moodCard}>
            <View style={styles.moodHeader}>
              <Text style={styles.cardTitle}>Weekly Mood Summary</Text>
              <Text style={styles.moodEmoji}>
                {getMoodEmoji(getWeeklyMoodAverage())}
              </Text>
            </View>
            <View style={styles.moodScore}>
              <Text style={styles.scoreNumber}>
                {getWeeklyMoodAverage()}/10
              </Text>
              <Text style={styles.scoreLabel}>Average Mood</Text>
            </View>
          </Card>

          {/* Dashboard Cards */}
          <View style={styles.cardsContainer}>
            {dashboardCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dashboardCard}
                onPress={card.onPress}
              >
                <Card style={styles.cardContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${card.color}20` }]}>
                    <card.icon size={24} color={card.color} />
                  </View>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                </Card>
              </TouchableOpacity>
            ))}
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
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: Fonts.sizes['3xl'],
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 32,
  },
  moodScore: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: Fonts.sizes['4xl'],
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  scoreLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  dashboardCard: {
    width: '48%',
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});