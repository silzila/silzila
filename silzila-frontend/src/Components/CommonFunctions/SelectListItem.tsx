import { useState } from "react";

// TODO
export const SelectListItem = (props: any) => {
	const [open, setOpen] = useState(false);

	return props.render({ open, setOpen });
};
