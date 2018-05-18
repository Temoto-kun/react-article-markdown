import React from 'react';

function Heading({ children, level, ...props }) {
    const headingLevel = parseInt(level, 10)

    if (!(1 <= headingLevel && headingLevel <= 6)) {
        throw new Error(`Invalid heading level: ${headingLevel}`)
    }

    return React.createElement(`h${headingLevel}`, props, children)
}

export default Heading
