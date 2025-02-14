import React, { useEffect, useState } from 'react';
import { Checkbox } from '@mui/material';
import axios from 'axios';
import { connect } from 'react-redux';
import FetchData from '../ServerCall/FetchData';
import {serverEndPoint} from "../ServerCall/EnvironmentVariables";


const SelectPickListCard = ({
    calculations,
    tabTileProps,
    sourceUid,
}: {
    tabTileProps: any,
    calculations: any,
    sourceUid: string
}) => {
    const propKey = tabTileProps.selectedTabId + '.' + tabTileProps.selectedTileId;
    const currentCalculationSession = calculations.properties[propKey].currentCalculationSession;
    const activeConditionIndex = currentCalculationSession.activeCondition;
    const activeConditionUid = currentCalculationSession.calculationInfo.flows[currentCalculationSession.activeFlow][activeConditionIndex].filter;
    const activeFlow = currentCalculationSession.activeFlow;

    const sourceIndex = currentCalculationSession.calculationInfo.flows[activeFlow][activeConditionIndex].source.findIndex((id: string) => id === sourceUid);

    const shouldExclude = currentCalculationSession.calculationInfo.conditionFilters[activeConditionUid][activeConditionIndex].conditions[0].shouldExclude;
    const conditionFilter = currentCalculationSession.calculationInfo.conditionFilters[activeConditionUid][activeConditionIndex];
    const [sourceFilterColumns, setSourceFilterColumns] = useState<any>([]);
    const [userSelection, setUserSelection] = useState<any>([]);
    const timeGrain = currentCalculationSession.calculationInfo.conditionFilters[activeConditionUid][sourceIndex].conditions[0].timeGrain;

    console.log({
        sourceIndex,
        timeGrain
    })

    // useEffect(() => {
    //     const fields = currentCalculationSession.calculationInfo.fields;
    //     axios.post("https://dev.silzila.com/api/filter-options?dbconnectionid=VUWoomoyaeC&workspaceId=m9IRdLziyPk&datasetid=v8K8u5QX63w", {
    //         tableId: fields[sourceUid].tableId,
    //         fieldName: fields[sourceUid].fieldName,
    //         dataType: fields[sourceUid].dataType,
    //         filterOption: "allValues",
    //         timeGrain: timeGrain
    //     }, {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //             'Content-Type': 'application/json',
    //         }
    //     })
    //         .then((rs) => {
    //             if (rs.data.length > 0) {
    //                 const values = rs.data.map((item: { [key: string]: string }) => item[Object.keys(item)[0]]);
    //                 setSourceFilterColumns(values);
    //                 setUserSelection(values);
    //             }
    //         });
    // }, [timeGrain]);
    useEffect(() => {
        const fields = currentCalculationSession.calculationInfo.fields;
    
        const fetchFilterOptions = async () => {
          try {
            const response = await FetchData({
              requestType: "withData",
              method: "POST",
              url: `filter-options?dbconnectionid=VUWoomoyaeC&workspaceId=m9IRdLziyPk&datasetid=v8K8u5QX63w`, 
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type": "application/json",
              },
              data: {
                tableId: fields[sourceUid].tableId,
                fieldName: fields[sourceUid].fieldName,
                dataType: fields[sourceUid].dataType,
                filterOption: "allValues",
                timeGrain: timeGrain
              }
            });
    
            if (response.status && response.data.length > 0) {
              const values = response.data.map((item: { [key: string]: string }) => item[Object.keys(item)[0]]);
              setSourceFilterColumns(values);
              setUserSelection(values);
            }
          } catch (err) {
            console.error("Error fetching filter options:", err);
          }
        };
    
        fetchFilterOptions();
      }, [timeGrain]);

    const handleCheckboxChange = (value: any) => {

        if (value === 'All' && userSelection.length === sourceFilterColumns.length) {
            setUserSelection([]);
            return;
        } else if (value === 'All' && userSelection.length !== sourceFilterColumns.length) {
            setUserSelection([...sourceFilterColumns]);
            return;
        }

        setUserSelection((prevSelection: any[]) => {
            if (prevSelection.includes(value)) {
                return prevSelection.filter(selectedItem => selectedItem !== value);
            } else {
                return [...prevSelection, value];
            }
        });
    };

    return (
        <div>
            {/* All checkbox */}

            <label className="UserFilterCard">
                {!shouldExclude ? (
                    <Checkbox
                        checked={userSelection.length === sourceFilterColumns.length}
                        name={'All'}
                        style={{
                            transform: "scale(0.8)",
                            paddingRight: "0px",
                        }}
                        sx={{
                            color: "red",
                            "&.Mui-checked": {
                                color: "#a6a6a6",
                            },
                        }}
                        onChange={() => handleCheckboxChange('All')}
                    />
                ) : (
                    <Checkbox
                        checked={userSelection.length === sourceFilterColumns.length}
                        name={'All'}
                        style={{
                            transform: "scale(0.8)",
                            paddingRight: "0px",
                        }}
                        sx={{
                            "&.Mui-checked": {
                                color: "orange",
                            },
                        }}
                        onChange={() => handleCheckboxChange('All')}
                    />
                )}
                <span
                    title={'All'}
                    style={
                        shouldExclude && userSelection.includes('All')
                            ? {
                                marginLeft: 0,
                                // marginTop: "3.5px",
                                justifySelf: "center",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textDecoration: "line-through",
                            }
                            : {
                                marginLeft: 0,
                                // marginTop: "3.5px",
                                justifySelf: "center",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }
                    }
                >
                    (All)
                </span>
            </label>

            {sourceFilterColumns.map((value: any, index: number) => (
                <label className="UserFilterCheckboxes" key={index}>
                    {!shouldExclude ? (
                        <Checkbox
                            checked={userSelection.includes(value)}
                            name={value}
                            style={{
                                transform: "scale(0.8)",
                                paddingRight: "0px",
                            }}
                            sx={{
                                color: "red",
                                "&.Mui-checked": {
                                    color: "#a6a6a6",
                                },
                            }}
                            onChange={() => handleCheckboxChange(value)}
                        />
                    ) : (
                        <Checkbox
                            checked={userSelection.includes(value)}
                            name={value}
                            style={{
                                transform: "scale(0.8)",
                                paddingRight: "0px",
                            }}
                            sx={{
                                "&.Mui-checked": {
                                    color: "orange",
                                },
                            }}
                            onChange={() => handleCheckboxChange(value)}
                        />
                    )}
                    <span
                        title={value}
                        style={
                            shouldExclude && userSelection.includes(value)
                                ? {
                                    marginLeft: 0,
                                    // marginTop: "3.5px",
                                    justifySelf: "center",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textDecoration: "line-through",
                                }
                                : {
                                    marginLeft: 0,
                                    // marginTop: "3.5px",
                                    justifySelf: "center",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                }
                        }
                    >
                        {value}
                    </span>
                </label>
            ))}
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    calculations: state.calculations,
    tabTileProps: state.tabTileProps,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SelectPickListCard);