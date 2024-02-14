import React from "react";
//import  '../../styles/chartControls.css';

const _modifyData = props => {
	if (props.remove) {
		return props.data;
	} else {
		return props.data;
	}
};

const ContructPopupBody = props => {
	let _data = _modifyData(props);

	let _body = [];

	if (_data) {
		Object.keys(_data).forEach((key, index) => {
			let _pair = (
				<div key={index}>
					<span
						className="ShowDataPopupKey"
						style={{ fontSize: props.chartProp.crossTabHeaderLabelOptions.fontSize }}
					>
						{key}
					</span>
					<span style={{ fontSize: props.chartProp.crossTabHeaderLabelOptions.fontSize }}>
						:
					</span>
					<span
						style={{ fontSize: props.chartProp.crossTabCellLabelOptions.fontSize }}
						className="ShowDataPopupValue"
					>
						{_data[key]}
					</span>
				</div>
			);
			_body.push(_pair);
		});
	}

	return _body;
};

const getPosition = ({ rect }) => {
	let _style = {};

	_style["top"] = rect.top + 30;
	_style["left"] = rect.left + 50;

	return _style;
};

const ShowDataPopup = props => {
	return props.show ? (
		<div className="ShowDataPopup" onClick={props.backdropClicked} style={getPosition(props)}>
			{ContructPopupBody(props)}
		</div>
	) : null;
};

export default ShowDataPopup;
