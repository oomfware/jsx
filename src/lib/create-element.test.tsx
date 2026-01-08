import { describe, expect, expectTypeOf, it } from 'bun:test';

import type { JSX } from './intrinsic-elements.ts';
import { Fragment } from '../jsx-runtime.ts';
import { cloneElement, createElement } from './create-element.ts';
import type { Component, JSXElement, JSXNode } from './types.ts';

describe('createElement', () => {
	describe('intrinsic elements', () => {
		it('creates a div element', () => {
			const el = createElement('div', { class: 'test' });
			expect(el.type).toBe('div');
			expect(el.props).toEqual({ class: 'test' });
		});

		it('creates an element with children as rest params', () => {
			const el = createElement('div', null, 'hello', 'world');
			expect(el.type).toBe('div');
			expect(el.props).toEqual({ children: ['hello', 'world'] });
		});

		it('creates an element with single child', () => {
			const el = createElement('span', { id: 'foo' }, 'text');
			expect(el.type).toBe('span');
			expect(el.props).toEqual({ id: 'foo', children: 'text' });
		});

		it('creates an element with no props or children', () => {
			const el = createElement('br');
			expect(el.type).toBe('br');
			expect(el.props).toEqual({});
		});

		it('creates an element with null props', () => {
			const el = createElement('hr', null);
			expect(el.type).toBe('hr');
			expect(el.props).toEqual({});
		});

		it('creates nested elements', () => {
			const child = createElement('span', null, 'inner');
			const parent = createElement('div', null, child);
			expect(parent.type).toBe('div');
			expect(parent.props.children).toEqual(child);
		});
	});

	describe('function components', () => {
		it('creates an element with a function component', () => {
			const MyComponent: Component<{ name: string }> = (props) => createElement('div', null, props.name);
			const el = createElement(MyComponent, { name: 'test' });
			expect(el.type).toBe(MyComponent);
			expect(el.props).toEqual({ name: 'test' });
		});

		it('creates an element with component and children', () => {
			const Wrapper: Component<{ children?: JSXNode }> = (props) => createElement('div', null, props.children);
			const el = createElement(Wrapper, null, 'child content');
			expect(el.type).toBe(Wrapper);
			expect(el.props).toEqual({ children: 'child content' });
		});
	});

	describe('Fragment', () => {
		it('creates a Fragment element', () => {
			const el = createElement(Fragment, null, 'a', 'b', 'c');
			expect(el.type).toBe(Fragment);
			expect(el.props).toEqual({ children: ['a', 'b', 'c'] });
		});
	});

	describe('types', () => {
		it('infers correct types for intrinsic elements', () => {
			const div = createElement('div', { class: 'test' });
			expectTypeOf(div).toExtend<JSXElement>();

			const input = createElement('input', { type: 'text', value: 'hello' });
			expectTypeOf(input).toExtend<JSXElement>();
		});

		it('infers correct types for function components', () => {
			const MyComponent: Component<{ name: string }> = () => null;
			const el = createElement(MyComponent, { name: 'test' });
			expectTypeOf(el).toExtend<JSXElement>();
		});

		it('checks prop types for intrinsic elements', () => {
			// href should not be assignable to div props
			expectTypeOf<{ href: string }>().not.toExtend<JSX.IntrinsicElements['div']>();

			// href should be assignable to anchor props
			expectTypeOf<{ href: string }>().toExtend<JSX.IntrinsicElements['a']>();

			// type should be assignable to input props
			expectTypeOf<{ type: string }>().toExtend<JSX.IntrinsicElements['input']>();
		});

		it('checks prop types for function components', () => {
			type Props = { name: string; count: number };

			// correct props should be assignable
			expectTypeOf<{ name: string; count: number }>().toExtend<Props>();

			// missing required prop should not be assignable
			expectTypeOf<{ name: string }>().not.toExtend<Props>();

			// wrong type should not be assignable
			expectTypeOf<{ name: number; count: number }>().not.toExtend<Props>();

			// extra props are allowed by structural typing
			expectTypeOf<{ name: string; count: number; extra: boolean }>().toExtend<Props>();
		});

		it('checks partial props for component cloning', () => {
			type Props = { name: string; count: number };

			// partial allows missing props
			expectTypeOf<{ name: string }>().toExtend<Partial<Props>>();
			expectTypeOf<{ count: number }>().toExtend<Partial<Props>>();
			expectTypeOf<{}>().toExtend<Partial<Props>>();

			// wrong type still not assignable
			expectTypeOf<{ name: number }>().not.toExtend<Partial<Props>>();
		});
	});
});

describe('cloneElement', () => {
	describe('intrinsic elements', () => {
		it('clones an element with new props', () => {
			const original = createElement('div', { class: 'original', id: 'test' });
			const cloned = cloneElement(original, { class: 'cloned' });
			expect(cloned.type).toBe('div');
			expect(cloned.props).toEqual({ class: 'cloned', id: 'test' });
		});

		it('clones an element with new children', () => {
			const original = createElement('div', { class: 'test' }, 'original child');
			const cloned = cloneElement(original, null, 'new child');
			expect(cloned.type).toBe('div');
			expect(cloned.props).toEqual({ class: 'test', children: 'new child' });
		});

		it('clones an element with multiple new children', () => {
			const original = createElement('div', null, 'original');
			const cloned = cloneElement(original, null, 'a', 'b', 'c');
			expect(cloned.props).toEqual({ children: ['a', 'b', 'c'] });
		});

		it('clones an element preserving original children when none provided', () => {
			const original = createElement('div', null, 'keep me');
			const cloned = cloneElement(original, { class: 'added' });
			expect(cloned.props).toEqual({ class: 'added', children: 'keep me' });
		});

		it('clones with null props preserves original', () => {
			const original = createElement('div', { class: 'test' });
			const cloned = cloneElement(original, null);
			expect(cloned.props).toEqual({ class: 'test' });
		});
	});

	describe('function components', () => {
		it('clones a function component element with new props', () => {
			const MyComponent: Component<{ name: string; title?: string }> = () => null;
			const original = createElement(MyComponent, { name: 'alice', title: 'Dr.' });
			const cloned = cloneElement(original, { name: 'bob' });
			expect(cloned.type).toBe(MyComponent);
			expect(cloned.props).toEqual({ name: 'bob', title: 'Dr.' });
		});
	});

	describe('types', () => {
		it('cloned element matches JSXElement', () => {
			const div = createElement('div', { class: 'test' });
			const cloned = cloneElement(div, { id: 'cloned' });
			expectTypeOf(cloned).toExtend<JSXElement>();
		});

		it('accepts partial props for cloning', () => {
			const MyComponent: Component<{ name: string; age: number }> = () => null;
			const original = createElement(MyComponent, { name: 'test', age: 25 });
			const cloned = cloneElement(original, { name: 'updated' });
			expectTypeOf(cloned).toExtend<JSXElement>();
		});

		it('checks prop types when cloning intrinsic elements', () => {
			// href should not be assignable to div props
			expectTypeOf<{ href: string }>().not.toExtend<Partial<JSX.IntrinsicElements['div']>>();

			// class should be assignable to div props
			expectTypeOf<{ class: string }>().toExtend<Partial<JSX.IntrinsicElements['div']>>();

			// href should be assignable to anchor props
			expectTypeOf<{ href: string }>().toExtend<Partial<JSX.IntrinsicElements['a']>>();
		});
	});
});
