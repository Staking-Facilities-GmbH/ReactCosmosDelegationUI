import React, {Component} from 'react'
import {render} from 'react-dom'

import CosmosLedgerUI from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <CosmosLedgerUI/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
