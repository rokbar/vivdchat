import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'; // redux-form ^6.0.0
import { connect } from 'react-redux';
import { signupUser } from '../../actions';
import { RaisedButton, TextField, Paper } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';

class Signup extends Component {
  handleFormSubmit(formProps) {
    // Call action creator sign up the user
    this.props.signupUser(formProps);
  }

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <Paper
          zDepth={1}
          style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'rgb(244, 67, 54) 0px 1px 6px', margin: '5px 0' }}
        >
          <div style={{ color: 'rgb(244, 67, 54)', fontSize: '14px' }}>
            <strong>Opps!</strong> {this.props.errormessage}
          </div>
        </Paper>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { username, password, passwordConfirm } } = this.props;

    return (
      <div style={{ textAlign: 'center', height: '60%' }}>
        <div style={{ display: 'table', margin: 'auto', height: '100%' }}>
          <form style={{ display: 'table-cell', verticalAlign: 'middle' }} onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <Field component={renderField} name="username" label="Username" type="text" /><br />
            <Field component={renderField} name="password" label="Password" type="password" /><br />
            <Field component={renderField} name="passwordConfirm" label="Confirm Password:" type="password" /><br />
            {this.renderAlert()}
            <div style={{ marginTop: '10px', textAlign: 'left' }}>
              <RaisedButton
                type="submit"
                backgroundColor={'rgb(0, 188, 212)'}
                labelColor={'rgb(255, 255, 255)'}
                label="Sign Up"
                icon={<PersonIcon />}
              />
            </div>
          </form>
        </div >
      </div >
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
    errors.username = "Please enter an username";
  }

  if (!formProps.password) {
    errors.password = "Please enter an password";
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = "Please enter an password confirmation";
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = "Passwords must match";
  }

  return errors;
}

function mapStateToProps(state) {
  return { errormessage: state.auth.error };
}

Signup = reduxForm({
  form: 'signup',
  fields: ['username', 'password', 'passwordConfirm'],
  validate
})(Signup);

export default connect(mapStateToProps, { signupUser })(Signup);