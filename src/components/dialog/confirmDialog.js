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
import BasicInput from '../input/BasicInput';
import CircleButton from '../button/CircleButton';

class ConfirmDialog extends Component {
  constructor(props) {
    super(props)
    string = Language.getString();
    this.state = {
      secPassword: '',
      otpCode: '',
    };
  }

  render() {
    return(
    //   let sibling = new RootSiblings(
        <View style={styles.dialogContainer}>
            <View style={styles.dialog}>
              <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
                  {string.sendCoinConfirmDlgTtl}
                </Text>
                <View style={{ width: 23, height: 2, backgroundColor: color.mainColor, marginTop: 20, marginBottom: 15 }}/>
                <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', lineHeight: 19 }}>
                  {string.sendCoinConfirmMessage}
                </Text>
                <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', marginTop: 20 }}>
                  {this.props.address}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                  <View style={{ width: 31.3, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#a7ceef', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#4f95d0', textAlign: 'center' }}>{string.value}</Text>
                  </View>
                  <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <Text style={{ fontSize: 15.3, letterSpacing: -0.05, color: '#000' }}>{this.props.amount}</Text>
                  </View>
                  <View style={{ marginTop: 3, marginLeft: 3 }}>
                    <Text style={{ fontSize: 9.3, letterSpacing: -0.05, color: '#686868' }}>{this.props.coinSymbol}</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={{ width: 31.3, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#f5bbbb', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#e76969', textAlign: 'center' }}>{string.fee}</Text>
                  </View>
                  {this.props.fee == 0 ? (
                    <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                      <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868' }}>{string.exemption}</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                        <Text style={{ fontSize: 15.3, letterSpacing: -0.05, color: '#000' }}>{this.props.fee}</Text>
                      </View>
                      <View style={{ marginTop: 3, marginLeft: 3 }}>
                        <Text style={{ fontSize: 9.3, letterSpacing: -0.05, color: '#686868' }}>{this.props.feeUnit}</Text>
                      </View>
                    </View>
                  )}                  
                </View>

                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginBottom: 20 }}>
                  <View style={{ width: 31.3, height: 16.3, borderWidth: 1, borderRadius: 4, borderColor: '#686868', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 8.7, letterSpacing: -0.05, color: '#686868', textAlign: 'center' }}>{string.memo}</Text>
                  </View>
                  <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                    <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868' }}>{this.props.target.memo}</Text>
                  </View>
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
                      this.props.sendCoin( {...this.props.target } );
                      this.dismiss();
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

              {/* <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                  onPress={() => {
                    this.props.sendCoin( {...this.props.target } );
                    this.dismiss();
                  }}>
                  <Text style={layout.buttonText}>{string.ok}</Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: '#dadada' }} />
                <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                  onPress={() => {
                    this.dismiss();
                  }}>
                  <Text style={layout.buttonText}>{string.cancel}</Text>
                </TouchableOpacity>

              </View> */}
            </View>
          <KeyboardSpacer />
        </View>
    //   );
    //   global.dlg.push(sibling);
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

export default ConfirmDialog;