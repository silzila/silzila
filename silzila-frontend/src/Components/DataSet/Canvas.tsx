// // Canvas component is part of Dataset Create / Edit page
// // List of tables selected in sidebar is displayed here
// // connections can be made between columns of different tables to define relationship in a dataset
import { useEffect, useState } from "react";
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
import { fontSize, palette } from "../..";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { permissions } from "../CommonFunctions/aliases";
import { IFilter } from "./BottomBarInterfaces";
import { IFlatIdTableIdMap } from "./EditDataSetInterfaces";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { AlertColor } from "@mui/material";

const Canvas = ({
  // state
  tempTable,
  dataSetState,
  arrows,
  dsId,
  flatFileIdMap,
  //props
  editMode,
  EditFilterdatasetArray,
}: CanvasProps) => {
  const [showRelationCard, setShowRelationCard] = useState<boolean>(false);
  const [existingArrowProp, setExistingArrowProp] = useState<{}>({});
  const [existingArrow, setExistingArrow] = useState<boolean>(false);
  const [isDataSetVisible, setIsDataSetVisible] = useState<boolean>(false);
  const [tableFlatFileMap, setTableFlatFileMap] =
    useState<IFlatIdTableIdMap[]>(flatFileIdMap);
  const [dataSetFilterArray, setDataSetFilterArray] = useState<IFilter[]>(
    JSON.parse(JSON.stringify(EditFilterdatasetArray))
  );
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [severity, setseverity] = useState<AlertColor>("success");
  const [testMessage, setTestMessage] = useState<string>("");
  
    /**
   * when We remove a table from  canvas or unselect a table from sidebar then we need to remove the filters of that table
   */
  useEffect(() => {
    /**
     * get the table ids of the tables present in the canvas
     */
    const tableIdSet = new Set(
      tempTable.map((table: tableObjProps) => table.id)
    );
    /**
     * filter the filters of the dataset which are not present in the canvas
     */
    const newFilters = dataSetFilterArray.filter((filter: IFilter) =>
      tableIdSet.has(filter.tableId)
    );
    /**
     * update the filters of the dataset
     */
    if (newFilters.length !== dataSetFilterArray.length) {
      setDataSetFilterArray(newFilters);
    }

    if(tempTable.length <= 0 ){
      setIsDataSetVisible(false)
    }
  }, [dataSetFilterArray, tempTable]);

  useEffect(()=>{
   if(editMode && dataSetFilterArray.length > 0){
      setIsDataSetVisible(true)
    }
    //eslint-disable-next-line
  },[])

  const isFlatFile = dataSetState?.isFlatFile;
  const permission=useSelector((state:RootState)=>state.dataSetState.permission);
  const clickOnArrowfunc = (index: number) => {
    if(permission.levelId===permissions.view||permission.levelId===permissions.restricted)return
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

    const uid: any = new ShortUniqueId({ length: 4 });
    const fieldFilterType = ["decimal", "float", "double", "integer"].includes(
        refs.dataType
      )
        ? "searchCondition"
        : "pickList"
    const fieldOperator = fieldFilterType === "pickList" ? "in" : "greaterThan"

    const field: IFilter = {
      tableId: refs.tableId,
      fieldName: refs.startColumnName,
      filterType: fieldFilterType,
      exprType: "greaterThan",
      dataType: refs.dataType,
      shouldExclude: false,
      userSelection: [],
      fieldtypeoption: "Pick List", //default value for
      includeexclude: "Include", //default value for
      operator: fieldOperator,
      timeGrain: "year",
      isTillDate: false,
      displayName: refs.startColumnName,
      uid: uid(),
      tableName: refs.startTableName,
      schema: refs.schema,
    };
    setTableFlatFileMap((prev) => {
      return [
        ...prev,
        {
          tableId: refs.tableId,
          flatFileId: refs.table1_uid,
        },
      ];
    });
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
            color={palette.secondary.light}
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
        // style={{ width: !isDataSetVisible ? "100%" : "calc(99% - 198px)" }}
        style={{ width: "100%" }}
      >
        <div style={{display: "flex", flexWrap: "wrap", maxWidth: "calc(100% - 13.063rem)"}}>
        {
          isFlatFile && !dataSetState.tables.length && tempTable.length === 0 ? <span style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize:fontSize.large,
          }}>
            No flatfiles in the current workspace
          </span> : <></>
        }
        {
          isFlatFile && dataSetState.tables.length > 0 && tempTable.length === 0 ? <span style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize:fontSize.large,
          }}>
            No flatfile is selected
          </span> : <></>
        }

        <Xwrapper>

          {tempTable &&
            tempTable.map((table: tableObjProps) => (
              table ? ( // Check if table is not null or undefined
                <div className="draggable-component" key={table.id}>
                  <CanvasTables tableData={table} editMode={editMode}/>
                </div>
              ) : null
            ))}
        </Xwrapper>
        </div>
        {/* conditionally showing filter section according to length of tempTable(list of tables in canvas. Initially width is 2.7rem) on clicking which visibility changes and changes the width of section */}
        {/* {tempTable.length > 0 &&     
        <div
          className="filter_dataset hideScrollBar"
          onDrop={(e) => isDataSetVisible && handleDrop(e)}
          onDragOver={(e) =>  isDataSetVisible && e.preventDefault()}
          style={{width: isDataSetVisible ? "13.063rem": "2.7rem"}}
        >
            <div
              style={{
                display: "flex",
                justifyContent: isDataSetVisible ? "space-between" : "center",
                paddingLeft: isDataSetVisible ? "1rem": "0.8rem",
                alignItems: "center",
                width: isDataSetVisible ? "12.5rem": "",
                margin: "0",
              }}
            >
              <img
                src={filterIcon}
                onClick={() => !isDataSetVisible && setIsDataSetVisible(!isDataSetVisible)}
                style={{
                  height: "1.5rem",
                }}
                alt="filter"
              />
              {isDataSetVisible &&
              <>
              <span className="axisTitle">Dataset Filter</span>
              <div>
                <button
                  title="minimize"
                  style={{
                    backgroundColor: "white",
                    outline: "none",
                    border: "none",
                    padding: "0"
                  }}
                >
                  <ArrowBackRoundedIcon
                    style={{
                      right: "92%",
                      top: "0px",
                      zIndex: "999",
                      transform: "rotate(180deg)",
                    }}
                    onClick={() => setIsDataSetVisible(!isDataSetVisible)}
                  />
                </button>
              </div>
              </>
              }
            </div>

            <div style={{marginTop: "0px", }}>
              {isDataSetVisible && dataSetFilterArray.length > 0 && 
              tempTable.length > 0 && (
                <UserFilterDataset
                  editMode={editMode}
                  tableFlatFileMap={tableFlatFileMap}
                  filters={dataSetFilterArray}
                  setDataSetFilterArray={setDataSetFilterArray}
                  dbConnectionId={tempTable[0].dcId}
                />
              )}
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
        } */}
        <RenderArrows />
      </div>
      <BottomBar
        datasetFilterArray={dataSetFilterArray}
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
    dataSetState: state.dataSetState,
    arrows: state.dataSetState.arrows,
    dsId: state.dataSetState.dsId,
    token: state.isLogged.accessToken,
  };
};

export default connect(mapStateToProps, null)(Canvas);
