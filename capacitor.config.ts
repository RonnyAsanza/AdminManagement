import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.permits.app',
  appName: 'precise-permits',
  webDir: 'dist/precise-permits',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.1.50:4200',
    cleartext: true,
  }
};

export default config;
