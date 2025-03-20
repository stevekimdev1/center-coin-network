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

export default class EnterPriceDialog extends Component {
  state = {
    price: '',
  };

  dismiss = () => {
    Navigation.dismissModal(this.props.componentId);
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.dialog}>
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  {string.enterPriceTitle}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 40,
                }}>
                <BasicInput
                  placeholder={string.inputAmount}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    this.setState({
                      price: text,
                    });
                  }}
                  style={{
                    fontSize: 24,
                    textAlign: 'center',
                    height: 50,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CircleButton
                  style={{ marginRight: 10, backgroundColor: color.lightgray, height: 41 }}
                  title={string.cancel}
                  color={color.gray}
                  onPress={() => {
                    this.dismiss();
                  }}
                />
                <CircleButton
                  gradient={['#3ec2f7', '#6e3cff']}
                  title={string.ok}
                  onPress={() => {
                    this.props.onChangePrice(this.state.price);
                    this.dismiss();
                  }}
                />
              </View>
            </View>
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
