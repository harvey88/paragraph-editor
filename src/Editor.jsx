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
  componentWillReceiveProps(newProps) {
    console.log('newProps', newProps)
  }

  SelectionText = e => {
    if (window.getSelection().toString() !== '') {
      this.handleOpen()
      console.log('select', window.getSelection())

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
      // console.log('document.getElementsByTagName', document.getElementsByTagName('h2'))
      document.getElementsByTagName('h2')[0].classList.add('paragraph_editor')
    } else {
      document.execCommand(value)
    }
    if (value === 'blockquote') {
      document.execCommand('formatBlock', false, '<blockquote>')
    }
    // if (value === 'italic') {
    //   document.execCommand('italic', false, null)
    // }
    if (value === 'heading') {
      document.execCommand('formatBlock', false, 'h3')   
    }

    if (value === 'createLink') {
      this.setState({ showInput: true })
      document.execCommand('superscript',null,null)
    }

  }

  mouseOver = () => {
    var list = document.getElementsByTagName('a')
    if (list){
      // console.log('mouse')
    }
  }

  addLink = (e) => { this.setState({ linkUrl: e.target.value }) }

  add = (event) => {
    if(event.key === 'Enter'){
      console.log('enter press here! ')
      this.setState({
        showInput: false,
        showPopUp: false
      })
      const element = document.getElementById('editor')
      const link = element.getElementsByTagName('sup')[0]
      const text = element.getElementsByTagName('sup')[0].innerHTML
      let newEl = document.createElement('a')
      newEl.href = `http://${this.state.linkUrl}`;
      newEl.innerHTML = `${text}`;
      link.parentNode.replaceChild(newEl, link);
    }
  }

  setParagraph = (event) => {
    if(event.keyCode === 8) {
      if (this.option.childNodes.length === 0) {
        let basicElement = document.createElement('p')
        basicElement.innerHTML = '&nbsp;'
        basicElement.className = 'paragraph_editor'
        this.option.appendChild( basicElement )
      }
    }
  }

  save = () => {
    const data = []
    console.log('save', this.option)
    let content = this.option.childNodes
    content = Array.prototype.slice.call(content)
    console.log('content', content)
    content.forEach(el => {
      const children = el.children
      console.log('innerText', el.innerHTML)
    })
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
        onMouseUp={this.SelectionText}
        onMouseOver={this.mouseOver}
        onKeyUp={this.setParagraph}
        id='editor'
      >
        <p className='paragraph_editor'>&nbsp;</p>
      </div>
      <button onClick={this.save} >save</button>
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
                <button onClick={(e) => this.props.handleChangeStyle(e, 'heading')} className='button'>n</button>
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
