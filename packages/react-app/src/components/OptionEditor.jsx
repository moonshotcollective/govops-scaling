import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";

const OptionEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  return <Editor editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} />;
};

export default OptionEditor;
