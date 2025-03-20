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
    Image
} from 'react-native';
import Button from 'react-native-button';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import layout from '../../res/layout';
// import string from '../../res/string';
import aes from 'browserify-cipher';
import crypto from 'crypto';
import SearchInput, { createFilter } from 'react-native-search-filter';
import Coin from '../../lib/coin/coin';
import Language from '../../lib/util/language';

import { Navigation } from 'react-native-navigation'

class CoinSelectDialog extends Component {
    constructor(props) {
        super(props)
        string = Language.getString();
        this.state = {
            searchTerm: '',
        }
        this.coinList = [];
        
        this.props.coinList.forEach((coin) => {
          this.coinList.push({
            type: coin.coinType,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
          });
        });
    }
    searchUpdated(term) {
        this.setState({ searchTerm: term })
    }
    dismiss = () => {
        Navigation.dismissModal(this.props.componentId);
    }
    coinSelected(idx) {
        this.props.onChangeSelectedCoinType(idx)
        this.dismiss();        
    }
    render() {
        const KEYS_TO_FILTERS = ['name', 'symbol'];
        const filteredCoins = this.coinList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
        return (

            <TouchableOpacity style={styles.dialogContainer} onPress={() => this.dismiss()} activeOpacity={1}>
            <TouchableWithoutFeedback diabled={true}>


            <View style={styles.dialog}>
                <SearchInput 
                    onChangeText={(term) => { this.searchUpdated(term) }} 
                    placeholder={string.selectCoin}
                    style={{fontSize:11.3, color: '#868686', letterSpacing: -0.05, paddingLeft: 10, height:44}}
                />
                <ScrollView style={{height: Dimensions.get('window').height*0.4}}>
                <View style={{height: 1, backgroundColor: '#f0f0f0'}}/>
                {filteredCoins.map(coin => {
                    return (
                      <View key={coin.type}>
                            <TouchableOpacity onPress={()=>this.coinSelected(coin.type)} style={{flexDirection: 'row', padding: 10}}>
                                <View style={{width: 32, justifyContent: 'center', alignItems: 'center'}}>
                                    <Image style={{ width: 24, height: 24, resizeMode: 'contain' }} source={{uri: coin.image}}/>
                                </View>
                                <View style={{justifyContent: 'center', marginLeft: 4}}>
                                    <Text style={{fontSize:14.7, color: '#000000', letterSpacing: -0.05}}>{coin.name}</Text>
                                </View>
                                <View style={{justifyContent: 'flex-end', paddingBottom: 3, paddingLeft: 4}}>
                                    <Text style={{fontSize:10, color: '#686868', letterSpacing: -0.05}}>{coin.symbol}</Text>
                                </View>
                                <View style={{flex:1, flexDirection:'row', justifyContent: 'flex-end', paddingRight: 5}}>
                                    <Image source={require('../../img/common/check.png')} style={{ tintColor: this.props.selectedCoinType == coin.type ? color.mainColor : color.lightgray }}/>
                                </View>
                            </TouchableOpacity>
                          <View style={{height: 1, backgroundColor: '#f0f0f0'}}/>
                      </View>
                    );
                })}
                </ScrollView>
            </View>

            </TouchableWithoutFeedback>
            </TouchableOpacity>
        )
    }
}

const deviceW = Dimensions.get('window').width
const deviceH = Dimensions.get('window').height

const styles = StyleSheet.create({
    dialog: {
      width: deviceW,
      backgroundColor: '#ffffffff',
    },
    dialogContainer: {
      width: deviceW,
      height: deviceH,
      position: 'absolute',
      backgroundColor: '#00000066',
      justifyContent: 'flex-start',
      alignItems: "center",
      paddingTop: 70
    },
  });

export default CoinSelectDialog;