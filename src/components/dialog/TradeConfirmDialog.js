import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Clipboard, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import ScalableImage from 'react-native-scalable-image';

import layout from '../../res/layout';
import color from '../../res/color';
import BorderInput from '../input/BorderInput';
import BasicText from '../text/BasicText';
import toast from '../../lib/util/toast';

export default class TradeConfirmDialog extends Component {
  back = () => {
    Navigation.pop(this.props.componentId);
  };
  render() {
    return (
      <SafeAreaView style={layout.container}>
        <View style={layout.topbar}>
          <View style={layout.topbarTitle}>
            <Text style={layout.topbarTitleText}>{string.detail}</Text>
            <View style={{ position: 'absolute', left: 13.3, top: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  this.back();
                }}
                style={{ paddingRight: 30 }}>
                <ScalableImage
                  source={require('../../img/common/back.png')}
                  width={15}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 20, top: 17 }}>
              <Image style={{ width: 24, height: 24, resizeMode: 'contain' }} source={{uri: this.props.coinList.find(x=>x.coinType == this.state.selectedCoinType).image}}/>
            </View> */}
          </View>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 15 }}>
          <View style={{ marginTop: -30, marginBottom: -20 }}>
            <ScalableImage
              source={require('../../img/mywallet/confirm.png')}
              tintColor={color.mainColor}
              width={150}
            />
          </View>
          <BasicText style={{ color: color.mainColor, fontWeight: 'bold' }}>
            {this.props.message}
          </BasicText>
          {/* <BasicText
            style={{
              color: color.lightpurple,
            }}>{`(${string.outerWallet})`}</BasicText> */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <BasicText>{string.value}</BasicText>
            <BasicText style={{ color: color.mainColor, fontWeight: 'bold' }}>
              {this.props.amount}
            </BasicText>
          </View>
        </View>

        <View style={{marginHorizontal: 15}}>

          {/* TX ID */}
          {this.props.txId != undefined && (
            <View style={[styles.row, { flexDirection: 'row', justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, flex: 1}}>
                <BasicText>{string.txId}</BasicText>
                <BasicText>{this.props.txId}</BasicText>
              </View>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  width: 40,
                  height: 20,
                  backgroundColor: color.darkpurple,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={()=>{
                  Clipboard.setString(this.props.txId); 
                  toast.show(string.mywalletAddressCopied)
                }}>
                <BasicText style={{ color: '#fff', fontSize: 12 }}>{string.copy2}</BasicText>
              </TouchableOpacity>
            </View>
          )}

          {
            this.props.fee != undefined && (
            <View style={styles.row}>
              <BasicText>{string.fee}</BasicText>
              <BasicText>{this.props.fee}</BasicText>
            </View>
          )}
          {this.props.targetAddress != undefined && (
          <View style={styles.column}>
            <BasicText>{string.receivedAddress}</BasicText>
            <BasicText style={{ textAlign: 'right' }}>{this.props.targetAddress}</BasicText>
          </View>
          )}
          {this.props.sourceAddress != undefined && (
          <View style={styles.column}>
            <BasicText>{string.sendingAddress}</BasicText>
            <BasicText style={{ textAlign: 'right' }}>{this.props.sourceAddress}</BasicText>
          </View>
          )}
          {this.props.memo != undefined && (
          <View style={styles.row}>
            <BasicText>{string.memo}</BasicText>
            <BasicText>{this.props.memo}</BasicText>
          </View>
          )}
          {this.props.toCoinType != undefined && (
          <View style={styles.row}>
            <BasicText>{string.exchangeTarget}</BasicText>
            <BasicText>{this.props.toCoinType}</BasicText>
          </View>
          )}
          {this.props.toAddress != undefined && (
          <View style={styles.column}>
            <BasicText>{string.exchangeTargetAddress}</BasicText>
            <BasicText>{this.props.toAddress}</BasicText>
          </View>
          )}
          {this.props.ratio != undefined && (
          <View style={styles.row}>
            <BasicText>{string.exchangeRatio}</BasicText>
            <BasicText>{this.props.ratio}</BasicText>
          </View>
          )}
          {this.props.franchiseName != undefined && (
          <View style={styles.row}>
            <BasicText>{string.franchiseName}</BasicText>
            <BasicText>{this.props.franchiseName}</BasicText>
          </View>
          )}
          {this.props.paybackAmount != undefined && (
          <View style={styles.row}>
            <BasicText>{string.payback}</BasicText>
            <BasicText>{this.props.paybackAmount}</BasicText>
          </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    borderTopColor: color.lightgray,
    borderTopWidth: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    borderTopColor: color.lightgray,
    borderTopWidth: 1,
    paddingVertical: 10,
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  circleIcon: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
