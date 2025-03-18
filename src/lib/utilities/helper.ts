export function handleEnterKey(fn : (event : Event) => void) {
	return function(event : Event) {
		if ((event as KeyboardEvent).key === 'Enter') {
			fn.call(this, event);
		}
	};
}

export function preventDefault(fn : (event : Event) => void) {
	return function(event : Event) {
		event.preventDefault();

		fn.call(this, event);
	};
}
