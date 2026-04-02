/**
 * core JSX types, modeled after React's type definitions
 */

// #region Component types

/** function component */
export type Component<P = {}> = (props: P) => JSXNode;

/** function component (alias for Component) */
export type FC<P = {}> = Component<P>;

// #endregion

// #region JSXElement

/**
 * virtual element representing a JSX element
 * @template P props type
 * @template T element type (tag string or component)
 */
export class JSXElement<P = unknown, T extends string | Component<any> = string | Component<any>> {
	type: T;
	props: P;

	constructor(type: T, props: P) {
		this.type = type;
		this.props = props;
	}
}

// #endregion

// #region JSXNode (children)

/**
 * valid JSX child types - anything that can appear as children
 * modeled after React's ReactNode
 */
export type JSXNode = JSXElement | string | number | bigint | boolean | null | undefined | Iterable<JSXNode>;

// #endregion
