/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import mobileAds, { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

const App = () => {
  const webViewRef = useRef<WebView>(null);

  // AdMob 초기화
  React.useEffect(() => {
    mobileAds().initialize();
  }, []);

  // 웹뷰에서 메시지 받기
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'SHOW_AD') {
        showRewardedAd();
      }
    } catch (error) {
      console.log('메시지 파싱 오류:', error);
    }
  };

  // 리워드 광고 표시
  const showRewardedAd = async () => {
    try {
      
      // 테스트 광고 ID 사용 (개발 환경)
      const rewardedAd = RewardedAd.createForAdRequest('ca-app-pub-3940256099942544/5224354917', {
        requestNonPersonalizedAdsOnly: true,
      });

      // 광고 로드 완료 이벤트
      rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('리워드 광고 로드 완료');
        rewardedAd.show();
      });

      // 광고 표시 완료 이벤트
      rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
        console.log('리워드 획득:', reward);
        // 웹뷰에 광고 완료 메시지 전송
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'AD_COMPLETED',
          reward: reward
        }));
      });

      // 광고 닫힘 이벤트
      rewardedAd.addAdEventListener(RewardedAdEventType.DISMISSED, () => {
        console.log('리워드 광고 닫힘');
        // 웹뷰에 광고 닫힘 메시지 전송
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'AD_CLOSED'
        }));
      });

      // 광고 로드 실패 이벤트
      rewardedAd.addAdEventListener(RewardedAdEventType.FAILED_TO_SHOW_FULL_SCREEN_CONTENT, (error: any) => {
        console.log('리워드 광고 오류:', error);
        // 웹뷰에 광고 오류 메시지 전송
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'AD_ERROR',
          error: error.message
        }));
      });

      // 광고 로드
      rewardedAd.load();
      
    } catch (error) {
      console.log('광고 표시 오류:', error);
      Alert.alert('오류', '광고를 불러올 수 없습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://www.centernetwork.info' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={handleMessage}
        injectedJavaScript={`
          // 웹뷰에서 네이티브로 메시지 전송하는 함수
          window.showAd = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'SHOW_AD'
            }));
          };
          
          // 네이티브에서 웹뷰로 메시지 받기
          document.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'AD_COMPLETED') {
              console.log('광고 시청 완료!');
              // 여기에 광고 시청 완료 후 처리 로직 추가
            } else if (data.type === 'AD_CLOSED') {
              console.log('광고가 닫혔습니다.');
            } else if (data.type === 'AD_ERROR') {
              console.log('광고 오류:', data.error);
            }
          });
          
          true; // note: this is required, or you'll sometimes get silent failures
        `}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
