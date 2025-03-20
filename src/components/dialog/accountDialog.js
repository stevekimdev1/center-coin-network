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
  Picker,
  Keyboard,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import BasicInput from '../input/BasicInput';
import Toast from '../../lib/util/toast';
import { httpGet, httpPost, httpPut, httpUrl } from '../../api/httpClient';

export default class accountDialog extends Component {

  bankList = [string.selectBankAccount, ...string.bankName];

  state = {
    account: this.props.account == null ? '' : this.props.account,
    selectedBank: this.props.bankCode == null ? 0 : string.bankCode.indexOf(this.props.bankCode)+1,
  };

  dismiss = () => {
    Navigation.dismissModal(this.props.componentId);
  };

  onClickSetAccount = () => {

    if (this.state.selectedBank == 0){
      Toast.show(string.bankCodeValidation);
      return;
    }

    if (this.state.account.length < 1 ){
      Toast.show(string.accountValidation);
      return;
    }

    httpPost(httpUrl.userUpdateBank, [], {bankAccount: this.state.account, bankCode: string.bankCode[this.state.selectedBank-1]}).then((result)=>{
      result = result.data;
      if (result){
        this.props.setLoginInfoAccount(this.state.account, string.bankCode[this.state.selectedBank-1]);
        Toast.show(string.setAccountSucceed);        
        this.dismiss();
      } else {
        Toast.show(string.setAccountFailed);
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
              {string.setBankAccount}
            </Text>
            <View
              style={{ width: 23, height: 2, backgroundColor: color.mainColor, marginTop: 20, marginBottom: 15 }}/>
            <Text
              style={{
                fontSize: 14,
                letterSpacing: -0.05,
                color: '#686868',
                lineHeight: 19
              }}
            >
              {string.setBankAccountDetail}
            </Text>

            <View style={{marginVertical: 10, alignItems: 'center'}}>
              <Picker
                style={{
                  width: 200,
                  height: 88,
                  color: color.black,
                }}
                itemStyle={{ color: color.black, fontSize: 11, height: 88, }}
                // selectedValue={this.state.language}
                selectedValue={this.bankList[this.state.selectedBank]}
                onValueChange={(itemValue, itemIndex) => {
                  // if(itemIndex > 1) return;
                  this.setState({ selectedBank: itemIndex });
                }}>
                {this.bankList.map(data => {
                  return (
                    <Picker.Item
                      key={`account${data}`}
                      label={data}
                      value={data}
                    />
                  );
                })}
              </Picker>
            </View>

            <View
              style={{
                marginBottom: 30,
              }}>
              <BasicInput
                placeholder={string.inputBankAccount}
                onChangeText={text => {
                  this.setState({
                    account: text.trim(),
                  });
                }}
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  height: 50,
                }}
                value={this.state.account}
                keyboardType='numeric'
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
                  this.onClickSetAccount();
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
