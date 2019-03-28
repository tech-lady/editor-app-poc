import React from "react";
import ReactDOM from "react-dom";
import EditorContent from "./component/EditorContent.jsx"
import './css/styles.css';

const wrapper = document.getElementById("editor-app");
wrapper ? ReactDOM.render(<EditorContent />, wrapper) : false;

