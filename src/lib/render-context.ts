import { Context } from './context.ts';

/** render context passed through the render tree */
export interface RenderContext {
	/** current element nesting depth */
	depth: number;
	headElements: string;
	/** whether the root element is an <html> tag */
	hasHtmlRoot: boolean;
	insideHead: boolean;
	/** log of provided contexts for undo after component render */
	provideLog: Context<unknown>[];
	provideCount: number;
}

/** active render context (set by renderer) */
let activeRenderContext: RenderContext | null = null;

/**
 * sets the active render context
 * @param ctx render context to activate, or null to clear
 * @returns the previous render context
 */
export function setActiveRenderContext(ctx: RenderContext | null): RenderContext | null {
	const prev = activeRenderContext;
	activeRenderContext = ctx;
	return prev;
}

// #region Context value stacks
//
// each Context object has an internal `_stack` array.
// provide() pushes to it, inject() peeks, and restoreProvides() pops.

/**
 * provides a value for the context during the current component's render.
 * logs to the render context first — throws if called outside of render.
 * @param context context key from createContext()
 * @param value value to provide
 */
export function provide<T>(context: Context<T>, value: T): void {
	const rctx = activeRenderContext!;
	// oxlint-disable-next-line no-unsafe-type-assertion
	rctx.provideLog[rctx.provideCount++] = context as Context<unknown>;
	context._stack.push(value);
}

/**
 * returns current provided value, or the default value
 * @param context context key from createContext()
 */
export function inject<T>(context: Context<T>): T {
	const stack = context._stack;
	return stack.length > 0 ? stack[stack.length - 1] : context.defaultValue;
}

/**
 * undoes provides back to a previous count
 * @param rctx the active render context
 * @param savedCount the provideCount snapshot to restore to
 */
export function restoreProvides(rctx: RenderContext, savedCount: number): void {
	while (rctx.provideCount > savedCount) {
		rctx.provideLog[--rctx.provideCount]._stack.pop();
	}
}

// #endregion
