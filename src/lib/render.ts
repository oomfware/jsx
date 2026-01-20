/**
 * streaming JSX renderer
 *
 * architecture:
 * - segment tree: we build a tree of segments (static text, composites, suspense
 *   boundaries) then serialize to HTML
 * - suspense: components can throw promises via use(), caught at Suspense boundaries
 *   which render fallback immediately and stream resolved content later
 * - head hoisting: <title>, <meta>, <link>, <style> found outside <head> are
 *   collected and injected into <head> during finalization
 */

import { decodeUtf8From, encodeUtf8 } from '@atcute/uint8array';

import { Fragment } from '../jsx-runtime.ts';

import { cn } from './cn.ts';
import {
	popContextFrame,
	pushContextFrame,
	setActiveRenderContext,
	type RenderContext,
	type Segment,
} from './render-context.ts';
import { ErrorBoundary, Suspense, type ErrorBoundaryProps, type SuspenseProps } from './suspense.ts';
import type { Component, JSXElement, JSXNode } from './types.ts';

const HEAD_ELEMENTS = new Set(['title', 'meta', 'link', 'style']);
const MAX_SUSPENSE_ATTEMPTS = 20;
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
/** props that shouldn't be rendered as HTML attributes */
const FRAMEWORK_PROPS = new Set(['children', 'dangerouslySetInnerHTML']);

// #region Segment helpers

function staticSeg(html: string): Segment {
	return { kind: 'static', html };
}

function compositeSeg(parts: Segment[]): Segment {
	return { kind: 'composite', parts };
}

const EMPTY_SEGMENT = staticSeg('');

// #endregion

export interface RenderOptions {
	onError?: (error: unknown) => void;
}

/**
 * renders JSX to a readable stream
 * @param node JSX node to render
 * @param options render options
 * @returns readable stream of UTF-8 encoded HTML
 */
export function renderToStream(node: JSXNode, options?: RenderOptions): ReadableStream<Uint8Array> {
	const onError = options?.onError ?? ((error) => console.error(error));
	const context: RenderContext = {
		contextStack: [],
		currentFrame: null,
		headElements: [],
		idsByPath: new Map(),
		insideHead: false,
		insideSvg: false,
		onError,
		pendingSuspense: [],
	};

	return new ReadableStream({
		async start(controller) {
			try {
				const root = buildSegment(node, context, '');
				await resolveBlocking(root);

				const html = serializeSegment(root);
				const finalHtml = finalizeHtml(html, context);
				controller.enqueue(encodeUtf8(finalHtml));

				// stream pending suspense boundaries as they resolve
				if (context.pendingSuspense.length > 0) {
					await streamPendingSuspense(context, controller);
				}

				controller.close();
			} catch (error) {
				onError(error);
				controller.error(error);
			}
		},
	});
}

/**
 * renders JSX to a string (non-streaming)
 * @param node JSX node to render
 * @param options render options
 * @returns promise resolving to HTML string
 */
export async function renderToString(node: JSXNode, options?: RenderOptions): Promise<string> {
	const stream = renderToStream(node, options);
	const reader = stream.getReader();

	let html = '';
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}

		html += decodeUtf8From(value);
	}

	return html;
}

/**
 * renders JSX to a streaming Response
 * @param node JSX node to render
 * @param init optional ResponseInit (status, headers, etc.)
 * @returns Response with streaming HTML body
 */
export function render(node: JSXNode, init?: ResponseInit): Response {
	const stream = renderToStream(node);

	// @ts-expect-error: not sure why.
	const headers = new Headers(init?.headers);
	if (!headers.has('Content-Type')) {
		headers.set('Content-Type', 'text/html; charset=utf-8');
	}

	return new Response(stream, { ...init, headers });
}

// #region Segment building

function isJSXElement(node: unknown): node is JSXElement {
	return typeof node === 'object' && node !== null && 'type' in node && 'props' in node;
}

function isHeadElement(tag: string): boolean {
	return HEAD_ELEMENTS.has(tag);
}

function buildSegment(node: JSXNode, ctx: RenderContext, path: string): Segment {
	const prev = setActiveRenderContext(ctx);
	try {
		return buildSegmentInner(node, ctx, path);
	} finally {
		setActiveRenderContext(prev);
	}
}

function buildSegmentInner(node: JSXNode, context: RenderContext, path: string): Segment {
	// primitives
	if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
		return staticSeg(escapeHtml(node, false));
	}
	if (node === null || node === undefined || typeof node === 'boolean') {
		return EMPTY_SEGMENT;
	}
	// iterables (arrays, generators, etc.)
	if (typeof node === 'object' && Symbol.iterator in node) {
		const parts: Segment[] = [];
		for (const child of node) {
			parts.push(buildSegmentInner(child, context, path));
		}
		return compositeSeg(parts);
	}
	// JSX elements
	if (isJSXElement(node)) {
		const { type, props } = node;
		// Fragment
		if (type === Fragment) {
			const children = (props as { children?: JSXNode }).children;
			return children != null ? buildSegmentInner(children, context, path) : EMPTY_SEGMENT;
		}
		// intrinsic elements (HTML tags)
		if (typeof type === 'string') {
			const tag = type;

			if (tag === 'head') {
				return buildHeadElementSegment(tag, props as Record<string, unknown>, context, path);
			}

			if (!context.insideHead && isHeadElement(tag)) {
				// hoist to <head>
				const elementSeg = buildElementSegment(tag, props as Record<string, unknown>, context, path);
				context.headElements.push(serializeSegment(elementSeg));
				return EMPTY_SEGMENT;
			}

			return buildElementSegment(tag, props as Record<string, unknown>, context, path);
		}
		// function components
		if (typeof type === 'function') {
			// Suspense boundary
			if (type === Suspense) {
				return buildSuspenseSegment(props as unknown as SuspenseProps, context, path);
			}
			// ErrorBoundary
			if (type === ErrorBoundary) {
				return buildErrorBoundarySegment(props as unknown as ErrorBoundaryProps, context, path);
			}
			return buildComponentSegment(type, props as Record<string, unknown>, context, path);
		}
	}
	return EMPTY_SEGMENT;
}

// #endregion

// #region Element building

function buildElementSegment(
	tag: string,
	props: Record<string, unknown>,
	context: RenderContext,
	path: string,
): Segment {
	const currentIsSvg = context.insideSvg || tag === 'svg';
	const attrs = renderAttributes(props);
	// self-closing tags
	if (SELF_CLOSING_TAGS.has(tag)) {
		return staticSeg(`<${tag}${attrs}>`);
	}
	// dangerouslySetInnerHTML
	const innerHTML = props.dangerouslySetInnerHTML as { __html: string } | undefined;
	if (innerHTML) {
		return staticSeg(`<${tag}${attrs}>${innerHTML.__html}</${tag}>`);
	}
	// normal element with children
	const open = staticSeg(`<${tag}${attrs}>`);
	const previousInsideSvg = context.insideSvg;
	context.insideSvg = tag === 'foreignObject' ? false : currentIsSvg;
	const children =
		props.children != null ? buildSegment(props.children as JSXNode, context, path) : EMPTY_SEGMENT;
	context.insideSvg = previousInsideSvg;
	const close = staticSeg(`</${tag}>`);
	return compositeSeg([open, children, close]);
}

function buildHeadElementSegment(
	tag: string,
	props: Record<string, unknown>,
	context: RenderContext,
	path: string,
): Segment {
	const attrs = renderAttributes(props);
	const previousInsideHead = context.insideHead;
	context.insideHead = true;
	const open = staticSeg(`<${tag}${attrs}>`);
	const children =
		props.children != null ? buildSegment(props.children as JSXNode, context, path) : EMPTY_SEGMENT;
	context.insideHead = previousInsideHead;
	const close = staticSeg(`</${tag}>`);
	return compositeSeg([open, children, close]);
}

function renderAttributes(props: Record<string, unknown>): string {
	let attrs = '';
	for (const key in props) {
		if (FRAMEWORK_PROPS.has(key)) {
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
				attrs = ` class="${escapeHtml(value, true)}"`;
				continue;
			}

			const str = cn(value);
			if (str) {
				attrs += ` class="${escapeHtml(str, true)}"`;
			}
			continue;
		}

		if (key === 'style') {
			if (typeof value !== 'object') {
				attrs += ` style="${escapeHtml(value, true)}"`;
				continue;
			}

			let str = '';
			let val;

			for (const key in value) {
				if ((val = (value as any)[key]) != null) {
					str = str ? str + '; ' + key + ':' + val : key + ':' + val;
				}
			}

			if (str) {
				attrs += ` style="${escapeHtml(str, true)}"`;
			}

			continue;
		}

		if (value === true) {
			attrs += ` ${key}`;
		} else {
			attrs += ` ${key}="${escapeHtml(value, true)}"`;
		}
	}
	return attrs;
}

// #endregion

// #region Component building

function buildComponentSegment(
	type: Component,
	props: Record<string, unknown>,
	ctx: RenderContext,
	path: string,
): Segment {
	// call component
	const result = type(props);
	// if component called provide(), push frame before rendering children
	const hadFrame = pushContextFrame();
	try {
		return buildSegmentInner(result, ctx, path);
	} finally {
		popContextFrame(hadFrame);
	}
}

function buildSuspenseSegment(props: SuspenseProps, ctx: RenderContext, path: string): Segment {
	// generate unique id for this suspense boundary
	const nextIndex = (ctx.idsByPath.get(path) ?? 0) + 1;
	ctx.idsByPath.set(path, nextIndex);
	const id = path ? `${path}-${nextIndex}` : `${nextIndex}`;
	const suspenseId = `s${id}`;

	try {
		// try to render children synchronously
		const content = buildSegment(props.children, ctx, suspenseId);
		// no suspension - return content directly (no boundary needed)
		return content;
	} catch (thrown) {
		// check if it's a promise (suspension)
		if (thrown instanceof Promise) {
			// render fallback
			const fallback = buildSegment(props.fallback, ctx, suspenseId);

			// create suspense segment
			const seg: Segment = {
				kind: 'suspense',
				id: suspenseId,
				fallback,
				content: null,
			};

			// snapshot context stack for async re-render (parent frames will be popped
			// by the time the promise resolves)
			const asyncCtx: RenderContext = {
				...ctx,
				contextStack: [...ctx.contextStack],
				currentFrame: null,
			};

			// re-render function that handles subsequent promise throws
			const rerender = (attempt: number): Promise<void> | void => {
				if (attempt >= MAX_SUSPENSE_ATTEMPTS) {
					throw new Error(`suspense boundary exceeded maximum retry attempts (${MAX_SUSPENSE_ATTEMPTS})`);
				}
				try {
					seg.content = buildSegment(props.children, asyncCtx, suspenseId);
				} catch (err) {
					if (err instanceof Promise) {
						// component threw another promise - wait and retry
						return err.then(() => rerender(attempt + 1));
					}
					throw err;
				}
			};

			// set up promise to re-render children when resolved
			const pending = thrown.then(() => rerender(1));
			seg.pending = pending;

			// track for streaming
			const tracked = pending.then(() => seg.content!);
			tracked.catch(() => {}); // prevent unhandled rejection if resolveBlocking catches first
			ctx.pendingSuspense.push({ id: suspenseId, promise: tracked });

			return seg;
		}
		// not a promise - re-throw
		throw thrown;
	}
}

function buildErrorBoundarySegment(props: ErrorBoundaryProps, ctx: RenderContext, path: string): Segment {
	// snapshot context for potential async fallback rendering
	const asyncCtx: RenderContext = {
		...ctx,
		contextStack: [...ctx.contextStack],
		currentFrame: null,
	};

	try {
		const children = buildSegment(props.children, ctx, path);
		return {
			kind: 'error-boundary',
			children,
			fallbackFn: props.fallback,
			renderContext: asyncCtx,
			path,
			fallbackSegment: null,
		};
	} catch (error) {
		if (error instanceof Promise) {
			throw error; // let Suspense handle it
		}
		// sync error - render fallback immediately
		return buildSegment(props.fallback(error), ctx, path);
	}
}

// #endregion

// #region Serialization

/** resolve all blocking suspense boundaries and error boundaries */
async function resolveBlocking(segment: Segment): Promise<void> {
	if (segment.kind === 'suspense') {
		if (segment.pending) {
			await segment.pending;
			segment.pending = undefined;
		}
		if (segment.content) {
			await resolveBlocking(segment.content);
		}
		return;
	}
	if (segment.kind === 'error-boundary') {
		try {
			await resolveBlocking(segment.children);
		} catch (error) {
			segment.fallbackSegment = buildSegment(segment.fallbackFn(error), segment.renderContext, segment.path);
		}
		return;
	}
	if (segment.kind === 'composite') {
		for (const part of segment.parts) {
			await resolveBlocking(part);
		}
	}
}

/** serialize segment tree to HTML string */
function serializeSegment(seg: Segment): string {
	if (seg.kind === 'static') {
		return seg.html;
	}
	if (seg.kind === 'composite') {
		return seg.parts.map(serializeSegment).join('');
	}
	if (seg.kind === 'error-boundary') {
		return serializeSegment(seg.fallbackSegment ?? seg.children);
	}
	// suspense - always render fallback; resolved content streams in template
	return `<!--$s:${seg.id}-->${serializeSegment(seg.fallback)}<!--/$s:${seg.id}-->`;
}

// #endregion

// #region Streaming

/** suspense runtime function name */
const SR = '$sr';
/** suspense runtime - injected once, swaps template content with fallback */
const SUSPENSE_RUNTIME = `<script>${SR}=(t,i,s,e)=>{i="$s:"+t.dataset.suspense;s=document.createTreeWalker(document,128);while(e=s.nextNode())if(e.data===i){while(e.nextSibling?.data!=="/"+i)e.nextSibling.remove();e.nextSibling.replaceWith(...t.content.childNodes);e.remove();break}t.remove()}</script>`;

async function streamPendingSuspense(
	context: RenderContext,
	controller: ReadableStreamDefaultController<Uint8Array>,
): Promise<void> {
	controller.enqueue(encodeUtf8(SUSPENSE_RUNTIME));

	while (true) {
		const batch = context.pendingSuspense;
		if (batch.length === 0) {
			break;
		}
		context.pendingSuspense = [];

		await Promise.all(
			batch.map(async ({ id, promise }) => {
				let resolvedSegment: Segment;
				try {
					resolvedSegment = await promise;
				} catch {
					// promise rejected - error was caught by an error boundary
					return;
				}

				try {
					await resolveBlocking(resolvedSegment);

					const html = serializeSegment(resolvedSegment);

					controller.enqueue(
						encodeUtf8(
							`<template data-suspense="${id}">${html}</template>` +
								`<script>${SR}(document.currentScript.previousElementSibling)</script>`,
						),
					);
				} catch (error) {
					context.onError(error);
				}
			}),
		);
	}
}

// #endregion

// #region Utilities

const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;

function escapeHtml(value: unknown, isAttr: boolean): string {
	const str = String(value ?? '');
	const pattern = isAttr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;

	let escaped = '';
	let last = 0;

	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : ch === '"' ? '&quot;' : '&lt;');
		last = i + 1;
	}

	return escaped + str.substring(last);
}

function finalizeHtml(html: string, context: RenderContext): string {
	const hasHtmlRoot = html.trimStart().toLowerCase().startsWith('<html');
	// inject hoisted head elements
	if (context.headElements.length > 0) {
		const headContent = context.headElements.join('');
		if (hasHtmlRoot) {
			const headCloseIndex = html.indexOf('</head>');
			if (headCloseIndex !== -1) {
				// inject before existing </head>
				html = html.slice(0, headCloseIndex) + headContent + html.slice(headCloseIndex);
			} else {
				// no existing head, inject after <html>
				const htmlOpenMatch = html.match(/<html[^>]*>/);
				if (htmlOpenMatch && htmlOpenMatch.index !== undefined) {
					const insertIndex = htmlOpenMatch.index + htmlOpenMatch[0].length;
					html = html.slice(0, insertIndex) + `<head>${headContent}</head>` + html.slice(insertIndex);
				}
			}
		} else {
			// no HTML root, prepend head
			html = `<head>${headContent}</head>${html}`;
		}
	}
	if (hasHtmlRoot) {
		html = '<!doctype html>' + html;
	}
	return html;
}

// #endregion
