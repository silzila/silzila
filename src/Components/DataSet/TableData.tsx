// Sample records of selected table shown in Create / Edit dataset page

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import "./Dataset.css";

export interface tableDataComponentProps {
	showTableData: boolean;
	setShowTableData: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTable: string;
	setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
	tableData: any[];
	setTableData: React.Dispatch<React.SetStateAction<any[]>>;
	objKeys: any[];
}

function TableData({
	showTableData,
	setShowTableData,
	selectedTable,
	setSelectedTable,
	tableData,
	setTableData,
	objKeys,
}: tableDataComponentProps) {
	const handleClose = () => {
		setShowTableData(false);
		setSelectedTable("");
		setTableData([]);
	};
	return (
		<>
			<Dialog
				open={showTableData}
				maxWidth="xl"
				fullWidth={true}
				PaperProps={{
					sx: {
						minHeight: "90%",
					},
				}}
			>
				<DialogTitle
					sx={{
						display: "flex",
						flexDirection: "row",
						columnGap: "2rem",
						justifyContent: "space-between",
						fontSize: "16px",
					}}
				>
					<p style={{ float: "left" }}>{selectedTable}</p>
					<p>Rows Displayed: {tableData.length}</p>
					<CloseOutlined onClick={handleClose} style={{ float: "right" }} />
				</DialogTitle>
				<DialogContent
					sx={{
						maxWidth: "fit-content",
					}}
				>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								{objKeys &&
									objKeys.map((el: string, i: number) => {
										return (
											<TableCell
												style={{
													fontWeight: "bold",
													backgroundColor: "#e8eaf6",
												}}
												key={i}
											>
												{el}
											</TableCell>
										);
									})}
							</TableRow>
						</TableHead>
						<TableBody style={{ width: "auto" }}>
							{tableData.map((data: any, i: number) => {
								return (
									<TableRow key={i} id="TRow">
										{objKeys.map((obj: string) => {
											return <TableCell id="TColumn">{data[obj]}</TableCell>;
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</DialogContent>
			</Dialog>
		</>
	);
}
export default TableData;
