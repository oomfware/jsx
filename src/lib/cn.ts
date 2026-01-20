import type { ClassValue } from './intrinsic-elements.js';

/**
 * concatenates class values into a single space-separated string
 * @param values class values to concatenate
 * @returns concatenated class string, or empty string if no truthy values
 */
export function cn(values: ClassValue[]): string {
	const len = values.length;

	let idx = 0;
	let str = '';
	let val: ClassValue;

	for (; idx < len; idx++) {
		if ((val = values[idx])) {
			if (typeof val !== 'string') {
				val = cn(val);
			}

			str = str ? str + ' ' + val : val;
		}
	}

	return str;
}
