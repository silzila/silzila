// This component is a part of Create / Edit Dataset page
// Functions incluce
// 	- Select DataConnection
// 	- Select Schema
// 	- Select tables in a schema

import {
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  setConnectionValue,
  setServerName,
  setDatabaseNametoState,
  setDataSchema,
  setUserTable,
  setViews,
} from "../../redux/DataSet/datasetActions";
import FetchData from "../ServerCall/FetchData";
import { SelectListItem } from "../CommonFunctions/SelectListItem";
import TableList from "./TableList";
import "../DataConnection/DataSetup.css";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { SidebarProps } from "./SidebarInterfaces";
import {
  ConnectionItem,
  DataSetStateProps,
  tableObjProps,
  UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import {
  ChangeConnection,
  NotificationDialog,
} from "../CommonFunctions/DialogComponents";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Logger from "../../Logger";
import CustomQueryResult from "./CustomQueryResult";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";

interface savedData {
  id: any;
  name: any;
  querydata: string;
}

const Sidebar = ({
  //props
  editMode,
  dsId,

  // state
  token,
  tableList,
  tempTable,
  connectionValue,
  schemaValue,
  databaseName,
  serverName,
  views,
  dataConnectionList,
  isFlatFile,

  // dispatch
  setConnection,
  setDataSchema,
  setUserTable,
  setServerName,
  setDatabaseNametoState,
  setViews,
}: SidebarProps) => {
  const [schemaList, setSchemaList] = useState<string[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [isSchemaAvailable, setIsSchemaAvailable] = useState<boolean>(true);
  const [openDlg, setOpenDlg] = useState<boolean>(false);
  const [resetDataset, setResetDataset] = useState<boolean>(false);
  const [databaseList, setDatabaseList] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState<string>("");
  const [tableExpand, setTableExpand] = useState<boolean>(true);
  const [viewExpand, setViewExpand] = useState<boolean>(true);
  const [disableDb, setDisableDb] = useState<boolean>(false);
  const [isCustomQuery, setCustomQuery] = useState<boolean>(false);
  const [CustomQueryData, setCustomQueryData] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null); //focus text
  //Select Query option will be remove after clicking outside more button
  const exceptionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [QueryErrorMessage, setQueryErrorMessage] = useState<string>("");
  // Props to table data to for shows result for custom query data
  const [IsvisibleOption, setIsvisibleOption] = useState(false);
  const [showTableData, setShowTableData] = useState<boolean>(false);
  const [CustomQuerysArray, setCustomQuerysArray] = useState<savedData[]>([]);
  const [SelectQueryoption, setSelectQueryoption] = useState<number>(0);
  const [customQueryExpand, setcustomQueryExpand] = useState<boolean>(true);
  const [RenameInputValueCustomQueryname, setRenameInputValueCustomQueryname] =
    useState<string>("");

  const [RenameNameQuery, setRenameNameQuery] = useState<string>("");
  const [RenameID, setRenameID] = useState<any>(0);
  const [EditCustomQuery, setEditCustomQuery] = useState<any>(0);
  const [RenameToCanvasProps, setRenameToCanvasProps] = useState<string>("");

  // tableData  will be type of any
  const [tableData, setTableData] = useState<any[]>([]);
  const [objKeys, setObjKeys] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(true);

  const [deleteCustomQuery, setdeleteCustomQuery] = useState<any>(0);

  // Actions performed when dataConnection is changed
  // If user already selected some tables from another dataset
  // to display in canvas, provide a warning to reset data

  const propertiesForCustomQueryData = {
    editMode,
    showTableData,
    setShowTableData,
    tableData,
    setTableData,
    objKeys,
    setCustomQuerysArray,
    CustomQuerysArray,
    CustomQueryData,
    setCustomQuery,
    EditCustomQuery,
    setEditCustomQuery,
    connectionValue,
    token,
    deleteCustomQuery,
    RenameInputValueCustomQueryname,
    SelectQueryoption,
    RenameToCanvasProps,
    setSelectQueryoption,
    setRenameToCanvasProps,
  };

  const onConnectionChange = (e: string) => {
    setSelectedDb(e);
    setDatabaseNametoState(e);

    setDataSchema("");
    setSchemaList([]);
    setSelectedSchema("");

    setUserTable([]);
    setViews([]);

    if (serverName === "mysql") {
      // getTables()
    } else {
      getSchemaList(e);
    }
  };

  useEffect(() => {
    if (!isFlatFile) {
      if (serverName === "postgresql" && tempTable.length > 0) {
        setDisableDb(true);
      }
      // If Dataset is opened in edit mode, set all required values to state
      if (editMode) {
        getAllMetaDb();
        setSelectedDb(databaseName);
        setSelectedSchema(schemaValue);
        getCustomQueryFromSavedDataSetlist(); //get the custom query array from dataset table list
        getSchemaList(databaseName);
      } else {
        getAllMetaDb();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFlatFile) {
      if (serverName === "postgresql" && tempTable.length > 0) {
        setDisableDb(true);
      }
      if (serverName === "postgresql" && tempTable.length === 0) {
        setDisableDb(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempTable]);

  // Reset all the values in store
  useEffect(() => {
    if (resetDataset) {
      getSchemaList("");
      setSelectedSchema("");
      setDataSchema("");
      setResetDataset(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetDataset]);

  const getAllMetaDb = async () => {
    if (serverName === "mysql") {
      setIsSchemaAvailable(false);
    } else {
      setIsSchemaAvailable(true);
    }
    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `metadata-databases/${connectionValue}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status) {
      setDatabaseList(res.data);
    } else {
      Logger("info", "database List error", res.data.detail);
    }
  };

  // Get all schemas of a particular data connection
  const getSchemaList = async (db: string) => {
    if (!editMode) {
      setUserTable([]);
      setViews([]);
    }

    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `metadata-schemas/${connectionValue}?database=${db}`,
      headers: { Authorization: `Bearer ${token}` },
      token: token,
    });

    if (res.status) {
      setSchemaList(res.data);
    } else {
    }
  };

  // Fetch list of tables in a particular schema

  const getTables = async (
    e: any,
    vendor?: string | null,
    dbName?: string | null
  ) => {
    var url: string = "";
    var schema: string = "";

    if (serverName === "mysql") {
      url = `metadata-tables/${e}?database=${selectedDb}`;
    } else {
      schema = e.target.value;
      url = `metadata-tables/${connectionValue}?database=${selectedDb}&schema=${schema}`;
    }

    setSelectedSchema(schema);
    setDataSchema(schema);

    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
      token: token,
    });

    if (res.status) {
      var views: any = [];
      // const uid: any = new ShortUniqueId({ length: 8 });
      if (res.data.views.length > 0) {
        views = res.data.views.map((el: any) => {
          var id = "";
          var bool = false;

          var tableAlreadyChecked = tempTable.filter(
            (tbl) =>
              tbl.dcId === connectionValue &&
              tbl.schema === schema &&
              tbl.tableName === el
          )[0];
          tempTable.forEach((tbl: any) => {
            if (
              tbl.dcId === connectionValue &&
              tbl.schema === schema &&
              tbl.tableName === el
            ) {
              id = tbl.id;
              bool = tbl.isNewTable;
            }
          });
          if (tableAlreadyChecked) {
            return {
              schema: schema,
              database: databaseName,
              isView: true,
              tableName: el,
              isSelected: true,
              table_uid: schema.concat(el),
              id: id,
              isNewTable: bool,
              isCustomQuery: false,
              customQuery: "",
            };
          }
          return {
            schema: schema,
            database: databaseName,
            isView: true,
            tableName: el,
            isSelected: false,
            table_uid: schema[0].concat(el),
            // id: uid(),
            id:id,
            isNewTable: true,
            isCustomQuery: false,
            customQuery: "",
          };
        });
      }
      const aliasMap: { [key: string]: string } = {};
      const aliasCount: { [key: string]: number } = {};
      const userTable: UserTableProps[] = res.data.tables.map((el: string) => {
        var id = "";
        var bool = false;

        // Checking if the table is already selected to canvas by user
        // TODO: (p-1) check and mention type
        // console.log(el)
        function generateTableId(table:string) {
          let alias = '';
          const words = table.replace(/[-_]/g, ' ').split(' ');
          if (words.length === 1) {
              alias = words[0][0].toLowerCase();
          } else {
              alias = words.map(word => word[0].toLowerCase()).join('');
          }
          if (aliasMap[alias]) {
              if (!aliasCount[alias]) aliasCount[alias] = 1; // Initialize the counter
              aliasCount[alias]++;
              alias = alias + aliasCount[alias]; // Append number suffix for uniqueness
          }
          aliasMap[alias] = table;
      
          return alias;
      }
        var tableAlreadyChecked: any = tempTable.find(
          (tbl: tableObjProps) =>
            // tbl.dcId === connectionId && tbl.schema === schema && tbl.tableName === el
            tbl.dcId === connectionValue &&
            tbl.schema === schema &&
            tbl.tableName === el
        );

        // Checking if the selected table is new or previously added to this dataset
        // Required as editing a dataset doesn't allow for deleting already added tables
        tempTable.forEach((tbl: tableObjProps) => {
          if (
            // tbl.dcId === connectionId &&
            tbl.dcId === connectionValue &&
            tbl.schema === schema &&
            tbl.tableName === el
          ) {
            id = tbl.id;
            bool = tbl.isNewTable;
          }
        });

        // Already selected table in canvas has an ID.
        if (tableAlreadyChecked) {
          return {
            schema: schema,
            database: databaseName,
            tableName: el,
            isSelected: true,
            table_uid: schema.concat(el),
            id: id,
            isNewTable: bool,
            isCustomQuery: false,
            customQuery: "",
          };
        }

        // New tables need to be assigned a uid
        return {
          schema: schema,
          database: databaseName,
          tableName: el,
          isSelected: false,
          table_uid: schema.concat(el),
          id: generateTableId(el),
          isNewTable: true,
          isCustomQuery: false,
          customQuery: "",
        };
      });
      setUserTable(userTable);
      setViews(views);
    } else {
    }
  };

  const getConnectionName = (id: string) => {
    var name: string = "";
    dataConnectionList.forEach((el: ConnectionItem) => {
      if (el.id === id) {
        name = el.connectionName;
      }
    });
    return name;
  };
  // add custom Query Button
  const handleCustomQueryAddButton = () => {
    setCustomQueryData("");
    setEditCustomQuery(0);
    setCustomQuery(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    setRenameInputValueCustomQueryname("");
    setSelectQueryoption(0);
  };
  //after clicking the preview Button then fetch data from server
  const handleCustomPreviewButton = async (e: FormEvent) => {
    e.preventDefault();
    const num = 250;
    const data = {
      query: CustomQueryData,
    };

    try {
      const url = `sample-records-customquery/${connectionValue}/${num}`;
      const res: any = await FetchData({
        requestType: "withData",
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });
      if (res.status) {
        setShowTableData(true);
        setTableData(res.data);
        const keys = Object.keys(res.data[0]);
        setObjKeys([...keys]);
      } else {
        setOpenAlert(true);
        setQueryErrorMessage(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // rename the custom query in
  const handleRename = (
    event: React.KeyboardEvent<HTMLInputElement>,
    name: string
  ) => {
    if (event.key === "Enter") {
      if (RenameInputValueCustomQueryname.length > 0) {
        const isDuplicate = CustomQuerysArray.some(
          (item) =>
            item.name === RenameInputValueCustomQueryname &&
            item.id !== SelectQueryoption
        );

        if (isDuplicate) {
          setQueryErrorMessage(
            "Please write a different name. The query name already exists."
          );
          setOpenAlert(true);
        } else {
          setRenameInputValueCustomQueryname(RenameNameQuery);
          setCustomQuerysArray((prevData) =>
            prevData.map((item) =>
              item.name === name ? { ...item, name: RenameNameQuery } : item
            )
          );
          // setRenameInputValueCustomQueryname(""); // Reset the input value
          setRenameToCanvasProps(RenameInputValueCustomQueryname);
          setRenameID(0); // Reset the rename ID
        }
      } else if (RenameInputValueCustomQueryname.length === 0) {
        setQueryErrorMessage("At least one character is required.");
        setOpenAlert(true);
      }
    }
  };

  //delete custom query from custom query data
  const DeleteNameCustomQuery = (id: any) => {
    setdeleteCustomQuery(id);
    const updatedData = CustomQuerysArray.filter((item) => item.id !== id);
    setCustomQuerysArray(updatedData);
  };
  //Edit the exits custom query
  const handleEditCustomQuery = (id: any) => {
    const data = CustomQuerysArray.filter((item) => item.id === id);
    const query = data[0].querydata;
    setCustomQuery(true);
    setCustomQueryData(query);
    setSelectQueryoption(0);
  };

  // sidebar in edit mode get the list of saved custom query from dataset
  const getCustomQueryFromSavedDataSetlist: any = async () => {
    var res: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/${dsId}`,
      headers: { Authorization: `Bearer ${token}` },
      token: token,
    });

    const updatedCustomQueryArray = res.data.dataSchema.tables
      .filter((item: any) => item.isCustomQuery)
      .map((item: any) => ({
        id: item.id,
        name: item.alias,
        querydata: item.customQuery,
      }));
    setCustomQuerysArray(updatedCustomQueryArray);
  };
  useEffect(() => {}, [CustomQuerysArray]);
  // remove the selected query option after click anywhere the screen
  const handleClickOutside = (event: MouseEvent) => {
    if (
      (exceptionRef.current &&
        !exceptionRef.current.contains(event.target as Node)) ||
      inputRef.current
    ) {
      setSelectQueryoption(0);
      setRenameID(0);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [SelectQueryoption, RenameID]);
  return (
    <div className="sidebar" ref={scrollRef}>
      {isFlatFile ? (
        <div>
          {tableList ? (
            tableList.map((tab: UserTableProps) => {
              // console.log(tab)
              return (
                <SelectListItem
                  key={tab.tableName}
                  render={(xprops: any) => (
                    <div
                      className="tableListStyle"
                      onMouseOver={() => xprops.setOpen(true)}
                      onMouseLeave={() => xprops.setOpen(false)}
                    >
                      <TableList
                        key={tab.tableName}
                        className="tableListElement"
                        table={tab}
                        tableId={tab.id}
                        xprops={xprops}
                        isFlatFile={isFlatFile}
                        flatFileId={tab.table_uid}
                      />
                    </div>
                  )}
                />
              );
            })
          ) : (
            <div>No Tables Available</div>
          )}
        </div>
      ) : (
        <div>
          <div
          // style={{ padding: "0 1rem 0 1rem", margin: "15px 0px 15px 0px" }}
          >
            <FormControl fullWidth size="small">
              <TextField
                label="DataConnection"
                id="outlined-size-small"
                size="small"
                disabled={true}
                value={getConnectionName(connectionValue)}
                InputProps={{
                  sx: {
                    marginBottom: "1.5rem",
                  },
                }}
              />
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth size="small">
              <InputLabel id="dcSelect">Database</InputLabel>
              <Select
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2bb9bb",
                    color: "#2bb9bb",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2bb9bb",
                    color: "#2bb9bb",
                  },
                  "&.Mui-focused .MuiSvgIcon-root ": {
                    fill: "#2bb9bb !important",
                  },
                }}
                labelId="dcSelect"
                className="selectBar"
                onChange={(e: any) => {
                  onConnectionChange(e.target.value);
                }}
                disabled={disableDb}
                value={selectedDb}
                label="Connection"
              >
                {databaseList &&
                  databaseList.map((db: string) => {
                    return (
                      <MenuItem value={db} key={db} title={db}>
                        <Typography
                          sx={{
                            width: "auto",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "14px",
                          }}
                        >
                          {db}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          {isSchemaAvailable ? (
            // <div style={{ padding: "0 1rem 0 1rem" }}>
            <FormControl fullWidth size="small">
              <InputLabel id="schemaSelect">Schema</InputLabel>
              <Select
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2bb9bb",
                    color: "#2bb9bb",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#2bb9bb",
                    color: "#2bb9bb",
                  },
                  "&.Mui-focused .MuiSvgIcon-root ": {
                    fill: "#2bb9bb !important",
                  },
                }}
                labelId="schemaSelect"
                className="selectBar"
                label="Schema"
                onChange={(e: any) => getTables(e, null, null)}
                value={selectedSchema}
              >
                {schemaList &&
                  schemaList.map((schema: string) => {
                    return (
                      <MenuItem value={schema} key={schema}>
                        <Typography
                          sx={{
                            width: "auto",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "14px",
                          }}
                        >
                          {schema}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          ) : // </div>
          null}

          <div
            style={{
              display: "flex",
              borderRadius: "5px",
              marginBottom: "0.5rem",
              textAlign: "left",
              color: "#3F3F3F",
            }}
          >
            <Typography>Tables</Typography>
            <div>
              {tableExpand ? (
                <Tooltip title="Collapse">
                  <ArrowDropDownIcon
                    onClick={() => setTableExpand(!tableExpand)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Expand">
                  <ArrowRightIcon
                    onClick={() => setTableExpand(!tableExpand)}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          {tableExpand ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "5px",
                marginBottom: "1rem",
                textAlign: "left",
                maxHeight: "330px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {tableList && tableList.length > 0 ? (
                tableList.map((tab: UserTableProps) => {
              
                  return (
                    <SelectListItem
                      key={tab.tableName}
                      render={(xprops: any) => (
                        <div
                          className="tableListStyle"
                          onMouseOver={() => xprops.setOpen(true)}
                          onMouseLeave={() => xprops.setOpen(false)}
                        >
                          <TableList
                            key={tab.tableName}
                            className="tableListElement"
                            table={tab}
                            tableId={tab.id}
                            xprops={xprops}
                            isFlatFile={isFlatFile}
                          />
                        </div>
                      )}
                    />
                  );
                })
              ) : (
                <div style={{ fontSize: "12px", textAlign: "center" }}>
                  No Tables Available
                </div>
              )}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              borderRadius: "5px",
              marginBottom: "0.5rem",
              textAlign: "left",
              maxHeight: "330px",
              overflowY: "auto",
              color: "#3F3F3F",
            }}
          >
            <Typography>Views</Typography>
            <div>
              {viewExpand ? (
                <Tooltip title="Collapse">
                  <ArrowDropDownIcon
                    onClick={() => setViewExpand(!viewExpand)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Expand">
                  <ArrowRightIcon onClick={() => setViewExpand(!viewExpand)} />
                </Tooltip>
              )}
            </div>
          </div>

          {viewExpand ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "5px",
                marginBottom: "1rem",
                textAlign: "left",
              }}
            >
              {views && views.length > 0 ? (
                views.map((tab: any) => {
                  return (
                    <SelectListItem
                      key={tab.tableName}
                      render={(xprops: any) => (
                        <div
                          className="tableListStyle"
                          onMouseOver={() => xprops.setOpen(true)}
                          onMouseLeave={() => xprops.setOpen(false)}
                        >
                          <TableList
                            key={tab.tableName}
                            className="tableListElement"
                            table={tab}
                            tableId={tab.tableName}
                            xprops={xprops}
                            isFlatFile={isFlatFile}
                          />
                        </div>
                      )}
                    />
                  );
                })
              ) : (
                <div style={{ fontSize: "12px", textAlign: "center" }}>
                  No Views Available
                </div>
              )}
            </div>
          ) : null}

          <ChangeConnection
            open={openDlg}
            setOpen={setOpenDlg}
            setReset={setResetDataset}
            heading="RESET DATASET"
            message="Changing connection will reset this dataset creation. Do you want to discard
						the progress?"
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          borderRadius: "5px",
          marginBottom: "0.5rem",
          textAlign: "left",
          maxHeight: "330px",
          overflowY: "auto",
          color: "#3F3F3F",
        }}
      >
        <Typography>Custom Query</Typography>
        {customQueryExpand ? (
          <Tooltip title="Collapse">
            <ArrowDropDownIcon
              onClick={() => setcustomQueryExpand(!customQueryExpand)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Expand">
            <ArrowRightIcon
              onClick={() => setcustomQueryExpand(!customQueryExpand)}
            />
          </Tooltip>
        )}
      </div>
      {customQueryExpand ? (
        <div>
          {CustomQuerysArray.length > 0 ? (
            <div style={{ margin: "0 0 10% 0" }}>
              {CustomQuerysArray.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    position: "relative",
                  }}
                >
                  <div>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        // setSelectQueryoption(
                        //   SelectQueryoption === item.id
                        //     ? () => handleClickOutside
                        //     : item.id
                        // );
                        setSelectQueryoption(item.id);
                        setRenameNameQuery("");
                        setIsvisibleOption(true);
                        // setRenameInputValueCustomQueryname(item.name);
                        // setRenameToCanvasProps(item.name);
                        setRenameID(0);
                      }}
                    >
                      <MoreVertSharpIcon />
                    </div>
                    {IsvisibleOption && SelectQueryoption === item.id ? (
                      <div className="optionlist" ref={exceptionRef}>
                        <div ref={scrollRef}>
                          <ul style={{ listStyle: "none" }}>
                            <li
                              onClick={() => {
                                setRenameID(item.id);
                                setSelectQueryoption(item.id);
                                setRenameInputValueCustomQueryname(item.name);
                                // setRenameToCanvasProps(item.name);
                                setRenameNameQuery(item.name);
                                setIsvisibleOption(false);
                              }}
                            >
                              Rename
                            </li>
                            <li
                              onClick={() => {
                                DeleteNameCustomQuery(item.id);
                                setIsvisibleOption(false);
                              }}
                            >
                              Delete
                            </li>
                            <li
                              onClick={() => {
                                setEditCustomQuery(item.id);
                                handleEditCustomQuery(item.id);
                                setRenameNameQuery(item.name);
                                setIsvisibleOption(false);
                              }}
                            >
                              Edit
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    {SelectQueryoption === item.id && RenameID === item.id ? (
                      <input
                        type="text"
                        value={RenameInputValueCustomQueryname}
                        onChange={(e) => {
                          setRenameInputValueCustomQueryname(e.target.value);
                        }}
                        onKeyDown={(event) => handleRename(event, item.name)}
                        autoFocus
                        ref={inputRef}
                      />
                    ) : (
                      <span>
                        {item.name === "" ? setRenameID(item.id) : item.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <button
            onClick={handleCustomQueryAddButton}
            style={{
              backgroundColor: "white",
              color: "#2bb9bb",
              padding: "2%",
              position: "relative",
              width: "80%",
              outlineColor: "#2bb9bb",
              outline: "1px solid #2bb9bb",
              border: "none",
              borderRadius: "0.5rem",
            }}
          >
            Add
          </button>
        </div>
      ) : null}

      {isCustomQuery ? (
        <Dialog
          open={isCustomQuery}
          maxWidth="xl"
          fullWidth={true}
          PaperProps={{
            sx: {
              minHeight: "90%",
            },
          }}
        >
          <div className="CustomQuerybox">
            <form onSubmit={handleCustomPreviewButton}>
              <textarea
                spellCheck="false"
                className="customTextArea"
                name="customQuery"
                id="customQuery"
                placeholder="// SELECT * FROM table_name"
                style={{ color: "#5c5c5c" }}
                ref={textareaRef}
                value={CustomQueryData}
                onChange={(e) => setCustomQueryData(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "10px",
                  gap: "1%",
                }}
              >
                {/* <button
                  className="button"
                  style={{ backgroundColor: "grey" }}
                  onClick={() => {
                    setCustomQuery(!isCustomQuery);
                    setEditCustomQuery(0);
                    setCustomQueryData("");
                  }}
                >
                  Cancel
                </button> */}
                <Button
                  variant="contained"
                  onClick={() => {
                    setCustomQuery(!isCustomQuery);
                    setEditCustomQuery(0);
                    setCustomQueryData("");
                  }}
                  id="cancelButton"
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  id="setButton"
                  sx={{
                    textTransform: "none",
                  }}
                  style={{ backgroundColor: "#2bb9bb" }}
                  type="submit"
                >
                  Preview
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      ) : null}
      <CustomQueryResult {...propertiesForCustomQueryData} />
      {QueryErrorMessage.length > 0 ? (
        <NotificationDialog
          onCloseAlert={() => {
            setOpenAlert(false);
            setQueryErrorMessage("");
          }}
          severity={"error"}
          testMessage={QueryErrorMessage}
          openAlert={openAlert}
        />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
  return {
    dsId: state.dataSetState.dsId,
    token: state.isLogged.accessToken,
    tableList: state.dataSetState.tables,
    views: state.dataSetState.views,
    databaseName: state.dataSetState.databaseName,
    serverName: state.dataSetState.serverName,
    tempTable: state.dataSetState.tempTable,
    connectionValue: state.dataSetState.connection,
    schemaValue: state.dataSetState.schema,
    dataConnectionList: state.dataSetState.dataConnectionList,
    isFlatFile: state.dataSetState.isFlatFile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setConnection: (connection: string) =>
      dispatch(setConnectionValue(connection)),
    setDataSchema: (schema: string) => dispatch(setDataSchema(schema)),
    setUserTable: (userTable: UserTableProps[]) =>
      dispatch(setUserTable(userTable)),
    setServerName: (name: string) => dispatch(setServerName(name)),
    setDatabaseNametoState: (name: string) =>
      dispatch(setDatabaseNametoState(name)),
    setViews: (views: any[]) => dispatch(setViews(views)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
