import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { FlatButton, TextField, Dialog, Paper } from 'material-ui';
import { connect } from 'react-redux';
import { createNewGroup, apiError } from '../../../actions';

class CreateGroupDialog extends Component {
  constructor(props) {
    super(props);
  }

  handleFormSubmit = ({ name }) => {
    new Promise((resolve, reject) => {
      this.props.createNewGroup({ name }, resolve, reject);
    })
      .then(() => {
        this.props.handleClose();
      });
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
    const { handleSubmit, fields: { name } } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={false}
        onClick={this.props.handleClose}
      />,
      <FlatButton
        label="Create"
        type="submit"
        form="createNewGroup"
        primary={true}
        keyboardFocused={true}
      />,
    ]

    return (
      <Dialog
        title="Create new group"
        actions={actions}
        modal={true}
        open={this.props.open}
      >
        <form id="createNewGroup" onSubmit={handleSubmit(this.handleFormSubmit)}>
          <Field component={renderField} name="name" label="Group name" type="text" />
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

  if (!formProps.name) {
    errors.name = "Please enter group name";
  }

  return errors;
}

function mapStateToProps(state) {
  return { errormessage: state.errors.error };
}

CreateGroupDialog = reduxForm({
  form: 'createNewGroup',
  fields: ['name'],
  validate,
})(CreateGroupDialog)

export default connect(mapStateToProps, { createNewGroup })(CreateGroupDialog);
