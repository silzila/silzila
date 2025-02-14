import update from "immutability-helper";
import { ICalculationSession, ICurrentCalculationSession, ICalculationStep } from "./CurrentCalculationSessionInterface";
import { getFlowTypeFromFunctionName } from "../../Components/Calculations/utils";
import ShortUniqueId from "short-unique-id";

const calculationState: ICalculationSession = {
  properties: {
    ["1.1"]: {
      currentCalculationSession: null,
    },
  },
  propList: { 1: ["1.1"] },
  savedCalculations: [],
};

const CalculationReducer = (
  state: ICalculationSession = calculationState,
  action: any

) => {

  const uid = new ShortUniqueId({ length: 4 });

  const findIndex = (
    propKey: string,
    flowId: string,
    conditionUid: string
  ): number => {
    const currentCalculationSession =
      state.properties[propKey].currentCalculationSession;
    if (
      !currentCalculationSession ||
      !currentCalculationSession.calculationInfo
    )
      return -1;
    const flow = currentCalculationSession.calculationInfo.flows[flowId];
    const conditionIndex = flow.findIndex(
      (flow: any) => flow.flowId === conditionUid
    );
    return conditionIndex;
  };

  const findInfo = (
    propKey: string,
    flowId: string,
    conditionUid: string
  ): null | { conditionIndex: number; info: ICalculationStep } => {
    const currentCalculationSession =
      state.properties[propKey].currentCalculationSession;
    if (
      !currentCalculationSession ||
      !currentCalculationSession.calculationInfo
    )
      return null;
    const flow = currentCalculationSession.calculationInfo.flows[flowId];
    const conditionIndex = flow.findIndex(
      (flow: any) => flow.flowId === conditionUid
    );
    const condition = flow[conditionIndex];
    return {
      conditionIndex,
      info: condition,
    };
  };

  switch (action.type) {
    case "RESET_CALCULATION_STATE":
      return calculationState;
      
    case "SET_CALCULATION_STATE": {
      const { calculations } = action.payload
      if (!calculations) return state
      return update(state, { $set: calculations });
    }

    case "ADD_NEW_CALCULATION_SESSION": {
      const calculationName: string = action.payload.calculationName;
      const propKey: string = action.payload.propKey;
      const datasetId: string = action.payload.datasetId;

      const newState = update(state, {
        properties: {
          [propKey]: {
            $set: {
              currentCalculationSession: {
                name: calculationName,
                calculationInfo: {
                  selectedResultType: {},
                  flows: {},
                  fields: {},
                  conditionFilters: {},
                },
                flowPositions: {},
                activeFlow: null,
                activeFlowType: null,
                activeCondition: null,
                flowDisplayNames: {},
                datasetId: datasetId
              }
            }
          }
        },
        savedCalculations: {
          $set: state.savedCalculations ? state.savedCalculations : []
        }
      });

      return newState;
    }

    case "RESET_CALCULATION_SESSION": {

      // when the user presses close button in the calculation session

      const propKey = action.payload.propKey;

      const currentCalculationSession = state.properties[propKey].currentCalculationSession;

      if (!currentCalculationSession) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: { $set: null }
          }
        }
      });

      return newState
    }

    case "RESET_ALL_CALCULATION_SESSION": {

      // when the user presses silzila logo/home icon on the top left corner

      const propKey = action.payload.propKey;

      // const currentCalculationSession = state.properties[propKey].currentCalculationSession;

      // if (!currentCalculationSession) return state;

      const newState = update(state, {
        properties: {
          $set: {
            ['1.1']: {
              currentCalculationSession: null
            }
          }
        },
        propList: {
          $set: { [1]: ['1.1'] }
        },
        savedCalculations: { $set: [] }
      });

      return newState
    }

    case "ADD_INITIAL_CALCULATION_FLOW": {
      const propKey = action.payload.propKey;
      const calculationFlow = action.payload.calculationFlow;
      const conditionUid = action.payload.conditionUid;
      const flowDisplayName = action.payload.flowDisplayName
      const isAggregation = calculationFlow.isAggregation

      const calculationSession =
        state.properties[propKey].currentCalculationSession;
      let defaultCondition: string | null;

      if (calculationFlow.flow === "IfElse") {
        defaultCondition = "if";
      } else {
        defaultCondition = null;
      }

      if (calculationSession && calculationSession.calculationInfo) {
        const theUId = calculationFlow.uid;
        const theFlow = calculationFlow.flow;

        if (calculationSession.calculationInfo.conditionFilters && calculationFlow.flow === "IfElse") {
          calculationSession.calculationInfo.conditionFilters[conditionUid] = [
            {
              shouldAllConditionsMatch: false,
              lastDroppedEvaluationUid: null,
              conditions: [],
            },
          ];
        }

        calculationSession.calculationInfo.flows[theUId] = [
          {
            flowId: uid(),
            flow: theFlow,
            sourceType: [],
            source: [],
            isAggregation: theFlow === 'IfElse' ? false : isAggregation,
            isValid: false,
            aggregation: [],
            filter: theFlow === 'IfElse' ? conditionUid : null,
            condition: defaultCondition,
            conditionName: theFlow === 'IfElse' ? `Condition ${conditionUid!.split("flt")[1]}` : "",
          },
        ];

        calculationSession.activeFlow = theUId;
        calculationSession.activeFlowType = getFlowTypeFromFunctionName(
          calculationFlow.flow
        );
        calculationSession.activeCondition = 0;
        calculationSession.flowDisplayNames = {
          ...calculationSession.flowDisplayNames,
          [calculationFlow.uid]: flowDisplayName ?? calculationFlow.flow,
        };
      }

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: { $set: calculationSession },
          }
        }
      })

      return newState
    }

    case "UPDATE_ACTIVE_CONDITION_ID": {
      const { propKey, activeConditionId } = action.payload;
      const calculationSession =
        state.properties[propKey].currentCalculationSession;
      if (calculationSession) {
        calculationSession.activeCondition = activeConditionId;
      }
      return {
        ...state,
        properties: {
          ...state.properties,
          [propKey]: {
            currentCalculationSession: calculationSession,
          },
        },
      };
    }

    case "ADD_CONDITION_FOR_IF_ELSE": {
      const {
        propKey,
        conditionType,
        calculationFlow,
        conditionUid,
        activeConditionId,
      } = action.payload;
      const calculationSession =
        state.properties[propKey].currentCalculationSession;

      if (calculationSession && calculationSession.calculationInfo) {
        const theUId = calculationFlow.uid;
        const theFlow = calculationFlow.flow;
        if (calculationSession.calculationInfo.conditionFilters) {
          calculationSession.calculationInfo.conditionFilters[conditionUid] = [
            {
              shouldAllConditionsMatch: false,
              lastDroppedEvaluationUid: null,
              conditions: [],
            },
          ];
        }

        calculationSession.calculationInfo.flows[theUId].push({
          flowId: uid(),
          flow: theFlow,
          sourceType: [],
          source: [],
          isAggregation: false,
          aggregation: [],
          filter: conditionUid,
          condition: conditionType.charAt(0).toLowerCase() + conditionType.slice(1),
          conditionName: `Condition ${conditionUid!.split("flt")[1]}`,
          isValid: false
        });

        calculationSession.activeFlow = theUId;
        calculationSession.activeCondition =
          calculationFlow.flow === "IfElse" ? activeConditionId : null;
      }
      return {
        ...state,
        properties: {
          ...state.properties,
          [propKey]: {
            currentCalculationSession: calculationSession
          },
        },
      };
    }

    case "ADD_SOURCE_INFO_IN_CALCULATION_FLOW": {
      // tableId is source here. Change it to source. tableId is a bad variable name
      const tableId = action.payload.tableId;
      const dataType = action.payload.dataType;
      const calculationFlow = action.payload.calculationFlow;

      // TODO: isAggregation is of no use here. Shoud be removed
      const isAggregation = action.payload.isAggregation;
      const aggregation = action.payload.aggregation;
      const propKey = action.payload.propKey;
      const conditionNumber = action.payload.conditionNumber;

      const calculationSession =
        state.properties[propKey].currentCalculationSession;

      if (!calculationSession || !calculationSession.calculationInfo)
        return state;


      // flow type: replace
      if (calculationFlow.flow === 'replace' && dataType === 'field') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlow.uid]: {
                      0: {
                        source: { $apply: (source: any) => [tableId, ...source] },
                        sourceType: { $apply: (sourceType: any) => [dataType, ...sourceType] },
                        aggregation: { $apply: (agg: any) => [aggregation, ...agg] },
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (calculationFlow.flow === 'split' && dataType === 'field') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlow.uid]: {
                      0: {
                        source: { $apply: (source: any) => [tableId, ...source] },
                        sourceType: { $apply: (sourceType: any) => [dataType, ...sourceType] },
                        aggregation: { $apply: (agg: any) => [aggregation, ...agg] },
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (
        (calculationFlow.flow === 'substringleft' || calculationFlow.flow === 'substringright')
        &&
        dataType === 'field'
      ) {

        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlow.uid]: {
                      0: {
                        source: { $apply: (source: any) => [tableId, ...source] },
                        sourceType: { $apply: (sourceType: any) => [dataType, ...sourceType] },
                        aggregation: { $apply: (agg: any) => [aggregation, ...agg] },
                      }
                    }
                  }
                }
              }
            }
          }
        })

      }

      // flow type: log
      if (calculationFlow.flow === 'log' && calculationSession.calculationInfo.flows[calculationFlow.uid][0].sourceType[0] === 'decimal') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlow.uid]: {
                      0: {
                        source: {
                          $unshift: [tableId]
                        },
                        sourceType: {
                          $unshift: [dataType]
                        },
                        aggregation: {
                          $unshift: [aggregation]
                        }
                      }
                    },
                  }
                }
              }
            }
          }
        })
      }

      // TODO: write a check below. Because at some point we might be adding a number but may not always want to add it to the last position of the source array

      if (
        dataType === "decimal" ||
        dataType === "integer" ||
        dataType === "binary"
      ) {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlow.uid]: {
                      // introduce step
                      [conditionNumber === null ? 0 : conditionNumber]: {
                        sourceType: {
                          $push: [dataType],
                        },
                        source: {
                          $push: [tableId],
                        },
                        aggregation: {
                          $push: [aggregation],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }

      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [calculationFlow.uid]: {
                    // introduce step
                    [conditionNumber === null ? 0 : conditionNumber]: {
                      sourceType: {
                        $push: [dataType],
                      },
                      source: {
                        $push: [tableId],
                      },
                      aggregation: {
                        $push: [aggregation],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    case "ADD_CALCULATION_FIELD": {
      const calculationFieldUID = action.payload.calculationFieldUID;
      const calculatiionField = action.payload.calculationField;
      const propKey = action.payload.propKey;

      const calculationSession =
        state.properties[propKey].currentCalculationSession;

      if (calculationSession && calculationSession.calculationInfo) {
        calculationSession.calculationInfo.fields[calculationFieldUID] =
          calculatiionField;
      }

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                fields: { [calculationFieldUID]: { $set: calculatiionField } },
              },
            },
          },
        },
      });

      return newState;
    }

    case "SAVE_CALCULATION": {

      const propKey = action.payload.propKey;
      const uuid = action.payload.uuid;

      let currentCalculationSession: any = state.properties[propKey].currentCalculationSession
      const savedCalculations = state.savedCalculations
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      // data type for a calculation is going to be according the first source type
      // isAggregation will be there in calculation too, map through all source, if one is aggregated, then the calculation is aggregated

      currentCalculationSession.isAggregated = currentCalculationSession.calculationInfo.flows[Object.keys(currentCalculationSession.calculationInfo.flows)[0]][0].isAggregation
      currentCalculationSession.uuid = uuid
      // currentCalculationSession

      // check if the calculation is already present in the saved calculation list

      const isCalculationGettingUpdated = savedCalculations.find((calculation: any) => calculation.uuid === uuid)

      // check if the condition part is working
      if (isCalculationGettingUpdated) {

        return update(state, {
          savedCalculations: {
            $apply: (calculations: any) => {
              const newCalculations = calculations.filter((calculation: any) => calculation.uuid !== uuid)
              // this is the mistake, i'm adding current calculation session to the list of calculations without removing the old one
              return [...newCalculations, currentCalculationSession]
            }
          }
        })
      }

      const newState = update(state, {
        savedCalculations: { $push: [currentCalculationSession] }
      })

      return newState
    }

    case "SET_FLOW_POSITIONS": {
      const calculationFlowUID = action.payload.calculationFlowUID;
      const x = action.payload.x;
      const y = action.payload.y;
      const propKey = action.payload.propKey;

      const flowPositions = {
        x: x,
        y: y,
      };

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (!currentCalculationSession) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              flowPositions: {
                [calculationFlowUID]: { $set: flowPositions },
              },
            },
          },
        },
      })

      return newState
    }

    case "SET_IS_AGGREGATED": {
      const calculationFlowUID = action.payload.calculationFlowUID;
      const isAggregated = action.payload.isAggregated;
      const propKey = action.payload.propKey;
      const step = action.payload.step;

      if (
        !(
          state.properties[propKey].currentCalculationSession &&
          state.properties[propKey].currentCalculationSession.calculationInfo
        )
      )
        return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [calculationFlowUID]: {
                    [step === null ? 0 : step]: {
                      isAggregation: { $set: isAggregated },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "SET_ACTIVE_FLOW": {
      const calculationFlowUID = action.payload.calculationFlowUID;
      const propKey = action.payload.propKey;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (!currentCalculationSession) return state;
      if (!currentCalculationSession.calculationInfo) return state;

      const activeFlowName =
        calculationFlowUID === null
          ? null
          : currentCalculationSession.calculationInfo.flows[
            calculationFlowUID
          ][0].flow;

      return {
        ...state,
        properties: {
          ...state.properties,
          [propKey]: {
            ...state.properties[propKey],
            currentCalculationSession: {
              ...state.properties[propKey].currentCalculationSession,
              activeFlow: calculationFlowUID,
              activeFlowType:
                activeFlowName === null
                  ? null
                  : getFlowTypeFromFunctionName(activeFlowName),
            },
          },
        },
      };
    }

    case "DELETE_FLOW": {
      const propKey = action.payload.propKey;
      const calculationFlowUID = action.payload.flowUID;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (!currentCalculationSession?.calculationInfo) return state;
      if (!currentCalculationSession?.flowPositions) return state;

      const allFlowsUids = Object.keys(
        currentCalculationSession.calculationInfo.flows
      ).filter((flow: any) => flow !== calculationFlowUID);

      const flowName = currentCalculationSession.calculationInfo.flows[calculationFlowUID][0].flow

      if (flowName === 'IfElse') {

        const sourcesToDelete: string[] = []
        const conditionsToDelete: string[] = []

        currentCalculationSession.calculationInfo.flows[calculationFlowUID].forEach((flow, id) => {

          flow.sourceType.forEach((sourceType: string) => {
            if (sourceType === 'field') {
              sourcesToDelete.push(flow.source[id])
            }
          })

          const conditonId = flow.filter
          if (conditonId &&
            currentCalculationSession.calculationInfo?.conditionFilters[conditonId][0]?.conditions &&
            currentCalculationSession.calculationInfo?.conditionFilters[conditonId][0].conditions.length > 0 &&
            currentCalculationSession.calculationInfo?.conditionFilters[conditonId][0].conditions[0].leftOperandType[0] === 'field') {
            sourcesToDelete.push(currentCalculationSession.calculationInfo?.conditionFilters[conditonId][0].conditions[0].leftOperand[0])
          }
          if (conditonId && currentCalculationSession.calculationInfo?.conditionFilters[conditonId]) conditionsToDelete.push(conditonId)
        })

        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    $unset: [calculationFlowUID],
                  },
                  fields: {
                    $unset: sourcesToDelete
                  },
                  conditionFilters: {
                    $unset: conditionsToDelete
                  }
                },
                flowPositions: {
                  $unset: [calculationFlowUID]
                },
                activeFlow: {
                  $set: currentCalculationSession.activeFlow === calculationFlowUID
                    ? allFlowsUids[0]
                    : currentCalculationSession.activeFlow,
                }
              }
            }
          }
        })

      }

      const allSourcesRelatedToThisFlow = currentCalculationSession.calculationInfo.flows[calculationFlowUID][0].source.filter((src) => typeof src === 'string' && src.length > 0)

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  $unset: [calculationFlowUID],
                },
                fields: {
                  $unset: allSourcesRelatedToThisFlow
                }
              },
              flowPositions: {
                $unset: [calculationFlowUID],
              },
              activeFlow: {
                $set:
                  currentCalculationSession.activeFlow === calculationFlowUID
                    ? allFlowsUids[0]
                    : currentCalculationSession.activeFlow,
              },
            },
          },
        },
      });

      return newState;
    }

    case "DELETE_SOURCE": {
      const calculationFlowUID = action.payload.calculationFlowUID;
      const sourceID = action.payload.sourceUID;
      const propKey = action.payload.propKey;
      const sourceIndex = action.payload.sourceIndex;

      // from the source you can get the active condition uid and then delete the condition filter from the condition filters object

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const activeCondition = currentCalculationSession.activeCondition;

      const activeConditionUid =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          activeCondition === null ? 0 : activeCondition
        ].filter;

      if (activeCondition === null) {
        const newState = update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlowUID]: {
                      // introduce step when necessary
                      0: {
                        source: {
                          $apply: (source: any) =>
                            source.filter(
                              (id: any, index: number) => index !== sourceIndex
                            ),
                        },
                        sourceType: {
                          $apply: (sourceType: any) =>
                            sourceType.filter(
                              (id: any, index: number) => index !== sourceIndex
                            ),
                        },
                        aggregation: {
                          $apply: (aggregation: any) =>
                            aggregation.filter(
                              (id: any, index: number) => index !== sourceIndex
                            ),
                        },
                      },
                    },
                  },
                  fields: {
                    $apply: (fields: any) => {
                      const newFields = fields;
                      delete newFields[sourceID];
                      return newFields;
                    },
                  },
                },
              },
            },
          },
        });


        return newState;
      } else {
        const newState = update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [calculationFlowUID]: {
                      // introduce step when necessary
                      0: {
                        source: {
                          $apply: (source: any) => {
                            const newSource = source.filter((src: any, id: number) => {
                              return id !== sourceIndex;
                            });
                            return newSource;
                          },
                        },
                        sourceType: {
                          $apply: (sourceType: any) => {
                            const newSourceType = sourceType.filter(
                              (id: any, index: number) => {
                                if (index !== sourceIndex) {
                                  console.log("Deleting");
                                }
                                return index !== sourceIndex;
                              }
                            );
                            return newSourceType;
                          },
                        },
                        aggregation: {
                          $apply: (aggregation: any) => {
                            const newAggregation = aggregation.filter(
                              (id: any, index: number) => {
                                return index !== sourceIndex;
                              }
                            );
                            return newAggregation;
                          },
                        },
                      },
                    },
                  },
                  fields: {
                    $apply: (fields: any) => {
                      const newFields = { ...fields };
                      delete newFields[sourceID];
                      return newFields;
                    },
                  },
                },
              },
            },
          },
        });

        return newState;
      }
    }
    /**
         * Next case is  added as a part of the refactoring process
         * the state structure has been changed  for condition filter  filterIdx is needed to delete condition filter
         * 
         * do not use this reducer outside ifelse
         */
    case "DELETE_SOURCE_V2": {
      const calculationFlowUID = action.payload.calculationFlowUID;
      const sourceID = action.payload.sourceUID;
      const propKey = action.payload.propKey;
      const sourceIndex = action.payload.sourceIndex;
      const filterIdx = action.payload.filterIdx;
      // from the source you can get the active condition uid and then delete the condition filter from the condition filters object

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const activeCondition = currentCalculationSession.activeCondition;
      if (activeCondition === null) return state;
      const activeConditionUid =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          activeCondition
        ].filter;
      const fieldId = currentCalculationSession?.calculationInfo?.conditionFilters?.[`${activeConditionUid}`]?.[0]?.conditions?.[filterIdx]?.leftOperand?.[0] ?? "";
      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                fields: {
                  $apply: (fields: any) => {
                    const newFields = { ...fields };
                    delete newFields[fieldId];
                    return newFields;
                  },
                },
                conditionFilters: {
                  [`${activeConditionUid}`]: {
                    0: {
                      lastDroppedEvaluationUid: { $set: null },
                      conditions: {
                        $splice: [[filterIdx, 1]],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });


      return newState;
    }
    /**
     * for v3 threr
     */
    case "DELETE_SOURCE_V3": {
      return state
    }
    case "MOVE_SOURCE_CARD": {
      let { dragIndex, hoverIndex, propKey, calculationFlowUID, step } =
        action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      if (step === null) step = 0;
      const sourceBackup =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          step
        ].source[dragIndex];
      const sourceTypeBackup =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          step
        ].sourceType[dragIndex];
      const aggregationBackup =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          step
        ].aggregation[dragIndex];

      if (!sourceBackup || !sourceTypeBackup || !aggregationBackup)
        return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [calculationFlowUID]: {
                    [step]: {
                      source: {
                        $splice: [
                          [dragIndex, 1],
                          [hoverIndex, 0, sourceBackup],
                        ],
                      },
                      sourceType: {
                        $splice: [
                          [dragIndex, 1],
                          [hoverIndex, 0, sourceTypeBackup],
                        ],
                      },
                      aggregation: {
                        $splice: [
                          [dragIndex, 1],
                          [hoverIndex, 0, aggregationBackup],
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "UPDATE_SOURCE_AGGREGATION": {
      const { propKey, calculationFlowUID, step, sourceIndex, newAggregation } =
        action.payload;

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;


      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [calculationFlowUID]: {
                    [step]: {
                      aggregation: {
                        $splice: [[sourceIndex, 1, newAggregation]],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "UPDATE_FLOW_POSITIONS": {
      const { propKey, calculationFlowUID, x, y } = action.payload;

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              flowPositions: {
                [calculationFlowUID]: {
                  $set: {
                    x,
                    y,
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }
    case "UPDATE_FLOW_CONDITION": {
      const { propKey, calculationFlowUID, conditionIndex, condition } =
        action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const conditionFilterID =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          conditionIndex
        ].filter;
      let newConditions =
        currentCalculationSession.calculationInfo.conditionFilters[
          conditionFilterID!
        ][0].conditions;
      let source = currentCalculationSession.calculationInfo.flows[calculationFlowUID][conditionIndex].source
      let sourceType = currentCalculationSession.calculationInfo.flows[calculationFlowUID][conditionIndex].sourceType
      let fields = currentCalculationSession.calculationInfo.fields
      if (condition === "Else") {
        const fildsToBeDeleted = source
        fields = Object.keys(fields).reduce((acc: any, field: any) => {
          if (fildsToBeDeleted.includes(field)) {
            return acc
          }
          return { ...acc, [field]: fields[field] }
        },
          {})
        newConditions = []
        source = []
        sourceType = []
      }
      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [calculationFlowUID]: {
                    [conditionIndex]: {
                      condition: { $set: condition },
                      source: { $set: source },
                      sourceType: { $set: sourceType },
                    },
                  },
                },
                fields: { $set: fields },
                conditionFilters: {
                  [conditionFilterID!]: {
                    0: {
                      conditions: {
                        $set: newConditions,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return newState;
    }

    case "ADD_CONDITION_FILTER": {
      const { propKey, conditionFilter } = action.payload;



      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const calculationFlowUID = currentCalculationSession.activeFlow;
      const activeCondition = currentCalculationSession.activeCondition;

      if (calculationFlowUID === null || activeCondition === null) return state;

      const activeConditionUID =
        currentCalculationSession.calculationInfo.flows[calculationFlowUID][
          activeCondition
        ].filter;

      if (!activeConditionUID) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [activeConditionUID]: {
                    0: {
                      lastDroppedEvaluationUid: { $set: conditionFilter.conditionUID },
                      conditions: {
                        $push: [conditionFilter],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }
    case "DELETE_CONDITION_FROM_IF_ELSE": {
      const { propKey, flowId, conditionUid } = action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const flow = currentCalculationSession.calculationInfo.flows[flowId];
      const conditionIndex = flow.findIndex(
        (flow: any) => flow.flowId === conditionUid
      );
      if (conditionIndex === -1) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    $splice: [[conditionIndex, 1]],
                  },
                },
              },
              activeCondition: {
                $set: 0,
              },
            },
          },
        },
      });
    }
    case "UPDATE_SEARCH_CONDITION_FILTER": {
      const {
        propKey,
        conditionFilterUid, // example: flt0
        sourceUid, // example: f1
        shouldExclude, // example: false
      } = action.payload;



      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const activeConditionIndex = currentCalculationSession.activeCondition;
      if (activeConditionIndex === null) return state;

      const flowUid = currentCalculationSession.activeFlow;

      if (!flowUid) return state;

      const sourceIndex = currentCalculationSession.calculationInfo.flows[
        flowUid
      ][activeConditionIndex].source.findIndex(
        (id: string) => id === sourceUid
      );

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [conditionFilterUid]: {
                    [sourceIndex]: {
                      conditions: {
                        [0]: {
                          shouldExclude: { $set: shouldExclude },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }
    case "DELETE_CONDITION_FILTER": {
      const { propKey, conditionFilterUid } = action.payload;
      if (conditionFilterUid === "") return state;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo ||
        !currentCalculationSession.calculationInfo.conditionFilters
      )
        return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  $unset: [conditionFilterUid],
                },
              },
            },
          },
        },
      });
    }
    case "UPDATE_CONDITION_FILTER": {
      const {
        propKey,
        conditionFilterUid, // example: flt0
        sourceUid,
        conditionFilter, // example: f1
        filterIdx,
      } = action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const activeConditionIndex = currentCalculationSession.activeCondition;
      if (activeConditionIndex === null) return state;

      const flowUid = currentCalculationSession.activeFlow;

      if (!flowUid) return state;
      const leftOprnd =
        currentCalculationSession.calculationInfo.conditionFilters[
          conditionFilterUid
        ][0].conditions[filterIdx].leftOperand;
      const conditionUID =
        currentCalculationSession.calculationInfo.conditionFilters[
          conditionFilterUid
        ][0].conditions[filterIdx].conditionUID;
      const filterType =
        currentCalculationSession.calculationInfo.conditionFilters[
          conditionFilterUid
        ][0].conditions[filterIdx].filterType;

      const leftOprndType =
        currentCalculationSession.calculationInfo.conditionFilters[
          conditionFilterUid
        ][0].conditions[filterIdx].leftOperandType;
      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [conditionFilterUid]: {
                    0: {
                      conditions: {
                        [filterIdx]: {
                          $set: {
                            conditionUID: conditionUID,
                            filterType: filterType,
                            leftOperand: leftOprnd,
                            leftOperandType: leftOprndType,
                            isValid: conditionFilter.isValid ?? false,
                            ...conditionFilter,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return newState;
    }
    case "UPDATE_FILTER_OPERATOR": {
      const {
        propKey,
        conditionFilterUid, // example: flt0
        sourceUid, // example: f1
        shouldExclude, // example: false
      } = action.payload;

      if (!conditionFilterUid || !sourceUid) return state;

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;

      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const activeConditionIndex = currentCalculationSession.activeCondition;
      if (activeConditionIndex === null) return state;

      const flowUid = currentCalculationSession.activeFlow;

      if (!flowUid) return state;

      const sourceIndex = currentCalculationSession.calculationInfo.flows[
        flowUid
      ][activeConditionIndex].source.findIndex(
        (id: string) => id === sourceUid
      );

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [conditionFilterUid]: {
                    [sourceIndex]: {
                      conditions: {
                        [0]: {
                          operator: { $set: action.payload.operator },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "UPDATE_TIMEGRAIN": {
      const { propKey, conditionFilterUid, filterIdx, timeGrain } =
        action.payload;

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const activeConditionIndex = currentCalculationSession.activeCondition;
      if (activeConditionIndex === null) return state;

      const flowUid = currentCalculationSession.activeFlow;

      if (!flowUid) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [conditionFilterUid]: {
                    0: {
                      conditions: {
                        [filterIdx]: {
                          timeGrain: { $set: timeGrain },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "TOGGLE_IS_TILL_DATE": {
      const { propKey, conditionFilterUid, sourceIndex } = action.payload;



      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const activeConditionIndex = currentCalculationSession.activeCondition;
      if (activeConditionIndex === null) return state;

      const flowUid = currentCalculationSession.activeFlow;

      if (!flowUid) return state;


      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                conditionFilters: {
                  [conditionFilterUid]: {
                    [sourceIndex]: {
                      conditions: {
                        [0]: {
                          isTillDate: {
                            $set: !currentCalculationSession.calculationInfo
                              .conditionFilters[conditionFilterUid][sourceIndex]
                              .conditions[0].isTillDate,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      return newState;
    }

    case "UPDATE_DECIMAL_SOURCE_VALUE": {
      const { propKey, sourceIndex, value } = action.payload;
      ;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const activeConditionIndex = currentCalculationSession.activeCondition;
      const flowUid = currentCalculationSession.activeFlow;
      if (!flowUid) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowUid]: {
                    [activeConditionIndex === null ? 0 : activeConditionIndex]: {
                      source: {
                        [sourceIndex]: { $set: Number(value) },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return newState;
    }

    case "UPDATE_SOURCE": {

      let { propKey, sourceIndex, newSourceValue } = action.payload;

      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      const activeFlow = currentCalculationSession.activeFlow;
      if (!activeFlow) return state;
      const activeFlowName = currentCalculationSession.calculationInfo.flows[activeFlow][0].flow;
      const totalSourceLength = currentCalculationSession.calculationInfo.flows[activeFlow][0].source.length;

      if (activeFlowName === 'replace') {

        totalSourceLength === 3 ? sourceIndex = sourceIndex + 1 : sourceIndex = sourceIndex;

      } else if (activeFlowName === 'split') {

        totalSourceLength === 4 ? sourceIndex = sourceIndex + 1 : sourceIndex = sourceIndex;

      } else if (activeFlowName === 'substringleft' || activeFlowName === 'substringright') {

        totalSourceLength === 3 ? sourceIndex = sourceIndex + 1 : sourceIndex = sourceIndex;

      }

      const sourceType = currentCalculationSession.calculationInfo.flows[activeFlow][0].sourceType[sourceIndex];

      let newState = state;

      if (sourceType === 'text' && (activeFlowName === 'substringleft' || activeFlowName === 'substringright')) {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [activeFlow]: {
                      [0]: {
                        source: {
                          [sourceIndex]: {
                            $set: newSourceValue
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (sourceType === 'decimal' && (activeFlowName === 'substringleft' || activeFlowName === 'substringright')) {

        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [activeFlow]: {
                      [0]: {
                        source: {
                          [sourceIndex]: {
                            $set: newSourceValue
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (sourceType === 'text' && activeFlowName === 'replace') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [activeFlow]: {
                      [0]: {
                        source: {
                          [sourceIndex]: {
                            $set: newSourceValue
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (sourceType === 'text' && activeFlowName === 'split') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [activeFlow]: {
                      [0]: {
                        source: {
                          [sourceIndex]: {
                            $set: newSourceValue
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (sourceType === 'decimal' && activeFlowName === 'split') {
        return update(state, {
          properties: {
            [propKey]: {
              currentCalculationSession: {
                calculationInfo: {
                  flows: {
                    [activeFlow]: {
                      [0]: {
                        source: {
                          [sourceIndex]: {
                            $set: newSourceValue
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }

      if (sourceType === 'text' && activeFlowName === 'split') {

        const possibleDirections = ['left', 'right']

        const isDirection = possibleDirections.includes(newSourceValue)
        let left: number

        if (!isDirection) {
          return update(state, {
            properties: {
              [propKey]: {
                currentCalculationSession: {
                  calculationInfo: {
                    flows: {
                      [activeFlow]: {
                        [0]: {
                          source: {
                            [sourceIndex]: {
                              $set: newSourceValue
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })
        }
      }

      return newState;
    }

    case "UPDATE_FLOW_DISPLAY_NAME": {
      const { propKey, flowUID, displayName } = action.payload;

      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              flowDisplayNames: {
                [flowUID]: { $set: displayName },
              },
            },
          },
        },
      });

      return newState;
    }
    case "SORT_CONDITION_IN_IF_ELSE": {
      const { propKey, flowId, dragConditionUid, dropConditionUid } =
        action.payload;
      const dropIndex = findIndex(propKey, flowId, dropConditionUid);
      const draggedItem = findInfo(propKey, flowId, dragConditionUid);
      if (draggedItem === null || dropIndex === -1) return state;
      const _currentFlowOrder =
        state.properties[propKey]?.currentCalculationSession?.calculationInfo
          ?.flows[flowId];
      if (!_currentFlowOrder) return state;

      const [item] = _currentFlowOrder.splice(draggedItem.conditionIndex, 1);
      _currentFlowOrder.splice(dropIndex, 0, item);
      const currentFlowOrder = [..._currentFlowOrder];



      if (
        !currentFlowOrder[dropIndex] ||
        !currentFlowOrder[draggedItem.conditionIndex]
      )
        return state;

      _currentFlowOrder[0].condition = "If";
      for (let i = 1; i < _currentFlowOrder.length; i++) {
        const prevType = i > 0 ? _currentFlowOrder[i - 1].condition : null;
        const nextType =
          i < _currentFlowOrder.length - 1
            ? _currentFlowOrder[i + 1]?.condition
            : null;
        if (_currentFlowOrder[i].condition === "If") {
          if (prevType === "ElseIf" && nextType === "ElseIf") {
            _currentFlowOrder[i].condition = "ElseIf";
          }
        } else if (_currentFlowOrder[i].condition === "ElseIf") {
          if (prevType === "If" && nextType === "If") {
            _currentFlowOrder[i].condition = "If";
          }
        } else {
          if (i !== _currentFlowOrder.length - 1) {
            if (prevType === "If") {
              _currentFlowOrder[i].condition = "If";
            }
            else _currentFlowOrder[i].condition = "ElseIf";
          }
        }
      }
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    $set: currentFlowOrder,
                  },
                },
              },
            },
          },
        },
      });
    }
    case "REVERT": {
      const { propKey, flowId, conditionList } = action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const flow = currentCalculationSession.calculationInfo.flows[flowId];
      if (!flow) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    $set: conditionList,
                  },
                },
              },
            },
          },
        },
      });
    }
    case "CORRECT_CONDITION_TYPE_FLOW": {
      const { propKey, flowId } = action.payload;
      const currentCalculationSession =
        state.properties[propKey].currentCalculationSession;
      if (
        !currentCalculationSession ||
        !currentCalculationSession.calculationInfo
      )
        return state;
      const flow = currentCalculationSession.calculationInfo.flows[flowId];
      if (!flow) return state;
      let prevConditionType = "If";
      const newFlow = flow.map(
        (conditionInfo: ICalculationStep, index: number) => {
          if (index === 0) {
            return {
              ...conditionInfo,
              condition: "If",
            };
          }
          if (conditionInfo.condition !== prevConditionType) {
            if (index + 1 >= flow.length) {
              return {
                ...conditionInfo,
                condition:
                  conditionInfo.condition === "If"
                    ? "Else"
                    : conditionInfo.condition,
              };
            }
            const nextConditionType = flow[index + 1].condition;
            if (nextConditionType !== conditionInfo.condition) {
              prevConditionType = nextConditionType!;
              return {
                ...conditionInfo,
                condition: nextConditionType,
              };
            }
          }
          prevConditionType = conditionInfo.condition!;
          return conditionInfo;
        }
      );
      prevConditionType = "If";
      const _newFlow = flow.map(
        (conditionInfo: ICalculationStep, index: number) => {
          if (index === 0) {
            return {
              ...conditionInfo,
              condition: "If",
            };
          }
          if (conditionInfo.condition === "If" && prevConditionType !== "If") {
            return {
              ...conditionInfo,
              condition: prevConditionType,
            };
          } else if (
            conditionInfo.condition === "ElseIf" &&
            prevConditionType !== "ElseIf"
          ) {
            return {
              ...conditionInfo,
              condition: prevConditionType,
            };
          }
        }
      );
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    $set: newFlow,
                  },
                },
              },
            },
          },
        },
      });
    }
    case "UPDATE_CALCULATION_NAME": {
      const { propKey, calculationName } = action.payload;

      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;

      const newState = update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              name: { $set: calculationName },
              // calculationInfo: 
            }
          }
        }
      })
      return newState;
    }
    case "ADD_RESULT_FOR_IF_ELSE": {
      const { propKey,
        flowId,
        conditionIndex,
        sourceId,
        sourceType } = action.payload;
      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      if (!currentCalculationSession.calculationInfo.flows[flowId][conditionIndex]) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [conditionIndex]: {
                      source: { $set: [sourceId] },
                      sourceType: { $set: [sourceType] }
                    }
                  }
                }
              }
            }
          }
        }
      })


    }
    case "SET_RESULT_TYPE_FOR_IF_ELSE": {
      const { propKey,
        flowId,
        resultType } = action.payload;
      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                selectedResultType: {
                  [flowId]: { $set: resultType }
                }
              }
            }
          }
        }
      })

    }
    case "RESET_RESULT_FOR_IF_ELSE": {
      const { propKey,
        flowId,
        conditionIndex } = action.payload;
      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      if (!currentCalculationSession.calculationInfo.flows[flowId][conditionIndex]) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [conditionIndex]: {
                      source: { $set: [] },
                      sourceType: { $set: [] }
                    }
                  }
                }
              }
            }
          }
        }
      })


    }
    case "DELETE_RESULT_FOR_IF_ELSE": {
      const { propKey, flowId, conditionIndex } = action.payload;
      if (propKey == null || flowId == null || conditionIndex == null) return state;

      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (
        !(currentCalculationSession &&
          currentCalculationSession.calculationInfo &&
          currentCalculationSession.activeFlow)
      ) return state;

      const currentCondition = currentCalculationSession.calculationInfo.flows[flowId][conditionIndex];
      const onlyConditionWithResultField =
        currentCalculationSession.calculationInfo.flows[
          currentCalculationSession.activeFlow
        ].filter(
          (condition) =>
            condition.source.length === 1 && condition.flowId !== currentCondition.flowId
        ).length === 0;

      // Create a new state with immutability-helper
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [conditionIndex]: {
                      source: { $set: [] },
                      sourceType: { $set: [] },
                    },
                  },
                },
                selectedResultType: {
                  [currentCalculationSession.activeFlow]: {
                    $set: onlyConditionWithResultField ? null : currentCalculationSession.calculationInfo.selectedResultType[currentCalculationSession.activeFlow],
                  },
                },
              },
            },
          },
        },
      });
    }

    case "EDIT_SAVED_CALCULATION": {
      // obviously first set the calculation to be current calculation session, then delete the old one
      const { calculationFieldName, propKey } = action.payload;

      console.log("Inside redux, got the values: ", {
        propKey,
        calculationFieldName
      })

      // from this field name we can get the whole saved calculation object
      const calculationToBeEdited = state.savedCalculations.find((calc: any) => {
        return calc.calculationInfo.calculatedFieldName.toLowerCase().replace(/[^a-z0-9]/g, '') === calculationFieldName.toLowerCase().replace(/[^a-z0-9]/g, '')
      })

      if (!calculationToBeEdited) return state;

      const newState = update(state, {
        properties: {
          $merge: {
            [propKey]: {
              currentCalculationSession: calculationToBeEdited
            }
          }
        }
      })

      return newState;
    }

    case "DELETE_SAVED_CALCULATION": {
      const { calculationFieldName, propKey } = action.payload;

      console.log('Received Delete Saved Calculation action', calculationFieldName, propKey)

      const indexOfToBeDeleted = state.savedCalculations.findIndex((calc: any) => {
        return calc.calculationInfo.calculatedFieldName === calculationFieldName
      })

      const newState = update(state, {
        savedCalculations: {
          $splice: [[indexOfToBeDeleted, 1]]
        }
      })

      return newState;
    }

    case "SET_SOURCE": {
      let { propKey, flowId, subFlowId, source, sourceType, sourceIndex } = action.payload;
      if (!subFlowId) subFlowId = 0;
      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      if (!currentCalculationSession.calculationInfo.flows[flowId][subFlowId]) return state;
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [subFlowId]: {
                      source: { $splice: [[sourceIndex, 1, source]] },
                      sourceType: { $splice: [[sourceIndex, 1, sourceType]] }
                    }
                  }
                }
              }
            }
          }
        }
      })

    }

    case "RESET_SOURCE": {
      let { propKey, flowId, subFlowId } = action.payload;
      if (!subFlowId) subFlowId = 0;
      const currentCalculationSession = state.properties[propKey].currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;
      if (!currentCalculationSession.calculationInfo.flows[flowId][subFlowId]) return state;
      const fieldsToBeDeleted = currentCalculationSession.calculationInfo.flows[flowId][subFlowId].sourceType.map((sourceType: string, idx: number) =>
        (sourceType === 'field' ? idx : -1)).filter((idx: number) => idx !== -1).map((idx: number) => currentCalculationSession.calculationInfo?.flows[flowId][subFlowId].source[idx]);
      const fields = currentCalculationSession.calculationInfo.fields;
      const updatedFields = { ...currentCalculationSession.calculationInfo.fields };
      fieldsToBeDeleted.forEach((field) => {
        delete updatedFields[field];
      });
      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [subFlowId]: {
                      source: { $set: [] },
                      sourceType: { $set: [] }
                    }
                  }
                },
                fields: { $set: updatedFields }
              }
            }
          }
        }
      })
    }
    case 'ADD_SOURCE_WITH_RESTRICTION': {
      let { propKey, flowId, subFlowId, source, sourceType, sourceIndex } = action.payload;
      if (!subFlowId) subFlowId = 0;
      const currentCalculationSession = state.properties[propKey]?.currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;

      const flow = currentCalculationSession.calculationInfo.flows[flowId]?.[subFlowId];
      if (!flow) return state;

      // Ensure arrays are properly initialized
      const sources = flow.source || [];
      const sourceTypes = flow.sourceType || [];

      // Insert at the specified index or append at the end
      const newSources = [...sources];
      const newSourceTypes = [...sourceTypes];

      if (sourceIndex !== undefined && sourceIndex >= 0 && sourceIndex < newSources.length) {
        newSources.splice(sourceIndex, 0, source); // Insert at the specific index
        newSourceTypes.splice(sourceIndex, 0, sourceType);
      } else {
        newSources.push(source); // Append at the end
        newSourceTypes.push(sourceType);
      }

      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [subFlowId]: {
                      source: { $set: newSources },
                      sourceType: { $set: newSourceTypes },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    // case 'ADD_SOURCE_WITHOUT_RESTRICTION':{
    //   let { propKey, flowId, subFlowId, source, sourceType, sourceIndex } = action.payload;
    //   if (!subFlowId) subFlowId = 0;

    //   const currentCalculationSession = state.properties[propKey]?.currentCalculationSession;
    //   if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;

    //   const flow = currentCalculationSession.calculationInfo.flows[flowId]?.[subFlowId];
    //   if (!flow) return state;
    //   return update(state, {
    //     properties: {
    //       [propKey]: {
    //         currentCalculationSession: {
    //           calculationInfo: {
    //             flows: {
    //               [flowId]: {
    //                 [subFlowId]: {
    //                   source: { 
    //                     [sourceIndex]: { $set: source },
    //                    },
    //                   sourceType: { 
    //                     [sourceIndex]: { $set: sourceType },
    //                    },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    // }   
    case "DELETE_SOURCE_V4": {
      let { propKey, flowId, subFlowId, sourceIndex } = action.payload;
      if (!subFlowId) subFlowId = 0;
      const currentCalculationSession = state.properties[propKey]?.currentCalculationSession;
      if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;

      const flow = currentCalculationSession.calculationInfo.flows[flowId]?.[subFlowId];
      if (!flow) return state;

      // Ensure arrays are properly initialized
      const sources = flow.source || [];
      const sourceTypes = flow.sourceType || [];

      // Insert at the specified index or append at the end
      const newSources = [...sources];
      const newSourceTypes = [...sourceTypes];
      newSources.splice(sourceIndex, 1);
      newSourceTypes.splice(sourceIndex, 1);

      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              calculationInfo: {
                flows: {
                  [flowId]: {
                    [subFlowId]: {
                      source: { $set: newSources },
                      sourceType: { $set: newSourceTypes },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    case "ADD_TABLE_ID_TO_CURRENT_CALCULATION_SESSION": {
      const { tableId, propKey } = action.payload;

      return update(state, {
        properties: {
          [propKey]: {
            currentCalculationSession: {
              tableId: {
                $set: tableId
              }
            }
          }
        }
      })
    }
    case "DUMMY_ACTION_SET_SAVED_CALCULATION": {
      const savedCalculationsArray = [
        {
          name: 'calculation_1',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'zx5M',
                  flow: 'addDateInterval',
                  sourceType: [
                    'field',
                    'integer',
                    'text'
                  ],
                  source: [
                    'wLsl',
                    '2',
                    'day'
                  ],
                  isAggregation: false,
                  isValid: false,
                  aggregation: [],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              wLsl: {
                tableId: 'pos',
                fieldName: 'order_date',
                displayName: 'order_date',
                dataType: 'date'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_1'
          },
          flowPositions: {
            f1: {
              x: '62',
              y: '53'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Date Add'
          },
          tableId: 'pos',
          isAggregated: false,
          uuid: 'pFL2'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        },
        {
          name: 'calculation_2',
          calculationInfo: {
            selectedResultType: {},
            flows: {
              f1: [
                {
                  flowId: 'PIh9',
                  flow: 'absolute',
                  sourceType: [
                    'field'
                  ],
                  source: [
                    'pjP6'
                  ],
                  isAggregation: true,
                  isValid: false,
                  aggregation: [
                    'sum'
                  ],
                  filter: 'flt1',
                  condition: null,
                  conditionName: 'Condition 1'
                }
              ]
            },
            fields: {
              pjP6: {
                tableId: 'pos',
                fieldName: 'profit',
                displayName: 'profit',
                dataType: 'decimal',
                timeGrain: 'year'
              }
            },
            conditionFilters: {},
            calculatedFieldName: 'calculation_2'
          },
          flowPositions: {
            f1: {
              x: '38',
              y: '108'
            }
          },
          activeFlow: null,
          activeFlowType: null,
          activeCondition: 0,
          flowDisplayNames: {
            f1: 'Absolute'
          },
          tableId: 'pos',
          isAggregated: true,
          uuid: 'a4Gy'
        }
      ]
      let { propKey, flowId, subFlowId, sourceIndex } = { propKey: '1.1', flowId: 'f1', subFlowId: 0, sourceIndex: 0 };
      if (!subFlowId) subFlowId = 0;
      const currentCalculationSession = state.savedCalculations;
      // if (!currentCalculationSession || !currentCalculationSession.calculationInfo) return state;

      // const flow = currentCalculationSession.calculationInfo.flows[flowId]?.[subFlowId];
      // if (!flow) return state;
      return update(state, {
        savedCalculations: { $set: savedCalculationsArray }
      });
    }
    default:
      return state;
  }

};

export default CalculationReducer;
