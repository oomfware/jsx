import type { JSX } from './intrinsic-elements.ts';
import type { Component, JSXElement, JSXNode } from './types.ts';

// #region createElement

/**
 * creates a JSX element for an intrinsic element
 * @param type element tag name
 * @param props element properties
 * @param children child elements
 * @returns JSX element
 */
export function createElement<T extends keyof JSX.IntrinsicElements>(
	type: T,
	props?: JSX.IntrinsicElements[T] | null,
	...children: JSXNode[]
): JSXElement<JSX.IntrinsicElements[T], T>;

/**
 * creates a JSX element for a function component
 * @param type component function
 * @param props component properties
 * @param children child elements
 * @returns JSX element
 */
export function createElement<P extends {}>(
	type: Component<P>,
	props?: P | null,
	...children: JSXNode[]
): JSXElement<P, Component<P>>;

/**
 * creates a JSX element (classic API)
 * @param type element tag name or component function
 * @param props element properties
 * @param children child elements
 * @returns JSX element
 */
export function createElement<P extends {}>(
	type: string | Component<P>,
	props?: P | null,
	...children: JSXNode[]
): JSXElement<P>;

export function createElement(
	type: string | Component<any>,
	props?: Record<string, unknown> | null,
	...children: JSXNode[]
): JSXElement {
	const finalProps: Record<string, unknown> = { ...props };

	if (children.length === 1) {
		finalProps.children = children[0];
	} else if (children.length > 1) {
		finalProps.children = children;
	}

	return { type, props: finalProps };
}

// #endregion

// #region cloneElement

/**
 * clones a JSX element for an intrinsic element with new props
 * @param element element to clone
 * @param props props to merge (overrides original)
 * @param children children to replace (if provided)
 * @returns cloned JSX element
 */
export function cloneElement<T extends keyof JSX.IntrinsicElements>(
	element: JSXElement<JSX.IntrinsicElements[T], T>,
	props?: Partial<JSX.IntrinsicElements[T]> | null,
	...children: JSXNode[]
): JSXElement<JSX.IntrinsicElements[T], T>;

/**
 * clones a JSX element for a function component with new props
 * @param element element to clone
 * @param props props to merge (overrides original)
 * @param children children to replace (if provided)
 * @returns cloned JSX element
 */
export function cloneElement<P extends {}>(
	element: JSXElement<P, Component<P>>,
	props?: Partial<P> | null,
	...children: JSXNode[]
): JSXElement<P, Component<P>>;

/**
 * clones a JSX element with new props
 * @param element element to clone
 * @param props props to merge (overrides original)
 * @param children children to replace (if provided)
 * @returns cloned JSX element
 */
export function cloneElement<P extends {}>(
	element: JSXElement<P>,
	props?: Partial<P> | null,
	...children: JSXNode[]
): JSXElement<P>;

export function cloneElement(
	element: JSXElement,
	props?: Record<string, unknown> | null,
	...children: JSXNode[]
): JSXElement {
	const finalProps: Record<string, unknown> = { ...(element.props as Record<string, unknown>), ...props };

	if (children.length === 1) {
		finalProps.children = children[0];
	} else if (children.length > 1) {
		finalProps.children = children;
	}

	return { type: element.type, props: finalProps };
}

// #endregion
