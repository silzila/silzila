import { createStyles, makeStyles } from "@mui/styles";

export const SaveButtons = makeStyles({
	root: {
		width: 200,

		"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "#2bb9bb",
		},

		"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "#2bb9bb",
		},

		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "#2bb9bb",
		},
		// "& .MuiOutlinedInput-input": {
		// 	color: "green",
		// 	marginRigth: "10px",
		// },
		"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
			{
				padding: "2px 4px ",
				marginRight: "10px",
			},
		"& .MuiOutlinedInput-root": {
			fontSize: "14px",
			padding: "2px 5px",
			textAlign: "center",
			height: "40px",
			marginRight: "10px",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			color: "#2bb9bb",
		},
	},
});

export const FormLabelStyle = {
	// flex: "1",
	fontSize: "14px",
	margin: "5px",
	width: "50%",
	textAlign: "right",
};
export const TextFieldStyle = {
	style: {
		width: "170px",
		height: "25px",
		padding: "0px 10px",
		fontSize: "12px",
	},
};

export const TextFieldBorderStyle = {
	sx: {
		".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
			border: "2px solid rgba(224,224,224,1)",
		},
		"&:hover": {
			".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
				border: "2px solid rgba(224,224,224,1)",
			},
		},
		"&:not(:hover)": {
			".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
				border: "2px solid rgba(224,224,224,1)",
			},
		},
	},
};

export const styles = makeStyles({
	root: {
		width: 120,

		"& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(224,224,224,1)",
		},

		"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(224,224,224,1)",
		},

		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "rgba(224,224,224,1)",
		},

		"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
			{
				padding: "2px 4px ",
				marginRight: "10px",
			},
		"& .MuiOutlinedInput-root": {
			height: "20px",
			fontSize: "12px",
			padding: "2px 5px",
			textAlign: "center",
			marginRight: "10px",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		"& .MuiMenuItem-root": {
			padding: "4px",
			display: "flex",
			height: "20px",
			width: "100px",
		},
	},
	dialogTable: {
		"& .css-1ex1afd-MuiTableCell-root": {
			fontSize: "12px",
			padding: "4px",
		},
		"& .css-xn82ks-MuiTable-root": {
			border: "2px solid rgba(224,224,224,1)",
		},
	},
	dialogTitle: {
		"& .css-1pphz6g-MuiTypography-root-MuiDialogTitle-root": {
			padding: "6px 14px 6px 14px",
			color: "rgb(57, 56, 56)",
			fontSize: "16px",
			fontWeight: "bold",
		},
	},
});
export const useStyles: any = makeStyles((theme: any) =>
	createStyles({
		uploadButton: {
			textTransform: "none",
			color: "#303030",
			border: "2px solid rgba(224,224,224,1)",
			padding: "5px 20px",
			borderRadius: "0px",
		},
		tableHeader: {
			"& .MuiTableCell-root": {
				fontWeight: "bold",
				padding: "8px",
				borderRight: "1px solid rgba(224,224,224,1)",
				borderTop: "1px solid rgba(224,224,224,1)",
				textAlign: "center",
			},
			"& .MuiTableRow-root": {
				borderLeft: "1px solid rgba(224,224,224,1)",
			},
		},
		tableBody: {
			"& .MuiTableCell-root": {
				fontSize: "12px",
				padding: "6px 10px 6px 8px ",
				maxWidth: "250px",
				minWidth: "75px",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				overflow: "hidden",
				backgroundColor: "white",
				borderRight: "1px solid rgba(224,224,224,1)",
			},
		},
		visiblityIconStyle: {
			color: "grey",
			fontSize: "18px",
			marginLeft: "20px",
		},
	})
);

export const flatfilenamefield = {
	height: "40px",
	padding: "0px 10px",
	fontSize: "20px",
	fontWeight: "bold",

	color: "rgba(0, 0, 0, 0.6)",
};

export const infoIconStyle = {
	color: "#af99db",
	fontSize: "16px",
	marginRight: "5px",
	marginTop: "4px",
};

export const datatypeMenuItem = {
	width: "auto",
	overflow: "hidden",
	textOverflow: "ellipsis",
	fontSize: "12px",
};

export const ffButtonStyle = {
	backgroundColor: "white",
	textTransform: "none",
	height: "30px",
};

export const ffDialogTitle = {
	display: "flex",
	flexDirection: "row",
	columnGap: "2rem",
	justifyContent: "space-between",
	fontSize: "16px",
};
export const ffDialogTc = {
	fontWeight: "bold",
	backgroundColor: "#e8eaf6",
	padding: "4px",
	fontSize: "12px",
	color: "rgb(57, 56, 56)",
};
export const rowspancell = {
	verticalAlign: "top",
	fontSize: "12px",
	padding: "4px",
	borderRight: "2px solid rgba(224,224,224,1)",
	textAlign: "center",
};
