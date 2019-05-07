import React, { Component } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import { Dropdown, DropdownButton, ButtonToolbar }  from 'react-bootstrap';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


class EditorContent extends Component {
  constructor() {
    super();
    this.state = {
      arrData: ['Example text'],
      selected: "",
      itemsData: {
        "Invoice Value": ["a val of a", "a val of b"],
        "Transaction Value": ["a val of c", "a val of d"],
        "Dispute Value": ["a val of e", "a val of f"],
        "Customer Value": ["a val of g", "a val of h"],
        "Subscription Value": ["a val of i", "a val of j"]
      },
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
    this.handleSelect = this.handleSelect.bind(this);
  }

  convertToImage() {
    fetch('/api/image', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
          text: this.state.data.map(val => val.text).join('\n'),
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

  handleSelect(e, variant){
    this.setState({
      selected: variant,
    })
    console.log(e, variant);
  }

  renderInstance(instance) {
    return (
      <CKEditor
        key={instance.id}
        toolbarGroups={[
          { name: 'mode' },
          { name: 'basicstyles' }
        ]}
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
        // data= {this.state.selected}
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
                  {Object.keys(this.state.itemsData).map(variant =>
                    (
                        <DropdownButton
                          title={variant}
                          variant={variant.toLowerCase()}
                          id={`dropdown-variants-${variant}`}
                          key={variant}
                          onSelect={(e) => this.handleSelect(e, variant)}
                        >
                          {this.state.itemsData[variant].map(item => (
                            <Dropdown.Item eventKey={item} key={item}>{item}</Dropdown.Item>
                          ))}
                        </DropdownButton>
                  ))}
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