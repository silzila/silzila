import { useState } from "react";

// TODO: need to specify type
export const SelectListItem = (props: any) => {
	// console.log(props);
	const [open, setOpen] = useState(false);

	return props.render({ open, setOpen });
};
