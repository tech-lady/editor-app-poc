import React from "react";
import ReactDOM from "react-dom";
import EditorContent from "./component/EditorContent.jsx"
import './css/styles.css';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document/src/ckeditor';

// const Index = () => {
//   return <div>We are here</div>
// };

// ReactDOM.render(<Index />, document.getElementById("index"));
const wrapper = document.getElementById("editor-app");
wrapper ? ReactDOM.render(<EditorContent />, wrapper) : false;

