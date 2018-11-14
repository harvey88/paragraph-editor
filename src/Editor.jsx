import React, { Component, Fragment } from 'react'
import './editor.css';
import LinkIcon from './link.svg'

class Editor extends Component {
  constructor() {
    super() 
    this.state = {
      showPopUp: false,
      linkUrl: '',
      showInput: false,
      popOverPosition: {},
    }
  }

  componentDidMount() {
  }

  telectionText = e => {
    if (window.getSelection().toString() !== '') {
      this.handleOpen()

      const leftOffset = e.clientX - this.option.offsetParent.offsetLeft
      const topOffset = e.clientY - this.option.offsetParent.offsetTop
      this.setPositionOfPopOver(topOffset, leftOffset)
    }
  }
  setPositionOfPopOver = (top, left) => this.setState({ popOverPosition: { top, left } })


  handleChangeStyle = (e, value) => {
    console.log('value', value)
    if (value === 'formatBlock') {
      document.execCommand(value, false, '<h2>')
    } else {
      document.execCommand(value)
    }
    if (value === 'blockquote') {
      document.execCommand('formatBlock', false, '<blockquote>')
    }

    if (value === 'createLink') {
      this.setState({
        showInput: true
      })
      document.execCommand('superscript',null,null)
    }

  }

  mouseOver = () => {
    var list = document.getElementsByTagName('a')
    if (list){
      console.log('mouse')
    }
  }

  addLink = (e) => { this.setState({ linkUrl: e.target.value }) }

  add = (event) => {
    if(event.key === 'Enter'){
      console.log('enter press here! ')
      this.setState({
        showInput: false
      })
      const element = document.getElementById('editor')
      const link = element.getElementsByTagName('sup')[0]
      const text = element.getElementsByTagName('sup')[0].innerHTML
      var newEl = document.createElement('a')
      newEl.href = `http://${this.state.linkUrl}`;
      newEl.innerHTML = `${text}`;
      link.parentNode.replaceChild(newEl, link);
    }
  }

  newParagraph = (event) => {
    if(event.key === 'Enter') {
      document.execCommand('defaultParagraphSeparator', false, 'p')
      document.getElementsByTagName('p').className = 'rr'
    }
  }

  setParagraph = () => {
    console.log('yeeeeees')
    // var div = document.createElement('p')
    //   div.setAttribute('class', 'note')
    //   document.body.appendChild(div);
  }



  handleOpen = () => {
    this.setState({ showPopUp: true })
  }
  handleClose = () => {
    this.setState({ showPopUp: false, showInput: false })
  }
  handleCloseInput = () => {
    this.setState({  showInput: false })
  }
  render() {
    const { showPopUp, showInput } = this.state
    return (
      <Fragment>
      <div 
        ref={node => (this.option = node)}
        className='article_editor paraf'
        contentEditable 
        onMouseUp={this.telectionText}
        onMouseOver={this.mouseOver}
        onKeyPress={this.newParagraph}
        onClick={this.setParagraph}
        id='editor'
        >
        <p className='paragraph_editor'></p>
      </div>
        {showPopUp &&
          <Popup 
            handleClose={this.handleClose}
            handleChangeStyle={this.handleChangeStyle}
            addLink={this.addLink}
            add={this.add}
            showInput={showInput}
            popOverPosition={this.state.popOverPosition}
            handleCloseInput={this.handleCloseInput}
          />
        }
      </Fragment>
    );
  }
}

class Popup extends Component {
  render() {
    const { handleClose, showInput, addLink, add, popOverPosition, handleCloseInput } = this.props
    return (
      <div className='wrapper'>
        <div className='background' onClick={handleClose}>
          <div className='window' 
            style={{top: `${popOverPosition.top}px`, left: `${popOverPosition.left}px` }}
            onClick={e => e.stopPropagation()}>
            {showInput ? 
              <Fragment>
                <input type="text" autoFocus onChange={addLink} onKeyPress={add} />
                <div className='close_input' onClick={handleCloseInput}>x</div>
              </Fragment>
              :
              <Fragment>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'bold')} className='button'>B</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'italic')} className='button'>I</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'strikethrough')} className='button'>S</button>
                <img onClick={(e) => this.props.handleChangeStyle(e, 'createLink')} style={{width: '20px'}} src={LinkIcon} className='button' alt="link" />
                {/* <img onClick={(e) => this.props.handleChangeStyle(e, 'unlink')} style={{width: '20px', fill:'red'}} src={LinkIcon} className='button' alt="link" /> */}
                <div className='divider'></div>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'formatBlock')} className='button'>H</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'italic')} className='button'>n</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'blockquote')} className='button'>"</button>
              </Fragment>
            }
            
          </div>
        </div>
      </div>
    )
  }
}

export default Editor;
