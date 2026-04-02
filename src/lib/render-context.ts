import type { Context } from './context.ts';
import type { JSXNode } from './types.ts';

/** stack of context frames */
type ContextFrame = Map<Context<unknown>, unknown>;

// #region Segment types

export type Segment =
	| {
			readonly kind: 'static';
			readonly html: string;
	  }
	| {
			readonly kind: 'composite';
			readonly parts: readonly Segment[];
	  }
	| {
			readonly kind: 'suspense';
			readonly id: string;
			readonly fallback: Segment;
			pending?: Promise<void>;
			content: Segment | null;
	  }
	| {
			readonly kind: 'error-boundary';
			readonly children: Segment;
			readonly fallbackFn: (error: unknown) => JSXNode;
			readonly renderContext: RenderContext;
			readonly path: string;
			fallbackSegment: Segment | null;
	  };

// #endregion

/** render context passed through the render tree */
export interface RenderContext {
	contextStack: ContextFrame[];
	currentFrame: ContextFrame | null;
	headElements: string[];
	idsByPath: Map<string, number>;
	insideHead: boolean;
	insideSvg: boolean;
	onError: (error: unknown) => void;
	pendingSuspense: Array<{ id: string; promise: Promise<Segment> }>;
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

/**
 * provides a value for the context during the current component's render
 * @param context context key from createContext()
 * @param value value to provide
 */
export function provide<T>(context: Context<T>, value: T): void {
	const ctx = activeRenderContext!;
	if (!ctx.currentFrame) {
		// lazily create frame, copying from previous
		const prev = ctx.contextStack[ctx.contextStack.length - 1];
		ctx.currentFrame = prev ? new Map(prev) : new Map();
	}
	// oxlint-disable-next-line no-unsafe-type-assertion
	ctx.currentFrame.set(context as Context<unknown>, value);
}

/**
 * returns current provided value, or the default value
 * @param context context key from createContext()
 */
export function inject<T>(context: Context<T>): T {
	const ctx = activeRenderContext!;
	// check current frame first, then stack
	const frame = ctx.currentFrame ?? ctx.contextStack[ctx.contextStack.length - 1];
	// oxlint-disable-next-line no-unsafe-type-assertion
	if (frame?.has(context as Context<unknown>)) {
		// oxlint-disable-next-line no-unsafe-type-assertion
		return frame.get(context as Context<unknown>) as T;
	}
	return context.defaultValue;
}

/**
 * pushes current frame to stack (called before rendering children)
 * @returns whether a frame was pushed (needed for popContextFrame)
 */
export function pushContextFrame(): boolean {
	const ctx = activeRenderContext!;
	if (ctx.currentFrame) {
		ctx.contextStack.push(ctx.currentFrame);
		ctx.currentFrame = null;
		return true;
	}
	return false;
}

/**
 * pops context frame (called after rendering children)
 * @param hadFrame whether pushContextFrame returned true
 */
export function popContextFrame(hadFrame: boolean): void {
	const ctx = activeRenderContext!;
	if (hadFrame) {
		ctx.contextStack.pop();
	}
	ctx.currentFrame = null;
}
