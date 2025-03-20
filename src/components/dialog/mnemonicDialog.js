import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Clipboard,
  Keyboard,
  Picker,
  Platform,
} from 'react-native';
import Button from 'react-native-button';
import layout from '../../res/layout';
// import string from '../../res/string';
import Coin from '../../lib/coin/coin';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import Feather from 'react-native-vector-icons/Feather';
import { TextField } from 'react-native-material-textfield';
// import CheckBox from 'react-native-check-box';
import Language from '../../lib/util/language';
import StepIndicator from 'react-native-step-indicator';
import PwdInput from './../input/PwdInput';
import {httpGet, httpPost, httpUrl, httpPut } from '../../api/httpClient';
import Toast from '../../lib/util/toast';

import BasicInput from '../input/BasicInput';
import BasicButton from '../button/BasicButton';
import BasicCheckBox from '../checkbox/BasicCheckBox';

import { Navigation } from 'react-native-navigation'
import color from '../../res/color';
import CircleButton from '../button/CircleButton';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

// this.props.mode == 'FIND_ID_PW'  // ID 찾기 후 비밀번호 변경
// this.props.mode == 'CHANGE_PW'  // 비밀번호 변경
// this.props.mode == 'FIND_SECPW'  // 보안 비밀번호 변경
// this.props.mode == 'CHANGE_SECPW'  // 보안 비밀번호 변경
// this.props.mode == 'CHANGE_OTP' // OTP 변경

class mnemonicDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    let words = Coin.generateWords();
    this.initialWords = [...words];
    this.state = {
      supported: true,
      enabled: true,
      email: this.props.id != undefined ? this.props.id : '',
      emails: [],
      step: 0,
      registType: 0, //0-신규등록, 1-카드복구
      words: words,
      recoverWords: ['', '', '', '', '', '', '', '', '', '', '', ''],
      msg: '',
      agreementChecked: false,
      agreementShowed: false,
      phoneEditable: this.props.mode == 'FIND_ID_PW',
      certiVerified: false,
      timer: 180,
      onTimer: false,
      form: {
        email: '',
        password: '',
        password2: '',
        currentPassword: '',
        phone: this.props.phone != undefined ? this.props.phone : '',
        certiCode: '',
        secPassword: '',
        secPassword2: '',
        recommendCode: '',
      },
      formError: {},
    };
  }

  componentDidMount() {
  }

  onClickPrev = () => {
    if (this.state.step === 0) {
      Navigation.dismissModal(this.props.componentId);
    }
    this.setState({
      step: this.state.step - 1,
      msg: ''
    });
  };

  onClickNext = () => {
    if (this.props.mode == 'FIND_ID_PW'){
      if (this.state.step == 0) {

        if (!this.state.certiVerified) {
          this.setState({ msg: string.certiCodeNotVerified });
          return;
        }

        this.findId();
        return;

      } else if (this.state.step == 1) {
        let checkPwdResult = this.checkPassword();
        // console.log("## checkPwdResult: " + checkPwdResult);

        if (checkPwdResult == 1) {
          this.setState({ msg: string.passwordLengthFail });
          return;
        } else if (checkPwdResult == 2) {
          this.setState({ msg: string.passwordConfirmFail });
          return;
        } else if (checkPwdResult == 3) {
          this.setState({ msg: string.passwordStrength });
          return;
        }

        this.changePassword();
        return;
      }

    } else if (this.props.mode == 'FIND_SECPW'){
      if (this.state.step == 0) {

        if (!this.state.certiVerified) {
          this.setState({ msg: string.certiCodeNotVerified });
          return;
        }

        this.findId();
        return;

      } else if (this.state.step == 1) {
        let checkSecPwdResult = this.checkSecPassword();
        // console.log("## checkPwdResult: " + checkSecPwdResult);

        if (checkSecPwdResult == 1) {
          this.setState({ msg: string.secPasswordStrength });
          return;
        } else if (checkSecPwdResult == 2) {
          this.setState({ msg: string.secPasswordConfirmFail });
          return;
        }

        this.findSecPassword();
        return;
      }

    } else if (this.props.mode == 'CHANGE_OTP'){
      if (this.state.step == 0) {

        if (!this.state.certiVerified) {
          this.setState({ msg: string.certiCodeNotVerified });
          return;
        }

        this.changeOtp();
        return;
      }

    } else if (this.props.mode == 'CHANGE_PW'){

      if (this.state.step == 0) {
        let checkPwdResult = this.checkPassword();
        // console.log("## checkPwdResult: " + checkPwdResult);

        if (checkPwdResult == 1) {
          this.setState({ msg: string.passwordLengthFail });
          return;
        } else if (checkPwdResult == 2) {
          this.setState({ msg: string.passwordConfirmFail });
          return;
        } else if (checkPwdResult == 3) {
          this.setState({ msg: string.passwordStrength });
          return;
        }

        this.changePassword();
        return;
      }
    } else if (this.props.mode == 'CHANGE_SECPW'){

      if (this.state.step == 0) {
        let checkSecPwdResult = this.checkSecPassword();
        // console.log("## checkSecPwdResult: " + checkSecPwdResult);

        if (checkSecPwdResult == 1) {
          this.setState({ msg: string.secPasswordStrength });
          return;
        } else if (checkSecPwdResult == 2) {
          this.setState({ msg: string.secPasswordConfirmFail });
          return;
        }

        this.changePassword();
        return;
      }
    }
  };
  
  onChangeText = (text, type) => {
    if (type === 'password') this.setState({ pwd1: text.toLowerCase() });
    else this.setState({ pwd2: text.toLowerCase() });
  };

  getTitle() {
    if (this.props.mode == 'FIND_ID_PW') return string.findIdPassword;
    if (this.props.mode == 'CHANGE_PW') return string.changePassword;
    if (this.props.mode == 'FIND_SECPW') return string.findSecPassword;
    if (this.props.mode == 'CHANGE_SECPW') return string.changeSecPassword;
    if (this.props.mode == 'CHANGE_OTP') return string.changeOtp;
  }

  getMnemonicGuideTitle() {
    if (this.props.mode == 'FIND_ID_PW') return string.mnemonicGuideFindIdPw[this.state.step];
    if (this.props.mode == 'CHANGE_PW') return string.mnemonicGuideChangePw[this.state.step];
    if (this.props.mode == 'FIND_SECPW') return string.mnemonicGuideFindSecPw[this.state.step];
    if (this.props.mode == 'CHANGE_SECPW') return string.mnemonicGuideChangeSecPw[this.state.step];
    if (this.props.mode == 'CHANGE_OTP') return string.mnemonicGuideChangeOtp[this.state.step];
  }

  getLastStep = () => {
    if (this.props.mode == 'FIND_ID_PW') return 2;
    if (this.props.mode == 'CHANGE_PW') return 1;
    if (this.props.mode == 'FIND_SECPW') return 2;
    if (this.props.mode == 'CHANGE_SECPW') return 1;
    if (this.props.mode == 'CHANGE_OTP') return 1;
  }

  findId() {
    if (!this.state.certiVerified) return;
    // let pk = Coin.wordToSeed(this.state.recoverWords);

    httpPost(httpUrl.userFindId, [], { token: this.certiCodeToken, code: this.state.form.certiCode }).then((result)=>{
      // console.log("## findId result: " + JSON.stringify(result));
      result = result.data;

      if (result.result){
        this.setState({step: this.state.step + 1, msg: '', email: result.id[0], emails: result.id});

      } else {
        let message = string.mnemonicError;
        if (result.reason == 'INVALID_CODE') message = string.mnemonicErrorWrongSms;
        if (result.reason == 'NO_USER') message = string.mnemonicErrorWrongUser;

        Toast.show(message);
      }
    }).catch(e=>{
      console.log ("## findId error: " + e);
    });
  }

  findSecPassword = () => {
    // let pk = Coin.wordToSeed(this.state.recoverWords);

    let password = this.state.form.password + this.props.email;
    let passwordHash = crypto
      .createHash('sha256')
      .update(password, 'utf8')
      .digest()
      .toString('hex');
    
    // console.log("## find secPassword pk seed: " + this.state.form.password + this.props.email);
    // console.log("## find secPassword pk: " + pk);

    httpPost(httpUrl.findSecPassword, [], { token: this.certiCodeToken, code: this.state.form.certiCode, newPassword: passwordHash }).then((result)=>{
      // console.log("## findSecPassword result: " + JSON.stringify(result));
      result = result.data;

      if (result){
        this.setState({step: this.state.step + 1, msg: ''});

      } else {
        let message = string.mnemonicErrorFailFindSecPassword;

        Toast.show(message);
      }
    }).catch(e=>{
      console.log ("## findSecPassword error: " + e);
    });

  }

  changePassword() {
    let password = this.state.form.password + this.state.email;
    let passwordHash = crypto.createHash('sha256').update(password, 'utf8').digest().toString('hex');
    
    // console.log("## changePassword pk: " + pk);
    // console.log("## newPassword + email: " + password);
    // console.log("## newPasswordHash: " + passwordHash);

    if (this.props.mode == 'FIND_ID_PW'){
      // let pk = Coin.wordToSeed(this.state.recoverWords);
      httpPost(httpUrl.userFindPassword, [], { id: this.state.email, token: this.certiCodeToken, code: this.state.form.certiCode, newPassword: passwordHash }).then((result)=>{
        result = result.data;
        // console.log("## userFindPassword result: " + JSON.stringify(result));
        if (result.result){
          this.setState({step: this.state.step + 1, msg: ''});
          
        } else {
          let message = string.changePasswordFailed;
          if (result.reason == 'INVALID_CODE') message = string.mnemonicErrorWrongSms;
          if (result.reason == 'NO_USER') message = string.mnemonicErrorWrongUser;
          
          Toast.show(message);
        }  
      }).catch(e=>{
        console.log ("## userFindPassword error: " + e);
      });

    } else if (this.props.mode == 'CHANGE_PW'){

      let currentPassword = this.state.form.currentPassword + this.state.email;
      let currentPasswordHash = crypto.createHash('sha256').update(currentPassword, 'utf8').digest().toString('hex');

      httpPost(httpUrl.changePassword, [], { password: currentPasswordHash, newPassword: passwordHash }).then((result)=>{
        result = result.data;
        // console.log("## changePassword result: " + JSON.stringify(result));
        if (result.result){
          this.setState({step: this.state.step + 1, msg: ''});
          
        } else {
          let message = string.changePasswordFailed;
          if (result.reason == 'SAME_PASSWORD') message = string.changePasswordFailedSamePassword;
          if (result.reason == 'INVALID_PASSWORD') message = string.changePasswordFailedInvalidPassword;
          
          Toast.show(message);
        }
      }).catch(e=>{
        console.log ("## changePassword error: " + e);
      });
    
    } else if (this.props.mode == 'CHANGE_SECPW'){

      let currentSecPassword = this.state.form.currentPassword + this.state.email;
      let currentSecPasswordHash = crypto.createHash('sha256').update(currentSecPassword, 'utf8').digest().toString('hex');

      httpPost(httpUrl.changeSecPassword, [], { password: currentSecPasswordHash, newPassword: passwordHash }).then((result)=>{
        result = result.data;
        // console.log("## changePassword result: " + JSON.stringify(result));
        if (result.result){
          this.setState({step: this.state.step + 1, msg: ''});
          
        } else {
          let message = string.changeSecPasswordFailed;
          if (result.reason == 'SAME_PASSWORD') message = string.changeSecPasswordFailedSamePassword;
          if (result.reason == 'INVALID_PASSWORD') message = string.changeSecPasswordFailedInvalidPassword;
          
          Toast.show(message);
        }
  
      }).catch(e=>{
        console.log ("## changeSecPassword error: " + e);
      });
    }
  }

  changeOtp = () => {
    // let pk = Coin.wordToSeed(this.state.recoverWords);
    // console.log("## changeOtp pk: " + pk);

    httpPost(httpUrl.walletOtpChangeKey, [], { token: this.certiCodeToken, code: this.state.form.certiCode }).then((result)=>{
      result = result.data;
      // console.log("## userChangeOtp result: " + JSON.stringify(result));
      if (result.result){
        Navigation.dismissModal(this.props.componentId);

        this.props.setLoginInfoSecurityLevel(1);
        this.props.setOtpOff();
        
      } else {
        let message = string.changeOtpFailed;
        
        Toast.show(message);
      }  
    }).catch(e=>{
      console.log ("## userFindPassword error: " + e);
    });
  }

  checkPhone = () => {
    if (this.state.form.phone == undefined || this.state.form.phone == '' || this.state.form.phone.length < 9)
      return 1;

    return 0;
  };
  onPressSendCertiCode = () => {
    if (this.state.certiVerified) return;
    if (this.state.onTimer) return;

    let checkPhoneResult = this.checkPhone();
    console.log('## checkPhoneResult: ' + checkPhoneResult);

    if (checkPhoneResult == 1) {
      this.setState({ msg: string.phoneFail });
      return;
    }

    this.setState({ msg: '' });

    let fullPhone = this.state.form.phone.replace(/^-/, "");
    // let fullPhone = this.state.form.countryCode + this.state.form.phone.replace(/^0/, "");

    httpPost(httpUrl.userPhoneauthGenerate, [], {phone: fullPhone}).then((result)=>{
      console.log("## userPhoneauthGenerate result: " + JSON.stringify(result));
      result = result.data.token;
      this.certiCodeToken = result;
      if(result && result != ''){
        this.setState({ onTimer: true, phoneEditable: false });    
        this.interval = setInterval(
          () => {
            if(this.state.timer == 0){
              clearInterval(this.interval);
              this.setState({ onTimer: false, timer: 180});
              return;
            }
            this.setState({ timer: this.state.timer - 1 });
          },
          1000
        );
      } else {
        Toast.show(string.certiCodeSendFail);
        console.log("## userPhoneauthGenerate server error");
      }

    }).catch(e=>{
      console.log ("## userPhoneauthGenerate error: " + e)
    });
  }
  
  checkCertiCode = () => {
    if (this.state.form.certiCode == undefined || this.state.form.certiCode == '')
      return 1;
    return 0;
  };
  onPressCheckCertiCode = () => {

    if (this.state.certiVerified) return;

    let checkCertiCodeResult = this.checkCertiCode();
    if (checkCertiCodeResult == 1) {
      this.setState({ msg: string.certiCodeFail });
      return;
    }

    this.setState({ msg: '' });

    httpGet(httpUrl.userPhoneauthCheck, [this.certiCodeToken, this.state.form.certiCode], {}).then((result)=>{
      console.log("## userPhoneauthCheck result: " + JSON.stringify(result));
      result = result.data;

      if(result.responseCode == "SUCCESS"){
        this.setState({ certiVerified: true });
      } else {
        console.log("## userPhoneauthCheck server error");
        this.setState({certiCode: ''});

        let message = string.certiCodeWrong;
        if(result.responseCode == 'EXPIRED') message = string.certiCodeExpired;

        Toast.show(message);
      }

    }).catch(e=>{
      console.log ("## userPhoneauthCheck error: " + e)
    });    
  }

  renderContent() {
    let idx = 0;
    let row = [];
    
    for (let i = 0; i < 4; i++) {
      let col = [];
      for (let j = 0; j < 3; j++) {
        let idx = 3 * i + j;
        let num = idx + 1;
        num < 10 && (num = '0' + num);
        let recoverWords = this.state.recoverWords;
        col.push(
          <View style={{ width: 100, height: 30, borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center' }} key={idx}>
            <View style={{ height: 7 }} />
            {/* <TextField label={num + ''} labelHeight={0} inputContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} maxLength={12} activeLineWidth={0}
              lineWidth={0} animationDuration={0} baseColor="#c8c7c7" tintColor={color.mainColor} keyboardType="default" style={{ textAlign: 'center', flex: 1, marginTop: 3 }}
              onChangeText={text => {
                recoverWords[idx] = text;
                this.setState({ recoverWords: recoverWords });
              }}              
              value={this.state.recoverWords[idx]}
            /> */}
          </View>
        );
      }
      row.push(
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20.1 }} key={i}>
          {col}
        </View>
      );
    }

    return (
      // this.renderInfo()
      <View>
        <View style={{ height: 10 }} />

        {this.state.step == 0 && (this.props.mode == 'FIND_ID_PW' || this.props.mode == 'FIND_SECPW' || this.props.mode == 'CHANGE_OTP') && (
          // <View>{row}</View>
          <View>
            <View>
              <BasicInput
                title={string.phone}
                keyboardType={'number-pad'}
                placeholder={string.inputPhone}
                onChangeText={text => {
                  this.state.form.phone = text.replace(/[^0-9]+/g,'');
                  this.setState({ form: this.state.form });
                }}
                editable={this.state.phoneEditable}
                value={this.state.form.phone}
                error={this.state.formError.phone}
                button={this.state.certiVerified ? string.completed : (this.state.onTimer ? this.state.timer : string.sendCertiCode)}
                onPress={() => {this.onPressSendCertiCode()}}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <BasicInput
                title={string.certiCode}
                keyboardType={'number-pad'}
                placeholder={string.inputCertiCode}
                onChangeText={text => {
                  this.state.form.certiCode = text.replace(/[^0-9]+/g,'');
                  this.setState({ form: this.state.form });
                }}
                editable={!this.state.certiVerified}
                value={this.state.form.certiCode}
                error={this.state.formError.certiCode}
                button={this.state.certiVerified ? string.completed : string.checkCertiCode}
                onPress={() => { this.onPressCheckCertiCode() }}
              />
            </View>  

          </View>
        )}

        {this.state.step == 1 && (this.props.mode == 'FIND_ID_PW' || this.props.mode == 'FIND_SECPW') && (  
          <View>
            {this.props.mode == 'FIND_ID_PW' && (
              <View>
                <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 5, borderWidth: 0.7, borderColor: '#b7b7b7'}}>
                  <View style={{ width: 80, marginLeft: 16 }}>
                    <Text style={[styles.text]}>{string.email2}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    {this.state.emails.length > 1 && (
                    <Picker
                      style={{
                        flex: 1,
                        height: Platform.OS === 'ios' ? 88 : 44,
                        color: color.black,
                        // backgroundColor: '#e9eefa',
                        borderColor: '#e9eefa',
                      }}
                      itemStyle={{ color: color.black, fontSize: 11, height: Platform.OS === 'ios' ? 88 : 44, }}
                      selectedValue={this.state.email}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({ email: itemValue });
                      }}>
                      {this.state.emails.map(data => {
                        return (
                          <Picker.Item key={data} label={data} value={data} />
                        );
                      })}
                    </Picker>
                    )}
                    {this.state.emails.length == 1 && (
                    <Text style={{ fontSize: 14.7, color: '#2d67ff', letterSpacing: -0.05 }}>
                      {this.state.email}
                    </Text>
                    )}
                  </View>
                </View>
                <View style={{ height: 10 }} />
              </View>
            )}
            
            <View style={{ marginTop: 13.4 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={this.props.mode == 'FIND_ID_PW' ? string.inputNewPassword : string.inputNewSecPassword}
                secureText={true}
                keyboardType={this.props.mode == 'FIND_ID_PW' ? 'default' : 'numeric'}
                onChangeText={text => {
                  if (this.props.mode == 'FIND_SECPW' && text.length > 4) return;
                  this.state.form.password = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password}
                error={this.state.formError.password}
              />
            </View>
            <View style={{ marginTop: 6.7 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={this.props.mode == 'FIND_ID_PW' ? string.inputNewPasswordConfirm : string.inputNewSecPasswordConfirm}
                secureText={true}
                keyboardType={this.props.mode == 'FIND_ID_PW' ? 'default' : 'numeric'}
                onChangeText={text => {
                  if (this.props.mode == 'FIND_SECPW' && text.length > 4) return;
                  this.state.form.password2 = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password2}
                error={this.state.formError.password2}
              />
            </View>

            {this.props.mode == 'FIND_ID_PW' && (
              <View style={{ marginTop: 3.3 }}>
                <Text style={{ fontSize: 12, textAlign: 'left' }}>
                  {string.inputPasswordRule}
                </Text>
              </View>
            )}
          </View>
        )}

        {this.state.step == 0 && (this.props.mode == 'CHANGE_PW' || this.props.mode == 'CHANGE_SECPW') && (  
          <View>
            <View style={{ marginTop: 13.4 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder= {this.props.mode == 'CHANGE_PW' ? string.inputCurrentPassword : string.inputCurrentSecPassword}
                secureText={true}
                keyboardType={this.props.mode == 'CHANGE_PW' ? 'default' : 'numeric'}
                onChangeText={text => {
                  if (this.props.mode == 'CHANGE_SECPW' && text.length > 4) return;
                  this.state.form.currentPassword = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.currentPassword}
                error={this.state.formError.currentPassword}
              />
            </View>
            <View style={{ marginTop: 13.4 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={this.props.mode == 'CHANGE_PW' ? string.inputNewPassword : string.inputNewSecPassword}
                secureText={true}
                keyboardType={this.props.mode == 'CHANGE_PW' ? 'default' : 'numeric'}
                onChangeText={text => {
                  if (this.props.mode == 'CHANGE_SECPW' && text.length > 4) return;
                  this.state.form.password = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password}
                error={this.state.formError.password}
              />
            </View>
            <View style={{ marginTop: 6.7 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={this.props.mode == 'CHANGE_PW' ? string.inputNewPasswordConfirm : string.inputNewSecPasswordConfirm}
                secureText={true}
                keyboardType={this.props.mode == 'CHANGE_PW' ? 'default' : 'numeric'}
                onChangeText={text => {
                  if (this.props.mode == 'CHANGE_SECPW' && text.length > 4) return;
                  this.state.form.password2 = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password2}
                error={this.state.formError.password2}
              />
            </View>
            {this.props.mode == 'CHANGE_PW' && (
              <View style={{ marginTop: 3.3 }}>
                <Text style={{ fontSize: 12, textAlign: 'left' }}>
                  {string.inputPasswordRule}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* {this.state.step == 2 && (
          <View>
            <View style={{ height: 10 }} />
            <View>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={string.inputSecPassword}
                secureText={true}
                keyboardType={'numeric'}
                onChangeText={text => {
                  this.state.form.secPassword = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.secPassword}
                error={this.state.formError.secPassword}
              />
            </View>
            <View style={{ marginTop: 6.7 }}>
              <BasicInput
                icon="lock"
                resetable={true}
                placeholder={string.inputSecPasswordConfirm}
                secureText={true}
                keyboardType={'numeric'}
                onChangeText={text => {
                  this.state.form.secPassword2 = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.secPassword2}
                error={this.state.formError.secPassword2}
              />
            </View>
            <View style={{ marginTop: 13.4 }}>
              <BasicInput
                icon="user"
                resetable={true}
                placeholder={string.inputRecommendCode}
                onChangeText={text => {
                  this.state.form.recommendCode = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.recommendCode}
                error={this.state.formError.recommendCode}
              />
            </View>
            <View style={{ marginTop: 3.3 }}>
              <Text style={{ fontSize: 12, textAlign: 'left' }}>
                {string.inputRecommendCodeComment}
              </Text>
            </View>
          </View>
        )} */}

      </View>
    )
  }
  
  checkPassword = () => {
    let strongRegex = new RegExp(
      '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,15}$'
    );

    if (this.state.form.password == undefined || this.state.form.password == '') return 1;
    if (!strongRegex.test(this.state.form.password)) return 3;    
    if (this.state.form.password != this.state.form.password2) return 2;
    
    return 0;
  };

  checkSecPassword = () => {
    let strongRegex = new RegExp(
      '^(?=.*[0-9]).{4}$'
    );

    if (!strongRegex.test(this.state.form.password)) return 1;
    if (this.state.form.password != this.state.form.password2) return 2;

    return 0;
  };

  render() {
    return (
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.dialogContainer} activeOpacity={1}>
        <View style={styles.dialog}>
          <View style={{ backgroundColor: color.white }}>
            <View style={{ marginHorizontal: 15, marginTop: 15 }}>
              <Text
                style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}
              >
                {this.getTitle()}
              </Text>
              <View
                style={{
                  width: 23,
                  height: 2,
                  backgroundColor: color.mainColor,
                  marginTop: 20,
                  marginBottom: 15
                }}
              />
              <Text
                style={[
                  layout.contentText,
                  { fontSize: 16, marginTop: 20, textAlign: 'left' }
                ]}
              >
                {this.getMnemonicGuideTitle()}
              </Text>
            </View>
            <View style={{ padding: 15 }}>{this.renderContent()}</View>
            <Text
              style={[
                layout.contentText,
                {
                  paddingHorizontal: 15,
                  fontSize: 14,
                  color: '#fd585b',
                  marginBottom: this.state.msg === '' ? 0 : 10
                }
              ]}
            >
              {this.state.msg}
            </Text>

            {this.state.step === this.getLastStep() ? (
              <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 20 }}>
                <CircleButton
                  title={string.ok}
                  gradient={['#5663ff', '#5663ff']}
                  onPress={() => {
                    Navigation.dismissModal(this.props.componentId);
                  }}
                />
                {/* <TouchableOpacity
                  style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                  onPress={() => {
                    Navigation.dismissModal(this.props.componentId);
                  }}
                >
                  <Text style={[layout.buttonText, { color: '#2d67ff' }]}>
                    {string.ok}
                  </Text>
                </TouchableOpacity> */}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', padding: 20 }}>
                <CircleButton
                  title={string.cancel}
                  style={{
                    backgroundColor: color.lightgray,
                    marginRight: 10,
                    height: 41,
                  }}
                  color={color.gray}
                  onPress={() => {
                    Navigation.dismissModal(this.props.componentId);
                  }}
                />
                <CircleButton
                  title={
                    this.state.step === 0 ? string.next : string.changePassword
                  }
                  gradient={['#5663ff', '#5663ff']}
                  onPress={() => {
                    this.onClickNext();
                  }}
                />
                {/* <TouchableOpacity
                  style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                  onPress={() => {
                    Navigation.dismissModal(this.props.componentId)
                  }}>
                  <Text style={[ layout.buttonText, { color: '#000' } ]} >
                    {this.state.step === 0 ? string.cancel : string.close}
                  </Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: '#dadada' }} />
                <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                  onPress={() => {
                    this.onClickNext()
                  }}>
                  <Text style={[ layout.buttonText, { color: '#2d67ff' } ]} >
                    {this.props.mode === 'FIND_ID_PW' && this.state.step === 0 && string.next}
                    {this.props.mode === 'FIND_ID_PW' && this.state.step === 1 && string.changePassword}
                    {this.props.mode === 'CHANGE_PW' && this.state.step === 0 && string.changePassword}
                    {this.props.mode === 'CHANGE_SECPW' && this.state.step === 0 && string.changePassword}
                  </Text>
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    width: deviceWidth * 0.92,
    backgroundColor: '#ffffffff',
    minHeight: 96,
    borderRadius: 5,
  },
  dialogContainer: {
    width: deviceWidth,
    height: deviceHeight,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: "center"
  },
  roundTextStyle: {
    fontSize: 12,
    letterSpacing: -0.05,
    textAlign: 'center'
  },
  roundStyle: {
    width: deviceWidth * 0.28 - 30,
    height: 30
  },
  textCenter: { flexDirection: 'row', justifyContent: 'center' }
});

export default mnemonicDialog;
