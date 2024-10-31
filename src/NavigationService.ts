// NavigationService.ts
import { createNavigationContainerRef, NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<ReactNavigation.RootParamList>();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
