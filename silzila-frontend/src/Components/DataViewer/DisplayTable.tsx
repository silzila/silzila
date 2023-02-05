// This component houses Sample records for selected table from dataset
// This sample records can be view as
// 	- Full table with all fields and values
// 	- Just column names of table

// Table columns are draggable. These dragged table columns are then dropped into dropzones

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { SampleRecordsState } from "../../redux/SampleTableRecords/SampleTableRecordsInterfaces";
import { TabTileStateProps, TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { Box } from "./Box";
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from "@mui/material";

interface DisplayTableProps {
	dsId: string;
	table: any;
	tableRecords: any;
	tabTileProps: TabTileStateProps;
}

const DisplayTable = ({
	// props
	dsId,
	table,

	// state
	tableRecords,
	tabTileProps,
}: DisplayTableProps) => {
	var SampleRecords: any = tableRecords?.[dsId]?.[table];
	const [columnsData, setColumnsData] = useState<any[]>([]);

	const formatFieldsData = () => {
		let _fieldsData: any[] = [];
		if (SampleRecords) {
			var tableKeys = Object.keys(SampleRecords[0]);
			var dataType = tableRecords.recordsColumnType[dsId][table];

			for (let i = 0; i < tableKeys.length; i++) {
				_fieldsData.push({
					fieldname: tableKeys[i],
					displayname: tableKeys[i],
					dataType: dataType.filter((sc: any) => sc.columnName === tableKeys[i])[0]
						.dataType,
					tableId: table,
				});
			}
			return _fieldsData;
		}
		return _fieldsData;
	};

	const prepareInputs = () => {
		let _fields = formatFieldsData();
		setColumnsData(_fields);
	};

	useEffect(() => {
		prepareInputs();
	}, [SampleRecords]);

	// Get the column names from first row of table data
	const getKeys = (record: any) => {
		return Object.keys(record);
	};

	// Get the column names from getKeys() and render the header for table

	const GetHeaders: any = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);
			return keys.map((key: any, index: number) => {
				return (
					<TableCell key={`${index}_${key}`}>
						<Box
							name={key}
							type="card"
							fieldData={columnsData[index]}
							colsOnly={false}
						/>
					</TableCell>
				);
			});
		} else return null;
	};

	// Render a single row of the table
	const RenderRow = (props: any) => {
		return props.keys.map((key: any, index: number) => {
			return <TableCell key={`${index}_${key}`}>{props.data[key]}</TableCell>;
		});
	};

	// Get all rows data and pass it to RenderRow to display table data
	const getRowsData = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);

			return SampleRecords.map((row: any, index: number) => {
				return (
					<TableRow
						sx={{
							"& .MuiTableCell-root": {
								borderBottom: "0px",
							},
						}}
						key={index}
					>
						<RenderRow key={index} data={row} keys={keys} />
					</TableRow>
				);
			});
		} else return null;
	};

	const RenderButtons: any = () => {
		if (SampleRecords) {
			var keys = getKeys(SampleRecords[0]);
			return keys.map((key: any, index: number) => {
				return (
					<button
						key={key}
						className="boxContainer"
						draggable="true"
						// onDragStart={(e) => handleDragStart(e, columnsData[index])}
					>
						<Box
							name={key}
							type="card"
							fieldData={columnsData[index]}
							colsOnly={true}
						/>
					</button>
				);
			});
		} else return null;
	};

	return tabTileProps.columnsOnlyDisplay ? (
		<div className="showColumnsOnly">
			<RenderButtons />
		</div>
	) : (
		<TableContainer
			sx={{
				height: "100%",
				overflow: "hidden",

				// width: "fit-content",
				"&:hover": {
					overflow: "auto",
				},
			}}
		>
			<Table stickyHeader={true} sx={{ width: "fit-content" }}>
				<TableHead
					sx={{
						"& .MuiTableCell-root": {
							fontSize: "12px",
							fontWeight: "600",
							color: "rgb(87, 87, 87)",
							padding: "2px 9px 7px 0px ",
							backgroundColor: "white",
							lineHeight: "normal",
							letterSpacing: "normal",
							fontFamily:
								" -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
						},
					}}
				>
					<TableRow
						sx={{
							"& .MuiTableCell-root": {
								borderBottom: "0px",
							},
						}}
					>
						<GetHeaders />
					</TableRow>
				</TableHead>
				<TableBody
					sx={{
						"& .MuiTableCell-root": {
							fontSize: "12px",
							padding: "0px 10px 0px 20px ",
							whiteSpace: "nowrap",
							maxWidth: "250px",
							minWidth: "75px",
							textOverflow: "ellipsis",
							overflow: "hidden",
							backgroundColor: "white",
							fontFamily:
								" -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;",
						},
					}}
				>
					{getRowsData()}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const mapStateToProps = (state: SampleRecordsState & TabTileStateProps2, ownProps: any) => {
	return { tableRecords: state.sampleRecords, tabTileProps: state.tabTileProps };
};

export default connect(mapStateToProps, null)(DisplayTable);
