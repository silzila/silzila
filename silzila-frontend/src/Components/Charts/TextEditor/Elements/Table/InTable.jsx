import React from "react";
import Button from "../../common/Button";
import Icon from "../../common/Icon";
import { TableUtil } from "../../utils/table.js";

const InTable = ({ editor }) => {
  const table = new TableUtil(editor);

  const handleButtonClick = (action) => {
    switch (action) {
      case "row":
        table.insertRow();
        break;
      case "column":
        table.insertColumn();
        break;
      case "remove":
        table.removeTable();
        break;
      default:
        return;
    }
  };
  return (
    <>
      <Button format="insert row" onClick={() => handleButtonClick("row")}>
        <Icon icon="row" />
      </Button>
      <Button
        format="insert column"
        onClick={() => handleButtonClick("column")}
      >
        <Icon icon="column" />
      </Button>
      <Button format="remove table" onClick={() => handleButtonClick("remove")}>
        <Icon icon="removeTable" />
      </Button>
    </>
  );
};

export default InTable;
