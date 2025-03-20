import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Clipboard,
    Keyboard,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Language from '../../lib/util/language';
import { Navigation } from 'react-native-navigation';
import QRCodeScanner from 'react-native-qrcode-scanner';
import color from '../../res/color';
import Button from 'react-native-button';
import BorderInput from '../input/BorderInput';
import CircleButton from '../button/CircleButton';
import layout from '../../res/layout';
import toast from '../../lib/util/toast';

class QrDialog extends Component {
    constructor(props) {
        super(props)
        string = Language.getString();
    }

    render(){
        return(
            <TouchableWithoutFeedback diabled={true} onPress={Keyboard.dismiss} accessible={false}>
            <TouchableOpacity style={styles.dialogContainer} onPress={()=>this.dismiss()} activeOpacity={1}>
                <TouchableWithoutFeedback diabled={true}>
                    <View style={styles.dialog}>
                        <View style={{ padding: 15 }}>
                            <Text style={{ fontSize: 18, letterSpacing: -0.05, color: '#000' }}>
                                {string.captureQrTitle}
                            </Text>
                            <View style={{ width: 23, height: 2, backgroundColor: color.mainColor, marginTop: 20, marginBottom: 15 }}/>
                                <Text style={{ fontSize: 14, letterSpacing: -0.05, color: '#686868', lineHeight: 19 }}>
                                {string.captureQrDetail}
                                </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                <View style={{ width: Dimensions.get('window').width * 0.7, height: Dimensions.get('window').width * 0.7, overflow: 'hidden' }}>
                                <QRCodeScanner
                                    cameraStyle={{
                                    flex: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                    height: Dimensions.get('window').width * 0.7,
                                    width: Dimensions.get('window').width * 0.7,
                                    }}
                                    cameraProps={{ captureAudio: false }}
                                    onRead={(e) => {
                                        this.props.onReadQr(e);
                                        this.dismiss();
                                    }}
                                />
                                </View>
                            </View>

                            <View style={{ height: 20 }}/>

                            {/* <View style={{ flexDirection: 'row' }}>
                                <View
                                    style={{
                                    justifyContent: 'center',
                                    flex: 1,
                                    paddingHorizontal: 15,
                                    }}>
                                    <BorderInput
                                        placeholder={string.manualInput}
                                        value={this.state.virtualAccount}
                                        onChangeText={text => {
                                            this.setState({ virtualAccount: text.trim() });
                                        }}
                                        // error={errors.virtualAccount}
                                        addonAfter={
                                            <Button containerStyle={[ layout.btnNormalContainer, { width: 30, marginLeft: 10 }, ]} style={layout.btnNormal}
                                                onPress={async() => {
                                                    this.setState({ virtualAccount: await Clipboard.getString() })
                                                }}>
                                                {string.copy2}
                                            </Button>
                                        }
                                    />
                                </View>                                
                            </View> 

                            <View style={{ height: 10 }}/>*/}

                            {/* <View style={{ padding: 13, flexDirection: 'row' }}>
                                <CircleButton
                                    title={string.manualPurchase}
                                    gradient={[color.gradientColor, color.mainColor]}
                                    onPress={() => {
                                        Clipboard.getString().then(data => {
                                            
                                            if(data == null || data == ''){
                                                toast.show(string.manualPurchaseFail)
                                                return;
                                            } 
    
                                            let validation = true;
                                            if (data.indexOf('?') < 0) validation = false;
                                            else {
                                                if (data.split('?')[0] !== "payment") validation = false;
                                                else {
                                                    let params = data.split('?')[1];
                                                    let vars = params.split('&');
                                                    let idFlag = false;
                                                    let franchiseNameFlag = false;
                                                    let coinTypeFlag = false;
                                                    let priceFlag = false;
    
                                                    for (i = 0; i < vars.length; i++) {
                                                        var pair = vars[i].split('=');
                                                        if (pair[0] == "id") idFlag = true;
                                                        if (pair[0] == "coinType") coinTypeFlag = true;
                                                        if (pair[0] == "price") priceFlag = true;
                                                        if (pair[0] == "franchiseName") franchiseNameFlag = true;
                                                    }
                                                    if (!idFlag || !coinTypeFlag || !priceFlag || !franchiseNameFlag) validation = false;
                                                }
                                            }
                                            
                                            if(!validation) {
                                                toast.show(string.manualPurchaseFail);
                                                return;
                                            } 
                                            this.props.onReadQr({data: data});
                                            this.dismiss();
                                        });
                                    }}
                                />
                            </View> */}
                        </View>

                        <View style={{ height: 1, backgroundColor: '#dadada' }}></View>

                        <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ padding: 17, flex: 1, justifyContent: 'center' }}
                            onPress={() => {
                                this.dismiss();
                            }}>
                            <Text style={{ fontSize: 17, letterSpacing: -0.05, color: '#000', textAlign: 'center' }}>{string.close}</Text>
                        </TouchableOpacity>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <KeyboardSpacer/>
            </TouchableOpacity>
            </TouchableWithoutFeedback>
        )
    }

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

export default QrDialog;
