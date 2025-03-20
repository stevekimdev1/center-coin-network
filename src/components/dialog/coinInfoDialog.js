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
  ScrollView,
  Linking
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import Language from '../../lib/util/language';

import { Navigation } from 'react-native-navigation';

class coinInfoDialog extends Component {
  constructor(props) {
    super(props)
    string = Language.getString();
  }

  render() {
    containerHeight = this.props.foundation == null ? deviceH * 0.2 : deviceH * 0.5;
    return(
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
            <Text style={[layout.titleText]}>{this.props.coinName}</Text>
            <View style={{ height: 20 }} />
            {/* <View style={{ width: 23, height: 2, backgroundColor: '#2d67ff', marginTop: 20, marginBottom: 15 }}></View> */}
            <View style={{ position: 'relative', flex: 1 }}>
              {this.props.foundation == null ? (
                <Text style={[ layout.contentText, { fontSize: 15, textAlign: 'left', color: color.black } ]}>
                  {string.preparing}
                </Text>
              ) : (
                <ScrollView style={{ flex: 1 }}>

                <Text style={[ layout.contentText, { fontSize: 15, textAlign: 'left', color: color.black } ]}>
                  {this.props.foundation.description}
                </Text>

                <View flexDirection='row' style={{marginTop: 8}}>
                  <Text style={[ layout.contentText, { fontSize: 14.3, color: '#2d67ff'} ]}>
                    {string.country} : 
                  </Text>
                  <Text style={[ layout.contentText, { fontSize: 14.3 } ]}>
                    {this.props.foundation.country}
                  </Text>
                </View>

                <View flexDirection='row' style={{marginTop: 8}}>
                  <Text style={[ layout.contentText, { fontSize: 14.3, color: '#2d67ff', fontWeight: 'normal'} ]}>
                    {string.totalAmountValue} : 
                  </Text>
                  <Text style={[ layout.contentText, { fontSize: 14.3 } ]}>
                    {this.props.foundation.marketCap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {string.localCoin}
                  </Text>
                </View>

                <View flexDirection='row' style={{marginTop: 8}}>
                  <Text style={[ layout.contentText, { fontSize: 14.3, color: '#2d67ff'} ]}>
                    {string.website} : 
                  </Text>
                  <TouchableOpacity onPress={()=>Linking.openURL(this.props.foundation.websiteLink)}>
                    <Text style={[ layout.contentText, { fontSize: 14.3, textDecorationLine: 'underline' } ]}>
                      {this.props.foundation.websiteLink}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View flexDirection='row' style={{marginTop: 8}}>
                  <Text style={[ layout.contentText, { fontSize: 14.3, color: '#2d67ff'} ]}>
                    {string.whitePaper} : 
                  </Text>
                  <TouchableOpacity onPress={()=>Linking.openURL(this.props.foundation.whitepaperLink)}>
                    <Text style={[ layout.contentText, { fontSize: 14.3, textDecorationLine: 'underline' } ]}>
                      {this.props.foundation.whitepaperLink}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View flexDirection='row' style={{marginTop: 8}}>
                  <Text style={[ layout.contentText, { fontSize: 15.3, color: '#2d67ff'} ]}>
                    {string.community} : 
                  </Text>
                  <TouchableOpacity onPress={()=>Linking.openURL(this.props.foundation.communityLink)}>
                    <Text style={[ layout.contentText, { fontSize: 14.3, textDecorationLine: 'underline' } ]}>
                      {this.props.foundation.communityLink}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />

                </ScrollView>
              )}
              
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
  }
  dismiss() {
    Navigation.dismissModal(this.props.componentId);
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

export default coinInfoDialog;
