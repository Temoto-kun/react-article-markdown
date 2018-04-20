import React from 'react';

const INITIAL_STATE = {
    current: null,
    token: '',
    mode: 'PARAGRAPH',
    children: [],
};

const isHeading = (c) => /#/.test(c);

const isNewline = (c) => /(\r\n|\r|\n)/.test(c);

const isWhitespace = (c) => /[\t ]/.test(c);

function parseReducer(state = INITIAL_STATE, lookahead) {
    const flux = {};
    const { current, mode, token } = state;

    if (isHeading(lookahead)) {
        flux.mode = 'HEADING_SIGIL';
    } else if (isWhitespace(lookahead)) {
        if (state.mode === 'HEADING_SIGIL') {

        }
    } else if (isNewline(lookahead)) {
        flux.children = flux.children || [];
        if (state.mode === 'HEADING_SIGIL') {
            flux.mode = 'PARAGRAPH';
        }
    } else {

    }

    flux.current = lookahead;

    return Object.assign({}, state, flux);
}

function cleanMarkdown(md) {
    return md
        .replace(/(\r\n|\r|\n)(\r\n|\r|\n)+/gm, '\n\n')
        .replace(/\t\t+/gm, '\t')
        .replace(/( )( +)/gm, ' ');
}

function parse(md) {
    const mdClean = cleanMarkdown(md);
    const mdChars = mdClean.split(''); // TODO better way of splitting strings (e.g. multibyte)

    const state = mdChars.reduce(parseReducer, INITIAL_STATE);

    return React.createElement(React.Fragment, null, state.children);
}

export default parse;
