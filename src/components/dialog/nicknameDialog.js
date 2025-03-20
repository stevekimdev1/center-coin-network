import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Clipboard,
  Image,
  Keyboard
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import BasicInput from '../input/BasicInput';
import Toast from '../../lib/util/toast';
import { httpGet, httpPost, httpPut, httpUrl } from '../../api/httpClient';

export default class nicknameDialog extends Component {
  state = {
    nickname: this.props.nickname == null ? '' : this.props.nickname,
  };

  dismiss = () => {
    Navigation.dismissModal(this.props.componentId);
  };

  onClickSetNickname = () => {

    if (this.state.nickname.length < 1 || this.state.nickname.length > 8){
      Toast.show(string.enterNicknameValidation);
      return;
    }

    httpPut(httpUrl.userUpdateNickname, [this.state.nickname]).then((result)=>{
      result = result.data;
      if (result){
        this.props.setLoginInfoNickname(this.state.nickname);
        Toast.show(string.setNicknameSucceed);        
        this.dismiss();
      } else {
        Toast.show(string.setNicknameFailed);
      }

    }).catch(e=>{
      console.log ("## userUpdateNickname error: " + e);
    });
    
  }

  render() {
    return (
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
              {this.props.title}
            </Text>
            <View
              style={{
                width: 23,
                height: 2,
                backgroundColor: color.mainColor,
                marginTop: 20,
                marginBottom: 15
              }}
            ></View>
            <Text
              style={{
                fontSize: 14,
                letterSpacing: -0.05,
                color: '#686868',
                lineHeight: 19
              }}
            >
              {this.props.message}
            </Text>
            <View
              style={{
                marginVertical: 30,
              }}>
              <BasicInput
                placeholder={string.enterNickname}
                onChangeText={text => {
                  this.setState({
                    nickname: text.trim(),
                  });
                }}
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  height: 50,
                }}
                value={this.state.nickname}
              />
            </View>
            
            <View
              style={{
                flexDirection: 'row',
              }}>
              <CircleButton
                style={{ marginRight: 10 }}
                gradient={[color.gradientColor, color.mainColor]}
                title={string.ok}
                onPress={() => {
                  this.onClickSetNickname();
                }}
              />
              <CircleButton
                style={{ backgroundColor: color.lightgray }}
                title={string.cancel}
                color={color.gray}
                onPress={() => {
                  this.dismiss();
                }}
              />
              
            </View>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;

const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: deviceH * 0.3,
    left: deviceW * 0.04,
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    borderRadius: 5
  },
  dialogContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
