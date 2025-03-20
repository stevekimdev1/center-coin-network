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
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import QRCode from 'react-native-qrcode-svg';
import Coin from '../../lib/coin/coin';
import Toast from '../../lib/util/toast';
import Language from '../../lib/util/language';
import StringUtil from '../../lib/util/stringUtil';
import { Navigation } from 'react-native-navigation';

import BasicInput from '../input/BasicInput';
import BasicButton from '../button/BasicButton';

import BasicDialog from './basicDialog';
import CircleButton from '../button/CircleButton';
import color from '../../res/color';
import ScalableImage from 'react-native-scalable-image';
class GeneratedQRDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      currency: global.currency,
    };
  }

  componentDidMount() {
    // console.log(JSON.stringify(this.props.coin, null, 4));
  }

  // show(coin, address) {
  render() {
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true}>
          <View style={styles.dialog}>
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
                {/* <Text
                  style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
                  {string.receive}
                </Text> */}
              </View>
              {/* <Text
                style={{
                  fontSize: 14,
                  letterSpacing: -0.05,
                  color: '#686868',
                  lineHeight: 19,
                }}>
                {string.mywalletReceive}
              </Text> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <QRCode
                  // value={this.props.address}
                  value={"payment?id=" + this.props.organizationId + "&coinType=" + this.props.coin.coinType + "&price=" + this.props.price + "&franchiseName=" + this.props.franchiseName}
                  size={200}
                  color={color.mainColor}
                  backgroundColor="white"
                />
              </View>
              <View
                style={{
                  marginBottom: 30,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: -0.05,
                    color: '#686868',
                    marginVertical: 10,
                    textAlign: 'center',
                  }}>
                  {string.purchaseAmount}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: -0.05,
                    color: color.mainColor,
                    textAlign: 'center',
                  }}>
                  {this.props.price}
                  {string.localCoinUnit[this.state.currency]}
                </Text>
              </View>

              {/* <View>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: -0.05,
                    color: '#686868',
                    paddingTop: 10,
                  }}>
                  {string.mywalletCausion}
                </Text>
                {this.props.coin.coinType == Coin.origin.btc && (
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: -0.05,
                      color: '#686868',
                      paddingTop: 10,
                    }}>
                    {string.mywalletCausionBtc}
                  </Text>
                )}
                {this.props.coin.coinType == Coin.origin.eth && (
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: -0.05,
                      color: '#686868',
                      paddingTop: 10,
                    }}>
                    {string.mywalletCausionEth}
                  </Text>
                )}
                {this.props.coin.coinType == Coin.origin.xrp && (
                  <Text
                    style={{
                      fontSize: 14,
                      letterSpacing: -0.05,
                      color: '#686868',
                      paddingTop: 10,
                    }}>
                    {string.mywalletCausionXrp}
                  </Text>
                )}
              </View> */}
            </View>

            {/* <View style={{ height: 1, backgroundColor: '#dadada' }}></View> */}

            {/* 주소복사, 금액입력 */}
            {/* <View style={{ flexDirection: 'row' }}>
              <CircleButton
                title={string.copy}
                gradient={[color.gradientColor, color.mainColor]}
                style={{ marginRight: 10 }}
                onPress={() => {
                  Clipboard.setString(this.props.address);
                  Toast.show(string.mywalletAddressCopied);
                }}
              />
              <CircleButton
                title={string.enterPrice}
                gradient={[color.gradientColor, color.mainColor]}
                onPress={() => {
                  this.showEnterInputPopup();
                }}
              />
            </View> */}
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
});

export default GeneratedQRDialog;
