import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.348e7ed3357e44bd996d8f00a43a1665',
  appName: 'outfit-planning',
  webDir: 'dist',
  server: {
    url: 'https://348e7ed3-357e-44bd-996d-8f00a43a1665.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;