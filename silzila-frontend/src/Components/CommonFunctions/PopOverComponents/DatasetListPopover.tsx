// This component renders a popover with a list of datasets
// Used in following places
// 	- when a new Playbook button is clicked, this popup will allow to select a dataset to work with in that playbook
// 	- when changing a dataset from within dataviewerbottom component, this list is presented to 'Add Dataset'

import { Popover } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { connect } from "react-redux";
import "./Popover.css";
import { ConnectionItem, DataSetStateProps } from "../../../redux/DataSet/DatasetStateInterfaces";

interface Props {
	popOverTitle: string;
	showCard: boolean;
	setShowCard: (value: boolean) => void;
	setSelectedDataset: (value: string) => void;
	// state
	dataSetList: any[];
}

const DatasetListPopover = ({
	// props
	popOverTitle,
	showCard,
	setShowCard,
	setSelectedDataset,
	// state
	dataSetList,
}: Props) => {
	return (
		<Popover
			open={showCard}
			onClose={setShowCard}
			anchorOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center",
			}}
		>
			<div className="datasetListPopover">
				<div className="datasetListPopoverHeading">
					<div style={{ flex: 1 }}>{popOverTitle}</div>

					<CloseRoundedIcon
						style={{ marginLeft: "1rem" }}
						onClick={() => setShowCard(false)}
					/>
				</div>
				<div>
					{dataSetList.map((ds: any) => {
						return (
							<div
								className="dataSetNameIndi"
								onClick={() => setSelectedDataset(ds)}
								key={ds.id}
							>
								{ds.datasetName}
							</div>
						);
					})}
				</div>
			</div>
		</Popover>
	);
};

const mapStateToProps = (state: DataSetStateProps, ownProps: any) => {
	return {
		dataSetList: state.dataSetState.dataSetList,
	};
};

export default connect(mapStateToProps, null)(DatasetListPopover);
