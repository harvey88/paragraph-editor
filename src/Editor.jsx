import React, { Component, Fragment } from 'react'
import './editor.css';
import LinkIcon from './link.svg'

const ref = React.createRef();

class Editor extends Component {
  constructor() {
    super() 
    this.state = {
      showPopUp: false,
      linkUrl: '',
      showInput: false,
      popOverPosition: {},
      paragraphs: [
        {type: "html", data: [], params: {style: ""}}
      ],
      selectedTag: null
    }
  }

  componentDidMount() {
  }

  SelectionText = e => {
    if (window.getSelection().toString() !== '') {
      this.handleOpen()
      const selectedText = window.getSelection()
      const leftOffset = e.clientX - this.option.offsetParent.offsetLeft
      const topOffset = e.clientY - this.option.offsetParent.offsetTop
      this.setPositionOfPopOver(topOffset, leftOffset)

      if(selectedText){
        const parentElement = selectedText.anchorNode.parentElement.localName
        // console.log('select', selectedText)
        // console.log('parentElement', parentElement)
        switch(parentElement) {
          case 'h1': return this.setState({ selectedTag: parentElement })
          case 'h2': return this.setState({ selectedTag: parentElement })
          case 'h3': return this.setState({ selectedTag: parentElement })
          default:
            return this.setState({ selectedTag: parentElement })
        }  
      }
    }
  }
  setPositionOfPopOver = (top, left) => this.setState({ popOverPosition: { top, left } })


  handleChangeStyle = (e, value) => {
    console.log('value', value)
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
      case "createLink": return (
        this.setState({ showInput: true }),
        document.execCommand('superscript', null, null)
      ) 
      case "blockquote": return document.execCommand('formatBlock', false, '<blockquote>')
      default:
        return null
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
        basicElement.className = 'paragraph_editor'
        this.option.appendChild( basicElement )
      }
    }
    if(event.keyCode === 13) {
      this.setState(prev => ({
        paragraphs: [...prev.paragraphs, 
          {type: "html", data: [], params: {style: ""}}
        ]
      }), () => this.createNode())
    }
  }


  createNode = () => {
    const sel= window.getSelection()
    const node = sel.anchorNode
    node.remove()

  }

  save = () => {
    const data = []
    console.log('state', this.state.paragraphs)
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
    this.setState({ showPopUp: false, showInput: false })
  }
  handleCloseInput = () => {
    this.setState({  showInput: false })
  }
  render() {
    const { showPopUp, showInput, selectedTag } = this.state
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
        suppressContentEditableWarning={true}
      >
        {this.state.paragraphs.map(({type, data, params}, index) => {
          return <Paragraph ref={ref} key={index} index={index} />
        })}
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
          />
        }
      </Fragment>
    );
  }
}

const Paragraph = React.forwardRef(({index}, ref) => (
  <p index={index} ref={ref} className='paragraph_editor'></p>
))


class Popup extends Component {
  render() {
    const { handleClose, showInput, addLink, add, popOverPosition, handleCloseInput, selectedTag } = this.props
    return (
      <div className='wrapper'>
        <div className='background' onClick={handleClose}>
          <div className='window' 
            style={{top: `${popOverPosition.top - 113}px`, left: `${popOverPosition.left - 134}px` }}
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
                <img onClick={(e) => this.props.handleChangeStyle(e, 'createLink')} style={{width: '20px'}} src={LinkIcon} className='button' alt="link" />
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

export default Editor;
