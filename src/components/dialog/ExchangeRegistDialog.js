import React, { Component } from 'react';
import {
  Dimensions, StyleSheet, Text,
  TouchableOpacity, TextInput,
  TouchableWithoutFeedback, View, Picker
} from 'react-native';
import Slider from '@react-native-community/slider';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Navigation } from 'react-native-navigation';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import BasicInput from '../input/BasicInput';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setCoinList, setCoinBalance, setCoinAddress} from '../../actions';
import { httpPost, httpUrl } from '../../api/httpClient';
import Coin from '../../lib/coin/coin';
import crypto from 'crypto';

class ExchangeRegistDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      amount: 0,
      error: '',
      mode: "SELL",
      sellingType: 0,
      coinType: this.props.coinList[0],
      price: 0,
      currency: global.currency,
      bank: '',
      bankAccount:'',
      bankHolder: '',
      secPassword: '',
    };
    this.modeList=['SELL', 'BUY']
  }

  componentDidMount() {
  }

  registOct = () => {
    let secPasswordHash = crypto
      .createHash('sha256')
      .update(this.state.secPassword+this.props.loginInfo.email, 'utf8')
      .digest()
      .toString('hex');

    const registData = {
      coinType: this.state.coinType.coinType,
      amount: parseInt(this.state.amount * Coin.getCoinUnit(this.state.coinType.coinType).base),
      price: parseInt(this.state.price),
      mode: this.state.mode,
      bank: this.state.bank,
      bankAccount: this.state.bankAccount,
      bankHolder: this.state.bankHolder,
      securityPassword: secPasswordHash
    };

    httpPost(httpUrl.octRegist,[],registData)
    .then((result) => {

      if(result.data === "INVALID_SECURITY_PASSWORD") {
        Toast.show(string.wrongSecPass)
      } else if (result.data === "INSUFFICIENT_BALANCE") {
        Toast.show(string.insufficientBalance)
      } else if (result.data === "LOCKED") {
        Toast.show(string.locked)
      } else if (result.data === "SUCCESS") {
        Toast.show(string.successRegist)
        this.dismiss();
        this.props.reload();
      } else {
        Toast.show(string.failRegist)
      }
    })
    .catch(e=>{
      console.log ("## octRegist error: " + e);
    })
  }

  render() {
    let step = 0.01;
    if (this.props.maxValue > 1000) step = 10;
    else if (this.props.maxValue > 10) step = 1;
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true}>
          <View style={styles.dialog}>
            <View style={{ paddingTop: 30, paddingHorizontal: 25}}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: color.mainColor, fontWeight: 'bold' }}>{string.registration}</Text>
            </View>

            <View style={{ paddingTop: 20, }}>
              <View
                style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 15 }}
              >
                <TouchableOpacity
                  onPress={()=> this.setState({sellingType: 0, mode: "SELL"})}
                  style={{
                    backgroundColor: !this.state.sellingType ? '#162636' : color.lightgray,
                    flex:1,
                    padding: 10,
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6
                  
                  }}
                >
                  <Text style={{fontSize: 14, color : !this.state.sellingType ? '#f5b617' : "#888", textAlign: "center", fontWeight: !this.state.sellingType ? 'bold' : "400"}}>{string.sell}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=> this.setState({sellingType: 1, mode: "BUY", bank: '', bankAccount: '', bankHolder: ''})}
                  style={{
                    backgroundColor: this.state.sellingType ? '#162636' : color.lightgray,
                    flex:1,
                    padding: 10,
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6
                  }}
                >
                  <Text style={{fontSize: 14, color : this.state.sellingType ? '#f5b617' : "#888", textAlign: "center", fontWeight: this.state.sellingType ? 'bold' : "400"}}>{string.buy}</Text>
                </TouchableOpacity>
              </View>
              {/* <View
                style={[styles.titleView, {
                  flexDirection: "row",
                  alignItems: 'center',
                }]}
                >
                <Text style={{ fontSize: 16 }}>판매상태: </Text>
                <Picker
                  style={{
                    width: 120,
                  }}
                  // selectedValue={this.state.language}
                  onValueChange={(itemValue, itemIndex) => {
                    // if(itemIndex > 1) return;
                    this.setState({currency: itemValue});
                    this.toggleCurrencyUnit(itemIndex);
                  }}
                  >
                  {this.modeList.map((data,index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={data}
                        value={data}
                      />
                    );
                  })}
                </Picker>
              </View> */}
              <View style={[styles.titleView,{marginBottom: 0, paddingHorizontal: 25 }]}>                
                <Text style={styles.titleText}>{string.coinType}</Text>
                <Picker
                  style={{
                    flex: 0.5,
                  }}
                  // selectedValue={this.state.language}
                  onValueChange={(itemValue, itemIndex) => {
                    // if(itemIndex > 1) return;
                    this.setState({coinType: itemValue, amount: 0});
                    // this.toggleCurrencyUnit(itemIndex);
                  }}
                  >
                  {this.props.coinList.map(data => {
                    return (
                      <Picker.Item
                        key={data.idx}
                        label={data.name}
                        value={data}
                      />
                    );
                  })}
                </Picker>             
              </View>

              { this.state.sellingType === 0 &&
              <>
                <View style={[styles.titleView,{marginBottom: 10, paddingHorizontal: 25}]} >  
                 <Text style={styles.titleText}>
                      {string.stakingAvailableAmount}
                  </Text>              
                   <Text style={{ fontSize: 16, textAlign:'center', flex: 1 }}>{this.state.coinType.balance} {this.state.coinType.symbol}</Text>                 
                </View>

                <View style={{paddingHorizontal: 25}}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 200 }}>
                      <Text style={{ paddingTop: 5, fontSize: 16 }}>
                        {string.sellingCoinAmount}
                        {/* : {this.state.amount} {this.props.symbol} */}
                      </Text>
                    </View>
                  </View>
                  <TextInput
                    autoCapitalize="none"
                    placeholder={string.inputAmount}
                    placeholderTextColor={this.props.placeholderTextColor || '#b7b7b7'}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.setState({
                        amount: text,
                      });
                    }}
                    value={this.state.amount + ''}
                    style={{
                      fontSize: 22,
                      textAlign: 'center',
                      height: 40,         
                      padding: 0,                    
                      borderBottomWidth: 0,
                      includeFontPadding: false,
                    }}
                    onFocus={e => {
                      this.setState({ focused: true });
                    }}
                    onBlur={e => {
                      this.setState({ focused: false });
                    }}
                  />
                </View>
                <View style={{paddingHorizontal: 10}}>
                  <Slider
                  style={{ height: 10, }}
                  minimumValue={0}
                  step={step}
                  maximumValue={this.state.coinType.balance}
                  minimumTrackTintColor="#162636"
                  maximumTrackTintColor="#162636"
                  onValueChange={(value) => this.setState({ amount: value })}
                  value={Number(this.state.amount) == 'NaN' ? 0 : Number(this.state.amount)}
                  />
                </View>
                <View style={[styles.titleView,{marginTop: 20, paddingHorizontal: 25}]} >                   
                  <Text style={styles.titleText}>{string.sellingPrice}</Text>
                  <TextInput
                    placeholder={string.sellingPrice}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.setState({
                        price: text,
                      });
                    }}
                    value={this.state.price + ''}
                    style={styles.inputStyle}
                    />
                  <Text style={{position:'absolute', right: 35}}>{string.localCoinUnit[this.state.currency]}</Text>
                </View>

            <View style={{backgroundColor:'#f5f5f5', paddingHorizontal : 15, paddingVertical: 15, margin: 15, borderRadius: 6}}>
              <View style={[styles.titleView,{marginBottom: 0}]} >                 
                <Text style={styles.titleText}>
                    {string.bank}
                    {/* : {this.state.amount} {this.props.symbol} */}
                </Text>
                {/* <Picker
                  style={{
                    flex: 0.5,
                  }}
                  // selectedValue={this.state.language}
                  onValueChange={(itemValue, itemIndex) => {
                    // if(itemIndex > 1) return;
                    this.setState({bank: itemValue});
                    // this.toggleCurrencyUnit(itemIndex);
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

              <View style={styles.titleView} >             
                <Text style={styles.titleText}>{string.secPassword} </Text>
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
                  style={styles.inputStyle2}
                  />
              </View>
            </View>           
          </>
         }         

            { this.state.sellingType === 1 &&
            <>
             <View style={[styles.titleView,{marginBottom: 0, paddingHorizontal: 25 }]}>     
              <Text style={styles.titleText}>{string.sellingCoinAmount}</Text>
        
                <TextInput
                  placeholder={string.inputAmount}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    this.setState({
                      amount: text,
                    });
                  }}
                  value={this.state.amount + ''}
                  style={styles.inputStyle}
                  />
                  <Text style={{position:'absolute', right: 35}}>{this.state.coinType.symbol}</Text>
            </View>
            <View style={[styles.titleView,{marginTop: 8, paddingHorizontal: 25}]} >                   
                  <Text style={styles.titleText}>{string.sellingPrice}</Text>
                  <TextInput
                    placeholder={string.sellingPrice}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.setState({
                        price: text,
                      });
                    }}
                    value={this.state.price + ''}
                    style={styles.inputStyle}
                    />
                  <Text style={{position:'absolute', right: 35}}>{string.localCoinUnit[this.state.currency]}</Text>
                </View>
                <View style={[styles.titleView,{marginVertical: 10 ,marginHorizontal:10, marginBottom: 20, paddingHorizontal: 15, paddingVertical: 15, backgroundColor:'#f5f5f5', borderRadius: 6}]} >   
                <Text style={styles.titleText}>
                  {string.secPassword}                 
                </Text>
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
             </View>
              </>
            }
          </View>
            <View style={{ flexDirection: 'row', paddingTop: 5, marginHorizontal: 15}}>
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
                  if (Number(this.state.amount) == 'NaN' || Number(this.state.amount) <= 0 || Number(this.state.amount) > Number(this.props.maxValue)) {
                    Toast.show(string.stakingInvalidAmount)
                    return;
                  }
                  else if (isNaN(this.state.amount)){
                    Toast.show(string.checkAmount)
                    return;
                  }
                  else if (!this.state.price) {
                    Toast.show(string.insertPrice)
                    return;
                  }
                  else if (isNaN(this.state.price)){
                    Toast.show(string.checkPrice)
                    return;
                  }
                  else if (this.state.sellingType === 0) {
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
                  }
                  else if (!this.state.secPassword) {
                    Toast.show(string.insertSecPassword)
                    return;
                  }
                  this.registOct()
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
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 20,    
    color: color.black,   
    flex : 0.7,
    marginRight: 6
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

const mapStateToProps = state => {
  const {coinList, loginInfo} = state;
  return {coinList, loginInfo};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({setCoinList, setCoinBalance, setCoinAddress}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeRegistDialog);
