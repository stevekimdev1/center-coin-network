import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Language from '../../lib/util/language';

class BasicDialog {
    constructor() {
        string = Language.getString();
    }

    show(children) {
        let sibling = new RootSiblings(
            <TouchableOpacity style={styles.dialogContainer} onPress={()=>this.dismiss()} activeOpacity={1}>
                <TouchableWithoutFeedback diabled={true}>
                    <View style={styles.dialog}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
                <KeyboardSpacer/>
            </TouchableOpacity>
        );
        global.dlg.push(sibling);
    }
    dismiss() {
      if (global.dlg.length > 0) {
        let lastSibling = global.dlg.pop();
        lastSibling && lastSibling.destroy();
      }
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

export default BasicDialog;