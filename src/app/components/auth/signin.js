import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import * as actions from '../../actions';

class Signin extends Component {
  handleFormSubmit({ username, password }) {
    // Need to do something to log user in 
    this.props.signinUser({ username, password });
  } 

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errormessage}
        </div>
      )
    }
  }

  render() {
    const { handleSubmit, fields: { username, password }} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Username:</label>
          <Field name="username" component="input" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label>Password:</label>
          <Field name="password" type="password" component="input" className="form-control" />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { errormessage: state.auth.error };
}

Signin = reduxForm({
  form: 'signin',
  fields: ['username', 'password']
})(Signin)

export default connect(mapStateToProps, actions)(Signin);