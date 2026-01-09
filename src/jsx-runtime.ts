import type { Component, JSXElement, JSXNode } from './lib/types.ts';

/**
 * creates a JSX element
 * @param type element tag name or component function
 * @param props element properties including children
 * @returns JSX element
 */
export function jsx<P, T extends string | Component<any>>(type: T, props: P): JSXElement<P, T> {
	return { type, props };
}

export { jsx as jsxs };

export function Fragment(props: { children?: JSXNode }): JSXNode {
	return props.children;
}

export type { JSX } from './lib/intrinsic-elements.js';
