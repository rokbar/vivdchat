import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton, TextField, Dialog, Paper } from 'material-ui';
import { connect } from 'react-redux';
import { inviteUser, apiError } from '../../../actions';

class InviteUserDialog extends Component {
  constructor(props) {
    super(props);
  }

  handleFormSubmit = ({ username }) => {
    const group = this.props.groupId;
    if (group && username) {
      new Promise((resolve, reject) => {
        this.props.inviteUser({ group, user: username }, resolve, reject);
      })
        .then(() => {
          this.props.handleClose();
        });
    }
  }

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <Paper
          zDepth={1}
          style={{ margin: '5px auto', maxWidth: '300px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'rgb(244, 67, 54) 0px 1px 6px' }}
        >
          <div style={{ color: 'rgb(244, 67, 54)', fontSize: '14px' }}>
            <strong>Opps!</strong> {this.props.errormessage}
          </div>
        </Paper>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { username } } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={false}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Invite"
        type="submit"
        form="inviteUser"
        primary={true}
        keyboardFocused={true}
      />,
    ]

    return (
      <Dialog
        title="Invite user to group"
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        <form id="inviteUser" onSubmit={handleSubmit(this.handleFormSubmit)}>
          <Field component={renderField} name="username" label="User name" type="text" />
        </form>
        {this.renderAlert()}
      </Dialog>
    );
  }
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <TextField
    floatingLabelText={label}
    type={type}
    {...input}
    errorText={touched && error}
  />
)

const validate = formProps => {
  const errors = {};

  if (!formProps.username) {
    errors.username = "Please enter username";
  }

  return errors;
}

function mapStateToProps(state) {
  return { errormessage: state.errors.error };
}

InviteUserDialog = reduxForm({
  form: 'inviteUser',
  fields: ['username'],
  validate,
})(InviteUserDialog)

export default connect(mapStateToProps, { inviteUser })(InviteUserDialog);
