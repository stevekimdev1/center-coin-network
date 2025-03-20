import React, { Component, } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  spin,
  easing
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import QRCode from 'react-native-qrcode-svg';
import Toast from '../../lib/util/toast';
import Language from '../../lib/util/language';
import StringUtil from '../../lib/util/stringUtil';
import { Navigation } from 'react-native-navigation';

import CircleButton from '../button/CircleButton';
import color from '../../res/color';
import ScalableImage from 'react-native-scalable-image';
import { httpGet, httpPost, httpUrl } from '../../api/httpClient';
import { loginFailedEmailConfirm } from '../../res/string_en';
import { feeRadio } from '../../lib/util/codeUtil';
import Coin from '../../lib/coin/coin';


class DoubleSwapDialog extends Component {
  constructor(props) {
    super(props);

    string = Language.getString();
    this.state = {
      price: '',
      animation: new Animated.Value(0),
      targetDegree: 0,
      ranNum: 300,
      num: 0,
    };
  }

  componentDidMount() {
  }

  animation = () => {
    Animated.timing(
      this.state.animation, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }

  doDoubleSwap = async () => {

    Navigation.showModal({
      component: {
        name: 'navigation.BasicAlertDialog',
        passProps: {
          title: 'PUMPING SWAP',
          message: '룰렛을 돌리시겠습니까?',
          ok: ()=>{
            httpPost(httpUrl.tradeRand, [], {
              fromCoinType: this.props.fromCoinType,
              toCoinType: this.props.toCoinType,
              securityPassword: this.props.securityPassword,
              otpCode: this.props.otpCode,
              amount: this.props.amount,
              reco: this.props.reco
            })
              .then(result => {
                console.log('logout result=' + result);
                //실패알림, 잔액갱신, 수수료갱신, 필드클리어
        
                if (result.data.result == 'SUCCESS') {
                  const resultNum = result.data.num;
                  const degree = [
                    0,
                    60,
                    0,
                    300,
                    240,
                    180,
                    120
                  ]
                  this.state.animation.setValue(0);
                  this.setState({
                    targetDegree: Math.random() * 50 + degree[resultNum] + 5 + 720 //목표각도 +5 ~ +55도까지 2바퀴이상
                  }, ()=>{
                    this.animation();
                  })
                  setTimeout(()=>{
                    Toast.show(feeRadio[resultNum])
                    this.props.reloadBalance();
                  }, 2500)
                } else if (result.data.result == 'INSUFFICIENT_BALANCE')
                  Toast.show(string.sendCoinFailedInsufficientBalance);
                else if (result.data.result == 'LOCKED')
                  Toast.show(string.sendCoinFailedLocked);
                else if (result.data.result == 'INVALID_OTP')
                  Toast.show(string.sendCoinFailedInvalidOtp);
                else if (result.data.result == 'INVALID_SECURITY_PASSWORD')
                  Toast.show(string.sendCoinFailedInvalidSecPassword);
                else if (result.data.result == 'LIMIT_EXCEED')
                  Toast.show(string.sendCoinFailedLimitExceed);
                else if (result.data.result == 'REQUIRED_OTP_DAILY')
                  Toast.show(string.sendCoinFailedOtpRequired);
                else if (result.data.result == 'REQUIRED_OTP')
                  Toast.show(string.sendCoinFailedOtpRequired);
                else if (result.data.result == 'INVALID_COINTYPE')
                  Toast.show(string.InvalidCoinType);
                else if (result.data.result == 'ORGANIZATION_CANNOT')
                  Toast.show(string.InvalidFranchise);
              })
              .catch(e => console.log('## logout error: ' + e));

          },
        },
        options: {
          topBar: {drawBehind: true, visible: false},
          screenBackgroundColor: 'transparent',
          modalPresentationStyle: 'overCurrentContext',
        },
      },
    });

  }
  // show(coin, address) {
  render() {
    const spin = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${-this.state.targetDegree}deg`]
    });
    const fromCoinSymbol = this.props.coinList.find(x=>x.coinType==this.props.fromCoinType).symbol
    const fromCoinBase = Coin.getCoinUnit(this.props.fromCoinType).base
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true}>
          <ImageBackground
            source={require('../../img/roulette-bg.png')}
            style={styles.dialog}>
            <View style={{ paddingTop: 0 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 56,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.dismiss();
                  }}
                  style={{}}>
                  <ScalableImage
                    source={require('../../img/common/back.png')}
                    width={15}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={{fontWeight: 'bold', color: color.coral, fontSize: 20}}>{(this.props.amount/fromCoinBase).toFixed(4)} {fromCoinSymbol}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ScalableImage
                  source={require('../../img/roulette-sub-txt.png')}
                  width={290}
                  style={{ marginBottom: 15 }}
                />
                <ScalableImage
                  source={require('../../img/roulette-main-txt.png')}
                  width={288}
                />
              </View>

              <View
                style={{
                  marginVertical: 20,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <ScalableImage
                  source={require('../../img/roulette-point.png')}
                  width={24}
                  style={{ marginBottom: -30, position: 'relative', zIndex: 5 }}
                />
                {/* <ScalableImage
                  source={require('../../img/roulette.png')}
                  width={280}
                  style={{ transform: [{ rotate: "90deg" }] }}
                /> */}
                <Animated.Image
                  source={require('../../img/roulette.png')}
                  style={{ transform: [{ rotate: spin }], width: 280, height: 280 }}

                />

              </View>

              <TouchableOpacity
                onPress={this.doDoubleSwap}
                style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.btn}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15.3,
                      textAlign: 'center',
                      alignItems: 'center',
                    }}>
                    {string.spinRoulette}
                  </Text>
                </View>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
        <KeyboardSpacer />
      </TouchableOpacity>
    );
  }

  dismiss() {
    // if (global.dlg.length > 0) {
    //   let lastSibling = global.dlg.pop();
    //   lastSibling && lastSibling.destroy();
    // }
    Navigation.dismissModal(this.props.componentId);
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  dialog: {
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    minHeight: 96,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 150,
    backgroundColor: '#132535',
    height: 42,
    borderRadius: 20,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoubleSwapDialog;
