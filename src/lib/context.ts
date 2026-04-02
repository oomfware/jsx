import { inject } from './render-context.ts';
import type { JSXElement, JSXNode } from './types.ts';

/**
 * context object created by createContext().
 * usable directly as a JSX component: `<MyContext value={...}>`.
 */
// oxlint-disable-next-line no-unsafe-declaration-merging
export class Context<T> {
	/** @internal */
	_stack: T[];
	readonly defaultValue: T;

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue;
		this._stack = [];
	}
}

// declaration merging: gives Context a call signature so TypeScript treats
// instances as valid JSX component types. the renderer handles them via
// instanceof, not by calling them — same trick React 19 uses.
// oxlint-disable-next-line no-unsafe-declaration-merging
export interface Context<T> {
	(props: { value: T; children?: JSXNode }): JSXElement;
}

/**
 * creates a context usable as a JSX component
 * @param defaultValue value returned by use() when no provider is above
 * @example
 * const ThemeContext = createContext('light');
 *
 * <ThemeContext value="dark">
 *   <App />
 * </ThemeContext>
 *
 * function App() {
 *   const theme = use(ThemeContext);
 *   return <div>{theme}</div>;
 * }
 */
export function createContext<T>(defaultValue: T): Context<T>;
export function createContext<T>(): Context<T | undefined>;
export function createContext<T>(defaultValue?: T): Context<T | undefined> {
	return new Context(defaultValue);
}

/**
 * reads a context value
 * @param context context key from createContext()
 * @returns the provided value, or the default value if no provider is above
 */
export function use<T>(context: Context<T>): T {
	return inject(context);
}
