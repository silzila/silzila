// // Canvas component is part of Dataset Create / Edit page
// // List of tables selected in sidebar is displayed here
// // connections can be made between columns of different tables to define relationship in a dataset
import { useState } from "react";
import { connect } from "react-redux";
import "./Dataset.css";
import Xarrow, { Xwrapper } from "react-xarrows";
import CanvasTables from "./CanvasTables";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import BottomBar from "./BottomBar";
import {
  ArrowsProps,
  DataSetStateProps,
  tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { CanvasProps } from "./CanvasInterfaces";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CloseIcon from "@mui/icons-material/Close";
import ShortUniqueId from "short-unique-id";
import UserFilterDataset from "./UserFilterDataset";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { dataSetFilterArrayProps } from "./UserFilterDatasetInterfaces";

const Canvas = ({
  // state
  tempTable,
  arrows,
  dsId,
  //props
  editMode,
}: CanvasProps) => {
  const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
  const [existingArrowProp, setExistingArrowProp] = useState<{}>({});
  const [existingArrow, setExistingArrow] = useState<boolean>(false);
  const [isDataSetVisible, setIsDataSetVisible] = useState<boolean>(false);
  const [disPlayName, setDisplayName] = useState<string>("");
  const [uid, setUid] = useState<any>();
  const [tableId, setTableId] = useState<string>("");
  const [dataType, setDataType] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [dataSetFilterArray, setDataSetFilterArray] = useState<
    dataSetFilterArrayProps[]
  >([]);
  //   // When arrow is clicked, open relationship Popover
  const clickOnArrowfunc = (index: number) => {
    setExistingArrow(true);
    const temp = arrows.filter((el: ArrowsProps, i: number) => i === index)[0];
    setExistingArrowProp(temp);
    setShowRelationCard(true);
  };

  const handleDrop = (e: any) => {
    e.stopPropagation();
    console.log(e.dataTransfer);

    const refs = {
      isSelected: true,
      index: e.dataTransfer.getData("connectIndex"),
      dataType: e.dataTransfer.getData("connectitemtype"),
      startTableName: e.dataTransfer.getData("connectTableName"),
      startColumnName: e.dataTransfer.getData("connectColumnName"),
      start: e.dataTransfer.getData("connectItemId"),
      table1_uid: e.dataTransfer.getData("connecttableUid"),
      schema: e.dataTransfer.getData("schema"),
      startId: e.dataTransfer.getData("tableId"),
    };
    console.log(refs);
    const uid: any = new ShortUniqueId({ length: 4 });

    const field = {
      tableId: refs.startId,
      fieldName: refs.startColumnName,
      dataType: refs.dataType,
      displayName: refs.startColumnName,
      uid: uid(),
      tableName: refs.startTableName,
    };
    setTableName(field.tableName);
    setDisplayName(field.displayName);
    setUid(field.uid);
    setTableId(field.tableId);
    setDataType(field.dataType);
    setDataSetFilterArray((prev) => [...prev, field]);
  };
  //   // TODO need to specify type
  const RenderArrows: any = () => {
    return (
      arrows &&
      arrows.map((ar: ArrowsProps, index: number) => (
        <div
          className="arrowIcon"
          id="arr"
          onClick={() => clickOnArrowfunc(index)}
          key={index}
        >
          <Xarrow
            start={ar.start}
            end={ar.end}
            color="#af99db"
            strokeWidth={2}
            showHead={ar.showHead}
            showTail={ar.showTail}
            key={index}
          />
        </div>
      ))
    );
  };

  return (
    <div className="canvas">
      <div
        className="canvasStyle"
        id="canvasTableArea"
        style={{ width: !isDataSetVisible ? "100%" : "calc(99% - 15vw)" }}
      >
        <Xwrapper>
          {tempTable &&
            tempTable.map((table: tableObjProps) => (
              <div className="draggable-component" key={table.id}>
                <CanvasTables tableData={table} />
              </div>
            ))}
        </Xwrapper>

        {isDataSetVisible === false && (
          <ArrowBackRoundedIcon
            onClick={() => setIsDataSetVisible(!isDataSetVisible)}
            className="IconDataset"
          />
        )}

        {isDataSetVisible ? (
          <div
            className="filter_dataset"
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div style={{ width: "100%", marginRight: "5%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "auto auto",
                }}
              >
                <FilterListIcon />
                <h4 style={{ display: "inline", margin: "0 0 0 8px" }}>
                  Filter Dataset
                </h4>
                <div>
                  <CloseIcon
                    className="IconDataset"
                    style={{ right: "92%", top: "0px", zIndex: "999" }}
                    onClick={() => setIsDataSetVisible(!isDataSetVisible)}
                  />
                </div>
              </div>
              {dataSetFilterArray.length > 0 && (
                <UserFilterDataset
                  editMode={editMode}
                  dataType={dataType}
                  tableName={tableName}
                  tableId={tableId}
                  uid={uid}
                  displayName={disPlayName}
                  dbConnectionId={tempTable[0].dcId}
                  dataSetFilterArray={dataSetFilterArray}
                  setDataSetFilterArray={setDataSetFilterArray}
                />
              )}
            </div>
          </div>
        ) : null}
        <RenderArrows />
      </div>
      <BottomBar editMode={editMode ? editMode : false} />

      <RelationshipDefiningComponent
        id="idarrow"
        showRelationCard={showRelationCard}
        setShowRelationCard={setShowRelationCard}
        existingArrowProp={existingArrowProp}
        existingArrow={existingArrow}
        setExistingArrow={setExistingArrow}
        setExistingArrowProp={setExistingArrowProp}
      />
    </div>
  );
};

const mapStateToProps = (
  state: DataSetStateProps & isLoggedProps,
  ownProps: any
) => {
  return {
    tempTable: state.dataSetState.tempTable,
    arrows: state.dataSetState.arrows,
    dsId: state.dataSetState.dsId,
  };
};

export default connect(mapStateToProps, null)(Canvas);
