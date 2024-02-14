// This component renders a popover with a list of datasets
// Used in following places
// 	- when a new Playbook button is clicked, this popup will allow to select a dataset to work with in that playbook
// 	- when changing a dataset from within dataviewerbottom component, this list is presented to 'Add Dataset'

import { Popover } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from "react-redux";
import "./Popover.css";
import { ConnectionItem, DataSetStateProps } from "../../../redux/DataSet/DatasetStateInterfaces";
import { Dispatch } from "redux";
import { setConnectionValue, setServerName } from "../../../redux/DataSet/datasetActions";
import { useNavigate } from "react-router-dom";

interface Props {
	popOverTitle: string;
	showCard: boolean;
	setShowCard: (value: boolean) => void;
	setConnection: (value: string) => void;
	dataConnectionList: ConnectionItem[];
	setServerName: (name: string) => void;
}

const DataConnectionListPopover = ({
	// props
	popOverTitle,
	showCard,
	setShowCard,
	// state
	dataConnectionList,
	//dispatch
	setConnection,
	setServerName,
}: Props) => {
	var navigate = useNavigate();

	return (
		<Popover
			open={showCard}
			onClose={setShowCard}
			anchorReference="anchorEl"
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
					{dataConnectionList.map((dc: ConnectionItem) => {
						return (
							<div
								className="dataSetNameIndi"
								onClick={() => {
									setConnection(dc.id);
									setServerName(dc.vendor);
									navigate("/newdataset");
								}}
								key={dc.id}
							>
								{dc.connectionName}
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
		dataConnectionList: state.dataSetState.dataConnectionList,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setConnection: (connection: string) => dispatch(setConnectionValue(connection)),
		setServerName: (name: string) => dispatch(setServerName(name)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataConnectionListPopover);
