import { useEffect, useState, useRef } from "react";
import ReactQuill  from "react-quill";
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateRichText, updateRichTextOnAddingDYnamicMeasure } from "../../redux/ChartPoperties/ChartControlsActions";
import { addMeasureInTextEditor } from "../../redux/ChartPoperties/ChartPropertiesActions";


interface textEditorInterface {
	onMouseDown: () => void;
}

const Quill = ReactQuill.Quill;
var Embed = Quill.import('blots/embed');

class Mention extends Embed {
    static create(value:any) {
        let node = super.create(value);
        node.innerHTML = value.measureValue;
        node.setAttribute('data-measure-value', value.measureValue);

		this._addRemovalButton(node);
        return node;
    }

    static value(domNode:any) {
        return {
            measureValue: domNode.getAttribute('data-measure-value')
        }
    }

	static _addRemovalButton(node:any) {
		const button = document.createElement('button');
		button.innerText = 'x';
		button.onclick = () => node.remove();
		button.contentEditable = 'false';
		node.appendChild(button);
	
		const span = document.createElement('span');
		span.innerText = ' ';
		node.appendChild(span);
	  }
}

Mention.blotName = 'mention';
Mention.className = 'mention';
Mention.tagName = 'SPAN';

Quill.register({
    'formats/mention': Mention
});


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
	updateRichTextOnAddingDYnamicMeasure
}: textEditorInterface & any) => {

	const thisEditor = useRef(null);
	const [value, setValue] = useState(chartProp.properties[propKey].richText);
  
	const inserMention = (thisEditor:any, measureVal:string) => {
	  const editor = thisEditor.getEditor();
	   let range = editor.getSelection();
	   let position = range ? range.index : 0;

	  var cObj = {measureValue : measureVal};
	  editor.insertEmbed(position,"mention",cObj);
	}

	useEffect(() => {
		updateRichText(propKey, value);
		updateRichTextOnAddingDYnamicMeasure(propKey, "");
	}, [value]);

	useEffect(() => {
		setValue(chartProp.properties[propKey].richText);
	}, [chartProp.properties[propKey].richText]);

	useEffect(() => {
		if(chartProp.properties[propKey].measureValue !== "")
		{
			let _measureValueCopy =  Object.assign({}, chartProp.properties[propKey]); 
			inserMention(thisEditor.current, _measureValueCopy.measureValue);
		}
	}, [chartProp.properties[propKey].measureValue]);

	return (
		<>
			{!tabTileProps.showDash ? (
				<ReactQuill
					ref={thisEditor}
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
		updateRichTextOnAddingDYnamicMeasure: (propKey: string, value: string) =>
			dispatch(updateRichTextOnAddingDYnamicMeasure(propKey,value))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);

