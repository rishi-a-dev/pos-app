import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

import App from './App';

// Keep the native splash visible until we hide it after fonts are ready
SplashScreen.preventAutoHideAsync().catch(() => {});

registerRootComponent(App);
