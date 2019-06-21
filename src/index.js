import React, {Component} from 'react'
import DelegateNow from './DelegateNow'



export default class extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return <div>
      <div>
      <DelegateNow validator_addr={this.props.validator_addr} lcd={this.props.lcd} fee={this.props.fee} memo={this.props.memo} chainID={this.props.chainID} delegate={this.props.delegate} redelegate={this.props.redelegate} withdraw={this.props.withdraw} validator_name={this.props.validator_name}/>
      </div>
    </div>
  }
}
