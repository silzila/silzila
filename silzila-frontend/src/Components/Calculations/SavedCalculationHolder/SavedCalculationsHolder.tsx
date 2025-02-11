import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { connect } from "react-redux";
import {
  addNewCalculationSession,
  deleteSavedCalculation,
  editSavedCalculation,
} from "../../../redux/Calculations/CalculationsActions";
import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  createSvgIcon,
  IconButton,
  List,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box as CustomBox } from "../../DataViewer/Box";
import { fontSize, palette } from "../../..";
import { deleteItemInChartProp } from "../../../redux/ChartPoperties/ChartPropertiesActions";

const AddFunctionIcon = createSvgIcon(
  <svg
    width="100"
    height="103"
    viewBox="0 0 100 103"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30.6652 96.08C29.1652 96.08 27.8752 95.63 26.7952 94.73C25.7152 93.89 25.2352 92.15 25.3552 89.51C25.4752 86.57 25.6852 83.51 25.9852 80.33C26.2852 77.15 26.6152 74.18 26.9752 71.42C27.7552 65.36 27.9352 60.68 27.5152 57.38C27.1552 54.02 26.2252 51.62 24.7252 50.18C23.2852 48.74 21.3352 47.78 18.8752 47.3C17.6752 47.06 16.7152 46.61 15.9952 45.95C15.2752 45.23 14.9152 44.3 14.9152 43.16C14.9152 41.66 15.5152 40.67 16.7152 40.19C17.8552 39.71 19.3252 39.47 21.1252 39.47C22.5052 39.47 24.2752 39.56 26.4352 39.74C28.6552 39.86 31.0252 39.95 33.5452 40.01C35.6452 33.11 38.0152 27.41 40.6552 22.91C43.2952 18.41 46.1752 14.87 49.2952 12.29C52.4152 9.65 55.7152 7.82 59.1952 6.8C62.6752 5.71999 66.2752 5.17999 69.9952 5.17999C74.6152 5.17999 76.9252 6.82999 76.9252 10.13C76.9252 11.75 76.1452 12.98 74.5852 13.82C73.0252 14.66 70.6552 15.35 67.4752 15.89C63.6952 16.55 60.3652 17.78 57.4852 19.58C54.6652 21.38 52.1752 23.93 50.0152 27.23C47.9152 30.53 46.0552 34.79 44.4352 40.01C52.7752 39.83 59.6152 39.38 64.9552 38.66C70.2952 37.94 74.4052 37.25 77.2852 36.59C80.2252 35.87 82.2652 35.51 83.4052 35.51C85.0252 35.51 86.0152 35.9 86.3752 36.68C86.7952 37.46 87.0052 38.3 87.0052 39.2C87.0052 40.22 86.0452 41.27 84.1252 42.35C82.8652 43.07 80.8552 43.88 78.0952 44.78C75.3352 45.62 72.0952 46.46 68.3752 47.3C64.6552 48.08 60.7252 48.74 56.5852 49.28C52.5052 49.76 48.5152 50 44.6152 50C43.6552 50 42.7852 50 42.0052 50C41.3452 53.48 40.6852 57.17 40.0252 61.07C39.4252 64.91 38.8852 68.66 38.4052 72.32C37.9252 75.98 37.5052 79.31 37.1452 82.31C36.8452 85.31 36.6652 87.71 36.6052 89.51C36.5452 91.73 35.9752 93.38 34.8952 94.46C33.8152 95.54 32.4052 96.08 30.6652 96.08Z"
      fill="#2BB9BB"
    />
    <path
      d="M50.5513 89.72C49.5273 89.72 48.7806 89.3787 48.3113 88.696C47.8419 87.9707 47.6499 87.0747 47.7353 86.008C47.7779 85.4107 48.2473 84.5573 49.1433 83.448C50.0393 82.296 51.2126 80.952 52.6633 79.416C54.1139 77.8373 55.7139 76.152 57.4633 74.36C59.2553 72.5253 61.0899 70.6693 62.9673 68.792C60.6206 65.336 58.8499 62.5627 57.6553 60.472C56.5033 58.3813 55.8846 56.7387 55.7993 55.544C55.7139 54.2213 55.9273 53.1547 56.4393 52.344C56.9939 51.5333 57.8686 51.128 59.0633 51.128C59.7459 51.128 60.4499 51.448 61.1753 52.088C61.9433 52.728 62.9033 53.9013 64.0553 55.608C65.2499 57.3147 66.8286 59.7253 68.7913 62.84C71.7353 59.896 74.1459 57.5067 76.0233 55.672C77.9433 53.7947 79.4793 52.344 80.6313 51.32C81.8259 50.296 82.7433 49.592 83.3833 49.208C84.0659 48.824 84.6419 48.632 85.1113 48.632C86.1353 48.632 86.8606 48.9947 87.2873 49.72C87.7566 50.4027 87.9486 51.2987 87.8633 52.408C87.7779 53.304 87.2446 54.392 86.2633 55.672C85.3246 56.9093 84.1086 58.2747 82.6153 59.768C81.1219 61.2187 79.5006 62.7333 77.7513 64.312C76.0446 65.848 74.3806 67.3627 72.7593 68.856C75.4046 72.6107 77.8793 75.896 80.1833 78.712C82.5299 81.4853 84.4286 83.7893 85.8793 85.624C87.3299 87.416 88.0766 88.7387 88.1193 89.592C88.2046 90.488 87.9699 91.192 87.4153 91.704C86.9033 92.216 86.1566 92.472 85.1753 92.472C84.6206 92.472 83.9379 92.28 83.1273 91.896C82.3166 91.512 81.2286 90.7227 79.8633 89.528C78.5406 88.3333 76.8339 86.5413 74.7433 84.152C72.6953 81.72 70.1353 78.456 67.0633 74.36C65.3139 76.152 63.5646 77.944 61.8153 79.736C60.1086 81.528 58.4873 83.192 56.9513 84.728C55.4579 86.2213 54.1353 87.4373 52.9833 88.376C51.8739 89.272 51.0633 89.72 50.5513 89.72Z"
      fill="#AF98DB"
    />
  </svg>,
  "AddFunction"
);
const SavedCalculationsHolder = ({
  propKey,
  calculations,
  dynamicMeasuresState,
  createCalculation,
  tabTileProps,
  chartProperties,
  editCalculationFunc,
  deleteCalculationFunc,
  deleteItemFromChartFunc
}: {
  propKey: string;
  calculations: any;
  tabTileProps: any;
  chartProperties: any;
  dynamicMeasuresState: any;
  createCalculation: any;
  editCalculationFunc: any;
  deleteCalculationFunc: any;
  deleteItemFromChartFunc: any;
}) => {

  const realSelectedDatasetId = chartProperties?.properties[propKey]?.selectedDs?.id
  const [alert, setAlert] = useState<any>(null);

  const savedCalculationList = useMemo(() => {
    return calculations?.savedCalculations?.filter(
      (calculation: any) => (calculation.datasetId === realSelectedDatasetId && calculation.isAggregated)
    );
  }, [calculations?.savedCalculations, realSelectedDatasetId]);

  const handleCreateCalculation = () => {
    createCalculation(propKey, "Calculation 1", realSelectedDatasetId);
  };
  const [showSavedCalculations, setSavedCalculations] = useState(false);
  // const [anchorEl, setAnchorEl] = React.useState<null | {
  //   idx: number;
  //   element: HTMLElement;
  // }>(null);
  useEffect(() => {
    if (savedCalculationList && savedCalculationList.length > 0) {
      setSavedCalculations(true);
    }
  }, [savedCalculationList]);

  const renderInBlocks = (arr: any[], blockSize: number) => {
    if (!arr || arr.length === 0) return [];
    const filteredArray = arr.filter((calculation, id) => calculation.calculationInfo?.flows["f1"][0]?.isAggregation)
    const blocks = [];
    for (let i = 0; i < filteredArray.length; i += blockSize) {
      blocks.push(arr.slice(i, i + blockSize));
    }
    return blocks;
  };
  // let savedCalculationListTemp = [
  //   {
  //     name: 'calculation_1',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'zx5M',
  //             flow: 'addDateInterval',
  //             sourceType: ['field', 'integer', 'text'],
  //             source: ['wLsl', '2', 'day'],
  //             isAggregation: false,
  //             isValid: false,
  //             aggregation: [],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         wLsl: {
  //           tableId: 'pos',
  //           fieldName: 'order_date',
  //           displayName: 'order_date',
  //           dataType: 'date',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_1',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '62',
  //         y: '53',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Date Add',
  //     },
  //     tableId: 'pos',
  //     isAggregated: false,
  //     uuid: 'pFL2',
  //   },
  //   {
  //     name: 'calculation_2',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'PIh9',
  //             flow: 'absolute',
  //             sourceType: ['field'],
  //             source: ['pjP6'],
  //             isAggregation: true,
  //             isValid: false,
  //             aggregation: ['sum'],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         pjP6: {
  //           tableId: 'pos',
  //           fieldName: 'profit',
  //           displayName: 'profit',
  //           dataType: 'decimal',
  //           timeGrain: 'year',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_2',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '38',
  //         y: '108',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Absolute',
  //     },
  //     tableId: 'pos',
  //     isAggregated: true,
  //     uuid: 'a4Gy',
  //   },
  //   {
  //     name: 'calculation_3',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'PIh9',
  //             flow: 'absolute',
  //             sourceType: ['field'],
  //             source: ['pjP6'],
  //             isAggregation: true,
  //             isValid: false,
  //             aggregation: ['sum'],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         pjP6: {
  //           tableId: 'pos',
  //           fieldName: 'profit',
  //           displayName: 'profit',
  //           dataType: 'decimal',
  //           timeGrain: 'year',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_3',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '38',
  //         y: '108',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Absolute',
  //     },
  //     tableId: 'pos',
  //     isAggregated: true,
  //     uuid: 'a4Gy',
  //   },
  //   {
  //     name: 'calculation_4',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'PIh9',
  //             flow: 'absolute',
  //             sourceType: ['field'],
  //             source: ['pjP6'],
  //             isAggregation: true,
  //             isValid: false,
  //             aggregation: ['sum'],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         pjP6: {
  //           tableId: 'pos',
  //           fieldName: 'profit',
  //           displayName: 'profit',
  //           dataType: 'decimal',
  //           timeGrain: 'year',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_4',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '38',
  //         y: '108',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Absolute',
  //     },
  //     tableId: 'pos',
  //     isAggregated: true,
  //     uuid: 'a4Gy',
  //   },
  //   {
  //     name: 'calculation_5',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'PIh9',
  //             flow: 'absolute',
  //             sourceType: ['field'],
  //             source: ['pjP6'],
  //             isAggregation: true,
  //             isValid: false,
  //             aggregation: ['sum'],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         pjP6: {
  //           tableId: 'pos',
  //           fieldName: 'profit',
  //           displayName: 'profit',
  //           dataType: 'decimal',
  //           timeGrain: 'year',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_5',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '38',
  //         y: '108',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Absolute',
  //     },
  //     tableId: 'pos',
  //     isAggregated: true,
  //     uuid: 'a4Gy',
  //   },
  //   {
  //     name: 'calculation_6',
  //     calculationInfo: {
  //       selectedResultType: {},
  //       flows: {
  //         f1: [
  //           {
  //             flowId: 'PIh9',
  //             flow: 'absolute',
  //             sourceType: ['field'],
  //             source: ['pjP6'],
  //             isAggregation: true,
  //             isValid: false,
  //             aggregation: ['sum'],
  //             filter: 'flt1',
  //             condition: null,
  //             conditionName: 'Condition 1',
  //           },
  //         ],
  //       },
  //       fields: {
  //         pjP6: {
  //           tableId: 'pos',
  //           fieldName: 'profit',
  //           displayName: 'profit',
  //           dataType: 'decimal',
  //           timeGrain: 'year',
  //         },
  //       },
  //       conditionFilters: {},
  //       calculatedFieldName: 'calculation_6',
  //     },
  //     flowPositions: {
  //       f1: {
  //         x: '38',
  //         y: '108',
  //       },
  //     },
  //     activeFlow: null,
  //     activeFlowType: null,
  //     activeCondition: 0,
  //     flowDisplayNames: {
  //       f1: 'Absolute',
  //     },
  //     tableId: 'pos',
  //     isAggregated: true,
  //     uuid: 'a4Gy',
  //   },
  //   // {
  //   //   name: 'calculation_7',
  //   //   calculationInfo: {
  //   //     selectedResultType: {},
  //   //     flows: {
  //   //       f1: [
  //   //         {
  //   //           flowId: 'PIh9',
  //   //           flow: 'absolute',
  //   //           sourceType: ['field'],
  //   //           source: ['pjP6'],
  //   //           isAggregation: true,
  //   //           isValid: false,
  //   //           aggregation: ['sum'],
  //   //           filter: 'flt1',
  //   //           condition: null,
  //   //           conditionName: 'Condition 1',
  //   //         },
  //   //       ],
  //   //     },
  //   //     fields: {
  //   //       pjP6: {
  //   //         tableId: 'pos',
  //   //         fieldName: 'profit',
  //   //         displayName: 'profit',
  //   //         dataType: 'decimal',
  //   //         timeGrain: 'year',
  //   //       },
  //   //     },
  //   //     conditionFilters: {},
  //   //     calculatedFieldName: 'calculation_7',
  //   //   },
  //   //   flowPositions: {
  //   //     f1: {
  //   //       x: '38',
  //   //       y: '108',
  //   //     },
  //   //   },
  //   //   activeFlow: null,
  //   //   activeFlowType: null,
  //   //   activeCondition: 0,
  //   //   flowDisplayNames: {
  //   //     f1: 'Absolute',
  //   //   },
  //   //   tableId: 'pos',
  //   //   isAggregated: true,
  //   //   uuid: 'a4Gy',
  //   // },
  //   // {
  //   //   name: 'calculation_8',
  //   //   calculationInfo: {
  //   //     selectedResultType: {},
  //   //     flows: {
  //   //       f1: [
  //   //         {
  //   //           flowId: 'PIh9',
  //   //           flow: 'absolute',
  //   //           sourceType: ['field'],
  //   //           source: ['pjP6'],
  //   //           isAggregation: true,
  //   //           isValid: false,
  //   //           aggregation: ['sum'],
  //   //           filter: 'flt1',
  //   //           condition: null,
  //   //           conditionName: 'Condition 1',
  //   //         },
  //   //       ],
  //   //     },
  //   //     fields: {
  //   //       pjP6: {
  //   //         tableId: 'pos',
  //   //         fieldName: 'profit',
  //   //         displayName: 'profit',
  //   //         dataType: 'decimal',
  //   //         timeGrain: 'year',
  //   //       },
  //   //     },
  //   //     conditionFilters: {},
  //   //     calculatedFieldName: 'calculation_8',
  //   //   },
  //   //   flowPositions: {
  //   //     f1: {
  //   //       x: '38',
  //   //       y: '108',
  //   //     },
  //   //   },
  //   //   activeFlow: null,
  //   //   activeFlowType: null,
  //   //   activeCondition: 0,
  //   //   flowDisplayNames: {
  //   //     f1: 'Absolute',
  //   //   },
  //   //   tableId: 'pos',
  //   //   isAggregated: true,
  //   //   uuid: 'a4Gy',
  //   // },
  //   // {
  //   //   name: 'calculation_9',
  //   //   calculationInfo: {
  //   //     selectedResultType: {},
  //   //     flows: {
  //   //       f1: [
  //   //         {
  //   //           flowId: 'PIh9',
  //   //           flow: 'absolute',
  //   //           sourceType: ['field'],
  //   //           source: ['pjP6'],
  //   //           isAggregation: true,
  //   //           isValid: false,
  //   //           aggregation: ['sum'],
  //   //           filter: 'flt1',
  //   //           condition: null,
  //   //           conditionName: 'Condition 1',
  //   //         },
  //   //       ],
  //   //     },
  //   //     fields: {
  //   //       pjP6: {
  //   //         tableId: 'pos',
  //   //         fieldName: 'profit',
  //   //         displayName: 'profit',
  //   //         dataType: 'decimal',
  //   //         timeGrain: 'year',
  //   //       },
  //   //     },
  //   //     conditionFilters: {},
  //   //     calculatedFieldName: 'calculation_9',
  //   //   },
  //   //   flowPositions: {
  //   //     f1: {
  //   //       x: '38',
  //   //       y: '108',
  //   //     },
  //   //   },
  //   //   activeFlow: null,
  //   //   activeFlowType: null,
  //   //   activeCondition: 0,
  //   //   flowDisplayNames: {
  //   //     f1: 'Absolute',
  //   //   },
  //   //   tableId: 'pos',
  //   //   isAggregated: true,
  //   //   uuid: 'a4Gy',
  //   // },
  //   // {
  //   //   name: 'calculation_10',
  //   //   calculationInfo: {
  //   //     selectedResultType: {},
  //   //     flows: {
  //   //       f1: [
  //   //         {
  //   //           flowId: 'PIh9',
  //   //           flow: 'absolute',
  //   //           sourceType: ['field'],
  //   //           source: ['pjP6'],
  //   //           isAggregation: true,
  //   //           isValid: false,
  //   //           aggregation: ['sum'],
  //   //           filter: 'flt1',
  //   //           condition: null,
  //   //           conditionName: 'Condition 1',
  //   //         },
  //   //       ],
  //   //     },
  //   //     fields: {
  //   //       pjP6: {
  //   //         tableId: 'pos',
  //   //         fieldName: 'profit',
  //   //         displayName: 'profit',
  //   //         dataType: 'decimal',
  //   //         timeGrain: 'year',
  //   //       },
  //   //     },
  //   //     conditionFilters: {},
  //   //     calculatedFieldName: 'calculation_10',
  //   //   },
  //   //   flowPositions: {
  //   //     f1: {
  //   //       x: '38',
  //   //       y: '108',
  //   //     },
  //   //   },
  //   //   activeFlow: null,
  //   //   activeFlowType: null,
  //   //   activeCondition: 0,
  //   //   flowDisplayNames: {
  //   //     f1: 'Absolute',
  //   //   },
  //   //   tableId: 'pos',
  //   //   isAggregated: true,
  //   //   uuid: 'a4Gy',
  //   // },
  //   // {
  //   //   name: 'calculation_11',
  //   //   calculationInfo: {
  //   //     selectedResultType: {},
  //   //     flows: {
  //   //       f1: [
  //   //         {
  //   //           flowId: 'PIh9',
  //   //           flow: 'absolute',
  //   //           sourceType: ['field'],
  //   //           source: ['pjP6'],
  //   //           isAggregation: true,
  //   //           isValid: false,
  //   //           aggregation: ['sum'],
  //   //           filter: 'flt1',
  //   //           condition: null,
  //   //           conditionName: 'Condition 1',
  //   //         },
  //   //       ],
  //   //     },
  //   //     fields: {
  //   //       pjP6: {
  //   //         tableId: 'pos',
  //   //         fieldName: 'profit',
  //   //         displayName: 'profit',
  //   //         dataType: 'decimal',
  //   //         timeGrain: 'year',
  //   //       },
  //   //     },
  //   //     conditionFilters: {},
  //   //     calculatedFieldName: 'calculation_11',
  //   //   },
  //   //   flowPositions: {
  //   //     f1: {
  //   //       x: '38',
  //   //       y: '108',
  //   //     },
  //   //   },
  //   //   activeFlow: null,
  //   //   activeFlowType: null,
  //   //   activeCondition: 0,
  //   //   flowDisplayNames: {
  //   //     f1: 'Absolute',
  //   //   },
  //   //   tableId: 'pos',
  //   //   isAggregated: true,
  //   //   uuid: 'a4Gy',
  //   // },
  // ];
  const renderBlocks = renderInBlocks(savedCalculationList, 6);

  return (
    <div
      style={{
        minWidth: showSavedCalculations ? "14rem" : "3.5rem",
        maxWidth: "60%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        flexShrink: "0",
        flexWrap: "nowrap",
        overflow: "hidden",
      }}
    >
      {showSavedCalculations &&
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column", borderLeft: "2px solid rgba(224, 224, 224, 1)", transition: "transform 0.1s ease" }}>
          <Typography
            sx={{
              fontWeight: "bold",
              color: "primary.contrastText",
              fontSize: fontSize.large,
              // margin: "0 auto",
              // marginBottom: "0.5rem",
              paddingTop: "0.3rem",
              paddingLeft: "0.8rem",
              textAlign: "start",
            }}
          >
            Formula Measures
          </Typography>
          <List
            sx={{
              display: "flex",
              alignItems: "flex-start",
              padding: "0.2rem 0.5rem 0.5rem",
              overflow: "auto",
              '&::-webkit-scrollbar': { width: '4px', height: "4px" },
            }}
          >
            {renderBlocks.length === 0 ? (
              <Typography
                sx={{
                  margin: "2.5rem 0",
                  color: "#5d5c5c",
                  fontSize: fontSize.medium,
                  paddingLeft: "0.3rem",
                }}
              >
                No saved calculations
              </Typography>
            ) : (
              renderBlocks.map((_block: any, index: number) => (
                <Stack key={index} 
                sx={{"&.MuiStack-root": {
                  overflow: "hidden"
                }}}>
                  {_block.map((calculation: any, idx: number) => {

                    let isCalculationPresentInChartAxes = false

                    const informationForPropDeletion: {
                      [key: string]: {
                        binIndex: number,
                        fieldIndex: number
                      }
                    } = {}

                    const allPropKeys = Object.keys(chartProperties?.properties)

                    for (const eachPropKey of allPropKeys) {
                      chartProperties?.properties[eachPropKey]?.chartAxes?.forEach((ax: any, axId: number) => {
                        ax?.fields?.forEach((field: any, fieldId: number) => {
                          if (field.SavedCalculationUUID) {
                            informationForPropDeletion[eachPropKey] = {
                              binIndex: axId,
                              fieldIndex: fieldId
                            }
                            isCalculationPresentInChartAxes = true
                          }
                        })
                      })
                    }

                    return (
                      <CustomBox
                        name={calculation.calculationInfo.calculatedFieldName}
                        type="calculation"
                        informationForPropDeletion={informationForPropDeletion}
                        isPresentInAxes={isCalculationPresentInChartAxes}
                        fieldData={{
                          dataType:
                            calculation.calculationInfo.fields[
                              Object.keys(calculation.calculationInfo.fields)[0]
                            ].dataType,
                          displayname:
                            calculation.calculationInfo.calculatedFieldName,
                          fieldname:
                            calculation.calculationInfo.calculatedFieldName,
                          tableId:
                            calculation.calculationInfo.fields[
                              Object.keys(calculation.calculationInfo.fields)[0]
                            ].tableId,
                          uId: calculation.calculationInfo.fields[
                            Object.keys(calculation.calculationInfo.fields)[0]
                          ].uId,
                          isCalculatedField: true,
                          isAggregated: true,
                        }}
                        isSavedCalculation={true}
                        colsOnly={true}
                        handleEditButton={() => {
                          editCalculationFunc(
                            propKey,
                            calculation.calculationInfo.calculatedFieldName
                          );
                        }}
                        propKey={propKey}
                        deleteIfPresentInAxes={deleteItemFromChartFunc}
                        handleDeleteButton={() => {
                          deleteCalculationFunc(
                            calculation.calculationInfo.calculatedFieldName,
                            propKey
                          );
                        }}
                        allSavedCalculations={savedCalculationList}
                      />
                    );
                    // return (
                    //   calculation.calculationInfo.flows["f1"][0].isAggregation && (
                    //   <ListItem
                    //     sx={{
                    //       margin: 0,
                    //       padding: 0,
                    //       display: "flex",
                    //       justifyContent: "space-between",
                    //       gap: "5px",
                    //       "&:hover": {
                    //         backgroundColor: "rgba(224, 224, 224, 1)",
                    //       },
                    //     }}
                    //   >
                    //     <span
                    //       style={{
                    //         display: "inline-block",
                    //         margin: "5px",
                    //         padding: "5px",
                    //         maxWidth: "200px", // Set a fixed width
                    //         overflow: "hidden",
                    //         whiteSpace: "nowrap",
                    //         textOverflow: "ellipsis",
                    //         cursor: "pointer",
                    //       }}
                    //     >{calculation.calculationInfo.calculatedFieldName}</span>
                    //     <IconButton
                    //       onClick={(e) => {
                    //         setAnchorEl({
                    //           idx,
                    //           element: e.currentTarget,
                    //         });
                    //       }}
                    //     >
                    //       <MoreVertIcon style={{ cursor: "pointer" }} />
                    //     </IconButton>
                    //     <Menu
                    //       id="basic-menu"
                    //       anchorEl={anchorEl?.element}
                    //       open={Boolean(anchorEl?.element) && anchorEl?.idx === idx}
                    //       onClose={() => {
                    //         setAnchorEl(null);
                    //       }}
                    //     >
                    //       <MenuItem
                    //         dense
                    //         onClick={() => {
                    //           editCalculationFunc(
                    //             propKey,
                    //             calculation.calculationInfo.calculatedFieldName
                    //           );
                    //           setAnchorEl(null);
                    //         }}
                    //       >
                    //         Edit
                    //       </MenuItem>
                    //       <MenuItem
                    //         dense
                    //         onClick={() => {
                    //           deleteCalculationFunc(
                    //             calculation.calculationInfo.calculatedFieldName,
                    //             propKey
                    //           );
                    //           setAnchorEl(null);
                    //         }}
                    //       >
                    //         Delete
                    //       </MenuItem>
                    //     </Menu>
                    //   </ListItem>)
                    // );
                  })}
                </Stack>
              ))
            )}
          </List>
        </Box>}
      <Box
        sx={{
          width: "3.5rem",
          flexShrink: "0",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          borderLeft: "2px solid rgba(224, 224, 224, 1)",
          zIndex: 1,
          paddingBottom: "0.3rem",
        }}
      >
        <Tooltip title="Open Formula Builder">
          <IconButton onClick={handleCreateCalculation}>
            <AddFunctionIcon fontSize="large" style={{ cursor: "pointer" }} />
          </IconButton>
        </Tooltip>
        {showSavedCalculations ? (
          <Tooltip title="Collapse formula builder">
            <KeyboardArrowRightIcon
              // fontSize="large"
              onClick={() => setSavedCalculations(false)}
              style={{ cursor: "pointer", color: "rgb(133, 133, 133)" }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Expand formula builder">
            <KeyboardArrowLeftIcon
              // fontSize="small"
              onClick={() => setSavedCalculations(true)}
              style={{ cursor: "pointer", color: "rgb(133, 133, 133)" }}
            />
          </Tooltip>
        )}
      </Box>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    dynamicMeasuresState: state.dynamicMeasuresState,
    calculations: state.calculations,
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createCalculation: (propKey: string, calculationName: string, datasetId: string) =>
      dispatch(addNewCalculationSession(propKey, calculationName, datasetId)),
    editCalculationFunc: (propKey: string, calculationFieldName: string) =>
      dispatch(editSavedCalculation(propKey, calculationFieldName)),
    deleteCalculationFunc: (calculationFieldName: string, propKey: string) =>
      dispatch(deleteSavedCalculation(calculationFieldName, propKey)),
    deleteItemFromChartFunc: (propKey: string, binIndex: number, itemIndex: number) => dispatch(deleteItemInChartProp(propKey, binIndex, itemIndex))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedCalculationsHolder);