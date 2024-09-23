// // Canvas component is part of Dataset Create / Edit page
// // List of tables selected in sidebar is displayed here
// // connections can be made between columns of different tables to define relationship in a dataset
import { useRef, useState } from "react";
import { connect } from "react-redux";
import "./Dataset.css";
import Xarrow, { Xwrapper } from "react-xarrows";
import CanvasTables from "./CanvasTables";
import filterIcon from "../../assets/filter_icon.svg";
import RelationshipDefiningComponent from "./RelationshipDefiningComponent";
import BottomBar from "./BottomBar";
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

const Canvas = ({
  // state
  tempTable,
  arrows,
  dsId,
  fileId,
  //props
  editMode=false,
  EditFilterdatasetArray,

  //dispatch
  addFilter
}: CanvasProps) => {
  const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
  const [existingArrowProp, setExistingArrowProp] = useState<{}>({});
  const [existingArrow, setExistingArrow] = useState<boolean>(false);
  const [isDataSetVisible, setIsDataSetVisible] = useState<boolean>(false);
  // const [disPlayName, setDisplayName] = useState<string>("");
  // const [uid, setUid] = useState<any>();
  // const [tableId, setTableId] = useState<string>("");
  // const [dataType, setDataType] = useState<string>("");
  // const [tableName, setTableName] = useState<string>("");
  // const [field, setfield] = useState<any>({});
  const [flatFileId,setFlatFileId] = useState<string>(fileId);
  const [filtersOfDataset, setFiltersOfDataset] = useState<IFilter[]>(
    JSON.parse(JSON.stringify(EditFilterdatasetArray))
  );

// console.log("at canvas",dataSetFilterArray)
  const clickOnArrowfunc = (index: number) => {
    setExistingArrow(true);
    const temp = arrows.filter((el: ArrowsProps, i: number) => i === index)[0];
    setExistingArrowProp(temp);
    setShowRelationCard(true);
  };

  const handleDrop = (e: any) => {
    e.stopPropagation();
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

    const field:IFilter = {
      tableId: refs.tableId,
      fieldName: refs.startColumnName,
      filterType:"Pick List",
      dataType: refs.dataType,//default value for
      shouldExclude:false,
      uid: uid(),
      userSelection:[],
      tableName: refs.startTableName,
      operator:"greaterThan",
      timeGrain:"year",
      isTillDate:false,
    };
    console.log(field);
    setFlatFileId(refs.table1_uid);
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              position: "fixed",
              right: "3%",
            }}
          >
            <button
              title="Open dataset filter"
              style={{
                backgroundColor: "white",
                outline: "none",
                border: "none",
                margin: "auto auto",
              }}
            >
              <img
                src={filterIcon}
                style={{
                  height: "1.5rem",
                  width: "2rem",
                }}
                className="IconDataset"
                onClick={() => setIsDataSetVisible(!isDataSetVisible)}
                alt="filter"
              />
            </button>
            <div
              style={{
                width: "1px",
                height: "200vh",
                border: "1px solid rgba(224, 224, 224, 1)",
                position: "absolute",
                top: "0%",
              }}
            />
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
          <div >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                // margin: "auto auto",
                position: "fixed",
                backgroundColor:"white",
                width:"211px",
                zIndex: "98",
                // marginTop: "-25px",
              }}
            >
              <img
                src={filterIcon}
                style={{
                  height: "1.5rem",
                  width: "2rem",
                  margin: "0 0 0 10px",
                }}
                alt="filter"
              />
              <span className="axisTitle"
              >Dataset Filter</span>
              {/* <div> */}
                <button
                  title="Hide Filter Tab"
                  style={{
                    backgroundColor: "white",
                    outline: "none",
                    border: "none",
                    padding:"0",
                    margin:"0",
                    position:"relative",
                    height: "2rem",
                    width: "2rem",
                  }}
                >
                  <ArrowBackRoundedIcon
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
                    onClick={() => setIsDataSetVisible(!isDataSetVisible)}
                  />
                </button>
              {/* </div> */}
            </div>
            <div style={{ position: "absolute", marginTop: "22px" }}>
              {(filtersOfDataset.length  > 0 )&& (
                <UserFilterDataset
                  flatFileId={flatFileId}
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
