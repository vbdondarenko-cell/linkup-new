/**
 * LinkUp Design System 2026
 * Description Step - Add event details
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/typography';
import { TextInput as LinkUpInput } from '../../../../ui/components/inputs';
import type { CreateEventData } from '../../flow/create-event-flow';

interface DescriptionStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 1000;

export const DescriptionStep: React.FC<DescriptionStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [title, setTitle] = useState(data.description?.title ?? '');
  const [body, setBody] = useState(data.description?.body ?? '');
  const [requirements, setRequirements] = useState(
    data.description?.requirements?.join('\n') ?? ''
  );
  const [price, setPrice] = useState(data.description?.price ?? '');
  const [language, setLanguage] = useState(data.description?.language ?? 'English');

  const handleUpdate = useCallback(
    (updates: Partial<CreateEventData['description']>) => {
      const descriptionData = {
        ...data.description,
        ...updates,
        requirements: requirements
          ? requirements.split('\n').filter((r) => r.trim())
          : undefined,
        price: price || undefined,
        language: language || undefined,
      };
      onUpdate({ description: descriptionData });

      // Auto-complete if title and body are filled
      if (descriptionData.title && descriptionData.body) {
        onComplete({ description: descriptionData });
      }
    },
    [data.description, requirements, price, language, onUpdate, onComplete]
  );

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        Describe your event 📝
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Add details to help people understand what to expect
      </Text>

      {/* Event Title */}
      <Animated.View entering={FadeIn.delay(0)} style={styles.field}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text.secondary },
          ]}
        >
          Event Title *
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: errors.title ? theme.colors.status.danger.DEFAULT : theme.colors.border.default,
            },
          ]}
        >
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              handleUpdate({ title: text });
            }}
            placeholder="Give your event a catchy title"
            placeholderTextColor={theme.colors.text.placeholder}
            maxLength={TITLE_MAX_LENGTH}
            style={[
              styles.input,
              { color: theme.colors.text.primary },
            ]}
          />
        </View>
        <Text
          style={[
            styles.charCount,
            { color: theme.colors.text.tertiary },
          ]}
        >
          {title.length}/{TITLE_MAX_LENGTH}
        </Text>
      </Animated.View>

      {/* Description */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.field}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text.secondary },
          ]}
        >
          Description *
        </Text>
        <View
          style={[
            styles.textAreaContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: errors.body ? theme.colors.status.danger.DEFAULT : theme.colors.border.default,
            },
          ]}
        >
          <TextInput
            value={body}
            onChangeText={(text) => {
              setBody(text);
              handleUpdate({ body: text });
            }}
            placeholder="Tell people what your event is about, what they should bring, and what to expect..."
            placeholderTextColor={theme.colors.text.placeholder}
            maxLength={DESCRIPTION_MAX_LENGTH}
            multiline
            textAlignVertical="top"
            style={[
              styles.textArea,
              { color: theme.colors.text.primary },
            ]}
          />
        </View>
        <Text
          style={[
            styles.charCount,
            { color: theme.colors.text.tertiary },
          ]}
        >
          {body.length}/{DESCRIPTION_MAX_LENGTH}
        </Text>
      </Animated.View>

      {/* Price */}
      <Animated.View entering={FadeIn.delay(200)} style={styles.field}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text.secondary },
          ]}
        >
          Price (Optional)
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              handleUpdate({ price: text });
            }}
            placeholder="0.00"
            placeholderTextColor={theme.colors.text.placeholder}
            keyboardType="decimal-pad"
            style={[
              styles.input,
              styles.priceInput,
              { color: theme.colors.text.primary },
            ]}
          />
          <Text
            style={[
              styles.priceLabel,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {price === '' || price === '0' || price === '0.00'
              ? 'Free'
              : 'per person'}
          </Text>
        </View>
      </Animated.View>

      {/* Language */}
      <Animated.View entering={FadeIn.delay(300)} style={styles.field}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text.secondary },
          ]}
        >
          Language (Optional)
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <Text style={styles.inputIcon}>🗣️</Text>
          <TextInput
            value={language}
            onChangeText={(text) => {
              setLanguage(text);
              handleUpdate({ language: text });
            }}
            placeholder="English"
            placeholderTextColor={theme.colors.text.placeholder}
            style={[
              styles.input,
              { color: theme.colors.text.primary },
            ]}
          />
        </View>
      </Animated.View>

      {/* Requirements */}
      <Animated.View entering={FadeIn.delay(400)} style={styles.field}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text.secondary },
          ]}
        >
          What to Bring (Optional)
        </Text>
        <View
          style={[
            styles.textAreaContainer,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <TextInput
            value={requirements}
            onChangeText={(text) => {
              setRequirements(text);
              handleUpdate({ requirements: text.split('\n').filter((r) => r.trim()) });
            }}
            placeholder="One item per line, e.g.:&#10;Comfortable shoes&#10;Water bottle&#10;Notebook"
            placeholderTextColor={theme.colors.text.placeholder}
            multiline
            textAlignVertical="top"
            style={[
              styles.textArea,
              styles.requirementsArea,
              { color: theme.colors.text.primary },
            ]}
          />
        </View>
      </Animated.View>

      {/* Tips */}
      <Animated.View
        entering={FadeIn.delay(500)}
        style={[
          styles.tips,
          {
            backgroundColor: theme.colors.status.info.bg,
            borderColor: theme.colors.status.info.border,
          },
        ]}
      >
        <Text style={styles.tipsIcon}>💡</Text>
        <View style={styles.tipsContent}>
          <Text
            style={[
              styles.tipsTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Great descriptions get more attendees
          </Text>
          <Text
            style={[
              styles.tipsText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Include what makes your event unique and what attendees will gain from joining.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing[6],
  },
  field: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: spacing[1],
    color: '#666',
  },
  priceInput: {
    textAlign: 'right',
  },
  priceLabel: {
    fontSize: 13,
    marginLeft: spacing[2],
  },
  textAreaContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing[3],
  },
  textArea: {
    fontSize: 16,
    minHeight: 120,
  },
  requirementsArea: {
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: spacing[1],
  },
  tips: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

DescriptionStep.displayName = 'DescriptionStep';
