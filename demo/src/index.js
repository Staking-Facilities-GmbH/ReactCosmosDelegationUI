import React, {Component} from 'react';
import {render} from 'react-dom';

import CosmosLedgerUI from '../../src';

class Demo extends Component {
  render() {
    return <div>
    <h2>React Cosmos Delegation UI Demo</h2>
      <CosmosLedgerUI validator_addr="cosmosvaloper1x88j7vp2xnw3zec8ur3g4waxycyz7m0mahdv3p" api_url="https://backend2.stakingfacilities.com:8443" fee={10} memo="Powered by OpenSource" chainID="cosmoshub-3"/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
