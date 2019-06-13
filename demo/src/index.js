import React, {Component} from 'react';
import {render} from 'react-dom';

import CosmosLedgerUI from '../../src';
import '../../src/css/delegatemodal.css';

class Demo extends Component {
  render() {
    return <div>
      <CosmosLedgerUI validator_addr="cosmos123" api_url="https://backend2.stakingfacilities.com:8443" fee={20000}/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
