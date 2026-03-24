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
      adId: 'ca-app-pub-9582762087729330~7184286874', // replace with your AdMob ad unit ID
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 72, 
    });
  };

  return null; 
}