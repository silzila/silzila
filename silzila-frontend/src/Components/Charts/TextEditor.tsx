
import "react-quill/dist/quill.snow.css";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateRichText, updateRichTextOnAddingDYnamicMeasure,clearRichText } from "../../redux/ChartPoperties/ChartControlsActions";
import { addMeasureInTextEditor } from "../../redux/ChartPoperties/ChartPropertiesActions";
import {onCheckorUncheckOnDm} from '../../redux/DynamicMeasures/DynamicMeasuresActions'
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


const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

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

  const initialValue:any = useMemo(()=>chartProp.properties[propKey]?.richText?.text || [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ],[]);
  
  const [value, setValue] = useState(chartProp.properties[propKey]?.richText?.text || []);

  useEffect(() => {
		updateRichText(propKey, value);
    setTarget(undefined)
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
    setTarget(undefined)
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
        setTarget(undefined)
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
      initialValue={initialValue}
      onChange={(val) => {
        //const { selection } = editor
        setValue(val);
        setTarget(undefined)
       console.log(val);
      }}
    >
       <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        <BlockButton format="justify" icon="format_align_justify" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text..."
        style={{"height":"200px"}}
      />
    </Slate>
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
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
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

const isBlockActive = (editor:any, format:any, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
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