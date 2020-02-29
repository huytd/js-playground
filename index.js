import React, {useRef, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import Editor from '@monaco-editor/react';

const PLACEHOLDER_CODE = `const swap = (array, i, j) => {
  log("Swapping", array[i], array[j]);
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
};

const bubbleSort = input => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if(input[j - 1] > input[j]) {
        swap(input, j - 1, j);
        debug(input, [j, j - 1]);
      }
    }
  }
  return input;
};

const input = [5,7,3,1,8];
log(">> Input", input);
debug(input);
const result = bubbleSort(input);
log(">> Result", result);
debug(result);`;

const VisualBoolean = (props) => <div className={"py-1 px-2 mb-2 bg-purple-100 text-purple-500 border border-purple-500"}> {props.value.toString()} </div>;

const VisualNumber = (props) => <div className={"py-1 px-2 mb-2 bg-blue-100 text-blue-500 border border-blue-500"}> {props.value} </div>;

const VisualString = (props) => {
    const isMatched = (index) => {
        if (typeof props.index === 'number') {
            return props.index === index;
        }
        if (typeof props.index === 'object' && Array.isArray(props.index)) {
            return props.index.indexOf(index) !== -1;
        }
        return false;
    };
    const chars = props.value.split('');
    return <div className={"py-1 px-2 mb-2 bg-red-100 text-red-500 border border-red-500 flex flex-row flex-wrap"}>
        {chars.length === 1 ? chars[0] : chars.map((c, i) => <div key={i} className={"pt-5 px-2 bg-red-200 m-1 relative " + (isMatched(i) ? "bg-red-400" : "")}>
            <span className={"absolute top-0 left-0 text-xs ml-1 opacity-50 " + (isMatched(i) ? "text-white" : "")}>{i}</span>
            {c}
        </div>)}
    </div>;
};

const VisualObject = (props) => {
    const content = [];
    const obj = props.value;
    for (let key in obj) {
        content.push(<div key={Date.now()} className={"block p-2"}><div className={"inline-block w-1/12"}>{key}:</div><VisualElement value={obj[key]}/></div>);
    }
    return <div className={"py-1 px-2 mb-2 bg-orange-100 text-orange-500 border border-red-500 flex flex-col"}> {content} </div>;
};

const VisualArray = (props) => {
    const isMatched = (index) => {
        if (typeof props.index === 'number') {
            return props.index === index;
        }
        if (typeof props.index === 'object' && Array.isArray(props.index)) {
            return props.index.indexOf(index) !== -1;
        }
        return false;
    };
    return <div className={"py-1 px-2 mb-2 bg-green-100 text-green-500 border border-green-500 flex flex-row flex-wrap"}>
        {props.value.map((c, i) => <div key={i} className={"pt-5 px-2 bg-green-200 m-1 relative " + (isMatched(i) ? "bg-green-400" : "")}>
            <span className={"absolute top-0 left-0 text-xs ml-1 opacity-50 " + (isMatched(i) ? "text-white" : "")}>{i}</span>
            <VisualElement value={c}/>
        </div>)}
    </div>;
};

const VisualElement = (props) => {
    const obj = props.value;
    const param = props.param;
    if (typeof obj === 'number') {
        return <VisualNumber value={obj}/>;
    }
    if (typeof obj === 'string') {
        return <VisualString value={obj} index={param}/>;
    }
    if (typeof obj === 'boolean') {
        return <VisualBoolean value={obj}/>;
    }
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return <VisualArray value={obj} index={param}/>;
        } else {
            return <VisualObject value={obj}/>;
        }
    }
    return null;
};

const VisualLog = (props) => <div className={"p-2 mb-2 bg-gray-100 text-gray-600 border border-gray-500 block clear-both"}> {props.value.toString()} </div>;

const App = () => {
    const editorRef = useRef();
    const [result, setResult] = useState([]);
    const [logContent, setLog] = useState([]);

    const handleEditorDidMount = (ref, editor) => {
        editorRef.current = ref;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            if (editorRef && editorRef.current) {
                const code = editorRef.current();
                const debugArr = [];
                const logList = [];
                const debug = (value, index) => {
                    debugArr.push({
                        value: JSON.parse(JSON.stringify(value)),
                        param: index
                    });
                };
                const log = (...args) => {
                    debugArr.push({
                        value: "@LOG=" + args.join(" "),
                        param: -1
                    });
                };
                const appLogger = (...args) => {
                    logList.push(args.join(" "));
                };
                try {
                    eval(code);
                } catch (error) {
                    const msg = `Line ${error.lineNumber} Column ${error.columnNumber}: ${error.message}`;
                    appLogger(msg);
                }
                setResult(debugArr);
                setLog(logList);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keypress", handleKeyPress);
        return () => window.removeEventListener("keypress", handleKeyPress);
    }, []);

    return <div className={"w-screen h-screen flex flex-row text-sm font-cascadia overflow-hidden"}>
        <div className={"resize-none w-6/12 flex flex-col"}>
            <Editor
                language="javascript"
                options={{
                    fontSize: 14,
                    fontFamily: 'Cascadia Mono',
                    minimap: {
                        enabled: false
                    }
                }}
                value={PLACEHOLDER_CODE}
                editorDidMount={handleEditorDidMount}
            />
            <pre className={"bg-gray-100 h-20 p-3 border-gray-300 border-t overflow-y-auto"}>
                {logContent.length ? logContent.join("\n") : "Press Ctrl + Enter to run the code."}
            </pre>
        </div>
        <div className={"flex-1 bg-gray-100 flex flex-col border-l border-gray-300"}>
            <div className={"flex-1 overflow-y-auto p-3"}>
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