import React, { Component } from 'react';
import DelegateModal from './DelegateModal';
import RedelegateModal from './RedelegateModal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";


class DelegateNow extends Component {
  constructor(props) {
    super(props);
  }
  render(){
  return (
    <div className="show-stage_sub" id="delegatenow">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Tabs>
              <TabList>
                {this.props.delegate && <Tab>Delegate Now</Tab>}
                {this.props.redelegate && <Tab>Redelegate your rewards</Tab>}
                {this.props.withdraw && <Tab>Withdraw Rewards</Tab>}
              </TabList>
              {this.props.delegate && <TabPanel>
                <DelegateModal validator_addr={this.props.validator_addr} api_url={this.props.api_url} fee={this.props.fee} memo={this.props.memo} chainID={this.props.chainID} validator_name={this.props.validator_name}/>
              </TabPanel>}
              {this.props.redelegate && <TabPanel>
              <RedelegateModal validator_addr={this.props.validator_addr} api_url={this.props.api_url} fee={this.props.fee} memo={this.props.memo} chainID={this.props.chainID} validator_name={this.props.validator_name}/>
              </TabPanel>}
              {this.props.withdraw && <TabPanel>
              <h3>Test</h3>
              </TabPanel>}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
}

export default DelegateNow
