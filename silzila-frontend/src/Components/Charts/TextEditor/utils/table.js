import { Transforms, Editor, Range, Element } from "slate";

export class TableUtil {
  constructor(editor) {
    this.editor = editor;
  }

  insertTable = (rows, columns) => {
    const [tableNode] = Editor.nodes(this.editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      mode: "highest"
    });

    if (tableNode) return;
    if (!rows || !columns) {
      return;
    }
    const cellText = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => "")
    );
    const newTable = createTableNode(cellText);

    Transforms.insertNodes(this.editor, newTable, {
      mode: "highest"
    });
    Transforms.insertNodes(
      this.editor,
      { type: "paragraph", children: [{ text: "" }] },
      { mode: "highest" }
    );
  };

  insertCells = (tableNode, path, action) => {
    let existingText = Array.from(tableNode.children, (rows) =>
      Array.from(rows.children, (arr) => arr.children[0].text)
    );
    const columns = existingText[0].length;
    if (action === "row") {
      existingText.push(Array(columns).fill(""));
    } else {
      existingText = Array.from(existingText, (item) => {
        item.push("");
        return item;
      });
    }
    const newTable = createTableNode(existingText);
    Transforms.insertNodes(this.editor, newTable, {
      at: path
    });
  };

  removeTable = () => {
    Transforms.removeNodes(this.editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      mode: "highest"
    });
  };

  insertRow = () => {
    const { selection } = this.editor;
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(this.editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "table"
      });
      if (tableNode) {
        const [oldTable, path] = tableNode;
        this.removeTable();
        this.insertCells(oldTable, path, "row");
      }
    }
  };

  insertColumn = () => {
    const { selection } = this.editor;
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(this.editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "table"
      });
      if (tableNode) {
        const [oldTable, path] = tableNode;
        this.removeTable();
        this.insertCells(oldTable, path, "columns");
      }
    }
  };
}

const createRow = (cellText) => {
  const newRow = Array.from(cellText, (value) => createTableCell(value));
  return {
    type: "table-row",
    children: newRow
  };
};

const createTableCell = (text) => {
  return {
    type: "table-cell",
    children: [{ text }]
  };
};

const createTableNode = (cellText) => {
  const tableChildren = Array.from(cellText, (value) => createRow(value));
  let tableNode = { type: "table", children: tableChildren };
  return tableNode;
};
