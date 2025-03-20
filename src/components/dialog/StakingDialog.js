import React, { Component } from 'react';
import {
  Clipboard, Dimensions, StyleSheet, Text,
  TouchableOpacity,
  TouchableWithoutFeedback, View
} from 'react-native';
import Slider from '@react-native-community/slider';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Navigation } from 'react-native-navigation';
import QRCode from 'react-native-qrcode-svg';
import ScalableImage from 'react-native-scalable-image';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import layout from '../../res/layout';
import BasicInput from '../input/BasicInput';

class StakingDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      amount: 0,
      error: '',
    };
  }

  componentDidMount() {
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
            <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: color.mainColor, fontWeight: 'bold' }}>{this.props.title}</Text>
              <Text style={{ paddingTop: 10, fontSize: 16, color: color.gray }}>
                {this.props.description}
              </Text>
            </View>

            <View style={{ paddingTop: 20, paddingHorizontal: 15 }}>
              <Text style={{ paddingTop: 5, fontSize: 16 }}>
                {string.stakingAvailableAmount} : {this.props.maxValue} {this.props.symbol}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 200 }}>
                  <Text style={{ paddingTop: 5, fontSize: 16 }}>
                    {string.stakingApplyAmount}
                    {/* : {this.state.amount} {this.props.symbol} */}
                  </Text>
                </View>
              </View>
              <BasicInput
                placeholder={string.inputAmount}
                keyboardType="number-pad"
                onChangeText={text => {
                  this.setState({
                    amount: text,
                  });
                }}
                value={this.state.amount + ''}
                style={{
                  fontSize: 24,
                  textAlign: 'center',
                  height: 50,
                  borderBottomColor: '#fff'
                }}
              />
            </View>
            <Slider
              style={{ height: 40 }}
              minimumValue={0}
              step={step}
              maximumValue={this.props.maxValue}
              minimumTrackTintColor={color.mainColor}
              maximumTrackTintColor={color.green}
              onValueChange={(value) => this.setState({ amount: value })}
              value={Number(this.state.amount) == 'NaN' ? 0 : Number(this.state.amount)}
            />
            {/* <View style={{ height: 1, backgroundColor: '#dadada' }}></View> */}

            <View style={{ flexDirection: 'row', paddingTop: 20 }}>
              <CircleButton
                title={string.cancel}
                style={{ marginRight: 10, backgroundColor: color.lightgray }}
                onPress={() => {
                  this.dismiss()
                }}
              />
              <CircleButton
                title={string.ok}
                gradient={['#162636', '#162636']}
                onPress={() => {
                  if (Number(this.state.amount) == 'NaN' || Number(this.state.amount) <= 0 || Number(this.state.amount) > Number(this.props.maxValue)) {
                    Toast.show(string.stakingInvalidAmount)
                    return;
                  }
                  this.props.onOk(this.state.amount)
                  this.dismiss()
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
});

export default StakingDialog;
