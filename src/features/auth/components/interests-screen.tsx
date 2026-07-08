/**
 * LinkUp Design System 2026
 * Auth Interest Selection Screen
 */

'use client';

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, TextInput, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { Chip } from '../../../ui/components/chips';
import { Interest, INTEREST_CATEGORIES, INTEREST_SELECTION } from '../types';

interface InterestsScreenProps {
  selectedInterests: Interest[];
  onSelectInterest: (interest: Interest) => void;
  onDeselectInterest: (interestId: string) => void;
  onContinue: () => void;
  onBack: () => void;
  getInterestsByCategory: (categoryId: string) => Interest[];
  searchInterests: (query: string) => Interest[];
  style?: ViewStyle;
}

export const InterestsScreen: React.FC<InterestsScreenProps> = ({
  selectedInterests,
  onSelectInterest,
  onDeselectInterest,
  onContinue,
  onBack,
  getInterestsByCategory,
  searchInterests,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const canContinue = selectedInterests.length >= INTEREST_SELECTION.MIN;
  const isMaxReached = selectedInterests.length >= INTEREST_SELECTION.MAX;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchInterests(searchQuery);
  }, [searchQuery, searchInterests]);

  const handleInterestToggle = (interest: Interest) => {
    haptics.light();
    if (selectedInterests.find(i => i.id === interest.id)) {
      onDeselectInterest(interest.id);
    } else if (!isMaxReached) {
      onSelectInterest(interest);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    haptics.light();
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
        <Pressable onPress={() => { haptics.light(); onBack(); }} style={styles.backButton}>
          <Text style={[styles.backIcon, { color: theme.colors.text.primary }]}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            What interests you?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
            Select {INTEREST_SELECTION.MIN}-{INTEREST_SELECTION.MAX} interests
          </Text>
        </View>
      </View>

      {/* Selected Interests */}
      {selectedInterests.length > 0 && (
        <Animated.View 
          entering={FadeInDown}
          layout={Layout.springify()}
          style={[styles.selectedContainer, { backgroundColor: theme.colors.surface.primary }]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedContent}>
            {selectedInterests.map((interest) => (
              <Pressable
                key={interest.id}
                onPress={() => handleInterestToggle(interest)}
                style={[styles.selectedChip, { backgroundColor: `${theme.colors.primary.DEFAULT}20` }]}
              >
                <Text style={styles.selectedChipIcon}>{interest.icon}</Text>
                <Text style={[styles.selectedChipText, { color: theme.colors.primary.DEFAULT }]}>
                  {interest.name}
                </Text>
                <Text style={[styles.selectedChipClose, { color: theme.colors.primary.DEFAULT }]}>✕</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={[styles.selectedCount, { color: theme.colors.text.tertiary }]}>
            {selectedInterests.length}/{INTEREST_SELECTION.MAX}
          </Text>
        </Animated.View>
      )}

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={[styles.searchInput, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchText, { color: theme.colors.text.primary }]}
            placeholder="Search interests..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearIcon, { color: theme.colors.text.tertiary }]}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Results */}
      {searchQuery.trim() && (
        <View style={styles.resultsContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.resultsGrid}>
              {searchResults.map((interest) => (
                <Pressable
                  key={interest.id}
                  onPress={() => handleInterestToggle(interest)}
                  style={({ pressed }) => [
                    styles.interestCard,
                    { 
                      backgroundColor: theme.colors.surface.primary,
                      opacity: pressed ? 0.8 : 1,
                      borderColor: selectedInterests.find(i => i.id === interest.id) 
                        ? theme.colors.primary.DEFAULT 
                        : 'transparent',
                      borderWidth: selectedInterests.find(i => i.id === interest.id) ? 2 : 0,
                    },
                  ]}
                >
                  <Text style={styles.interestIcon}>{interest.icon}</Text>
                  <Text style={[styles.interestName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                    {interest.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Categories */}
      {!searchQuery.trim() && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
            {INTEREST_CATEGORIES.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                icon={category.icon}
                variant={selectedCategory === category.id ? 'filled' : 'outline'}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>

          {/* Interests Grid */}
          <View style={styles.interestsContainer}>
            {selectedCategory ? (
              // Show category interests
              <View style={styles.categorySection}>
                <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
                  {INTEREST_CATEGORIES.find(c => c.id === selectedCategory)?.icon}{' '}
                  {INTEREST_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </Text>
                <View style={styles.interestsGrid}>
                  {getInterestsByCategory(selectedCategory).map((interest) => (
                    <InterestCard
                      key={interest.id}
                      interest={interest}
                      isSelected={!!selectedInterests.find(i => i.id === interest.id)}
                      isDisabled={isMaxReached && !selectedInterests.find(i => i.id === interest.id)}
                      onPress={() => handleInterestToggle(interest)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              // Show all categories
              INTEREST_CATEGORIES.map((category) => (
                <View key={category.id} style={styles.categorySection}>
                  <Text style={[styles.categoryTitle, { color: theme.colors.text.primary }]}>
                    {category.icon} {category.name}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryRow}>
                      {getInterestsByCategory(category.id).slice(0, 4).map((interest) => (
                        <InterestCard
                          key={interest.id}
                          interest={interest}
                          isSelected={!!selectedInterests.find(i => i.id === interest.id)}
                          isDisabled={isMaxReached && !selectedInterests.find(i => i.id === interest.id)}
                          onPress={() => handleInterestToggle(interest)}
                          compact
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ))
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* Continue Button */}
      <View style={[styles.bottomContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Button
          variant="primary"
          size="lg"
          onPress={() => { haptics.medium(); onContinue(); }}
          disabled={!canContinue}
          style={styles.continueButton}
        >
          {canContinue ? 'Continue' : `Select ${INTEREST_SELECTION.MIN - selectedInterests.length} more`}
        </Button>
      </View>
    </Animated.View>
  );
};

// Interest Card Component
interface InterestCardProps {
  interest: Interest;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  compact?: boolean;
}

const InterestCard: React.FC<InterestCardProps> = ({
  interest,
  isSelected,
  isDisabled,
  onPress,
  compact = false,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.interestCard,
        compact && styles.interestCardCompact,
        { 
          backgroundColor: theme.colors.surface.primary,
          opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
          borderColor: isSelected ? theme.colors.primary.DEFAULT : 'transparent',
          borderWidth: isSelected ? 2 : 0,
        },
      ]}
    >
      <Text style={styles.interestIcon}>{interest.icon}</Text>
      <Text 
        style={[styles.interestName, { color: theme.colors.text.primary }]} 
        numberOfLines={1}
      >
        {interest.name}
      </Text>
      {isSelected && (
        <View style={[styles.checkBadge, { backgroundColor: theme.colors.primary.DEFAULT }]}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5],
    paddingTop: spacing[6],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
    marginLeft: spacing[2],
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  selectedContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  selectedContent: {
    gap: spacing[2],
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 20,
    gap: spacing[1],
    marginRight: spacing[2],
  },
  selectedChipIcon: {
    fontSize: 14,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  selectedChipClose: {
    fontSize: 12,
    marginLeft: spacing[1],
  },
  selectedCount: {
    fontSize: 12,
    marginTop: spacing[2],
  },
  searchContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    padding: spacing[1],
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  categoriesContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  interestsContainer: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
  },
  categorySection: {
    marginBottom: spacing[5],
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[3],
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  interestCard: {
    width: '48%',
    padding: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  interestCardCompact: {
    width: 100,
  },
  interestIcon: {
    fontSize: 28,
    marginBottom: spacing[2],
  },
  interestName: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  continueButton: {
    width: '100%',
  },
});

InterestsScreen.displayName = 'InterestsScreen';
