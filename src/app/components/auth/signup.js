import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'; // redux-form ^6.0.0
import { connect } from 'react-redux';
import { signupUser } from '../../actions';

class Signup extends Component {
  handleFormSubmit(formProps) {
    // Call action creator sign up the user
    this.props.signupUser(formProps);
  }

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <div className="alert alert-danger">
          <strong>Opps!</strong> {this.props.errormessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit, fields: { username, password, passwordConfirm }} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <Field component={renderField} name="username" label="Username:" type="text" />
        </fieldset>
        <fieldset className="form-group">
          <Field component={renderField} name="password" label="Password:" type="password" />
        </fieldset>
        <fieldset className="form-group">
          <Field component={renderField} name="passwordConfirm" label="Confirm Password:" type="password" />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign Up</button>
      </form>
    );
  }
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label><br />
    <input type={type} className="form-control" {...input} />
    {touched && error && <div className="error">{error}</div>}
  </div>
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