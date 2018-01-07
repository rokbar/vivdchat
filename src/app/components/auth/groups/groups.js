import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import CreateGroupIcon from 'material-ui/svg-icons/content/add-circle';
import GroupsList from './groupsList';
import CreateGroupDialog from './createGroupDialog';
import {
  fetchGroupsByUser,
  acceptInvitation,
  declineInvitation,
  leaveGroup
} from '../../../actions/index';

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  handleSubmit(group, action) {
    action(group);
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  componentDidMount() {
    this.props.fetchGroupsByUser();
  }

  render(props) {
     return (
      <div>
        <GroupsList
          acceptInvitation={this.props.acceptInvitation}
          declineInvitation={this.props.declineInvitation}
          leaveGroup={this.props.leaveGroup}
          handleSubmit={(group, action) => this.handleSubmit(group, action)}
          groups={this.props.groups}
        />
        <FlatButton
          label="Create group"
          icon={<CreateGroupIcon />}
          onClick={this.handleOpen}
        />
        <CreateGroupDialog
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          open={this.state.open}
        />
      </div>
    );
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
