import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import CreateGroupIcon from 'material-ui/svg-icons/content/add-circle';
import GroupsList from './groupsList';
import CreateGroupDialog from './createGroupDialog';
import InviteUserDialog from './inviteUserDialog';
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
      openCreateGroup: false,
      openInviteUser: false,
      selectedGroup: false,
    }
  }

  handleSubmit(group, action) {
    action(group);
  }

  handleOpenCreateGroup = () => {
    this.setState({ openCreateGroup: true });
  }

  handleCloseCreateGroup = () => {
    this.setState({ openCreateGroup: false });
  }

  handleOpenInviteUser = (groupId) => {
    this.setState({
      openInviteUser: true,
      selectedGroup: groupId,
    });
  }

  handleCloseInviteUser = () => {
    this.setState({ 
      openInviteUser: false,
      selectedGroup: false,
    });
  }

  componentDidMount() {
    this.props.fetchGroupsByUser();
  }

  componentWillUnmount() {
    this.setState({ 
      openInviteUser: false,
      selectedGroup: false,
    });
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
          handleOpenInviteUser={this.handleOpenInviteUser}
        />
        <FlatButton
          label="Create group"
          icon={<CreateGroupIcon />}
          onClick={this.handleOpenCreateGroup}
        />
        <CreateGroupDialog
          handleOpen={this.handleOpenCreateGroup}
          handleClose={this.handleCloseCreateGroup}
          open={this.state.openCreateGroup}
        />
        <InviteUserDialog
          groupId={this.state.selectedGroup}
          handleOpen={this.handleOpenInviteUser}
          handleClose={this.handleCloseInviteUser}
          open={this.state.openInviteUser}
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
