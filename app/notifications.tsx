import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Clock, Moon } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';

export default function NotificationSettingsScreen() {
  const { notificationSettings, updateNotificationSettings } = useStore();

  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleToggleDailyReminder = (value: boolean) => {
    updateNotificationSettings({ dailyReminder: value });
  };

  const handleToggleSleepReminder = (value: boolean) => {
    updateNotificationSettings({ sleepReminder: value });
  };

  const handleReminderTimeChange = (time: string) => {
    updateNotificationSettings({ reminderTime: time });
  };

  const handleSleepReminderTimeChange = (time: string) => {
    updateNotificationSettings({ sleepReminderTime: time });
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
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Manage your reminder settings
          </Text>
        </View>

        {/* Daily Mood Reminder */}
        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Bell size={24} color={Colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Mood Check-in</Text>
              <Text style={styles.settingDescription}>
                Get reminded to track your mood daily
              </Text>
            </View>
            <Switch
              value={notificationSettings.dailyReminder}
              onValueChange={handleToggleDailyReminder}
              trackColor={{ false: Colors.borderLight, true: Colors.primary + '40' }}
              thumbColor={notificationSettings.dailyReminder ? Colors.primary : Colors.textLight}
            />
          </View>

          {notificationSettings.dailyReminder && (
            <View style={styles.timeSelector}>
              <View style={styles.timeSelectorHeader}>
                <Clock size={20} color={Colors.textSecondary} />
                <Text style={styles.timeSelectorTitle}>Reminder Time</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.timeOptions}
              >
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      notificationSettings.reminderTime === time && styles.selectedTimeOption,
                    ]}
                    onPress={() => handleReminderTimeChange(time)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      notificationSettings.reminderTime === time && styles.selectedTimeOptionText,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.reminderPreview}>
                "How are you feeling today?" at {notificationSettings.reminderTime}
              </Text>
            </View>
          )}
        </Card>

        {/* Sleep Reminder */}
        <Card style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingIcon}>
              <Moon size={24} color={Colors.primaryDark} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sleep Reminder</Text>
              <Text style={styles.settingDescription}>
                Get reminded to prepare for bedtime
              </Text>
            </View>
            <Switch
              value={notificationSettings.sleepReminder}
              onValueChange={handleToggleSleepReminder}
              trackColor={{ false: Colors.borderLight, true: Colors.primaryDark + '40' }}
              thumbColor={notificationSettings.sleepReminder ? Colors.primaryDark : Colors.textLight}
            />
          </View>

          {notificationSettings.sleepReminder && (
            <View style={styles.timeSelector}>
              <View style={styles.timeSelectorHeader}>
                <Clock size={20} color={Colors.textSecondary} />
                <Text style={styles.timeSelectorTitle}>Sleep Reminder Time</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.timeOptions}
              >
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      notificationSettings.sleepReminderTime === time && styles.selectedTimeOption,
                    ]}
                    onPress={() => handleSleepReminderTimeChange(time)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      notificationSettings.sleepReminderTime === time && styles.selectedTimeOptionText,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.reminderPreview}>
                "Time to wind down for better sleep" at {notificationSettings.sleepReminderTime}
              </Text>
            </View>
          )}
        </Card>

        {/* Notification Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Notification Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>
              • Regular check-ins help build healthy mental health habits
            </Text>
            <Text style={styles.tipItem}>
              • Choose times when you're typically free to reflect
            </Text>
            <Text style={styles.tipItem}>
              • You can always adjust these settings later
            </Text>
            <Text style={styles.tipItem}>
              • Notifications can be disabled from your device settings
            </Text>
          </View>
        </Card>

        {/* Privacy Note */}
        <Card style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Data</Text>
          <Text style={styles.privacyText}>
            All notification preferences are stored locally on your device. 
            We don't share your notification settings or timing preferences with third parties.
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
  settingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  timeSelector: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  timeSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSelectorTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: 8,
  },
  timeOptions: {
    marginBottom: 12,
  },
  timeOption: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
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
  reminderPreview: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 12,
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
  privacyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceLight,
  },
  privacyTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
  },
});