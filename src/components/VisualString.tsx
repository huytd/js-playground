import * as React from 'react';

export const VisualString = (props) => {
    const isMatched = (index) => {
        if (typeof props.index === 'number') {
            return props.index === index;
        }
        if (typeof props.index === 'object' && Array.isArray(props.index)) {
            return props.index.indexOf(index) !== -1;
        }
        return false;
    };
    const chars = props.value.split('').map(c => {
        if (c === ' ') return '⠀'; // This is not a space
        else return c;
    });
    return <div className={"py-1 px-2 mb-2 bg-green-100 text-green-500 dark-mode:bg-green-900 dark-mode:text-green-300 rounded-sm border border-b-2 border-green-500 dark-mode:border-green-600 flex flex-col"}>
        { chars.length > 1 && (<div className="bg-green-200 text-green-600 m-1 px-2 py-1">"{props.value}"</div>) }
        <div className="flex flex-row flex-wrap">
            {chars.length === 1 ? chars[0] : chars.map((c, i) => <div key={i} className={"pt-5 px-2 m-1 relative " + (isMatched(i) ? "bg-green-400 text-white dark-mode:bg-green-700 dark-mode:text-green-200" : "bg-green-200 dark-mode:bg-green-800 text-green-600")}>
                <span className={"absolute top-0 left-0 text-xs ml-1 opacity-50 " + (isMatched(i) ? "text-white" : "")}>{i}</span>
                {c}
            </div>)}
        </div>
    </div>;
};