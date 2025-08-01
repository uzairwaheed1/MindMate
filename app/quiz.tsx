import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Brain, CircleAlert as AlertCircle, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Colors, Fonts } from '../constants';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

interface Question {
  id: number;
  text: string;
  options: { value: number; text: string }[];
}

export default function MentalWellnessQuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    level: 'Normal' | 'Moderate' | 'Critical';
    description: string;
    recommendations: string[];
  } | null>(null);
  
  const { addQuizResult, user } = useStore();

  const questions: Question[] = [
    {
      id: 1,
      text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 2,
      text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 3,
      text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 4,
      text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 5,
      text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 6,
      text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
    {
      id: 7,
      text: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?",
      options: [
        { value: 0, text: "Not at all" },
        { value: 1, text: "Several days" },
        { value: 2, text: "More than half the days" },
        { value: 3, text: "Nearly every day" },
      ],
    },
  ];

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    let level: 'Normal' | 'Moderate' | 'Critical';
    let description: string;
    let recommendations: string[];

    if (percentage <= 30) {
      level = 'Normal';
      description = 'Your responses suggest you\'re managing well overall. Keep up the good work with your mental health practices.';
      recommendations = [
        'Continue with regular self-care practices',
        'Maintain social connections',
        'Keep up with physical exercise',
        'Practice gratitude and mindfulness',
      ];
    } else if (percentage <= 60) {
      level = 'Moderate';
      description = 'Your responses suggest you may be experiencing some challenges. Consider implementing additional coping strategies.';
      recommendations = [
        'Try stress-reduction techniques like meditation',
        'Establish a regular sleep schedule',
        'Consider talking to a counselor or therapist',
        'Engage in regular physical activity',
        'Practice deep breathing exercises',
      ];
    } else {
      level = 'Critical';
      description = 'Your responses suggest you may be experiencing significant challenges. We strongly recommend seeking professional support.';
      recommendations = [
        'Contact a mental health professional immediately',
        'Reach out to trusted friends or family members',
        'Consider calling a mental health helpline',
        'Avoid making major life decisions right now',
        'Focus on basic self-care: eating, sleeping, hygiene',
      ];
    }

    const quizResult = {
      score: totalScore,
      level,
      description,
      recommendations,
    };

    setResult(quizResult);
    setQuizCompleted(true);

    // Save to store
    if (user) {
      addQuizResult({
        id: Date.now().toString(),
        userId: user.id,
        score: totalScore,
        level,
        date: new Date(),
      });
    }
  };

  const getResultIcon = () => {
    if (!result) return null;
    
    switch (result.level) {
      case 'Normal':
        return <CheckCircle size={48} color={Colors.success} />;
      case 'Moderate':
        return <AlertTriangle size={48} color={Colors.warning} />;
      case 'Critical':
        return <AlertCircle size={48} color={Colors.error} />;
    }
  };

  const getResultColor = () => {
    if (!result) return Colors.text;
    
    switch (result.level) {
      case 'Normal':
        return Colors.success;
      case 'Moderate':
        return Colors.warning;
      case 'Critical':
        return Colors.error;
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setResult(null);
  };

  if (quizCompleted && result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Quiz Results</Text>
          </View>

          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              {getResultIcon()}
              <Text style={[styles.resultLevel, { color: getResultColor() }]}>
                {result.level}
              </Text>
              <Text style={styles.resultScore}>
                Score: {result.score}/{questions.length * 3}
              </Text>
            </View>

            <Text style={styles.resultDescription}>
              {result.description}
            </Text>

            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              {result.recommendations.map((rec, index) => (
                <Text key={index} style={styles.recommendationItem}>
                  • {rec}
                </Text>
              ))}
            </View>

            {result.level === 'Critical' && (
              <View style={styles.emergencyInfo}>
                <AlertCircle size={20} color={Colors.error} />
                <Text style={styles.emergencyText}>
                  If you're having thoughts of self-harm, please contact emergency services (911) or a crisis helpline immediately.
                </Text>
              </View>
            )}
          </Card>

          <View style={styles.actionButtons}>
            <Button
              title="Take Quiz Again"
              onPress={resetQuiz}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Get Support"
              onPress={() => router.push('/therapy')}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mental Wellness Quiz</Text>
        <Text style={styles.subtitle}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
          ]} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Brain size={24} color={Colors.primary} />
            <Text style={styles.questionNumber}>
              Question {currentQuestion + 1}
            </Text>
          </View>

          <Text style={styles.questionText}>
            {questions[currentQuestion].text}
          </Text>

          <View style={styles.options}>
            {questions[currentQuestion].options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  answers[currentQuestion] === option.value && styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelect(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  answers[currentQuestion] === option.value && styles.selectedOptionText,
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <View style={styles.navigationButtons}>
          {currentQuestion > 0 && (
            <Button
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              style={styles.navButton}
            />
          )}
          
          <Button
            title={currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            onPress={handleNext}
            disabled={answers[currentQuestion] === undefined}
            style={styles.navButton}
          />
        </View>
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
    fontSize: Fonts.sizes['2xl'],
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  questionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginLeft: 8,
  },
  questionText: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.text,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.lg,
    marginBottom: 24,
  },
  options: {
    gap: 12,
  },
  option: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  optionText: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontFamily: Fonts.medium,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultLevel: {
    fontSize: Fonts.sizes['3xl'],
    fontFamily: Fonts.bold,
    marginTop: 12,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  resultDescription: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
    marginBottom: 24,
    textAlign: 'center',
  },
  recommendations: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: Fonts.sizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 12,
  },
  recommendationItem: {
    fontSize: Fonts.sizes.base,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
    marginBottom: 8,
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.error + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  emergencyText: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.error,
    marginLeft: 8,
    lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});