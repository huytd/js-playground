import * as React from 'react';

export const VisualBoolean = (props) => {
    const value = props.value;
    const color = value ? "green" : "red";
    return <div className={`py-1 px-2 mb-2 bg-${color}-100 text-${color}-500 dark-mode:bg-${color}-800 dark-mode:text-${color}-300 rounded-sm border border-b-2 border-${color}-500 dark-mode:border-${color}-600`}> {value.toString()} </div>;
};