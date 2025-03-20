import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Image, Clipboard, Keyboard } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Feather from 'react-native-vector-icons/Feather';
import ScalableImage from 'react-native-scalable-image';
import QRCode from 'react-native-qrcode-svg';

import {httpGet, httpPost, httpUrl} from '../../api/httpClient';

import layout from '../../res/layout';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import ToggleButton from '../button/ToggleButton';
import BasicText from '../text/BasicText';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import BorderInput from '../input/BorderInput';

export default class MyinfoTabSecurityOtp extends Component {
  state = {
    step: 1,
    otpKeyUrl: '',
    otpKey: '',
    authCode: '',
    msg: '',
  };

  back = () => {
    // Navigation.pop(this.props.componentId);
    Navigation.dismissModal(this.props.componentId);
  };

  getOtpKey = () => {
    httpGet(httpUrl.walletOtpGetKey, [])
      .then(result => {
        result = result.data;
        console.log("## walletOtpGetKey: " + JSON.stringify(result));
        if (result.result){

          this.setState({
            otpKeyUrl : result.url,
            otpKey: result.key,
            step: this.state.step + 1,
            msg: '',
          });
        }
      })
      .catch((e) => {
        console.log("## walletOtpGetKey error: " + e);
      });
  }

  verifyOtp = () => {
    httpGet(httpUrl.walletOtpVerify, [this.state.authCode])
      .then(result => {
        result = result.data;
        console.log("## walletOtpVerifyOtp: " + JSON.stringify(result));
        if (result){

          this.setState({
            step: this.state.step + 1,
            msg: '',
          });

          this.props.setLoginInfoSecurityLevel(2);
          this.props.setOtpOn();
        } else {
          Toast.show(string.invalidOtp);    
        }
      })
      .catch((e) => {
        console.log("## walletOtpGetKey error: " + e);
      });
  }

  renderStep1 = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <ScalableImage
          source={require('../../img/myinfo/twosecuritystart.png')}
          style={{ tintColor: color.mainColor }}
          width={150}
        />
        <BasicText
          style={{
            color: color.mainColor,
            textAlign: 'center',
          }}>
          {`${string.myinfoTwoSecurityInfo},\n${string.myinfoTwoSecurityInfo2}`}
        </BasicText>
        <View style={{ height: 20 }} />
        <BasicText style={{ textAlign: 'center' }}>
          {`${string.myinfoTwoSecurityInfo3}\n${string.myinfoTwoSecurityInfo4}`}
        </BasicText>
      </View>
    );
  };

  renderStep2 = () => {
    return (
      <View style={{}}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ marginVertical: 20 }}>
            <QRCode
              value={this.state.otpKeyUrl}
              size={100}
              color={color.mainColor}
              backgroundColor="white"
            />
          </View>
          <BasicText
            style={{
              color: color.mainColor,
            }}>
            {this.state.otpKey}
          </BasicText>
          <View
            style={{ marginVertical: 20, flexDirection: 'row', width: 100 }}>
            <CircleButton
              title={string.myinfoCopyKey}
              style={{
                backgroundColor: color.mainColor,
              }}
              onPress={() => {
                Clipboard.setString(this.state.otpKey)
                Toast.show(string.otpCopied);
              }}
            />
          </View>
          <BasicText style={{ fontSize: 12 }}>
            {`${string.myinfoInputAuthCode}`}
          </BasicText>
        </View>
        {/* <View
          style={{ flex: 1, flexDirection: 'row', backgroundColor: 'pink' }}>
        </View> */}
        <BorderInput
          viewStyle={{ elevation: 5, marginTop: 20 }}
          style={{ textAlign: 'center', color: color.darkpurple, fontSize: 20 }}
          secureText={true}
          value={this.state.authCode}
          keyboardType='number-pad'
          onChangeText={text => {
            if (text.length > 6) return;
            this.setState({              
              authCode: text,
            });
          }}
        />
      </View>
    );
  };

  renderStep3 = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <ScalableImage
          source={require('../../img/myinfo/otp.png')}
          style={{ tintColor: color.mainColor }}
          width={150}
        />
        <BasicText
          style={{
            color: color.mainColor,
            textAlign: 'center',
          }}>
          {`${string.myinfoOtpComplete}`}
        </BasicText>
        {/* <View
          style={{
            width: '100%',
            backgroundColor: '#eaf1f7',
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <ScalableImage
            source={require('../../img/myinfo/warning.png')}
            width={20}
          />
          <View style={{ height: 20 }} />
          <BasicText style={{ textAlign: 'center' }}>
            {`${string.myinfoOtpInfo}\n`}
            <BasicText
              style={{ color: '#ff0909' }}>{`72${string.time} `}</BasicText>
            {`${string.myinfoOtpInfo2}`}
          </BasicText>
        </View> */}
      </View>
    );
  };

  render() {
    const { step } = this.state;
    return (
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
        {/* <View
          style={[
            layout.container,
            {
              paddingHorizontal: 13.3,
              backgroundColor: '#f9fafb',
            },
          ]}> */}
          <View style={layout.nonBorderTopbar}>
            <TouchableOpacity
              hitSlop={{ top: 7, right: 20, bottom: 7, left: 20 }}
              onPress={() => {
                if (step === 2) this.setState({ step: 1, msg: '' });
                else if (step === 3) {
                  this.back();
                  // this.props.onChangeTwoAuth();
                } else {
                  this.back();
                }
              }}>
              <ScalableImage
                source={require('../../img/common/back.png')}
                width={15}
              />
            </TouchableOpacity>
            <Text style={layout.topbarTitleText}>
              {step !== 3
                ? string.myinfoTwoSecurity
                : string.otp + string.setting}
            </Text>
            <View />
          </View>
          {step === 1 && this.renderStep1()}
          {step === 2 && this.renderStep2()}
          {step === 3 && this.renderStep3()}
          <Text
            style={[
              layout.contentText,
              {
                paddingHorizontal: 15,
                fontSize: 14,
                color: '#fd585b',
                marginTop: this.state.msg === '' ? 0 : 20,
              },
            ]}>
            {this.state.msg}
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <CircleButton
              title={
                step === 1
                  ? string.startAuth
                  : step === 2
                  ? string.submit
                  : string.ok
              }
              gradient={[color.gradientColor, color.mainColor]}
              onPress={() => {
                if (this.state.step === 3) {
                  this.back();
                  // this.props.onChangeTwoAuth();
                } else if (step === 2){
                  if (this.state.authCode === ''){
                    this.setState({ msg: string.myinfoInputAuthCode });
                  } else {
                    this.verifyOtp()
                  }
                } else if (step === 1) {
                  this.getOtpKey();
                } else {
                  this.setState({
                    step: this.state.step + 1,
                    msg: '',
                  });
                }
              }}
            />
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const deviceW = Dimensions.get('window').width
const deviceH = Dimensions.get('window').height

const styles = StyleSheet.create({
  dialog: {
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    minHeight: 96,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
});