import React, { Component } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import { Dropdown, DropdownButton, ButtonToolbar }  from 'react-bootstrap';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


class EditorContent extends Component {
  constructor() {
    super();
    this.state = {
      arrData: ['Example text'],
      numberOfPages: 1,
      instances: [
        {
          id: 1,
        }
      ],
      data: [
        {
          id: 1,
          text: ''
        }
      ]
    }
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.convertToImage = this.convertToImage.bind(this);
    this.addNewPage = this.addNewPage.bind(this);
    this.renderInstance = this.renderInstance.bind(this);
  }

  convertToImage() {
    fetch('/api/image', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
          text: this.state.arrData.join('\n'),
      })
  })
    .then(function(response) {
      return response.json()
    })
    .then(function(imageData) {
      const iframe = '<iframe src="' + imageData.data + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
      const newWindow = window.open();
      newWindow.document.open();
      newWindow.document.write(iframe);
      newWindow.document.close();
    })
  console.log(this.state)
  }

  handleChange(data, id) {
    console.log(id)
    const editor = this.state.data.find(x => x.id === id)
    editor.text = data;

    this.setState({
      data: [
        ...this.state.data.filter(x => x.id !== id),
        { ...editor }
      ]
    })
  }

  handleModelChange(i, data) {
    let newModel = this.state.arrData;
    newModel[i] = data; 
  }

  addNewPage() {
    this.setState({ 
      instances: [
        ...this.state.instances,
        {
          id: this.state.instances.length + 1,
        }
      ],
      data: [
        ...this.state.data,
        {
          id: this.state.data.length + 1,
          text: ''
        }
      ]
  })
  }

  renderPages() {
    let i = 0;
    let pages = [];

    for(; i < this.state.numberOfPages; i++) {
      pages.push(<CKEditor
        key={i}
        onInit={ editor => {
              window.editor = editor;
              editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        } } 
        config={this.state.configs}
       // data={this.state.arrData[i]}
        onModelChange={this.handleModelChange.bind(this, i)}
        onChange={ ( event, editor) => this.handleChange(editor.getData(), i)}
        editor={ DecoupledEditor }
        >
      </CKEditor>
      )
    }
    
    return pages;
  }

  renderInstance(instance) {
    return (
      <CKEditor
        key={instance.id}
        onInit={ editor => {
              window.editor = editor;
              editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        } } 
        config={this.state.configs}
        onChange={ ( event, editor) => this.handleChange(editor.getData(), instance.id)}
        editor={ DecoupledEditor }
        >
      </CKEditor>
    )
  }

  render() {
    return (
      <div>
        <div>
          <h2>CKEditor 5 using a custom build - DecoupledEditor</h2>
          <button onClick={this.convertToImage}>Convert</button>
          <div className="document-editor__toolbar"></div>
            <div className="document-editor__editable-container">
              <div className="document-editor__editable">
                <p>The initial editor data.</p>
                <div>
                  <ButtonToolbar className="dropdown-item">
                    {['Invoice value', 'Transaction value', 'Dispute value', 'Customer value', 'Subscription Value'].map(
                      variant => (
                        <DropdownButton
                          title={variant}
                          variant={variant.toLowerCase()}
                          id={`dropdown-variants-${variant}`}
                          key={variant}
                        >
                          <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                          <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                          <Dropdown.Item eventKey="3" active>
                            Active Item
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                        </DropdownButton>
                      ),
                    )}
                  </ButtonToolbar>
                  {this.state.instances.map(instance => this.renderInstance(instance))}
                </div>
              </div>
            </div>
          </div>
        <div>
          <button onClick={this.addNewPage}>Add Page</button>
        </div>
      </div>
    );
}
}

export default EditorContent;