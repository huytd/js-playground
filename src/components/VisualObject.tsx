import * as React from 'react';
import { VisualElement } from './VisualElement';

export const VisualObject = (props) => {
    const content = [];
    const obj = props.value;
    for (let key in obj) {
        content.push(<div key={Date.now() + key} className={"block p-2"}><div className={"inline-block w-1/12"}>{key}:</div><VisualElement value={obj[key]}/></div>);
    }
    return <div className={"py-1 px-2 mb-2 bg-orange-100 text-orange-500 dark-mode:bg-mono-700 rounded-md border border-b-2 border-orange-500 dark-mode:border-mono-500 flex flex-row flex-wrap"}> {content} </div>;
};