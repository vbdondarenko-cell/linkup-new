/**
 * LinkUp Design System 2026
 * Business - Profile Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable, Image } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Button } from '../../../ui/components/buttons';
import { Badge } from '../../../ui/components/badges';
import { BusinessProfile } from '../types';

interface ProfileScreenProps {
  profile: BusinessProfile;
  onEditPress?: () => void;
  onGalleryPress?: () => void;
  onSettingsPress?: () => void;
  style?: ViewStyle;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onEditPress,
  onGalleryPress,
  onSettingsPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Cover & Logo */}
        <Animated.View entering={FadeInUp} style={styles.headerContainer}>
          {profile.coverImageUrl ? (
            <Image source={{ uri: profile.coverImageUrl }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.surface.secondary }]}>
              <Text style={styles.coverIcon}>{profile.category.icon}</Text>
            </View>
          )}
          
          <View style={styles.logoContainer}>
            {profile.logoUrl ? (
              <Image source={{ uri: profile.logoUrl }} style={styles.logo} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.surface.primary }]}>
                <Text style={styles.logoIcon}>{profile.category.icon}</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.headerActions}>
            <Pressable onPress={() => { haptics.light(); onEditPress?.(); }} style={[styles.actionButton, { backgroundColor: theme.colors.surface.primary }]}>
              <Text style={styles.actionIcon}>✏️</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Business Info */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.infoCard, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.nameRow}>
            <Text style={[styles.businessName, { color: theme.colors.text.primary }]}>{profile.name}</Text>
            {profile.verificationStatus === 'verified' && (
              <View style={[styles.verifiedBadge, { backgroundColor: '#10B981' }]}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>

          <View style={[styles.rankBadge, { backgroundColor: `${profile.rankInfo.color}20` }]}>
            <Text style={styles.rankIcon}>{profile.rankInfo.icon}</Text>
            <Text style={[styles.rankText, { color: profile.rankInfo.color }]}>{profile.rankInfo.label}</Text>
          </View>

          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{profile.description}</Text>

          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${profile.category.color}20` }]}>
              <Text style={styles.categoryIcon}>{profile.category.icon}</Text>
              <Text style={[styles.categoryText, { color: profile.category.color }]}>{profile.category.name}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: profile.isOpen ? '#10B98120' : '#EF444420' }]}>
              <View style={[styles.statusDot, { backgroundColor: profile.isOpen ? '#10B981' : '#EF4444' }]} />
              <Text style={[styles.statusText, { color: profile.isOpen ? '#10B981' : '#EF4444' }]}>
                {profile.isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150)} style={[styles.statsCard, { backgroundColor: theme.colors.surface.primary }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{profile.totalEvents}</Text><Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Events</Text></View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{profile.totalParticipants}</Text><Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Guests</Text></View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{profile.averageRating.toFixed(1)}</Text><Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Rating</Text></View>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border.default }]} />
            <View style={styles.statItem}><Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{profile.followers}</Text><Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Followers</Text></View>
          </View>
        </Animated.View>

        {/* Contact Info */}
        <Animated.View entering={FadeInDown.delay(200)} style={[styles.sectionCard, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Contact & Location</Text>
          
          {profile.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.text.tertiary }]}>Address</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{profile.address.street}, {profile.address.city}</Text>
              </View>
            </View>
          )}
          
          {profile.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.text.tertiary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{profile.phone}</Text>
              </View>
            </View>
          )}
          
          {profile.website && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🌐</Text>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.text.tertiary }]}>Website</Text>
                <Text style={[styles.infoValue, { color: theme.colors.primary.DEFAULT }]}>{profile.website}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📧</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.text.tertiary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>{profile.email}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Amenities */}
        {profile.amenities && profile.amenities.length > 0 && (
          <Animated.View entering={FadeInDown.delay(250)} style={[styles.sectionCard, { backgroundColor: theme.colors.surface.primary }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {profile.amenities.map((amenity) => (
                <View key={amenity} style={[styles.amenityBadge, { backgroundColor: theme.colors.surface.secondary }]}>
                  <Text style={[styles.amenityText, { color: theme.colors.text.secondary }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Gallery Preview */}
        {profile.gallery && profile.gallery.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300)} style={[styles.sectionCard, { backgroundColor: theme.colors.surface.primary }]}>
            <View style={styles.galleryHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Gallery</Text>
              <Pressable onPress={() => { haptics.light(); onGalleryPress?.(); }}>
                <Text style={[styles.viewAllText, { color: theme.colors.primary.DEFAULT }]}>View All →</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {profile.gallery.slice(0, 4).map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} resizeMode="cover" />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Member Since */}
        <Animated.View entering={FadeInUp.delay(350)} style={styles.memberSince}>
          <Text style={[styles.memberText, { color: theme.colors.text.tertiary }]}>
            Member since {formatDate(profile.memberSince)}
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { position: 'relative' },
  coverImage: { width: '100%', height: 180 },
  coverPlaceholder: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center' },
  coverIcon: { fontSize: 64, opacity: 0.3 },
  logoContainer: { position: 'absolute', bottom: -40, left: spacing[5] },
  logo: { width: 80, height: 80, borderRadius: 20, borderWidth: 4, borderColor: '#FFFFFF' },
  logoPlaceholder: { width: 80, height: 80, borderRadius: 20, borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 32 },
  headerActions: { position: 'absolute', top: spacing[4], right: spacing[4], flexDirection: 'row', gap: spacing[2] },
  actionButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionIcon: { fontSize: 18 },
  infoCard: { margin: spacing[5], marginTop: spacing[6], padding: spacing[4], borderRadius: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  businessName: { fontSize: 24, fontWeight: fontWeight.bold },
  verifiedBadge: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  verifiedIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: fontWeight.bold },
  rankBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 12, marginTop: spacing[2], gap: 4 },
  rankIcon: { fontSize: 12 },
  rankText: { fontSize: 12, fontWeight: fontWeight.semibold },
  description: { fontSize: 14, lineHeight: 20, marginTop: spacing[3] },
  categoryRow: { flexDirection: 'row', marginTop: spacing[4], gap: spacing[2] },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 8, gap: 4 },
  categoryIcon: { fontSize: 14 },
  categoryText: { fontSize: 12, fontWeight: fontWeight.semibold },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 8, gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: fontWeight.semibold },
  statsCard: { margin: spacing[5], marginTop: 0, padding: spacing[4], borderRadius: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: fontWeight.bold },
  statLabel: { fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30 },
  sectionCard: { margin: spacing[5], marginTop: 0, padding: spacing[4], borderRadius: 16 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeight.semibold, marginBottom: spacing[3] },
  infoRow: { flexDirection: 'row', marginBottom: spacing[3] },
  infoIcon: { fontSize: 18, width: 32 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: fontWeight.medium },
  infoValue: { fontSize: 14, marginTop: 2 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  amenityBadge: { paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: 8 },
  amenityText: { fontSize: 13 },
  galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  viewAllText: { fontSize: 13, fontWeight: fontWeight.medium },
  galleryImage: { width: 120, height: 80, borderRadius: 8, marginRight: spacing[2] },
  memberSince: { alignItems: 'center', paddingVertical: spacing[4] },
  memberText: { fontSize: 12 },
  bottomSpacer: { height: spacing[8] },
});

ProfileScreen.displayName = 'ProfileScreen';
