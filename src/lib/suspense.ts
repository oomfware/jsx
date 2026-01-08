import { Fragment, jsx } from '../jsx-runtime.js';

import { inject, type Context } from './context.js';
import type { JSXElement, JSXNode } from './types.js';

export interface SuspenseProps {
	fallback: JSXNode;
	children?: JSXNode;
}

/**
 * suspense boundary - renders fallback while children are suspended
 */
export function Suspense({ children }: SuspenseProps): JSXElement {
	// Suspense is handled specially in buildSegment, this is just for typing
	return jsx(Fragment, { children });
}

/** cache for resolved/rejected promise values */
const promiseCache = new WeakMap<
	Promise<unknown>,
	{ resolved: true; value: unknown } | { resolved: false; error: unknown }
>();

function isContext<T>(value: unknown): value is Context<T> {
	return typeof value === 'object' && value !== null && 'defaultValue' in value && 'Provider' in value;
}

/**
 * reads a context value or suspends until a promise resolves
 * @param usable context or promise
 * @returns context value or resolved promise value
 * @throws promise if not yet resolved, or error if rejected
 */
export function use<T>(usable: Context<T>): T;
export function use<T>(usable: Promise<T>): T;
export function use<T>(usable: Context<T> | Promise<T>): T {
	// context
	if (isContext<T>(usable)) {
		return inject(usable);
	}
	// promise
	const cached = promiseCache.get(usable);
	if (cached) {
		if (cached.resolved) {
			return cached.value as T;
		} else {
			throw cached.error;
		}
	}
	// not cached yet - set up caching and throw
	usable.then(
		(value) => promiseCache.set(usable, { resolved: true, value }),
		(error) => promiseCache.set(usable, { resolved: false, error }),
	);
	throw usable;
}
