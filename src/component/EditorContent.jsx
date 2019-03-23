import React, { Component } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


class EditorContent extends Component {
  constructor() {
    super();
    this.state = {
      models: ['Example text'],
      numberOfPages: 1,  
    }
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.convertToImage = this.convertToImage.bind(this);
    this.addNewPage = this.addNewPage.bind(this);
  }

  convertToImage() {
    fetch('/api/image', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
          text: this.state.models.join('\n'),
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
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleModelChange(i, model) {
    let newModel = this.state.models;
    newModel[i] = model; 
    this.setState({ models: newModel });
  }

  addNewPage() {
    this.setState({ 
      numberOfPages: ++this.state.numberOfPages,
      models: [...this.state.models, "Example Text"]
    });
  }

  renderPages() {
    let i = 0;
    let pages = [];

    for(; i < this.state.numberOfPages; i++) {
      pages.push(<CKEditor
        key={i}
        onInit={ editor => {
            // Insert the toolbar before the editable area.
            const editableContainer = document.querySelector( '.document-editor__editable' );
              editableContainer.appendChild(editor.ui.getEditableElement());
            const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
              toolbarContainer.appendChild( editor.ui.view.toolbar.element );
              window.editor = editor;
              editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        } } 
        config={this.state.configs}
        model={this.state.models[i]}
        onModelChange={this.handleModelChange.bind(this, i)}
        onChange={ ( event, editor ) => console.log( { event, editor } ) }
        editor={ DecoupledEditor }
        // data="<p>Hello from CKEditor 5's DecoupledEditor!</p>"
        >
      </CKEditor>
      )
    }
    
    return pages;
  }

  render() {
    return (
      <div>
      <div>
          <h2>CKEditor 5 using a custom build - DecoupledEditor</h2>
          <button onClick={this.convertToImage}>Convert</button>
          <div id="editor">
            { this.renderPages() }
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

<script src="index.js"></script>