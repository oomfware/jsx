import { describe, expect, it } from 'bun:test';

import { createContext, render, renderToStream, renderToString, Suspense, use } from '../index.ts';

// suspense runtime script (injected once before first resolution)
const SR = '$sr';
const SUSPENSE_RUNTIME = `<script>${SR}=(t,i,s,e)=>{i="$s:"+t.dataset.suspense;s=document.createTreeWalker(document,128);while(e=s.nextNode())if(e.data===i){while(e.nextSibling?.data!=="/"+i)e.nextSibling.remove();e.nextSibling.replaceWith(...t.content.childNodes);e.remove();break}t.remove()}</script>`;
const SUSPENSE_CALL = `<script>${SR}(document.currentScript.previousElementSibling)</script>`;

// helper to drain a stream to string
async function drain(stream: ReadableStream<Uint8Array>): Promise<string> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let html = '';
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		html += decoder.decode(value);
	}
	return html;
}

describe('stream', () => {
	describe('basic nodes', () => {
		it('should render to a stream', () => {
			const stream = renderToStream(<div>hello, world!</div>);
			expect(stream).toBeDefined();
		});

		it('render() returns a Response', async () => {
			const response = render(<div>hello</div>);
			expect(response).toBeInstanceOf(Response);
			expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
			const html = await response.text();
			expect(html).toBe('<div>hello</div>');
		});

		it('render() merges custom headers', async () => {
			const response = render(<div>hello</div>, {
				status: 201,
				headers: { 'X-Custom': 'value' },
			});
			expect(response.status).toBe(201);
			expect(response.headers.get('X-Custom')).toBe('value');
			expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
		});

		it('render() allows overriding Content-Type', async () => {
			const response = render(<div>hello</div>, {
				headers: { 'Content-Type': 'text/html' },
			});
			expect(response.headers.get('Content-Type')).toBe('text/html');
		});

		it('streams basic HTML', async () => {
			const stream = renderToStream(<div>hello, world!</div>);
			const html = await drain(stream);
			expect(html).toBe('<div>hello, world!</div>');
		});

		it('renders string nodes', async () => {
			const html = await renderToString('hello, world!');
			expect(html).toBe('hello, world!');
		});

		it('renders number nodes', async () => {
			const html = await renderToString(42);
			expect(html).toBe('42');
		});

		it('renders 0', async () => {
			const html = await renderToString(<span>{0}</span>);
			expect(html).toBe('<span>0</span>');
		});

		it('renders bigint nodes', async () => {
			const html = await renderToString(BigInt(9007199254740991));
			expect(html).toBe('9007199254740991');
		});

		it('renders boolean nodes as empty', async () => {
			const html = await renderToString(true);
			expect(html).toBe('');
		});

		it('renders null nodes as empty', async () => {
			const html = await renderToString(null);
			expect(html).toBe('');
		});

		it('renders undefined nodes as empty', async () => {
			const html = await renderToString(undefined);
			expect(html).toBe('');
		});

		it('renders array of nodes', async () => {
			const html = await renderToString([<div>one</div>, <span>two</span>]);
			expect(html).toBe('<div>one</div><span>two</span>');
		});

		it('renders mixed array of nodes', async () => {
			const html = await renderToString([<div>one</div>, 'text', 42, null, undefined]);
			expect(html).toBe('<div>one</div>text42');
		});

		it('renders fragments', async () => {
			const html = await renderToString(
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
		it('renders component nodes', async () => {
			function Greeting({ name }: { name: string }) {
				return <div>hello, {name}!</div>;
			}
			const html = await renderToString(<Greeting name="world" />);
			expect(html).toBe('<div>hello, world!</div>');
		});

		it('renders nested components', async () => {
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
			const html = await renderToString(<Outer />);
			expect(html).toBe('<div><span>inner</span></div>');
		});
	});

	describe('attributes', () => {
		it('renders boolean attributes', async () => {
			const html = await renderToString(<input disabled readonly />);
			expect(html).toBe('<input disabled readonly>');
		});

		it('omits false boolean attributes', async () => {
			const html = await renderToString(<input disabled={false} />);
			expect(html).toBe('<input>');
		});

		it('omits undefined attributes', async () => {
			const html = await renderToString(<input value={undefined} placeholder={undefined} />);
			expect(html).toBe('<input>');
		});

		it('renders data-* attributes as-is', async () => {
			const html = await renderToString(<div data-testid="foo" data-value="123" />);
			expect(html).toBe('<div data-testid="foo" data-value="123"></div>');
		});

		it('renders aria-* attributes as-is', async () => {
			const html = await renderToString(<button aria-label="close" aria-hidden="true" />);
			expect(html).toBe('<button aria-label="close" aria-hidden="true"></button>');
		});

		it('omits function attributes', async () => {
			// @ts-expect-error testing runtime behavior with invalid type
			const html = await renderToString(<button onclick={() => {}} />);
			expect(html).toBe('<button></button>');
		});
	});

	describe('escaping', () => {
		it('escapes text content', async () => {
			const html = await renderToString(<div>{'<script>alert("xss")</script>'}</div>);
			// < is escaped, > doesn't need escaping in content
			expect(html).toBe('<div>&lt;script>alert("xss")&lt;/script></div>');
		});

		it('escapes attribute values', async () => {
			const html = await renderToString(<div title={'<script>"xss"</script>'} />);
			// " is escaped in attributes, < doesn't need escaping in attributes
			expect(html).toBe('<div title="<script>&quot;xss&quot;</script>"></div>');
		});

		it('escapes ampersands', async () => {
			const html = await renderToString(<div>{'foo & bar'}</div>);
			expect(html).toBe('<div>foo &amp; bar</div>');
		});

		it('does not escape dangerouslySetInnerHTML', async () => {
			const html = await renderToString(
				<div dangerouslySetInnerHTML={{ __html: '<strong>bold</strong>' }} />,
			);
			expect(html).toBe('<div><strong>bold</strong></div>');
		});
	});

	describe('self-closing tags', () => {
		it('renders void elements as self-closing', async () => {
			const html = await renderToString(
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
		it('renders string style as-is', async () => {
			const html = await renderToString(<div style="color: blue; font-weight: bold" />);
			expect(html).toBe('<div style="color: blue; font-weight: bold"></div>');
		});

		it('serializes style object', async () => {
			const html = await renderToString(
				<div style={{ color: 'green', 'margin-top': '10px', padding: '5px' }} />,
			);
			expect(html).toBe('<div style="color:green;margin-top:10px;padding:5px"></div>');
		});
	});

	describe('doctype', () => {
		it('prepends DOCTYPE for html root element', async () => {
			const html = await renderToString(
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

		it('does not prepend DOCTYPE for non-html root', async () => {
			const html = await renderToString(
				<div>
					<html>not a root</html>
				</div>,
			);
			expect(html).toBe('<div><html>not a root</html></div>');
		});
	});

	describe('head hoisting', () => {
		it('hoists title elements to head', async () => {
			const html = await renderToString(
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

		it('hoists meta elements to head', async () => {
			const html = await renderToString(
				<div>
					<meta name="description" content="test page" />
					<h1>hello</h1>
				</div>,
			);
			expect(html).toBe(
				'<head><meta name="description" content="test page"></head><div><h1>hello</h1></div>',
			);
		});

		it('hoists link elements to head', async () => {
			const html = await renderToString(
				<div>
					<link rel="stylesheet" href="/styles.css" />
					<p>content</p>
				</div>,
			);
			expect(html).toBe('<head><link rel="stylesheet" href="/styles.css"></head><div><p>content</p></div>');
		});

		it('collects multiple head elements', async () => {
			const html = await renderToString(
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

		it('hoists head elements from components', async () => {
			function SEO() {
				return (
					<>
						<title>component title</title>
						<meta name="description" content="component description" />
					</>
				);
			}

			const html = await renderToString(
				<div>
					<SEO />
					<main>content</main>
				</div>,
			);
			expect(html).toBe(
				'<head><title>component title</title><meta name="description" content="component description"></head><div><main>content</main></div>',
			);
		});

		it('merges head elements with existing head tag', async () => {
			const html = await renderToString(
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

		it('does not hoist script tags', async () => {
			const html = await renderToString(
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
		it('provides and consumes context via use()', async () => {
			const ThemeContext = createContext('light');

			function ThemedButton() {
				const theme = use(ThemeContext);
				return <button class={theme}>click</button>;
			}

			const html = await renderToString(
				<ThemeContext.Provider value="dark">
					<ThemedButton />
				</ThemeContext.Provider>,
			);
			expect(html).toBe('<button class="dark">click</button>');
		});

		it('returns default value when no provider', async () => {
			const CountContext = createContext(0);

			function Counter() {
				const count = use(CountContext);
				return <span>{count}</span>;
			}

			const html = await renderToString(<Counter />);
			expect(html).toBe('<span>0</span>');
		});

		it('provides nested context', async () => {
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

			const html = await renderToString(
				<ThemeContext.Provider value="dark">
					<UserContext.Provider value="alice">
						<Display />
					</UserContext.Provider>
				</ThemeContext.Provider>,
			);
			expect(html).toBe('<p>alice uses dark</p>');
		});

		it('overrides context in nested providers', async () => {
			const ThemeContext = createContext('light');

			function ThemedText() {
				const theme = use(ThemeContext);
				return <span>{theme}</span>;
			}

			const html = await renderToString(
				<ThemeContext.Provider value="dark">
					<div>
						<ThemedText />
						<ThemeContext.Provider value="blue">
							<ThemedText />
						</ThemeContext.Provider>
						<ThemedText />
					</div>
				</ThemeContext.Provider>,
			);
			expect(html).toBe('<div><span>dark</span><span>blue</span><span>dark</span></div>');
		});
	});

	describe('suspense', () => {
		it('renders children synchronously when no suspension', async () => {
			const html = await renderToString(
				<Suspense fallback={<div>loading...</div>}>
					<div>content</div>
				</Suspense>,
			);
			expect(html).toBe('<div>content</div>');
		});

		it('renders fallback then streams resolved content', async () => {
			const { promise, resolve } = Promise.withResolvers<string>();

			function AsyncComponent() {
				const data = use(promise);
				return <div>{data}</div>;
			}

			const stream = renderToStream(
				<Suspense fallback={<div>loading...</div>}>
					<AsyncComponent />
				</Suspense>,
			);

			// resolve before reading
			resolve('loaded!');

			const html = await drain(stream);
			expect(html).toBe(
				'<!--$s:s1--><div>loading...</div><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div>loaded!</div></template>' +
					SUSPENSE_CALL,
			);
		});

		it('streams fragment with multiple top-level elements', async () => {
			const { promise, resolve } = Promise.withResolvers<string>();

			function AsyncComponent() {
				const data = use(promise);
				return (
					<>
						<h1>{data}</h1>
						<p>paragraph one</p>
						<p>paragraph two</p>
					</>
				);
			}

			const stream = renderToStream(
				<Suspense fallback={<div>loading...</div>}>
					<AsyncComponent />
				</Suspense>,
			);

			resolve('title');

			const html = await drain(stream);
			expect(html).toBe(
				'<!--$s:s1--><div>loading...</div><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><h1>title</h1><p>paragraph one</p><p>paragraph two</p></template>' +
					SUSPENSE_CALL,
			);
		});

		it('streams with fragment fallback', async () => {
			const { promise, resolve } = Promise.withResolvers<string>();

			function AsyncComponent() {
				const data = use(promise);
				return <div>{data}</div>;
			}

			const stream = renderToStream(
				<Suspense
					fallback={
						<>
							<div>loading...</div>
							<div>please wait</div>
						</>
					}
				>
					<AsyncComponent />
				</Suspense>,
			);

			resolve('done');

			const html = await drain(stream);
			expect(html).toBe(
				'<!--$s:s1--><div>loading...</div><div>please wait</div><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div>done</div></template>' +
					SUSPENSE_CALL,
			);
		});

		it('injects runtime once for multiple suspense boundaries', async () => {
			const { promise: p1, resolve: r1 } = Promise.withResolvers<string>();
			const { promise: p2, resolve: r2 } = Promise.withResolvers<string>();

			function Async1() {
				return <div>{use(p1)}</div>;
			}
			function Async2() {
				return <span>{use(p2)}</span>;
			}

			const stream = renderToStream(
				<>
					<Suspense fallback={<div>loading 1</div>}>
						<Async1 />
					</Suspense>
					<Suspense fallback={<div>loading 2</div>}>
						<Async2 />
					</Suspense>
				</>,
			);

			r1('first');
			r2('second');

			const html = await drain(stream);
			expect(html).toBe(
				'<!--$s:s1--><div>loading 1</div><!--/$s:s1-->' +
					'<!--$s:s2--><div>loading 2</div><!--/$s:s2-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div>first</div></template>' +
					SUSPENSE_CALL +
					'<template data-suspense="s2"><span>second</span></template>' +
					SUSPENSE_CALL,
			);
		});

		it('use() returns cached value on subsequent calls', async () => {
			const promise = Promise.resolve('cached');

			function AsyncComponent() {
				const data = use(promise);
				return <div>{data}</div>;
			}

			// first call sets up caching and throws - catch it
			try {
				use(promise);
			} catch {
				// expected - promise thrown
			}

			// wait for promise to resolve and cache
			await promise;

			const html = await renderToString(<AsyncComponent />);
			expect(html).toBe('<div>cached</div>');
		});

		it('use() throws rejected promise error', async () => {
			const error = new Error('failed!');
			const promise = Promise.reject(error);

			function AsyncComponent() {
				const data = use(promise);
				return <div>{data}</div>;
			}

			// first call sets up caching and throws - catch it
			try {
				use(promise);
			} catch {
				// expected - promise thrown
			}

			// let the promise settle and cache the rejection
			await promise.catch(() => {});

			try {
				await renderToString(<AsyncComponent />);
				expect(true).toBe(false); // should not reach here
			} catch (e) {
				expect(e).toBe(error);
			}
		});

		it('component throwing multiple sequential promises', async () => {
			const { promise: p1, resolve: r1 } = Promise.withResolvers<string>();
			const { promise: p2, resolve: r2 } = Promise.withResolvers<string>();

			let callCount = 0;
			function MultiAsyncComponent() {
				callCount++;
				const first = use(p1);
				const second = use(p2);
				return (
					<div>
						{first} {second}
					</div>
				);
			}

			const stream = renderToStream(
				<Suspense fallback={<span>loading...</span>}>
					<MultiAsyncComponent />
				</Suspense>,
			);

			// resolve first promise, component will re-render and throw second
			r1('hello');
			await Promise.resolve();

			// resolve second promise, component will complete
			r2('world');

			const html = await drain(stream);
			expect(html).toBe(
				'<!--$s:s1--><span>loading...</span><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div>hello world</div></template>' +
					SUSPENSE_CALL,
			);
			// component should be called multiple times as it re-renders after each promise
			expect(callCount).toBeGreaterThan(1);
		});

		it('parallel renders have isolated context', async () => {
			const ThemeContext = createContext('default');

			function ThemedComponent() {
				const theme = use(ThemeContext);
				return <div class={theme}>content</div>;
			}

			// run two renders in parallel with different context values
			const [html1, html2] = await Promise.all([
				renderToString(
					<ThemeContext.Provider value="dark">
						<ThemedComponent />
					</ThemeContext.Provider>,
				),
				renderToString(
					<ThemeContext.Provider value="light">
						<ThemedComponent />
					</ThemeContext.Provider>,
				),
			]);

			expect(html1).toBe('<div class="dark">content</div>');
			expect(html2).toBe('<div class="light">content</div>');
		});

		it('parallel renders with suspense have isolated context', async () => {
			const ThemeContext = createContext('default');
			const { promise: p1, resolve: r1 } = Promise.withResolvers<string>();
			const { promise: p2, resolve: r2 } = Promise.withResolvers<string>();

			function AsyncThemedComponent({ promise }: { promise: Promise<string> }) {
				const theme = use(ThemeContext);
				const data = use(promise);
				return <div class={theme}>{data}</div>;
			}

			// start both renders
			const render1 = renderToString(
				<ThemeContext.Provider value="dark">
					<Suspense fallback={<span>loading dark...</span>}>
						<AsyncThemedComponent promise={p1} />
					</Suspense>
				</ThemeContext.Provider>,
			);

			const render2 = renderToString(
				<ThemeContext.Provider value="light">
					<Suspense fallback={<span>loading light...</span>}>
						<AsyncThemedComponent promise={p2} />
					</Suspense>
				</ThemeContext.Provider>,
			);

			// resolve in reverse order to test isolation
			r2('second');
			r1('first');

			const [html1, html2] = await Promise.all([render1, render2]);

			expect(html1).toBe(
				'<!--$s:s1--><span>loading dark...</span><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div class="dark">first</div></template>' +
					SUSPENSE_CALL,
			);
			expect(html2).toBe(
				'<!--$s:s1--><span>loading light...</span><!--/$s:s1-->' +
					SUSPENSE_RUNTIME +
					'<template data-suspense="s1"><div class="light">second</div></template>' +
					SUSPENSE_CALL,
			);
		});
	});
});
