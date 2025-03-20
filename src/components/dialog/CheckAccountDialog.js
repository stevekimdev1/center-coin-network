import React, { Component } from 'react';
import {
  Dimensions, StyleSheet, Text,
  TouchableOpacity, TextInput,
  TouchableWithoutFeedback, View
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Navigation } from 'react-native-navigation';
import Language from '../../lib/util/language';
import Toast from '../../lib/util/toast';
import color from '../../res/color';
import CircleButton from '../button/CircleButton';
import { httpPost, httpUrl } from '../../api/httpClient';

class CheckAccountDialog extends Component {
  constructor(props) {
    super(props);
    string = Language.getString();
    this.state = {
    };
  }

  close = () => {
    this.props.close();
    this.dismiss();
  }

  dismiss() {
    Navigation.dismissModal(this.props.componentId);
  }
  
  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity
        style={styles.dialogContainer}
        onPress={() => this.dismiss()}
        activeOpacity={1}>
        <TouchableWithoutFeedback diabled={true}>
          <View style={styles.dialog}>
            <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
              <Text style={{ textAlign: 'left', fontSize: 20, color: color.mainColor, fontWeight: 'bold' }}>상대 계좌 정보</Text>
            </View>
            <View style={{margin: 20}}>
              <View style={styles.titleView} >                 
                <Text style={styles.titleText}>{string.bank} : </Text>    
                <Text style={styles.subText}>{data.bank}</Text>          
              </View>

               <View style={styles.titleView} >                
                <Text style={styles.titleText}>{string.bankAccount} : </Text>     
                <Text style={styles.subText}>{data.bankAccount}</Text>                 
              </View>

              <View style={styles.titleView} >              
                <Text style={styles.titleText}>{string.bankHolder} : </Text>
                <Text style={styles.subText}>{data.bankHolder}</Text>    
              </View>
            </View>      

            <TouchableOpacity 
              onPress={()=>{this.dismiss()}}
              style={{paddingTop: 15, alignItems:'center', justifyContent:'center', borderTopColor: '#d1d1d1', borderTopWidth: 1}}>
              <Text style={{fontSize: 16}}>닫기</Text>
            </TouchableOpacity> 
          </View> 
        </TouchableWithoutFeedback>
        <KeyboardSpacer />
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
  titleView: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    marginBottom: 8,
  },
  inputStyle: {
    textAlign: 'center',
    marginLeft: 20,
    fontSize: 16,
    borderBottomColor: color.gray,
    borderBottomWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 20,
    color: color.black,
    width: deviceW * 0.4
  },
  titleText:{
    fontSize: 16, 
    flex: 0.3,
  },
  subText: {
    textAlign: 'center',
    fontSize: 16,
    flex : 0.6,
    fontWeight:'bold'
  },
});

export default CheckAccountDialog;
