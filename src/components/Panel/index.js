import React, { Component } from 'react'
import { Transition } from 'react-transition-group'
import './Panel.scss'

class Panel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: false
    }
  }

  toggle = (visible) => {
    this.setState({ visible })
  }

  grayPanelAreaClick = (e) => {
    if (e.target.id === 'panel-container') {
      this.setState({ visible: false })
    }
  }

  render () {
    const title = (this.props.title) ? this.props.title : 'Panel Title'
    const greenStyle = (this.props.hideGreen) ? { display: 'none' } : {}
    const cancelBtnTitle = (this.props.cancel) ? this.props.cancel : 'Cancel'
    const hideFooter = (this.props.hideFooter) ? { display: 'none' } : {}

    const duration = 400
    const panelWidth = 488

    const defaultStyle = {
      transition: `right ${duration}ms ease-out`,
      right: -panelWidth
    }

    const transitionStyles = {
      entering: { right: -panelWidth },
      entered: { right: 0 },
      exiting: { right: -panelWidth },
      exited: { right: -panelWidth }
    }

    return (
      <Transition
        in={this.state.visible}
        timeout={{
          appear: 0,
          enter: 0,
          exit: duration
        }}
        mountOnEnter
        unmountOnExit
      >
        {state => (

          <div className='panel-container' id='panel-container' onClick={e => this.grayPanelAreaClick(e)}>
            <div
              className='panel' style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }}
            >
              <div className='panel-navbar'>
                <h1>{title}</h1>
                <div className='close-panel' />
              </div>
              {this.props.children}
              <div className='panel-footer' style={hideFooter}>
                <div className='btn btn-cancel' onClick={() => this.setState({ visible: false })}>
                  <p>{cancelBtnTitle}</p>
                </div>
                <div className='btn btn-green' style={greenStyle} onClick={() => this.props.greenButtonAction()}>
                  <p>Save</p>
                </div>
              </div>
            </div>
          </div>

        )}
      </Transition>
    )
  }
}

export default Panel
