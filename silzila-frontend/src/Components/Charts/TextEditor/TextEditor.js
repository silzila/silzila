
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import './TextEditor.css';
import { updateRichText, updateRichTextOnAddingDYnamicMeasure,clearRichText } from "../../../redux/ChartPoperties/ChartControlsActions";
import { addMeasureInTextEditor } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { Editor, Transforms, Range, createEditor, Descendant, Element as SlateElement, } from 'slate'
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSelected,
  useFocused, 
  useSlate
} from 'slate-react';
import {
	Button,
} from "@mui/material";

import {
	setDynamicMeasureWindowOpen,
} from "../../../redux/ChartPoperties/ChartPropertiesActions";

import {
	addNewDynamicMeasurePropsForSameTile,
	addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	
	setSelectedDynamicMeasureId,
	setSelectedTabIdInDynamicMeasureState,
	setSelectedTileIdInDynamicMeasureState,
	setSelectedToEdit,
} from "../../../redux/DynamicMeasures/DynamicMeasuresActions";
import Toolbar from './Toolbar/Toolbar';
import { sizeMap, fontFamilyMap } from './utils/SlateUtilityFunctions'
import Link from'./Elements/Link/Link'
import Image from './Elements/Image/Image'
import Video from './Elements/Video/Video'

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const TextEditor = ({
	propKey,
  graphDimension,
	updateRichText,
	tabTileProps,
	chartProp,
	dynamicMeasureState,

  setDynamicMeasureWindowOpen,
  addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	addNewDynamicMeasurePropsForSameTile,
  setSelectedDynamicMeasureId,
	setSelectedTabIdForDM,
	setSelectedTileIdForDM,
	setSelectedToEdit,
  clearRichText
}:any) => {
  // const [target, setTarget] = useState()
  // const [index, setIndex] = useState(0)
  // const [search, setSearch] = useState('')
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const [position, setPosition] = useState(JSON.parse(localStorage.getItem('cursor')));
	//const [isbgColorPopoverOpen, setbgColorPopOverOpen] = useState(false);

 
  const withMentions = (editor) => {
    const { isInline, isVoid, markableVoid } = editor
  
    editor.isInline = (element) => {
      return element.type === 'mention' ? true : isInline(element)
    }
  
    editor.isVoid = (element) => {
      return element.type === 'mention' ? true : isVoid(element)
    }
  
    editor.markableVoid = (element) => {
      return element.type === 'mention' || markableVoid(element)
    }
  
    return editor
  }

  const editor = useMemo(
    () => withMentions(withReact(createEditor())),
    []
  )

  // const focused = useFocused()
  // console.log(focused);


const 	tabId = tabTileProps.selectedTabId, tileId = tabTileProps.selectedTileId;

  const initialValue = useMemo(()=>chartProp.properties[propKey]?.richText?.text || [
    {
      type: 'paragraph',
      children: [{ text: 'Enter some text...' }],
    },
  ],[]);
  
	useEffect(() => {
    try{
      if(chartProp.properties[propKey].measureValue?.id !== "")
      {
        clearRichText(propKey);
      // Transforms.select(editor, { offset: 0, path: [0, 0] });
      
        let _measureValueCopy =  Object.assign({}, chartProp.properties[propKey]); 
        if(_measureValueCopy && _measureValueCopy.measureValue && _measureValueCopy.measureValue.value)
        {

          let _object =  {
            type: "mention",
            character:  _measureValueCopy.measureValue?.value?.text,
            children: [{ text: '' }],
            measureStyle: _measureValueCopy.measureValue.value?.style,
            id:_measureValueCopy.measureValue.id,
            propKey:propKey,
            showDash: tabTileProps.showDash
          }

        
          if(ReactEditor.isFocused){
            Transforms.insertNodes(editor,[_object], position);
          }

        
          ReactEditor.focus(editor);
        }
      }
  }
  catch(error){
    console.error(error);
  }
	}, [chartProp.properties[propKey].measureValue?.id]);


  useEffect(() => {
    ReactEditor.focus(editor);
  },[])


  const onAddingNewDynamicMeaasure = () => {
		if (dynamicMeasureState.dynamicMeasureList) {
			if (dynamicMeasureState.dynamicMeasureList.hasOwnProperty(tabId)) {
				if (dynamicMeasureState.dynamicMeasureList[tabId].hasOwnProperty(tileId)) {
					var totalMeasures =
						dynamicMeasureState.dynamicMeasureProps[tabId][tileId].totalDms;

					addNewDynamicMeasurePropsForSameTile(
						tabId,
						tileId,
						totalMeasures + 1,
						...tabTileProps.selectedDataSetList
					);
				} else {
					addNewDynamicMeasurePropsFromNewTile(
						tabId,
						tileId,
						1,
						...tabTileProps.selectedDataSetList
					);
				}
			} else {
				addNewDynamicMeasurePropsFromNewTab(
					tabId,
					tileId,
					1,
					...tabTileProps.selectedDataSetList
				);
			}
		} else {
			addNewDynamicMeasurePropsFromNewTab(
				tabId,
				tileId,
				1,
				...tabTileProps.selectedDataSetList
			);
		}
	};


// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }) => {
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

  if(leaf.superscript){
    children = <sup>{children}</sup>
    }
    if(leaf.subscript){
        children = <sub>{children}</sub>
    }

    if(leaf.strikethrough){
      children = <span style={{textDecoration:'line-through'}}>{children}</span>
    }

    if(leaf.color){
      children = <span style={{color:leaf.color}}>{children}</span>
  }
    if(leaf.bgColor){
        children = <span style={{backgroundColor:leaf.bgColor}}>{children}</span>
    }
    if(leaf.fontSize){
        const size = sizeMap[leaf.fontSize]
        children = <span style={{fontSize:size}}>{children}</span>
    }
    if(leaf.fontFamily){
        const family = fontFamilyMap[leaf.fontFamily]
        children = <span style={{fontFamily:family}}>{children}</span>
    }
    

  return <span {...attributes}>{children}</span>
}

const Element = (props) => {
  const { attributes, children, element } = props;
  let align = 'left';

  switch(element.type){
    case 'mention':
      return <Mention {...props} />
    case 'headingOne':
        return <h1 {...attributes}>{children}</h1>
    case 'headingTwo':
        return <h2 {...attributes}>{children}</h2>
    case 'headingThree':
        return <h3 {...attributes}>{children}</h3>
    case 'blockquote':
        return <blockquote {...attributes}>{children}</blockquote>
    case 'alignLeft':
        //align = 'left';
        return <div style={{textAlign:'left',listStylePosition:'inside'}} {...attributes}>{children}</div>
    case 'alignCenter':
        //align = 'center';
        return <div style={{textAlign:'center',listStylePosition:'inside'}} {...attributes}>{children}</div>
    case 'alignRight':
        //align = 'right';
        return <div style={{textAlign:'right',listStylePosition:'inside'}} {...attributes}>{children}</div>
    case 'list-item':
        return  <li {...attributes}>{children}</li>
    case 'orderedList':
        return <ol type='1' {...attributes}>{children}</ol>
    case 'unorderedList':
        return <ul {...attributes}>{children}</ul>
    case 'link':
        return <Link {...props}/>
   
    case 'table':
        return <table>
            <tbody {...attributes}>{children}</tbody>
        </table>
    case 'table-row':
        return <tr {...attributes}>{children}</tr>
    case 'table-cell':
        return <td style={{textAlign: align || 'left',listStylePosition:'inside'}} {...attributes}>{children}</td>
    case 'image':
        return <Image {...props}/>
    case 'video':
        return <Video {...props}/>
    default :
        return <p {...attributes}>{children}</p>
}
}


const Mention = ({ attributes, children, element }) => {

  const selected = useSelected()
  const focused = useFocused()
  const style = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0px 1px 1px 2px #B4D5FF' : 'none',
    
  }
  // See if our empty text child has any styling marks applied and apply those
  if (element.measureStyle.isBold) {
    style.fontWeight = 'bold'
  }

  if (element.measureStyle.isItalic) {
    style.fontStyle = 'italic'
  }

  if (element.measureStyle.fontColor) {
    style.color = element.measureStyle.fontColor;
  }

  if (element.measureStyle.isUnderlined) {
    style.textDecoration = 'underline';
  }

if (element.measureStyle.backgroundColor != 'white') {
    style.backgroundColor = element.measureStyle.backgroundColor;
  }

     style.border  = 'dashed 1px grey';

     style.cursor =  "pointer";


  return (
    <span 
      {...attributes}
      contentEditable={false}
      style={style}
      onClick={e=>{
        if(!tabTileProps.showDash){
          const { selection } = editor

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection)
            const wordBefore = Editor.before(editor, start, { unit: 'word' })
            const after = Editor.after(editor, start)
  
            localStorage.setItem('cursor', JSON.stringify({
              at: {
                anchor: wordBefore,
                focus: after,
              },
            }))
          }
         
          let tabId = element.propKey.split('.')[0];
          let tileId = element.propKey.split('.')[1];
          let dmId = element.id.replace("RichTextID","");
          setSelectedTabIdForDM(tabId);
            setSelectedTileIdForDM(tileId);
            setSelectedDynamicMeasureId(dmId);
            setSelectedToEdit(
              tabId,
              tileId,
              dmId,
              true
            );
            setDynamicMeasureWindowOpen(propKey, true);
        }
      }}
    >
      {element.character}
      {children}
    </span>
  )
}

  return (
    <div className="slate">
      <Slate 
        
        editor={editor}
        initialValue={initialValue}
        onChange={(val) => {
          const { selection } = editor

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection)

            localStorage.setItem('cursor', JSON.stringify({
              at: start
            }))
          }

          const isAstChange = editor.operations.some(
            (op) => 'set_selection' !== op.type
          )

          if (isAstChange) {
            updateRichText(propKey, val);
            //setTarget(undefined)
          }
        }}
      >
        {
          !tabTileProps.showDash ?
          <div style={{"display":"block",  "width":"100%"}}>
        
          <Toolbar propKey={propKey} setDynamicMeasureWindowOpen={setDynamicMeasureWindowOpen} onAddingNewDynamicMeaasure={onAddingNewDynamicMeaasure} />
         
           
         </div>
          :null
        }
       
        <Editable
          readOnly={tabTileProps.showDash}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
        
          style={{
            minHeight: 'auto',
            border: "1px solid rgb(222, 222, 222)",
            padding: '2px 2px 2px 12px'
          }}
        />
      </Slate>
    </div>
  )
}



const mapStateToProps = (state) => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartDetail: state.chartProperties.properties,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateRichText: (propKey, value) => dispatch(updateRichText(propKey, value)),
		addMeasureInTextEditor: (propKey, chartValue) =>
			dispatch(addMeasureInTextEditor(propKey, chartValue)),
    clearRichText: (propKey) =>
			dispatch(clearRichText(propKey)),
      setDynamicMeasureWindowOpen: (propKey, chartValue) =>
			dispatch(setDynamicMeasureWindowOpen(propKey, chartValue)),
      addNewDynamicMeasurePropsFromNewTab: (
        tabId,
        tileId,
        dynamicMeasureId,
        dataset
      ) =>
        dispatch(addNewDynamicMeasurePropsFromNewTab(tabId, tileId, dynamicMeasureId, dataset)),
      addNewDynamicMeasurePropsFromNewTile: (
        tabId,
        tileId,
        dynamicMeasureId,
        dataset
      ) =>
        dispatch(
          addNewDynamicMeasurePropsFromNewTile(tabId, tileId, dynamicMeasureId, dataset)
        ),
      addNewDynamicMeasurePropsForSameTile: (
        tabId,
        tileId,
        dynamicMeasureId,
        dataset
      ) =>
        dispatch(
          addNewDynamicMeasurePropsForSameTile(tabId, tileId, dynamicMeasureId, dataset)
        ),

        setSelectedTileIdForDM: (tileId) =>
			dispatch(setSelectedTileIdInDynamicMeasureState(tileId)),
		setSelectedTabIdForDM: (tabId) =>
			dispatch(setSelectedTabIdInDynamicMeasureState(tabId)),
      setSelectedDynamicMeasureId: (dmId) => dispatch(setSelectedDynamicMeasureId(dmId)),
     
		setSelectedToEdit: (tabId, tileId, dmId, value) =>
			dispatch(setSelectedToEdit(tabId, tileId, dmId, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);