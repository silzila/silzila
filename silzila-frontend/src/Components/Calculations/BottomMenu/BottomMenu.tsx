import React, { useMemo, useState } from "react";
import { DataViewerMiddleStateProps } from "../../DataViewer/DataViewerMiddleInterfaces";
import "./bottomMenu.css";
import { connect } from "react-redux";
import { Button, Dialog, DialogContent, Tooltip, unstable_useId } from "@mui/material";
import DialogPreviewContent from "./DialogPreviewContent";
import { addTableRecords } from "../../../redux/SampleTableRecords/SampleTableRecordsActions";
import { SampleRecordesColumnType } from "../../../redux/SampleTableRecords/SampleTableRecordsInterfaces";
import {
  addTableIdToCurrentCalculationSession,
  resetCurrentCalculationSession,
  saveNewCalculation,
  updateCalculationName,
} from "../../../redux/Calculations/CalculationsActions";
import ShortUniqueId from "short-unique-id";
import FetchData from "../../ServerCall/FetchData";
import { minMax } from "../constants";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { getFlowTypeFromFunctionName } from "../utils";
import { editChartPropItem, setSelectedTableInTile } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { set } from "lodash";
import { fonts, fontSize, palette } from "../../..";
import { isNameAllowed } from "../../CommonFunctions/CommonFunctions";

const FlowList = ({
  tabTileProps,
  dynamicMeasuresState,
  sampleRecords,
  calculations,
  token,
  chartProp,
  addRecords,
  changeCalculationName,
  saveCalculation,
  resetCalculationSession,
  addTableIdToCurrentCalculationSessionFunction,
  setTable,
  updateQueryParam,
  chartProperties
}: any) => {
  const propKey = useMemo(
    () => `${tabTileProps?.selectedTabId}.${tabTileProps?.selectedTileId}`,
    [tabTileProps?.selectedTabId, tabTileProps?.selectedTileId]
  );
  const [lastTestSuccess, setLastTestSuccess] = useState<boolean>(false);
  let calculationInfo = calculations.properties[propKey]?.currentCalculationSession?.calculationInfo;
  const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
  const calculationName = currentCalculationSession.name;
  const totalSavedCalculations = calculations?.savedCalculations?.length
  const activeFlowId = currentCalculationSession?.activeFlow
  const [tableRelationshipStatus, setTableRelationshipStatus] = useState<null |
    {
      table1: string,
      table2: string,
      relationship: string,
      isDirect: boolean
    }[]>(null)

  const selectedDataset = chartProp?.properties[propKey]?.selectedDs
  const selectedTable = chartProp?.properties[propKey]?.selectedTable[selectedDataset?.id]
  const datasetId = selectedDataset?.id
  const workSpaceId = selectedDataset?.workSpaceId
  const dbConnectionId = selectedDataset?.connectionId
  const selectedTableInTablesForSelectedDataSets = tabTileProps?.tablesForSelectedDataSets[selectedDataset?.id]?.findIndex((table: any) => table.id === selectedTable)
  const flatFileId = tabTileProps?.tablesForSelectedDataSets[selectedDataset?.id][selectedTableInTablesForSelectedDataSets]?.flatFileId

  // TODO: fields need to be filtered out. When there are more than one steps.
  const fields = currentCalculationSession?.calculationInfo?.fields;

  const [calculationLocalName, setCalculationLocalName] = useState<string>(() => {

    // we will check if the current calculation is a saved calculation or not.

    const isSavedCalculation = calculations.savedCalculations.find((calc: any) => calc.uuid === currentCalculationSession.uuid)

    if (isSavedCalculation) {
      return currentCalculationSession.name
    } else {
      return `calculation ${totalSavedCalculations + 1}`
    }
  })

  const handleCalculationSave = async () => {

    // check if the name is alphanumeric or not, allow only alphanumeric
    if (isNameAllowed(calculationLocalName) === false) {
      if (alert) {
        setAlert(null)
      }
      setAlert({ severity: 'warning', message: "Only alphabets, numbers, underscores(_), hyphens(-) and spaces( ) are allowed." })
      return
    }

    // just check if the calculation is getting updated or not

    // const isSavedCalculationGettingUpdated = calculations.savedCalculations.find((calc: any) => calc.name === calculationLocalName)

    // if (isSavedCalculationGettingUpdated) {

    // if (alert) {
    //   setAlert(null)
    // }

    // setAlert({ severity: 'warning', message: "There is already a calculation with this name. Please choose a different name." })

    // return

    // }

    let tableIdToPushInto: string

    const tableList = Object.keys(fields).reduce((
      acc: any,
      index: string
    ) => {

      if (!acc.includes(fields[index].tableId)) {
        acc.push(fields[index].tableId)
      }

      return acc;

    }, [])

    if (tableList.length === 1) {
      tableIdToPushInto = tableList[0]

      const tableMetaDataForSelectedDataset = sampleRecords.recordsColumnType[datasetId];

      if (tableMetaDataForSelectedDataset[tableIdToPushInto].find((el: any) => el['columnName'].toLowerCase().split(" ").join("_").split("-").join("_") === calculationLocalName.toLowerCase().split(" ").join("_").split("-").join("_")) && !currentCalculationSession.uuid) {
        if (alert) {
          setAlert(null)
        }
        setAlert({ severity: 'warning', message: "There is already a column with this name. Please choose a different name." })
        return
      }

      addTableIdToCurrentCalculationSessionFunction(tableIdToPushInto, propKey)
    } else {

      if (tableRelationshipStatus) {
        const tableRelation = tableRelationshipStatus[0]

        const relationship = tableRelation.relationship
        const isDirect = tableRelation.isDirect
        const table1 = tableRelation.table1
        const table2 = tableRelation.table2

        if (relationship === "one to many" && isDirect) {

          tableIdToPushInto = table2
          addTableIdToCurrentCalculationSessionFunction(tableIdToPushInto, propKey)

        } else if (relationship === "many to one" && isDirect) {
          tableIdToPushInto = table1
          addTableIdToCurrentCalculationSessionFunction(tableIdToPushInto, propKey)
        }
        else if (relationship === "one to one" && isDirect) {
          tableIdToPushInto = table1
          addTableIdToCurrentCalculationSessionFunction(tableIdToPushInto, propKey)
        }
        else {
          setLastTestSuccess(false)
          setAlert({ severity: 'warning', message: 'Tabes chosen must be in a direct relationship.' })
          return
        }
      }

    }

    const uuid = new ShortUniqueId({ length: 4 }).randomUUID();

    const allPreviousSavedNonAggregatedCalculations = [...(calculations?.savedCalculations?.filter((calculation: any) => (!calculation.isAggregated && calculation.tableId === tableIdToPushInto && calculation.datasetId === selectedDataset?.id)).map((calculation: any) => {
      return {
        uuid: calculation.uuid,
        ...(calculation.calculationInfo)
      }
    }))]

    const allPreviousSavedAggregatedCalculations = [...(calculations?.savedCalculations?.filter((calculation: any) => calculation.isAggregated && calculation.datasetId === selectedDataset?.id).map((calculation: any) => {
      return {
        uuid: calculation.uuid,
        ...(calculation.calculationInfo)
      }
    }))]

    calculationInfo.calculatedFieldName = calculationLocalName.toLowerCase().split(" ").join("_").split("-").join("_")

    const isCurrentCalculationPresent = allPreviousSavedNonAggregatedCalculations.find((calculation: any) => calculation.uuid === currentCalculationSession.uuid)
    const isCurrentCalculationPresentInAggregatedCalculations = allPreviousSavedAggregatedCalculations.find((calculation: any) => calculation.uuid === currentCalculationSession.uuid)

    if (!isCurrentCalculationPresent && !isCurrentCalculationPresentInAggregatedCalculations) {

      if (calculations.savedCalculations.find((calc: any) => {
        const calculationNameCharactersSync = calc.name.split(" ").join("_").split("-").join("_")
        return calculationNameCharactersSync === calculationLocalName.split(" ").join("_").split("-").join("_")
      })) {

        if (alert) {
          setAlert(null)
        }

        setAlert({ severity: 'warning', message: "There is already a calculation with this name. Please choose a different name." })

        return

      }

    }

    // Check if the calculation flows are aggregated all of them, if so no need to make network call instead just save the calculation in redux

    // TODO: introduce dynamicity here, can't always be only one flow and one flow can't always just have 1 step
    if (calculationInfo.flows["f1"][0].isAggregation === true) {

      changeCalculationName(propKey, calculationLocalName)

      // here we will update the query params here.

      if (isCurrentCalculationPresentInAggregatedCalculations) {

        const allPropKeys = Object.keys(chartProperties?.properties)

        const propKeysToUpdate: {
          [key: string]: {
            binIndex: number,
            fieldIndex: number,
            fieldName: string,
            displayName: string,
            dataType: string,
            tableId: string,
            uId: string,
            agg: string,
            SavedCalculationUUID: string,
            isTextRenamed: boolean
          }
        } = {}

        for (const eachPropKey of allPropKeys) {
          chartProperties?.properties[eachPropKey]?.chartAxes?.forEach((ax: any, axId: number) => {
            ax?.fields?.forEach((field: any, fieldId: number) => {
              if (field.SavedCalculationUUID === currentCalculationSession.uuid) {
                propKeysToUpdate[eachPropKey] = {
                  binIndex: axId,
                  fieldIndex: fieldId,
                  fieldName: currentCalculationSession.calculationInfo.calculatedFieldName,
                  displayName: 'agg of' + ' ' + currentCalculationSession.calculationInfo.calculatedFieldName,
                  dataType: currentCalculationSession.calculationInfo.fields[Object.keys(currentCalculationSession.calculationInfo.fields)[0]].dataType,
                  tableId: tableInfo?.id,
                  uId: field.uId,
                  agg: 'agg', // keep it to any random thing it doesn't matter,
                  SavedCalculationUUID: currentCalculationSession.uuid,
                  isTextRenamed: false
                }
              }
            })
          })
        }

        for (const propKey in propKeysToUpdate) {
          updateQueryParam(
            propKey,
            propKeysToUpdate[propKey].binIndex,
            propKeysToUpdate[propKey].fieldIndex,
            {
              fieldname: propKeysToUpdate[propKey].fieldName,
              displayname: propKeysToUpdate[propKey].displayName,
              dataType: propKeysToUpdate[propKey].dataType,
              tableId: propKeysToUpdate[propKey].tableId,
              uId: propKeysToUpdate[propKey].uId,
              agg: propKeysToUpdate[propKey].agg,
              SavedCalculationUUID: propKeysToUpdate[propKey].SavedCalculationUUID,
              isTextRenamed: propKeysToUpdate[propKey].isTextRenamed
            },
            'chartAxes'
          )
        }

        console.log('update is one the way: ', propKeysToUpdate)

      }

      saveCalculation(propKey, isCurrentCalculationPresentInAggregatedCalculations ? currentCalculationSession.uuid : uuid);

      setLastTestSuccess(false);

      resetCalculationSession(propKey);

      return;
    }

    let reqBodyModifiedAccordingToPreviousSavedCalculations: any[] = []

    if (allPreviousSavedNonAggregatedCalculations.length > 0) {

      // check if the current calculation is already present in the saved calculations list, means this is an edit of the existing calculation
      if (isCurrentCalculationPresent) {

        const indexOfCurrentCalculation = allPreviousSavedNonAggregatedCalculations.findIndex((calculation: any) => calculation.uuid === currentCalculationSession.uuid)

        allPreviousSavedNonAggregatedCalculations[indexOfCurrentCalculation] = calculationInfo

        allPreviousSavedNonAggregatedCalculations.forEach((calculation: any) => {
          reqBodyModifiedAccordingToPreviousSavedCalculations.push([calculation])
        })

      } else {
        allPreviousSavedNonAggregatedCalculations.forEach((calculation: any) => {
          reqBodyModifiedAccordingToPreviousSavedCalculations.push([calculation])
        })
        reqBodyModifiedAccordingToPreviousSavedCalculations.push([calculationInfo])

      }

    } else {
      reqBodyModifiedAccordingToPreviousSavedCalculations = [[calculationInfo]]
    }

    // TODO: the variables in request params need to be fetched dynamically

    const tableDetailsResponse = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `dataset/${datasetId}?workspaceId=${workSpaceId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    let tableDetails;
    let tableSchema;

    if (tableDetailsResponse.status === true) {
      tableDetails = await tableDetailsResponse.data;
      tableSchema = tableDetails.dataSchema.tables;
    } else {
      if (alert) {
        setAlert(null)
        setAlert({ severity: 'warning', message: "Something went wrong." })
      }
      return;
    }

    const tableInfo = tableSchema.find((table: any) => table.id === tableIdToPushInto);

    // Assuming that if flatfileId is present, then it is a flatfile otherwise it is a db

    const records = await FetchData({
      requestType: "withData",
      method: "POST",
      url: flatFileId ? `file-data-sample-records?flatfileId=${flatFileId}&datasetId=${datasetId}&tableId=${tableInfo?.id}` :
        `sample-records?workspaceId=${workSpaceId}&databaseId=${dbConnectionId}&datasetId=${datasetId}&recordCount=100&database=${tableInfo?.database}&schema=${tableInfo?.schema}&table=${tableInfo?.table}&tableId=${tableInfo?.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: reqBodyModifiedAccordingToPreviousSavedCalculations
    })

    const headers = await FetchData({
      requestType: "withData",
      method: "POST",
      url: flatFileId ? `file-data-column-details/${flatFileId}?tableId=${tableInfo?.id}` :
        `metadata-columns/${dbConnectionId}?workspaceId=${workSpaceId}&datasetId=${datasetId}&database=${tableInfo?.database}&schema=${tableInfo?.schema}&table=${tableInfo?.table}&tableId=${tableInfo?.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: reqBodyModifiedAccordingToPreviousSavedCalculations
    })

    if (records.status === true && headers.status === true) {
      const recordsData = await records.data;
      const headersData = await headers.data.map((headerData: any) => ({ columnName: flatFileId ? headerData.fieldName : headerData.columnName, dataType: headerData.dataType }));

      changeCalculationName(propKey, calculationLocalName)

      // TODO: use correct data set id here i guess
      addRecords(datasetId, tableInfo.id, recordsData, headersData);

      setTable(propKey, {
        [datasetId]: tableInfo.id
      })

      const allPropKeys = Object.keys(chartProperties?.properties)

      const propKeysToUpdate: {
        [key: string]: {
          binIndex: number,
          fieldIndex: number,
          fieldName: string,
          displayName: string,
          dataType: string,
          tableId: string,
          uId: string,
          agg: string,
          SavedCalculationUUID: string,
          isTextRenamed: boolean
        }
      } = {}

      for (const eachPropKey of allPropKeys) {
        chartProperties?.properties[eachPropKey]?.chartAxes?.forEach((ax: any, axId: number) => {
          ax?.fields?.forEach((field: any, fieldId: number) => {
            if (field.SavedCalculationUUID === currentCalculationSession.uuid) {
              propKeysToUpdate[eachPropKey] = {
                binIndex: axId,
                fieldIndex: fieldId,
                fieldName: calculationInfo.calculatedFieldName,
                displayName: `${field.agg} of ${currentCalculationSession.calculationInfo.calculatedFieldName}`,
                dataType: calculationInfo.fields[Object.keys(currentCalculationSession.calculationInfo.fields)[0]].dataType,
                tableId: tableInfo.id,
                uId: field.uId,
                agg: field.agg,
                SavedCalculationUUID: currentCalculationSession.uuid,
                isTextRenamed: false
              }
            }
          })
        })
      }

      for (const propKey in propKeysToUpdate) {
        updateQueryParam(
          propKey,
          propKeysToUpdate[propKey].binIndex,
          propKeysToUpdate[propKey].fieldIndex,
          {
            fieldname: propKeysToUpdate[propKey].fieldName,
            displayname: propKeysToUpdate[propKey].displayName,
            dataType: propKeysToUpdate[propKey].dataType,
            tableId: propKeysToUpdate[propKey].tableId,
            uId: propKeysToUpdate[propKey].uId,
            agg: propKeysToUpdate[propKey].agg,
            SavedCalculationUUID: propKeysToUpdate[propKey].SavedCalculationUUID,
            isTextRenamed: propKeysToUpdate[propKey].isTextRenamed,
            isCalculatedField: true,
            isAggregated: false
          },
          'chartAxes'
        )
      }

      saveCalculation(propKey, isCurrentCalculationPresent ? currentCalculationSession.uuid : uuid);

      setLastTestSuccess(false);

      resetCalculationSession(propKey);

    } else {

      setAlert({ severity: 'warning', message: "Something went wrong." })

    }

  };



  const [isInputActive, setIsInputActive] = useState<boolean>(false)
  const [alert, setAlert] = useState<any>(null);

  return (
    <div className="bottom-menu-container">
      {
        alert && <NotificationDialog
          severity={alert.severity}
          openAlert={alert}
          onCloseAlert={() => setAlert(null)}
          testMessage={alert.message}
        />
      }
      <Dialog
        open={lastTestSuccess}
        maxWidth="md"
        style={{
          position: "absolute",
          top: "20%",
          overflowY: "scroll",
          maxHeight: "60vh",
        }}
      >
        <DialogContent
          style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", position: "relative", height: "100%" }}>

          {
            isInputActive ? <input
              autoFocus
              onClick={(e) => {
                e.stopPropagation()
              }}
              onChange={(e) => {
                setCalculationLocalName(e.target.value)
              }}
              value={calculationLocalName}
              style={{
                width: "100%",
                height: "30px",
                border: "1px solid #d3d3d3",
                padding: "8px",
                fontSize: "24px"
              }}
            /> : <Tooltip slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -20],
                    },
                  },
                ],
              }
            }} placement="bottom" title="Double click to edit calculation name">
              <div
                onDoubleClick={() => setIsInputActive(true)}
                style={{
                  width: "100%",
                  height: "50px",
                  padding: "8px",
                  fontSize: "24px",
                  background: 'white',
                }}
              >
                {
                  calculationLocalName
                }
              </div>
            </Tooltip>
          }

          <div onClick={() => {
            setIsInputActive(false)
          }} style={{ overflowX: "hidden", width: "30vw" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
            </div>

            <DialogPreviewContent
              calculationInfo={calculationInfo}
              calculationName={calculationName}
              token={token}
              workspaceId={chartProp.properties[propKey]?.selectedDs?.workSpaceId}
              datasetId={chartProp.properties[propKey]?.selectedDs?.id}
              databaseId={chartProp.properties[propKey]?.selectedDs?.connectionId}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "auto", gap: "10px", marginTop: "10px" }}>
            <Button style={{ marginLeft: 'auto', color: palette.primary.contrastText, border: 'none', padding: '3px 5px', fontSize: fontSize.medium, }} variant='text' onClick={() => {
              setIsInputActive(false)
              setLastTestSuccess(false)
            }
            } >Close</Button>
            <Button onClick={handleCalculationSave} style={{ marginLeft: 'auto', background: palette.primary.main, color: 'white', border: 'none', padding: '3px 5px', fontSize: fontSize.medium }} >Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "228px",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}
      >
        <button
          onClick={() => {
            resetCalculationSession(propKey);
          }}
          style={{
            color: palette.primary.contrastText,
            background: "white",
            padding: "3px 5px",
            height: "2rem",
            flex: 1,
            border: "1px solid rgb(211, 211, 211)",
            borderRadius: "3px",
            fontSize: fontSize.medium,
          }}
        >
          Close
        </button>
        {/* {
          Object.keys(currentCalculationSession?.calculationInfo?.flows).length > 0 && 
        } */}
        <button
          onClick={async () => {

            const flows = currentCalculationSession?.calculationInfo?.flows

            if (Object.keys(flows).length === 0) {
              if (alert) {
                setAlert(null)
              } else {
                setAlert({ severity: 'warning', message: 'Please create a calculation step before testing.' })
              }
              return
            }

            const firstFlowId = Object.keys(currentCalculationSession?.calculationInfo?.flows)[0]

            const activeFlowName = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.flow
            const activeFlowType = currentCalculationSession?.activeFlowType ? currentCalculationSession?.activeFlowType : getFlowTypeFromFunctionName(activeFlowName)

            const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType

            if (!sourceTypes.includes('field') && activeFlowType !== 'Condition' && !['currentDate', 'currentTimestamp'].includes(activeFlowName)) {
              if (alert) {
                setAlert(null)
              } else {
                setAlert({ severity: 'warning', message: activeFlowName === 'stringToDate' ? 'Something is not right, please check if the format you provided is correct' : 'Please add at least one column from the table to proceed.' })
              }
              return
            }

            const tableList = Object.keys(fields).reduce((
              acc: any,
              index: string
            ) => {

              if (!acc.includes(fields[index].tableId)) {
                acc.push(fields[index].tableId)
              }

              return acc;

            }, [])

            if (tableList.length > 1) {
              const tableRelationResponse = await FetchData({
                url: `table-relationship?workspaceId=${workSpaceId}&dbconnectionid=${dbConnectionId}&datasetId=${datasetId}`,
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                requestType: "withData",
                data: {
                  "tableIds": tableList
                }
              })


              if (tableRelationResponse.status === true) {

                // TODO: the below check needs further improvement. This implementation is in the initial stage of the feature

                const tableRelation = tableRelationResponse.data

                setTableRelationshipStatus(tableRelation)

                const relationship = tableRelation[0].relationship
                const isDirect = tableRelation[0].isDirect

                if (
                  (relationship !== "one to many" && relationship !== "many to one" && relationship !== 'one to one') || !isDirect
                ) {
                  setAlert({ severity: 'warning', message: 'The relationship between chosen tables must be one to many and direct.' })
                  return
                }

              } else {
                setAlert("Something went wrong.")
              }
            }

            if (activeFlowType === 'Number') {

              if (Object.keys(currentCalculationSession?.calculationInfo?.flows).length === 0) {
                if (alert) {
                  setAlert(null)
                } else {
                  setAlert({ severity: 'warning', message: 'Please create a flow before testing.' })
                }
                return
              }

              if ([
                'absolute',
                'addition',
                'ceiling',
                'floor',
                'division',
                'min',
                'max',
                'multiplication',
                'subtraction'
              ].includes(activeFlowName)) {
                // check if minimum sources requirement is met for the current calculation if not show warning dialog
                if (!(minMax[`${activeFlowType}`][`${activeFlowName}`]?.min <= currentCalculationSession.calculationInfo.flows[activeFlowId ? activeFlowId : firstFlowId][0].sourceType.filter((src: any) => src === 'field' || src === 'decimal' || src === 'integer').length && minMax[`${activeFlowType}`][`${activeFlowName}`]?.max >= currentCalculationSession.calculationInfo.flows[activeFlowId ? activeFlowId : firstFlowId][0].sourceType.filter((src: any) => src === 'field' || src === 'decimal' || src === 'integer').length)) {
                  if (alert) {
                    setAlert(null)
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add more sources before testing.' })
                  }
                  return
                }

                setLastTestSuccess(true);
              } else if (['log'].includes(activeFlowName)) {

                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType

                if (sourceTypes.length !== 2 || sourceTypes[0] !== 'field') {
                  if (alert) {
                    setAlert(null)
                  }
                  setAlert({ severity: 'warning', message: 'Please add more sources before testing.' })
                  return
                } else {
                  setLastTestSuccess(true);
                }

              }

            } else if (activeFlowType === 'Condition') {
              if (activeFlowName === 'IfElse') {

                // const sourceList = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source
                const flowArray = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId]
                for (let i = 0; i < flowArray.length; i++) {
                  const condition = flowArray[i]

                  /**
                   * for if else source array has to be  of length 1
                   */
                  if (condition.source.length !== 1) {
                    if (alert) {
                      setAlert(null)
                    }
                    setAlert({ severity: 'warning', message: 'One or more fields are not filled properly' })
                    return
                  }
                  if (['if', 'elseIf'].includes(condition.condition)) {
                    /**
                     * as of now in evaluation only columns can be dropped
                     * 
                     */
                    const evaluationId = condition.filter;
                    if (!evaluationId || !currentCalculationSession?.calculationInfo?.conditionFilters?.[evaluationId]) {
                      if (alert) {
                        setAlert(null)
                      }
                      setAlert({ severity: 'warning', message: 'One or more fields are not filled properly' })
                      return
                    }
                    const evaluations = currentCalculationSession?.calculationInfo?.conditionFilters?.[evaluationId][0].conditions
                    if (evaluations.length > 0) {
                      setLastTestSuccess(true);
                      return
                    }
                  }
                  else if (condition.condition === 'else') {
                    setLastTestSuccess(true);
                    return
                  }
                  if (alert) {
                    setAlert(null)
                  }
                  setAlert({ severity: 'warning', message: 'One or more fields are not filled properly' })
                  return

                }
                // const 

                // if (sourceList.length === 0) {

                //   if (alert) {
                //     setAlert(null)
                //   }
                //   setAlert({ severity: 'warning', message: 'One or more fields are not filled properly' })

                //   return
                // } else {

                //   currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId].map((flow: any, index: number) => {
                //     const filterId = flow.filter
                //     const filterInfo = currentCalculationSession?.calculationInfo.conditionFilters[filterId][0]
                //     const conditions = filterInfo?.conditions

                //     if (conditions.length === 0 || (!(conditions[0].isValid))) {
                //       if (alert) {
                //         setAlert(null)
                //       }
                //       setAlert({ severity: 'warning', message: 'One or more conditions are not filled properly' })
                //       return
                //     }

                //     setLastTestSuccess(true);

                //   })

                // }

              }
            } else if (activeFlowType === 'Date') {

              // TODO: do this after discussing with Anirudha the great samurai
              if (["datePartName", "datePartNumber", "truncateDate"].includes(activeFlowName)) {

                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source
                if (sources.length === 2) {
                  // no need to show warning dialog
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add two sources before testing.' })
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add two sources before testing.' })
                  }
                  return
                }

              } else if (['currentDate', 'currentTimestamp'].includes(activeFlowName)) {
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source

                if (sources.length === 0) {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add one source before testing.' })
                    return
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add one source before testing.' })
                    return
                  }
                }
              } else if (['minDate', 'maxDate'].includes(activeFlowName)) {
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source
                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType

                if (sources.length === 1 && sourceTypes[0] === 'field') {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add one source before testing.' })
                    return
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add one source before testing.' })
                    return
                  }
                }
              } else if (activeFlowName === 'stringToDate') {
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source
                if (sources.length >= 4) {
                  // good to go no need to alert
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  }
                }
              } else if (activeFlowName === 'dateInterval') {
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source
                if (sources.length === 3 && (!sources.includes(null) || !sources.includes(undefined))) {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  }
                }
              } else if (activeFlowName === 'addDateInterval') {
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source

                if (sources.length === 3 && sources[1] !== '') {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                    return
                  }
                }

              }
            } else if (activeFlowType === 'String') {
              if (["lowercase", "uppercase", "propercase", "trim", "length", "ltrim", "rtrim"].includes(activeFlowName)) {
                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType.filter((type: string) => {
                  return type === 'field'
                })
                if (sourceTypes.length === 1) {
                  // no need to show warning dialog
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add two sources before testing.' })
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add two sources before testing.' })
                  }
                  return
                }
              } else if (['substringleft', 'substringright'].includes(activeFlowName)) {
                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType

                if (sourceTypes.length === 3 && sourceTypes[0] === 'field' && sourceTypes[1] === 'decimal' && sourceTypes[2] === 'text') {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  }
                  return
                }

              } else if (activeFlowName === 'split') {
                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source

                if (sourceTypes.length === 4 && sourceTypes[0] === 'field' && sourceTypes[1] === 'text' && sources[1].length > 0 && sourceTypes[2] === 'decimal' && sourceTypes[3] === 'text') {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  }
                  return
                }

              } else if (activeFlowName === 'replace') {
                const sourceTypes = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.sourceType
                const sources = currentCalculationSession?.calculationInfo?.flows[activeFlowId ? activeFlowId : firstFlowId][0]?.source

                if (sourceTypes.length === 3 && sourceTypes[0] === 'field' && sourceTypes[1] === 'text' && sources[1].length > 0 && sourceTypes[2] === 'text' && sources[2].length > 0) {
                  setLastTestSuccess(true)
                } else {
                  if (alert) {
                    setAlert(null)
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  } else {
                    setAlert({ severity: 'warning', message: 'Please add required sources before testing.' })
                  }
                  return
                }
              }
            }

          }}
          style={{
            background: palette.primary.main,
            color: "white",
            border: "none",
            height: "2rem",
            padding: "3px 5px",
            flex: 1,
            borderRadius: "3px",
            fontSize: fontSize.medium
          }}
        >
          Test formula
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
  return {
    chartProp: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
    chartControls: state.chartControls,
    calculations: state.calculations,
    token: state.isLogged.accessToken,
    chartProperties: state.chartProperties,
    sampleRecords: state.sampleRecords,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    addTableRecords: (ds_uid: string, tableId: string, tableRecords: any[], columnType: SampleRecordesColumnType[]) =>
      dispatch(addTableRecords(ds_uid, tableId, tableRecords, columnType)),
    addRecords: (id: string, tableId: string, tableRecords: any, columnType: any) =>
      dispatch(addTableRecords(id, tableId, tableRecords, columnType)),
    changeCalculationName: (propKey: string, calculationName: string) =>
      dispatch(updateCalculationName(propKey, calculationName)),
    saveCalculation: (propKey: string, uuid: string) =>
      dispatch(saveNewCalculation(propKey, uuid)),
    resetCalculationSession: (propKey: string) =>
      dispatch(resetCurrentCalculationSession(propKey)),
    addTableIdToCurrentCalculationSessionFunction: (tableId: string, propKey: string) =>
      dispatch(addTableIdToCurrentCalculationSession(tableId, propKey)),
    setTable: (propKey: string, selectedTable: any) =>
      dispatch(setSelectedTableInTile(propKey, selectedTable)),
    updateQueryParam: (propKey: string, binIndex: number, itemIndex: number, item: any, currentChartAxesName: string) =>
      dispatch(editChartPropItem("updateQuery", { propKey, binIndex, itemIndex, item, currentChartAxesName })
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlowList);