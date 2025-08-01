import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';

export default function MoodTrackingScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const { addMoodEntry, moodEntries, user } = useStore();

  const moodOptions = [
    { value: 10, emoji: '😊', label: 'Excellent', color: Colors.mood.excellent },
    { value: 8, emoji: '🙂', label: 'Good', color: Colors.mood.good },
    { value: 6, emoji: '😐', label: 'Okay', color: Colors.mood.okay },
    { value: 4, emoji: '😔', label: 'Poor', color: Colors.mood.poor },
    { value: 2, emoji: '😢', label: 'Terrible', color: Colors.mood.terrible },
  ];

  const handleMoodSubmit = () => {
    if (selectedMood && user) {
      const newEntry = {
        id: Date.now().toString(),
        userId: user.id,
        mood: selectedMood,
        date: new Date(),
      };
      addMoodEntry(newEntry);
      setSelectedMood(null);
    }
  };

  const getRecentEntries = () => {
    return moodEntries.slice(-7).reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            Track your daily mood to understand patterns
          </Text>
        </View>

        {/* Mood Selection */}
        <Card style={styles.moodCard}>
          <Text style={styles.cardTitle}>Select your current mood</Text>
          <View style={styles.moodOptions}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood === mood.value && styles.selectedMood,
                  { borderColor: mood.color },
                ]}
                onPress={() => setSelectedMood(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedMood && (
            <Button
              title="Save Mood"
              onPress={handleMoodSubmit}
              style={styles.saveButton}
            />
          )}
        </Card>

        {/* Recent Entries */}
        {getRecentEntries().length > 0 && (
          <Card style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.cardTitle}>Recent Entries</Text>
            </View>
            
            <View style={styles.historyList}>
              {getRecentEntries().map((entry, index) => {
                const mood = moodOptions.find(m => m.value === entry.mood);
                return (
                  <View key={entry.id} style={styles.historyItem}>
                    <View style={styles.historyDate}>
                      <Text style={styles.historyDateText}>
                        {entry.date.toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.historyMood}>
                      <Text style={styles.historyEmoji}>{mood?.emoji}</Text>
                      <Text style={styles.historyLabel}>{mood?.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        )}

        {/* Mood Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Mood Insights</Text>
          <Text style={styles.insightText}>
            Regular mood tracking helps identify patterns and triggers. 
            Consider noting what activities or events influence your mood.
          </Text>
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
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 16,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedMood: {
    borderWidth: 3,
    backgroundColor: Colors.surfaceLight,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 10,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  historyDate: {
    flex: 1,
  },
  historyDateText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  historyMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyEmoji: {
    fontSize: 20,
  },
  historyLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  insightsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  insightText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.relaxed * Fonts.sizes.base,
  },
});