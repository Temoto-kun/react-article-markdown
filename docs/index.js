var ReactMarkdown = (function (exports,React) {
    'use strict';

    React = React && React.hasOwnProperty('default') ? React['default'] : React;

    const INITIAL_STATE = {
        current: null,
        token: '',
        mode: 'PARAGRAPH',
        children: [],
        sectionChildren: [],
        lastHeadingRank: 0,
        parserHeadingRank: 0,
        preserveLineBreaks: false,
    };

    const isHeading = (c) => /#/.test(c);

    const isNewline = (c) => /(\r\n|\r|\n)/.test(c);

    const isWhitespace = (c) => /[\t ]/.test(c);

    function parseReducer(state = INITIAL_STATE, lookahead, i, chars) {
        const flux = {};
        const { current, mode, token } = state;

        if (isNewline(lookahead)) {
            const { children = [] } = state;
            // add child
            flux.children = children;
            if (mode === 'HEADING_TEXT') {
                const { parserHeadingRank } = state;
                flux.children.push(React.createElement(`h${parserHeadingRank}`, null, token));
                flux.parserHeadingRank = 0;
                flux.token = '';
                flux.mode = 'PARAGRAPH';
            } else if (isNewline(current)) {
                if (token.length > 0) {
                    flux.children.push(React.createElement('p', null, token));
                }
                flux.token = '';
                flux.mode = 'PARAGRAPH';
            } else {
                const { preserveLineBreaks } = state;
                if (preserveLineBreaks) {
                    flux.token = token + lookahead;
                } else {
                    flux.token = token + ' ';
                }
            }
        } else if (isHeading(lookahead)) {
            if (mode === 'HEADING_TEXT') {
                flux.token = token + lookahead;
            } else {
                const { parserHeadingRank } = state;

                flux.mode = 'HEADING';
                flux.parserHeadingRank = parserHeadingRank + 1;
            }
        } else if (mode === 'HEADING' && !isNewline(lookahead)) {
            flux.mode = 'HEADING_TEXT';
            if (!isWhitespace(lookahead)) {
                flux.token = token + lookahead;
            }
        } else {
            flux.token = token + lookahead;
        }

        flux.current = lookahead;

        // add last child
        if (i === chars.length - 1) {
            const { children = [] } = state;
            flux.children = children;
            if (mode === 'HEADING_TEXT') {
                const { parserHeadingRank } = state;
                flux.children.push(React.createElement(`h${parserHeadingRank}`, null, token + lookahead));
            } else {
                flux.children.push(React.createElement('p', null, token + lookahead));
            }
        }

        return { ...state, ...flux, };
    }

    function cleanMarkdown(md) {
        return md
            .trim()
            .replace(/(\r\n|\r|\n)(\r\n|\r|\n)+/gm, '\n\n')
            .replace(/\t\t+/gm, '\t')
            .replace(/( )( +)/gm, ' ');
    }

    function parse(md, { preserveLineBreaks = false } = {}) {
        const mdClean = cleanMarkdown(md);
        const mdChars = mdClean.split(''); // TODO better way of splitting strings (e.g. multibyte)

        const state = mdChars.reduce(parseReducer, { ...INITIAL_STATE, preserveLineBreaks });

        return React.createElement(React.Fragment, null, state.children);
    }

    exports.parse = parse;

    return exports;

}({},React));
