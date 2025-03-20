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
  ScrollView
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import Language from '../../lib/util/language';

class InfoDialog {
  constructor() {
    string = Language.getString();
  }

  show(title, content, containerHeight) {
    if (containerHeight == null || containerHeight == undefined)
      containerHeight = deviceH * 0.5;
    let sibling = new RootSiblings(
      (
        <View style={styles.dialogContainer}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }}
            onPress={() => this.dismiss()}
            activeOpacity={1}
          />
          <View style={styles.dialog}>
            <View style={{ padding: 30, height: containerHeight }}>
              <Text style={[layout.titleText]}>{title}</Text>
              <View style={{ height: 20 }} />
              {/* <View style={{ width: 23, height: 2, backgroundColor: '#2d67ff', marginTop: 20, marginBottom: 15 }}></View> */}
              <View style={{ position: 'relative', flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                  {content.map((value, index) => {
                    let result = [];
                    if (value.title)
                      result.push(
                        <Text
                          key={'title_' + index}
                          style={[
                            layout.contentText,
                            {
                              // fontFamily: 'NanumSquareEB',
                              fontSize: 15.3,
                              color: '#2d67ff',
                              textDecorationLine: 'underline'
                            }
                          ]}
                        >
                          {value.title}
                        </Text>
                      );
                    if (value.content)
                      result.push(
                        <Text
                          key={'content_' + index}
                          style={[
                            layout.contentText,
                            {
                              fontSize: 14
                            }
                          ]}
                        >
                          {value.content}
                        </Text>
                      );
                    result.push(
                      <View key={'separator_' + index} style={{ height: 20 }} />
                    );
                    return result;
                  })}
                </ScrollView>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#dadada' }}></View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                onPress={() => {
                  this.dismiss();
                }}
              >
                <Text
                  style={layout.buttonText}
                >
                  {string.close}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    );
    global.dlg.push(sibling);
  }
  dismiss() {
    if (global.dlg.length > 0) {
      let lastSibling = global.dlg.pop();
      lastSibling && lastSibling.destroy();
    }
  }
}

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: deviceH * 0.2,
    left: deviceW * 0.04,
    width: deviceW * 0.92,
    backgroundColor: '#ffffffff',
    borderRadius: 5
  },
  dialogContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default InfoDialog;
