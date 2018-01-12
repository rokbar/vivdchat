import React, { Component } from 'react';
import Header from './header';
import Modal from './modal';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Paper } from 'material-ui';
import {
  MuiThemeProvider,
  getMuiTheme,
  lightBaseTheme,
} from 'material-ui/styles';
import mail from 'material-ui/svg-icons/content/mail';

injectTapEventPlugin();

const AppComponents = (props) => (
  <Paper style={styles.paper} zDepth={2}>
    <Modal />
    <Header />
    {props.children}
  </Paper>
);

export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <AppComponents {...this.props} />
      </MuiThemeProvider>
    );
  }
}

const styles = {
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}