import React, { Component } from 'react';
import {
  Dimensions, StyleSheet, Text,
  TouchableOpacity, TextInput,
  TouchableWithoutFeedback, View, Picker
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Navigation } from 'react-native-navigation';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import { httpPost, httpUrl } from '../../api/httpClient';

class ExchangeTradeDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      error: '',
      bank: '',
      bankAccount:'',
      bankHolder: '',
      secPassword: '',
    };
  }

  componentDidMount() {
  }

  tradeOct = () => {
    const { data } = this.props;
    httpPost(httpUrl.octTrade,[
      data.idx,
      this.state.bank,
      this.state.bankAccount,
      this.state.bankHolder,
    ],{
    })
    .then((result) => {

      if(result.data === "NO_TRADE_INFO") {
        Toast.show(string.noTradeInfo)
      } else if (result.data === "INSUFFICIENT_BALANCE") {
        Toast.show(string.insufficientBalance)
      } else if (result.data === "LOCKED") {
        Toast.show(string.locked)
      } else if (result.data === "SUCCESS") {
        Toast.show(string.successRegist);
        this.dismiss();
        this.props.reloadList();
      } else {
        Toast.show(string.failRegist)
      }
    })
    .catch(e=>{
      console.log ("## octRegist error: " + e);
    })
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true}>
          <View style={styles.dialog}>
            <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: color.mainColor, fontWeight: 'bold' }}>{string.tradeAccount}</Text>
            </View>
            <View style={{margin: 20}}>
              <View style={styles.titleView} >                 
                <Text style={styles.titleText}>
                    {string.bank}
                    {/* : {this.state.amount} {this.props.symbol} */}
                  </Text>    
                  {/* <Picker
                  style={{
                    flex: 0.5,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({bank: itemValue});
                  }}
                  >
                  {string.bankName.map((data,index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={data}
                        value={data}
                      />
                    );
                  })}
                </Picker>  */}
                <TextInput
                  placeholder={string.bank}
                  onChangeText={text => {
                    this.setState({
                      bank: text,
                    });
                  }}
                  value={this.state.bank}
                  style={styles.inputStyle2}
                  />
              </View>

               <View style={styles.titleView} >                
                <Text style={styles.titleText}>{string.bankAccount} </Text>       
                  <TextInput
                    placeholder={string.bankAccount}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.setState({
                        bankAccount: text,
                      });
                    }}
                    value={this.state.bankAccount}
                    style={styles.inputStyle2}
                    />
              </View>

              <View style={styles.titleView} >              
                <Text style={styles.titleText}>{string.bankHolder} </Text>
                <TextInput
                  placeholder={string.bankHolder}
                  onChangeText={text => {
                    this.setState({
                      bankHolder: text,
                    });
                  }}
                  value={this.state.bankHolder + ''}
                  style={styles.inputStyle2}
                  />
              </View>
            </View>
            {/* <View style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 15, alignItems: "center" }}>
              <View style={styles.inputTitleView}>
                <Text style={{ fontSize: 16 }}>
                  {string.secPassword}
                </Text>
              </View>
              <Text>:</Text>
              <TextInput
                placeholder={string.secPassword}
                keyboardType="number-pad"
                secureTextEntry={true}
                onChangeText={text => {
                  this.setState({
                    secPassword: text,
                  });
                }}
                value={this.state.secPassword}
                style={styles.inputStyle}
                />
            </View> */}

            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <CircleButton
                title={string.cancel}
                style={{ marginRight: 10, backgroundColor: color.lightgray}}
                color={'#444'}
                onPress={() => {
                  this.dismiss()
                }}
              />
              <CircleButton
                title={string.ok}
                gradient={['#f5b617','#f5b617']}
                style={{fontWeight: 'bold'}}
                color={'#162636'}
                fontWeight={'bold'}
                onPress={() => {
                  if (!this.state.bank) {
                    Toast.show(string.insertBank)
                    return;
                  }
                  else if (!this.state.bankAccount) {
                    Toast.show(string.insertAccount)
                    return;
                  }
                  else if (!this.state.bankHolder) {
                    Toast.show(string.insertHolder)
                    return;
                  }
                  this.tradeOct()
                }}
              />
            </View>
          </View>
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
  titleView: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom: 6,
  },
  inputStyle: {
    textAlign: 'center',
    marginLeft: 20,
    fontSize: 16,
    borderBottomColor: color.gray,
    borderBottomWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 20,
    color: color.black,
    width: deviceW * 0.4
  },
  titleText:{
    fontSize: 16, 
    flex: 0.4,
  },
  inputStyle2: {
    textAlign: 'center',
    marginLeft: 20,
    fontSize: 16,
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 20,    
    color: color.black,   
    flex : 0.7,
  },
});

export default ExchangeTradeDialog;
