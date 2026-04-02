import { describe, expect, it } from 'bun:test';

import { createContext, render, renderToString, use } from '../index.ts';

describe('render', () => {
	describe('basic nodes', () => {
		it('render() returns a Response', () => {
			const response = render(<div>hello</div>);
			expect(response).toBeInstanceOf(Response);
			expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
		});

		it('render() merges custom headers', () => {
			const response = render(<div>hello</div>, {
				status: 201,
				headers: { 'X-Custom': 'value' },
			});
			expect(response.status).toBe(201);
			expect(response.headers.get('X-Custom')).toBe('value');
			expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
		});

		it('render() allows overriding Content-Type', () => {
			const response = render(<div>hello</div>, {
				headers: { 'Content-Type': 'text/html' },
			});
			expect(response.headers.get('Content-Type')).toBe('text/html');
		});

		it('renders basic HTML', () => {
			const html = renderToString(<div>hello, world!</div>);
			expect(html).toBe('<div>hello, world!</div>');
		});

		it('renders string nodes', () => {
			const html = renderToString('hello, world!');
			expect(html).toBe('hello, world!');
		});

		it('renders number nodes', () => {
			const html = renderToString(42);
			expect(html).toBe('42');
		});

		it('renders 0', () => {
			const html = renderToString(<span>{0}</span>);
			expect(html).toBe('<span>0</span>');
		});

		it('renders bigint nodes', () => {
			const html = renderToString(BigInt(9007199254740991));
			expect(html).toBe('9007199254740991');
		});

		it('renders boolean nodes as empty', () => {
			const html = renderToString(true);
			expect(html).toBe('');
		});

		it('renders null nodes as empty', () => {
			const html = renderToString(null);
			expect(html).toBe('');
		});

		it('renders undefined nodes as empty', () => {
			const html = renderToString(undefined);
			expect(html).toBe('');
		});

		it('renders array of nodes', () => {
			const html = renderToString([<div>one</div>, <span>two</span>]);
			expect(html).toBe('<div>one</div><span>two</span>');
		});

		it('renders mixed array of nodes', () => {
			const html = renderToString([<div>one</div>, 'text', 42, null, undefined]);
			expect(html).toBe('<div>one</div>text42');
		});

		it('renders fragments', () => {
			const html = renderToString(
				<>
					<h1>title</h1>
					<p>paragraph</p>
					<div>content</div>
				</>,
			);
			expect(html).toBe('<h1>title</h1><p>paragraph</p><div>content</div>');
		});
	});

	describe('component nodes', () => {
		it('renders component nodes', () => {
			function Greeting({ name }: { name: string }) {
				return <div>hello, {name}!</div>;
			}
			const html = renderToString(<Greeting name="world" />);
			expect(html).toBe('<div>hello, world!</div>');
		});

		it('renders nested components', () => {
			function Inner() {
				return <span>inner</span>;
			}
			function Outer() {
				return (
					<div>
						<Inner />
					</div>
				);
			}
			const html = renderToString(<Outer />);
			expect(html).toBe('<div><span>inner</span></div>');
		});

		it('propagates component errors to caller', () => {
			function ThrowingComponent(): never {
				throw new Error('render error');
			}
			expect(() => renderToString(<ThrowingComponent />)).toThrow('render error');
		});
	});

	describe('attributes', () => {
		it('renders boolean attributes', () => {
			const html = renderToString(<input disabled readonly />);
			expect(html).toBe('<input disabled readonly>');
		});

		it('omits false boolean attributes', () => {
			const html = renderToString(<input disabled={false} />);
			expect(html).toBe('<input>');
		});

		it('omits undefined attributes', () => {
			const html = renderToString(<input value={undefined} placeholder={undefined} />);
			expect(html).toBe('<input>');
		});

		it('renders data-* attributes as-is', () => {
			const html = renderToString(<div data-testid="foo" data-value="123" />);
			expect(html).toBe('<div data-testid="foo" data-value="123"></div>');
		});

		it('renders aria-* attributes as-is', () => {
			const html = renderToString(<button aria-label="close" aria-hidden="true" />);
			expect(html).toBe('<button aria-label="close" aria-hidden="true"></button>');
		});

		it('omits function attributes', () => {
			// @ts-expect-error testing runtime behavior with invalid type
			const html = renderToString(<button onclick={() => {}} />);
			expect(html).toBe('<button></button>');
		});

		it('renders string class as-is', () => {
			const html = renderToString(<div class="foo bar" />);
			expect(html).toBe('<div class="foo bar"></div>');
		});

		it('preserves other attributes when rendering string class', () => {
			const html = renderToString(<div id="app" class="foo bar" data-testid="root" />);
			expect(html).toBe('<div id="app" class="foo bar" data-testid="root"></div>');
		});

		it('concatenates class array', () => {
			const html = renderToString(<div class={['foo', 'bar', 'baz']} />);
			expect(html).toBe('<div class="foo bar baz"></div>');
		});

		it('filters out falsy values from class array', () => {
			const html = renderToString(<div class={['foo', false, 'bar', null, 'baz', undefined, 0]} />);
			expect(html).toBe('<div class="foo bar baz"></div>');
		});

		it('conditionally applies classes', () => {
			const isActive = true;
			const isDisabled = false;
			const html = renderToString(<div class={['btn', isActive && 'active', isDisabled && 'disabled']} />);
			expect(html).toBe('<div class="btn active"></div>');
		});

		it('omits class attribute when array is all falsy', () => {
			const html = renderToString(<div class={[false, null, undefined, 0]} />);
			expect(html).toBe('<div></div>');
		});

		it('handles empty class array', () => {
			const html = renderToString(<div class={[]} />);
			expect(html).toBe('<div></div>');
		});

		it('handles single-element class array', () => {
			const html = renderToString(<div class={['solo']} />);
			expect(html).toBe('<div class="solo"></div>');
		});
	});

	describe('escaping', () => {
		it('escapes text content', () => {
			const html = renderToString(<div>{'<script>alert("xss")</script>'}</div>);
			// < is escaped, > doesn't need escaping in content
			expect(html).toBe('<div>&lt;script>alert("xss")&lt;/script></div>');
		});

		it('escapes attribute values', () => {
			const html = renderToString(<div title={'<script>"xss"</script>'} />);
			// " is escaped in attributes, < doesn't need escaping in attributes
			expect(html).toBe('<div title="<script>&quot;xss&quot;</script>"></div>');
		});

		it('escapes ampersands', () => {
			const html = renderToString(<div>{'foo & bar'}</div>);
			expect(html).toBe('<div>foo &amp; bar</div>');
		});

		it('does not escape dangerouslySetInnerHTML', () => {
			const html = renderToString(<div dangerouslySetInnerHTML={{ __html: '<strong>bold</strong>' }} />);
			expect(html).toBe('<div><strong>bold</strong></div>');
		});
	});

	describe('self-closing tags', () => {
		it('renders void elements as self-closing', () => {
			const html = renderToString(
				<>
					<br />
					<hr />
					<img src="test.png" />
					<input type="text" />
					<area shape="rect" />
					<col span={2} />
				</>,
			);
			expect(html).toBe('<br><hr><img src="test.png"><input type="text"><area shape="rect"><col span="2">');
		});
	});

	describe('style attribute', () => {
		it('renders string style as-is', () => {
			const html = renderToString(<div style="color: blue; font-weight: bold" />);
			expect(html).toBe('<div style="color: blue; font-weight: bold"></div>');
		});

		it('serializes style object', () => {
			const html = renderToString(<div style={{ color: 'green', 'margin-top': '10px', padding: '5px' }} />);
			expect(html).toBe('<div style="color:green; margin-top:10px; padding:5px"></div>');
		});

		it('serializes style object keys literally', () => {
			// @ts-expect-error testing runtime behavior with an invalid style key
			const html = renderToString(<div style={{ backgroundColor: 'green', '--gap': '1rem' }} />);
			expect(html).toBe('<div style="backgroundColor:green; --gap:1rem"></div>');
		});
	});

	describe('doctype', () => {
		it('prepends DOCTYPE for html root element', () => {
			const html = renderToString(
				<html>
					<head>
						<title>test page</title>
					</head>
					<body>
						<div>hello</div>
					</body>
				</html>,
			);
			expect(html).toBe(
				'<!doctype html><html><head><title>test page</title></head><body><div>hello</div></body></html>',
			);
		});

		it('does not prepend DOCTYPE for non-html root', () => {
			const html = renderToString(
				<div>
					<html>not a root</html>
				</div>,
			);
			expect(html).toBe('<div><html>not a root</html></div>');
		});
	});

	describe('head hoisting', () => {
		it('hoists title elements to head', () => {
			const html = renderToString(
				<html>
					<body>
						<title>page title</title>
						<div>content</div>
					</body>
				</html>,
			);
			expect(html).toBe(
				'<!doctype html><html><head><title>page title</title></head><body><div>content</div></body></html>',
			);
		});

		it('hoists meta elements to head', () => {
			const html = renderToString(
				<div>
					<meta name="description" content="test page" />
					<h1>hello</h1>
				</div>,
			);
			expect(html).toBe(
				'<head><meta name="description" content="test page"></head><div><h1>hello</h1></div>',
			);
		});

		it('hoists link elements to head', () => {
			const html = renderToString(
				<div>
					<link rel="stylesheet" href="/styles.css" />
					<p>content</p>
				</div>,
			);
			expect(html).toBe('<head><link rel="stylesheet" href="/styles.css"></head><div><p>content</p></div>');
		});

		it('collects multiple head elements', () => {
			const html = renderToString(
				<div>
					<title>my app</title>
					<meta charset="utf-8" />
					<p>hello</p>
					<link rel="icon" href="/favicon.ico" />
					<meta name="viewport" content="width=device-width" />
				</div>,
			);
			expect(html).toBe(
				'<head><title>my app</title><meta charset="utf-8"><link rel="icon" href="/favicon.ico"><meta name="viewport" content="width=device-width"></head><div><p>hello</p></div>',
			);
		});

		it('hoists head elements from components', () => {
			function SEO() {
				return (
					<>
						<title>component title</title>
						<meta name="description" content="component description" />
					</>
				);
			}

			const html = renderToString(
				<div>
					<SEO />
					<main>content</main>
				</div>,
			);
			expect(html).toBe(
				'<head><title>component title</title><meta name="description" content="component description"></head><div><main>content</main></div>',
			);
		});

		it('merges head elements with existing head tag', () => {
			const html = renderToString(
				<html>
					<head>
						<meta charset="utf-8" />
					</head>
					<body>
						<title>body title</title>
						<link rel="stylesheet" href="/app.css" />
						<div>content</div>
					</body>
				</html>,
			);
			expect(html).toBe(
				'<!doctype html><html><head><meta charset="utf-8"><title>body title</title><link rel="stylesheet" href="/app.css"></head><body><div>content</div></body></html>',
			);
		});

		it('does not hoist script tags', () => {
			const html = renderToString(
				<div>
					<h1>page title</h1>
					<script dangerouslySetInnerHTML={{ __html: "console.log('hello')" }} />
					<p>some content</p>
				</div>,
			);
			expect(html).toBe(
				"<div><h1>page title</h1><script>console.log('hello')</script><p>some content</p></div>",
			);
		});
	});

	describe('context', () => {
		it('provides and consumes context via use()', () => {
			const ThemeContext = createContext('light');

			function ThemedButton() {
				const theme = use(ThemeContext);
				return <button class={theme}>click</button>;
			}

			const html = renderToString(
				<ThemeContext value="dark">
					<ThemedButton />
				</ThemeContext>,
			);
			expect(html).toBe('<button class="dark">click</button>');
		});

		it('returns default value when no provider', () => {
			const CountContext = createContext(0);

			function Counter() {
				const count = use(CountContext);
				return <span>{count}</span>;
			}

			const html = renderToString(<Counter />);
			expect(html).toBe('<span>0</span>');
		});

		it('provides nested context', () => {
			const ThemeContext = createContext('light');
			const UserContext = createContext('anonymous');

			function Display() {
				const theme = use(ThemeContext);
				const user = use(UserContext);
				return (
					<p>
						{user} uses {theme}
					</p>
				);
			}

			const html = renderToString(
				<ThemeContext value="dark">
					<UserContext value="alice">
						<Display />
					</UserContext>
				</ThemeContext>,
			);
			expect(html).toBe('<p>alice uses dark</p>');
		});

		it('overrides context in nested providers', () => {
			const ThemeContext = createContext('light');

			function ThemedText() {
				const theme = use(ThemeContext);
				return <span>{theme}</span>;
			}

			const html = renderToString(
				<ThemeContext value="dark">
					<div>
						<ThemedText />
						<ThemeContext value="blue">
							<ThemedText />
						</ThemeContext>
						<ThemedText />
					</div>
				</ThemeContext>,
			);
			expect(html).toBe('<div><span>dark</span><span>blue</span><span>dark</span></div>');
		});
	});
});
