import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupsList from './groupsList';
import {
  fetchGroupsByUser,
  acceptInvitation,
  declineInvitation,
  leaveGroup
} from '../../../actions/index';

class Groups extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(group, action) {
    action(group);
  }

  componentDidMount() {
    this.props.fetchGroupsByUser();
  }

  render(props) {
    return <GroupsList
      acceptInvitation={this.props.acceptInvitation}
      declineInvitation={this.props.declineInvitation}
      leaveGroup={this.props.leaveGroup}
      handleSubmit={(group, action) => this.handleSubmit(group, action)}
      groups={this.props.groups}
    />;
  }
}

function mapStateToProps(state) {
  return { groups: state.groups }
}

export default connect(
  mapStateToProps, {
    fetchGroupsByUser,
    acceptInvitation,
    declineInvitation,
    leaveGroup,
  }
)(Groups);
