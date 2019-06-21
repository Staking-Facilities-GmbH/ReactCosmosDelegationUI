# react-cosmos-delegation-ui

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

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
* Decide if you want to enable redelegate and/or withdraw tab


TBD
------

* Clean up Code

# Installation & Setup

Please note that the Ledger Nano S requires HTTPS to function with your browser. If your website does not support HTTPS, you will not be able to use this tool. The backend is used to serve HTTPS content from an RPC to the component.

```
npm i react-cosmos-delegation
```

```JS
import CosmosLedgerUI from 'react-cosmos-delegation';

...

<CosmosLedgerUI validator_name="Staking Facilities" validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" lcd="https://backend2.stakingfacilities.com:8443" fee={1} memo="Powered by OpenSource" chainID="cosmoshub-2" delegate={true} redelegate={true} withdraw={true} />



```

#### Parameters
```JS
validator_name="Staking Facilities" //Validator name displayed
validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" //Address of your validator
lcd="https://backend2.stakingfacilities.com:8443" //Backend to query information && inject transactions
fee={1} //Transaction fee in uatom
memo="Powered by OpenSource" //Memo field of transaction
chainID="cosmoshub-2" //ChainID you want to inject to
delegate={true} //Display delegation tab
redelegate={true} //Display redelegation tab (`cosmos-sdk/MsgWithdrawDelegationReward` and `cosmos-sdk/MsgDelegate` in one transaction)
withdraw={true} //Display withdraw rewards tab

```


# TODO
Backend explanation

