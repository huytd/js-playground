import React from 'react';

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
    let container = document.createElement('iframe');
    container.width = container.height = 0;
    container.style.opacity = 0;
    container.style.border = 0;
    container.style.position = 'absolute';
    container.style.top = '-100px';
    document.body.appendChild(container);
    const win = container.contentWindow;
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