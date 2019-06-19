import React, { Component } from 'react';
import ledgerLogo from './images/ledger.png';
import cosmosLogo from './images/cosmosLogo.png';
import infoLogo from './images/info_black.png';
import * as ledger from 'ledger-cosmos-js';
import * as crypto from './crypto/crypto.js';
import * as wallet from './crypto/wallet.js';
import { signatureImport } from "secp256k1";
import ReactJson from 'react-json-view';
import Loader from 'react-loader-spinner'
import { SliderRail, KeyboardHandle, Track, Tick} from './slider/SliderComponent'
import ReactTooltip from 'react-tooltip'
import {InputGroup, FormControl} from 'react-bootstrap'
import './css/subsitescustom.css'
import './css/delegatemodal.css'
import './css/bootstrap.min.css'


export function Handle({ // your handle component
                           handle: { id, value, percent },
                           getHandleProps
                       }) {
    return (
        <div
            style={{
                left: `${percent}%`,
                position: 'absolute',
                marginLeft: -15,
                marginTop: 25,
                zIndex: 2,
                width: 30,
                height: 30,
                border: 0,
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                backgroundColor: '#2C4870',
                color: '#333',
            }}
            {...getHandleProps(id)}
        >
            <div style={{ fontFamily: 'Roboto', fontSize: 11,fontWeight:'bold', marginTop: -36 }}>
                 {value/1000000} ATOM
            </div>
        </div>
    )
}



const HDPATH = [44, 118, 0, 0, 0];
const TIMEOUT = 5000;

class LedgerRedelegateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { ledger: null, version: null, address: null, addressOpen:false};
    this.RedelegationLedgerModal = React.createRef();
  }
  componentDidMount() {
    console.warn("Initializing Ledger App...")
    this.pollLedger()
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 800);
  }
  componentWillUpdate() {

    if(this.state.ledger == null) {
      this.pollLedger()
    }

    if(this.state.ledger != null) {
      this.getVersion(this.state.ledger)
    } else {
      console.warn("Did not find Ledger.")
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  pollLedger = async () => {
    const communicationMethod = await ledger.comm_u2f.create_async(
          TIMEOUT,
          true
        )
    const app = new ledger.App(communicationMethod)
    this.setState({ ledger: app });
  }

  signTx = async () => {

    var signMessage = wallet.createSignMessage(this.state.txMsg, this.state.requestMetaData)
    try {
      this.setState({errorMessage:'Waiting for Ledger input...'})
      const pubKeyBuffer = Buffer.from(this.state.cpk, `hex`)
      const ledgerSignature = (await this.state.ledger.sign(HDPATH, signMessage))
      if(ledgerSignature.return_code === 36864){
        const signatureByteArray = ledgerSignature.signature
        const signatureBuffer = signatureImport(signatureByteArray)
        const signature = wallet.createSignature(signatureBuffer,
        5,
        1003,
        pubKeyBuffer)
        const signedTx = wallet.createSignedTx(this.state.txMsg, signature)
        const body = wallet.createBroadcastBody(signedTx)
        this.setState({txBody: body, errorMessage:null})
      } else {
        console.error(ledgerSignature.error_message)
        this.setState({errorMessage: ledgerSignature.error_message, txBody: null})
      }
    } catch ({ message, statusCode }) {
      console.error("sign error", message, statusCode)
    }
  }
  generateTx = async () => {
    const txMsg = {
        msg: [{"type":"cosmos-sdk/MsgWithdrawDelegationReward","value":{"delegator_address":this.state.address,"validator_address":this.props.validator_addr}},{type:"cosmos-sdk/MsgDelegate",value:{delegator_address:this.state.address,validator_address:this.props.validator_addr,amount:{denom:"uatom",amount:String(this.state.rewards)}}}],
        fee: { amount: [{ denom: "uatom", amount: String(this.props.fee) }], gas: String(200000) },
        signatures: null,
        memo: this.props.memo
    }
    const requestMetaData = {
            sequence: String(this.state.addressInfo.sequence),
            from: this.state.address,
            account_number: String(this.state.addressInfo.account_number),
            chain_id: this.props.chainID,
            gas: String(200000),
            generate_only: false
          }
    await this.setState({txMsg: txMsg, requestMetaData: requestMetaData, txBody: null, errorMessage:null})
    await this.signTx()
    if (this.state.txBody !== null) {
      await this.injectTx()
    }
  }

  showJson = async () => {
    this.setState({showJson: true})
  }
  hideJson = async () => {
    this.setState({showJson: false})
  }

  getVersion = async () => {
    try {
      const version = await this.state.ledger.get_version()
      if(this.state.version == null || version.return_code !== this.state.version) {
        this.setState({txMsg:null, address: null, addressOpen: false, requestMetaData: null, txBody: null, errorMessage:null, version: version.return_code, confirmed: false, waitConfirm: false, injected:false})
        console.warn("Ledger app version", this.state.version)
      }
      if(this.state.version === 36864 && this.state.address == null) {
        let pk
        let cpk
        try {
          if(this.state.pk !== undefined) {
            pk = this.state.pk
            cpk = this.state.cpk
            console.log(pk, cpk)
          } else {
            pk = (await this.state.ledger.publicKey(HDPATH)).pk
            cpk = this.state.ledger.compressPublicKey(pk)
            this.setState({pk: pk, cpk: cpk})
          }
          const address = crypto.getAddressFromPublicKey(pk)
          const addressInfo = await fetch(this.props.api_url + '/public/getAddress', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'address': address
            }
          })
          const data = await addressInfo.json()
          let atom
          for (var i in data.value.coins) {
            if (data.value.coins[i].denom === "uatom") {
              atom = [parseInt(data.value.coins[i].amount)]
            }
          }

          const rewardsInfo = await fetch(this.props.api_url + '/public/getRewards', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'address': address
            }
          })
          const rewardData = await rewardsInfo.json()
          let rewards
          for (var i in rewardData) {
            if (rewardData[i].denom === "uatom") {
              rewards = [parseInt(rewardData[i].amount)]
            }
          }

          this.setState({address: address, addressOpen:true, addressInfo: data.value, maxAtom: atom - this.props.fee, rewards:rewards})
        } catch ({ message, statusCode }) {
          console.error("pk error", message, statusCode)
        }
      }
    } catch ({ message, statusCode }) {
      console.error("version error", message, statusCode)
    }
  }

  injectTx = async () => {
    this.setState({txMsg: null, addressOpen: false, injected: true, confirmed: false, waitConfirm: true})
    //window.scrollTo(0, this.RedelegationLedgerModal.current.offsetTop - 100);
    const response = await fetch(this.props.api_url + '/public/injectTx', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: this.state.txBody,
    })
    const data = await response.json()
    this.setState({confirmed: true, waitConfirm: false, confirmedTx: data})
  }
  render() {
    return(
    <div className="row" ref={this.RedelegationLedgerModal}>
      {this.state.version !== 36864 &&
        <div className="col-lg-12 text-center" style={{minHeight: "280px"}}>
          <div className="centered padd-25">
          <h3>Create your transaction</h3>
          <div>Connect your Ledger Nano S to the computer</div>
          </div>
          <img className="ledger" style={{maxWidth:'50%', marginTop:'-16px'}} src={ledgerLogo} alt="ledger"/>
          <div className="centered" style={{marginTop:'16px'}}>Open the
          <a data-tip data-for='cosmosApp'> "Cosmos" <img style={{fill: '#8c99ad'}} src={infoLogo} alt="Info Logo"/> </a>
          <ReactTooltip place="bottom" id='cosmosApp' type="dark">
            <span>
            <ul className="list-unstyled"><li>1. Download the Ledger Live app.</li> <li>2. Connect your ledger via USB and update to the latest firmware</li> <li>3. Go to the ledger live app store, and download the "Cosmos" application (this can take a while).</li> <li><strong>Note: You may have to enable <code>Dev Mode</code> in the <code>Settings</code> of Ledger Live to be able to download the "Cosmos" application</strong></li> <li>4. Navigate to the Cosmos app on your ledger device</li></ul>
            </span>
          </ReactTooltip>
           application</div>
        </div>
      }
      {this.state.version === 36864 && !this.state.addressOpen && !this.state.injected &&
      <div className="col-lg-12 text-center" style={{minHeight: "280px"}}>
        <div className="centered padd-25">
          <h3 className="currentStepHeadline">One moment, please!</h3>
          <div className="padd-25">Querying your Cosmos account from the blockchain. This might take some time...</div>
          <Loader
           type="Oval"
           color="#8B9CB6"
           height="32"
           width="32"/>
        </div>
        </div>
      }
      {this.state.addressOpen &&
        <div className="col-lg-12 text-center w-100">
        <div className="padd-25">
          <h3 className="currentStepHeadline">Create your transaction</h3>
          <p>Your address: <span className="cos-address">{this.state.address}</span></p>

          {this.state.rewards > 0 ?
            <div>
              <p>Your outstanding rewards: <span className="cos-address purple">{(this.state.rewards)/1000000} ATOM </span></p>
            </div>
          :
            <div className="padd-25">This account doesn't have any outstanding rewards.</div>
          }

        </div>
        {this.state.maxAtom > 0 &&
        <div>
          <div className="padd-bot-25">
            <h6 style={{fontSize:10, marginTop:10, fontWeight:'bold'}}>*This transaction will cost you {this.props.fee / 1000000} ATOM in fees.*</h6>
            <button className="btn btn-auth-login" onClick={() => this.generateTx()}>Generate & Sign Redelegation Transaction</button>
          </div>
        </div>
        }
        {
          this.state.maxAtom <= 0 || isNaN(this.state.maxAtom) &&
          <div>
              <div className="padd-bot-25">
                  <p style={{fontWeight:'bold'}}>Your account needs at least {this.props.fee / 1000000} ATOM to pay for the transaction fee. This is a common problem for everyone who delegated all ATOMs.</p>
              </div>
          </div>
        }
        </div>
      }
      {this.state.txMsg != null &&
        <div className="col-lg-12 background">
          <div className="text-center">
            {this.state.txBody != null &&
            <div>
            <p style={{paddingTop: "-16px"}}><span className="cos-address">Signed transaction successfully</span></p>
            </div>
            }
            {this.state.errorMessage != null &&
            <div>
            <p style={{paddingTop: "-16px"}}><span className="cos-address">{this.state.errorMessage}</span></p>
            </div>}
          </div>
          {!this.state.showJson &&
          <p className="text-center" style={{marginTop:"0px"}}><span className="cos-address">[<a style={{color:'#546C91', cursor:'pointer'}} onClick={() => this.showJson()}>View Raw Transaction</a>]</span></p>
        }
            {this.state.showJson &&
              <div style={{paddingBottom:"15px"}}>
              <p className="text-center" style={{marginTop:"0px"}}><span className="cos-address">[<a style={{color:'#546C91', cursor:'pointer'}} onClick={() => this.hideJson()}>Hide Raw Transaction</a>]</span></p>
              <ReactJson style={{lineHeight: "0.64", padding: "15px",paddingBottom:"5px", borderRadius: "5px", backgroundColor: "white", textAlign: "initial !important"}} collapsed="5" theme="greyscale" iconStyle="triangle" enableClipboard={false} displayDataTypes={false} displayObjectSize={false} src={this.state.txMsg} />
              </div>
            }
        </div>}

      {this.state.injected &&
        <div className="col-lg-12 text-center background" style={{minHeight: "280px"}}>
        {this.state.confirmed &&
        <div className="padd-25">
        <h3>Congratulations!</h3>
        <div className="padd-25 delSucessMsg"><a href={'https://www.mintscan.io/txs/' + this.state.confirmedTx.txhash} target="_blank">Transaction confirmed!</a> Thank you for delegating to {this.props.validator_name}.</div>
        <img style={{maxWidth:'15%', marginTop:'8px'}} src={cosmosLogo} alt="Logo"/>
        </div>}
        {this.state.waitConfirm &&
        <div className="padd-25">
        <h3>Committing transaction</h3>
        <div className="padd-25">One moment! Waiting for Transaction to be confirmed...</div>
        <Loader
         type="Oval"
         color="#8B9CB6"
         height="32"
         width="32"/>
        </div>}
        </div>}
    </div>
  );
}
}
export default LedgerRedelegateComponent;
