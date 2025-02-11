import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useDrop } from "react-dnd";
import {
  addCalculationField,
  addSourceInfoInCalculationFlow,
  deleteSourceFromFlow,
  moveSourceCard,
  setIsAggregated,
  updateDecimalSourceValue,
  updateSourceAggregation,
} from "../../../redux/Calculations/CalculationsActions";
import ShortUniqueId from "short-unique-id";
import { DataViewerMiddleStateProps } from "../../DataViewer/DataViewerMiddleInterfaces";
import { Menu, MenuItem, Popover } from "@mui/material";
import { Dispatch } from "redux";
import SourceListCard from "./SourceListCard";
import Conditions from "../Conditions/Conditions";
import SourceListNumberCard from "./SourceListNumberCard";
import BaseValue from "./log/BaseValue";
import ToggleButton from "../../Buttons/ToggleButton";
import MenuIcon from "@mui/icons-material/Menu";
import FunctionsIcon from "@mui/icons-material/Functions";
import ReplaceSettings from "./replace/ReplaceSettings";
import SplitSettings from "./split/SplitSettings";
import SubstringLeftSettings from "./substring/SubstringLeftSettings";
import SubstringRightSettings from "./substring/SubstringRightSettings";
import { categorizedOperationsCount, functionDefinitions, minMax } from "../constants";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import AddDateInterval from "../DateControls/AddDateInterval";
import NoFields from "../DateControls/NoFields";
import MinMaxDate from "../DateControls/MinMaxDate";
import TruncateDate from "../DateControls/TruncateDate";
import DateToNameOrNumberPipe from "../DateControls/DateToNameOrNumberPipe";
import DateDifference from "../DateControls/DateDifference";
import StringToDate from "../DateControls/StringToDate";
import { fontSize, palette } from "../../..";
import { getFlowFieldNameIfExists } from "../utils";
const CalculationRightPanel = ({
  // state
  calculations,
  tabTileProps,
  chartProp,

  // dispatch
  setIsAggregated,
  addCalculationField,
  addSourceInfoIntoCalculationFlow,
  deleteSourceFromFlowHandler,
  moveSourceCard,
  updateSourceAggregation,
  updateDecimalSourceValue,
}: any) => {

  const propKey = useMemo(
    () => `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`,
    [tabTileProps.selectedTabId, tabTileProps.selectedTileId]
  );
  const isFlowsEmpty =
    Object.keys(
      calculations.properties[propKey]?.currentCalculationSession?.calculationInfo
        .flows
    ).length === 0;

  const calculationFields =
    calculations.properties[propKey]?.currentCalculationSession?.calculationInfo?.fields;
  const currentCalculationSession =
    calculations.properties[propKey]?.currentCalculationSession;
  const activeFlow = currentCalculationSession?.activeFlow;
  const isIfElse = activeFlow === "IfElse";
  const [activeFieldNamesArray, setActiveFieldNamesArray] = useState<any[]>([]);
  const [activeFlowName, setActiveFlowName] = useState<string>("");
  const activeFlowType: 'Number' | 'String' | 'Date' | 'Condition' | 'Aggregation' = currentCalculationSession?.activeFlowType;
  const activeCondition = isIfElse
    ? currentCalculationSession?.activeCondition
    : null;
  const allowAggregationFlowTypes = ['Number']
  const selectedDataset = chartProp?.properties[propKey]?.selectedDs
  const datasetId = selectedDataset?.id
  const workSpaceId = selectedDataset?.workSpaceId
  const dbConnectionId = selectedDataset?.connectionId
  const isCurrentFlowAggregationAllowed = allowAggregationFlowTypes.includes(activeFlowType)

  const sources = activeFlow ? currentCalculationSession.calculationInfo.flows[activeFlow][0].source : null

  useEffect(() => {
    if (currentCalculationSession?.calculationInfo?.flows[activeFlow]) {
      setActiveFlowName(
        currentCalculationSession.calculationInfo.flows[activeFlow][0].flow
      );
    }
    else setActiveFlowName('')
  }, [currentCalculationSession.calculationInfo.flows[activeFlow], activeFlow, sources]);

  useEffect(() => {

    if (!currentCalculationSession.calculationInfo.flows[activeFlow]) return;

    // TODO: [activeFlow][0] <-- here this 0 is step. later introduce a step variable into this point. Like some flows will have multiple steps for example an if else statement
    const sourceIdsArray =
      currentCalculationSession.calculationInfo.flows[activeFlow][0].source;

    const sourceTypeArray =
      currentCalculationSession.calculationInfo.flows[activeFlow][0].sourceType;

    const activeFieldNamesArray = sourceIdsArray.map(
      (sourceId: string, index: number) => {
        return {
          ...calculationFields[sourceId],
          sourceUID: sourceId,
          sourceDataType: sourceTypeArray[index],
        };
      }
    );

    setActiveFieldNamesArray(activeFieldNamesArray);

    // TODO: activeFlow[0] <-- may arise a need to change 0 to dynamic value
  }, [currentCalculationSession, activeFlow, calculationFields, sources]);

  const [isAggregationActive, setIsAggregationActive] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [alert, setAlert] = useState<any>(null);

  const categorizedOperations = useMemo(() => categorizedOperationsCount, []);

  useEffect(() => {

    if (!currentCalculationSession.activeFlow) return;

    const activeFlowName = currentCalculationSession.calculationInfo.flows[currentCalculationSession.activeFlow][0].flow

    const flowFieldName = getFlowFieldNameIfExists(activeFlowName);

    // setFlowName(
    //   currentCalculationSession.calculationInfo.flows[
    //     currentCalculationSession.activeFlow
    //   ][0].flow
    // );

    setFlowName(flowFieldName ? flowFieldName : activeFlowName);

  }, [currentCalculationSession.activeFlow]);

  useEffect(() => {
    if (
      !currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
      ]
    )
      return;

    setIsAggregationActive(
      currentCalculationSession.calculationInfo.flows[
        currentCalculationSession.activeFlow
      ][0].isAggregation
    );
  }, [currentCalculationSession.activeFlow, currentCalculationSession.calculationInfo.flows]);

  const [, dropRef] = useDrop({
    accept: "card",
    drop: (item: any, monitor) => {

      let sourcesLength =
        currentCalculationSession.calculationInfo.flows[activeFlow][0].source
          .length;

      switch (activeFlowName) {
        case 'substringleft':
          sourcesLength = Object.keys(currentCalculationSession.calculationInfo.fields).length;
          break;
      }

      switch (activeFlowName) {
        case 'substringright':
          sourcesLength = Object.keys(currentCalculationSession.calculationInfo.fields).length;
          break;
      }

      // TODO: depricate the below if statement, move the logic to the switch case

      // the following if statement checks if the dropped item is the last item in the source array
      if (
        activeFlowName !== "log" &&
        ((categorizedOperations.singleSource.includes(activeFlowName) &&
          sourcesLength === 1) ||
          (categorizedOperations.twoSources.includes(activeFlowName) &&
            sourcesLength === 2) ||
          (categorizedOperations.multipleSources.includes(activeFlowName) &&
            sourcesLength === 8))
      )
        return;
      // else if (activeFlowName === 'log' && sourceTypeArray[1] === 'decimal') return

      if (
        activeFlowName === "log" &&
        currentCalculationSession.calculationInfo.flows[activeFlow][
          activeCondition === null ? 0 : activeCondition
        ].sourceType.length > 1
      )
        return;

      if (
        activeFlowType !== null &&
        ((activeFlowType === "String" && item.fieldData.dataType !== "text") ||
          // TODO: verify if item.fieldData.dataType is correct is "date" or "datetime" or "timestamp" or how is it represented basically
          (activeFlowType === "Date" && item.fieldData.dataType !== "date") ||
          (activeFlowType === "Number" &&
            item.fieldData.dataType !== "integer" &&
            item.fieldData.dataType !== "decimal"))
      ) {
        setAlert({ severity: 'warning', message: 'Incorrect data type for calculation' })
        return;
      }

      const uId = new ShortUniqueId({ length: 4 });

      const randomUUID = uId.randomUUID();

      addCalculationField(propKey, randomUUID, {
        tableId: item.fieldData.tableId,
        fieldName: item.fieldData.fieldname,
        displayName: item.fieldData.displayname,
        dataType: item.fieldData.dataType,
        timeGrain: "year",
      });

      addSourceInfoIntoCalculationFlow(
        randomUUID,
        {
          uid: activeFlow,
          //TODO: introduce step
          flow: currentCalculationSession.calculationInfo.flows[activeFlow][
            activeCondition === null ? 0 : activeCondition
          ].flow,

          // TODO: introduce aggregation type here, like sum, avg, min, max etc
        },
        propKey,
        "field",
        false,
        isCurrentFlowAggregationAllowed ? "sum" : null,
        activeCondition === null ? 0 : activeCondition
      );
    },
  });

  const handleAggregationSwitch = (option: string) => {

    if (currentCalculationSession.uuid) {
      if (alert) {
        setAlert(null)
      } else {
        setAlert({ severity: 'warning', message: 'Can not change aggregation for an already saved calculation' })
      }
      return
    }

    option === "row"
      ? setIsAggregated(
        propKey,
        activeCondition,
        currentCalculationSession.activeFlow,
        false
      )
      : setIsAggregated(
        propKey,
        activeCondition,
        currentCalculationSession.activeFlow,
        true
      );
  };

  const handleSourceCardCrossButton = (
    sourceId: string,
    sourceIndex: number
  ) => {
    deleteSourceFromFlowHandler(activeFlow, sourceId, propKey, sourceIndex);
  };

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    // introduce step
    moveSourceCard(dragIndex, hoverIndex, propKey, activeFlow, activeCondition);
  };

  const sourceTypeList = useMemo(
    () => ["text", "decimal", "integer", "binary", "date"],
    []
  );
  const [anchorElForSource, setAnchorElForSource] =
    React.useState<HTMLButtonElement | null>(null);

  const handleClickForSource = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElForSource(event.currentTarget);
  };

  const open = Boolean(anchorElForSource);
  const id = open ? "simple-popover" : undefined;

  const handleCloseForSource = () => {
    setAnchorElForSource(null);
  };

  const uId = new ShortUniqueId({ length: 4 });
  return (
    <>
      {
        alert && <NotificationDialog
          severity={alert.severity}
          openAlert={alert}
          onCloseAlert={() => setAlert(null)}
          testMessage={alert.message}
        />
      }
      {!isFlowsEmpty && (activeFlow !== null && activeFlow
        !== undefined
      ) ? (
        <Box
          sx={{
            minWidth: "14rem",
            borderLeft: "1px solid #d3d3d3",
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
            overflowX: "hidden",
            position: "relative",
            boxSizing: "border-box",
            scrollbarGutter: "stable both-edges",
            paddingRight: "5px",
            "&:hover": {
              overflowY: "auto"
            },
            "&::-webkit-scrollbar": {
              width: "5px",
            },
          }}

        >
          <div
            style={{
              display: "flex",
              // borderBottom: "1px solid #d3d3d3",
              justifyContent: "center",
              paddingTop: "0.5rem",
            }}
          >
            <ToggleButton
              button1Label={
                <MenuIcon
                  fontSize="small"
                  sx={{
                    color: palette.primary.contrastText,
                  }}
                />
              }
              button2Label={
                <FunctionsIcon
                  fontSize="small"
                  sx={{
                    color: palette.primary.contrastText,
                  }}
                />
              }
              onSelect={(option) => {
                handleAggregationSwitch(option);
              }}
              disableBtn1={["minDate", "maxDate"].includes(activeFlowName)}

              disableBtn2={[
                "stringToDate",
                "addDateInterval",
                "dateInterval",
                "datePartName",
                "datePartNumber",
                "truncateDate",
                "currentDate",
                "currentTimestamp",
                "IfElse",
                "lowercase",
                "uppercase",
                "propercase",
                "trim",
                "substringleft",
                "substringright",
                "length",
                "ltrim",
                "rtrim",
                "replace",
                "split",
                "min",
                "max"
              ]
                .includes(activeFlowName)}
              button1LabelTxt="row"
              button2labelTxt="visual"
              selectedLabel={isAggregationActive ? "visual" : "row"}
              tooltip1="Click to select Row Level Calculation"
              tooltip2="Click to select Visual Level Aggrigation"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '10px' }}>
            {currentCalculationSession.calculationInfo.flows[
              currentCalculationSession.activeFlow
            ][0].isAggregation ? (
              <p style={{ fontSize: fontSize.small, color: palette.primary.contrastText, marginTop: "3px" }}>
                Visual level aggregation
              </p>
            ) : (
              <p style={{ fontSize: fontSize.small, color: palette.primary.contrastText, marginTop: "3px" }}>
                Row level calculation
              </p>
            )}
          </div>
          {activeFlowName === "IfElse" ? (
            <Conditions key={activeFlowName} />
          ) : activeFlowName === "addDateInterval" ? (
            <AddDateInterval
              propKey={propKey}
              lengthOfSource={
                currentCalculationSession.calculationInfo.flows[activeFlow][0]
                  .source.length as number
              }
            />
          ) : ["currentTimestamp", "currentDate"].includes(activeFlowName) ? (
            <NoFields flowName={activeFlowName === 'currentDate' ? 'Today' : 'Now'} />
          ) : activeFlowName === 'truncateDate' ? (<TruncateDate
            propKey={propKey}
            lengthOfSource={1}
          />) : ['datePartName', 'datePartNumber'].includes(activeFlowName) ? (
            <DateToNameOrNumberPipe
              propKey={propKey}
              lengthOfSource={1}
              flow={activeFlowName}
            />
          ) :
            ["minDate", "maxDate"].includes(activeFlowName) ? (
              <MinMaxDate flowName={activeFlowName} propKey={propKey} />
            ) : activeFlowName === 'dateInterval' ? (<DateDifference
              propKey={propKey}
              lengthOfSource={1}
              flow={activeFlowName}
            />) : activeFlowName === 'stringToDate' ? (<StringToDate
              propKey={propKey}
              lengthOfSource={1}
            />) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    // paddingInline: "10px",
                    fontWeight: "bold",
                    // color: "gray",
                    textAlign: "start",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", }}>
                    <span style={{ fontSize: fontSize.large, paddingLeft: "10px", color: "#484848" }}>
                      {flowName.replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                    {/* introduce step */}
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#999999",
                        marginLeft: "0.3rem",
                      }}
                    >
                      {
                        activeFlowName !== "log" && ['Number'].includes(activeFlowType) &&
                        ` (${currentCalculationSession.calculationInfo.flows[activeFlow][0].sourceType.filter((src: any) => src === 'field' || src === 'decimal' || src === 'integer').length} of ${(activeFlowType === 'Number' || activeFlowType === 'String') && minMax[`${activeFlowType}`][`${activeFlowName}`]?.min} to ${categorizedOperations.singleSource.includes(
                          activeFlowName
                        )
                          ? 1
                          : categorizedOperations.twoSources.includes(
                            activeFlowName
                          )
                            ? 2
                            : 8
                        })`
                      }
                      {
                        activeFlowType === 'String' && `(${currentCalculationSession.calculationInfo.flows[activeFlow][0].sourceType.filter((src: any,) => src === 'field').length} of 1/1)`
                      }
                    </span>
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#999999",
                      }}
                    >
                      {
                        activeFlowName === "log" && ` (${currentCalculationSession.calculationInfo.flows[activeFlow][activeCondition === null ? 0 : activeCondition].sourceType.length === 1 ? 0 : 1}/1)`
                      }
                    </span>
                  </div>
                  {activeFlowName !== "log" && activeFlowType !== 'String' && (
                    <IconButton
                      size="small"
                      disabled={
                        currentCalculationSession.calculationInfo.flows[
                          activeFlow
                        ][activeCondition === null ? 0 : activeCondition].source
                          .length ===
                        (categorizedOperations.singleSource.includes(
                          activeFlowName
                        )
                          ? 1
                          : categorizedOperations.twoSources.includes(
                            activeFlowName
                          )
                            ? 2
                            : 8)
                      }
                      onClick={handleClickForSource}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                  {activeFlowName === "log" && (
                    <IconButton
                      size="small"
                      disabled={
                        (currentCalculationSession.calculationInfo.flows[activeFlow][activeCondition === null ? 0 : activeCondition].sourceType.length === 2)
                      }
                      onClick={handleClickForSource}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorElForSource}
                    onClose={handleCloseForSource}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Menu
                      id="lock-menu"
                      anchorEl={anchorElForSource}
                      open={open}
                      onClose={handleCloseForSource}
                      MenuListProps={{
                        "aria-labelledby": "lock-button",
                        role: "listbox",
                      }}
                    >
                      {sourceTypeList.map((item: any, index: number) => {
                        return (
                          <MenuItem
                            disabled={activeFlowType === 'Number' && (item === 'binary' || item === 'text' || item === 'date')}
                            dense
                            data-value={item}
                            key={index}
                            onClick={(event) => {
                              // TODO: add validation for other source types too
                              if (
                                event.currentTarget.dataset.value !== "decimal" &&
                                event.currentTarget.dataset.value !== "integer" &&
                                event.currentTarget.dataset.value !== "binary"
                              )
                                return;

                              // console.log('and the flow is: ', currentCalculationSession.calculationInfo.flows[activeFlow][activeCondition === null ? 0 : activeCondition].flow)
                              const randomUUID = uId.randomUUID();
                              addSourceInfoIntoCalculationFlow(
                                0,
                                {
                                  uid: activeFlow,
                                  flow: currentCalculationSession.calculationInfo
                                    .flows[activeFlow][
                                    activeCondition === null ? 0 : activeCondition
                                  ].flow,

                                  // TODO: introduce aggregation type here, like sum, avg, min, max etc
                                },
                                propKey,
                                event.currentTarget.dataset.value,
                                true,
                                "sum",
                                activeCondition === null ? 0 : activeCondition
                              );

                              setAnchorElForSource(null);
                            }}
                          >
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Popover>
                </div>
                {currentCalculationSession.calculationInfo.flows[activeFlow][
                  activeCondition === null ? 0 : activeCondition
                ].source.length === 0 && (
                    <p style={{ fontSize: "11px", color: "#999999", paddingLeft: "8px", textAlign: "start" }}>
                      {" "}
                      Drop a column or click + to add static values
                      {" "}
                    </p>
                  )}
                <div style={{ height: "100%" }}>
                  <div
                    ref={dropRef}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      padding: "5px",
                      height: `${[
                        "addition",
                        "multiplication",
                        "min",
                        "max",
                        "absolute",
                        "ceiling",
                        "floor",
                        "division",
                        "subtraction",
                        "lowercase",
                        "uppercase",
                        "propercase",
                        "trim",
                        "length",
                        "ltrim",
                        "rtrim"
                      ].includes(activeFlowName) ? "100%" : "30%"}`,
                      borderBottom: [
                        "addition",
                        "multiplication",
                        "min",
                        "max",
                        "absolute",
                        "ceiling",
                        "floor",
                        "division",
                        "subtraction",
                        "lowercase",
                        "uppercase",
                        "propercase",
                        "trim",
                        "length",
                        "ltrim",
                        "rtrim"
                      ].includes(activeFlowName) ? "1px solid #d3d3d3" : "none",
                    }}
                  >
                    {
                      sources.map((source: any, index: number) => {
                        const sourceType = currentCalculationSession?.calculationInfo?.flows[activeFlow][0].sourceType[index]

                        if (sourceType !== 'field' && ['String'].includes(activeFlowType)) return

                        if (sourceType === 'field') {
                          return <SourceListCard
                            index={index}
                            value={source}
                            aggregationMethod={
                              isAggregationActive
                                ? currentCalculationSession.calculationInfo.flows[
                                  activeFlow
                                ][0].aggregation[index]
                                : ""
                            }
                            calculationFlowUID={activeFlow}
                            displayName={currentCalculationSession?.calculationInfo?.fields[source].fieldName}
                            handleSourceCardCrossButton={handleSourceCardCrossButton}
                            isAggregationActive={isAggregationActive}
                            moveCard={moveCard}
                            propKey={propKey}
                            updateAggregation={updateSourceAggregation}
                          />
                        }
                        else if ((
                          sources.length === 1 ||
                          (sources.length === 2 && index === 1)
                        ) && activeFlowName === "log") return null;
                        else if (sourceType === "split" && index !== 0 && sourceType !== "field") return null;
                        else if (activeFlowName === 'substringleft' && sourceType !== 'field') return null
                        else if (activeFlowName === 'substringright' && sourceType !== 'field') return null;
                        if (sourceType === "decimal" || sourceType === "integer") return <SourceListNumberCard
                          index={index}
                          value={source}
                          valueType={sourceType}
                          handleSourceCardCrossButton={handleSourceCardCrossButton}
                          updateDecimalSourceValue={updateDecimalSourceValue}
                          moveCard={moveCard}
                        />
                      })
                    }
                  </div>
                  {activeFlowName === "log" && <BaseValue />}
                  {activeFlowName === 'replace' && <ReplaceSettings />}
                  {activeFlowName === 'split' && <SplitSettings />}
                  {activeFlowName === 'substringleft' && <SubstringLeftSettings />}
                  {activeFlowName === 'substringright' && <SubstringRightSettings />}
                </div>
              </div>
            )}
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};

const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
  return {
    chartProp: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
    chartControls: state.chartControls,
    calculations: state.calculations,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setIsAggregated: (
      propKey: string,
      step: number,
      calculationFlowUID: string,
      isAggregated: boolean
    ) =>
      dispatch(
        setIsAggregated(propKey, step, calculationFlowUID, isAggregated)
      ),
    addCalculationField: (
      propKey: string,
      calculationFieldUID: string,
      calculationField: any
    ) =>
      dispatch(
        addCalculationField(propKey, calculationFieldUID, calculationField)
      ),
    addSourceInfoIntoCalculationFlow: (
      tableId: string,
      calculationFlow: { uid: string; flow: string },
      propKey: string,
      dataType: string,
      isAggregation: boolean,
      aggregation: string,
      conditionNumber: number
    ) =>
      dispatch(
        addSourceInfoInCalculationFlow(
          tableId,
          calculationFlow,
          propKey,
          dataType,
          isAggregation,
          aggregation,
          conditionNumber
        )
      ),
    deleteSourceFromFlowHandler: (
      calculationFlowUID: string,
      sourceUID: string,
      propKey: string,
      sourceIndex: number
    ) =>
      dispatch(
        deleteSourceFromFlow(
          calculationFlowUID,
          sourceUID,
          propKey,
          sourceIndex
        )
      ),
    moveSourceCard: (
      dragIndex: number,
      hoverIndex: number,
      propKey: string,
      calculationFlowUID: string,
      step: number
    ) =>
      dispatch(
        moveSourceCard(dragIndex, hoverIndex, propKey, calculationFlowUID, step)
      ),
    updateSourceAggregation: (
      propKey: string,
      calculationFlowUID: string,
      step: number,
      sourceIndex: number,
      newAggregation: string
    ) =>
      dispatch(
        updateSourceAggregation(
          propKey,
          calculationFlowUID,
          step,
          sourceIndex,
          newAggregation
        )
      ),
    updateDecimalSourceValue: (
      propKey: string,
      sourceIndex: number,
      value: number
    ) => dispatch(updateDecimalSourceValue(propKey, sourceIndex, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculationRightPanel);
