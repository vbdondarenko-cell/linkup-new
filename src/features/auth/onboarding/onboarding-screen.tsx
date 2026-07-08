/**
 * LinkUp Design System 2026
 * Auth Main Onboarding Screen
 */

'use client';

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuthState } from '../hooks';

import { SplashScreen } from '../components/splash-screen';
import { WelcomeScreen } from '../components/welcome-screen';
import { LoadingScreen } from '../components/loading-screen';
import { InterestsScreen } from '../components/interests-screen';
import { RadiusScreen } from '../components/radius-screen';
import { ProfilePreviewScreen } from '../components/profile-preview-screen';
import { WelcomeHomeScreen } from '../components/welcome-home-screen';

interface OnboardingScreenProps {
  onComplete: () => void;
  style?: ViewStyle;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  style,
}) => {
  const {
    state,
    startTelegramLogin,
    nextStep,
    previousStep,
    selectInterest,
    deselectInterest,
    setRadius,
    completeOnboarding,
    getInterestsByCategory,
    searchInterests,
  } = useAuthState();

  const handleTermsPress = () => {
    // Open terms URL
  };

  const handlePrivacyPress = () => {
    // Open privacy URL
  };

  const renderScreen = () => {
    switch (state.currentStep) {
      case 'splash':
        return <SplashScreen />;

      case 'welcome':
        return (
          <WelcomeScreen
            onContinueWithTelegram={startTelegramLogin}
            onTermsPress={handleTermsPress}
            onPrivacyPress={handlePrivacyPress}
            isLoading={state.isLoading}
          />
        );

      case 'loading':
        return <LoadingScreen />;

      case 'interests':
        return (
          <InterestsScreen
            selectedInterests={state.selectedInterests}
            onSelectInterest={selectInterest}
            onDeselectInterest={deselectInterest}
            onContinue={nextStep}
            onBack={previousStep}
            getInterestsByCategory={getInterestsByCategory}
            searchInterests={searchInterests}
          />
        );

      case 'radius':
        return (
          <RadiusScreen
            selectedRadius={state.radius}
            onRadiusChange={setRadius}
            onContinue={nextStep}
            onBack={previousStep}
          />
        );

      case 'profile-preview':
        return (
          <ProfilePreviewScreen
            profile={state.profile}
            selectedInterests={state.selectedInterests}
            radius={state.radius}
            onStartExploring={completeOnboarding}
            onBack={previousStep}
            isLoading={state.isLoading}
          />
        );

      case 'welcome-home':
        return (
          <WelcomeHomeScreen onComplete={onComplete} />
        );

      default:
        return <SplashScreen />;
    }
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, style]}>
      {renderScreen()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

OnboardingScreen.displayName = 'OnboardingScreen';
