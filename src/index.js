import React, {Component} from 'react'
import DelegateNow from './DelegateNow'



export default class extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return <div>
      <div>
      <DelegateNow validator_addr={this.props.validator_addr} api_url={this.props.api_url} fee={this.props.fee} memo={this.props.memo} chainID={this.props.chainID}/>
      </div>
    </div>
  }
}
