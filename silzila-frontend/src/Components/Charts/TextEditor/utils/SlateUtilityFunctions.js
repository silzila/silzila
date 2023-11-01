import { Editor, Transforms, Element as SlateElement } from "slate";
import { ReactEditor } from "slate-react";

const alignment = ["alignLeft", "alignRight", "alignCenter"];
const list_types = ["orderedList", "unorderedList"];
export const sizeMap = {
  small: "0.75em",
  normal: "1em",
  medium: "1.75em",
  huge: "2.5em"
};
export const fontFamilyMap = {
  sans: "Helvetica,Arial, sans serif",
  serif: "Georgia, Times New Roaman,serif",
  monospace: "Monaco, Courier New,monospace"
};
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = list_types.includes(format);
  const isIndent = alignment.includes(format);
  const isAligned = alignment.some((alignmentType) =>
    isBlockActive(editor, alignmentType)
  );

  /*If the node is already aligned and change in indent is called we should unwrap it first and split the node to prevent
    messy, nested DOM structure and bugs due to that.*/
  if (isAligned && isIndent) {
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        alignment.includes(
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
        ),
      split: true
    });
  }

  /* Wraping the nodes for alignment, to allow it to co-exist with other block level operations*/
  if (isIndent) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: []
    });
    return;
  }
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      list_types.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });
  if (isList && !isActive) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: []
    });
  }
};
export const addMarkData = (editor, data) => {
  Editor.addMark(editor, data.format, data.value);
};
export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
  ReactEditor.focus(editor);
};
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  });

  return !!match;
};

export const activeMark = (editor, format) => {
  const defaultMarkData = {
    color: "black",
    bgColor: "black",
    fontSize: "normal",
    fontFamily: "sans"
  };
  const marks = Editor.marks(editor);
  const defaultValue = defaultMarkData[format];
  return marks?.[format] ?? defaultValue;
};
