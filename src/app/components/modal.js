import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog, FlatButton } from 'material-ui';
import { closeModal } from '../actions';

class Modal extends Component {
  handleClose = () => {
    this.props.closeModal();
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ]

    const open = this.props.modal.show || false;

    return open
      ? (
        <div style={backgroundStyles}>
          <Dialog
            title={this.props.modal.title}
            actions={actions}
            modal={true}
            open={open}
            style={modalStyle}
          >
            {this.props.modal.message}
          </Dialog>
        </div>
      )
      : null
  }
}

const backgroundStyles = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
}

const modalStyle = {
  margin: '0 auto',
}

function mapStateToProps(state) {
  return {
    modal: state.modal,
  }
}

export default connect(mapStateToProps, { closeModal })(Modal);
