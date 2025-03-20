import { combineReducers } from 'redux';
import Coin from '../lib/coin/coin';

const SET_COIN_LIST = 'SET_COIN_LIST'
const SET_COIN_BALANCE = 'SET_COIN_BALANCE'
const SET_COIN_ADDRESS = 'SET_COIN_ADDRESS'
const SET_COIN_FEE = 'SET_COIN_FEE'
const SET_COIN_CURRENCY = 'SET_COIN_CURRENCY'
const SET_COIN_SERVERWALLET = 'SET_COIN_SERVERWALLET'
const RESET_COIN_LIST = 'RESET_COIN_LIST'
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const SET_LOGIN_INFO_SECURITY_LEVEL = 'SET_LOGIN_INFO_SECURITY_LEVEL'
const SET_LOGIN_INFO_NICKNAME = 'SET_LOGIN_INFO_NICKNAME'
const SET_LOGIN_INFO_HIDE_BALANCE = 'SET_LOGIN_INFO_HIDE_BALANCE'
const SET_LOGIN_INFO_ACCOUNT = 'SET_LOGIN_INFO_ACCOUNT'

const INITIAL_LOGIN_STATE = {
  loginInfo: {},
};

const INITIAL_COINLIST_STATE = {
  coinList: [],
};

const loginReducer = (state = INITIAL_LOGIN_STATE, action) => {
  let newState;
  switch (action.type) {
    case LOGIN:
      newState = { ...action.loginInfo, organization: {...action.organization} };
      return newState;

    case LOGOUT:
      newState = INITIAL_LOGIN_STATE;
      return newState;

    case SET_LOGIN_INFO_SECURITY_LEVEL:
      state.securityLevel = action.securityLevel;

      newState = { ...state };
      return newState;
    
    case SET_LOGIN_INFO_NICKNAME:
      state.name = action.nickname;

      newState = { ...state };
      return newState;
    
    case SET_LOGIN_INFO_ACCOUNT:
      state.bankAccount = action.account;
      state.bankCode = action.bankCode;

      newState = { ...state };
      return newState;

    case SET_LOGIN_INFO_HIDE_BALANCE:
      state.hideBalanceFlag = action.hideBalance;

      newState = { ...state };
      return newState;

    default:
      return state;
  }
}

const coinListReducer = (state = INITIAL_COINLIST_STATE, action) => {
  let newState;
  let check;
  let target;
  switch (action.type) {
    case SET_COIN_LIST:
      newState = [ ...action.coinList ];
      console.log("## setCoin loaded")
      return newState;

    case SET_COIN_BALANCE:
      action.coinList.forEach((data) => {
        try {
          if (data.balance == null) throw new Error('balance null');

          target = state.find(x=>x.coinType==data.coinType);

          target.address = data.address;

          // console.log("data.balance: " + data.balance);
          // console.log("Coin.getCoinUnit(target.coinType).base: " + Coin.getCoinUnit(target.coinType).base);
          // console.log("Coin.decimalPlace: " + Coin.decimalPlace);

          target.balance = Math.floor(data.balance * Coin.decimalPlace) / Coin.decimalPlace / Coin.getCoinUnit(target.coinType).base;
          target.balanceLoaded = true;

          console.log("target.balance: " + target.balance);

          // invalidateValue
          if (target.balanceLoaded && target.priceLoaded) {
            target.value = Math.floor(target.balance * target.price);
            target.valueLoaded = true;
          }
          else {
            target.value = 0;
            target.valueLoaded = false;
          }

          check = state.find(x=>x.coinType==data.coinType);
          console.log("## balance load: " + check.symbol + ", " + check.coinType + ", " + check.address + ", " + check.balanceLoaded + ", " + check.balance);
        }
        catch(e) {
          console.log("## SET_COIN_BALANCE error: " + e)
        }
      })

      newState = [ ...state ];
      return newState;

    case SET_COIN_ADDRESS:

      let address = action.address
      if (action.destinationTag != null) address += " (Destination Tag) " + action.destinationTag

      // state.find(x=>x.coinType==action.coinType).address = action.address;
      state.find(x=>x.coinType==action.coinType).address = address;

      check = state.find(x=>x.coinType==action.coinType);
      console.log("## address load: " + check.symbol + ", " + check.address);

      newState = [ ...state ];
      return newState;

    case SET_COIN_FEE:
      action.coinList.forEach((data) => {
        try {
          if (data.internalSendFee == null) throw new Error('fee null');

          target = state.find(x=>x.coinType==data.coinType);
          if (!target) return;
          target.purchaseFee = data.purchaseFee / Coin.getCoinUnit(target.coinType).base;
          target.sendInFee = data.internalSendFee / Coin.getCoinUnit(target.coinType).base;
          target.sendExFee = data.externalSendFee / Coin.getCoinUnit(target.coinType).base;
          target.tradeFee = data.tradeFee / Coin.getCoinUnit(target.coinType).base;
          target.feeLoaded = true;

          check = state.find(x=>x.coinType==data.coinType);
          console.log("## fee load: " + check.symbol + ", " + check.feeLoaded + ", " + check.sendInFee + ", " + check.sendExFee + ", " + check.tradeFee + ", " + check.purchaseFee);
        }
        catch(e) {
          console.log("## SET_COIN_FEE error: " + e)
        }
      })

      newState = [ ...state ];
      return newState;
    
    case SET_COIN_CURRENCY:
      action.coinList.forEach((data) => {
        try {
          if (data.quotes.krw.price == null) throw new Error('currency null: ' + data.symbol);

          target = state.find(x => x.symbol == data.symbol);
          if (!target) return;
          console.log(JSON.stringify(data))
          target.price = data.quotes.krw.price > 100 ? Math.round(data.quotes.krw.price) : Math.round(data.quotes.krw.price * 100) / 100;
          target.change = data.quotes.krw.percent_change_24h == 0 ? 0 : data.quotes.krw.percent_change_24h.toFixed(2);
          target.market = data.quotes.krw.market_cap;
          target.trends = data.trends;

          target.trendX = data.trends.map(value => value.logDate).reverse();
          target.trendY = data.trends.map(value => value.price).reverse();

          target.priceLoaded = true;

          // invalidateValue
          if (target.balanceLoaded && target.priceLoaded) {
            target.value = Math.round(target.balance * target.price);
            target.valueLoaded = true;
          }
          else {
            target.value = 0;
            target.valueLoaded = false;
          }

          check = state.find(x => x.symbol == data.symbol);
          console.log("## currency load: " + check.symbol + ", " + check.priceLoaded + ", " + check.price + ", " + check.market + ", " + check.change);
        }
        catch(e) {
          console.log("## SET_COIN_CURRENCY error: " + e)
        }
      })

      newState = [ ...state ];
      return newState;

    // case SET_COIN_SERVERWALLET:
    //   action.coinList.forEach((data) => {
    //     try {
    //       if (data.address == null) throw new Error('serverWallet null');

    //       target = state.find(x=>x.symbol==data.coinType);
    //       target.serverWallet = data.address;
    //       target.serverWalletLoaded = true;

    //       check = state.find(x=>x.symbol==data.coinType);
    //       console.log("## serverwallet load: " + check.symbol + ", " + check.serverWalletLoaded + ", " + check.serverWallet);          
    //     }
    //     catch(e) {
    //       console.log("## SET_COIN_SERVERWALLET error: " + e)
    //     }
    //   })


    //   newState = [ ...state ];
    //   return newState;

    case RESET_COIN_LIST:
      state.forEach((data) => {
        data.status= false;
        data.address= '';
        data.balance= 0;
        data.balanceLoaded= false;
        data.value= 0;
        data.valueLoaded= false;
      })

      newState = [ ...state ];
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
	coinList: coinListReducer, loginInfo: loginReducer
});