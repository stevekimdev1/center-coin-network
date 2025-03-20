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
import {httpGet, httpPost, httpUrl} from '../../api/httpClient';
import { formatDateHM } from "../../lib/util/dateUtil";
import Toast from '../../lib/util/toast';

export default class ChargeDialog extends Component {
  state = {
    price: '',
    step: 1,
    error: null,
    code: '',
    bank: '',
    account: '',
    accountName: '',
    list: []
  };

  dismiss = () => {
    // this.setState({price: '', step: 1});
    Navigation.dismissModal(this.props.componentId);
  };
  componentDidMount() {
    
    httpGet(httpUrl.depositBank, [])
      .then(result => {
        result = result.data;
        this.setState({bank: result.bank, account: result.account, accountName: result.accountName})
      })
      .catch((e) => {
        console.log("error: " + e);
      });
    this.fetchHist();
  }

  fetchHist = () => {
    httpGet(httpUrl.depositHist, [])
      .then(result => {
        result = result.data;
        this.setState({list: result})
      })
      .catch((e) => {
        console.log("error: " + e);
      });
  }

  moveStep = (step, price, code) => {
    
    this.setState({step: step, error: null, price: price.toString(), code: code});
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.dialog}>
            {this.state.step == 1 && (
            <View>
              <View
                style={{
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: color.mainColor
                  }}>
                  {string.chargeCoin}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 20,
                    lineHeight: 20
                  }}>
                  {string.chargeCoinDescription1}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: color.mainColor
                  }}>
                  {this.state.bank + ' ' + this.state.account + ' ' + this.state.accountName}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 20,
                }}>
                <BasicInput
                  placeholder={string.chargeKrwAmount}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    this.setState({
                      price: text,
                    });
                  }}
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    height: 50,
                  }}
                  error={this.state.error}
                />
                <Text style={{position:'absolute', right: 20, fontSize: 14, paddingTop: 15}}>{string.krw1}</Text>
              </View>
              {this.state.list.length > 0 && (
              <View style={{paddingBottom: 20}}>
                <Text style={{fontSize: 14,fontWeight: 'bold', lineHeight: 24, paddingBottom: 5}}>{string.chargeList}</Text>
                {this.state.list.map((v, i) => {
                  return (
                    <TouchableOpacity onPress={()=>{
                      this.moveStep(2, v.amount, v.code);
                    }}>
                      <Text style={{fontSize: 14,lineHeight: 24}}>[{formatDateHM(v.createDate)}] {v.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}{string.krw1} ({string.chargeName}: {v.code})</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CircleButton
                  style={{ marginRight: 10, backgroundColor: color.lightgray, height:41 }}
                  title={string.cancel}
                  color={color.gray}
                  onPress={() => {
                    this.dismiss();
                  }}
                />
                <CircleButton
                  gradient={['#5663ff', '#5663ff']}
                  title={string.chargeRequest}
                  onPress={() => {
                    if (this.state.price == '') {
                      this.setState({error: string.purchaseAmountValidation});
                    }
                    else {
                      httpPost(httpUrl.depositRequest, [], {amount: this.state.price}).then((result) => {
                        result = result.data;
                        console.log(JSON.stringify(result));
                        
                        if (result == null) {
                          Toast.show(string.chargeRequestMaxLimit);
                        }
                        else {
                          this.moveStep(2, this.state.price, result.code);
                        }
                      }).catch(() => {
                        Toast.show(string.errorMessage);
                        this.dismiss();
                      });
                    }
                  }}
                />
              </View>
            </View>
            )}
            {this.state.step == 2 && (
            <View>
              <View
                style={{
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: color.mainColor
                  }}>
                  {string.chargeCoin}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 20,
                    lineHeight: 20,
                    color: color.mainColor
                  }}>
                  {string.chargeCoinDescription2}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 5,
                    lineHeight: 20
                  }}>
                  {string.chargeCoinDescription3}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    paddingTop: 5,
                    lineHeight: 20
                  }}>
                  {string.chargeCoinDescription4}
                </Text>
              </View>
              <View style={{height: 1, backgroundColor: color.darkwhite, marginTop: 10, marginBottom: 10}}/>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 5,
                  paddingLeft: 10
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    width: 100
                  }}>
                  {string.chargeBank}
                </Text>
                <TouchableOpacity onPress={()=>{
                  Clipboard.setString(this.state.account)
                  Toast.show(string.chargeCoinCopyBank);
                }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: color.mainColor
                    }}>
                    {this.state.bank + ' ' + this.state.account }
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: color.mainColor
                    }}>
                    {this.state.accountName}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 5,
                  paddingLeft: 10
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    width: 100
                  }}>
                  {string.chargeKrwAmount}
                </Text>
                <TouchableOpacity onPress={()=>{
                  Clipboard.setString(this.state.price)
                  Toast.show(string.chargeCoinCopyAmount);
                }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: color.mainColor
                    }}>
                    {this.state.price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 5,
                  paddingLeft: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    width: 100
                  }}>
                  {string.chargeName}
                </Text>
                <TouchableOpacity onPress={()=>{
                  Clipboard.setString(this.state.code)
                  Toast.show(string.chargeCoinCopyName);
                }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: color.mainColor
                    }}>
                    {this.state.code}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{height: 1, backgroundColor: color.darkwhite, marginTop: 10, marginBottom: 10}}/>
              
              <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    marginBottom: 10
                  }}>
                  {string.chargeCoinDescription5}
                </Text>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CircleButton
                  style={{ marginRight: 10, backgroundColor: color.lightgray }}
                  title={string.back}
                  color={color.gray}
                  onPress={() => {
                    this.fetchHist();
                    this.moveStep(1, '', '');
                  }}
                />
                <CircleButton
                  gradient={[color.gradientColor, color.mainColor]}
                  title={string.ok}
                  onPress={() => {
                    this.dismiss();
                  }}
                />
              </View>
            </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    );
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
    padding: 20,
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
