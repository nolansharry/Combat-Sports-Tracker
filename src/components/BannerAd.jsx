import { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export default function BannerAd() {
  useEffect(() => {
    showBanner();
    return () => {
      AdMob.removeBanner(); 
    };
  }, []);

  const showBanner = async () => {
    await AdMob.showBanner({
      adId: 'ca-app-pub-xxxxxxxx/xxxxxxxx', // replace with your AdMob ad unit ID
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 72, 
    });
  };

  return null; 
}