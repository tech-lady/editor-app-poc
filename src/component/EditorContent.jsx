import React, { Component } from "react";
import CKEditor from '@ckeditor/ckeditor5-react';

import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';


class EditorContent extends Component {
  constructor() {
    super();
    this.state = {
      models: ['Example text'],
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.convertToImage}>Convert</button>
          <h2>CKEditor 5 using a custom build - DecoupledEditor</h2>
      </div>
    );
}
}

DecoupledEditor
    .create( document.querySelector( '.document-editor__editable' ), {
    } )
    .then( editor => {
        const toolbarContainer = document.querySelector( '.document-editor__toolbar' );

        toolbarContainer.appendChild( editor.ui.view.toolbar.element );

        window.editor = editor;
    } )
    .catch( err => {
        console.error( err );
    } );




export default EditorContent;
