import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux'
import { signinUser } from '../../actions';
import { RaisedButton, TextField, Paper } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import verticalAlignCenter from 'material-ui/svg-icons/editor/vertical-align-center';

class Signin extends Component {
  handleFormSubmit({ username, password }) {
    // Need to do something to log user in 
    this.props.signinUser({ username, password });
  }

  renderAlert() {
    if (this.props.errormessage) {
      return (
        <Paper
          zDepth={3}
          style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'rgb(244, 67, 54) 0px 1px 6px', margin: '5px 0' }}
        >
          <div style={{ color: 'rgb(244, 67, 54)', fontSize: '14px' }}>
            <strong>Oops!</strong> {this.props.errormessage}
          </div>
        </Paper>
      )
    }
  }

  render() {
    const { handleSubmit, fields: { username, password } } = this.props;

    return (
      <div style={{ textAlign: 'center', height: '60%' }}>
        <div style={{ display: 'table', margin: 'auto', height: '100%' }}>
          <form style={{ display: 'table-cell', verticalAlign: 'middle' }} onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <TextField
              floatingLabelText="Username"
              children={<Field name="username" component="input" />}
            /><br />
            <TextField
              floatingLabelText="Password"
              children={<Field name="password" type="password" component="input" />}
            />
            {this.renderAlert()}
            <div style={{ paddingTop: '5px', textAlign: 'left' }}>
              <RaisedButton
                type="submit"
                backgroundColor={'rgb(0, 188, 212)'}
                labelColor={'rgb(255, 255, 255)'}
                label="Sign In"
                icon={<PersonIcon />}
              />
            </div>
          </form>
        </div>
      </div>
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