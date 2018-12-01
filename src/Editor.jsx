import React, { Component, Fragment } from 'react'
import './editor.css';
import LinkIcon from './link.svg'
import LinkIconSelect from './link_select.svg'
import { ReactComponent as PlucIcon } from './pluc.svg'
import { ReactComponent as CameraIcon } from './camera.svg'
import Icon from './pluc.svg'


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
        {type: "html", index: 0, data: [], params: {style: ""}}
      ],
      selectedTag: null,
      hoverLink: null,
      showHoverLink: null,
      isShowPlucButton: false,
      popOverPositionLink: {},
      showPlucButtonPosition: {},
      popOverPositionWidgets: {},
      indexParagraph: null,
      showWidgetsPopUp: false,
    }
  }

  componentDidMount() {
    // const data = [{data:"dfkjgh dkfgjdklfgj dg <i>df<b>gsdfg</b></i>",type:"heading",params:{size:"h1"}},
    //               {"data":"dfg dgdf gdg<a href=\"http://dfdf\">fsd</a>&nbsp;ddfgdfgdfgdgdfg&nbsp;","type":"html"},
    //               {"data":"f gdfg dfg dg df","type":"html"},
    //               {"data":"s dfg sdfgs dfgs d","type":"html"},
    //               {"data":"g dsfg dfgjk hdfkjg hsdfgkjs","type":"heading","params":{"size":"h2"}}]
    // // const jsonParse = JSON.parse(data)
    // console.log('jsonParse', data)
    // this.setState({
    //   paragraphs: data
    // })
  }

  SelectionText = e => {
    if (window.getSelection().toString() !== '') {
      this.handleOpen()
      const selectedText = window.getSelection()
      const leftOffset = e.clientX - this.option.offsetParent.offsetLeft
      const topOffset = e.clientY - this.option.offsetParent.offsetTop
      this.setPositionOfPopOver(topOffset, leftOffset)
      console.log('selectedText', selectedText)

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
    const {indexParagraph} = this.state
    let content = this.option.childNodes
    content = Array.prototype.slice.call(content)
    content.shift()
    // console.log('content', content)
    content.map((el, index) => {
      if (indexParagraph === index){
        // console.log('el', el)
        if(el.innerText !== ''){
          this.setState({
            isShowPlucButton: false
          })
        }
      }
    })



    if(event.keyCode === 8) {
      if (this.option.childNodes.length === 0) {
        const img = document.createElement('img')
        img.src = Icon
        img.className='article_showWidgets'
        img.onclick = this.showWidgets
        img.style = `top: ${this.state.showPlucButtonPosition}px`
        this.option.appendChild( img )
        const basicElement = document.createElement('p')
        basicElement.className = 'paragraph_editor'
        this.option.appendChild( basicElement )
      }
      // let content = this.option.childNodes
      // const index =  event.target.childElementCount -2
      // content = Array.prototype.slice.call(content)
      // content.shift()
      // console.log('content', content)    
      // const topPositionBtn = content[index].offsetTop
      // this.setState({
      //   showPlucButtonPosition: topPositionBtn
      // })
    }
    if(event.keyCode === 13) {
      const lastIndex = this.state.paragraphs.indexOf(this.state.paragraphs[this.state.paragraphs.length - 1])
      // const index =  event.target.childElementCount -2
      this.setState(prev => ({
        paragraphs: [...prev.paragraphs, 
          {type: "html", index: lastIndex + 1, data: [], params: {style: ""}}
        ],
        // indexParagraph: index
      }), () => this.createNode())
    }
  }


  createNode = () => {
    const { indexParagraph } = this.state
    const sel= window.getSelection()
    const node = sel.anchorNode
    node.remove()
    let content = this.option.childNodes
    content = Array.prototype.slice.call(content)
    content.shift()
    const topPositionBtn = content[indexParagraph].offsetTop
    this.setState({
      showPlucButtonPosition: topPositionBtn
    })
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
    this.setState({  showInput: false })
  }

  showWidgets = () => {
    this.setState({
      showWidgetsPopUp: true
    })
    console.log('showWidgets')
  }

  handleCloseWidgets = () => {
    this.setState({
      showWidgetsPopUp: false
    })
  }

  showPlucButton = (e,index) => {
    const selectedText = window.getSelection()
    const topPositionBtn = selectedText.anchorNode.offsetTop
    const topPositionWidgetPopOver = e.clientY - selectedText.anchorNode.offsetTop
    // console.log('postiosn',selectedText)
    // console.log('topPositionWidgetPopOver',topPositionWidgetPopOver)
    // console.log('options', this.option.offsetParent.offsetLeft)
    // console.log('options', this.option.offsetParent.offsetTop)
    // console.log('e', e.clientX)
    // console.log('e', e.clientY)
    this.setState({
      isShowPlucButton: true,
      showPlucButtonPosition: topPositionBtn,
      indexParagraph: index,
      popOverPositionWidgets: {
        top:  topPositionWidgetPopOver,
        left: e.clientX
      }
    })
  }

  addPicture = () => {
    const {indexParagraph} = this.state
    this.setState({
      showWidgetsPopUp: false
    })
    let content = this.option.childNodes
    content = Array.prototype.slice.call(content)
    content.shift()
    content.map((el, index) => {
      if (indexParagraph === index){
        const div = document.createElement("div")
        div.className = 'paragraph_add_picture'
        const input = document.createElement('input')
        input.type = 'file'
        input.onchange = this.handleAddImage
        input.className = 'inputText'
        const parent = el.parentNode     
        parent.replaceChild(div, el)
        div.appendChild(input)
      }
    })
  }

  handleAddImage = (event) => {
    let content = this.option.childNodes
    const file = URL.createObjectURL(event.target.files[0])
    const img = document.createElement("img")
    img.src = file
    const newDiv = document.createElement("p")
    newDiv.className = 'paragraph_picture'
    newDiv.contentEditable='false'
    const div = event.target.parentNode
    const parent = div.parentNode

    parent.replaceChild(newDiv, div)
    newDiv.appendChild(img)
    console.log('target', content)
    console.log('event', event.target.parentNode)
    console.log('div', div)
    
    this.setState(prev => ({
      paragraphs: [...prev.paragraphs, 
        {type: "html", data: [], params: {style: ""}}
      ]
    }))
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
      >
      {isShowPlucButton && 
        <PlucIcon 
          style={{top: `${showPlucButtonPosition}px`}}  
          className='article_showWidgets' 
          onClick={this.showWidgets}
        />
      }
        {this.state.paragraphs.map(({type, data, params}, index) => {
          return <Paragraph 
                      showPlucButton={this.showPlucButton} 
                      showWidgets={this.showWidgets}
                      data={data} 
                      params={params} 
                      type={type} 
                      key={index} 
                      index={index} 
                      ref={ref}
                      showPlucButtonPosition={showPlucButtonPosition}
                      />
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
          />}
      </Fragment>
    );
  }
}

const Paragraph = React.forwardRef(({index, data, type, params, showPlucButton}, ref) => (
    <p 
      onClick={(e) => showPlucButton(e, index)} 
      index={index} 
      ref={ref} 
      type={type} 
      // params={params} 
      className='paragraph_editor'>{data}</p>
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
    const { handleCloseWidgets, addPicture, popOverPositionWidgets } = this.props
    return (
      <div className='wrapper' >
        <div className='background' onClick={handleCloseWidgets} >
          <div className='window_widget' 
            style={{top: `${popOverPositionWidgets.top - 25}px`, left: `${popOverPositionWidgets.left}px` }}
            onClick={e => e.stopPropagation()}>
              <CameraIcon onClick={addPicture}  style={{fill: '#fff'}} className='button' />
          </div>
        </div>
      </div>
    )
  }
}

export default Editor

