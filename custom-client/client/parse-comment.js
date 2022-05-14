/**
 * If you have to write your own comment parser in your own client language/framework, here's a simple guide with some test cases.
 * It does not use regexes or anything, so it can be ported cross platform.
 * This is a very simple example and will probably need extended for your use case. Pull requests welcome!
 *
 * Note that if your client supports HTML, like a browser, you can just use the generated "commentHTML" field and not worry about parsing.
 */
(function commentParseExample() {
    const Tests = [
        {
            comment: `Some **bold-text** test.`,
            expected: [
                {
                    type: 'text',
                    value: 'Some '
                },
                {
                    type: 'bold',
                    value: 'bold-text'
                },
                {
                    type: 'text',
                    value: ' test.'
                }
            ]
        },
        {
            comment: `Some *italic-text* test.`,
            expected: [
                {
                    type: 'text',
                    value: 'Some '
                },
                {
                    type: 'italic',
                    value: 'italic-text'
                },
                {
                    type: 'text',
                    value: ' test.'
                }
            ]
        },
        {
            comment: `Some [img]https://staticm.fastcomments.com/1639362726066-DSC_0841.JPG[/img] test.`,
            expected: [
                {
                    type: 'text',
                    value: 'Some '
                },
                {
                    type: 'image',
                    value: 'https://staticm.fastcomments.com/1639362726066-DSC_0841.JPG'
                },
                {
                    type: 'text',
                    value: ' test.'
                }
            ]
        },
        {
            comment: `Some\nnewlines\ntest.`,
            expected: [
                {
                    type: 'text',
                    value: 'Some'
                },
                {
                    type: 'newline'
                },
                {
                    type: 'text',
                    value: 'newlines'
                },
                {
                    type: 'newline'
                },
                {
                    type: 'text',
                    value: 'test.'
                }
            ]
        }
    ];
    const SupportedNodes = {
        '[img]': {
            start: '[img]',
            end: '[/img]',
            type: 'image',
            lookaheadIgnore: null,
        },
        '**': {
            start: '**',
            end: '**',
            type: 'bold',
            lookaheadIgnore: null,
        },
        '*': {
            start: '*',
            end: '*',
            type: 'italic',
            lookaheadIgnore: null,
        },
        '\n': {
            start: '\n',
            type: 'newline',
            lookaheadIgnore: null,
            valueIsSeparateNodeType: 'text'
        },
    };
    for (const startText in SupportedNodes) {
        for (const otherStartText in SupportedNodes) {
            // noinspection EqualityComparisonWithCoercionJS - intentionally comparing memory reference
            if (startText.length === 1 && SupportedNodes[startText] != SupportedNodes[otherStartText] && otherStartText.length > startText.length && otherStartText.startsWith(startText)) {
                if (SupportedNodes[startText].lookaheadIgnore) {
                    SupportedNodes[startText].lookaheadIgnore.push(startText);
                } else {
                    SupportedNodes[startText].lookaheadIgnore = [startText];
                }
            }
        }
    }

    // Simplest markdown parser I could think of that creates an AST.
    // See note at top of file about this.
    function parse(comment) {
        let buffer = '';
        const result = [];

        let inNode = null;

        for (let i = 0; i < comment.length; i++) {
            buffer += comment[i];

            if (inNode) {
                if (buffer.endsWith(inNode.end)) {
                    result.push({
                        type: inNode.type,
                        value: buffer.substr(0, buffer.length - inNode.end.length)
                    });
                    inNode = null;
                    buffer = '';
                }
            } else {
                for (const startToken in SupportedNodes) {
                    const node = SupportedNodes[startToken];
                    if (buffer.endsWith(startToken)) {
                        if (node.lookaheadIgnore && comment[i + 1] && node.lookaheadIgnore.some((ignore) => ignore === comment[i + 1])) {
                            continue;
                        }
                        inNode = node;
                        if (buffer.length - startToken.length > 0) {
                            result.push({
                                type: 'text',
                                value: buffer.substr(0, buffer.length - startToken.length)
                            });
                        }
                        if (!node.end) { // some node types like newlines do not have ends
                            result.push({
                                type: node.type
                            });
                            inNode = null;
                        }
                        buffer = '';
                    }
                }
            }
        }
        if (buffer.length > 0) {
            result.push({
                type: 'text',
                value: buffer
            });
        }
        return result;
    }

    for (const test of Tests) {
        const expectedPretty = JSON.stringify(test.expected, null, '  ');
        const result = parse(test.comment);
        const resultPretty = JSON.stringify(result, null, '  ');
        const matches = expectedPretty === resultPretty;
        if (matches) {
            console.log('Test passed', test.comment);
        } else {
            console.error('FAILED TEST', test.comment, 'Expected', expectedPretty, 'but got', resultPretty);
            break;
        }
    }
})();
