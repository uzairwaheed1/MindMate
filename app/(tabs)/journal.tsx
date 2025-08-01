import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Save } from 'lucide-react-native';
import { Colors, Fonts } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function DailyMoodJournalScreen() {
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [savedEntries, setSavedEntries] = useState<Array<{
    id: string;
    date: Date;
    entry: string;
  }>>([]);

  const handleSaveEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        entry: journalEntry.trim(),
      };
      setSavedEntries([newEntry, ...savedEntries]);
      setJournalEntry('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Journal</Text>
          <Text style={styles.subtitle}>
            Express your thoughts and feelings
          </Text>
        </View>

        {/* Journal Entry Card */}
        <Card style={styles.journalCard}>
          <View style={styles.dateHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </View>

          <TextInput
            style={styles.journalInput}
            value={journalEntry}
            onChangeText={setJournalEntry}
            placeholder="How are you feeling today? What's on your mind?"
            placeholderTextColor={Colors.textLight}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.journalFooter}>
            <Text style={styles.characterCount}>
              {journalEntry.length}/1000
            </Text>
            <Button
              title="Save Entry"
              onPress={handleSaveEntry}
              disabled={!journalEntry.trim()}
              size="sm"
            />
          </View>
        </Card>

        {/* Journal Prompts */}
        <Card style={styles.promptsCard}>
          <Text style={styles.cardTitle}>Journal Prompts</Text>
          <View style={styles.promptsList}>
            {[
              "What am I grateful for today?",
              "What challenged me today and how did I handle it?",
              "What made me smile today?",
              "How did I take care of myself today?",
              "What would I like to improve tomorrow?",
            ].map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptItem}
                onPress={() => setJournalEntry(prompt + '\n\n')}
              >
                <Text style={styles.promptText}>• {prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Recent Entries */}
        {savedEntries.length > 0 && (
          <Card style={styles.historyCard}>
            <Text style={styles.cardTitle}>Recent Entries</Text>
            <View style={styles.entriesList}>
              {savedEntries.slice(0, 3).map((entry) => (
                <View key={entry.id} style={styles.entryItem}>
                  <Text style={styles.entryDate}>
                    {entry.date.toLocaleDateString()}
                  </Text>
                  <Text style={styles.entryPreview} numberOfLines={2}>
                    {entry.entry}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Benefits Card */}
        <Card style={styles.benefitsCard}>
          <Text style={styles.cardTitle}>Benefits of Journaling</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Reduces stress and anxiety</Text>
            <Text style={styles.benefitItem}>• Improves emotional awareness</Text>
            <Text style={styles.benefitItem}>• Enhances problem-solving skills</Text>
            <Text style={styles.benefitItem}>• Boosts mood and well-being</Text>
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
  journalCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginLeft: 8,
  },
  journalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    minHeight: 150,
    marginBottom: 16,
  },
  journalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
  promptsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 16,
  },
  promptsList: {
    gap: 12,
  },
  promptItem: {
    paddingVertical: 8,
  },
  promptText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
  historyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  entriesList: {
    gap: 16,
  },
  entryItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  entryDate: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginBottom: 4,
  },
  entryPreview: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
  benefitsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
  },
});