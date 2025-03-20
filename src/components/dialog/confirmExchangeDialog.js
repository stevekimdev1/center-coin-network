import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import Language from '../../lib/util/language';
import { Navigation } from 'react-native-navigation';

class ConfirmExchangeDialog extends Component {
  constructor(props) {
    super(props)
    string = Language.getString();
  }

  render(){
    return (
      <View style={styles.dialogContainer} activeOpacity={1}>
        <View style={styles.dialog}>
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
              {string.exchangeCoinConfirmDlgTtl} ({this.props.coinInName} → {this.props.coinOutName})
            </Text>
            <View style={{ width: 23, height: 2, backgroundColor: '#2d67ff', marginTop: 20, marginBottom: 15 }}></View>
            <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', lineHeight: 19, marginBottom: 15 }}>
              {string.exchangeCoinConfirmMessage}
            </Text>
            <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#ff2828', lineHeight: 19, marginBottom: 15 }}>
              {string.exchangeCoinConfirmMessageWarn}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginBottom: 0 }}>
              <View style={{ width: 47, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#a7ceef', justifyContent: 'center' }}>
                <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#4f95d0', textAlign: 'center' }}>{string.exchangeSendValue}</Text>
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                <Text style={{ fontSize: 15.3, letterSpacing: -0.05, color: '#000' }}>{this.props.coinInAmount}</Text>
              </View>
              <View style={{ marginTop: 3, marginLeft: 3 }}>
                <Text style={{ fontSize: 9.3, letterSpacing: -0.05, color: '#686868' }}>{this.props.coinInSymbol}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ width: 31.3, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#f5bbbb', justifyContent: 'center' }}>
                <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#e76969', textAlign: 'center' }}>{string.fee}</Text>
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                <Text style={{ fontSize: 15.3, letterSpacing: -0.05, color: '#000' }}>{this.props.fee}</Text>
              </View>
              <View style={{ marginTop: 3, marginLeft: 3 }}>
                <Text style={{ fontSize: 9.3, letterSpacing: -0.05, color: '#686868' }}>{this.props.feeUnit}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 47, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#a7ceef', justifyContent: 'center' }}>
                <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#4f95d0', textAlign: 'center' }}>{string.exchangeReceiveValue}</Text>
              </View>
              <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                <Text style={{ fontSize: 15.3, letterSpacing: -0.05, color: '#000' }}>{this.props.coinOutAmount}</Text>
              </View>
              <View style={{ marginTop: 3, marginLeft: 3 }}>
                <Text style={{ fontSize: 9.3, letterSpacing: -0.05, color: '#686868' }}>{this.props.coinOutSymbol}</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#dadada' }}></View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
              onPress={() => {
                this.props.exchangeCoin();
                this.dismiss();
              }}>
              <Text style={{ fontSize: 17, letterSpacing: -0.05, color: '#2d67ff', textAlign: 'center' }}>{string.ok}</Text>
            </TouchableOpacity>
            <View style={{ width: 1, backgroundColor: '#dadada' }} />
            <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
              onPress={() => {
                this.dismiss();
              }}>
              <Text style={{ fontSize: 17, letterSpacing: -0.05, color: '#000', textAlign: 'center' }}>{string.cancel}</Text>
            </TouchableOpacity>

          </View>
        </View>
        <KeyboardSpacer />
      </View>
    )
  }
  dismiss() {
    // if (global.dlg.length > 0) {
    //   let lastSibling = global.dlg.pop();
    //   lastSibling && lastSibling.destroy();
    // }
    Navigation.dismissModal(this.props.componentId);
  };
}

const deviceW = Dimensions.get('window').width
const deviceH = Dimensions.get('window').height
const styles = StyleSheet.create({
  dialog: {
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    minHeight: 96,
    borderRadius: 5,
  },
  dialogContainer: {
    width: deviceW,
    height: deviceH,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: "center"
  },
});

export default ConfirmExchangeDialog;