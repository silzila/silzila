// This component is part of Table header in dataset create / edit page
// Allows to
// 	- remove table from canvas
// 	- rename table

import { Button, Popover } from "@mui/material";
import React from "react";
import data from "../DataSet/Data.json";

const ActionPopover = (props) => {
	const { open, setOpen, anchorEl, selectAction, tableData } = props;
	return (
		<>
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setOpen(false)}
			>
				<div style={{ padding: "10px 0", fontSize: "14px", minWidth: "5rem" }}>
					{tableData.isNewTable ? (
						<React.Fragment>
							{data.actions.map((act, i) => {
								return (
									<div key={i}>
										<Button
											sx={{
												textTransform: "none",
												backgroundColor: "transparent",
												cursor: "pointer",
												color: "black",
												fontSize: "13px",
												width: "100%",
												borderRadius: "0",

												"&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
											}}
											size="small"
											onClick={selectAction}
											id={act.id}
										>
											{act.actionName}
										</Button>
									</div>
								);
							})}
						</React.Fragment>
					) : (
						<Button
							sx={{
								textTransform: "none",
								backgroundColor: "transparent",
								cursor: "pointer",
								color: "black",
								fontSize: "13px",
								width: "100%",
								borderRadius: "0",

								"&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
							}}
							size="small"
							onClick={selectAction}
							id={2}
						>
							{"Rename"}
						</Button>
					)}
				</div>
			</Popover>
		</>
	);
};
export default ActionPopover;
