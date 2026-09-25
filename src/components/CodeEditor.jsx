import Editor from "@monaco-editor/react";
import "./CodeEditor.css";
const CodeEditor = ({
  code,
  setCode,
  language = "javascript",
  theme = "vs-dark",
}) => {
  const handleEditorChange = (value) => {
    setCode(value || "");
  };
  return (
    <div className="code-editor-wrapper">
      <div className="code-editor-header">
        <div className="code-editor-title">
         <span className="code-editor-dot"></span>
          <span>
            Source Code
          </span>
        </div>
        <span className="code-editor-language">
          {language}
        </span>
      </div>
      <div className="code-editor-container">
        <Editor
          height="520px"
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: {
              enabled: true,
            },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            padding: {
              top: 15,
              bottom: 15,
            },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            renderLineHighlight: "all",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderWhitespace: "selection",
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
      <div className="code-editor-footer">
        <span>
          Line numbers enabled
       </span>
        <span>
          {code.length} characters
        </span>
      </div>
    </div>
  );
};
export default CodeEditor;
