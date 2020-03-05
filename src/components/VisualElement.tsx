import * as React from 'react';
import { VisualArray } from './VisualArray';
import { VisualBoolean } from "./VisualBoolean";
import { VisualGrid } from './VisualGrid';
import { VisualNumber } from './VisualNumber';
import { VisualObject } from './VisualObject';
import { VisualString } from './VisualString';
import { uniqueId } from '../helpers';

const isGrid = (input) => {
    const notEverythingIsArray = input.some(c => !Array.isArray(c));
    if (!notEverythingIsArray) {
        if (input.length > 0) {
            const firstRow = input[0];
            const lengthOfFirstRow = firstRow.length;
            const notEverythingHasSameLength = input.some(c => c.length !== lengthOfFirstRow);
            return !notEverythingHasSameLength;
        }
    }
    return false;
};

export const VisualElement = (props) => {
    const obj = props.value;
    const param = props.param;
    const key = uniqueId();
    if (typeof obj === 'number') {
        return <VisualNumber key={`element-number-${key}`} value={obj}/>;
    }
    if (typeof obj === 'string') {
        return <VisualString key={`element-string-${key}`} value={obj} index={param}/>;
    }
    if (typeof obj === 'boolean') {
        return <VisualBoolean key={`element-boolean-${key}`} value={obj}/>;
    }
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            if (isGrid(obj)) {
                return <VisualGrid key={`element-grid-${key}`} value={obj} index={param}/>;
            } else {
                return <VisualArray key={`element-array-${key}`} value={obj} index={param}/>;
            }
        } else {
            return <VisualObject key={`element-object-${key}`} value={obj}/>;
        }
    }
    return null;
};