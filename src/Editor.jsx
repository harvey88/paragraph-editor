import React, { Component, Fragment } from 'react'
import './editor.css';
import LinkIcon from './link.svg'
import LinkIconSelect from './link_select.svg'
import { ReactComponent as PlucIcon } from './pluc.svg'
import { ReactComponent as CameraIcon } from './camera.svg'
import { ReactComponent as YoutubeIcon } from './youtube.svg'
import { ReactComponent as SoundcloudIcon } from './soundcloud.svg'


class Editor extends Component {
  constructor() {
    super() 
    this.state = {
      showPopUp: false,
      linkUrl: '',
      showInput: false,
      popOverPosition: {},
      selectedTag: null,
      hoverLink: null,
      showHoverLink: null,
      isShowPlucButton: false,
      popOverPositionLink: {},
      showPlucButtonPosition: {},
      popOverPositionWidgets: {},
      indexParagraph: null,
      showWidgetsPopUp: false,
      currentDomNode: null
    }
  }

  componentDidMount() {
  }

  SelectionText = e => {
    if (window.getSelection().toString() !== '') {
      this.handleOpen()
      const selectedText = window.getSelection()
      const topOffset = e.clientY - this.option.offsetParent.offsetTop
      const leftOffset = e.clientX 
      this.setPositionOfPopOver(topOffset, leftOffset)

      if(selectedText){
        const parentElement = selectedText.anchorNode.parentElement.localName
        switch(parentElement) {
          case 'h1': return this.setState({ selectedTag: parentElement })
          case 'h2': return this.setState({ selectedTag: parentElement })
          case 'h3': return this.setState({ selectedTag: parentElement })
          case 'a': return this.setState({ selectedTag: parentElement })
          default:
            return this.setState({ selectedTag: parentElement })
        }  
      }
    }
  }
  setPositionOfPopOver = (top, left) => this.setState({ popOverPosition: { top, left } })


  handleChangeStyle = (e, value) => {
    const { selectedTag } = this.state
    switch (value) {
      case "h1": {
        if (selectedTag === 'h1') {
          return (
            document.execCommand("formatblock", false, 'p'),
            this.setState({ selectedTag: 'p' })
          ) 
        } else {
          return (
            document.execCommand('formatBlock', false, '<h1>'),
            this.setState({ selectedTag: value })
          ) 
        }
      } 
      case "h2": {
        if (selectedTag === 'h2') {
          return (
            document.execCommand('formatblock', false, 'p'),
            this.setState({ selectedTag: 'p' })
          ) 
        } else {
          return (
            document.execCommand('formatBlock', false, '<h2>'),
            this.setState({ selectedTag: value })
          ) 
        }
      }
      case "h3": {
        if (selectedTag === 'h3') {
          return (
            document.execCommand('formatblock', false, 'p'),
            this.setState({ selectedTag: 'p' })
          ) 
        } else {
          return (
            document.execCommand('formatBlock', false, '<h3>'),
            this.setState({ selectedTag: value })
          ) 
        }
      } 
      case "bold": return document.execCommand('bold', false, null)
      case "italic": return document.execCommand('italic', false, null)
      case "strikethrough": return document.execCommand('strikethrough', false, null)
      case "createLink": {
        if (selectedTag === 'a') {
          console.log('createLink createLink')
          return (
            document.execCommand('unlink', false, null),
            this.setState({ selectedTag: null })
          ) 
        } else {
          return (
            this.setState({ showInput: true }),
            document.execCommand('superscript', null, null)
          ) 
        }
      }
      case "blockquote": return document.execCommand('formatBlock', false, '<blockquote>')
      default:
        return null
    }

  }

  mouseOver = (el) => {
    this.setState({
      popOverPositionLink: {
        top: el.pageY,
        left: el.pageX
      }
    })
    const link = el.target.tagName  
    if (link === 'A'){
      this.setState({
        showHoverLink: link,
        hoverLink: el.target.href
      })
    } 
  }

  mouseOut = (el) => {
    const link = el.target.tagName  
    if (link === 'A'){
      setTimeout( 
        () => {
          this.setState({
            showHoverLink: null
          })
        }, 2000
      )
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
    const selectedText = window.getSelection()
    if(selectedText.anchorNode.nodeValue) {
      this.setState({ isShowPlucButton: false })
    } else {
      this.setState({ isShowPlucButton: true })
    }
    this.setState({
      currentDomNode: selectedText.anchorNode,
      showPlucButtonPosition: selectedText.anchorNode.offsetTop,
      popOverPositionWidgets: {
        top: selectedText.anchorNode.offsetTop,
        // left: event.clientX
      }
    })
    if(event.keyCode === 8) {
      const selectedText = window.getSelection()
      if (this.option.childNodes.length === 0) {
        const basicElement = document.createElement('p')
        basicElement.className = 'paragraph_editor'
        this.option.appendChild( basicElement )
      }
    }
    if(event.keyCode === 13) {
      document.execCommand('defaultParagraphSeparator', false, 'p')
      this.createNode()
    }
  }


  createNode = () => {
    const sel= window.getSelection()
    const node = sel.anchorNode
    console.log('sel', sel)
    console.log('node', node)
    if(node.localName === 'b' || node.localName === 'i' || node.localName === 'strike') {
      console.log('enter in b, i , strike')
      node.remove()
    }
    if(node.localName === 'div'){
      const newP = document.createElement('p')
      newP.className = 'paragraph_editor'
      const parent = node.parentNode
      parent.replaceChild(newP, node)
    } else {
      node.className = 'paragraph_editor'
    }
  }

  save = () => {
    const data = []
    let content = this.option.childNodes
    content = Array.prototype.slice.call(content)
    console.log('content', content)
    content.forEach(el => {
      if(el.innerText){
        const dataHTML = el.innerHTML
        if(el.localName === 'p') {
          data.push({data: dataHTML, type:'html'})
        } else {
          switch (el.localName) {
            case 'h1': return data.push({data: dataHTML, type:'heading', params:{'size': 'h1'} })
            case 'h2': return data.push({data: dataHTML, type:'heading', params:{'size': 'h2'} })
            case 'h3': return data.push({data: dataHTML, type:'heading', params:{'size': 'h3'} })
            case 'blockquote': return data.push({data: dataHTML, type:'blockquote' })
            default:
              return data.push({data: dataHTML, type:'text' })
          }
        }     
      }
    })
    const json = JSON.stringify(data)
    console.log('data', data)
    console.log('json', json)
  }


  handleOpen = () => {
    this.setState({ showPopUp: true })
  }
  handleClose = () => {
    this.setState({ showPopUp: false, showInput: false },
      () => {
        if(!this.state.showInput){
          const element = document.getElementById('editor')
          const link = element.getElementsByTagName('sup')[0]
          if(link) { 
            const oldTextLink = link.parentNode
            while(link.firstChild) oldTextLink.insertBefore(link.firstChild, link)
            oldTextLink.removeChild(link)
          }
        }
      })
  }

  handleCloseInput = () => {
    this.setState({ showInput: false })
  }

  showWidgets = (e) => {
    e.stopPropagation()
    this.setState({ showWidgetsPopUp: true })
  }

  handleCloseWidgets = () => {
    this.setState({ showWidgetsPopUp: false })
  }

  showPlucButton = (e) => {
    const selectedText = window.getSelection()
    const topPositionBtn = selectedText.anchorNode.offsetTop
    this.setState({
      currentDomNode: selectedText.anchorNode,
      isShowPlucButton: true,
      showPlucButtonPosition: topPositionBtn,
      popOverPositionWidgets: {
        top: e.clientY,
        left: e.clientX
      }
    })
    if(selectedText.anchorNode.nodeValue) {
      this.setState({ isShowPlucButton: false })
    } else {
      this.setState({ isShowPlucButton: true })
    }
  }

  addPicture = () => {
    const {currentDomNode} = this.state
    this.setState({
      showWidgetsPopUp: false
    })
    const div = document.createElement("div")
    div.className = 'paragraph_add_picture'
    div.contentEditable='false'
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = this.handleAddImage
    input.className = 'inputText'
    const parent = currentDomNode.parentNode     
    parent.insertBefore(div, currentDomNode)
    div.appendChild(input)
  }

  handleAddImage = (event) => {
    const file = URL.createObjectURL(event.target.files[0])
    const img = document.createElement("img")
    img.src = file
    const newDiv = document.createElement("div")
    newDiv.className = 'paragraph_picture'
    newDiv.contentEditable='false'
    const div = event.target.parentNode
    const parent = div.parentNode
    parent.replaceChild(newDiv, div)
    newDiv.appendChild(img)
  }

  addInputYoutube = () => {
    const {currentDomNode} = this.state
    this.setState({
      showWidgetsPopUp: false
    })
    const div = document.createElement("div")
    div.className = 'paragraph_add_youtube'
    div.contentEditable='false'
    const input = document.createElement('input')
    input.type = 'text'
    input.onchange = this.embedYoutube
    input.className = 'paragraph_input_add_youtube'
    const parent = currentDomNode.parentNode     
    parent.insertBefore(div, currentDomNode)
    div.appendChild(input)
  }

  embedYoutube = e => {
    const url = e.target.value
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      let iframe = document.createElement('iframe')
      iframe.src = `//www.youtube.com/embed/${match[2]}`
      iframe.width = '100%'
      iframe.height = '300px'
      iframe.setAttribute('allowFullScreen', '')
      const newDiv = document.createElement("div")
      newDiv.contentEditable='false'
      const div = e.target.parentNode
      const parent = div.parentNode
      parent.replaceChild(newDiv, div)
      newDiv.appendChild(iframe)
    } else {
        return 'error';
    }
  }

  addSoundcloudYoutube = () => {
    const {currentDomNode} = this.state
    this.setState({
      showWidgetsPopUp: false
    })
    const div = document.createElement("div")
    div.className = 'paragraph_add_soundcloud'
    div.contentEditable='false'
    const input = document.createElement('input')
    input.type = 'text'
    input.onchange = this.embedSoundcloud
    input.className = 'paragraph_input_add_soundcloud'
    const parent = currentDomNode.parentNode     
    parent.insertBefore(div, currentDomNode)
    div.appendChild(input)
  }

  embedSoundcloud = (e) => {
      const url = e.target.value
      let iframe = document.createElement('iframe')
      iframe.src = `https://w.soundcloud.com/player/?url=${url}`
      iframe.width = '100%'
      iframe.height = '200px'
      iframe.setAttribute('allowFullScreen', '')
      const newDiv = document.createElement("div")
      newDiv.contentEditable='false'
      const div = e.target.parentNode
      const parent = div.parentNode
      parent.replaceChild(newDiv, div)
      newDiv.appendChild(iframe)
  }

  render() {
    const { 
      showPopUp, 
      showInput, 
      selectedTag, 
      hoverLink, 
      showHoverLink, 
      popOverPositionLink,
      showPlucButtonPosition,
      isShowPlucButton,
      showWidgetsPopUp,
      popOverPositionWidgets
    } = this.state

    return (
      <Fragment>
        <div className='article_editor_wrapper'>
        {isShowPlucButton && 
          <PlucIcon 
            style={{top: `${showPlucButtonPosition}px`}}  
            className='article_showWidgets' 
            onClick={this.showWidgets}
          />
        }  
        <div 
          ref={node => (this.option = node)}
          className='article_editor paraf'
          contentEditable 
          onMouseUp={this.SelectionText}
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseOut}
          onKeyUp={this.setParagraph}
          id='editor'
          suppressContentEditableWarning={true}
          onClick={this.showPlucButton}
        >
        <p className='paragraph_editor'></p>

        </div>
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
            selectedTag={selectedTag}
            hoverLink={hoverLink}
          />
        }
        {showHoverLink &&
          <PopupHoverLink 
            popOverPositionLink={popOverPositionLink}
            hoverLink={hoverLink}
        />}
        {showWidgetsPopUp &&
          <PopupWidgets
            handleCloseWidgets={this.handleCloseWidgets}
            addPicture={this.addPicture}
            popOverPositionWidgets={popOverPositionWidgets}
            addInputYoutube={this.addInputYoutube}
            addSoundcloudYoutube={this.addSoundcloudYoutube}
          />}
      </Fragment>
    );
  }
}

class Popup extends Component {
  render() {
    const { handleClose, showInput, addLink, add, popOverPosition, handleCloseInput, selectedTag } = this.props
    return (
      <div className='wrapper'>
        <div className='background' onClick={handleClose}>
          <div className='window' 
            style={{top: `${popOverPosition.top-20}px`, left: `${popOverPosition.left-110}px` }}
            onClick={e => e.stopPropagation()}>
            {showInput ? 
              <Fragment>
                <input type="text" autoFocus onChange={addLink} onKeyPress={add} />
                <div className='close_input' onClick={handleCloseInput}>x</div>
              </Fragment>
              :
              <Fragment>
                {selectedTag === 'h1' || selectedTag === 'h2' || selectedTag === 'h3' ? null: 
                  <Fragment>
                    <button onClick={(e) => this.props.handleChangeStyle(e, 'bold')} className='button'>B</button>
                    <button onClick={(e) => this.props.handleChangeStyle(e, 'italic')} className='button'>I</button>
                  </Fragment>
                }
                
                <button onClick={(e) => this.props.handleChangeStyle(e, 'strikethrough')} className='button'>S</button>
                <img onClick={(e) => this.props.handleChangeStyle(e, 'createLink')} style={{width: '20px'}} src={selectedTag === 'a' ? LinkIconSelect : LinkIcon} className='button' alt="link" />
                <div className='divider'></div>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'h1')} style={selectedTag === 'h1' ? {color: '#5cb8ff'}: {}} className='button'>H1</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'h2')} style={selectedTag === 'h2' ? {color: '#5cb8ff'}: {}} className='button'>H2</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'h3')} style={selectedTag === 'h3' ? {color: '#5cb8ff'}: {}} className='button'>H3</button>
                <button onClick={(e) => this.props.handleChangeStyle(e, 'blockquote')} className='button'>&#8220;</button>
              </Fragment>
            }
            
          </div>
        </div>
      </div>
    )
  }
}

class PopupHoverLink extends Component {
  render() {
    const { popOverPositionLink, hoverLink } = this.props
    return (
      <div className='wrapper' style={{position: 'absolute', height: 'auto', width: 'auto'}} >
        <div className='background' style={{position: 'absolute'}}>
          <div className='window' 
            style={{top: `${popOverPositionLink.top - 113}px`, left: `${popOverPositionLink.left - 134}px` }}
            onClick={e => e.stopPropagation()}>
            <a href={hoverLink} target={'_blank'}>{hoverLink}</a>
          </div>
        </div>
      </div>
    )
  }
}

class PopupWidgets extends Component {
  render() {
    const { handleCloseWidgets, addPicture, popOverPositionWidgets, addInputYoutube, addSoundcloudYoutube} = this.props
    return (
      <div className='wrapper' >
        <div className='background' onClick={handleCloseWidgets} >
          <div className='window_widget' 
            style={{top: `${popOverPositionWidgets.top}px`, left: '36%' }}
            onClick={e => e.stopPropagation()}>
              <CameraIcon onClick={addPicture}  style={{fill: '#fff'}} className='button' />
              <YoutubeIcon onClick={addInputYoutube}  className='button' />
              <SoundcloudIcon onClick={addSoundcloudYoutube} className='button' />
          </div>
        </div>
      </div>
    )
  }
}

export default Editor

