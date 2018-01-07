import React from 'react';
import { Link } from 'react-router';
import {
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import AcceptIcon from 'material-ui/svg-icons/action/check-circle';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import LeaveIcon from 'material-ui/svg-icons/content/remove-circle';
import InviteIcon from 'material-ui/svg-icons/social/person-add';
import enumState from './enumState';
import { map } from 'lodash';

const GroupItem = (props) => {
  const handleAccept = (e) => {
    e.preventDefault();
    props.handleSubmit(props.id, props.acceptInvitation);
  }

  const handleDecline = (e) => {
    e.preventDefault();
    props.handleSubmit(props.id, props.declineInvitation);
  }

  const handleLeave = (e) => {
    e.preventDefault();
    props.handleSubmit(props.id, props.leaveGroup);
  }

  const leaderActionButtons = () => {
    return (
      <div style={{ display: 'inline-flex' }}>
        <IconButton containerElement={<Link to={`/chat/${props.id}`} />} tooltip="Join chat" tooltipPosition="left">
          <ChatIcon />
        </IconButton>
        <IconButton onClick={() => props.handleOpenInviteUser(props.id)} tooltip="Invite user" tooltipPosition="left">
          <InviteIcon />
        </IconButton>
      </div>
    )
  };

  const actionButtons = (state) => {
    switch (state) {
      case 0:
        return (
          <div style={{ display: 'inline-flex' }}>
            <form method="post" onSubmit={(e) => handleAccept(e)}>
              <IconButton type="submit" tooltip="Accept invitation" tooltipPosition="left">
                <AcceptIcon />
              </IconButton>
            </form>
            <form method="post" onSubmit={(e) => handleDecline(e)}>
              <IconButton type="submit" tooltip="Decline invitation" tooltipPosition="left">
                <CancelIcon />
              </IconButton>
            </form>
          </div>
        );
      case 1:
        return (
          <div style={{ display: 'inline-flex' }}>
            <IconButton containerElement={<Link to={`/chat/${props.id}`} />} tooltip="Join chat" tooltipPosition="right">
              <ChatIcon />
            </IconButton>
            <form method="post" onSubmit={(e) => handleLeave(e)}>
              <IconButton type="submit" tooltip="Leave group" tooltipPosition="left">
                <LeaveIcon />
              </IconButton>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <span>No actions</span>
          </div>
        );
      case 3:
        return (
          <div>
            <span>No actions</span>
          </div>
        );
    }
  };

  return (
    <TableRow>
      <TableRowColumn style={{ textAlign: 'center' }}>{props.name}</TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>
        {props.user.id === props.leader ? <div>You are group leader</div> : enumState[props.user.state] }
      </TableRowColumn>
      <TableRowColumn style={{ textAlign: 'center' }}>
        {props.user.id === props.leader ? leaderActionButtons() : actionButtons(props.user.state)}
      </TableRowColumn>
    </TableRow>
  );
}

export default GroupItem;
