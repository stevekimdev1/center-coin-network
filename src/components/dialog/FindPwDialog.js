import crypto from 'crypto';
import React, { Component } from 'react';
import {
  Dimensions,
  Keyboard,
  Picker,
  Platform, StyleSheet, Text,
  TouchableWithoutFeedback, View
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Navigation } from 'react-native-navigation';
import { httpGet, httpPost, httpUrl } from '../../api/httpClient';
// import string from '../../res/string';
import Coin from '../../lib/coin/coin';
// import CheckBox from 'react-native-check-box';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import color from '../../res/color';
import layout from '../../res/layout';
import CircleButton from '../button/CircleButton';
import BasicInput from '../input/BasicInput';



const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class FindPwDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
      email: '',
      msg: ''
    };
  }

  componentDidMount() {
  }
  checkEmail = () => {
    let strongRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    if (this.state.email == undefined || this.state.email == '')
      return 1;
    if (!strongRegex.test(this.state.email)) return 2;

    return 0;
  };
  findPassword = () => {
    let checkEmailResult = this.checkEmail();
    if (checkEmailResult == 1) {
      this.setState({ msg: string.emailLengthFail });
      return;
    } else if (checkEmailResult == 2) {
      this.setState({ msg: string.emailStrength });
      return;
    }
    this.setState({ msg: '' });

    httpPost(httpUrl.userFindPasswordByEmail, [this.state.email], {}).then((result) => {
      result = result.data;
      if (result) {
        Toast.show(string.findPasswordEmailSentSuccess);
        Navigation.dismissModal(this.props.componentId);
      }
      else {
        Toast.show(string.sendEmailFail);
      }

    }).catch(() => {
    });

  }
  render() {
    return (
      <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.dialogContainer} activeOpacity={1}>
          <View style={styles.dialog}>
            <View style={{ backgroundColor: color.white }}>
              <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                <Text
                  style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}
                >
                  {string.findPassword}
                </Text>
                <View
                  style={{
                    width: 23,
                    height: 2,
                    backgroundColor: color.mainColor,
                    marginTop: 20,
                    marginBottom: 15
                  }}
                />
                <Text
                  style={[
                    layout.contentText,
                    { fontSize: 16, marginTop: 20, textAlign: 'left' }
                  ]}
                >
                  {string.findPasswordDescription}
                </Text>
              </View>
              <View style={{ padding: 15 }}>
                <BasicInput
                  // icon="check-circle"
                  resetable={true}
                  placeholder={"이메일"}
                  onChangeText={text => {
                    this.setState({ email: text.trim() });
                  }}
                  type='email'
                  value={this.state.email}
                />
              </View>
              <Text
                style={[
                  layout.contentText,
                  {
                    paddingHorizontal: 15,
                    fontSize: 14,
                    color: '#fd585b',
                    marginBottom: this.state.msg === '' ? 0 : 10
                  }
                ]}
              >
                {this.state.msg}
              </Text>

              <View style={{ flexDirection: 'row', padding: 20 }}>
                <CircleButton
                  title={string.cancel}
                  style={{
                    backgroundColor: color.lightgray,
                    marginRight: 10,
                    height: 41,
                  }}
                  color={color.gray}
                  onPress={() => {
                    Navigation.dismissModal(this.props.componentId);
                  }}
                />
                <CircleButton
                  title={"확인"}
                  gradient={['#162636', '#162636']}
                  onPress={this.findPassword}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    width: deviceWidth * 0.92,
    backgroundColor: '#ffffffff',
    minHeight: 96,
    borderRadius: 5,
  },
  dialogContainer: {
    width: deviceWidth,
    height: deviceHeight,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: "center"
  },
  roundTextStyle: {
    fontSize: 12,
    letterSpacing: -0.05,
    textAlign: 'center'
  },
  roundStyle: {
    width: deviceWidth * 0.28 - 30,
    height: 30
  },
  textCenter: { flexDirection: 'row', justifyContent: 'center' }
});

export default FindPwDialog;
