// // Canvas component is part of Dataset Create / Edit page
// // List of tables selected in sidebar is displayed here
// // connections can be made between columns of different tables to define relationship in a dataset
import { useState } from "react";
import { connect } from "react-redux";
import "./Dataset.css";
import Xarrow, { Xwrapper } from "react-xarrows";
import CanvasTables from "./CanvasTables";
import filterIcon from "../../assets/filter_icon.svg";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import BottomBar from "./BottomBar";
import collapsedSidebar from "../../assets/sidebar-collapse.svg";
import {
  ArrowsProps,
  DataSetStateProps,
  tableObjProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { CanvasProps } from "./CanvasInterfaces";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShortUniqueId from "short-unique-id";
// import UserFilterDataset from "./UserFilterDataset";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import UserFilterDataset from "./UserFilterDataset";
import { IFilter } from "./BottomBarInterfaces";
import { IFlatIdTableIdMap } from "./EditDataSetInterfaces";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { AlertColor } from "@mui/material";

const Canvas = ({
  // state
  tempTable,
  arrows,
  dsId,
  flatFileIdMap,
  //props
  editMode = false,
  EditFilterdatasetArray,
  //dispatch
  addFilter,
}: CanvasProps) => {
  const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
  const [existingArrowProp, setExistingArrowProp] = useState<{}>({});
  const [existingArrow, setExistingArrow] = useState<boolean>(false);
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [severity, setseverity] = useState<AlertColor>("success");
    const [testMessage, setTestMessage] = useState<string>("");
  
  const [isDataSetVisible, setIsDataSetVisible] = useState<boolean>(
    EditFilterdatasetArray.length > 0 ? true : false
  );
  const [tableFlatFileMap, setTableFlatFileMap] =
    useState<IFlatIdTableIdMap[]>(flatFileIdMap);
  const [filtersOfDataset, setFiltersOfDataset] = useState<IFilter[]>(
    JSON.parse(JSON.stringify(EditFilterdatasetArray))
  );

  const clickOnArrowfunc = (index: number) => {
    setExistingArrow(true);
    const temp = arrows.filter((el: ArrowsProps, i: number) => i === index)[0];
    setExistingArrowProp(temp);
    setShowRelationCard(true);
  };

  const handleDrop = (e: any) => {
    e.stopPropagation();
    const tableHasCustomQuery = e.dataTransfer.getData("tableHasCustomquery");
    if(tableHasCustomQuery === "true"){
      setOpenAlert(true);
      setTestMessage("Filter is disabled for tables with custom queries.");
      setseverity("warning");
      return;
    }
    const refs = {
      isSelected: true,
      tableId: e.dataTransfer.getData("tableId"),
      index: e.dataTransfer.getData("connectIndex"),
      dataType: e.dataTransfer.getData("connectitemtype"),
      startTableName: e.dataTransfer.getData("connectTableName"),
      startColumnName: e.dataTransfer.getData("connectColumnName"),
      start: e.dataTransfer.getData("connectItemId"),
      table1_uid: e.dataTransfer.getData("connecttableUid"),
      schema: e.dataTransfer.getData("schema"),
      startId: e.dataTransfer.getData("tableId"),
    };

    const uid: any = new ShortUniqueId({ length: 6 });

    const field: IFilter = {
      tableId: refs.tableId,
      fieldName: refs.startColumnName,
      filterType: ["decimal", "float", "double", "integer"].includes(
        refs.dataType
      )
        ? "searchCondition"
        : "pickList",
      dataType: refs.dataType, //default value for
      shouldExclude: false,
      uid: uid(),
      userSelection: [],
      tableName: refs.startTableName,
      operator: "greaterThan",
      timeGrain: "year",
      isTillDate: false,
    };
    // setFlatFileId(refs.table1_uid);
    setTableFlatFileMap((prev) => {
      return [
        ...prev,
        {
          tableId: refs.tableId,
          flatFileId: refs.table1_uid,
        },
      ];
    });
    // setfield(field);
    // setTableName(field.tableName);
    // setDisplayName(field.displayName);
    // setUid(field.uid);
    // setTableId(field.tableId);
    // setDataType(field.dataType);
    setFiltersOfDataset((prev) => [...prev, field]);
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
        style={{ width: !isDataSetVisible ? "100%" : "calc(99% - 198px)" }}
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
          <div
            style={{
              height: "100vh",
              position: "fixed",
              right: "0",
              width:"3rem",
              borderLeft:"1px solid #d5d6d5",
              backgroundColor:"white"
            }}
          >
            <button
              title="Open dataset filter"
              style={{
                outline: "none",
                border: "none",
                margin: "10px auto",
                position:"relative",
                backgroundColor:"white"

              }}
              onClick={() => setIsDataSetVisible(!isDataSetVisible)}
            >
              <img
                src={filterIcon}
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                }}
                // className="IconDataset"
                alt="filter"
              />
            </button>
            {/* <div
              style={{
                width: "1px",
                height: "200vh",
                border: "1px solid rgba(224, 224, 224, 1)",
                position: "absolute",
                top: "0%",
              }}
            /> */}
          </div>
        )}
        <div
          className="filter_dataset"
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => e.preventDefault()}
          style={{
            display: isDataSetVisible ? "block" : "none",
            position: "fixed",
          }} // Controls visibility
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                // margin: "auto auto",
                position: "fixed",
                backgroundColor: "white",
                width: "211px",
                zIndex: "98",
                // marginTop: "-25px",
              }}
            >
              <img
                src={filterIcon}
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                  margin: "5px 0 0 10px",
                }}
                alt="filter"
              />
              <span className="axisTitle">Dataset Filter</span>
              {/* <div> */}
              <button
                title="Hide Filter Tab"
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                  padding: "0",
                  margin: "5px 0 0 0",
                  position: "relative",
                  height: "2rem",
                  width: "2rem",
                }}
                onClick={() => setIsDataSetVisible(!isDataSetVisible)}
              >
                {/* <ArrowBackRoundedIcon
                    style={{
                      // right: "92%",
                      top: "0px",
                      left:"0",
                      position:"absolute",
                      width:"100%",
                      height:"100%",
                      zIndex: "999",
                      transform: "rotate(180deg)",
                      color:"gray"
                    }}
                  /> */}
                <img
                  src={collapsedSidebar}
                  alt=""
                  style={{
                    // right: "92%",
                    top: "50%",
                    left: "50%",
                    position: "absolute",
                    width: "1.75rem",
                    height: "1.75rem",
                    zIndex: "999",
                    transform: "translate(-50%, -50%)",
                    color: "gray",
                  }}
                />
              </button>
              {/* </div> */}
            </div>
            <div style={{ position: "absolute", marginTop: "22px" }}>
              {filtersOfDataset.length > 0 && (
                <UserFilterDataset
                  tableFlatFileMap={tableFlatFileMap}
                  editMode={editMode}
                  filters={filtersOfDataset}
                  setDataSetFilterArray={setFiltersOfDataset}
                  dbConnectionId={tempTable[0].dcId}
                />
              )}
            </div>
          </div>
        </div>

        <RenderArrows />
      </div>
      <BottomBar
        datasetFilterArray={filtersOfDataset}
        editMode={editMode ? editMode : false}
      />

      <RelationshipDefiningComponent
        id="idarrow"
        showRelationCard={showRelationCard}
        setShowRelationCard={setShowRelationCard}
        existingArrowProp={existingArrowProp}
        existingArrow={existingArrow}
        setExistingArrow={setExistingArrow}
        setExistingArrowProp={setExistingArrowProp}
      />
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

const mapStateToProps = (
  state: DataSetStateProps & isLoggedProps,
  ownProps: any
) => {
  return {
    tempTable: state.dataSetState.tempTable,
    arrows: state.dataSetState.arrows,
    dsId: state.dataSetState.dsId,
    token: state.isLogged.accessToken,
  };
};

export default connect(mapStateToProps, null)(Canvas);
