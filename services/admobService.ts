import { AdMob, AdOptions, AdLoadInfo, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const initializeAdMob = async () => {
    if (Capacitor.getPlatform() === 'web') return;

    try {
        await AdMob.initialize({
            testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'], // Example test device ID
            initializeForTesting: true,
        });
        console.log('AdMob initialized');
    } catch (e) {
        console.error('AdMob initialization failed', e);
    }
};

export const showInterstitial = async () => {
    if (Capacitor.getPlatform() === 'web') {
        console.log('AdMob: Interstitial Ad Triggered (Web Simulation)');
        return;
    }

    try {
        const options: AdOptions = {
            adId: 'ca-app-pub-3940256099942544/1033173712', // Test ID for Android Interstitial
            isTesting: true
            // npa: true
        };

        await AdMob.prepareInterstitial(options);
        await AdMob.showInterstitial();
    } catch (e) {
        console.error('AdMob show failed', e);
    }
};
