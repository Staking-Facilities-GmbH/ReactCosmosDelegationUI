import React, {Component} from 'react'
import DelegateNow from './DelegateNow'
import './css/delegatemodal.css';




export default class extends Component {
  render() {
    return <div>
      <h2>React Cosmos Delegation UI Demo</h2>
      <div>
      <DelegateNow/>
      </div>
    </div>
  }
}