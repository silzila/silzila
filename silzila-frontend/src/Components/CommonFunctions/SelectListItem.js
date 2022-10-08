// This component is used to render more action icons onMouseOver a list item in DataHome component

import { useState } from "react";

export const SelectListItem = (props) => {
	const [open, setOpen] = useState(false);

	return props.render({ open, setOpen });
};
