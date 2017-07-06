import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { signinUser } from '../../actions';
import { RaisedButton, TextField, Paper } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';

class Signin extends Component {
  handleFormSubmit({ username, password }) {
    // Need to do something to log user in 
    this.props.signinUser({ username, password });
  } 

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <Paper zDepth={3}>
          <div className="alert alert-danger">
            <strong>Oops!</strong> {this.props.errormessage}
          </div>
        </Paper>
      )
    }
  }

  render() {
    const { handleSubmit, fields: { username, password }} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <TextField
          floatingLabelText="Username"
          children={<Field name="username" component="input" />}
        /><br />
        <TextField
          floatingLabelText="Password"
          children={<Field name="password" type="password" component="input" />}
        /><br />
        {this.renderAlert()}
        <RaisedButton
          type="submit"
          backgroundColor={'rgb(0, 188, 212)'}
          labelColor={'rgb(255, 255, 255)'}
          label="Sign In"
          icon={<PersonIcon />}
        />
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

export default connect(mapStateToProps, { signinUser })(Signin);