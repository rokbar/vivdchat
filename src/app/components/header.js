import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { 
  AppBar, 
  IconButton,
  IconMenu,
  MenuItem,
  FlatButton,
} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <div>
        <FlatButton {...this.props} containerElement={<Link to="/signin" />} label="Sign In" />
        <FlatButton {...this.props} containerElement={<Link to="/signup" />} label="Sign Up" />
      </div>
    );
  }
}

const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem containerElement={<Link to="/signout" />} primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = 'IconMenu';

class Header extends Component {
  render() {   
    return (
      <AppBar 
        title={<Link style={styles.title} to="/chat">Vivdchat</Link>}
        iconElementLeft={<br/>}
        iconElementRight={this.props.authenticated ? <Logged /> : <Login />}
      />
    );
  }
};

const styles = {
  title: {
    color: 'inherit',
    cursor: 'pointer',
    textDecoration: 'none'
  },
};

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(Header);