import React from 'react';

function Paragraph({ children, ...props }) {
    return React.createElement('p', props, children)
}

export default Paragraph
