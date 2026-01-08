import { Fragment, jsx } from '../jsx-runtime.ts';

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

/** stack of context frames */
type ContextFrame = Map<Context<unknown>, unknown>;
const contextStack: ContextFrame[] = [];

/** current frame being built (lazily initialized on first provide) */
export let currentFrame: ContextFrame | null = null;

/**
 * provides a value for the context during the current component's render
 * @param context context key from createContext()
 * @param value value to provide
 */
export function provide<T>(context: Context<T>, value: T): void {
	if (!currentFrame) {
		// lazily create frame, copying from previous
		const prev = contextStack[contextStack.length - 1];
		currentFrame = prev ? new Map(prev) : new Map();
	}
	currentFrame.set(context as Context<unknown>, value);
}

/**
 * returns current provided value, or the default value
 * @param context context key from createContext()
 */
export function inject<T>(context: Context<T>): T {
	// check current frame first, then stack
	const frame = currentFrame ?? contextStack[contextStack.length - 1];
	if (frame?.has(context as Context<unknown>)) {
		return frame.get(context as Context<unknown>) as T;
	}
	return context.defaultValue;
}

/** push current frame to stack (called before rendering children) */
export function pushContextFrame(): void {
	if (currentFrame) {
		contextStack.push(currentFrame);
		currentFrame = null;
	}
}

/** pop context frame (called after rendering children) */
export function popContextFrame(hadFrame: boolean): void {
	if (hadFrame) {
		contextStack.pop();
	}
	currentFrame = null;
}
