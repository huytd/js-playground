import * as React from 'react';
import { VisualElement } from './VisualElement';
import { uniqueId } from '../helpers';

export const VisualGrid = (props) => {
    const index = props.index || [];
    const isMatched = (x, y) => index.some(p => p[0] === x && p[1] === y);
    return <div className={"py-1 px-2 mb-2 bg-gray-100 dark-mode:bg-mono-700 text-gray-500 dark-mode:text-mono-100 rounded-md border border-b-2 border-gray-500 dark-mode:border-mono-500"}>
        <div className={"flex flex-col"}>
            {props.value.map((row, y) => <div key={`grid-row-${uniqueId()}`} className={"flex flex-row grid-row"}>
                {row.map((col, x) => <div key={`grid-col-${uniqueId()}`} className={"px-1 " + (isMatched(x, y) ? "bg-purple-300" : "bg-gray-200")}>
                    <VisualElement key={`grid-cell-${uniqueId()}`} value={col}/>
                </div>)}
            </div>)}
        </div>
    </div>;
};