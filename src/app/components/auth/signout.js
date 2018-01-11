import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signoutUser } from '../../actions';

class Signout extends Component {
  componentWillMount() {
    this.props.signoutUser();
  }

  render() {
    return (
      <div style={{ height: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        Sorry to see you go...
    </div>
    );
  }
}

export default connect(null, { signoutUser })(Signout);