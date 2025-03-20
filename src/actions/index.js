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

export const login = (loginInfo, organization) => (
  {
    type: LOGIN,
    loginInfo: loginInfo,
    organization: organization,
  }
)

export const logout = () => (
  {
    type: LOGOUT,
  }
)

export const setLoginInfoSecurityLevel = securityLevel => (
  {
    type: SET_LOGIN_INFO_SECURITY_LEVEL,
    securityLevel: securityLevel,
  }
)

export const setLoginInfoNickname = nickname => (
  {
    type: SET_LOGIN_INFO_NICKNAME,
    nickname: nickname,
  }
)

export const setLoginInfoAccount = (account, bankCode) => (
  {
    type: SET_LOGIN_INFO_ACCOUNT,
    account: account,
    bankCode: bankCode,
  }
)

export const setLoginInfoHideBalance = hideBalance => (
  {
    type: SET_LOGIN_INFO_HIDE_BALANCE,
    hideBalance: hideBalance,
  }
)

export const setCoinList = coinList => (
  {
    type: SET_COIN_LIST,
    coinList: coinList,
  }
);

export const setCoinBalance = coinList => (
  {
    type: SET_COIN_BALANCE,
    coinList: coinList,
  }
);

export const setCoinAddress = (coinType, address, destinationTag) => (
  {
    type: SET_COIN_ADDRESS,
    coinType: coinType,
    address: address,
    destinationTag: destinationTag
  }
);

export const setCoinFee = coinList => (
  {
    type: SET_COIN_FEE,
    coinList: coinList,
  }
);

export const setCoinCurrency = coinList => (
  {
    type: SET_COIN_CURRENCY,
    coinList: coinList,
  }
);

export const setCoinServerWallet = coinList => (
  {
    type: SET_COIN_SERVERWALLET,
    coinList: coinList,
  }
);

export const resetCoinList = () => (
  {
    type: RESET_COIN_LIST
  }
);