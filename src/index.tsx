import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.scss';
import Editor from '@monaco-editor/react';
import { PLACEHOLDER_CODE } from './constants';
import { useStoredState, CodeExecutor, fetchTextFromURL, queryParam } from './helpers';
import { VisualElement } from './components/VisualElement';
import { VisualLog } from './components/VisualLog';

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

    return <div className={"w-screen h-screen flex flex-row text-sm font-cascadia overflow-hidden dark-mode:text-mono-100 " + (darkMode ? "dark-mode" : "")}>
        <div className={"resize-none w-6/12 flex flex-col dark-mode:bg-mono-800 dark-mode:text-mono-100"}>
            <Editor
                language="javascript"
                theme={darkMode ? "dark" : "light"}
                options={{
                    fontSize: 14,
                    fontFamily: 'Cascadia Mono',
                    minimap: {
                        enabled: false
                    }
                }}
                value={code}
                editorDidMount={handleEditorDidMount}
            />
            <div className={"bg-gray-100 dark-mode:bg-mono-800 h-20 p-3 border-gray-300 dark-mode:border-mono-700 border-t flex flex-row"}>
                <pre className={"flex-1 overflow-y-auto dark-mode:text-mono-100"}>{logContent.length ? logContent.join("\n") : "Press Ctrl + Enter to run the code."}</pre>
                <button className={"m-1 px-3 rounded-sm border-blue-600 bg-blue-500 text-white cursor-pointer"} onClick={() => executeCode()}>Run</button>
            </div>
        </div>
        <div className={"flex-1 bg-gray-100 dark-mode:bg-mono-800 flex flex-col border-l border-gray-300 dark-mode:border-mono-700"}>
            <div className={"flex-1 overflow-y-auto p-3 sketch-area"}>
                {result.map((entry, i) => {
                    if (typeof entry.value === 'string' && entry.value.startsWith("@LOG=")) {
                        return <VisualLog key={i} value={entry.value.replace(/^@LOG=/, '')}/>;
                    } else {
                        return <VisualElement key={i} value={entry.value} param={entry.param}/>;
                    }
                })}
            </div>
        </div>
    </div>;
};

ReactDOM.render(<App/>, document.getElementById("root"));