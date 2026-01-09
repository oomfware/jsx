import { Fragment, jsx } from '../jsx-runtime.ts';

import { provide } from './render-context.ts';
import type { JSXElement, JSXNode } from './types.ts';

/** context object returned by createContext() */
export interface Context<T> {
	defaultValue: T;
	Provider: (props: { value: T; children?: JSXNode }) => JSXElement;
}

/** internal provider props */
interface ProviderProps<T> {
	context: Context<T>;
	value: T;
	children?: JSXNode;
}

/** internal provider component */
function Provider<T>({ context, value, children }: ProviderProps<T>): JSXElement {
	provide(context, value);
	return jsx(Fragment, { children });
}

/**
 * creates a context with a Provider component
 * @param defaultValue value returned by use() when no Provider is above
 * @example
 * const ThemeContext = createContext('light');
 *
 * <ThemeContext.Provider value="dark">
 *   <App />
 * </ThemeContext.Provider>
 *
 * function App() {
 *   const theme = use(ThemeContext);
 *   return <div>{theme}</div>;
 * }
 */
export function createContext<T>(defaultValue: T): Context<T>;
export function createContext<T>(): Context<T | undefined>;
export function createContext<T>(defaultValue?: T): Context<T | undefined> {
	const context: Context<T | undefined> = {
		defaultValue,
		Provider: ({ value, children }) => Provider({ context, value, children }),
	};

	return context;
}
