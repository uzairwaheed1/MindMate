import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ExternalLink, Phone, MessageCircle, Video, Heart } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function TherapyRecommendationScreen() {
  const therapyOptions = [
    {
      title: 'Crisis Hotlines',
      description: 'Immediate support for mental health emergencies',
      icon: Phone,
      color: Colors.error,
      items: [
        { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
        { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' },
      ],
    },
    {
      title: 'Online Therapy Platforms',
      description: 'Professional therapy from licensed therapists',
      icon: Video,
      color: Colors.primary,
      items: [
        { name: 'BetterHelp', description: 'Individual therapy sessions', url: 'https://betterhelp.com' },
        { name: 'Talkspace', description: 'Text and video therapy', url: 'https://talkspace.com' },
        { name: 'MDLIVE', description: 'Mental health consultations', url: 'https://mdlive.com' },
      ],
    },
    {
      title: 'Mental Health Apps',
      description: 'Self-guided tools and resources',
      icon: MessageCircle,
      color: Colors.secondary,
      items: [
        { name: 'Headspace', description: 'Meditation and mindfulness' },
        { name: 'Calm', description: 'Sleep stories and relaxation' },
        { name: 'Sanvello', description: 'Anxiety and mood tracking' },
      ],
    },
    {
      title: 'Support Groups',
      description: 'Connect with others who understand',
      icon: Heart,
      color: Colors.accent,
      items: [
        { name: 'NAMI Support Groups', description: 'National Alliance on Mental Illness' },
        { name: 'Depression and Bipolar Support Alliance', description: 'DBSA support groups' },
        { name: 'Anxiety and Depression Association', description: 'ADAA resources' },
      ],
    },
  ];

  const selfCareStrategies = [
    {
      title: 'Breathing Exercises',
      description: 'Practice deep breathing to reduce anxiety and stress',
      action: () => router.push('/breathing'),
    },
    {
      title: 'Mindfulness Meditation',
      description: 'Stay present and reduce overwhelming thoughts',
      action: () => {},
    },
    {
      title: 'Physical Exercise',
      description: 'Regular movement can improve mood and reduce stress',
      action: () => {},
    },
    {
      title: 'Sleep Hygiene',
      description: 'Establish healthy sleep patterns for better mental health',
      action: () => router.push('/sleep'),
    },
  ];

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number.replace(/[^0-9]/g, '')}`);
  };

  const handleOpenURL = (url: string) => {
    Linking.openURL(url);
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
          <Text style={styles.title}>Get Support</Text>
          <Text style={styles.subtitle}>
            Professional help and resources for your mental health
          </Text>
        </View>

        {/* Emergency Notice */}
        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Phone size={24} color={Colors.error} />
            <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
          </View>
          <Text style={styles.emergencyText}>
            If you're having thoughts of self-harm or suicide, please reach out immediately:
          </Text>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleCall('988')}
          >
            <Text style={styles.emergencyButtonText}>Call 988 - Suicide & Crisis Lifeline</Text>
          </TouchableOpacity>
        </Card>

        {/* Therapy Options */}
        {therapyOptions.map((category, index) => (
          <Card key={index} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <category.icon size={24} color={category.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>

            <View style={styles.categoryItems}>
              {category.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.categoryItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    )}
                    {item.available && (
                      <Text style={styles.itemAvailable}>Available: {item.available}</Text>
                    )}
                  </View>
                  
                  {item.number && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleCall(item.number)}
                    >
                      <Phone size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                  
                  {item.url && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleOpenURL(item.url)}
                    >
                      <ExternalLink size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Self-Care Strategies */}
        <Card style={styles.selfCareCard}>
          <Text style={styles.sectionTitle}>Self-Care Strategies</Text>
          <Text style={styles.sectionDescription}>
            While professional help is important, these strategies can help you manage day-to-day:
          </Text>

          <View style={styles.strategiesList}>
            {selfCareStrategies.map((strategy, index) => (
              <TouchableOpacity
                key={index}
                style={styles.strategyItem}
                onPress={strategy.action}
              >
                <View style={styles.strategyInfo}>
                  <Text style={styles.strategyTitle}>{strategy.title}</Text>
                  <Text style={styles.strategyDescription}>{strategy.description}</Text>
                </View>
                <ExternalLink size={20} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Additional Resources */}
        <Card style={styles.resourcesCard}>
          <Text style={styles.sectionTitle}>Remember</Text>
          <View style={styles.reminderList}>
            <Text style={styles.reminderItem}>
              • Seeking help is a sign of strength, not weakness
            </Text>
            <Text style={styles.reminderItem}>
              • Recovery is possible with the right support
            </Text>
            <Text style={styles.reminderItem}>
              • You don't have to face this alone
            </Text>
            <Text style={styles.reminderItem}>
              • Small steps forward are still progress
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
  emergencyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.error + '10',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
  emergencyButton: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.semiBold,
    color: Colors.surface,
  },
  categoryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  categoryItems: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  itemAvailable: {
    fontSize: Fonts.sizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  selfCareCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
  strategiesList: {
    gap: 12,
  },
  strategyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
  },
  strategyInfo: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  resourcesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  reminderList: {
    gap: 8,
  },
  reminderItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
});