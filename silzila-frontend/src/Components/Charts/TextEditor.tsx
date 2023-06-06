import { Button } from "@mui/material";
import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { connect, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateRichText } from "../../redux/ChartPoperties/ChartControlsActions";
import { debounce } from "../ChartOptions/CommonFunctions/DebounceFunction";
import Delta from "quill-delta";
import { addMeasureInTextEditor } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { Quill } from "react-quill";
interface textEditorInterface {
	onMouseDown: () => void;
}

const modules = {
	toolbar: [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ script: "sub" }, { script: "super" }],
		["blockquote", "code-block"],
		[{ list: "ordered" }, { list: "bullet" }],
		[{ indent: "-1" }, { indent: "+1" }, { align: [] }],
		["link", "image", "video"],
		["link"],
		["clean"],
	],
	clipboard: {
		matchVisual: false,
	},
};

const dashboardModules = {
	clipboard: {
		matchVisual: false,
	},
};

const TextEditor = ({
	propKey,
	updateRichText,
	tabTileProps,
	chartProp,
	graphDimension,
	chartArea,
	graphTileSize,
	chartDetail,
	onMouseDown,
	dynamicMeasureState,
	addMeasureInTextEditor,
}: textEditorInterface & any) => {
	const [value, setValue] = useState(chartProp.properties[propKey].richText);

	var tileId = dynamicMeasureState.selectedTileId;
	var dmId = dynamicMeasureState.selectedDynamicMeasureId;
	var dmPropKey = `${tileId}.${dmId}`;

	useEffect(() => {
		updateRichText(propKey, value);
	}, [value]);

	useEffect(() => {
		setValue(chartProp.properties[propKey].richText);
	}, [chartProp.properties[propKey].richText]);

	const reactQuillRef: any = useRef();
	// useEffect(() => {
	// 	if (chartDetail[propKey].addMeasureInTextEditor) {
	// 		console.log("getCursor");
	// 		if (reactQuillRef) {
	// 			insertTextAtCursor("The Measure Value");
	// 		}
	// 	}
	// }, [chartDetail[propKey].addMeasureInTextEditor]);

	const insertTextAtCursor = (newText: any) => {
		const quillEditor = reactQuillRef.current.getEditor();
		const cursorPosition = quillEditor.getSelection().index;
		quillEditor.insertText(cursorPosition, newText, false);
		addMeasureInTextEditor(propKey, true);
	};

	return (
		<>
			{!tabTileProps.showDash ? (
				<ReactQuill
					ref={reactQuillRef}
					modules={modules}
					onChange={setValue}
					// value={delta}
					value={value}
					style={{ height: "90%" }}
					theme="snow"
					placeholder="Content goes here...."
				/>
			) : (
				<ReactQuill
					modules={dashboardModules}
					readOnly={true}
					value={value}
					theme="bubble"
					style={{
						padding: "5px",
						width: graphDimension.width,

						height: graphDimension.height,
						overflow: "hidden",
						margin: "auto",
						border: chartArea
							? "none"
							: graphTileSize
							? "none"
							: "1px solid rgb(238,238,238)",
					}}
				/>
			)}
		</>
	);
};

const mapStateToProps = (state: any) => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartDetail: state.chartProperties.properties,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateRichText: (propKey: string, value: any) => dispatch(updateRichText(propKey, value)),
		addMeasureInTextEditor: (propKey: string, chartValue: any) =>
			dispatch(addMeasureInTextEditor(propKey, chartValue)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
// const placeHolderContent: any = () => {
// 	return (
// 		<>
// 			{/* <h1 class="ql-align-center ql-indent-2">Content Header</h1> */}
// 			<p>
// 				{/* <span style="background-color: rgb(255, 255, 0);">Paragraph goes here...</span> */}
// 			</p>
// 			<ul>
// 				<li>This</li>
// 				<li>is</li>
// 				<li>List</li>
// 			</ul>
// 			<p>Another Paragraph</p>
// 			<ol>
// 				<li>Numbered</li>
// 				<li>List</li>
// 				<li>
// 					<a href="https://silzila.org" rel="noopener noreferrer" target="_blank">
// 						silzila
// 					</a>
// 				</li>
// 			</ol>
// 		</>
// 	);
// };
