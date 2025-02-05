// this component is used for draging the columns to put into dataset filter

import { useRef, useState } from "react";

interface ConnectPointsWrapperProps {
  itemId: string;
  dragRef: any;
  boxRef: any;
  index: number;
  itemType: string;
  columnName: string;
  tableName: string;
  table_uid: string;
  schema: string;
  table_Id: string;
  tableHasCustomQuery: boolean;
}

const ConnectsPointByColumn = ({
  itemId,
  dragRef,
  boxRef,
  index,
  itemType,
  columnName,
  tableName,
  table_uid,
  schema,
  table_Id,
  tableHasCustomQuery
}: ConnectPointsWrapperProps) => {
  // TODO: need to specify type
  const ref1 = useRef<any>(null);
  const [position, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);

  return (
    <div
      ref={ref1}
      draggable={!tableHasCustomQuery}
      style={{ padding: "0 5px", cursor:"move" }}
      onDragStart={(e) => {
        if (tableHasCustomQuery) {
          e.preventDefault();
          return;
        }
        setBeingDragged(true);

        e.dataTransfer.setData("connectItemId", itemId);
        e.dataTransfer.setData("connectIndex", index.toString());
        e.dataTransfer.setData("connectTableName", tableName);
        e.dataTransfer.setData("connectColumnName", columnName);
        e.dataTransfer.setData("connectItemType", itemType);
        e.dataTransfer.setData("connecttableUid", table_uid);
        e.dataTransfer.setData("schema", schema);
        e.dataTransfer.setData("tableId", table_Id);
      }}
      onDragEnd={() => {
        setPosition({});
        setBeingDragged(false);
      }}
      onDrag={(e) => {
        const { offsetTop, offsetLeft } = boxRef.current;
        const { x, y } = dragRef.current.state;
        setPosition({
          position: "fixed",
          left: e.clientX - x - offsetLeft,
          top: e.clientY - y - offsetTop,
          transform: "none",
          opacity: 0,
        });
      }}
    >
      {columnName}
    </div>
  );
};

export default ConnectsPointByColumn;
