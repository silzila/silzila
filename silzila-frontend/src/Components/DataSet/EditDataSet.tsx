// This component is used to retrive a specific dataset to be edited
// The information about this dataset is loaded to store
// users can update existing dataset / re-define relationships in dataset

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
  setCreateDsFromFlatFile,
  setDatabaseNametoState,
  setServerName,
  setUserTable,
  setValuesToState,
  setViews,
} from "../../redux/DataSet/datasetActions";
import FetchData from "../ServerCall/FetchData";
import { FindShowHeadAndShowTail } from "../CommonFunctions/FindIntegrityAndCordinality";
import MenuBar from "../DataViewer/MenuBar";
import Canvas from "./Canvas";
import Sidebar from "./Sidebar";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import {
  ArrowsProps,
  DataSetStateProps,
  RelationshipsProps,
  tableObjProps,
  UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { Columns, ColumnsWithUid } from "./DatasetInterfaces";
import {
  CanvasIndividualTableProps,
  EditDatasetProps,
} from "./EditDataSetInterfaces";
import Logger from "../../Logger";

import { setDsId } from "../../redux/DataSet/datasetActions";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";
import { contentTypes } from "../CommonFunctions/aliases";
import { useDispatch } from "react-redux";

const EditDataSet = ({
  //state
  token,
  dsId,

  //dispatch
  setDsId,
  setValuesToState,
  setUserTable,
  setDatabaseNametoState,
  setServerName,
  setViews,
  setCreateDsFromFlatFile,
}: any) => {
  var dbName: string = "";
  var server: string = "";

  const [loadPage, setloadPage] = useState<boolean>(false);

  var count: number = 0;

  const [datasetFilterArray, setDataSetFilterArray] = useState<any[]>([]);
  var data: any;

  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    setDsId(state?.dsId);
  }, []);

  useEffect(() => {
    if (dsId) {
      setAllInfo();
    }
  }, [dsId]);
  const dispatch=useDispatch();

  useEffect(() => {
      if(!state){
        navigate("/")
      }
    }, [state, navigate])
    if (!state) {
      return null;
    }

  const setAllInfo = async () => {
    const permissionRes=await FetchData({
      requestType:'noData',
      method:'GET',
      url:`privilege?workspaceId=${state?.parentId}&contentTypeId=${contentTypes.Dataset}&contentId=${dsId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
    if(permissionRes.status){
      const permission:{roleID:number,roleName:string,levelId:number}=permissionRes.data;
      dispatch({type:'SET_PERMISSION',payload:permission})
    }
    else return
    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/${dsId}?workspaceId=${state?.parentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.dataSchema.filterPanels) {
      data = res.data.dataSchema.filterPanels
        .map((item: any) => {
          if (item.panelName === "dataSetFilters") {
            return item.filters;
          }
          return null;
        })
        .filter(Boolean);
      console.log(data);
      setDataSetFilterArray(data.flat());
    }

    if (res.status) {
      if (res.data.isFlatFileData) {
        setCreateDsFromFlatFile(true);
      }
      else setCreateDsFromFlatFile(false);

      if (!res.data.isFlatFileData) {
        var getDc: any = await FetchData({
          requestType: "noData",
          method: "GET",
          url: `database-connection?workspaceId=${state?.parentId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (getDc.status) {
          getDc.data.forEach((dc: any) => {
            if (dc.id === res.data.connectionId) {
              server = dc.vendor;
              setServerName(server);
            }
          });
        }
      }
      dbName = res.data.dataSchema?.tables[0]?.database;

      // canvasTables - tables that are droped & used in canvas for creating dataset
      const canvasTables: tableObjProps[] = await Promise.all(
        res.data.dataSchema.tables?.map(async (tbl: any) => {
          count++;
          if (tbl) {
            return {
              table_uid: res.data.isFlatFileData
                ? tbl.flatFileId
                : tbl.schema.concat(tbl.table),
              tableName: tbl.table,
              alias: tbl.alias,
              dcId: res.data.connectionId,
              columns: await getColumns(
                res.data.connectionId,
                tbl.schema,
                tbl.table,
                tbl.database,
                tbl.flatFileId,
                tbl.isCustomQuery,
                tbl.customQuery
              ),
              isSelected: true,
              id: tbl.id,
              isNewTable: false,
              tablePositionX: tbl.tablePositionX ? tbl.tablePositionX : null,
              tablePositionY: tbl.tablePositionY ? tbl.tablePositionY : null,
              schema: tbl.schema,
              databaseName: tbl.database,
              isCustomQuery: tbl.isCustomQuery,
              customQuery: tbl.customQuery,
            };
          }
        })
      );
      
      // ======================== set tables & schema ====================================================

      var schema_list: string[] = res.data.dataSchema.tables.map(
        (table: CanvasIndividualTableProps) => {
          return table.schema;
        }
      );

      // getting unique schema used in dataset
      var uniqueSchema: string[] = Array.from(new Set(schema_list));

      const getTables = async () => {
        var url: string = "";
        if (res.data.isFlatFileData) {
          url = `file-data?workspaceId=${state?.parentId}`;
        } else {
          if (server === "mysql") {
            url = `metadata-tables/${res.data.connectionId}?database=${dbName}&workspaceId=${state?.parentId}`;
          } else {
            url = `metadata-tables/${res.data.connectionId}?database=${dbName}&schema=${uniqueSchema[0]}&workspaceId=${state?.parentId}`;
          }
        }

        var res1: any = await FetchData({
          requestType: "noData",
          method: "GET",
          url: url,
          headers: { Authorization: `Bearer ${token}` },
          token: token,
        });

        if (res1.status) {
          let userTable: UserTableProps[] = [];
          let views: any[] = [];
          const uid = new ShortUniqueId({ length: 8 });
          if (!res.data.isFlatFileData) {
            if (res1.data.views.length > 0) {
              views = res1.data.views.map((el: any) => {
                var id = "";
                var schema = "";
                var databaseName = "";
                var tableAlreadyChecked = canvasTables.filter(
                  (tbl: any) =>
                    tbl.dcId === res.data.connectionId &&
                    tbl.schema === uniqueSchema[0] &&
                    tbl.tableName === el
                )[0];
                canvasTables.forEach((tbl: any) => {
                  if (
                    tbl.dcId === res.data.connectionId &&
                    tbl.schema === uniqueSchema[0] &&
                    tbl.tableName === el
                  ) {
                    id = tbl.id;
                    schema = tbl.schema;
                    databaseName = tbl.databaseName;
                  }
                });
                if (tableAlreadyChecked) {
                  return {
                    isView: true,
                    tableName: el,
                    isSelected: true,
                    table_uid: uniqueSchema[0].concat(el),
                    id: id,
                    isNewTable: false,
                    schema: schema,
                    database: databaseName,
                  };
                }
                return {
                  isView: true,
                  tableName: el,
                  isSelected: false,
                  table_uid: uniqueSchema[0].concat(el),
                  id: uid(),
                  isNewTable: true,
                  schema: uniqueSchema[0],
                  database: dbName,
                };
              });
            }

            userTable = res1.data.tables.map((el: any) => {
              var id = "";
              var schema = "";
              var databaseName = "";

              var tableAlreadyChecked1 = canvasTables.filter(
                (tbl: any) =>
                  tbl.dcId === res.data.connectionId &&
                  tbl.schema === uniqueSchema[0] &&
                  tbl.tableName === el
              )[0];
              canvasTables.forEach((tbl: any) => {
                if (
                  tbl.dcId === res.data.connectionId &&
                  tbl.schema === uniqueSchema[0] &&
                  tbl.tableName === el
                ) {
                  id = tbl.id;
                  schema = tbl.schema;
                  databaseName = tbl.databaseName;
                }
              });
              if (tableAlreadyChecked1) {
                return {
                  schema: schema,
                  database: databaseName,
                  tableName: el,
                  isSelected: true,
                  table_uid: uniqueSchema[0].concat(el),
                  id: id,
                  isNewTable: false,
                };
              }
              return {
                schema: uniqueSchema[0],
                database: dbName,
                tableName: el,
                isSelected: false,
                table_uid: uniqueSchema[0].concat(el),
                id: uid(),
                isNewTable: true,
              };
            });
          } else {
            userTable = res1.data.map((el: any) => {
              var id = "";
              var bool = false;

              var tableAlreadyChecked: any = canvasTables.filter(
                (tbl: any) => tbl.table_uid === el.id
              )[0];

              canvasTables.forEach((tbl: any) => {
                if (tbl.table_uid === el.id) {
                  id = tbl.id;
                  bool = tbl.isNewTable;
                }
              });

              if (tableAlreadyChecked) {
                return {
                  schema: "",
                  database: "",
                  tableName: el.name,
                  isSelected: true,
                  table_uid: el.id,
                  id: id,
                  isNewTable: bool,
                };
              }

              return {
                schema: "",
                database: "",
                tableName: el.name,
                isSelected: false,
                table_uid: el.id,
                id: uid(),
                isNewTable: true,
              };
            });
          }

          setUserTable(userTable);
          if (!res.data.isFlatFileData) {
            setViews(views);
          }
        }
      };

      await getTables();

      // ====================================================================================

      // ============================= set relationships and arrows ==========================
      let arrowsArray: any = [];
      let relationshipsArray: any = [];
      let arrowObj: any = [];
      let relObject: any = [];

      res.data.dataSchema.relationships.forEach((obj: any) => {
        const uid = new ShortUniqueId({ length: 8 });

        const valuesForshowHeadAndshowTail: any = FindShowHeadAndShowTail(
          obj.cardinality
        );

        // x  - array of start tables
        const x = res.data.dataSchema.tables.filter(
          (el: CanvasIndividualTableProps) => {
            return el.id === obj.table1;
          }
        );

        // y - array of endTables
        const y = res.data.dataSchema.tables.filter(
          (el: CanvasIndividualTableProps) => {
            return el.id === obj.table2;
          }
        );

        var startTableName = "";
        var endTableName = "";

        let columns_in_relationships: any = [];
        let relationUniqueId: any = "";

        obj.table1Columns.forEach((el: any, index: number) => {
          var table2_col = obj.table2Columns[index];
          let rel = { tab1: el, tab2: table2_col };
          columns_in_relationships.push(rel);
          relationUniqueId = uid();
        });
        arrowObj = columns_in_relationships.map((el: any) => {
          startTableName = x[0].table;
          endTableName = y[0].table;
          const startColumnId=canvasTables.filter((table:tableObjProps)=>table.id===x[0].id)[0].columns.filter((column:ColumnsWithUid)=>column.columnName===el.tab1)[0].uid;
          const endColumnId=canvasTables.filter((table:tableObjProps)=>table.id===y[0].id)[0].columns.filter((column:ColumnsWithUid)=>column.columnName===el.tab2)[0].uid;
          return {
            isSelected: false,

            start: res.data.isFlatFileData
              ? startColumnId
              : x[0].schema.concat(x[0].table).concat(el.tab1),
            table1_uid: res.data.isFlatFileData
              ? x[0].flatFileId
              : x[0].schema.concat(x[0].table),
            startTableName: x[0].table,
            startColumnName: el.tab1,
            startSchema: x[0].schema,
            startId: x[0].id,

            end: res.data.isFlatFileData
              ? endColumnId
              : y[0].schema.concat(y[0].table).concat(el.tab2),
            table2_uid: res.data.isFlatFileData
              ? y[0].flatFileId
              : y[0].schema.concat(y[0].table),
            endTableName: y[0].table,
            endColumnName: el.tab2,
            endSchema: y[0].schema,
            endId: y[0].id,

            integrity: obj.refIntegrity,
            cardinality: obj.cardinality,
            showHead: valuesForshowHeadAndshowTail.showHead,
            showTail: valuesForshowHeadAndshowTail.showTail,
            relationId: relationUniqueId,
          };
        });

        arrowsArray.push(...arrowObj);

        relObject = {
          startId: x[0].id,
          endId: y[0].id,
          integrity: obj.refIntegrity,
          cardinality: obj.cardinality,
          showHead: valuesForshowHeadAndshowTail.showHead,
          showTail: valuesForshowHeadAndshowTail.showTail,
          relationId: relationUniqueId,
          startTableName: startTableName,
          endTableName: endTableName,
        };
        relationshipsArray.push(relObject);
      });

      // ====================================================================================
      setDatabaseNametoState(dbName);
      setValuesToState(
        res.data.connectionId,
        res.data.datasetName,
        canvasTables,
        uniqueSchema[0],
        relationshipsArray,
        arrowsArray
      );

      setloadPage(true);
    } else {
      Logger("info", res, "********ERROR********");
    }
  };

  function AddUidInColumnData(data: any, name: string) {
    const updatedData = data.map((item: any, index: number = 1) => ({
      ...item,
      uid: name.concat(item.columnName),
    }));
    return updatedData;
  }

  const getColumnTypeswithCustomQuery = async (
    customQuery: string,
    connection: any,
    name: string
  ) => {
    var url: string = `metadata-columns-customquery/${connection}?workspaceId=${state?.parentId}`;
    var res: any = await FetchData({
      requestType: "withData",
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: customQuery,
    });

    if (res.data) {
      return AddUidInColumnData(res.data, name);
    }
  };

  const getColumns = async (
    connection: string,
    schema: string,
    tableName: string,
    databaseName: string,
    flatFileId: string,
    isCustomQuery: boolean,
    customQuery: any
  ) => {
    const uid: any = new ShortUniqueId({ length: 8 });
    var url: string = "";
    if (!flatFileId) {
      if (server === "mysql") {
        url = `metadata-columns/${connection}?database=${databaseName}&table=${tableName}&workspaceId=${state?.parentId}`;
      } else {
        url = `metadata-columns/${connection}?database=${databaseName}&schema=${schema}&table=${tableName}&workspaceId=${state?.parentId}`;
      }
    } else {
      url = `file-data-column-details/${flatFileId}?workspaceId=${state?.parentId}`;
    }
    if (isCustomQuery) {
      return getColumnTypeswithCustomQuery(customQuery, connection, tableName);
    }

    var result: any = await FetchData({
      requestType: "noData",
      method: "POST",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.status) {
      let arrayWithUid: ColumnsWithUid[] = [];
      if (flatFileId) {
        arrayWithUid = result.data.map((data: any) => {
          return {
            uid: uid(),
            columnName: data.fieldName,
            dataType: data.dataType,
          };
        });
      } else {
        arrayWithUid = result.data.map((data: Columns) => {
          return {
            uid: schema.concat(tableName).concat(data.columnName),
            ...data,
          };
        });
      }
      return arrayWithUid;
    }
  };
  //console.log(datasetFilterArray);
  return (
    <div className="dataHome">
      <MenuBar from="dataSet" />

      <div className="createDatasetPage">
        {loadPage ? (
          <>
            <Sidebar editMode={true} />
            {datasetFilterArray?.length > 0 ? (
              <Canvas
                editMode={true}
                EditFilterdatasetArray={datasetFilterArray}
              />
            ) : (
              <Canvas editMode={true} />
            )}
          </>
        ) : (
          <PopUpSpinner
            show={!loadPage}
            sx={{ background: "transparent" }}
            paperProps={{
              sx: {
                backgroundColor: "transparent",
                color: "white",
                boxShadow: "none",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
  return {
    token: state.isLogged.accessToken,
    dsId: state.dataSetState.dsId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setValuesToState: (
      conId: string,
      fname: string,
      canvasTables: tableObjProps[],

      schema: string,
      relationshipsArray: RelationshipsProps[],
      arrowsArray: ArrowsProps[]
    ) =>
      dispatch(
        setValuesToState(
          conId,
          fname,
          canvasTables,
          schema,
          relationshipsArray,
          arrowsArray
        )
      ),
    setServerName: (name: string) => dispatch(setServerName(name)),
    setDatabaseNametoState: (name: string) =>
      dispatch(setDatabaseNametoState(name)),
    setViews: (views: any[]) => dispatch(setViews(views)),
    setUserTable: (payload: UserTableProps[]) =>
      dispatch(setUserTable(payload)),
    setCreateDsFromFlatFile: (value: boolean) =>
      dispatch(setCreateDsFromFlatFile(value)),
    setDsId: (id: string) => dispatch(setDsId(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDataSet);
