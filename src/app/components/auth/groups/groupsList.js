import React from 'react';
import GroupItem from './groupItem';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHeaderColumn,
  TableRowColumn,
} from 'material-ui/Table';
import { map } from 'lodash';

const GroupsList = (props) => {
  const actions = {
    acceptInvitation: props.acceptInvitation,
    declineInvitation: props.declineInvitation,
    leaveGroup: props.leaveGroup,
    handleSubmit: props.handleSubmit,
    handleOpenInviteUser: props.handleOpenInviteUser,
  };
  return (
    <Table selectable={false} style={{ minHeight: '200px' }} >
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow selectable={false}>
          <TableHeaderColumn colSpan="3" style={{ fontSize: '25px' }}>
            Groups List
          </TableHeaderColumn>
        </TableRow>
        <TableRow selectable={false}>
          <TableHeaderColumn style={{ textAlign: 'center' }}>Group name</TableHeaderColumn>
          <TableHeaderColumn style={{ textAlign: 'center' }}>State</TableHeaderColumn>
          <TableHeaderColumn style={{ textAlign: 'center' }}>Actions</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {getGroupsList(props.groups, actions)}
      </TableBody>
    </Table>
  );
}

const getGroupsList = (groups, actions) => {
  if (groups.length) {
    return map(groups, (item, index) => {
      return <GroupItem
        {...item} index={index}
        acceptInvitation={item.user.state === 0 ? actions.acceptInvitation : undefined}
        declineInvitation={item.user.state === 0 ? actions.declineInvitation : undefined}
        leaveGroup={item.user.state === 1 ? actions.leaveGroup : undefined}
        handleSubmit={actions.handleSubmit}
        handleOpenInviteUser={item.user.id === item.leader ? actions.handleOpenInviteUser : undefined}
      />
    });
  } else {
    return (
      <TableRow selectable={false}>
        <TableRowColumn colSpan="3" style={{ textAlign: 'center', fontSize: '15px' }}>
          You do not belong to any group.
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default GroupsList;
