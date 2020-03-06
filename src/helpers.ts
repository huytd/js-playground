import * as React from 'react';

export const uniqueId = () => Date.now() + Math.random().toString(36).substr(2, 9);

export const useStoredState = (defaultValue, key) => {
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
};

interface ExecutableWindow extends Window {
    debug(value, index): void;
    log(...args): void;
    hack: any;
    eval(code): void;
}

export const CodeExecutor = (code) => {
    const debugArr = [];
    const logList = [];
    const settings = [];
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
    const logReporter = (...args) => {
        logList.push(args.join(" "));
    };
    const hack = {
        ui: {
            darkMode: (flag) => {
                settings.push({
                    name: 'darkMode',
                    value: flag
                });
            }
        }
    };
    let container: HTMLIFrameElement = document.createElement('iframe');
    container.width = "0";
    container.height = "0";
    container.style.opacity = "0";
    container.style.border = "0";
    container.style.position = 'absolute';
    container.style.top = '-100px';
    document.body.appendChild(container);
    const win = container.contentWindow as ExecutableWindow;
    win.debug = debug;
    win.log = log;
    win.hack = hack;
    try {
        win.eval(code);
    } catch (error) {
        const msg = `Line ${error.lineNumber} Column ${error.columnNumber}: ${error.message}`;
        logReporter(msg);
    }
    document.body.removeChild(container);
    return [debugArr, logList, settings];
};

export const fetchJSONFromUrl = async (url) => {
    const fetchUrl = `https://snackycors.herokuapp.com/${url}`;
    const request = await fetch(fetchUrl);
    const data = await request.json();
    return data;
};

export const fetchTextFromURL = async (url) => {
    const fetchUrl = `https://snackycors.herokuapp.com/${url}`;
    const request = await fetch(fetchUrl);
    const data = await request.text();
    return data;
};

export const queryParam = (key) => {
    const params = new URLSearchParams(window.location.search.substring(1));
    return params.get(key);
};