import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Language from '../../lib/util/language';
import { Navigation } from 'react-native-navigation';
import Coin from '../../lib/coin/coin';

const deviceWidth = Dimensions.get('window').width;

class backupWordDialog extends Component {
    constructor(props) {
        super(props)
        string = Language.getString();
    }

    render() {
        let backupWords = this.renderBackupWord(this.props.privKey);
        return(
            <View style={styles.dialogContainer}>
                <View style={styles.dialog}>
                <View>
                    <View style={{ padding: 15 }}>
                        <Text style={[layout.titleText]}>
                        {string.myinfoBackupWordQuery}
                        </Text>
                        <View style={{ height: 16 }} />
                        {/* <View
                        style={{
                            width: 23,
                            height: 2,
                            backgroundColor: '#2d67ff',
                            marginTop: 20,
                            marginBottom: 15
                        }}
                        /> */}
                        <Text
                        style={[
                            layout.contentText,
                            {
                            fontSize: 16
                            }
                        ]}
                        >
                        {string.myinfoBackupWordQueryDetail}
                        </Text>
                        {backupWords}
                    </View>
                    <View style={{ height: 1, backgroundColor: '#dadada' }}></View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                        style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                        onPress={() => {
                            this.dismiss();
                        }}
                        >
                        <Text style={layout.buttonText}>{string.close}</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
                <KeyboardSpacer/>
            </View>
        )
    }

    renderBackupUnitWord = (idx, word) => {
        let num = idx + 1;
        num < 10 && (num = '0' + num);
        let ts = layout.textNormal;
        return (
          <View
            style={{
              width: deviceWidth * 0.28 - 30,
              height: 30,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              justifyContent: 'center',
              marginTop: 6.7
            }}
            key={idx}
          >
            <Text
              style={{
                // fontFamily: 'NanumSquareB',
                fontSize: 12,
                letterSpacing: -0.05,
                color: '#686868',
                textAlign: 'center'
              }}
            >
              {num}. {word}
            </Text>
          </View>
        );
    };
    
    renderBackupWord = privKey => {
        let wordList = Coin.seedToWord(privKey);
        let row = [];
        for (let i = 0; i < 6; i++) {
            let col = [];
            for (let j = 0; j < 4; j++) {
            col.push(this.renderBackupUnitWord(4 * i + j, wordList[4 * i + j]));
            }
            row.push(
            <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                key={i}
            >
                {col}
            </View>
            );
        }
        return <View style={{ marginTop: 20, marginBottom: 20 }}>{row}</View>;
    };


    dismiss() {
    //   if (global.dlg.length > 0) {
    //     let lastSibling = global.dlg.pop();
    //     lastSibling && lastSibling.destroy();
    //   }
        Navigation.dismissModal(this.props.componentId);
    };
}

const deviceW = Dimensions.get('window').width
const deviceH = Dimensions.get('window').height
const styles = StyleSheet.create({
    dialog: {
        width: deviceW * 0.92,
        backgroundColor: '#ffffffff',
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

export default backupWordDialog;