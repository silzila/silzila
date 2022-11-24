// export const debounce = func => {
// 	let timer;
// 	return function (...args) {
// 		const context = this;
// 		if (timer) clearTimeout(timer);
// 		timer = setTimeout(() => {
// 			timer = null;
// 			func.apply(context, args);
// 		}, 1000);
// 	};
// };
import React from "react";

const DebounceFunction = () => {
	return <div>DebounceFunction</div>;
};

export default DebounceFunction;
