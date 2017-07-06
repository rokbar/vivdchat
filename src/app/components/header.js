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
  renderLinks() {
    if (this.props.authenticated) {
      // show a link to sign out
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/signout">Sign Out</Link>
        </li>
      );
    } else {
      // show a link to sign in or sign up
      return [
        <li className="nav-item" key={1}>
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>,
        <li className="nav-item" key={2}>
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </li>
      ];
    }
  }

  render() {   
    return (
      <AppBar 
        title={<Link style={styles.title} to="/">Vivdchat</Link>} 
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