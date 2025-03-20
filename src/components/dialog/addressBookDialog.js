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
import {httpGet, httpPost, httpUrl} from '../../api/httpClient';
import Feather from 'react-native-vector-icons/Feather';
import Language from '../../lib/util/language';

import { Navigation } from 'react-native-navigation'

class AddressBookDialog extends Component {
    constructor(props) {
        super(props)
        string = Language.getString();

        this.state = {
            addressList: [],
        }

        this.currenctPageNum = 1;
        this.pageSize = 20;
        this.latestPageNum = 1;
    }

    componentDidMount = () => {
        this.setState({
            addressList: this.props.addressList,
        })
        // this.getAddressbook();
    }

    dismiss = () => {
        Navigation.dismissModal(this.props.componentId);
    }

    addressSelected(address, destinationTag) {
        this.props.setAddress(address, destinationTag)
        this.dismiss();    
    }

    getAddressbook = () => {

        console.log(this.currenctPageNum +", "+ this.latestPageNum)
        if (this.currenctPageNum > this.latestPageNum) return;

        httpGet(httpUrl.userSelectAddressbook, [this.pageSize, (this.currenctPageNum + 1), this.props.selectedCoinType]).then((result) => {
            result = result.data;

            console.log(JSON.stringify(result));
            this.latestPageNum = (result.totalCount / this.pageSize) + 1;

            console.log("!!!!! latest page, currenctPage:" + this.latestPageNum + ", " + this.currenctPageNum);
            console.log("!!!!! rowData: " + JSON.stringify(result.addressBooks, null, 4));

            this.setState({
                addressList: this.state.addressList.concat(result.addressBooks),
            });
            this.currenctPageNum++;
        }).catch(() => {});
    }

    render() {
        
        return (

            <TouchableOpacity style={styles.dialogContainer} onPress={() => this.dismiss()} activeOpacity={1}>
            <TouchableWithoutFeedback diabled={true}>

            <View style={styles.dialog}>
                <View style={{ justifyContent: 'center', height: 44 }}>
                    <Text style={{fontSize: 16, color: '#868686', letterSpacing: -0.05, paddingLeft: 10}}>
                        {string.addressBook}
                    </Text>
                </View>                
                
                <ScrollView style={{height: Dimensions.get('window').height*0.4}} onScroll={(e) => {
                    let paddingToBottom = 10;
                    paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                    if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
                        this.getAddressbook();
                    }
                }}>
                <View style={{height: 1, backgroundColor: '#f0f0f0'}}/>
                {this.state.addressList.map(address => {
                    return (
                      <View key={address.address}>
                            <TouchableOpacity onPress={()=>this.addressSelected(address.address, address.destinationTag)} style={{flexDirection: 'row', padding: 10}}>
                                <View style={{width: 32, justifyContent: 'center', alignItems: 'center'}}>
                                    <Feather name='user' size={19} color='#b7b7b7'/>
                                </View>
                                <View style={{justifyContent: 'center', marginLeft: 4}}>
                                    <Text style={{fontSize:14.7, color: '#000000', letterSpacing: -0.05}}>{address.memo}</Text>
                                </View>
                                <View style={{justifyContent: 'flex-end', paddingBottom: 3, paddingLeft: 15}}>
                                    <Text style={{fontSize:10, color: '#686868', letterSpacing: -0.05}}>{address.address}</Text>
                                </View>
                                {!(address.destinationTag == '' || address.destinationTag == null) && (
                                    <View style={{justifyContent: 'flex-end', paddingBottom: 3, paddingLeft: 15}}>
                                        <Text style={{fontSize:10, color: '#686868', letterSpacing: -0.05}}>({address.destinationTag})</Text>
                                    </View>
                                )}                                
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

export default AddressBookDialog;