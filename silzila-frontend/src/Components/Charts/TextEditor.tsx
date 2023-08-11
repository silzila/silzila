
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateRichText, updateRichTextOnAddingDYnamicMeasure,clearRichText } from "../../redux/ChartPoperties/ChartControlsActions";
import { addMeasureInTextEditor } from "../../redux/ChartPoperties/ChartPropertiesActions";
import {onCheckorUncheckOnDm} from '../../redux/DynamicMeasures/DynamicMeasuresActions'
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { Editor, Transforms, Range, createEditor, Descendant } from 'slate'
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused, 
} from 'slate-react';

//import { Portal } from '../components'
//import { MentionElement } from './custom-types'

const TextEditor = ({
	propKey,
	updateRichText,
	tabTileProps,
	chartProp,
	graphDimension,
	chartArea,
	graphTileSize,
	onCheckorUncheckOnDm,
	chartDetail,
	onMouseDown,
	dynamicMeasureState,
	addMeasureInTextEditor,
	updateRichTextOnAddingDYnamicMeasure,
  clearRichText
}:  any) => {
  const ref:any = useRef<HTMLDivElement | null>()
  const [target, setTarget] = useState<Range | undefined>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const renderElement = useCallback((props:any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props:any) => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withMentions(withReact(createEditor())),
    []
  )


  const [value, setValue] = useState(chartProp.properties[propKey]?.richText?.text || []);

  useEffect(() => {
		updateRichText(propKey, value);
		//updateRichTextOnAddingDYnamicMeasure(propKey, "");
	}, [value]);

	useEffect(() => {
    // let totalNodes = editor.children.length;

    // for (let i = 0; i < totalNodes - 1; i++) {
    //   Transforms.removeNodes(editor, {
    //       at: [totalNodes-i-1],
    //   });
    // }

		setValue(chartProp.properties[propKey]?.richText?.text ||[]);
	}, [chartProp.properties[propKey].richText]);

	useEffect(() => {
		if(chartProp.properties[propKey].measureValue?.id !== "")
		{
      clearRichText(propKey);

			let _measureValueCopy =  Object.assign({}, chartProp.properties[propKey]); 
      if(_measureValueCopy && _measureValueCopy.measureValue && _measureValueCopy.measureValue.value)
      {

        let _object:any =  {
          type: "mention",
          character:  _measureValueCopy.measureValue?.value?.text,
          children: [{ text: '' }],
          measureStyle: _measureValueCopy.measureValue.value?.style,
          id:_measureValueCopy.measureValue.id,
          propKey:propKey,
          onCheckorUncheckOnDm: onCheckorUncheckOnDm
        }

        Transforms.insertNodes(editor,[_object]);
        Transforms.move(editor)
      }
     
			//inserMention(thisEditor.current, _measureValueCopy.measureValue);
		}
	}, [chartProp.properties[propKey].measureValue?.id]);

  const chars:any =[];

  // useEffect(() => {
  //   if (target && chars.length > 0) {
  //     const el:any = ref.current
  //     const domRange = ReactEditor.toDOMRange(editor, target)
  //     const rect = domRange.getBoundingClientRect()
  //     el.style.top = `${rect.top + window.pageYOffset + 24}px`
  //     el.style.left = `${rect.left + window.pageXOffset}px`
  //   }
  // }, [chars.length, editor, index, search, target])

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(val) => {
        //const { selection } = editor
        updateRichText(propKey, val);
       // setTarget(null)
      }}
    >
      <Editable
        value={value}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text..."
        style={{"height":"200px"}}
      />
    </Slate>
  )
}

const withMentions = (editor:any) => {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = (element:any) => {
    return element.type === 'mention' ? true : isInline(element)
  }

  editor.isVoid = (element:any) => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.markableVoid = (element:any) => {
    return element.type === 'mention' || markableVoid(element)
  }

  return editor
}

const insertMention = (editor:any, character:any) => {
  const mention: any = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }:any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Element = (props:any) => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />
    default:
      return <div {...attributes}>{children}</div>
  }
}

const Mention = ({ attributes, children, element }:any) => {
  const ref:any = useRef<HTMLDivElement | null>()

  const selected = useSelected()
  const focused = useFocused()
  const style: any = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  }
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = 'bold'
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic'
  }

  Object.keys(element.measureStyle).forEach(_key=>{
    style[_key] = element.measureStyle[_key];
  })

  return (
    <div ref={ref} id={element.id} data-propkey={element.propKey} style={{"display":"inline"}}>
    <span 
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={style}
    >
      {element.character}
      {children}
    </span>
    <button  contentEditable={false} onClick={(e)=>{
      ref.current?.remove();
      if(element.onCheckorUncheckOnDm){
        let _parentDiv:any = e.currentTarget.closest('[data-propkey]') || {};

        element.onCheckorUncheckOnDm(_parentDiv.id, false, _parentDiv.getAttribute("data-propkey"),0,{});
      }
      }}><span  contentEditable={false}>X</span></button>
    </div>
  )
}


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
		onCheckorUncheckOnDm: (
				dmId: string,
				value: boolean,
				propKey: string,
				dmValue: any,
				styleObj: any
			) => dispatch(onCheckorUncheckOnDm(dmId, value, propKey, dmValue, styleObj)),
    clearRichText: (propKey: string) =>
			dispatch(clearRichText(propKey))
		// updateRichTextOnAddingDYnamicMeasure: (propKey: string, value: string) =>
		// 	dispatch(updateRichTextOnAddingDYnamicMeasure(propKey,value))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);