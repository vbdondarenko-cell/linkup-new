/**
 * LinkUp Design System 2026
 * Premium FAQ Screen
 */

'use client';

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { FAQItem, FAQ_ITEMS } from '../types';

interface FAQScreenProps {
  onContactSupport?: () => void;
  style?: ViewStyle;
}

type FAQCategory = 'all' | 'general' | 'subscription' | 'reward' | 'refund';

export const FAQScreen: React.FC<FAQScreenProps> = ({
  onContactSupport,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const categories: Array<{ key: FAQCategory; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'general', label: 'General' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'reward', label: 'Reward' },
    { key: 'refund', label: 'Refund' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === selectedCategory);

  const handleToggle = useCallback((id: string) => {
    haptics.light();
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [haptics]);

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Help & FAQ
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Find answers to common questions
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => { haptics.light(); setSelectedCategory(cat.key); }}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === cat.key 
                  ? theme.colors.primary.DEFAULT 
                  : theme.colors.surface.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === cat.key ? '#FFFFFF' : theme.colors.text.secondary },
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* FAQ Items */}
      <ScrollView style={styles.faqList} contentContainerStyle={styles.faqContent} showsVerticalScrollIndicator={false}>
        {filteredItems.map((faq, index) => (
          <Animated.View
            key={faq.id}
            entering={FadeInDown.delay(index * 50)}
          >
            <Pressable
              onPress={() => handleToggle(faq.id)}
              style={[
                styles.faqItem,
                { backgroundColor: theme.colors.surface.primary },
              ]}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: theme.colors.text.primary }]}>
                  {faq.question}
                </Text>
                <Text style={[styles.faqIcon, { color: theme.colors.text.tertiary }]}>
                  {expandedIds.has(faq.id) ? '−' : '+'}
                </Text>
              </View>
              {expandedIds.has(faq.id) && (
                <Text style={[styles.faqAnswer, { color: theme.colors.text.secondary }]}>
                  {faq.answer}
                </Text>
              )}
            </Pressable>
          </Animated.View>
        ))}

        {/* Contact Support */}
        <Animated.View entering={FadeInDown.delay(filteredItems.length * 50)}>
          <Pressable
            onPress={() => { haptics.light(); onContactSupport?.(); }}
            style={[styles.supportCard, { backgroundColor: theme.colors.surface.primary }]}
          >
            <Text style={styles.supportIcon}>💬</Text>
            <View style={styles.supportContent}>
              <Text style={[styles.supportTitle, { color: theme.colors.text.primary }]}>
                Still have questions?
              </Text>
              <Text style={[styles.supportText, { color: theme.colors.text.secondary }]}>
                Contact our support team
              </Text>
            </View>
            <Text style={[styles.supportArrow, { color: theme.colors.text.tertiary }]}>→</Text>
          </Pressable>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  subtitle: { fontSize: 14, marginTop: spacing[1] },
  categoriesContainer: { paddingHorizontal: spacing[5], paddingVertical: spacing[4], gap: spacing[2] },
  categoryChip: { paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: 20, marginRight: spacing[2] },
  categoryText: { fontSize: 14, fontWeight: fontWeight.medium },
  faqList: { flex: 1 },
  faqContent: { paddingHorizontal: spacing[5] },
  faqItem: { padding: spacing[4], borderRadius: 16, marginBottom: spacing[3] },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  faqQuestion: { fontSize: 15, fontWeight: fontWeight.semibold, flex: 1, paddingRight: spacing[3] },
  faqIcon: { fontSize: 20, fontWeight: '300', marginLeft: spacing[2] },
  faqAnswer: { fontSize: 14, lineHeight: 22, marginTop: spacing[3] },
  supportCard: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderRadius: 16, marginTop: spacing[2] },
  supportIcon: { fontSize: 28 },
  supportContent: { flex: 1, marginLeft: spacing[3] },
  supportTitle: { fontSize: 15, fontWeight: fontWeight.semibold },
  supportText: { fontSize: 13, marginTop: 2 },
  supportArrow: { fontSize: 20 },
  bottomSpacer: { height: spacing[8] },
});

FAQScreen.displayName = 'FAQScreen';
