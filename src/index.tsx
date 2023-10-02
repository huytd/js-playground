import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.scss';
import Editor from '@monaco-editor/react';
import { PLACEHOLDER_CODE } from './constants';
import { useStoredState, CodeExecutor, fetchTextFromURL, queryParam } from './helpers';
import { VisualElement } from './components/VisualElement';
import { VisualLog } from './components/VisualLog';
import SplitPane, { Pane } from "react-split-pane";

interface EditorFunction {
  (): string;
}

const App = () => {
  const editorRef = React.useRef();
  const [result, setResult] = React.useState([]);
  const [logContent, setLog] = React.useState([]);
  const [darkMode, setDarkMode] = useStoredState(false, 'js-playground-dark-mode');
  const sourceUrl = queryParam('gist');
  const [code, setCode] = useStoredState(PLACEHOLDER_CODE, 'js-playground-saved-code');

  React.useEffect(() => {
    (async () => {
      if (sourceUrl) {
        try {
          const content = await fetchTextFromURL(sourceUrl);
          if (content) {
            setCode(content);
          }
        } catch (err) { }
      }
    })();
  }, []);

  const handleEditorDidMount = (ref, editor) => {
    editorRef.current = ref;
  };

  const executeCode = () => {
    // Stupidly enforce the editor object to be always non-undefined and callable
    const editor: EditorFunction = editorRef && editorRef!.current;
    if (editor) {
      const code = editor();
      const [debugee, logee, settings] = CodeExecutor(code);
      setCode(code);
      setResult(debugee);
      setLog(logee);
      if (settings.length) {
        settings.forEach(setting => {
          switch (setting.name) {
            case 'darkMode':
              setDarkMode(setting.value);
              break;
            default:
              break;
          }
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      executeCode();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, []);

  return <div className={"w-screen h-screen text-sm font-custom overflow-hidden dark-mode:text-mono-100 " + (darkMode ? "dark-mode" : "")}>
    <SplitPane split="vertical" defaultSize="50%" minSize={500}>
      <div className={"h-full flex flex-col dark-mode:bg-mono-800 dark-mode:text-mono-100"}>
        <Editor
          language="javascript"
          theme={darkMode ? "dark" : "light"}
          options={{
            fontSize: 14,
            fontFamily: 'Iosevka Mono',
            minimap: {
              enabled: false
            }
          }}
          value={code}
          editorDidMount={handleEditorDidMount}
        />
        <div className={"bg-gray-100 dark-mode:bg-mono-800 h-20 p-3 border-gray-300 dark-mode:border-mono-700 border-t flex flex-row"}>
            <pre className={"flex-1 overflow-y-auto dark-mode:text-mono-100"}>{logContent.length ? logContent.join("\n") : "Press Ctrl + Enter to run the code."}</pre>
            <button className={"m-1 px-3 bg-green-100 hover:bg-green-200 dark-mode:bg-green-600 rounded-md border-green-500 dark-mode:border-green-800 text-green-700 dark-mode:text-green-300 rounded-md border border-b-2"} onClick={() => executeCode()}>Run</button>
        </div>
      </div>
      <div className={"bg-gray-100 h-full dark-mode:bg-mono-800 flex flex-col border-l border-gray-300 dark-mode:border-mono-700"}>
        {logContent.length ? (
        <div className={"bg-gray-100 dark-mode:bg-mono-800 h-20 p-3 border-gray-300 dark-mode:border-mono-700 border-t flex flex-row"}>
          <pre className={"flex-1 overflow-y-auto text-red-600 font-semibold leading-relaxed"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block w-5 h-5 align-middle mr-1">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {logContent.join("\n")}
          </pre>
        </div>
        ) : null}
        <div className={"flex-1 overflow-y-auto p-3 sketch-area"}>
          {result.map((entry, i) => {
            if (typeof entry.value === 'string' && entry.value.startsWith("@LOG=")) {
              return <VisualLog key={i} value={entry.value.replace(/^@LOG=/, '')} />;
            } else {
              return <VisualElement key={i} value={entry.value} param={entry.param} />;
            }
          })}
        </div>
      </div>
    </SplitPane>
  </div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
