export const debounce = (func: any) => {
	let timer: any;
	return function (this: any, ...args: any) {
		// const context = this;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			func.apply(this, args);
		}, 1000);
	};
};
