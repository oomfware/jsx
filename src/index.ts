export type { Component, FC, JSXElement, JSXNode } from './lib/types.js';
export type { HTMLAttributes, JSX, SVGAttributes } from './lib/intrinsic-elements.js';

export { Fragment } from './jsx-runtime.js';

export { cloneElement, createElement, createElement as h } from './lib/create-element.js';

export { createContext, type Context } from './lib/context.js';

export {
	ErrorBoundary,
	type ErrorBoundaryProps,
	Suspense,
	type SuspenseProps,
	use,
} from './lib/suspense.js';

export { render, renderToStream, renderToString, type RenderOptions } from './lib/render.js';
