import React from 'react';
import GroupItem from './groupItem';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
} from 'material-ui/Table';
import { map } from 'lodash';

const GroupsList = (props) => {
  const actions = {
    acceptInvitation: props.acceptInvitation,
    declineInvitation: props.declineInvitation,
    leaveGroup: props.leaveGroup,
    handleSubmit: props.handleSubmit,
  };
  return (
    <Table selectable={false} >
      <TableHeader displaySelectAll={false} >
        <TableHeaderColumn>Group name</TableHeaderColumn>
        <TableHeaderColumn>State</TableHeaderColumn>
        <TableHeaderColumn>Actions</TableHeaderColumn>
      </TableHeader>
      <TableBody>
        {getGroupsList(props.groups, actions)}
      </TableBody>
    </Table>
  );
}

const getGroupsList = (groups, actions) => {
  return map(groups, (item, index) => {
    return <GroupItem
      {...item} index={index}
      acceptInvitation={item.user.state === 0 ? actions.acceptInvitation : undefined}
      declineInvitation={item.user.state === 0 ? actions.declineInvitation : undefined}
      leaveGroup={item.user.state === 1 ? actions.leaveGroup : undefined}
      handleSubmit={actions.handleSubmit}
    />
  });
}

export default GroupsList;
