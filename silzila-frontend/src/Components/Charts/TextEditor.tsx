
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
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

import { Button, Icon, Toolbar } from '../CommonFunctions/TextEditorToolBar' ;
import {MdFormatBold,MdFormatItalic,MdFormatUnderlined,MdFormatListBulleted,MdFormatListNumbered,MdFormatAlignLeft,MdFormatAlignCenter,MdFormatAlignRight,MdFormatAlignJustify,MdFormatQuote} from 'react-icons/md';

import {
	setDynamicMeasureWindowOpen,
} from "../../redux/ChartPoperties/ChartPropertiesActions";

import {
	addNewDynamicMeasurePropsForSameTile,
	addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	deletingDynamicMeasure,
	onCheckorUncheckOnDm,
	setSelectedDynamicMeasureId,
	setSelectedTabIdInDynamicMeasureState,
	setSelectedTileIdInDynamicMeasureState,
	setSelectedToEdit,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";

const LIST_TYPES:any = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES:any = ['left', 'center', 'right', 'justify']

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
  clearRichText
}:  any) => {
  //const ref:any = useRef<HTMLDivElement | undefined>()
  const [target, setTarget] = useState<any>()
  const [index, setIndex] = useState(0)
  const [search, setSearch] = useState('')
  const renderElement = useCallback((props:any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props:any) => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withMentions(withReact(createEditor())),
    []
  )


const 	tabId = tabTileProps.selectedTabId, tileId = tabTileProps.selectedTileId;

  const initialValue:any = useMemo(()=>chartProp.properties[propKey]?.richText?.text || [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ],[]);
  
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
          showDash: tabTileProps.showDash
        }

       //ref?.current?.focus();

        // const { selection } = editor

        // const [start] = Range.edges(selection)

        // const wordBefore = Editor.before(editor, start, { unit: 'word' })
        // const before = wordBefore && Editor.before(editor, wordBefore)
        // const beforeRange = before && Editor.range(editor, before, start)
        // setTarget(beforeRange)

        //Transforms.select(editor, target)
        Transforms.insertNodes(editor,[_object]);
        Transforms.move(editor)
        setTarget(undefined)
      }
		}
	}, [chartProp.properties[propKey].measureValue?.id]);


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

  return (
    <>
      {
         !tabTileProps.showDash ?
         <Button 
         onClick={() => {
             setDynamicMeasureWindowOpen(propKey, true);
             onAddingNewDynamicMeaasure();
         }}
       >
         Add Dynamic Measure
     </Button>
     : null
      }
       
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(val) => {
          //const { selection } = editor

          const isAstChange = editor.operations.some(
            (op:any) => 'set_selection' !== op.type
          )

          if (isAstChange) {
            updateRichText(propKey, val);
            setTarget(undefined)
            console.log(val);
          }
        }}
      >
        {
          !tabTileProps.showDash ?
          <Toolbar>
          <BlockButton format="heading-one" icon="H1" />
            <BlockButton format="heading-two" icon="H2" />
            <MarkButton format="bold" icon={<MdFormatBold/>}/>
            <MarkButton format="italic" icon={<MdFormatItalic/>} />
            <MarkButton format="underline" icon={<MdFormatUnderlined/>} />
            <BlockButton format="numbered-list" icon={<MdFormatListNumbered/>} />
            <BlockButton format="bulleted-list" icon={<MdFormatListBulleted/>} />
            <BlockButton format="left" icon={<MdFormatAlignLeft/>} />
            <BlockButton format="center" icon={<MdFormatAlignCenter/>} />
            <BlockButton format="right" icon={<MdFormatAlignRight/>} />
            <BlockButton format="justify" icon={<MdFormatAlignJustify />} />
          </Toolbar>
          :null
        }
       
        <Editable
          readOnly={tabTileProps.showDash}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
          style={{"height":"200px"}}
        />
      </Slate>
    </>
  )
}


const BlockButton = ({ format, icon }:any) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }:any) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const toggleBlock = (editor:any, format:any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n:any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: any
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor:any, format:any) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor:any, format:any, blockType:any = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n:any) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor:any, format:any) => {
  const marks:any = Editor.marks(editor)
  return marks ? marks[format] === true : false
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
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };

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
      return <div {...attributes}>{children}</div>
  }
}

const Mention = ({ attributes, children, element }:any) => {
  //const ref:any = useRef<HTMLDivElement | undefined>()

  const selected = useSelected()
  const focused = useFocused()
  const style: any = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: 'lavender',
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

  // if(element.showDash){
  //   style.border  = 'dashed 1px grey';
  // }


  // Object.keys(element.measureStyle).forEach(_key=>{
  //   style[_key] = element.measureStyle[_key];
  // })

  return (
    <span 
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={style}
    >
      {element.character}
      {children}
    </span>
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
    clearRichText: (propKey: string) =>
			dispatch(clearRichText(propKey)),
      setDynamicMeasureWindowOpen: (propKey: string, chartValue: any) =>
			dispatch(setDynamicMeasureWindowOpen(propKey, chartValue)),
      addNewDynamicMeasurePropsFromNewTab: (
        tabId: number,
        tileId: number,
        dynamicMeasureId: number,
        dataset: any
      ) =>
        dispatch(addNewDynamicMeasurePropsFromNewTab(tabId, tileId, dynamicMeasureId, dataset)),
      addNewDynamicMeasurePropsFromNewTile: (
        tabId: number,
        tileId: number,
        dynamicMeasureId: number,
        dataset: any
      ) =>
        dispatch(
          addNewDynamicMeasurePropsFromNewTile(tabId, tileId, dynamicMeasureId, dataset)
        ),
      addNewDynamicMeasurePropsForSameTile: (
        tabId: number,
        tileId: number,
        dynamicMeasureId: number,
        dataset: any
      ) =>
        dispatch(
          addNewDynamicMeasurePropsForSameTile(tabId, tileId, dynamicMeasureId, dataset)
        ),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);