// Individual columns within tables displayed in canvas
// Each column has a drop interaction (used for creating arrows that define relation between tables)
// Only columns that have same datatype will be used for defining relations

import React, { useRef, useState } from "react";
import ConnectPointsWrapper from "./ConnectPointsWrapper";
import {
  Abc,
  AccessTime,
  CalendarToday,
  PriorityHigh,
  TagTwoTone,
} from "@mui/icons-material";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { connect } from "react-redux";
import {
  ArrowsProps,
  DataSetStateProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { CanvasTableColumnsProps } from "./CanvasTableColumnsProps";
import "./Dataset.css";
import { ArrowObj } from "./CanvasInterfaces";
import { AlertColor } from "@mui/material/Alert";
import ConnectsPointByColumn from "./ConnectsPointByColumn";
import { table } from "console";

const CanvasTableColumns = ({
  // props
  dragRef,
  columnName,
  itemType,
  itemId,
  tableName,
  table_uid,
  index,
  schema,
  checkRelationExists,
  table_Id,
  tableHasCustomQuery,
  //state
  arrows,
}: CanvasTableColumnsProps) => {
  const boxRef = useRef<HTMLDivElement | null>(null);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [severity, setseverity] = useState<AlertColor>("success");
  const [testMessage, setTestMessage] = useState<string>("");

  const itemTypeIcon = (type: string) => {
    switch (type) {
      case "Integer":
      case "integer":
        return <TagTwoTone style={{ height: "15px", width: "15px" }} />;

      case "Text":
      case "text":
        return <Abc style={{ height: "15px", width: "15px" }} />;

      case "Timestamp":
      case "timestamp":
        return <AccessTime style={{ height: "15px", width: "15px" }} />;

      case "Date":
      case "date":
        return <CalendarToday style={{ height: "15px", width: "15px" }} />;

      case "Decimal":
      case "decimal":
        return <PriorityHigh style={{ height: "15px", width: "15px" }} />;

      default:
        return null;
    }
  };

  // TODO: need to specify type for e
  const arrowDropped = (e: any) => {
    // TODO: Priority 10 - Check table arrow loop
    // Make sure the tables in a new connection doesn't already have a link between them
    // Eg., 			A -> B -> C
    // 					A -> D
    // A new connection between B & D  or C & D shouldn't happen

    // Check if both column types (Arrow start and end column) are of same dataType
    if (arrows.length === 0) {
      if (
        e.dataTransfer.getData("connectItemId") === itemId ||
        e.dataTransfer.getData("connectTableName") === tableName
      ) {
        if (e.dataTransfer.getData("schema") !== schema) {
          setupForRelation(e);
        }
      } else {
        setupForRelation(e);
      }
    } else {
      var oldRel: boolean = false;
      arrows.forEach((arr: ArrowsProps) => {
        if (
          (arr.start === e.dataTransfer.getData("connectItemId") &&
            arr.end === itemId) ||
          (arr.end === e.dataTransfer.getData("connectItemId") &&
            arr.start === itemId)
        ) {
          oldRel = true;
        }
      });

      if (!oldRel) {
        setupForRelation(e);
      }
    }
  };

  // TODO: need to specify type for e
  const setupForRelation = (e: any) => {
    if (e.dataTransfer.getData("connectItemType") !== itemType) {
      setOpenAlert(true);
      setseverity("warning");
      setTestMessage("Relationship can only build with same data types");
      setTimeout(() => {
        setOpenAlert(false);
        setTestMessage("");
      }, 4000);
    } else {
      if (e.dataTransfer.getData("connectTableName") !== tableName) {
        const refs: ArrowObj = {
          isSelected: true,

          startTableName: e.dataTransfer.getData("connectTableName"),
          startColumnName: e.dataTransfer.getData("connectColumnName"),
          start: e.dataTransfer.getData("connectItemId"),
          table1_uid: e.dataTransfer.getData("connecttableUid"),
          startSchema: e.dataTransfer.getData("schema"),
          startId: e.dataTransfer.getData("tableId"),

          endTableName: tableName,
          endColumnName: columnName,
          end: itemId,
          table2_uid: table_uid,
          endSchema: schema,
          endId: table_Id,
        };
        checkRelationExists(refs);
      }
    }
  };

  return (
    <div id={itemId} ref={boxRef} style={{
      cursor:tableHasCustomQuery ?"not-allowed" : "move"
    }}
    draggable={!tableHasCustomQuery} 
    onDragStart={(e) => {
      if(tableHasCustomQuery){
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("connectItemId", itemId);
      e.dataTransfer.setData("connectIndex", index.toString());
      e.dataTransfer.setData("connectTableName", tableName);
      e.dataTransfer.setData("connectColumnName", columnName);
      e.dataTransfer.setData("connectItemType", itemType);
      e.dataTransfer.setData("connecttableUid", table_uid);
      e.dataTransfer.setData("schema", schema);
      e.dataTransfer.setData("tableId", table_Id);
    }}

    >
      <div
        className="columnBox"
        id={itemId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => arrowDropped(e)}
      >
        <div className="columnItem">{itemTypeIcon(itemType)}</div>
        {/* {schema !== "" ? (
          <ConnectsPointByColumn
            {...{
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
              tableHasCustomQuery,
            }}
          />
        ) : (
          <div style={{ padding: "0 5px" }}>{columnName}</div>
        )} */}
  <ConnectsPointByColumn
            {...{
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
              tableHasCustomQuery,
            }}
          />
        <ConnectPointsWrapper
          {...{
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
          }}
        />
      </div>
      <NotificationDialog
        onCloseAlert={() => {
          setOpenAlert(false);
          setTestMessage("");
        }}
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
      />
    </div>
  );
};

const mapStateToProps = (state: DataSetStateProps, ownProps: any) => {
  return {
    arrows: state.dataSetState.arrows,
  };
};

export default connect(mapStateToProps, null)(CanvasTableColumns);
