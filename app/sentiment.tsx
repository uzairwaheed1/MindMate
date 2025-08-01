import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Upload, ArrowLeft, Smile, Frown, Meh } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function SentimentAnalysisScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    emotion: string;
    confidence: number;
    suggestions: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
    }
  };

  const analyzeEmotion = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    // Simulate emotion analysis
    setTimeout(() => {
      const emotions = [
        {
          emotion: 'Happy',
          confidence: 85,
          suggestions: [
            'Great to see you smiling! Keep up the positive energy.',
            'Consider journaling about what made you happy today.',
            'Share your joy with friends or family.',
          ],
        },
        {
          emotion: 'Sad',
          confidence: 78,
          suggestions: [
            'It\'s okay to feel sad sometimes. Your emotions are valid.',
            'Try some deep breathing exercises or meditation.',
            'Consider talking to someone you trust about how you\'re feeling.',
            'If sadness persists, consider speaking with a mental health professional.',
          ],
        },
        {
          emotion: 'Neutral',
          confidence: 72,
          suggestions: [
            'You seem calm and balanced today.',
            'This is a good time for reflection or planning.',
            'Consider setting some positive intentions for the day.',
          ],
        },
        {
          emotion: 'Anxious',
          confidence: 80,
          suggestions: [
            'Take some deep breaths and try to ground yourself.',
            'Practice the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
            'Consider doing some light exercise or stretching.',
            'If anxiety is overwhelming, please reach out to a mental health professional.',
          ],
        },
      ];

      const randomResult = emotions[Math.floor(Math.random() * emotions.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return <Smile size={32} color={Colors.success} />;
      case 'sad':
        return <Frown size={32} color={Colors.error} />;
      case 'anxious':
        return <Frown size={32} color={Colors.warning} />;
      default:
        return <Meh size={32} color={Colors.textSecondary} />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return Colors.success;
      case 'sad':
        return Colors.error;
      case 'anxious':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
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
          <Text style={styles.title}>Sentiment Analysis</Text>
          <Text style={styles.subtitle}>
            Analyze your emotions through facial recognition
          </Text>
        </View>

        {/* Image Selection */}
        <Card style={styles.imageCard}>
          <Text style={styles.cardTitle}>Select or Take a Photo</Text>
          
          {selectedImage ? (
            <View style={styles.imagePreview}>
              <Text style={styles.imageSelectedText}>Image selected ✓</Text>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={48} color={Colors.textLight} />
              <Text style={styles.placeholderText}>
                No image selected
              </Text>
            </View>
          )}

          <View style={styles.imageButtons}>
            <Button
              title="Take Photo"
              onPress={takePhoto}
              variant="outline"
              style={styles.imageButton}
            />
            <Button
              title="Upload Image"
              onPress={pickImage}
              variant="outline"
              style={styles.imageButton}
            />
          </View>

          {selectedImage && (
            <Button
              title={isAnalyzing ? "Analyzing..." : "Analyze Emotion"}
              onPress={analyzeEmotion}
              disabled={isAnalyzing}
              style={styles.analyzeButton}
            />
          )}
        </Card>

        {/* Analysis Result */}
        {analysisResult && (
          <Card style={styles.resultCard}>
            <Text style={styles.cardTitle}>Analysis Result</Text>
            
            <View style={styles.emotionResult}>
              {getEmotionIcon(analysisResult.emotion)}
              <View style={styles.emotionInfo}>
                <Text style={[
                  styles.emotionName,
                  { color: getEmotionColor(analysisResult.emotion) }
                ]}>
                  {analysisResult.emotion}
                </Text>
                <Text style={styles.confidenceText}>
                  {analysisResult.confidence}% confidence
                </Text>
              </View>
            </View>

            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggestions:</Text>
              {analysisResult.suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestionItem}>
                  • {suggestion}
                </Text>
              ))}
            </View>

            {analysisResult.emotion.toLowerCase() === 'sad' || 
             analysisResult.emotion.toLowerCase() === 'anxious' ? (
              <Button
                title="Get Therapy Recommendations"
                onPress={() => router.push('/therapy')}
                variant="secondary"
                style={styles.therapyButton}
              />
            ) : null}
          </Card>
        )}

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>How it Works</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              • Take a selfie or upload a photo
            </Text>
            <Text style={styles.infoItem}>
              • Our AI analyzes facial expressions
            </Text>
            <Text style={styles.infoItem}>
              • Get personalized suggestions based on your mood
            </Text>
            <Text style={styles.infoItem}>
              • Track your emotional patterns over time
            </Text>
          </View>
          
          <Text style={styles.privacyNote}>
            🔒 Your photos are processed locally and never stored or shared.
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
  imageCard: {
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
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
  },
  imagePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
  },
  imageSelectedText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.success,
  },
  placeholderText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 12,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
  },
  analyzeButton: {
    marginTop: 8,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  emotionResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emotionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  emotionName: {
    fontSize: Fonts.sizes['2xl'],
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  suggestions: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 12,
  },
  suggestionItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
    marginBottom: 8,
  },
  therapyButton: {
    marginTop: 8,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoList: {
    marginBottom: 16,
  },
  infoItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
    marginBottom: 8,
  },
  privacyNote: {
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    textAlign: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
  },
});