import React, { Component } from 'react'
import LedgerComponent from './LedgerComponent.js';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import final_del from './images/final_delegation.png'
import slider from './images/slider.png'
import signTx from './images/signTxNew.gif'
import ledgerLogo from './images/ledger.png';
import AnimatedNumber from 'react-animated-number';

const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: 3200,
      autoplay: true,
      lazyLoad: 'ondemand',
      draggable: true,
    };

const getRandomInt = (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min);

class DelegateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { modalShow: false };
    console.log("Constructed")
    this.state = {
            bigValue: 3064,
        }
  }

  openModal = async () => {
    this.setState({modalShow: true})
  }

    render() {
        return (
          <div className="w-100 padding-top-bot">
          {this.state.modalShow ? (
            <LedgerComponent style={{padding:'50px'}}/>
          ) : (
            <div className="col text-center spawn-modal background" style={{minHeight: "280px"}}>
            <Slider {...settings}       afterChange={ function (index) {
                       if(index === 1) {
                         this.setState({
                             bigValue: getRandomInt(1024, 9999),
                         });
                       }
                    }.bind(this)}>
          <div>
          <div className="padd-25">
            <h3>1. Connect your ledger</h3>
          </div>
            <img src={ledgerLogo} style={{maxWidth:'50%', marginTop:'-16px', marginLeft:'auto', marginRight:'auto'}}/>
          </div>
          <div>
          <div className="padd-25">
            <h3>2. Select the size of your delegation</h3>
          </div>
            <AnimatedNumber value={this.state.bigValue}
             style={{
                 transition: '0.8s ease-out',
                 fontSize: 48,
                 transitionProperty:
                     'background-color, color, opacity'
             }}
             formatValue={n => `${n} ATOM`}
             duration={2000} stepPrecision={0}
           />
          </div>
          <div>
          <div className="padd-25">
            <h3>3. Verify & Sign the Transaction</h3>
            </div>
            <img src={signTx} style={{maxWidth:'50%', marginTop:'-16px', marginLeft:'auto', marginRight:'auto'}}/>
          </div>
          <div>
          <div className="padd-25">
            <h3>4. Wait for confirmation</h3>
            </div>
            <img src={final_del} style={{maxWidth:'50%',maxHeight:'200px', marginTop:'-16px', marginLeft:'auto', marginRight:'auto'}}/>
          </div>
        </Slider>
        <div className="padd-25 margin-top-25">
                <h6 style={{fontSize:10, marginTop:10, fontWeight:'bold'}}>* Currently supported on Brave Browser, Chrome & Opera *</h6>
                <button href="#" className="btn delegatenowbtn" onClick={() => this.openModal()} > Delegate now with your Ledger</button>
                </div>
            </div>
          )}
          </div>
                );
}
}
export default DelegateModal