import React, { Component } from 'react';
import Header from './header';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { 
  MuiThemeProvider, 
  getMuiTheme, 
  lightBaseTheme,
} from 'material-ui/styles';

injectTapEventPlugin();

const AppComponents = (props) => (
  <div>
    <Header />
    {props.children}
  </div>
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
