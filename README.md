# react-cosmos-delegation-ui

[![npm version](https://badge.fury.io/js/react-cosmos-delegation.svg)](https://badge.fury.io/js/react-cosmos-delegation)

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.com/package/react-cosmos-delegation

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

# Motivation

Delegating to smaller validators helps Cosmos to stay decentralized. In order to help in achieving this, we at Staking Facilities decided to open source a variant of our React Delegation Component. Smaller validators can either fork this code base to create their own version of the tool or just include this into their website and directly receive delegations.

# Features

* On Website Delegation using Ledger Nano S
* Customizable Parameters like TxFee, TxMemo or ChainID
* Redelegation (`cosmos-sdk/MsgWithdrawDelegationReward` and `cosmos-sdk/MsgDelegate` in one transaction)
* Withdraw Rewards
* Decide which functions you want to enable


TBD
------

* Clean up Code

# Installation & Setup

Please note that the Ledger Nano S requires HTTPS to function with your browser. If your website does not support HTTPS, you will not be able to use this tool. The LCD to connect to is also required to have HTTPS enabled. A big thanks to [Peng Zhong / nylira.net](https://twitter.com/zcpeng) to provide a public HTTPS enabled LCD! (You should still use your own if you have one)

```
npm i react-cosmos-delegation
```

```JS
import CosmosLedgerUI from 'react-cosmos-delegation';

...

<CosmosLedgerUI validator_name="Staking Facilities" validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" lcd="https://lcd.nylira.net" fee={1} memo="Powered by OpenSource" chainID="cosmoshub-2" delegate={true} redelegate={true} withdraw={true} />



```

#### Parameters
```JS
validator_name="Staking Facilities" //Validator name displayed
validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" //Address of your validator
lcd="https://lcd.nylira.net" //LCD (HTTPS enabled) to query information && inject transactions
fee={1} //Transaction fee in uatom
memo="Powered by OpenSource" //Memo field of transaction
chainID="cosmoshub-2" //ChainID you want to inject to
delegate={true} //Display delegation tab
redelegate={true} //Display redelegation tab (`cosmos-sdk/MsgWithdrawDelegationReward` and `cosmos-sdk/MsgDelegate` in one transaction)
withdraw={true} //Display withdraw rewards tab

```
