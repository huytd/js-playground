import * as React from 'react';
import { VisualElement } from './VisualElement';

export const VisualArray = (props) => {
    const isMatched = (index) => {
        if (typeof props.index === 'number') {
            return props.index === index;
        }
        if (typeof props.index === 'object' && Array.isArray(props.index)) {
            return props.index.indexOf(index) !== -1;
        }
        return false;
    };
    return <div className={"py-1 px-2 mb-2 bg-gray-100 dark-mode:bg-mono-700 text-gray-500 dark-mode:text-mono-100 rounded-sm border border-b-2 border-gray-500 dark-mode:border-mono-500 flex flex-row flex-wrap"}>
        {props.value.map((c, i) => <div key={i} className={"pt-5 px-2 bg-gray-200 m-1 relative " + (isMatched(i) ? "bg-gray-400 dark-mode:bg-mono-400" : "dark-mode:bg-mono-600")}>
            <span className={"absolute top-0 left-0 text-xs ml-1 opacity-50 " + (isMatched(i) ? "text-white" : "")}>{i}</span>
            <VisualElement value={c}/>
        </div>)}
    </div>;
};