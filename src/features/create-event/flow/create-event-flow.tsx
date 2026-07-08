/**
 * LinkUp Design System 2026
 * Create Event Flow - Multi-step event creation wizard
 */

'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ViewStyle,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { Progress } from '../../../ui/components/progress';

// Step Components
import { LocationStep } from '../steps/location/location-step';
import { CategoryStep } from '../steps/category/category-step';
import { DateStep } from '../steps/date/date-step';
import { TimeStep } from '../steps/time/time-step';
import { ParticipantsStep } from '../steps/participants/participants-step';
import { DescriptionStep } from '../steps/description/description-step';
import { PhotosStep } from '../steps/photos/photos-step';
import { SeriesStep } from '../steps/series/series-step';
import { EventPreview } from '../preview/event-preview';
import { PublishStep } from '../publish/publish-step';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Step Types
export type CreateEventStep =
  | 'location'
  | 'category'
  | 'date'
  | 'time'
  | 'participants'
  | 'description'
  | 'photos'
  | 'series'
  | 'preview'
  | 'publish';

export interface CreateEventData {
  // Location
  location?: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };

  // Category
  category?: {
    id: string;
    label: string;
    icon: string;
  };

  // Date
  date?: {
    start: Date;
    end?: Date;
    isAllDay: boolean;
  };

  // Time
  time?: {
    startTime: string;
    endTime: string;
    duration?: string;
  };

  // Participants
  participants?: {
    min: number;
    max: number;
    isLimited: boolean;
  };

  // Description
  description?: {
    title: string;
    body: string;
    requirements?: string[];
    price?: string;
    language?: string;
  };

  // Photos
  photos?: string[];

  // Series
  series?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval?: number;
    endDate?: Date;
    daysOfWeek?: number[];
  };
}

interface CreateEventFlowProps {
  initialData?: Partial<CreateEventData>;
  draftId?: string;
  onComplete: (data: CreateEventData) => void;
  onCancel: () => void;
  onSaveDraft?: (data: CreateEventData) => void;
  style?: ViewStyle;
}

// Step Configuration
const STEPS: { id: CreateEventStep; label: string; icon: string; required: boolean }[] = [
  { id: 'location', label: 'Location', icon: '📍', required: true },
  { id: 'category', label: 'Category', icon: '🏷️', required: true },
  { id: 'date', label: 'Date', icon: '📅', required: true },
  { id: 'time', label: 'Time', icon: '⏰', required: true },
  { id: 'participants', label: 'People', icon: '👥', required: true },
  { id: 'description', label: 'Details', icon: '📝', required: true },
  { id: 'photos', label: 'Photos', icon: '📷', required: false },
  { id: 'series', label: 'Repeat', icon: '🔄', required: false },
  { id: 'preview', label: 'Preview', icon: '👁️', required: false },
  { id: 'publish', label: 'Publish', icon: '🚀', required: false },
];

// Get current step index
const getStepIndex = (step: CreateEventStep): number => {
  return STEPS.findIndex((s) => s.id === step);
};

// Check if step is complete
const isStepComplete = (step: CreateEventStep, data: CreateEventData): boolean => {
  switch (step) {
    case 'location':
      return !!data.location;
    case 'category':
      return !!data.category;
    case 'date':
      return !!data.date;
    case 'time':
      return !!data.time;
    case 'participants':
      return !!data.participants;
    case 'description':
      return !!data.description?.title && !!data.description?.body;
    case 'photos':
      return true; // Optional
    case 'series':
      return true; // Optional
    case 'preview':
    case 'publish':
      return true;
    default:
      return false;
  }
};

export const CreateEventFlow: React.FC<CreateEventFlowProps> = ({
  initialData = {},
  draftId,
  onComplete,
  onCancel,
  onSaveDraft,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scrollRef = useRef<ScrollView>(null);

  // State
  const [currentStep, setCurrentStep] = useState<CreateEventStep>('location');
  const [data, setData] = useState<CreateEventData>(initialData as CreateEventData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const currentStepIndex = getStepIndex(currentStep);
  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < STEPS.length - 1;

  // Progress
  const completedSteps = STEPS.filter((step) => isStepComplete(step.id, data));
  const progress = (completedSteps.length / STEPS.length) * 100;

  // Update data
  const updateData = useCallback((updates: Partial<CreateEventData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setValidationErrors({});
  }, []);

  // Navigation
  const goToStep = useCallback(
    (step: CreateEventStep) => {
      haptics.selection();
      setCurrentStep(step);
    },
    [haptics]
  );

  const goNext = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      
      // Validate current step
      if (STEPS[currentIndex].required && !isStepComplete(currentStep, data)) {
        haptics.error();
        setValidationErrors({ [currentStep]: 'This field is required' });
        return;
      }

      haptics.selection();
      setCurrentStep(nextStep.id);
    }
  }, [currentStep, data, haptics]);

  const goBack = useCallback(() => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEPS[currentIndex - 1];
      haptics.selection();
      setCurrentStep(prevStep.id);
    }
  }, [currentStep, haptics]);

  // Handle step completion
  const handleStepComplete = useCallback(
    (stepData: Partial<CreateEventData>) => {
      updateData(stepData);
      if (canGoForward) {
        goNext();
      }
    },
    [updateData, canGoForward, goNext]
  );

  // Handle publish
  const handlePublish = useCallback(() => {
    haptics.success();
    onComplete(data);
  }, [haptics, onComplete, data]);

  // Handle save draft
  const handleSaveDraft = useCallback(() => {
    onSaveDraft?.(data);
  }, [onSaveDraft, data]);

  // Render current step
  const renderStep = () => {
    const stepProps = {
      data,
      onUpdate: updateData,
      onComplete: handleStepComplete,
      errors: validationErrors,
    };

    switch (currentStep) {
      case 'location':
        return <LocationStep {...stepProps} />;
      case 'category':
        return <CategoryStep {...stepProps} />;
      case 'date':
        return <DateStep {...stepProps} />;
      case 'time':
        return <TimeStep {...stepProps} />;
      case 'participants':
        return <ParticipantsStep {...stepProps} />;
      case 'description':
        return <DescriptionStep {...stepProps} />;
      case 'photos':
        return <PhotosStep {...stepProps} />;
      case 'series':
        return <SeriesStep {...stepProps} />;
      case 'preview':
        return <EventPreview data={data} />;
      case 'publish':
        return <PublishStep data={data} onPublish={handlePublish} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.colors.surface.tertiary },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: theme.colors.interactive.primary,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {completedSteps.length} of {STEPS.length} completed
          </Text>
        </View>

        {/* Step Indicator */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepsContainer}
        >
          {STEPS.map((step, index) => {
            const isCurrentStep = step.id === currentStep;
            const isCompleted = isStepComplete(step.id, data);
            const isAccessible = index <= currentStepIndex || isCompleted;

            return (
              <Animated.View
                key={step.id}
                entering={FadeIn.delay(index * 30)}
                style={[
                  styles.stepItem,
                  isCurrentStep && [
                    styles.stepItemActive,
                    { borderBottomColor: theme.colors.interactive.primary },
                  ],
                ]}
              >
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isCompleted
                        ? theme.colors.interactive.primary
                        : isCurrentStep
                        ? theme.colors.interactive.primary
                        : theme.colors.surface.tertiary,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Text style={styles.stepCheck}>✓</Text>
                  ) : (
                    <Text style={styles.stepIcon}>{step.icon}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: isCurrentStep
                        ? theme.colors.text.primary
                        : theme.colors.text.tertiary,
                      fontWeight: isCurrentStep ? fontWeight.semibold : fontWeight.normal,
                    },
                  ]}
                >
                  {step.label}
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={currentStep}
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={styles.stepContent}
        >
          {renderStep()}
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface.primary }]}>
        {/* Back */}
        {canGoBack && (
          <Button
            variant="tertiary"
            onPress={goBack}
            style={styles.backButton}
          >
            ← Back
          </Button>
        )}

        {/* Save Draft */}
        <Button
          variant="ghost"
          size="sm"
          onPress={handleSaveDraft}
          style={styles.draftButton}
        >
          Save Draft
        </Button>

        {/* Next/Publish */}
        {currentStep !== 'publish' ? (
          <Button
            variant="primary"
            onPress={goNext}
            style={styles.nextButton}
            disabled={STEPS[currentStepIndex].required && !isStepComplete(currentStep, data)}
          >
            {canGoForward ? 'Next →' : 'Preview'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onPress={handlePublish}
            style={styles.nextButton}
          >
            🚀 Publish Event
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  progressContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  stepsContainer: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  stepItem: {
    alignItems: 'center',
    paddingBottom: spacing[2],
  },
  stepItemActive: {
    borderBottomWidth: 2,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  stepIcon: {
    fontSize: 14,
  },
  stepCheck: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 11,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
  },
  stepContent: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {},
  draftButton: {},
  nextButton: {
    minWidth: 140,
  },
});

CreateEventFlow.displayName = 'CreateEventFlow';
