import { useWindowDimensions } from 'react-native';
import { breakpointValues } from '../tokens/breakpoints';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface UseResponsiveResult {
  width: number;
  height: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: BreakpointName;
}

export const useResponsive = (): UseResponsiveResult => {
  const { width, height } = useWindowDimensions();

  const isXs = width < breakpointValues.sm;
  const isSm = width >= breakpointValues.sm && width < breakpointValues.md;
  const isMd = width >= breakpointValues.md && width < breakpointValues.lg;
  const isLg = width >= breakpointValues.lg && width < breakpointValues.xl;
  const isXl = width >= breakpointValues.xl && width < breakpointValues['2xl'];
  const is2xl = width >= breakpointValues['2xl'];

  const isMobile = width < breakpointValues.md;
  const isTablet = width >= breakpointValues.md && width < breakpointValues.lg;
  const isDesktop = width >= breakpointValues.lg;

  const breakpoint: BreakpointName = is2xl
    ? '2xl'
    : isXl
    ? 'xl'
    : isLg
    ? 'lg'
    : isMd
    ? 'md'
    : isSm
    ? 'sm'
    : 'xs';

  return {
    width,
    height,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
};
