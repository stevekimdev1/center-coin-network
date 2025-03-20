import { NativeModules, Platform } from 'react-native';

class Language {

    static getLanguageList() {
        return [
            {code: 'ko', name: '한국어'},
            {code: 'en', name: 'English'},
            {code: 'ja', name: '日本語'},
        ];
    }
    static getServerLocale() {
        let os = Platform.OS;
        let locale = "";

        if (os == "ios"){
            locale = NativeModules.SettingsManager.settings.AppleLocale;
            if (locale == undefined) locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
        } else if (os == "android") {
            locale = NativeModules.I18nManager.localeIdentifier;
        } else {
            locale = "unknown";
        }
        console.log("## OS : " + os + " / locale : " + locale);
        global.deviceLocale = locale;
        if (!global.deviceLocale || global.deviceLocale.length < 2) global.deviceLocale = 'ko';
        let lang = "ko";
        if (locale.slice(0,2) == "jp") lang = 'ja';
        else if (locale.slice(0,2) == "en") lang = 'en';
        return lang;
    }
    static getString() {

        switch(global.language){
            case 'en': return require('../../res/string_en');
            case 'ja': return require('../../res/string_ja');
            default: return require('../../res/string_ko');
        }
    }
}
export default Language;