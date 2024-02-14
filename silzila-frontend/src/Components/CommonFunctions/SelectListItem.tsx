import { useState } from "react";

// TODO: need to specify type
export const SelectListItem = (props: any) => {
	const [open, setOpen] = useState(false);

	return props.render({ open, setOpen });
};
