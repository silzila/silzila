import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { useDrop } from "react-dnd";
import ChartFilterGroupCard from "./ChartFilterGroupCard";
import {
	updateChartFilterGroupsFilters,
	updateChartFilterGroupsCollapsed, updateChartFilterGroupsName
} from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { AlertColor } from "@mui/material/Alert";
import {ChartFilterGroupsProps} from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';
import {ChartPropertiesStateProps} from '../../redux/ChartPoperties/ChartPropertiesInterfaces';
import {ChartFilterGroupStateProps,fieldProps} from '../../redux/ChartFilterGroup/ChartFilterGroupInterface';

const ChartFilterGroups = ({
	// props
	propKey,
	group,

	// state
	chartProp,
	chartGroup,

	// dispatch
	updateChartFilterGroupsFilters,
	updateChartFilterGroupsCollapsed,
	updateChartFilterGroupsName

}: ChartFilterGroupsProps) => {
	const [editGroupName, setEditGroupName] = useState<boolean>(false);
	let selectedDatasetID = chartProp.properties[propKey].selectedDs.id;
	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");



	const [, drop] = useDrop({
		accept: "card",
		drop: item => handleDrop(item, group),
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const uIdGenerator = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	};

	var chartType = chartProp.properties[propKey].chartType;

	///Expand Collapse Icon switch
	const ExpandCollaseIconSwitch = () => {
		return group.isCollapsed ? (
			<ChevronRightIcon
				style={{ height: "18px", width: "18px", color: "#999999" }}
				onClick={e => {
					updateChartFilterGroupsCollapsed(group.id, !group.isCollapsed);
				}}
			/>
		) : (
			<KeyboardArrowDownIcon
				style={{ height: "18px", width: "18px", color: "#999999" }}
				onClick={e => {
					updateChartFilterGroupsCollapsed(group.id, !group.isCollapsed);
				}}
			/>
		);
	};

	const handleGroupNameValue = (e: any) => {
		let isUnique = true;

		Object.keys(chartGroup.groups).forEach(grp => {
			if (chartGroup.groups[grp].name == e.target.value) {
				isUnique = false;
			}
		});

		if (isUnique) {
			updateChartFilterGroupsName(group.id, e.target.value)
		}
		else {
			console.error("Group name should be unique.")
			setSeverity("error");
			setOpenAlert(true);
			setTestMessage(
				"Group name should be unique."
			);

			setTimeout(() => {
				setOpenAlert(false);
				//setTestMessage("");
			}, 3000);
		}
	};

	// DropZoneDropItem
	const handleDrop = (item: any, group: any) => {

		if (item.bIndex === 99) {
			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			fieldData.uId = uID;
			updateChartFilterGroupsFilters(selectedDatasetID, group.id, fieldData);

		}
		// if (name === "Filter") {
		// 	setModalData(newFieldData);
		// }
	};

	let groupsStyle: any = {

		borderBottom: "1px solid black",
		overflowY: "auto",
	}

	if (!group.isCollapsed && group.filters && group.filters.length == 0) {
		groupsStyle["minHeight"] = "300px"
	}

	return (
		<div ref={drop} style={groupsStyle} onDoubleClick={() => setEditGroupName(true)}>
			{editGroupName ?
				<input
					autoFocus
					value={group.name}
					onChange={handleGroupNameValue}
					className="editTabSelected"
					onBlur={() => { setEditGroupName(false) }}
					title="Press enter or click away to save"
				/> : <span>{group.name}</span>}

			<ExpandCollaseIconSwitch />
			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>
			{
				!group.isCollapsed ?
					<>
						{group && group.filters?.map((field: fieldProps, index: number) =>
							<ChartFilterGroupCard
								propKey={propKey}
								name={group.id}
								itemIndex={index}
								key={index}
								field={field}
							/>
							)
						}
					</> : null
			}
		</div>
	)

};

const mapStateToProps = (state: ChartPropertiesStateProps & ChartFilterGroupStateProps) => {
	return {
		chartProp: state.chartProperties,
		chartGroup: state.chartFilterGroup
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {

		updateChartFilterGroupsFilters: (selectedDatasetID: string, groupId: string, filters: any) =>
			dispatch(updateChartFilterGroupsFilters(selectedDatasetID, groupId, filters)),

		updateChartFilterGroupsName: (groupId: string, name: string) =>
			dispatch(updateChartFilterGroupsName(groupId, name)),

		updateChartFilterGroupsCollapsed: (groupId: string, collapsed: boolean) =>
			dispatch(updateChartFilterGroupsCollapsed(groupId, collapsed)),



	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartFilterGroups);