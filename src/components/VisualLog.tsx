import * as React from 'react';
import marked from 'marked';

export const VisualLog = (props) =>
    <div dangerouslySetInnerHTML={{ __html: marked(props.value.toString()) }}
        className={"p-2 mb-2 bg-gray-100 text-gray-600 dark-mode:bg-mono-800 dark-mode:text-mono-100 rounded-md border border-b-2 border-gray-500 dark-mode:border-mono-700 block clear-both markdown"} />;
