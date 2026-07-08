/**
 * LinkUp Design System 2026
 * Message Composer - Chat input component
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MessageComposerProps {
  onSend: (message: string) => void;
  onAttach?: () => void;
  onLocation?: () => void;
  onPhoto?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  style?: ViewStyle;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  onAttach,
  onLocation,
  onPhoto,
  placeholder = 'Type a message...',
  disabled = false,
  maxLength = 1000,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const containerScale = useSharedValue(1);
  const sendScale = useSharedValue(0.8);
  const attachScale = useSharedValue(1);
  
  const hasText = text.trim().length > 0;
  
  // Update send button animation
  useEffect(() => {
    sendScale.value = withSpring(hasText && !disabled ? 1 : 0.8, {
      damping: 15,
      stiffness: 200,
    });
  }, [hasText, disabled, sendScale]);
  
  const handleTextChange = useCallback((newText: string) => {
    if (newText.length <= maxLength) {
      setText(newText);
    }
  }, [maxLength]);
  
  const handleSend = useCallback(() => {
    if (!hasText || disabled) return;
    
    haptics.light();
    onSend(text.trim());
    setText('');
    Keyboard.dismiss();
  }, [haptics, hasText, disabled, text, onSend]);
  
  const handleAttach = useCallback(() => {
    haptics.light();
    onAttach?.();
  }, [haptics, onAttach]);
  
  const handleLocation = useCallback(() => {
    haptics.light();
    onLocation?.();
  }, [haptics, onLocation]);
  
  const handlePhoto = useCallback(() => {
    haptics.light();
    onPhoto?.();
  }, [haptics, onPhoto]);
  
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [containerScale]);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));
  
  const sendButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
    opacity: hasText && !disabled ? 1 : 0.5,
  }));
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderTopColor: theme.colors.border.default,
        },
        containerAnimatedStyle,
        style,
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
          {/* Attachment Button */}
          <AnimatedPressable
            onPress={handleAttach}
            disabled={disabled}
            style={[
              styles.attachButton,
              {
                backgroundColor: theme.colors.surface.secondary,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <Text style={styles.attachIcon}>+</Text>
          </AnimatedPressable>
          
          {/* Attachment Options */}
          {onAttach && (
            <View style={styles.attachOptions}>
              <Pressable
                onPress={handlePhoto}
                style={[
                  styles.attachOption,
                  { backgroundColor: theme.colors.surface.secondary },
                ]}
              >
                <Text style={styles.attachOptionIcon}>📷</Text>
              </Pressable>
              <Pressable
                onPress={handleLocation}
                style={[
                  styles.attachOption,
                  { backgroundColor: theme.colors.surface.secondary },
                ]}
              >
                <Text style={styles.attachOptionIcon}>📍</Text>
              </Pressable>
            </View>
          )}
          
          {/* Input Container */}
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.colors.surface.secondary,
                borderColor: isFocused
                  ? theme.colors.interactive.primary
                  : 'transparent',
              },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.placeholder}
              multiline
              maxLength={maxLength}
              editable={!disabled}
              style={[
                styles.input,
                {
                  color: theme.colors.text.primary,
                },
              ]}
            />
            
            {/* Character Count */}
            {maxLength && text.length > maxLength * 0.8 && (
              <Text
                style={[
                  styles.charCount,
                  {
                    color:
                      text.length >= maxLength
                        ? theme.colors.status.danger.DEFAULT
                        : theme.colors.text.tertiary,
                  },
                ]}
              >
                {text.length}/{maxLength}
              </Text>
            )}
          </View>
          
          {/* Send Button */}
          <AnimatedPressable
            onPress={handleSend}
            disabled={!hasText || disabled}
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.colors.interactive.primary,
              },
              sendButtonAnimatedStyle,
            ]}
          >
            <Text style={styles.sendIcon}>→</Text>
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

// Quick Reply Chips
interface QuickReply {
  id: string;
  text: string;
}

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplyPress: (reply: QuickReply) => void;
  style?: ViewStyle;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({
  replies,
  onReplyPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const handleReplyPress = useCallback(
    (reply: QuickReply) => {
      haptics.light();
      onReplyPress(reply);
    },
    [haptics, onReplyPress]
  );
  
  return (
    <View style={[styles.quickReplies, style]}>
      {replies.map((reply) => (
        <Pressable
          key={reply.id}
          onPress={() => handleReplyPress(reply)}
          style={[
            styles.quickReplyChip,
            {
              backgroundColor: theme.colors.surface.secondary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <Text
            style={[
              styles.quickReplyText,
              { color: theme.colors.text.primary },
            ]}
          >
            {reply.text}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

// Attachment Preview
interface AttachmentPreviewProps {
  type: 'image' | 'location';
  data: {
    uri?: string;
    name?: string;
    address?: string;
  };
  onRemove: () => void;
  style?: ViewStyle;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  type,
  data,
  onRemove,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  
  const handleRemove = useCallback(() => {
    haptics.light();
    onRemove();
  }, [haptics, onRemove]);
  
  return (
    <View
      style={[
        styles.attachmentPreview,
        {
          backgroundColor: theme.colors.surface.secondary,
          borderColor: theme.colors.border.default,
        },
        style,
      ]}
    >
      {type === 'image' ? (
        <View
          style={[
            styles.imagePreview,
            { backgroundColor: theme.colors.surface.tertiary },
          ]}
        >
          <Text style={styles.previewIcon}>📷</Text>
        </View>
      ) : (
        <View style={styles.locationPreview}>
          <Text style={styles.previewIcon}>📍</Text>
          <View style={styles.locationContent}>
            <Text
              style={[
                styles.locationName,
                { color: theme.colors.text.primary },
              ]}
            >
              {data.name || 'Location'}
            </Text>
            {data.address && (
              <Text
                style={[
                  styles.locationAddress,
                  { color: theme.colors.text.tertiary },
                ]}
                numberOfLines={1}
              >
                {data.address}
              </Text>
            )}
          </View>
        </View>
      )}
      
      <Pressable
        onPress={handleRemove}
        style={[
          styles.removeButton,
          { backgroundColor: theme.colors.status.danger.DEFAULT },
        ]}
      >
        <Text style={styles.removeIcon}>×</Text>
      </Pressable>
    </View>
  );
};

// Voice Input (Future)
interface VoiceInputProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancel: () => void;
  isRecording: boolean;
  recordingDuration?: number;
  style?: ViewStyle;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onStartRecording,
  onStopRecording,
  onCancel,
  isRecording,
  recordingDuration = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handlePress = useCallback(() => {
    haptics.medium();
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  }, [haptics, isRecording, onStartRecording, onStopRecording]);
  
  const handlePressIn = () => {
    scale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <View style={[styles.voiceContainer, style]}>
      {isRecording && (
        <>
          <Pressable
            onPress={onCancel}
            style={[
              styles.voiceCancelButton,
              { backgroundColor: theme.colors.surface.secondary },
            ]}
          >
            <Text style={styles.voiceCancelText}>Cancel</Text>
          </Pressable>
          
          <Text
            style={[
              styles.voiceDuration,
              { color: theme.colors.status.danger.DEFAULT },
            ]}
          >
            {formatDuration(recordingDuration)}
          </Text>
        </>
      )}
      
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.voiceButton,
          {
            backgroundColor: isRecording
              ? theme.colors.status.danger.DEFAULT
              : theme.colors.interactive.primary,
          },
          animatedStyle,
        ]}
      >
        <Text style={styles.voiceIcon}>🎤</Text>
      </AnimatedPressable>
      
      {isRecording && (
        <Text
          style={[
            styles.voiceHint,
            { color: theme.colors.text.secondary },
          ]}
        >
          Tap to send
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    paddingBottom: spacing[4],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  attachOptions: {
    position: 'absolute',
    bottom: 52,
    left: spacing[3],
    flexDirection: 'row',
    gap: spacing[2],
  },
  attachOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachOptionIcon: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
    paddingVertical: 0,
  },
  charCount: {
    fontSize: 11,
    marginLeft: spacing[2],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  quickReplyChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 16,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 14,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: spacing[3],
    marginBottom: spacing[2],
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIcon: {
    fontSize: 24,
  },
  locationPreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContent: {
    flex: 1,
    marginLeft: spacing[2],
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[2],
  },
  removeIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  voiceCancelButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
    position: 'absolute',
    left: spacing[4],
  },
  voiceCancelText: {
    fontSize: 14,
    color: '#EF4444',
  },
  voiceButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 28,
  },
  voiceDuration: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: spacing[3],
  },
  voiceHint: {
    position: 'absolute',
    right: spacing[4],
    fontSize: 12,
  },
});

MessageComposer.displayName = 'MessageComposer';
QuickReplies.displayName = 'QuickReplies';
AttachmentPreview.displayName = 'AttachmentPreview';
VoiceInput.displayName = 'VoiceInput';
