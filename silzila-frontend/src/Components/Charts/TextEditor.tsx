// import { Button } from "@mui/material";
// import { useCallback } from "react";
// import { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { connect, useDispatch } from "react-redux";
// import { updateRichText } from "../../redux/ChartProperties/actionsChartControls";
// import { debounce } from "../ChartOptions/CommonFunctions/DebounceFunction";

// const modules = {
// 	toolbar: [
// 		[{ font: [] }],
// 		[{ header: [1, 2, 3, 4, 5, 6, false] }],
// 		["bold", "italic", "underline", "strike"],
// 		[{ color: [] }, { background: [] }],
// 		[{ script: "sub" }, { script: "super" }],
// 		["blockquote", "code-block"],
// 		[{ list: "ordered" }, { list: "bullet" }],
// 		[{ indent: "-1" }, { indent: "+1" }, { align: [] }],
// 		// ["link", "image", "video"],
// 		["link"],
// 		["clean"],
// 	],
// 	// Clipboard: {
// 	// 	matchVisual: false,
// 	// },
// };

// const TextEditor = ({
// 	propKey,
// 	updateRichText,
// 	tabTileProps,
// 	chartProp,
// 	graphDimension,
// 	chartArea,
// 	graphTileSize,
// 	chartDetail,
// }) => {
// 	const [value, setValue] = useState(chartProp.properties[propKey].richText);

// 	useEffect(() => {
// 		updateRichText(propKey, value);
// 	}, [value]);

// 	const optimizedFn = useCallback(debounce(setValue), []);

// 	const placeHolderContent = () => {
// 		return (
// 			<>
// 				<h1 class="ql-align-center ql-indent-2">Content Header</h1>
// 				<p>
// 					<span style="background-color: rgb(255, 255, 0);">Paragraph goes here...</span>
// 				</p>
// 				<ul>
// 					<li>This</li>
// 					<li>is</li>
// 					<li>List</li>
// 				</ul>
// 				<p>Another Paragraph</p>
// 				<ol>
// 					<li>Numbered</li>
// 					<li>List</li>
// 					<li>
// 						<a href="https://silzila.org" rel="noopener noreferrer" target="_blank">
// 							silzila
// 						</a>
// 					</li>
// 				</ol>
// 			</>
// 		);
// 	};

// 	return (
// 		<>
// 			{!tabTileProps.showDash ? (
// 				<ReactQuill
// 					modules={modules}
// 					onChange={optimizedFn}
// 					// onChange={setValue}
// 					value={value}
// 					style={{ height: "90%" }}
// 					theme="snow"
// 					placeholder="Content goes here...."
// 				/>
// 			) : (
// 				<ReactQuill
// 					readOnly="true"
// 					value={value}
// 					theme="bubble"
// 					style={{
// 						padding: "5px",
// 						width: graphDimension.width,

// 						height: graphDimension.height,
// 						overflow: "hidden",
// 						margin: "auto",
// 						border: chartArea
// 							? "none"
// 							: graphTileSize
// 							? "none"
// 							: "1px solid rgb(238,238,238)",
// 					}}
// 				/>
// 			)}
// 		</>
// 	);
// };

// const mapStateToProps = state => {
// 	return {
// 		chartProp: state.chartControls,
// 		tabTileProps: state.tabTileProps,
// 		chartDetail: state.chartProperties.properties,
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return {
// 		updateRichText: (propKey, value) => dispatch(updateRichText(propKey, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
import React from "react";

const TextEditor = () => {
	return <div>TextEditor</div>;
};

export default TextEditor;
