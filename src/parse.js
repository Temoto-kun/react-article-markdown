import React from 'react';
import {
    Blockquote,
    Heading,
    Paragraph,
} from './elements/index';

const INITIAL_STATE = {
    current: null,
    token: '',
    mode: 'PARAGRAPH',
    children: [],
    sectionChildren: [],
    lastHeadingRank: 0,
    parserHeadingRank: 0,
    preserveLineBreaks: false,
    smartyPants: true,
    flavor: 'GFM',
    column: 0,
    row: 0,
};

const isAtxHeading = (c) => /#/.test(c);

const isBlockquote = (c) => />/.test(c);

const isNewline = (c) => /(\r\n|\r|\n)/.test(c);

const isWhitespace = (c) => /[\t ]/.test(c);

function parseReducer(state = INITIAL_STATE, lookahead, i, chars) {
    const flux = {};
    const { current, mode, token, row, column } = state;

    if (isNewline(lookahead)) {
        flux.row = row + 1
        flux.column = 0
        const { children = [] } = state
        // add child
        flux.children = children;
        if (mode === 'HEADING_TEXT') {
            const { parserHeadingRank } = state
            flux.children.push(new Heading({ children: token, level: parserHeadingRank, }))
            flux.parserHeadingRank = 0
            flux.token = ''
            flux.mode = 'PARAGRAPH'
        } else if (mode === 'BLOCKQUOTE_TEXT') {
            flux.children.push(new Blockquote({ children: token }))
            flux.token = ''
            flux.mode = 'PARAGRAPH'
        } else if (isNewline(current)) {
            if (token.length > 0) {
                flux.children.push(new Paragraph({ children: token }))
            }
            flux.token = ''
            flux.mode = 'PARAGRAPH'
        } else {
            const { preserveLineBreaks } = state
            if (preserveLineBreaks) {
                flux.token = token + lookahead
            } else {
                flux.token = token + ' '
            }
        }
    } else if (isAtxHeading(lookahead)) {
        if (column === 0 && (mode === 'PARAGRAPH' || mode === 'HEADING')) {
            const { parserHeadingRank } = state;

            flux.mode = 'HEADING';
            flux.parserHeadingRank = parserHeadingRank + 1;
        } else {
            flux.token = token + lookahead
        }
    } else if (isBlockquote(lookahead)) {
        if (column === 0 && (mode === 'PARAGRAPH' || mode === 'BLOCKQUOTE')) {
            flux.mode = 'BLOCKQUOTE';
        } else {
            flux.token = token + lookahead
        }
    } else if (!isNewline(lookahead)) {
        if (mode === 'HEADING') {
            flux.mode = 'HEADING_TEXT';
            if (!isWhitespace(lookahead)) {
                flux.token = token + lookahead
            }
        } else if (mode === 'BLOCKQUOTE') {
            flux.mode = 'BLOCKQUOTE_TEXT';
            if (!isWhitespace(lookahead)) {
                flux.token = token + lookahead
            }
        } else {
            flux.column = column + 1
            flux.token = token + lookahead
        }
    } else {
        flux.column = column + 1
        flux.token = token + lookahead
    }

    flux.current = lookahead;

    // add last child
    if (i === chars.length - 1) {
        const { children = [] } = state
        flux.children = children;
        if (mode === 'HEADING_TEXT') {
            const { parserHeadingRank } = state
            flux.children.push(new Heading({ children: token + lookahead, level: parserHeadingRank, }))
        } else if (mode === 'BLOCKQUOTE_TEXT') {
            flux.children.push(new Blockquote({ children: token + lookahead }))
        } else {
            flux.children.push(new Paragraph({ children: token + lookahead }))
        }
    }

    return { ...state, ...flux, };
}

function collapseWhitespace(md) {
    return md
        .trim()
        .replace(/(\r\n|\r|\n)(\r\n|\r|\n)+/gm, '\n\n')
        .replace(/\t\t+/gm, '\t')
        .replace(/( )( +)/gm, ' ');
}

function parse(md, options = { preserveLineBreaks: false, smartyPants: true, flavor: 'GFM' }) {
    const mdClean = collapseWhitespace(md);
    const mdChars = mdClean.split(''); // TODO better way of splitting strings (e.g. multibyte)

    const state = mdChars.reduce(parseReducer, { ...INITIAL_STATE, ...options });

    return React.createElement(React.Fragment, null, state.children);
}

export default parse;
