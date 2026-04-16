/**
 * synchronous JSX renderer
 *
 * architecture:
 * - single-pass recursive render that builds an HTML string directly
 * - head hoisting: <title>, <meta>, <link>, <style> found outside <head> are
 *   collected and injected into <head> during finalization
 */

import { Fragment } from '../jsx-runtime.ts';

import { cn } from './cn.ts';
import { Context } from './context.ts';
import { provide, restoreProvides, setActiveRenderContext, type RenderContext } from './render-context.ts';
import { JSXElement, type Component, type JSXNode } from './types.ts';

/**
 * renders JSX to a string
 * @param node JSX node to render
 * @returns HTML string
 */
export function renderToString(node: JSXNode): string {
	const ctx: RenderContext = {
		depth: 0,
		headElements: '',
		hasHtmlRoot: false,
		insideHead: false,
		provideLog: [],
		provideCount: 0,
	};

	const prev = setActiveRenderContext(ctx);
	try {
		const html = renderNodeInner(node, ctx);
		// skip finalization when nothing to inject
		if (ctx.hasHtmlRoot || ctx.headElements) {
			return finalizeHtml(html, ctx);
		}
		return html;
	} finally {
		restoreProvides(ctx, 0);
		setActiveRenderContext(prev);
	}
}

/**
 * renders JSX to a Response
 * @param node JSX node to render
 * @param init optional ResponseInit (status, headers, etc.)
 * @returns Response with HTML body
 */
export function render(node: JSXNode, init?: ResponseInit): Response {
	const html = renderToString(node);

	// @ts-expect-error: HeadersInit mismatch between DOM and Bun type definitions
	const headers = new Headers(init?.headers);
	if (!headers.has('Content-Type')) {
		headers.set('Content-Type', 'text/html; charset=utf-8');
	}

	return new Response(html, { ...init, headers });
}

// #region Node rendering

function renderNodeInner(node: JSXNode, ctx: RenderContext): string {
	// fast path: JSX elements, arrays, and null are all objects
	if (typeof node === 'object') {
		if (node === null) {
			return '';
		}
		// JSX element — instanceof is faster than `in` or property checks
		if (node instanceof JSXElement) {
			const { type, props } = node;
			if (type === Fragment) {
				// oxlint-disable-next-line no-unsafe-type-assertion
				const children = (props as { children?: JSXNode }).children;
				return children != null ? renderNodeInner(children, ctx) : '';
			}
			if (typeof type === 'string') {
				// oxlint-disable-next-line no-unsafe-type-assertion
				return renderElement(type, props as Record<string, unknown>, ctx);
			}
			if (type instanceof Context) {
				// oxlint-disable-next-line no-unsafe-type-assertion
				return renderContextNode(type, props as Record<string, unknown>, ctx);
			}
			if (typeof type === 'function') {
				// oxlint-disable-next-line no-unsafe-type-assertion
				return renderNodeInner((type as Component)(props as Record<string, unknown>), ctx);
			}
			return '';
		}
		// arrays (most common iterable) — index loop avoids iterator overhead
		if (Array.isArray(node)) {
			let html = '';
			for (let i = 0; i < node.length; i++) {
				// oxlint-disable-next-line no-unsafe-type-assertion
				html += renderNodeInner(node[i] as JSXNode, ctx);
			}
			return html;
		}
		// non-array iterables (generators, etc.) — property access over `in`
		// oxlint-disable-next-line no-unsafe-type-assertion, no-unsafe-member-access
		if ((node as any)[Symbol.iterator]) {
			let html = '';
			for (const child of node as Iterable<JSXNode>) {
				html += renderNodeInner(child, ctx);
			}
			return html;
		}
		return '';
	}
	// string is the second most common
	if (typeof node === 'string') {
		return escapeContent(node);
	}
	// numbers never contain & or <
	if (typeof node === 'number' || typeof node === 'bigint') {
		return String(node);
	}
	// boolean, undefined
	return '';
}

// #endregion

// #region Element rendering

/** set of tags that are hoisted into <head> */
const HEAD_ELEMENTS = new Set(['title', 'meta', 'link', 'style']);

/** set of self-closing (void) HTML tags */
const SELF_CLOSING_TAGS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
]);

function renderElement(tag: string, props: Record<string, unknown>, ctx: RenderContext): string {
	if (tag === 'head') {
		const prev = ctx.insideHead;
		ctx.insideHead = true;
		const html = renderElementHtml(tag, props, ctx);
		ctx.insideHead = prev;
		return html;
	}

	if (tag === 'html' && ctx.depth === 0) {
		ctx.hasHtmlRoot = true;
	}

	if (!ctx.insideHead && HEAD_ELEMENTS.has(tag)) {
		// hoist to <head>
		ctx.headElements += renderElementHtml(tag, props, ctx);
		return '';
	}

	return renderElementHtml(tag, props, ctx);
}

function renderElementHtml(tag: string, props: Record<string, unknown>, ctx: RenderContext): string {
	const attrs = renderAttributes(props);

	// self-closing tags
	if (SELF_CLOSING_TAGS.has(tag)) {
		return '<' + tag + attrs + '>';
	}

	// dangerouslySetInnerHTML
	// oxlint-disable-next-line no-unsafe-type-assertion
	const innerHTML = props.dangerouslySetInnerHTML as { __html: string } | undefined;
	if (innerHTML) {
		return '<' + tag + attrs + '>' + innerHTML.__html + '</' + tag + '>';
	}

	// normal element with children
	ctx.depth++;
	// oxlint-disable-next-line no-unsafe-type-assertion
	const children = props.children != null ? renderNodeInner(props.children as JSXNode, ctx) : '';
	ctx.depth--;

	return '<' + tag + attrs + '>' + children + '</' + tag + '>';
}

function renderAttributes(props: Record<string, unknown>): string {
	let attrs = '';
	for (const key in props) {
		if (key === 'children' || key === 'dangerouslySetInnerHTML') {
			continue;
		}

		const value = props[key];
		if (value === undefined || value === null || value === false) {
			continue;
		}

		if (typeof value === 'function') {
			continue;
		}

		if (key === 'class') {
			if (!Array.isArray(value)) {
				attrs += ' class="' + escapeAttr(value) + '"';
				continue;
			}

			const str = cn(value);
			if (str) {
				attrs += ' class="' + escapeAttr(str) + '"';
			}
			continue;
		}

		if (key === 'style') {
			if (typeof value !== 'object') {
				attrs += ' style="' + escapeAttr(value) + '"';
				continue;
			}

			let str = '';
			let val;

			for (const prop in value) {
				// oxlint-disable-next-line no-unsafe-type-assertion
				if ((val = (value as Record<string, unknown>)[prop]) != null) {
					// oxlint-disable-next-line no-base-to-string -- CSS values are strings/numbers
					str = str ? str + '; ' + prop + ':' + val : prop + ':' + val;
				}
			}

			if (str) {
				attrs += ' style="' + escapeAttr(str) + '"';
			}

			continue;
		}

		if (value === true) {
			attrs += ' ' + key;
		} else {
			attrs += ' ' + key + '="' + escapeAttr(value) + '"';
		}
	}
	return attrs;
}

// #endregion

// #region Context rendering

function renderContextNode(
	context: Context<unknown>,
	props: Record<string, unknown>,
	ctx: RenderContext,
): string {
	const savedCount = ctx.provideCount;
	provide(context, props.value);
	try {
		// oxlint-disable-next-line no-unsafe-type-assertion
		return props.children != null ? renderNodeInner(props.children as JSXNode, ctx) : '';
	} finally {
		restoreProvides(ctx, savedCount);
	}
}

// #endregion

// #region Utilities

/** escapes & and < for text content */
function escapeContent(str: string): string {
	const len = str.length;
	let start = 0;
	let escaped = '';

	for (let i = 0; i < len; i++) {
		const ch = str.charCodeAt(i);
		if (ch === 38) {
			// &
			escaped += str.substring(start, i) + '&amp;';
			start = i + 1;
		} else if (ch === 60) {
			// <
			escaped += str.substring(start, i) + '&lt;';
			start = i + 1;
		}
	}

	if (start === 0) {
		return str;
	}
	return escaped + str.substring(start);
}

/** escapes & and " for attribute values */
function escapeAttr(value: unknown): string {
	// oxlint-disable-next-line no-base-to-string -- intentional; callers ensure stringifiable values
	const str = typeof value === 'string' ? value : String(value ?? '');
	const len = str.length;
	let start = 0;
	let escaped = '';

	for (let i = 0; i < len; i++) {
		const ch = str.charCodeAt(i);
		if (ch === 38) {
			// &
			escaped += str.substring(start, i) + '&amp;';
			start = i + 1;
		} else if (ch === 34) {
			// "
			escaped += str.substring(start, i) + '&quot;';
			start = i + 1;
		}
	}

	if (start === 0) {
		return str;
	}
	return escaped + str.substring(start);
}

function finalizeHtml(html: string, ctx: RenderContext): string {
	// inject hoisted head elements
	if (ctx.headElements) {
		if (ctx.hasHtmlRoot) {
			const headCloseIndex = html.indexOf('</head>');
			if (headCloseIndex !== -1) {
				// inject before existing </head>
				html = html.slice(0, headCloseIndex) + ctx.headElements + html.slice(headCloseIndex);
			} else {
				// no existing head, inject after <html...>
				const htmlTagStart = html.indexOf('<html');
				if (htmlTagStart !== -1) {
					const tagEnd = html.indexOf('>', htmlTagStart + 5);
					if (tagEnd !== -1) {
						const insertIndex = tagEnd + 1;
						html =
							html.slice(0, insertIndex) + '<head>' + ctx.headElements + '</head>' + html.slice(insertIndex);
					}
				}
			}
		} else {
			// no HTML root, prepend head
			html = '<head>' + ctx.headElements + '</head>' + html;
		}
	}
	if (ctx.hasHtmlRoot) {
		html = '<!doctype html>' + html;
	}
	return html;
}

// #endregion
