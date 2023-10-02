
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import './TextEditor.css';
import { Dispatch } from "redux";
import { updateRichText, updateRichTextOnAddingDYnamicMeasure,clearRichText } from "../../redux/ChartPoperties/ChartControlsActions";
import { addMeasureInTextEditor } from "../../redux/ChartPoperties/ChartPropertiesActions";
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

import { ToolBarButton, Icon, Toolbar } from '../CommonFunctions/TextEditorToolBar' ;
import {MdFormatStrikethrough,MdCode,MdFormatQuote,MdLooksOne,MdLooksTwo, MdFormatBold,MdFormatItalic,MdFormatUnderlined,MdFormatListBulleted,MdFormatListNumbered,MdFormatAlignLeft,MdFormatAlignCenter,MdFormatAlignRight,MdFormatAlignJustify} from 'react-icons/md';

import { FaSuperscript,FaSubscript } from 'react-icons/fa'

import {
	setDynamicMeasureWindowOpen,
} from "../../redux/ChartPoperties/ChartPropertiesActions";

import {
	addNewDynamicMeasurePropsForSameTile,
	addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	
	setSelectedDynamicMeasureId,
	setSelectedTabIdInDynamicMeasureState,
	setSelectedTileIdInDynamicMeasureState,
	setSelectedToEdit,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

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
	updateRichTextOnAddingDYnamicMeasure,
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
  const [target, setTarget] = useState()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const [position, setPosition] = useState(JSON.parse(localStorage.getItem('cursor')));


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
      children: [{ text: 'A line of text in a paragraph.' }],
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

  

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolBarButton
   
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </ToolBarButton>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <ToolBarButton
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </ToolBarButton>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? 'left' : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}




const insertMention = (editor, character) => {
  const mention = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

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
    // if(leaf.fontSize){
    //     const size = sizeMap[leaf.fontSize]
    //     children = <span style={{fontSize:size}}>{children}</span>
    // }
    // if(leaf.fontFamily){
    //     const family = fontFamilyMap[leaf.fontFamily]
    //     children = <span style={{fontFamily:family}}>{children}</span>
    // }
    

  return <span {...attributes}>{children}</span>
}

const Element = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align || 'left' };

  switch (element.type) {
    case 'mention':
      return <Mention {...props} />
      case 'block-quote':
        return (
          <blockquote style={style} {...attributes}>
            {children}
          </blockquote>
        )
      case 'bulleted-list':
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        )
      case 'heading-one':
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        )
      case 'list-item':
        return (
          <li style={style} {...attributes}>
            {children}
          </li>
        )
      case 'numbered-list':
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        )
    default:
      return <p style={style} {...attributes}>{children}</p>
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
    <>
      <Slate
      onFocus={(event, editor, next) => {

        setTimeout(() => {
          // Change editor state here.
        });    
    
        return next();
      }}
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
            setTarget(undefined)
          }
        }}
      >
        {
          !tabTileProps.showDash ?
          <div style={{"display":"block",  "width":"100%"}}>
            <Toolbar>
              <MarkButton format="bold" icon={<MdFormatBold/>}/>
              <MarkButton format="italic" icon={<MdFormatItalic/>} />
              <MarkButton format="underline" icon={<MdFormatUnderlined/>} />
              <MarkButton format="strikethrough" icon={<MdFormatStrikethrough/>} />
              <MarkButton format="superscript" icon={<FaSuperscript/>} />
              <MarkButton format="subscript"  icon={<FaSubscript/>} />
              
              <BlockButton format="heading-one" icon={<MdLooksOne/>} />
              <BlockButton format="heading-two" icon={<MdLooksTwo/>} />
              <BlockButton format="block-quote" icon={<MdFormatQuote/>} />
              <BlockButton format="numbered-list" icon={<MdFormatListNumbered/>} />
              <BlockButton format="bulleted-list" icon={<MdFormatListBulleted/>} />
              <BlockButton format="left" icon={<MdFormatAlignLeft/>} />
              <BlockButton format="center" icon={<MdFormatAlignCenter/>} />
              <BlockButton format="right" icon={<MdFormatAlignRight/>} />
            
            </Toolbar>
            <Button style={{"float":"right", "marginTop":"-50px", "height":"30px"}}
            sx={{
              textTransform: "none",
              backgroundColor: "rgb(43, 185, 187)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgb(43, 185, 187)",
              },
            }}
            onClick={() => {

            ReactEditor.focus(editor);
          //  Transforms.select(editor, { offset: 0, path: [0, 0] });

                setDynamicMeasureWindowOpen(propKey, true);
                onAddingNewDynamicMeaasure();
            }}
            >
            Add Dynamic Measure
          </Button>
         </div>
          :null
        }
       
        <Editable
          readOnly={tabTileProps.showDash}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
        
          style={{
            minHeight: '300px',
            border: "1px solid rgb(222, 222, 222)",
            padding: '2px 2px 2px 12px'
          }}
        />
      </Slate>
    </>
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