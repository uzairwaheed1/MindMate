import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Moon, Sun, Clock, TrendingUp } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

export default function SleepTrackerScreen() {
  const [bedtime, setBedtime] = useState<Date | null>(null);
  const [wakeTime, setWakeTime] = useState<Date | null>(null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(null);
  const { sleepEntries, addSleepEntry, user } = useStore();

  const qualityOptions = [
    { value: 1, label: 'Poor', emoji: '😴', color: Colors.error },
    { value: 2, label: 'Fair', emoji: '😐', color: Colors.warning },
    { value: 3, label: 'Good', emoji: '🙂', color: Colors.mood.okay },
    { value: 4, label: 'Great', emoji: '😊', color: Colors.mood.good },
    { value: 5, label: 'Excellent', emoji: '🌟', color: Colors.success },
  ];

  const timeSlots = [
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
    '23:00', '23:30', '00:00', '00:30', '01:00', '01:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30'
  ];

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2024-01-01 ${bedtime}`);
    let wake = new Date(`2024-01-01 ${wakeTime}`);
    
    // If wake time is earlier than bedtime, it's the next day
    if (wake < bed) {
      wake = new Date(`2024-01-02 ${wakeTime}`);
    }
    
    const diff = wake.getTime() - bed.getTime();
    const hours = diff / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10;
  };

  const handleSaveSleep = () => {
    if (bedtime && wakeTime && sleepQuality && user) {
      const duration = calculateDuration(
        bedtime.toTimeString().slice(0, 5),
        wakeTime.toTimeString().slice(0, 5)
      );

      const sleepEntry = {
        id: Date.now().toString(),
        userId: user.id,
        bedtime,
        wakeTime,
        duration,
        quality: sleepQuality,
        date: new Date(),
      };

      addSleepEntry(sleepEntry);
      
      // Reset form
      setBedtime(null);
      setWakeTime(null);
      setSleepQuality(null);
    }
  };

  const getRecentEntries = () => {
    return sleepEntries.slice(-7).reverse();
  };

  const getAverageSleep = () => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round((total / sleepEntries.length) * 10) / 10;
  };

  const getAverageQuality = () => {
    if (sleepEntries.length === 0) return 0;
    const total = sleepEntries.reduce((sum, entry) => sum + entry.quality, 0);
    return Math.round((total / sleepEntries.length) * 10) / 10;
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
          <Text style={styles.title}>Sleep Tracker</Text>
          <Text style={styles.subtitle}>
            Monitor your sleep patterns for better rest
          </Text>
        </View>

        {/* Sleep Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Sleep Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{getAverageSleep()}h</Text>
              <Text style={styles.statLabel}>Avg Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <TrendingUp size={24} color={Colors.success} />
              <Text style={styles.statNumber}>{getAverageQuality()}/5</Text>
              <Text style={styles.statLabel}>Avg Quality</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Moon size={24} color={Colors.primaryDark} />
              <Text style={styles.statNumber}>{sleepEntries.length}</Text>
              <Text style={styles.statLabel}>Nights Tracked</Text>
            </View>
          </View>
        </Card>

        {/* Log Sleep */}
        <Card style={styles.logCard}>
          <Text style={styles.cardTitle}>Log Last Night's Sleep</Text>

          {/* Bedtime Selection */}
          <View style={styles.timeSection}>
            <View style={styles.timeSectionHeader}>
              <Moon size={20} color={Colors.primaryDark} />
              <Text style={styles.timeSectionTitle}>Bedtime</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timeOptions}
            >
              {timeSlots.slice(0, 12).map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    bedtime?.toTimeString().slice(0, 5) === time && styles.selectedTimeOption,
                  ]}
                  onPress={() => setBedtime(new Date(`2024-01-01 ${time}`))}
                >
                  <Text style={[
                    styles.timeOptionText,
                    bedtime?.toTimeString().slice(0, 5) === time && styles.selectedTimeOptionText,
                  ]}>
                    {formatTime(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Wake Time Selection */}
          <View style={styles.timeSection}>
            <View style={styles.timeSectionHeader}>
              <Sun size={20} color={Colors.warning} />
              <Text style={styles.timeSectionTitle}>Wake Time</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timeOptions}
            >
              {timeSlots.slice(12).map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    wakeTime?.toTimeString().slice(0, 5) === time && styles.selectedTimeOption,
                  ]}
                  onPress={() => setWakeTime(new Date(`2024-01-01 ${time}`))}
                >
                  <Text style={[
                    styles.timeOptionText,
                    wakeTime?.toTimeString().slice(0, 5) === time && styles.selectedTimeOptionText,
                  ]}>
                    {formatTime(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sleep Quality */}
          <View style={styles.qualitySection}>
            <Text style={styles.qualityTitle}>How was your sleep quality?</Text>
            <View style={styles.qualityOptions}>
              {qualityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    sleepQuality === option.value && styles.selectedQualityOption,
                    { borderColor: option.color },
                  ]}
                  onPress={() => setSleepQuality(option.value)}
                >
                  <Text style={styles.qualityEmoji}>{option.emoji}</Text>
                  <Text style={styles.qualityLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duration Display */}
          {bedtime && wakeTime && (
            <View style={styles.durationDisplay}>
              <Text style={styles.durationText}>
                Sleep Duration: {calculateDuration(
                  bedtime.toTimeString().slice(0, 5),
                  wakeTime.toTimeString().slice(0, 5)
                )} hours
              </Text>
            </View>
          )}

          <Button
            title="Save Sleep Log"
            onPress={handleSaveSleep}
            disabled={!bedtime || !wakeTime || !sleepQuality}
            style={styles.saveButton}
          />
        </Card>

        {/* Recent Entries */}
        {getRecentEntries().length > 0 && (
          <Card style={styles.historyCard}>
            <Text style={styles.cardTitle}>Recent Sleep</Text>
            <View style={styles.historyList}>
              {getRecentEntries().map((entry, index) => (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>
                      {entry.date.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyDuration}>
                      {entry.duration}h
                    </Text>
                    <Text style={styles.historyQuality}>
                      {qualityOptions.find(q => q.value === entry.quality)?.emoji} 
                      {qualityOptions.find(q => q.value === entry.quality)?.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Sleep Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.cardTitle}>Sleep Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>
              • Aim for 7-9 hours of sleep per night
            </Text>
            <Text style={styles.tipItem}>
              • Keep a consistent sleep schedule
            </Text>
            <Text style={styles.tipItem}>
              • Avoid screens 1 hour before bedtime
            </Text>
            <Text style={styles.tipItem}>
              • Create a relaxing bedtime routine
            </Text>
            <Text style={styles.tipItem}>
              • Keep your bedroom cool and dark
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
  statsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Fonts.sizes['2xl'],
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  logCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  timeSection: {
    marginBottom: 24,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSectionTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: 8,
  },
  timeOptions: {
    marginBottom: 8,
  },
  timeOption: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedTimeOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  selectedTimeOptionText: {
    color: Colors.surface,
  },
  qualitySection: {
    marginBottom: 24,
  },
  qualityTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  qualityOption: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedQualityOption: {
    borderWidth: 3,
    backgroundColor: Colors.surfaceLight,
  },
  qualityEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  qualityLabel: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  durationDisplay: {
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  durationText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 8,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  historyDetails: {
    alignItems: 'flex-end',
  },
  historyDuration: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  historyQuality: {
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