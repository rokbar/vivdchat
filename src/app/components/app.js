import React, { Component } from 'react';
import Header from './header';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Paper } from 'material-ui';
import { 
  MuiThemeProvider, 
  getMuiTheme, 
  lightBaseTheme,
} from 'material-ui/styles';

injectTapEventPlugin();

const AppComponents = (props) => (
  <Paper zDepth={2}>
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
