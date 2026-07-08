/**
 * LinkUp Design System 2026
 * Navigation Stack - Screen navigation management
 * Simple, predictable, supports all navigation patterns
 */

'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Dimensions } from 'react-native';

// ============================================
// TYPES
// ============================================

export type NavigationRoute = {
  id: string;
  name: string;
  params?: Record<string, any>;
  timestamp: number;
};

export type NavigationMode = 'push' | 'pop' | 'replace' | 'reset' | 'modal';

export interface NavigationState {
  stack: NavigationRoute[];
  currentRoute: NavigationRoute | null;
  previousRoute: NavigationRoute | null;
  modalStack: NavigationRoute[];
  isModalOpen: boolean;
}

export interface NavigationContextValue {
  state: NavigationState;
  push: (name: string, params?: Record<string, any>) => void;
  pop: (count?: number) => void;
  replace: (name: string, params?: Record<string, any>) => void;
  reset: (routes: Array<{ name: string; params?: Record<string, any> }>) => void;
  pushModal: (name: string, params?: Record<string, any>) => void;
  popModal: () => void;
  canGoBack: boolean;
  getRoute: (name: string) => NavigationRoute | undefined;
  goBack: () => void;
}

// ============================================
// ACTIONS
// ============================================

type NavigationAction =
  | { type: 'PUSH'; route: NavigationRoute }
  | { type: 'POP'; count: number }
  | { type: 'REPLACE'; route: NavigationRoute }
  | { type: 'RESET'; stack: NavigationRoute[] }
  | { type: 'PUSH_MODAL'; route: NavigationRoute }
  | { type: 'POP_MODAL' };

// ============================================
// REDUCER
// ============================================

const generateId = () => `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState: NavigationState = {
  stack: [],
  currentRoute: null,
  previousRoute: null,
  modalStack: [],
  isModalOpen: false,
};

function navigationReducer(
  state: NavigationState,
  action: NavigationAction
): NavigationState {
  switch (action.type) {
    case 'PUSH': {
      const previousRoute = state.currentRoute;
      const newStack = [...state.stack, action.route];
      return {
        ...state,
        stack: newStack,
        currentRoute: action.route,
        previousRoute,
      };
    }

    case 'POP': {
      const popCount = Math.min(action.count, state.stack.length - 1);
      const newStack = state.stack.slice(0, state.stack.length - popCount);
      const newCurrentRoute = newStack[newStack.length - 1] || null;
      const newPreviousRoute = newStack.length > 1
        ? newStack[newStack.length - 2]
        : null;

      return {
        ...state,
        stack: newStack,
        currentRoute: newCurrentRoute,
        previousRoute: newPreviousRoute,
      };
    }

    case 'REPLACE': {
      if (state.stack.length === 0) {
        return {
          ...state,
          stack: [action.route],
          currentRoute: action.route,
          previousRoute: null,
        };
      }

      const newStack = [...state.stack.slice(0, -1), action.route];
      return {
        ...state,
        stack: newStack,
        currentRoute: action.route,
        previousRoute: state.previousRoute,
      };
    }

    case 'RESET': {
      const newStack = action.stack;
      return {
        ...state,
        stack: newStack,
        currentRoute: newStack[newStack.length - 1] || null,
        previousRoute: newStack.length > 1
          ? newStack[newStack.length - 2]
          : null,
      };
    }

    case 'PUSH_MODAL': {
      return {
        ...state,
        modalStack: [...state.modalStack, action.route],
        isModalOpen: true,
      };
    }

    case 'POP_MODAL': {
      const newModalStack = state.modalStack.slice(0, -1);
      return {
        ...state,
        modalStack: newModalStack,
        isModalOpen: newModalStack.length > 0,
      };
    }

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

const NavigationContext = createContext<NavigationContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface NavigationProviderProps {
  children: ReactNode;
  initialRoutes?: Array<{ name: string; params?: Record<string, any> }>;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialRoutes = [],
}) => {
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialState,
    stack: initialRoutes.map((route) => ({
      id: generateId(),
      name: route.name,
      params: route.params,
      timestamp: Date.now(),
    })),
    currentRoute:
      initialRoutes.length > 0
        ? {
            id: generateId(),
            name: initialRoutes[initialRoutes.length - 1].name,
            params: initialRoutes[initialRoutes.length - 1].params,
            timestamp: Date.now(),
          }
        : null,
  });

  const push = useCallback(
    (name: string, params?: Record<string, any>) => {
      const route: NavigationRoute = {
        id: generateId(),
        name,
        params,
        timestamp: Date.now(),
      };
      dispatch({ type: 'PUSH', route });
    },
    []
  );

  const pop = useCallback((count: number = 1) => {
    dispatch({ type: 'POP', count });
  }, []);

  const replace = useCallback(
    (name: string, params?: Record<string, any>) => {
      const route: NavigationRoute = {
        id: generateId(),
        name,
        params,
        timestamp: Date.now(),
      };
      dispatch({ type: 'REPLACE', route });
    },
    []
  );

  const reset = useCallback(
    (routes: Array<{ name: string; params?: Record<string, any> }>) => {
      const stack = routes.map((route) => ({
        id: generateId(),
        name: route.name,
        params: route.params,
        timestamp: Date.now(),
      }));
      dispatch({ type: 'RESET', stack });
    },
    []
  );

  const pushModal = useCallback(
    (name: string, params?: Record<string, any>) => {
      const route: NavigationRoute = {
        id: generateId(),
        name,
        params,
        timestamp: Date.now(),
      };
      dispatch({ type: 'PUSH_MODAL', route });
    },
    []
  );

  const popModal = useCallback(() => {
    dispatch({ type: 'POP_MODAL' });
  }, []);

  const canGoBack = state.stack.length > 1;

  const getRoute = useCallback(
    (name: string) => {
      return state.stack.find((route) => route.name === name);
    },
    [state.stack]
  );

  const goBack = useCallback(() => {
    if (canGoBack) {
      pop(1);
    }
  }, [canGoBack, pop]);

  const value = useMemo<NavigationContextValue>(
    () => ({
      state,
      push,
      pop,
      replace,
      reset,
      pushModal,
      popModal,
      canGoBack,
      getRoute,
      goBack,
    }),
    [
      state,
      push,
      pop,
      replace,
      reset,
      pushModal,
      popModal,
      canGoBack,
      getRoute,
      goBack,
    ]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }

  return context;
}

// ============================================
// NAVIGATOR COMPONENT
// ============================================

interface ScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  options?: {
    title?: string;
    headerShown?: boolean;
    animation?: 'slide' | 'fade' | 'none';
  };
}

interface NavigatorProps {
  screens: ScreenConfig[];
  renderHeader?: (route: NavigationRoute | null) => ReactNode;
}

export const Navigator: React.FC<NavigatorProps> = ({
  screens,
  renderHeader,
}) => {
  const { state } = useNavigation();

  const currentScreen = useMemo(() => {
    return screens.find((screen) => screen.name === state.currentRoute?.name);
  }, [screens, state.currentRoute]);

  const CurrentComponent = currentScreen?.component;

  return (
    <React.Fragment>
      {renderHeader?.(state.currentRoute)}
      {CurrentComponent && (
        <CurrentComponent
          key={state.currentRoute?.id}
          {...state.currentRoute?.params}
        />
      )}
    </React.Fragment>
  );
};
