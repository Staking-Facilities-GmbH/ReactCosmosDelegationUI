# react-cosmos-delegation-ui

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

# Motivation

Delegating to smaller validators helps Cosmos to stay decentralized. In order to help in achieving this, we at Staking Facilities decided to open source a variant of our React Delegation Component. Smaller validators can either fork this code base to create their own version of the tool or just include this into their website and directly receive delegations.

# Features

* On Website Delegation using Ledger Nano S
* Customizable Parameters like TxFee, TxMemo or ChainID
* Redelegation (`cosmos-sdk/MsgWithdrawDelegationReward` and `cosmos-sdk/MsgDelegate` in one transaction)

TBD
------

* Clean up Code
* Add Withdraw Rewards Tab

# Installation & Setup

```
npm i react-cosmos-delegation
```

```JS
import CosmosLedgerUI from 'react-cosmos-delegation';

...

<CosmosLedgerUI validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" api_url="https://backend2.stakingfacilities.com:8443" fee={10} memo="Powered by OpenSource" chainID="cosmoshub-2"/>


```
