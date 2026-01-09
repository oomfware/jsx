// based on @types/react@19.2.7

import type * as CSS from 'csstype';

import type { JSXElement, JSXNode } from './types.js';

/**
 * boolean or string boolean for DOM attributes
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
 */
type Booleanish = boolean | 'true' | 'false';

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 */
type CrossOrigin = 'anonymous' | 'use-credentials' | '' | undefined;

interface DOMAttributes {
	children?: JSXNode | undefined;
	dangerouslySetInnerHTML?:
		| {
				__html: string;
		  }
		| undefined;

	// Clipboard Events
	oncopy?: string | undefined;
	oncut?: string | undefined;
	onpaste?: string | undefined;

	// Composition Events
	oncompositionend?: string | undefined;
	oncompositionstart?: string | undefined;
	oncompositionupdate?: string | undefined;

	// Focus Events
	onfocus?: string | undefined;
	onblur?: string | undefined;

	// Form Events
	onchange?: string | undefined;
	onbeforeinput?: string | undefined;
	oninput?: string | undefined;
	onreset?: string | undefined;
	onsubmit?: string | undefined;
	oninvalid?: string | undefined;

	// Image Events
	onload?: string | undefined;
	onerror?: string | undefined; // also a Media Event

	// Keyboard Events
	onkeydown?: string | undefined;
	onkeypress?: string | undefined;
	onkeyup?: string | undefined;

	// Media Events
	onabort?: string | undefined;
	oncanplay?: string | undefined;
	oncanplaythrough?: string | undefined;
	ondurationchange?: string | undefined;
	onemptied?: string | undefined;
	onencrypted?: string | undefined;
	onended?: string | undefined;
	onloadeddata?: string | undefined;
	onloadedmetadata?: string | undefined;
	onloadstart?: string | undefined;
	onpause?: string | undefined;
	onplay?: string | undefined;
	onplaying?: string | undefined;
	onprogress?: string | undefined;
	onratechange?: string | undefined;
	onseeked?: string | undefined;
	onseeking?: string | undefined;
	onstalled?: string | undefined;
	onsuspend?: string | undefined;
	ontimeupdate?: string | undefined;
	onvolumechange?: string | undefined;
	onwaiting?: string | undefined;

	// MouseEvents
	onauxclick?: string | undefined;
	onclick?: string | undefined;
	oncontextmenu?: string | undefined;
	ondoubleclick?: string | undefined;
	ondrag?: string | undefined;
	ondragend?: string | undefined;
	ondragenter?: string | undefined;
	ondragexit?: string | undefined;
	ondragleave?: string | undefined;
	ondragover?: string | undefined;
	ondragstart?: string | undefined;
	ondrop?: string | undefined;
	onmousedown?: string | undefined;
	onmouseenter?: string | undefined;
	onmouseleave?: string | undefined;
	onmousemove?: string | undefined;
	onmouseout?: string | undefined;
	onmouseover?: string | undefined;
	onmouseup?: string | undefined;

	// Selection Events
	onselect?: string | undefined;

	// Touch Events
	ontouchcancel?: string | undefined;
	ontouchend?: string | undefined;
	ontouchmove?: string | undefined;
	ontouchstart?: string | undefined;

	// Pointer Events
	onpointerdown?: string | undefined;
	onpointermove?: string | undefined;
	onpointerup?: string | undefined;
	onpointercancel?: string | undefined;
	onpointerenter?: string | undefined;
	onpointerleave?: string | undefined;
	onpointerover?: string | undefined;
	onpointerout?: string | undefined;

	// UI Events
	onscroll?: string | undefined;
	onscrollend?: string | undefined;

	// Wheel Events
	onwheel?: string | undefined;

	// Animation Events
	onanimationstart?: string | undefined;
	onanimationend?: string | undefined;
	onanimationiteration?: string | undefined;

	// Toggle Events
	ontoggle?: string | undefined;
	onbeforetoggle?: string | undefined;

	// Transition Events
	ontransitioncancel?: string | undefined;
	ontransitionend?: string | undefined;
	ontransitionrun?: string | undefined;
	ontransitionstart?: string | undefined;
}

export interface CSSProperties extends CSS.PropertiesHyphen<string | number> {
	/**
	 * The index signature was removed to enable closed typing for style
	 * using CSSType. You're able to use type assertion or module augmentation
	 * to add properties or an index signature of your own.
	 *
	 * For examples and more information, visit:
	 * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
	 */
}

// All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
interface AriaAttributes {
	/** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
	'aria-activedescendant'?: string | undefined;
	/** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
	'aria-atomic'?: Booleanish | undefined;
	/**
	 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
	 * presented if they are made.
	 */
	'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
	/** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
	/**
	 * Defines a string value that labels the current element, which is intended to be converted into Braille.
	 * @see aria-label.
	 */
	'aria-braillelabel'?: string | undefined;
	/**
	 * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
	 * @see aria-roledescription.
	 */
	'aria-brailleroledescription'?: string | undefined;
	'aria-busy'?: Booleanish | undefined;
	/**
	 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
	 * @see aria-pressed @see aria-selected.
	 */
	'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
	/**
	 * Defines the total number of columns in a table, grid, or treegrid.
	 * @see aria-colindex.
	 */
	'aria-colcount'?: number | undefined;
	/**
	 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
	 * @see aria-colcount @see aria-colspan.
	 */
	'aria-colindex'?: number | undefined;
	/**
	 * Defines a human readable text alternative of aria-colindex.
	 * @see aria-rowindextext.
	 */
	'aria-colindextext'?: string | undefined;
	/**
	 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-colindex @see aria-rowspan.
	 */
	'aria-colspan'?: number | undefined;
	/**
	 * Identifies the element (or elements) whose contents or presence are controlled by the current element.
	 * @see aria-owns.
	 */
	'aria-controls'?: string | undefined;
	/** Indicates the element that represents the current item within a container or set of related elements. */
	'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
	/**
	 * Identifies the element (or elements) that describes the object.
	 * @see aria-labelledby
	 */
	'aria-describedby'?: string | undefined;
	/**
	 * Defines a string value that describes or annotates the current element.
	 * @see related aria-describedby.
	 */
	'aria-description'?: string | undefined;
	/**
	 * Identifies the element that provides a detailed, extended description for the object.
	 * @see aria-describedby.
	 */
	'aria-details'?: string | undefined;
	/**
	 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
	 * @see aria-hidden @see aria-readonly.
	 */
	'aria-disabled'?: Booleanish | undefined;
	/**
	 * Indicates what functions can be performed when a dragged object is released on the drop target.
	 * @deprecated in ARIA 1.1
	 */
	'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
	/**
	 * Identifies the element that provides an error message for the object.
	 * @see aria-invalid @see aria-describedby.
	 */
	'aria-errormessage'?: string | undefined;
	/** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
	'aria-expanded'?: Booleanish | undefined;
	/**
	 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
	 * allows assistive technology to override the general default of reading in document source order.
	 */
	'aria-flowto'?: string | undefined;
	/**
	 * Indicates an element's "grabbed" state in a drag-and-drop operation.
	 * @deprecated in ARIA 1.1
	 */
	'aria-grabbed'?: Booleanish | undefined;
	/** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
	'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
	/**
	 * Indicates whether the element is exposed to an accessibility API.
	 * @see aria-disabled.
	 */
	'aria-hidden'?: Booleanish | undefined;
	/**
	 * Indicates the entered value does not conform to the format expected by the application.
	 * @see aria-errormessage.
	 */
	'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
	/** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
	'aria-keyshortcuts'?: string | undefined;
	/**
	 * Defines a string value that labels the current element.
	 * @see aria-labelledby.
	 */
	'aria-label'?: string | undefined;
	/**
	 * Identifies the element (or elements) that labels the current element.
	 * @see aria-describedby.
	 */
	'aria-labelledby'?: string | undefined;
	/** Defines the hierarchical level of an element within a structure. */
	'aria-level'?: number | undefined;
	/** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
	'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
	/** Indicates whether an element is modal when displayed. */
	'aria-modal'?: Booleanish | undefined;
	/** Indicates whether a text box accepts multiple lines of input or only a single line. */
	'aria-multiline'?: Booleanish | undefined;
	/** Indicates that the user may select more than one item from the current selectable descendants. */
	'aria-multiselectable'?: Booleanish | undefined;
	/** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
	'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
	/**
	 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
	 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
	 * @see aria-controls.
	 */
	'aria-owns'?: string | undefined;
	/**
	 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
	 * A hint could be a sample value or a brief description of the expected format.
	 */
	'aria-placeholder'?: string | undefined;
	/**
	 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-setsize.
	 */
	'aria-posinset'?: number | undefined;
	/**
	 * Indicates the current "pressed" state of toggle buttons.
	 * @see aria-checked @see aria-selected.
	 */
	'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
	/**
	 * Indicates that the element is not editable, but is otherwise operable.
	 * @see aria-disabled.
	 */
	'aria-readonly'?: Booleanish | undefined;
	/**
	 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
	 * @see aria-atomic.
	 */
	'aria-relevant'?:
		| 'additions'
		| 'additions removals'
		| 'additions text'
		| 'all'
		| 'removals'
		| 'removals additions'
		| 'removals text'
		| 'text'
		| 'text additions'
		| 'text removals'
		| undefined;
	/** Indicates that user input is required on the element before a form may be submitted. */
	'aria-required'?: Booleanish | undefined;
	/** Defines a human-readable, author-localized description for the role of an element. */
	'aria-roledescription'?: string | undefined;
	/**
	 * Defines the total number of rows in a table, grid, or treegrid.
	 * @see aria-rowindex.
	 */
	'aria-rowcount'?: number | undefined;
	/**
	 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
	 * @see aria-rowcount @see aria-rowspan.
	 */
	'aria-rowindex'?: number | undefined;
	/**
	 * Defines a human readable text alternative of aria-rowindex.
	 * @see aria-colindextext.
	 */
	'aria-rowindextext'?: string | undefined;
	/**
	 * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
	 * @see aria-rowindex @see aria-colspan.
	 */
	'aria-rowspan'?: number | undefined;
	/**
	 * Indicates the current "selected" state of various widgets.
	 * @see aria-checked @see aria-pressed.
	 */
	'aria-selected'?: Booleanish | undefined;
	/**
	 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
	 * @see aria-posinset.
	 */
	'aria-setsize'?: number | undefined;
	/** Indicates if items in a table or grid are sorted in ascending or descending order. */
	'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
	/** Defines the maximum allowed value for a range widget. */
	'aria-valuemax'?: number | undefined;
	/** Defines the minimum allowed value for a range widget. */
	'aria-valuemin'?: number | undefined;
	/**
	 * Defines the current value for a range widget.
	 * @see aria-valuetext.
	 */
	'aria-valuenow'?: number | undefined;
	/** Defines the human readable text alternative of aria-valuenow for a range widget. */
	'aria-valuetext'?: string | undefined;
}

// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
type AriaRole =
	| 'alert'
	| 'alertdialog'
	| 'application'
	| 'article'
	| 'banner'
	| 'button'
	| 'cell'
	| 'checkbox'
	| 'columnheader'
	| 'combobox'
	| 'complementary'
	| 'contentinfo'
	| 'definition'
	| 'dialog'
	| 'directory'
	| 'document'
	| 'feed'
	| 'figure'
	| 'form'
	| 'grid'
	| 'gridcell'
	| 'group'
	| 'heading'
	| 'img'
	| 'link'
	| 'list'
	| 'listbox'
	| 'listitem'
	| 'log'
	| 'main'
	| 'marquee'
	| 'math'
	| 'menu'
	| 'menubar'
	| 'menuitem'
	| 'menuitemcheckbox'
	| 'menuitemradio'
	| 'navigation'
	| 'none'
	| 'note'
	| 'option'
	| 'presentation'
	| 'progressbar'
	| 'radio'
	| 'radiogroup'
	| 'region'
	| 'row'
	| 'rowgroup'
	| 'rowheader'
	| 'scrollbar'
	| 'search'
	| 'searchbox'
	| 'separator'
	| 'slider'
	| 'spinbutton'
	| 'status'
	| 'switch'
	| 'tab'
	| 'table'
	| 'tablist'
	| 'tabpanel'
	| 'term'
	| 'textbox'
	| 'timer'
	| 'toolbar'
	| 'tooltip'
	| 'tree'
	| 'treegrid'
	| 'treeitem'
	| (string & {});

interface HTMLAttributes extends AriaAttributes, DOMAttributes {
	// Standard HTML Attributes
	accesskey?: string | undefined;
	autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters' | undefined | (string & {});
	autofocus?: boolean | undefined;
	class?: string | undefined;
	contenteditable?: Booleanish | 'inherit' | 'plaintext-only' | undefined;
	/** @deprecated */
	contextmenu?: string | undefined;
	dir?: string | undefined;
	draggable?: Booleanish | undefined;
	enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
	hidden?: boolean | undefined;
	id?: string | undefined;
	lang?: string | undefined;
	nonce?: string | undefined;
	slot?: string | undefined;
	spellcheck?: Booleanish | undefined;
	style?: CSSProperties | string | undefined;
	tabindex?: number | undefined;
	title?: string | undefined;
	translate?: 'yes' | 'no' | undefined;

	// Unknown
	/** @deprecated */
	radiogroup?: string | undefined; // <command>, <menuitem>

	// WAI-ARIA
	role?: AriaRole | undefined;

	// RDFa Attributes
	about?: string | undefined;
	content?: string | undefined;
	datatype?: string | undefined;
	inlist?: any;
	prefix?: string | undefined;
	property?: string | undefined;
	rel?: string | undefined;
	resource?: string | undefined;
	rev?: string | undefined;
	typeof?: string | undefined;
	vocab?: string | undefined;

	// Non-standard Attributes
	autocorrect?: string | undefined;
	autosave?: string | undefined;
	color?: string | undefined;
	itemprop?: string | undefined;
	itemscope?: boolean | undefined;
	itemtype?: string | undefined;
	itemid?: string | undefined;
	itemref?: string | undefined;
	results?: number | undefined;
	security?: string | undefined;
	unselectable?: 'on' | 'off' | undefined;

	// Popover API
	popover?: '' | 'auto' | 'manual' | 'hint' | undefined;
	popovertargetaction?: 'toggle' | 'show' | 'hide' | undefined;
	popovertarget?: string | undefined;

	// Living Standard
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert
	 */
	inert?: boolean | undefined;
	/**
	 * hints at the type of data that might be entered by the user while editing the element or its contents
	 * @see {@link https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute}
	 */
	inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
	/**
	 * specify that a standard HTML element should behave like a defined custom built-in element
	 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is}
	 */
	is?: string | undefined;
	/**
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/exportparts}
	 */
	exportparts?: string | undefined;
	/**
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part}
	 */
	part?: string | undefined;
}

type HTMLAttributeReferrerPolicy =
	| ''
	| 'no-referrer'
	| 'no-referrer-when-downgrade'
	| 'origin'
	| 'origin-when-cross-origin'
	| 'same-origin'
	| 'strict-origin'
	| 'strict-origin-when-cross-origin'
	| 'unsafe-url';

type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});

interface AnchorHTMLAttributes extends HTMLAttributes {
	download?: any;
	href?: string | undefined;
	hreflang?: string | undefined;
	media?: string | undefined;
	ping?: string | undefined;
	target?: HTMLAttributeAnchorTarget | undefined;
	type?: string | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
}

interface AudioHTMLAttributes extends MediaHTMLAttributes {}

interface AreaHTMLAttributes extends HTMLAttributes {
	alt?: string | undefined;
	coords?: string | undefined;
	download?: any;
	href?: string | undefined;
	hreflang?: string | undefined;
	media?: string | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
	shape?: string | undefined;
	target?: string | undefined;
}

interface BaseHTMLAttributes extends HTMLAttributes {
	href?: string | undefined;
	target?: string | undefined;
}

interface BlockquoteHTMLAttributes extends HTMLAttributes {
	cite?: string | undefined;
}

interface ButtonHTMLAttributes extends HTMLAttributes {
	command?:
		| 'show-modal'
		| 'close'
		| 'show-popover'
		| 'hide-popover'
		| 'toggle-popover'
		| `--${string}`
		| undefined;
	commandfor?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	formaction?: string | undefined;
	formenctype?: string | undefined;
	formmethod?: string | undefined;
	formnovalidate?: boolean | undefined;
	formtarget?: string | undefined;
	name?: string | undefined;
	type?: 'submit' | 'reset' | 'button' | undefined;
	value?: string | readonly string[] | number | undefined;
}

interface CanvasHTMLAttributes extends HTMLAttributes {
	height?: number | string | undefined;
	width?: number | string | undefined;
}

interface ColHTMLAttributes extends HTMLAttributes {
	span?: number | undefined;
	width?: number | string | undefined;
}

interface ColgroupHTMLAttributes extends HTMLAttributes {
	span?: number | undefined;
}

interface DataHTMLAttributes extends HTMLAttributes {
	value?: string | readonly string[] | number | undefined;
}

interface DetailsHTMLAttributes extends HTMLAttributes {
	open?: boolean | undefined;
	name?: string | undefined;
}

interface DelHTMLAttributes extends HTMLAttributes {
	cite?: string | undefined;
	datetime?: string | undefined;
}

interface DialogHTMLAttributes extends HTMLAttributes {
	closedby?: 'any' | 'closerequest' | 'none' | undefined;
	oncancel?: string | undefined;
	onclose?: string | undefined;
	open?: boolean | undefined;
}

interface EmbedHTMLAttributes extends HTMLAttributes {
	height?: number | string | undefined;
	src?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;
}

interface FieldsetHTMLAttributes extends HTMLAttributes {
	disabled?: boolean | undefined;
	form?: string | undefined;
	name?: string | undefined;
}

interface FormHTMLAttributes extends HTMLAttributes {
	'accept-charset'?: string | undefined;
	action?: string | undefined;
	autocomplete?: string | undefined;
	enctype?: string | undefined;
	method?: string | undefined;
	name?: string | undefined;
	novalidate?: boolean | undefined;
	target?: string | undefined;
}

interface HtmlHTMLAttributes extends HTMLAttributes {
	manifest?: string | undefined;
}

interface IframeHTMLAttributes extends HTMLAttributes {
	allow?: string | undefined;
	allowfullscreen?: boolean | undefined;
	/** @deprecated non-standard */
	allowtransparency?: boolean | undefined;
	/** @deprecated */
	frameborder?: number | string | undefined;
	height?: number | string | undefined;
	loading?: 'eager' | 'lazy' | undefined;
	/** @deprecated */
	marginheight?: number | undefined;
	/** @deprecated */
	marginwidth?: number | undefined;
	name?: string | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
	sandbox?: string | undefined;
	/** @deprecated */
	scrolling?: string | undefined;
	seamless?: boolean | undefined;
	src?: string | undefined;
	srcdoc?: string | undefined;
	width?: number | string | undefined;
}

interface ImgHTMLAttributes extends HTMLAttributes {
	alt?: string | undefined;
	crossorigin?: CrossOrigin;
	decoding?: 'async' | 'auto' | 'sync' | undefined;
	fetchpriority?: 'high' | 'low' | 'auto';
	height?: number | string | undefined;
	loading?: 'eager' | 'lazy' | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
	sizes?: string | undefined;
	src?: string | undefined;
	srcset?: string | undefined;
	usemap?: string | undefined;
	width?: number | string | undefined;
}

interface InsHTMLAttributes extends HTMLAttributes {
	cite?: string | undefined;
	datetime?: string | undefined;
}

type HTMLInputTypeAttribute =
	| 'button'
	| 'checkbox'
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'hidden'
	| 'image'
	| 'month'
	| 'number'
	| 'password'
	| 'radio'
	| 'range'
	| 'reset'
	| 'search'
	| 'submit'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week'
	| (string & {});

type AutoFillAddressKind = 'billing' | 'shipping';
type AutoFillBase = '' | 'off' | 'on';
type AutoFillContactField =
	| 'email'
	| 'tel'
	| 'tel-area-code'
	| 'tel-country-code'
	| 'tel-extension'
	| 'tel-local'
	| 'tel-local-prefix'
	| 'tel-local-suffix'
	| 'tel-national';
type AutoFillContactKind = 'home' | 'mobile' | 'work';
type AutoFillCredentialField = 'webauthn';
type AutoFillNormalField =
	| 'additional-name'
	| 'address-level1'
	| 'address-level2'
	| 'address-level3'
	| 'address-level4'
	| 'address-line1'
	| 'address-line2'
	| 'address-line3'
	| 'bday-day'
	| 'bday-month'
	| 'bday-year'
	| 'cc-csc'
	| 'cc-exp'
	| 'cc-exp-month'
	| 'cc-exp-year'
	| 'cc-family-name'
	| 'cc-given-name'
	| 'cc-name'
	| 'cc-number'
	| 'cc-type'
	| 'country'
	| 'country-name'
	| 'current-password'
	| 'family-name'
	| 'given-name'
	| 'honorific-prefix'
	| 'honorific-suffix'
	| 'name'
	| 'new-password'
	| 'one-time-code'
	| 'organization'
	| 'postal-code'
	| 'street-address'
	| 'transaction-amount'
	| 'transaction-currency'
	| 'username';
type OptionalPrefixToken<T extends string> = `${T} ` | '';
type OptionalPostfixToken<T extends string> = ` ${T}` | '';
type AutoFillField =
	| AutoFillNormalField
	| `${OptionalPrefixToken<AutoFillContactKind>}${AutoFillContactField}`;
type AutoFillSection = `section-${string}`;
type AutoFill =
	| AutoFillBase
	| `${OptionalPrefixToken<AutoFillSection>}${OptionalPrefixToken<AutoFillAddressKind>}${AutoFillField}${OptionalPostfixToken<AutoFillCredentialField>}`;
type HTMLInputAutoCompleteAttribute = AutoFill | (string & {});

interface InputHTMLAttributes extends HTMLAttributes {
	accept?: string | undefined;
	alt?: string | undefined;
	autocomplete?: HTMLInputAutoCompleteAttribute | undefined;
	capture?: boolean | 'user' | 'environment' | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
	checked?: boolean | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	formaction?: string | undefined;
	formenctype?: string | undefined;
	formmethod?: string | undefined;
	formnovalidate?: boolean | undefined;
	formtarget?: string | undefined;
	height?: number | string | undefined;
	list?: string | undefined;
	max?: number | string | undefined;
	maxlength?: number | undefined;
	min?: number | string | undefined;
	minlength?: number | undefined;
	multiple?: boolean | undefined;
	name?: string | undefined;
	pattern?: string | undefined;
	placeholder?: string | undefined;
	readonly?: boolean | undefined;
	required?: boolean | undefined;
	size?: number | undefined;
	src?: string | undefined;
	step?: number | string | undefined;
	type?: HTMLInputTypeAttribute | undefined;
	value?: string | readonly string[] | number | undefined;
	width?: number | string | undefined;

	onchange?: string | undefined;
}

/** @deprecated */
interface KeygenHTMLAttributes extends HTMLAttributes {
	challenge?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	keytype?: string | undefined;
	keyparams?: string | undefined;
	name?: string | undefined;
}

interface LabelHTMLAttributes extends HTMLAttributes {
	form?: string | undefined;
	for?: string | undefined;
}

interface LiHTMLAttributes extends HTMLAttributes {
	value?: string | readonly string[] | number | undefined;
}

interface LinkHTMLAttributes extends HTMLAttributes {
	as?: string | undefined;
	blocking?: 'render' | (string & {}) | undefined;
	crossorigin?: CrossOrigin;
	fetchpriority?: 'high' | 'low' | 'auto';
	href?: string | undefined;
	hreflang?: string | undefined;
	integrity?: string | undefined;
	media?: string | undefined;
	imagesrcset?: string | undefined;
	imagesizes?: string | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
	sizes?: string | undefined;
	type?: string | undefined;
	/** @deprecated */
	charset?: string | undefined;
}

interface MapHTMLAttributes extends HTMLAttributes {
	name?: string | undefined;
}

interface MenuHTMLAttributes extends HTMLAttributes {
	type?: string | undefined;
}

interface MediaHTMLAttributes extends HTMLAttributes {
	autoplay?: boolean | undefined;
	controls?: boolean | undefined;
	controlslist?: string | undefined;
	crossorigin?: CrossOrigin;
	loop?: boolean | undefined;
	/** @deprecated */
	mediagroup?: string | undefined;
	muted?: boolean | undefined;
	playsinline?: boolean | undefined;
	preload?: string | undefined;
	src?: string | undefined;
}

interface MetaHTMLAttributes extends HTMLAttributes {
	charset?: string | undefined;
	content?: string | undefined;
	'http-equiv'?: string | undefined;
	media?: string | undefined;
	name?: string | undefined;
}

interface MeterHTMLAttributes extends HTMLAttributes {
	form?: string | undefined;
	high?: number | undefined;
	low?: number | undefined;
	max?: number | string | undefined;
	min?: number | string | undefined;
	optimum?: number | undefined;
	value?: string | readonly string[] | number | undefined;
}

interface QuoteHTMLAttributes extends HTMLAttributes {
	cite?: string | undefined;
}

interface ObjectHTMLAttributes extends HTMLAttributes {
	/** @deprecated */
	classid?: string | undefined;
	data?: string | undefined;
	form?: string | undefined;
	height?: number | string | undefined;
	name?: string | undefined;
	type?: string | undefined;
	usemap?: string | undefined;
	width?: number | string | undefined;
	/** @deprecated */
	wmode?: string | undefined;
}

interface OlHTMLAttributes extends HTMLAttributes {
	reversed?: boolean | undefined;
	start?: number | undefined;
	type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

interface OptgroupHTMLAttributes extends HTMLAttributes {
	disabled?: boolean | undefined;
	label?: string | undefined;
}

interface OptionHTMLAttributes extends HTMLAttributes {
	disabled?: boolean | undefined;
	label?: string | undefined;
	selected?: boolean | undefined;
	value?: string | readonly string[] | number | undefined;
}

interface OutputHTMLAttributes extends HTMLAttributes {
	form?: string | undefined;
	for?: string | undefined;
	name?: string | undefined;
}

interface ParamHTMLAttributes extends HTMLAttributes {
	name?: string | undefined;
	value?: string | readonly string[] | number | undefined;
}

interface ProgressHTMLAttributes extends HTMLAttributes {
	max?: number | string | undefined;
	value?: string | readonly string[] | number | undefined;
}

interface SlotHTMLAttributes extends HTMLAttributes {
	name?: string | undefined;
}

interface ScriptHTMLAttributes extends HTMLAttributes {
	async?: boolean | undefined;
	blocking?: 'render' | (string & {}) | undefined;
	/** @deprecated */
	charset?: string | undefined;
	crossorigin?: CrossOrigin;
	defer?: boolean | undefined;
	fetchpriority?: 'high' | 'low' | 'auto' | undefined;
	integrity?: string | undefined;
	nomodule?: boolean | undefined;
	referrerpolicy?: HTMLAttributeReferrerPolicy | undefined;
	src?: string | undefined;
	type?: string | undefined;
}

interface SelectHTMLAttributes extends HTMLAttributes {
	autocomplete?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	multiple?: boolean | undefined;
	name?: string | undefined;
	required?: boolean | undefined;
	size?: number | undefined;
	value?: string | readonly string[] | number | undefined;
	onchange?: string | undefined;
}

interface SourceHTMLAttributes extends HTMLAttributes {
	height?: number | string | undefined;
	media?: string | undefined;
	sizes?: string | undefined;
	src?: string | undefined;
	srcset?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;
}

interface StyleHTMLAttributes extends HTMLAttributes {
	blocking?: 'render' | (string & {}) | undefined;
	media?: string | undefined;
	/** @deprecated */
	scoped?: boolean | undefined;
	type?: string | undefined;
}

interface TableHTMLAttributes extends HTMLAttributes {
	align?: 'left' | 'center' | 'right' | undefined;
	bgcolor?: string | undefined;
	border?: number | undefined;
	cellpadding?: number | string | undefined;
	cellspacing?: number | string | undefined;
	frame?: boolean | undefined;
	rules?: 'none' | 'groups' | 'rows' | 'columns' | 'all' | undefined;
	summary?: string | undefined;
	width?: number | string | undefined;
}

interface TextareaHTMLAttributes extends HTMLAttributes {
	autocomplete?: string | undefined;
	cols?: number | undefined;
	dirname?: string | undefined;
	disabled?: boolean | undefined;
	form?: string | undefined;
	maxlength?: number | undefined;
	minlength?: number | undefined;
	name?: string | undefined;
	placeholder?: string | undefined;
	readonly?: boolean | undefined;
	required?: boolean | undefined;
	rows?: number | undefined;
	value?: string | readonly string[] | number | undefined;
	wrap?: string | undefined;

	onchange?: string | undefined;
}

interface TdHTMLAttributes extends HTMLAttributes {
	align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
	colspan?: number | undefined;
	headers?: string | undefined;
	rowspan?: number | undefined;
	scope?: string | undefined;
	abbr?: string | undefined;
	height?: number | string | undefined;
	width?: number | string | undefined;
	valign?: 'top' | 'middle' | 'bottom' | 'baseline' | undefined;
}

interface ThHTMLAttributes extends HTMLAttributes {
	align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
	colspan?: number | undefined;
	headers?: string | undefined;
	rowspan?: number | undefined;
	scope?: string | undefined;
	abbr?: string | undefined;
}

interface TimeHTMLAttributes extends HTMLAttributes {
	datetime?: string | undefined;
}

interface TrackHTMLAttributes extends HTMLAttributes {
	default?: boolean | undefined;
	kind?: string | undefined;
	label?: string | undefined;
	src?: string | undefined;
	srclang?: string | undefined;
}

interface VideoHTMLAttributes extends MediaHTMLAttributes {
	height?: number | string | undefined;
	playsinline?: boolean | undefined;
	poster?: string | undefined;
	width?: number | string | undefined;
	disablepictureinpicture?: boolean | undefined;
	disableremoteplayback?: boolean | undefined;

	onresize?: string | undefined;
}

// this list is "complete" in that it contains every SVG attribute
// that React supports, but the types can be improved.
// Full list here: https://facebook.github.io/react/docs/dom-elements.html
//
// The three broad type categories are (in order of restrictiveness):
//   - "number | string"
//   - "string"
//   - union of string literals
interface SVGAttributes extends AriaAttributes, DOMAttributes {
	// Attributes which also defined in HTMLAttributes
	class?: string | undefined;
	color?: string | undefined;
	height?: number | string | undefined;
	id?: string | undefined;
	lang?: string | undefined;
	max?: number | string | undefined;
	media?: string | undefined;
	method?: string | undefined;
	min?: number | string | undefined;
	name?: string | undefined;
	style?: CSSProperties | string | undefined;
	target?: string | undefined;
	type?: string | undefined;
	width?: number | string | undefined;

	// Other HTML properties supported by SVG elements in browsers
	role?: AriaRole | undefined;
	tabindex?: number | undefined;
	crossorigin?: CrossOrigin;

	// SVG Specific attributes
	accentHeight?: number | string | undefined;
	accumulate?: 'none' | 'sum' | undefined;
	additive?: 'replace' | 'sum' | undefined;
	alignmentBaseline?:
		| 'auto'
		| 'baseline'
		| 'before-edge'
		| 'text-before-edge'
		| 'middle'
		| 'central'
		| 'after-edge'
		| 'text-after-edge'
		| 'ideographic'
		| 'alphabetic'
		| 'hanging'
		| 'mathematical'
		| 'inherit'
		| undefined;
	allowReorder?: 'no' | 'yes' | undefined;
	alphabetic?: number | string | undefined;
	amplitude?: number | string | undefined;
	arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated' | undefined;
	ascent?: number | string | undefined;
	attributeName?: string | undefined;
	attributeType?: string | undefined;
	autoReverse?: Booleanish | undefined;
	azimuth?: number | string | undefined;
	baseFrequency?: number | string | undefined;
	baselineShift?: number | string | undefined;
	baseProfile?: number | string | undefined;
	bbox?: number | string | undefined;
	begin?: number | string | undefined;
	bias?: number | string | undefined;
	by?: number | string | undefined;
	calcMode?: number | string | undefined;
	capHeight?: number | string | undefined;
	clip?: number | string | undefined;
	clipPath?: string | undefined;
	clipPathUnits?: number | string | undefined;
	clipRule?: number | string | undefined;
	colorInterpolation?: number | string | undefined;
	colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit' | undefined;
	colorProfile?: number | string | undefined;
	colorRendering?: number | string | undefined;
	contentScriptType?: number | string | undefined;
	contentStyleType?: number | string | undefined;
	cursor?: number | string | undefined;
	cx?: number | string | undefined;
	cy?: number | string | undefined;
	d?: string | undefined;
	decelerate?: number | string | undefined;
	descent?: number | string | undefined;
	diffuseConstant?: number | string | undefined;
	direction?: number | string | undefined;
	display?: number | string | undefined;
	divisor?: number | string | undefined;
	dominantBaseline?:
		| 'auto'
		| 'use-script'
		| 'no-change'
		| 'reset-size'
		| 'ideographic'
		| 'alphabetic'
		| 'hanging'
		| 'mathematical'
		| 'central'
		| 'middle'
		| 'text-after-edge'
		| 'text-before-edge'
		| 'inherit'
		| undefined;
	dur?: number | string | undefined;
	dx?: number | string | undefined;
	dy?: number | string | undefined;
	edgeMode?: number | string | undefined;
	elevation?: number | string | undefined;
	enableBackground?: number | string | undefined;
	end?: number | string | undefined;
	exponent?: number | string | undefined;
	externalResourcesRequired?: Booleanish | undefined;
	fill?: string | undefined;
	fillOpacity?: number | string | undefined;
	fillRule?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
	filter?: string | undefined;
	filterRes?: number | string | undefined;
	filterUnits?: number | string | undefined;
	floodColor?: number | string | undefined;
	floodOpacity?: number | string | undefined;
	focusable?: Booleanish | 'auto' | undefined;
	fontFamily?: string | undefined;
	fontSize?: number | string | undefined;
	fontSizeAdjust?: number | string | undefined;
	fontStretch?: number | string | undefined;
	fontStyle?: number | string | undefined;
	fontVariant?: number | string | undefined;
	fontWeight?: number | string | undefined;
	format?: number | string | undefined;
	fr?: number | string | undefined;
	from?: number | string | undefined;
	fx?: number | string | undefined;
	fy?: number | string | undefined;
	g1?: number | string | undefined;
	g2?: number | string | undefined;
	glyphName?: number | string | undefined;
	glyphOrientationHorizontal?: number | string | undefined;
	glyphOrientationVertical?: number | string | undefined;
	glyphRef?: number | string | undefined;
	gradientTransform?: string | undefined;
	gradientUnits?: string | undefined;
	hanging?: number | string | undefined;
	horizAdvX?: number | string | undefined;
	horizOriginX?: number | string | undefined;
	href?: string | undefined;
	ideographic?: number | string | undefined;
	imageRendering?: number | string | undefined;
	in2?: number | string | undefined;
	in?: string | undefined;
	intercept?: number | string | undefined;
	k1?: number | string | undefined;
	k2?: number | string | undefined;
	k3?: number | string | undefined;
	k4?: number | string | undefined;
	k?: number | string | undefined;
	kernelMatrix?: number | string | undefined;
	kernelUnitLength?: number | string | undefined;
	kerning?: number | string | undefined;
	keyPoints?: number | string | undefined;
	keySplines?: number | string | undefined;
	keyTimes?: number | string | undefined;
	lengthAdjust?: number | string | undefined;
	letterSpacing?: number | string | undefined;
	lightingColor?: number | string | undefined;
	limitingConeAngle?: number | string | undefined;
	local?: number | string | undefined;
	markerEnd?: string | undefined;
	markerHeight?: number | string | undefined;
	markerMid?: string | undefined;
	markerStart?: string | undefined;
	markerUnits?: number | string | undefined;
	markerWidth?: number | string | undefined;
	mask?: string | undefined;
	maskContentUnits?: number | string | undefined;
	maskUnits?: number | string | undefined;
	mathematical?: number | string | undefined;
	mode?: number | string | undefined;
	numOctaves?: number | string | undefined;
	offset?: number | string | undefined;
	opacity?: number | string | undefined;
	operator?: number | string | undefined;
	order?: number | string | undefined;
	orient?: number | string | undefined;
	orientation?: number | string | undefined;
	origin?: number | string | undefined;
	overflow?: number | string | undefined;
	overlinePosition?: number | string | undefined;
	overlineThickness?: number | string | undefined;
	paintOrder?: number | string | undefined;
	panose1?: number | string | undefined;
	path?: string | undefined;
	pathLength?: number | string | undefined;
	patternContentUnits?: string | undefined;
	patternTransform?: number | string | undefined;
	patternUnits?: string | undefined;
	pointerEvents?: number | string | undefined;
	points?: string | undefined;
	pointsAtX?: number | string | undefined;
	pointsAtY?: number | string | undefined;
	pointsAtZ?: number | string | undefined;
	preserveAlpha?: Booleanish | undefined;
	preserveAspectRatio?: string | undefined;
	primitiveUnits?: number | string | undefined;
	r?: number | string | undefined;
	radius?: number | string | undefined;
	refX?: number | string | undefined;
	refY?: number | string | undefined;
	renderingIntent?: number | string | undefined;
	repeatCount?: number | string | undefined;
	repeatDur?: number | string | undefined;
	requiredExtensions?: number | string | undefined;
	requiredFeatures?: number | string | undefined;
	restart?: number | string | undefined;
	result?: string | undefined;
	rotate?: number | string | undefined;
	rx?: number | string | undefined;
	ry?: number | string | undefined;
	scale?: number | string | undefined;
	seed?: number | string | undefined;
	shapeRendering?: number | string | undefined;
	slope?: number | string | undefined;
	spacing?: number | string | undefined;
	specularConstant?: number | string | undefined;
	specularExponent?: number | string | undefined;
	speed?: number | string | undefined;
	spreadMethod?: string | undefined;
	startOffset?: number | string | undefined;
	stdDeviation?: number | string | undefined;
	stemh?: number | string | undefined;
	stemv?: number | string | undefined;
	stitchTiles?: number | string | undefined;
	stopColor?: string | undefined;
	stopOpacity?: number | string | undefined;
	strikethroughPosition?: number | string | undefined;
	strikethroughThickness?: number | string | undefined;
	string?: number | string | undefined;
	stroke?: string | undefined;
	strokeDasharray?: string | number | undefined;
	strokeDashoffset?: string | number | undefined;
	strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit' | undefined;
	strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit' | undefined;
	strokeMiterlimit?: number | string | undefined;
	strokeOpacity?: number | string | undefined;
	strokeWidth?: number | string | undefined;
	surfaceScale?: number | string | undefined;
	systemLanguage?: number | string | undefined;
	tableValues?: number | string | undefined;
	targetX?: number | string | undefined;
	targetY?: number | string | undefined;
	textAnchor?: 'start' | 'middle' | 'end' | 'inherit' | undefined;
	textDecoration?: number | string | undefined;
	textLength?: number | string | undefined;
	textRendering?: number | string | undefined;
	to?: number | string | undefined;
	transform?: string | undefined;
	u1?: number | string | undefined;
	u2?: number | string | undefined;
	underlinePosition?: number | string | undefined;
	underlineThickness?: number | string | undefined;
	unicode?: number | string | undefined;
	unicodeBidi?: number | string | undefined;
	unicodeRange?: number | string | undefined;
	unitsPerEm?: number | string | undefined;
	vAlphabetic?: number | string | undefined;
	values?: string | undefined;
	vectorEffect?: number | string | undefined;
	version?: string | undefined;
	vertAdvY?: number | string | undefined;
	vertOriginX?: number | string | undefined;
	vertOriginY?: number | string | undefined;
	vHanging?: number | string | undefined;
	vIdeographic?: number | string | undefined;
	viewBox?: string | undefined;
	viewTarget?: number | string | undefined;
	visibility?: number | string | undefined;
	vMathematical?: number | string | undefined;
	widths?: number | string | undefined;
	wordSpacing?: number | string | undefined;
	writingMode?: number | string | undefined;
	x1?: number | string | undefined;
	x2?: number | string | undefined;
	x?: number | string | undefined;
	xChannelSelector?: string | undefined;
	xHeight?: number | string | undefined;
	xlinkActuate?: string | undefined;
	xlinkArcrole?: string | undefined;
	xlinkHref?: string | undefined;
	xlinkRole?: string | undefined;
	xlinkShow?: string | undefined;
	xlinkTitle?: string | undefined;
	xlinkType?: string | undefined;
	xmlBase?: string | undefined;
	xmlLang?: string | undefined;
	xmlns?: string | undefined;
	xmlnsXlink?: string | undefined;
	xmlSpace?: string | undefined;
	y1?: number | string | undefined;
	y2?: number | string | undefined;
	y?: number | string | undefined;
	yChannelSelector?: string | undefined;
	z?: number | string | undefined;
	zoomAndPan?: string | undefined;
}

/** non-standard, Electron only */
interface WebViewHTMLAttributes extends HTMLAttributes {
	allowfullscreen?: boolean | undefined;
	allowpopups?: boolean | undefined;
	autosize?: boolean | undefined;
	blinkfeatures?: string | undefined;
	disableblinkfeatures?: string | undefined;
	disableguestresize?: boolean | undefined;
	disablewebsecurity?: boolean | undefined;
	guestinstance?: string | undefined;
	httpreferrer?: string | undefined;
	nodeintegration?: boolean | undefined;
	partition?: string | undefined;
	plugins?: boolean | undefined;
	preload?: string | undefined;
	src?: string | undefined;
	useragent?: string | undefined;
	webpreferences?: string | undefined;
}
export namespace JSX {
	export type Element = JSXElement;
	export interface ElementChildrenAttribute {
		children: {};
	}

	export interface IntrinsicElements {
		// HTML
		a: AnchorHTMLAttributes;
		abbr: HTMLAttributes;
		address: HTMLAttributes;
		area: AreaHTMLAttributes;
		article: HTMLAttributes;
		aside: HTMLAttributes;
		audio: AudioHTMLAttributes;
		b: HTMLAttributes;
		base: BaseHTMLAttributes;
		bdi: HTMLAttributes;
		bdo: HTMLAttributes;
		big: HTMLAttributes;
		blockquote: BlockquoteHTMLAttributes;
		body: HTMLAttributes;
		br: HTMLAttributes;
		button: ButtonHTMLAttributes;
		canvas: CanvasHTMLAttributes;
		caption: HTMLAttributes;
		center: HTMLAttributes;
		cite: HTMLAttributes;
		code: HTMLAttributes;
		col: ColHTMLAttributes;
		colgroup: ColgroupHTMLAttributes;
		data: DataHTMLAttributes;
		datalist: HTMLAttributes;
		dd: HTMLAttributes;
		del: DelHTMLAttributes;
		details: DetailsHTMLAttributes;
		dfn: HTMLAttributes;
		dialog: DialogHTMLAttributes;
		div: HTMLAttributes;
		dl: HTMLAttributes;
		dt: HTMLAttributes;
		em: HTMLAttributes;
		embed: EmbedHTMLAttributes;
		fieldset: FieldsetHTMLAttributes;
		figcaption: HTMLAttributes;
		figure: HTMLAttributes;
		footer: HTMLAttributes;
		form: FormHTMLAttributes;
		h1: HTMLAttributes;
		h2: HTMLAttributes;
		h3: HTMLAttributes;
		h4: HTMLAttributes;
		h5: HTMLAttributes;
		h6: HTMLAttributes;
		head: HTMLAttributes;
		header: HTMLAttributes;
		hgroup: HTMLAttributes;
		hr: HTMLAttributes;
		html: HtmlHTMLAttributes;
		i: HTMLAttributes;
		iframe: IframeHTMLAttributes;
		img: ImgHTMLAttributes;
		input: InputHTMLAttributes;
		ins: InsHTMLAttributes;
		kbd: HTMLAttributes;
		keygen: KeygenHTMLAttributes;
		label: LabelHTMLAttributes;
		legend: HTMLAttributes;
		li: LiHTMLAttributes;
		link: LinkHTMLAttributes;
		main: HTMLAttributes;
		map: MapHTMLAttributes;
		mark: HTMLAttributes;
		menu: MenuHTMLAttributes;
		menuitem: HTMLAttributes;
		meta: MetaHTMLAttributes;
		meter: MeterHTMLAttributes;
		nav: HTMLAttributes;
		noindex: HTMLAttributes;
		noscript: HTMLAttributes;
		object: ObjectHTMLAttributes;
		ol: OlHTMLAttributes;
		optgroup: OptgroupHTMLAttributes;
		option: OptionHTMLAttributes;
		output: OutputHTMLAttributes;
		p: HTMLAttributes;
		param: ParamHTMLAttributes;
		picture: HTMLAttributes;
		pre: HTMLAttributes;
		progress: ProgressHTMLAttributes;
		q: QuoteHTMLAttributes;
		rp: HTMLAttributes;
		rt: HTMLAttributes;
		ruby: HTMLAttributes;
		s: HTMLAttributes;
		samp: HTMLAttributes;
		search: HTMLAttributes;
		slot: SlotHTMLAttributes;
		script: ScriptHTMLAttributes;
		section: HTMLAttributes;
		select: SelectHTMLAttributes;
		small: HTMLAttributes;
		source: SourceHTMLAttributes;
		span: HTMLAttributes;
		strong: HTMLAttributes;
		style: StyleHTMLAttributes;
		sub: HTMLAttributes;
		summary: HTMLAttributes;
		sup: HTMLAttributes;
		table: TableHTMLAttributes;
		template: HTMLAttributes;
		tbody: HTMLAttributes;
		td: TdHTMLAttributes;
		textarea: TextareaHTMLAttributes;
		tfoot: HTMLAttributes;
		th: ThHTMLAttributes;
		thead: HTMLAttributes;
		time: TimeHTMLAttributes;
		title: HTMLAttributes;
		tr: HTMLAttributes;
		track: TrackHTMLAttributes;
		u: HTMLAttributes;
		ul: HTMLAttributes;
		var: HTMLAttributes;
		video: VideoHTMLAttributes;
		wbr: HTMLAttributes;
		webview: WebViewHTMLAttributes;

		// SVG
		svg: SVGAttributes;

		animate: SVGAttributes; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
		animateMotion: SVGAttributes;
		animateTransform: SVGAttributes; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
		circle: SVGAttributes;
		clipPath: SVGAttributes;
		defs: SVGAttributes;
		desc: SVGAttributes;
		ellipse: SVGAttributes;
		feBlend: SVGAttributes;
		feColorMatrix: SVGAttributes;
		feComponentTransfer: SVGAttributes;
		feComposite: SVGAttributes;
		feConvolveMatrix: SVGAttributes;
		feDiffuseLighting: SVGAttributes;
		feDisplacementMap: SVGAttributes;
		feDistantLight: SVGAttributes;
		feDropShadow: SVGAttributes;
		feFlood: SVGAttributes;
		feFuncA: SVGAttributes;
		feFuncB: SVGAttributes;
		feFuncG: SVGAttributes;
		feFuncR: SVGAttributes;
		feGaussianBlur: SVGAttributes;
		feImage: SVGAttributes;
		feMerge: SVGAttributes;
		feMergeNode: SVGAttributes;
		feMorphology: SVGAttributes;
		feOffset: SVGAttributes;
		fePointLight: SVGAttributes;
		feSpecularLighting: SVGAttributes;
		feSpotLight: SVGAttributes;
		feTile: SVGAttributes;
		feTurbulence: SVGAttributes;
		filter: SVGAttributes;
		foreignObject: SVGAttributes;
		g: SVGAttributes;
		image: SVGAttributes;
		line: SVGAttributes;
		linearGradient: SVGAttributes;
		marker: SVGAttributes;
		mask: SVGAttributes;
		metadata: SVGAttributes;
		mpath: SVGAttributes;
		path: SVGAttributes;
		pattern: SVGAttributes;
		polygon: SVGAttributes;
		polyline: SVGAttributes;
		radialGradient: SVGAttributes;
		rect: SVGAttributes;
		set: SVGAttributes;
		stop: SVGAttributes;
		switch: SVGAttributes;
		symbol: SVGAttributes;
		text: SVGAttributes;
		textPath: SVGAttributes;
		tspan: SVGAttributes;
		use: SVGAttributes;
		view: SVGAttributes;
	}
}
