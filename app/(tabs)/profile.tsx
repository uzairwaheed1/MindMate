import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Brain, Moon, Target } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export default function ProfileScreen() {
  const { user, setAuthenticated, setUser } = useStore();

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
    router.replace('/login');
  };

  const profileSections = [
    {
      title: 'Mental Health Tools',
      items: [
        {
          icon: Brain,
          title: 'Mental Wellness Quiz',
          subtitle: 'Check your mental state',
          onPress: () => router.push('/quiz'),
        },
        {
          icon: Moon,
          title: 'Sleep Tracker',
          subtitle: 'Monitor your sleep patterns',
          onPress: () => router.push('/sleep'),
        },
        {
          icon: Target,
          title: 'Goals & Habits',
          subtitle: 'Track your progress',
          onPress: () => router.push('/goals'),
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          icon: Bell,
          title: 'Notifications',
          subtitle: 'Manage your reminders',
          onPress: () => router.push('/notifications'),
        },
        {
          icon: Settings,
          title: 'App Settings',
          subtitle: 'Customize your experience',
          onPress: () => {},
        },
        {
          icon: Shield,
          title: 'Privacy & Security',
          subtitle: 'Manage your data',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & Support',
          subtitle: 'Get help when you need it',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User size={32} color={Colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.fullName || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
          
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Journal Entries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8.2</Text>
              <Text style={styles.statLabel}>Avg Mood</Text>
            </View>
          </View>
        </Card>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <item.icon size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.menuContent}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>MindMate AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileCard: {
    margin: 20,
    marginBottom: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Fonts.sizes.xl,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  profileStats: {
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionCard: {
    marginHorizontal: 20,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
});