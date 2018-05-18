import React from 'react';

function Blockquote({ children, ...props }) {
    return React.createElement('blockquote', props, children)
}

export default Blockquote
