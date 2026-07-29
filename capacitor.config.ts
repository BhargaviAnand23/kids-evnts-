import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kidspire.app',
  appName: 'Kidspire',
  webDir: 'public',
  server: {
    url: 'https://school-evnts.vercel.app',
    cleartext: true
  }
};

export default config;

