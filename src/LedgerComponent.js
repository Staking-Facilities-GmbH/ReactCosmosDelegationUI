import React, { Component } from 'react';
import ledgerLogo from './images/ledger.png';
import sfLogo from './images/logo_black.png';
import infoLogo from './images/info_black.png';
import * as ledger from 'ledger-cosmos-js';
import * as crypto from './crypto/crypto.js';
import * as wallet from './crypto/wallet.js';
import { signatureImport } from "secp256k1";
import ReactJson from 'react-json-view';
import { Slider, Handles, Tracks, Rail, Ticks } from 'react-compound-slider'
import Loader from 'react-loader-spinner'
import { SliderRail, KeyboardHandle, Track, Tick} from './slider/SliderComponent'
import ReactTooltip from 'react-tooltip'
import {InputGroup, FormControl} from 'react-bootstrap'
import './css/subsitescustom.css'
import './css/delegatemodal.css'


const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '100%',
    height: 80,
    //border: '1px solid steelblue',
}

const railStyle = {
    position: 'absolute',
    width: '100%',
    height: 10,
    marginTop: 35,
    borderRadius: 5,
    backgroundColor: '#8B9CB6',
}

const fee = 20000;

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

class LedgerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { ledger: null, version: null, address: null, addressOpen:false, sliderValues:[1]};
    this.ledgerModal = React.createRef();
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

  onSliderChange = sliderValues => {
    document.getElementById("input").value = sliderValues/1000000;
    this.setState({ sliderValues: sliderValues})
  }
  onInputChange = inputValue => {
    let lastChar = inputValue.target.value[inputValue.target.value.length -1];
    var converter = inputValue.target.value
      if(!isNaN(converter)){
        this.setState({ sliderValues: [converter*1000000]})
      } else {
        this.setState({ sliderValues: [0]})
    }
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
      console.log("ledger signature code", ledgerSignature.return_code)
      if(ledgerSignature.return_code === 36864){
        const signatureByteArray = ledgerSignature.signature
        const signatureBuffer = signatureImport(signatureByteArray)
        const signature = wallet.createSignature(signatureBuffer,
        this.state.addressInfo.sequence,
        this.state.addressInfo.account_number,
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
        msg: [{type:"cosmos-sdk/MsgDelegate",value:{delegator_address:this.state.address,validator_address:"cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p",amount:{denom:"uatom",amount:String(this.state.sliderValues)}}}],
        fee: { amount: [{ denom: "uatom", amount: String(fee) }], gas: String(150000) },
        signatures: null,
        memo: "Powered by stakingfacilities.com"
    }
    const requestMetaData = {
            sequence: String(this.state.addressInfo.sequence),
            from: this.state.address,
            account_number: String(this.state.addressInfo.account_number),
            chain_id: `cosmoshub-2`,
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
          const addressInfo = await fetch('https://backend2.stakingfacilities.com:8443/public/getAddress', {
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

          this.setState({address: address, addressOpen:true, addressInfo: data.value, maxAtom: atom - fee})
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
    //window.scrollTo(0, this.ledgerModal.current.offsetTop - 100);
      console.log("INJECT TX: ", this.state.txBody)
    const response = await fetch('https://backend2.stakingfacilities.com:8443/public/injectTx', {
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
    <div className="row" ref={this.ledgerModal}>
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
        <div className="centered padd-25">
          <h3 className="currentStepHeadline">Create your transaction</h3>
          <p>Your address: <span className="cos-address">{this.state.address}</span></p>
          <p>Your account has <span className="cos-address purple">{(this.state.maxAtom + fee)/1000000} ATOM</span></p>
          {this.state.maxAtom > 0 ?
            <div>
          <div className="padd-25" style={{marginTop:'-24px', fontWeight:'bold'}}>Important: We recommend keeping a small amount of ATOM unbonded for transaction fees (claim rewards/redelegate/unbond). Select the number of ATOM you want to delegate to Staking Facilities:</div>

          <Slider
                rootStyle={sliderStyle}
                domain={[1, this.state.maxAtom]}
                step={1}
                mode={2}
                values={this.state.sliderValues}
                onChange={this.onSliderChange}
            >
            <Rail>
              {({ getRailProps }) => (  // adding the rail props sets up events on the rail
                <div style={railStyle} {...getRailProps()} />
              )}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div className="slider-handles">
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div className="slider-tracks">
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
             <Ticks count={12}>{({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}</Ticks>
          </Slider>
          </div>
          :
            <div className="padd-25">Sorry! This account doesn't have any ATOM.</div>
          }

        </div>
        {this.state.maxAtom > 0 &&
          <div>
        <div className="padd-25">Or just type it in:</div>
<InputGroup style={{maxWidth:'42%', marginLeft:'auto', marginRight:'auto'}} className="mb-3 input-group">
            <InputGroup.Prepend className="input-group-prepend">
              <InputGroup.Text className="input-group-text" id="basic-addon1">ATOM</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className="form-control"
              placeholder="0"
              aria-label="ATOM"
              step="0.001"
              aria-describedby="Define amount ATOM"
              id="input"
              onChange={this.onInputChange}
            />
          </InputGroup>

        <div className="padd-bot-25">
        <h6 style={{fontSize:10, marginTop:10, fontWeight:'bold'}}>*Warning! This transaction will cost you 0.02 ATOM in fees.*</h6>
          <button className="btn btn-auth-login" onClick={() => this.generateTx()}>Generate & Sign Transaction</button>
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
        <h3 className="currentStepHeadline">Congratulations!</h3>
        <div className="padd-25 delSucessMsg"><a href={'https://www.mintscan.io/txs/' + this.state.confirmedTx.txhash} target="_blank">Transaction confirmed!</a> Thank you for delegating to Staking Facilities!</div>
        <img style={{maxWidth:'15%', marginTop:'8px'}} src={sfLogo} alt="Staking Facilities Logo"/>
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
export default LedgerComponent;
