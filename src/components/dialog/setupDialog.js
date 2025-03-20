import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Picker,
  NativeModules,
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
import { httpGet, httpPost, httpUrl, httpPut } from '../../api/httpClient';
import Toast from '../../lib/util/toast';
import con from '../../const';

import BasicInput from '../input/BasicInput';
import BasicButton from '../button/BasicButton';
import BasicCheckBox from '../checkbox/BasicCheckBox';

import { Navigation } from 'react-native-navigation';
import color from '../../res/color';
import CircleButton from './../button/CircleButton';
import Bar from '../common/Bar';
import ScalableImage from 'react-native-scalable-image';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class SetupDialogContent extends Component {
  //스텝
  //0 초기설정 안내
  //1 복구단어선택
  //2 패스워드입력
  //3 태깅
  //4 완료
  constructor(props) {
    super(props);
    string = Language.getString();
    let words = Coin.generateWords();
    this.initialWords = [...words];
    this.requesting = false;
    this.state = {
      supported: true,
      enabled: true,
      step: 0,
      steps: [],
      registType: 0, //0-신규등록, 1-카드복구
      words: words,
      selectedWords: [],//7스텝 넘어가기전에 선택한단어 랜덤순서로 설정
      selectedConfirmWords: [],//7스텝에서 사용자가 선택한 단어 순서로 입력
      recoverWords: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      msg: '',
      agreementChecked: false,
      agreementShowed: false,
      form: {
        email: '',
        password: '',
        password2: '',
        name: '',
        country: '',
        countryCode: '82-',
        phone: '',
        certiCode: '1111',
        secPassword: '',
        secPassword2: '',
        recommendCode: '',
      },
      readChecked: false,
      formError: {},
      bar1: true,
      bar2: false,
      bar3: false,
      bar4: false,
      bar5: false,
      bar6: false,
      bar7: false,
      barSize: 4,
      barStep: 0,
      timer: 180,
      onTimer: false,
      certiVerified: true,
      phoneEditable: true,
      emailDuplCheck: false,
      recommenderCheck: false,
    };

    this.state.steps.push("policy");
    this.state.steps.push("id");
    if (con.enableNamePhone) {
      this.state.steps.push("namePhone");
      this.state.barSize++
    }
    this.state.steps.push("secpw");
    if (con.enableRecommender) {
      this.state.steps.push("recommender");
      this.state.barSize++
    }
    // this.state.steps.push("mnemonicPolicy");
    // this.state.steps.push("mnemonic");
    // this.state.steps.push("mnemonicCheck");
    this.state.steps.push("welcome");
  }
  componentDidMount() {
    // NativeModules.KakaoInterface.getRecommenderCode((code) => {
    //   this.state.form.recommendCode = code;
    //   this.setState({ form: this.state.form });
    // })
  }
  onClickPrev = () => {
    if (this.state.steps[this.state.step] !== "mnemonicPolicy" && this.state.steps[this.state.step] !== "mnemonicCheck")
      this.state.barStep--;

    this.setState({
      barStep: this.state.barStep,
      step: this.state.step - 1,
      msg: '',
    });
  };

  onClickNext = () => {
    //////////// 테스트용!! 유효성 확인 바이패스 ////////////
    // if (this.state.steps[this.state.step] == "mnemonic") {
    //   //shuffle
    //   let shuff = this.state.words.slice();
    //   for (let i = shuff.length - 1; i > 0; i--) {
    //     let j = Math.floor(Math.random() * (i + 1));
    //     [shuff[i], shuff[j]] = [shuff[j], shuff[i]];
    //   }
    //   this.setState({selectedWords: shuff, selectedConfirmWords: []});

    // } else if (this.state.steps[this.state.step] == "welcome") {
    //   Navigation.dismissModal(this.props.componentId);      
    // }

    // if(this.state.steps[this.state.step + 1] !== "mnemonicPolicy" && this.state.steps[this.state.step + 1] !== "mnemonicCheck")
    //   this.state.barStep++;

    // this.setState({
    //   barStep: this.state.barStep,
    //   step: this.state.step + 1,
    //   msg: '',
    // });
    // return;
    ///////////////////////////////////////////////////////

    if (this.state.steps[this.state.step] == "policy") {
      if (!this.state.agreementChecked) {
        this.setState({ msg: string.needAgreement });
        return;
      }

    } else if (this.state.steps[this.state.step] == "id") {
      let checkEmailResult = this.checkEmail();
      console.log('## checkEmailResult: ' + checkEmailResult);

      if (checkEmailResult == 1) {
        this.setState({ msg: string.emailLengthFail });
        return;
      } else if (checkEmailResult == 2) {
        this.setState({ msg: string.emailStrength });
        return;
      }

      let checkPwdResult = this.checkPassword();
      console.log('## checkPwdResult: ' + checkPwdResult);

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

      if (!this.state.emailDuplCheck) {
        this.setState({ msg: string.needEmailDuplCheck });
        return;
      }

    } else if (this.state.steps[this.state.step] == "namePhone") {
      let checkNameResult = this.checkName();
      console.log('## checkNameResult: ' + checkNameResult);

      if (checkNameResult == 1) {
        this.setState({ msg: string.nameFail });
        return;
      }

      let checkPhoneResult = this.checkPhone();
      console.log('## checkPhoneResult: ' + checkPhoneResult);

      if (checkPhoneResult == 1) {
        this.setState({ msg: string.phoneFail });
        return;
      }

      if (!this.state.certiVerified) {
        this.setState({ msg: string.certiCodeNotVerified });
        return;
      }

      let checkCertiCode = this.checkCertiCode();
      console.log('## checkCertiCode: ' + checkCertiCode);

      if (checkPhoneResult == 1) {
        this.setState({ msg: string.certiCodeFail });
        return;
      }
    } else if (this.state.steps[this.state.step] == "secpw") {
      let checkSecPwdResult = this.checkSecPassword();
      console.log('## checkSecPwdResult: ' + checkSecPwdResult);

      if (checkSecPwdResult == 1) {
        this.setState({ msg: string.secPasswordStrength });
        return;
      } else if (checkSecPwdResult == 2) {
        this.setState({ msg: string.secPasswordConfirmFail });
        return;
      }

    } else if (this.state.steps[this.state.step] == "recommender") {
      this.recommenderCheck = false;
      this.checkRecommender().then(() => {
        if (this.recommenderCheck) {
          // this.setState({
          //   step: this.state.step + 1,
          //   msg: '',
          // });
          this.signUp();
          return;
        } else {
          this.setState({ msg: string.notAvailableRecommender });
        }
      })
        .catch(e => { });
      return;

    } else if (this.state.steps[this.state.step] == "mnemonicPolicy") {
      if (!this.state.readChecked) {
        this.setState({ msg: string.needViewAgreement });
        return;
      }

    } else if (this.state.steps[this.state.step] == "mnemonic") {

      if (!this.checkChangeCount()) {
        this.setState({ msg: string.needChangeWord });
        return;
      }

      //shuffle
      let shuff = this.state.words.slice();
      for (let i = shuff.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuff[i], shuff[j]] = [shuff[j], shuff[i]];
      }
      this.setState({ selectedWords: shuff, selectedConfirmWords: [] });

    } else if (this.state.steps[this.state.step] == "mnemonicCheck") {

      //순서확인
      let confirmWordsFlag = true;
      if (this.state.selectedConfirmWords.length != 12) confirmWordsFlag = false;
      else {
        for (let i = 0; i < 12; i++) {
          if (this.state.words[i] != this.state.selectedConfirmWords[i]) confirmWordsFlag = false;
        }
      }
      if (!confirmWordsFlag) {
        this.setState({ msg: string.mnemonicValidationFailed });
        return;
      }

      // this.signUp();
      return;

    } else if (this.state.steps[this.state.step] == "welcome") {
      Navigation.dismissModal(this.props.componentId);

    }


    if (this.state.steps[this.state.step + 1] !== "mnemonicPolicy" && this.state.steps[this.state.step + 1] !== "mnemonicCheck")
      this.state.barStep++;

    this.setState({
      barStep: this.state.barStep,
      step: this.state.step + 1,
      msg: '',
    });
  };

  getTitle() {
    return this.state.registType == 0
      ? string.setupStepTitle[this.state.step]
      : string.setupStepRecoverTitle;
  }

  signUp(callback) {
    let pk = '0000';
    // if (this.state.registType == 0)
    //   pk = Coin.wordToSeed(this.state.words, this.state.form.password);
    // else
    //   pk = Coin.wordToSeed(this.state.recoverWords, this.state.form.password);

    let password = this.state.form.password + this.state.form.email;
    let secPassword = this.state.form.secPassword + this.state.form.email;

    let passwordHash = crypto
      .createHash('sha256')
      .update(password, 'utf8')
      .digest()
      .toString('hex');

    let secPasswordHash = crypto
      .createHash('sha256')
      .update(secPassword, 'utf8')
      .digest()
      .toString('hex');

    // let fullPhone = this.state.form.countryCode + this.state.form.phone.replace(/^0/, "");

    // console.log("## signUp deviceId: " + this.state.form.email);
    // console.log("## signUp email: " + this.state.form.email);
    // console.log("## signUp phone: " + fullPhone);
    // console.log("## signUp recommender: " + this.state.form.recommendCode);
    // console.log("## signUp mnemonic: " + pk);
    // console.log("## signUp password + email: " + password);
    // console.log("## signUp passwordHash: " + passwordHash);
    // console.log("## signUp secPasswordHash + email: " + secPassword);
    // console.log("## signUp secPasswordHash: " + secPasswordHash);
    if (this.requesting) return;
    this.requesting = true;
    httpPost(httpUrl.signUp, [], {
      deviceId: getUniqueId(),
      id: this.state.form.email,
      mnemonic: pk,
      password: passwordHash,
      name: this.state.form.name,
      phone: this.state.form.phone,
      recommender: this.state.form.recommendCode,
      securityPassword: secPasswordHash,

    }).then((result) => {
      console.log("## signUp result: " + JSON.stringify(result));
      result = result.data;

      if (result.result) {
        this.setState({
          step: this.state.step + 1,
          msg: ''
        });

      } else {
        let message = string.signUpErrorMessage;
        if (result.reason == 'DUPLICATE') message = string.signUpErrorIdDuplication;
        else if (result.reason == 'WRONG_EMAIL_TYPE') message = string.signUpErrorInvalidEmailType;
        else if (result.reason == 'MAX_PHONE') message = string.signUpErrorMaxPhone;

        Navigation.showModal({
          component: {
            name: 'navigation.BasicAlertDialog',
            passProps: {
              title: string.loginFailedTitle,
              message: message,
            },
            options: {
              topBar: { drawBehind: true, visible: false },
              screenBackgroundColor: 'transparent',
              modalPresentationStyle: 'overCurrentContext'
            }
          }
        });
      }
      this.requesting = false;
    }).catch(e => {
      this.requesting = false;
      console.log("## signUp error: " + e)
    });
  }

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

    httpPost(httpUrl.userPhoneauthGenerate, [], { phone: fullPhone }).then((result) => {
      console.log("## userPhoneauthGenerate result: " + JSON.stringify(result));
      result = result.data.token;
      this.certiCodeToken = result;
      if (result && result != '') {
        this.setState({ onTimer: true, phoneEditable: false });
        this.interval = setInterval(
          () => {
            if (this.state.timer == 0) {
              clearInterval(this.interval);
              this.setState({ onTimer: false, timer: 180 });
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

    }).catch(e => {
      console.log("## userPhoneauthGenerate error: " + e)
    });
  }

  onPressCheckCertiCode = () => {

    if (this.state.certiVerified) return;

    let checkCertiCodeResult = this.checkCertiCode();
    if (checkCertiCodeResult == 1) {
      this.setState({ msg: string.certiCodeFail });
      return;
    }

    this.setState({ msg: '' });

    httpGet(httpUrl.userPhoneauthCheck, [this.certiCodeToken, this.state.form.certiCode], {}).then((result) => {
      console.log("## userPhoneauthCheck result: " + JSON.stringify(result));
      result = result.data;

      if (result.responseCode == "SUCCESS") {
        this.setState({ certiVerified: true });
      } else {
        console.log("## userPhoneauthCheck server error");
        this.setState({ certiCode: '' });

        let message = string.certiCodeWrong;
        if (result.responseCode == 'EXPIRED') message = string.certiCodeExpired;

        Toast.show(message);
      }

    }).catch(e => {
      console.log("## userPhoneauthCheck error: " + e)
    });
  }

  onPressEmailDuplCheck = () => {

    if (this.state.emailDuplCheck) return;

    httpGet(httpUrl.userCheckEmail, [this.state.form.email]).then((result) => {
      console.log("## onPressEmailDuplCheck result: " + JSON.stringify(result));
      result = result.data;

      if (result == "SUCCESS") {
        this.setState({ emailDuplCheck: true, msg: '' });

      } else {
        console.log("## onPressEmailDuplCheck error");

        let message = string.emailDuplCheckError;
        if (result == 'INVALID_EMAIL') message = string.emailDuplCheckErrorInvalidEmail;
        if (result == 'ALREADY_EXIST') message = string.emailDuplCheckErrorEmailDupl;

        Toast.show(message);
      }

    }).catch(e => {
      console.log("## userPhoneauthCheck error: " + e)
    });

  }

  renderUnitWord(idx) {
    if (idx == 11) return <View style={styles.roundStyle} key={idx} />;
    else {
      let num = idx + 1;
      num < 10 && (num = '0' + num);
      let textStyle = '';
      let borderStyle = '';
      let backgroundStyle = '';
      if (this.initialWords[idx] != this.state.words[idx]) {
        textStyle = {
          color: color.mainColor,
        };
        borderStyle = color.mainColor;
        backgroundStyle = '#fff';
      } else {
        textStyle = {
          color: '#000',
        };
        borderStyle = '#e0e0e0';
        backgroundStyle = '#e0e0e0';
      }
      return (
        <TouchableOpacity
          style={[
            styles.roundStyle,
            {
              borderColor: borderStyle,
              backgroundColor: backgroundStyle,
              borderRadius: 15,
              borderWidth: 1,
              justifyContent: 'center',
            },
          ]}
          key={idx}
          onPress={() => {
            this.onClickWord(idx);
          }}>
          <Text style={[styles.roundTextStyle, textStyle]}>
            {num}. {this.state.words[idx]}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  renderSelectedWords() {
    let output = [];
    for (let i = 0; i < this.state.selectedWords.length; i++) {
      output.push(
        <TouchableOpacity
          style={[
            styles.roundStyle,
            {
              borderColor: '#e0e0e0',
              backgroundColor: '#e0e0e0',
              borderRadius: 15,
              borderWidth: 1,
              justifyContent: 'center',
              marginTop: 6.7,
            },
          ]}
          key={i}
          onPress={() => {
            this.state.selectedConfirmWords.push(this.state.selectedWords[i]);
            this.state.selectedWords.splice(i, 1);
            this.setState({ selectedConfirmWords: this.state.selectedConfirmWords, selectedWords: this.state.selectedWords })
          }}>
          <Text style={[styles.roundTextStyle, '#000']}>
            {this.state.selectedWords[i]}
          </Text>
        </TouchableOpacity>)
    }
    for (let i = 0; i < 3 - (this.state.selectedWords.length % 3); i++) {
      output.push(
        // <View style={[ styles.roundStyle, { borderColor: '#fff', backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, justifyContent: 'center', marginTop: 6.7, },]} />
        <View style={styles.roundStyle} />
      )
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {output}
      </View>
    );
  }
  renderSelectedConfirmWords() {
    let output = [];
    for (let i = 0; i < this.state.selectedConfirmWords.length; i++) {
      output.push(
        <TouchableOpacity
          style={[
            styles.roundStyle,
            {
              borderColor: color.mainColor,
              backgroundColor: color.mainColor,
              borderRadius: 15,
              borderWidth: 1,
              justifyContent: 'center',
              marginTop: 6.7,
            },
          ]}
          key={i}
          onPress={() => {
            this.state.selectedWords.push(this.state.selectedConfirmWords[i]);
            this.state.selectedConfirmWords.splice(i, 1);
            this.setState({ selectedConfirmWords: this.state.selectedConfirmWords, selectedWords: this.state.selectedWords })
          }}>
          <Text style={[styles.roundTextStyle, { color: '#fff' }]}>
            {this.state.selectedConfirmWords[i]}
          </Text>
        </TouchableOpacity>)
    }
    for (let i = 0; i < 3 - (this.state.selectedConfirmWords.length % 3); i++) {
      output.push(
        // <View style={[ styles.roundStyle, { borderColor: '#fff', backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, justifyContent: 'center', marginTop: 6.7, },]} />
        <View style={styles.roundStyle} />
      )
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {output}
      </View>
    );
  }

  renderContent() {
    let idx = 0;
    let row = [];
    if (this.state.registType === 0) {
      for (let i = 0; i < 4; i++) {
        let col = [];
        for (let j = 0; j < 3; j++) {
          col.push(this.renderUnitWord(3 * i + j));
        }
        row.push(
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6.7,
            }}
            key={i}>
            {col}
          </View>
        );
      }
    } else {
      for (let i = 0; i < 6; i++) {
        let col = [];
        for (let j = 0; j < 4; j++) {
          let idx = 4 * i + j;
          let num = idx + 1;
          num < 10 && (num = '0' + num);
          let recoverWords = this.state.recoverWords;
          col.push(
            <View
              style={{
                width: 72,
                height: 30,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                justifyContent: 'center',
              }}
              key={idx}>
              <View style={{ height: 7 }} />
              <TextField
                label={num + ''}
                labelHeight={0}
                inputContainerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                maxLength={12}
                activeLineWidth={0}
                lineWidth={0}
                animationDuration={0}
                baseColor="#c8c7c7"
                tintColor={color.mainColor}
                keyboardType="default"
                onChangeText={text => {
                  recoverWords[idx] = text;
                  this.setState({ recoverWords: recoverWords });
                }}
                style={{ textAlign: 'center', flex: 1, marginTop: 3 }}
                value={this.state.recoverWords[idx]}
              />
            </View>
          );
        }
        row.push(
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6.7,
            }}
            key={i}>
            {col}
          </View>
        );
      }
    }

    let country = string.countryCode;

    return (
      <View>
        <View style={{ height: 10 }} />
        {this.state.steps[this.state.step] == "policy" && (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ alignItems: 'center', flexDirection: 'row' }}
              onPress={() => {
                if (this.state.agreementShowed) {
                  this.setState({
                    agreementChecked: !this.state.agreementChecked,
                  });
                } else {
                  Navigation.showModal({
                    component: {
                      name: 'navigation.InfoDialog2',
                      passProps: {
                        title: string.myinfoPolicy,
                        content: string.policyContent
                      },
                      options: {
                        topBar: { drawBehind: true, visible: false },
                        screenBackgroundColor: 'transparent',
                        modalPresentationStyle: 'overCurrentContext'
                      }
                    }
                  });
                  this.setState({
                    agreementChecked: !this.state.agreementChecked,
                    agreementShowed: true,
                    msg: ''
                  });
                }
              }}>
              <BasicCheckBox
                onClick={() => {
                  if (this.state.agreementShowed) {
                    this.setState({
                      agreementChecked: !this.state.agreementChecked,
                    });
                  } else {
                    Navigation.showModal({
                      component: {
                        name: 'navigation.InfoDialog2',
                        passProps: {
                          title: string.myinfoPolicy,
                          content: string.policyContent
                        },
                        options: {
                          topBar: { drawBehind: true, visible: false },
                          screenBackgroundColor: 'transparent',
                          modalPresentationStyle: 'overCurrentContext'
                        }
                      }
                    });
                    this.setState({
                      agreementChecked: !this.state.agreementChecked,
                      agreementShowed: true,
                      msg: ''
                    });
                  }
                }}
                isChecked={this.state.agreementChecked}
              />
              <Text style={{ textAlign: 'left', paddingLeft: 5 }}>
                {string.setupAreementConfirm}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Navigation.showModal({
                    component: {
                      name: 'navigation.InfoDialog2',
                      passProps: {
                        title: string.myinfoPolicy,
                        content: string.policyContent,
                      },
                      options: {
                        topBar: { drawBehind: true, visible: false },
                        screenBackgroundColor: 'transparent',
                        modalPresentationStyle: 'overCurrentContext',
                      },
                    },
                  });
                  this.setState({ agreementShowed: true, msg: '' });
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: -0.05,
                    color: '#fff',
                    backgroundColor: color.mainColor,
                    borderRadius: 5,
                    padding: 10,
                  }}>
                  {string.setupShowAgreement}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {this.state.steps[this.state.step] == "id" && (
          <View>
            <View style={{ height: 10 }} />
            <View>
              <BasicInput
                title={string.email}
                placeholder={string.inputEmail}
                keyboardType="email-address"
                onChangeText={text => {
                  this.state.form.email = text.toLowerCase().trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.email}
                error={this.state.formError.email}
                editable={!this.state.emailDuplCheck}
                button={this.state.emailDuplCheck ? string.completed : string.duplCheck}
                onPress={() => { this.onPressEmailDuplCheck() }}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <BasicInput
                title={string.password}
                placeholder={string.inputPassword}
                secureText={true}
                onChangeText={text => {
                  this.state.form.password = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password}
                error={this.state.formError.password}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <BasicInput
                title={string.passwordConfirm}
                placeholder={string.inputPasswordConfirm}
                secureText={true}
                secureText={true}
                onChangeText={text => {
                  this.state.form.password2 = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.password2}
                error={this.state.formError.password2}
              />
            </View>
            <View style={{ marginTop: 3.3 }}>
              <Text style={{ fontSize: 12, textAlign: 'left' }}>
                {string.inputPasswordRule}
              </Text>
            </View>
          </View>
        )}

        {this.state.steps[this.state.step] == "namePhone" && (
          <View>
            <View style={{ height: 10 }} />
            <View>
              <BasicInput
                title={string.name}
                keyboardType={'default'}
                placeholder={string.name}
                onChangeText={text => {
                  this.state.form.name = text.trim();
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.name}
                error={this.state.formError.name}
              // button={this.state.certiVerified ? string.completed : (this.state.onTimer ? this.state.timer : string.sendCertiCode)}
              // onPress={() => {this.onPressSendCertiCode()}}
              />
            </View>
            {/* <View style={{ height: 10 }} />
            <View style={{ borderWidth: 1, borderRadius: 5, borderColor: color.gray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: color.black, textAlign: 'center', paddingLeft: 10, fontSize: 20, }}>{string.country}</Text>
              <Picker style={{ width: 250, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                selectedValue={this.state.form.country}
                placeholder={this.state.form.country === '' && string.selectCountry}
                onValueChange={(itemValue, itemIndex) => {
                  this.state.form.country = itemValue;
                  this.state.form.countryCode = string.countryTelCode[itemIndex];
                  console.log(this.state.form.countryCode);
                  this.setState({ form: this.state.form });
                }}>
                {country.map(data => {
                  return (
                    <Picker.Item key={`country${data}`} label={string.countryName[data]} value={data}/>
                  );
                })}
              </Picker>
            </View> */}
            <View style={{ height: 10 }} />
            <View>
              <BasicInput
                title={string.phone}
                keyboardType={'number-pad'}
                placeholder={string.inputPhone}
                onChangeText={text => {
                  this.state.form.phone = text.replace(/[^0-9]+/g, '');
                  this.setState({ form: this.state.form });
                }}
                editable={this.state.phoneEditable}
                value={this.state.form.phone}
                error={this.state.formError.phone}
              // button={this.state.certiVerified ? string.completed : (this.state.onTimer ? this.state.timer : string.sendCertiCode)}
              // onPress={() => {this.onPressSendCertiCode()}}
              />
            </View>
            {/* <View style={{ marginTop: 15 }}>
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
            </View>    */}
          </View>
        )}

        {this.state.steps[this.state.step] == "secpw" && (
          <View>
            <View style={{ height: 10 }} />
            <View>
              <BasicInput
                title={string.secPassword}
                placeholder={string.inputSecPassword}
                secureText={true}
                keyboardType={'number-pad'}
                onChangeText={text => {
                  if (text.length > 4) return;
                  this.state.form.secPassword = text.replace(/[^0-9]+/g, '');
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.secPassword}
                error={this.state.formError.secPassword}
              />
            </View>
            <View style={{ marginTop: 6.7 }}>
              <BasicInput
                title={string.secPasswordConfirm}
                placeholder={string.inputSecPasswordConfirm}
                secureText={true}
                keyboardType={'number-pad'}
                onChangeText={text => {
                  if (text.length > 4) return;
                  this.state.form.secPassword2 = text.replace(/[^0-9]+/g, '');
                  this.setState({ form: this.state.form });
                }}
                value={this.state.form.secPassword2}
                error={this.state.formError.secPassword2}
              />
            </View>
          </View>
        )}

        {this.state.steps[this.state.step] == "recommender" && (
          <View>
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
            {/* <View style={{ marginTop: 3.3 }}>
              <Text style={{ fontSize: 12, textAlign: 'left' }}>
                {string.inputRecommendCodeComment}
              </Text>
            </View> */}
          </View>
        )}

        {this.state.steps[this.state.step] == "mnemonicPolicy" && (
          <View style={{ marginTop: -10 }}>
            <Text
              style={{
                color: color.mainColor,
                textAlign: 'center',
                fontSize: 25,
              }}>
              {string.mnemonicTitle}
            </Text>
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 14 }}>{string.mnemonicContent1}</Text>
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 14 }}>{string.mnemonicContent2}</Text>
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 14 }}>{string.mnemonicContent3}</Text>
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 14 }}>{string.mnemonicContent4}</Text>
            <View style={{ height: 20 }} />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
              onPress={() => {
                this.setState({ readChecked: !this.state.readChecked });
              }}>
              <BasicCheckBox
                style={{ marginRight: 10 }}
                isChecked={this.state.readChecked}
                onClick={() => {
                  this.setState({ readChecked: !this.state.readChecked });
                }}
              />
              <Text style={{ color: color.mainColor, fontSize: 14 }}>
                {string.readAgreement}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {this.state.steps[this.state.step] == "mnemonic" && (
          <View style={{ marginTop: 15 }}>
            <Text
              style={{
                color: color.mainColor,
                textAlign: 'center',
                fontSize: 20,
              }}>
              {string.mnemonicSelectionTitle}
            </Text>
            <View style={{ height: 20 }} />
            {this.state.registType == 0 && (
              <View
                style={{
                  backgroundColor: color.mainColor,
                  borderRadius: 30,
                  marginHorizontal: deviceWidth * 0.35 - 30,
                }}>
                <Text
                  style={[
                    styles.roundTextStyle,
                    { color: 'white', padding: 10 },
                  ]}>
                  12. {this.state.words[11]}
                </Text>
              </View>
            )}
            <View style={{ height: 10 }} />
            <View>{row}</View>
          </View>
        )}

        {this.state.steps[this.state.step] == "mnemonicCheck" && (
          <View>
            <Text
              style={{
                color: color.mainColor,
                textAlign: 'center',
                fontSize: 20,
              }}>
              {string.mnemonicValidationDescryption}
            </Text>
            <View style={{ height: 10 }} />
            <View style={{ height: 150 }}>{this.renderSelectedWords()}</View>
            <View style={{ height: 150 }}>{this.renderSelectedConfirmWords()}</View>
          </View>
        )}

        {this.state.steps[this.state.step] == "welcome" && (
          <View
            style={{
              // flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -20,
            }}>
            <Text style={{ fontSize: 30, textAlign: 'center' }}>
              {(global.language == 'ko' || global.language == 'ja') && <Text style={{ color: color.mainColor }}>{string.appTitle}</Text>}
              {string.setupFinish}
              {(global.language == 'zh' || global.language == 'en') && <Text style={{ color: color.mainColor }}>{string.appTitle}</Text>}
            </Text>
            <Text style={{ marginTop: 5, fontSize: 16, textAlign: 'center' }}>{string.setupFinish2}</Text>
          </View>
        )}
      </View>
    );
  }

  renderBars = () => {
    let bars = [];
    for (let i = 0; i < this.state.barSize; i++) {
      bars.push(<Bar text={(i + 1) + string.step} gradient={i > this.state.barStep ? false : true} />)
    }
    return bars;
  }

  onClickWord = idx => {
    if (idx == 11) return;

    this.state.words[idx] = Coin.nextWord(
      this.state.words[idx],
      idx == 0 ? 1024 : 2048
    );
    this.state.words[11] = Coin.getChecksumWord(this.state.words);
    this.setState({ words: this.state.words });
    if (this.checkChangeCount()) this.setState({ msg: '' });
  };

  checkChangeCount() {
    let diff = 0;
    for (let i = 0; i < this.initialWords.length; i++) {
      if (this.initialWords[i] != this.state.words[i]) diff++;
    }
    return diff > 5;
  }

  checkEmail = () => {
    let strongRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );

    if (this.state.form.email == undefined || this.state.form.email == '')
      return 1;
    if (!strongRegex.test(this.state.form.email)) return 2;

    return 0;
  };

  checkPassword = () => {
    let strongRegex = new RegExp(
      '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,15}$'
    );

    if (this.state.form.password == undefined || this.state.form.password == '')
      return 1;
    if (!strongRegex.test(this.state.form.password)) return 3;
    if (this.state.form.password != this.state.form.password2) return 2;

    return 0;
  };

  checkName = () => {
    if (this.state.form.name == undefined || this.state.form.name == '' || this.state.form.name.length < 2)
      return 1;

    return 0;
  };

  checkPhone = () => {
    if (this.state.form.phone == undefined || this.state.form.phone == '' || this.state.form.phone.length < 9)
      return 1;

    return 0;
  };
  checkCertiCode = () => {
    if (this.state.form.certiCode == undefined || this.state.form.certiCode == '')
      return 1;
    return 0;
  };
  checkSecPassword = () => {
    let strongRegex = new RegExp('^(?=.*[0-9]).{4}$');

    if (!strongRegex.test(this.state.form.secPassword)) return 1;
    if (this.state.form.secPassword != this.state.form.secPassword2) return 2;

    return 0;
  };

  checkRecommender = () => {
    console.log("##### get checkRecommender")

    return new Promise((resolve, reject) => {
      if (this.state.form.recommendCode == undefined || this.state.form.recommendCode == '') {
        console.log("## no recommend code")
        this.recommenderCheck = true;
        resolve();
        return;
      }

      httpGet(httpUrl.userCheckRecommender, [this.state.form.recommendCode]).then(result => {
        result = result.data;
        if (result) {
          this.recommenderCheck = result;
        }
        resolve();
      })
        .catch(e => {
          console.log('## get userCheckRecommender error: ' + e);
          reject();
        });
    });
  }

  render() {
    const { step } = this.state;
    const labels = string.setupStep;

    return (
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.dialogContainer} activeOpacity={1}>
          <View style={styles.dialog}>
            <View style={{ backgroundColor: color.white }}>
              <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 5
                  }}>
                  {this.state.steps[step] === "id" && (
                    <ScalableImage
                      style={{ marginVertical: 35 }}
                      width={deviceWidth * 0.2}
                      source={require('./../../img/regist/mail.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                  {/* {step === 2 && (
                  <ScalableImage
                    width={deviceWidth * 0.2}
                    source={require('./../../img/regist/password.png')}
                  />
                )} */}
                  {this.state.steps[step] === "namePhone" && (
                    <ScalableImage
                      style={{ marginVertical: 35 }}
                      width={deviceWidth * 0.13}
                      source={require('./../../img/regist/phone.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                  {this.state.steps[step] === "secpw" && (
                    <ScalableImage
                      style={{ marginVertical: 35 }}
                      width={deviceWidth * 0.2}
                      source={require('./../../img/regist/security.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                  {this.state.steps[step] === "recommender" && (
                    <ScalableImage
                      style={{ marginVertical: 35 }}
                      width={deviceWidth * 0.2}
                      source={require('./../../img/regist/recommend.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                  {this.state.steps[step] === "mnemonicPolicy" && (
                    <ScalableImage
                      style={{ marginVertical: -10 }}
                      width={deviceWidth * 0.5}
                      source={require('./../../img/regist/mnemonic.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                  {this.state.steps[step] === "welcome" && (
                    <ScalableImage
                      style={{ marginVertical: 5 }}
                      width={deviceWidth * 0.8}
                      source={require('./../../img/regist/finish.png')}
                      tintColor={color.mainColor}
                    />
                  )}
                </View>
                {(this.state.steps[step] !== "mnemonicPolicy" && this.state.steps[step] !== "mnemonicCheck" && this.state.steps[step] !== "welcome") && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {this.renderBars()}
                  </View>
                )}

                {this.state.steps[this.state.step] === "policy" && (
                  <Text style={[layout.contentText, { fontSize: 16, marginTop: 20, textAlign: 'left' },]}>
                    {string.setupStepGuidePolicy}
                  </Text>
                )}

              </View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                {this.renderContent()}
              </View>

              <Text
                style={[
                  layout.contentText,
                  {
                    paddingHorizontal: 15,
                    fontSize: 14,
                    color: '#fd585b',
                    marginBottom: this.state.msg === '' ? 0 : 10,
                  },
                ]}>
                {this.state.msg}
              </Text>

              {this.state.steps[this.state.step] === "welcome" ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 20,
                    marginHorizontal: 80,
                  }}>
                  <CircleButton
                    title={string.start}
                    gradient={[color.gradientColor, color.mainColor]}
                    onPress={() => {
                      this.setState({ registType: 0 });
                      this.onClickNext();
                    }}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: 'row', padding: 20 }}>
                  <CircleButton
                    title={string.back}
                    style={{
                      backgroundColor: color.lightgray,
                      marginRight: 10,
                      height: 41,
                    }}
                    color={color.gray}
                    onPress={() => {
                      this.state.step === 0
                        ? Navigation.dismissModal(this.props.componentId)
                        : this.onClickPrev();
                    }}
                  />
                  <CircleButton
                    title={string.next}
                    gradient={['#162636', '#162636']}
                    onPress={() => {
                      this.setState({ registType: 0 });
                      this.onClickNext();
                    }}
                  />
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
    alignItems: 'center',
  },
  roundTextStyle: {
    fontSize: 14,
    letterSpacing: -0.05,
    textAlign: 'center',
  },
  roundStyle: {
    width: deviceWidth * 0.32 - 30,
    height: 30,
  },
  textCenter: { flexDirection: 'row', justifyContent: 'center' },
});

export default SetupDialogContent;
