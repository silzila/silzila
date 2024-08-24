import React, { useState, useEffect, Dispatch } from 'react';
import { connect } from 'react-redux';
import "../ChartOptions.css";
import { SortChartData, SortOrder, SortedValue } from "../../../redux/ChartPoperties/ChartControlsActions";
import { FormControl, MenuItem, Select, Typography, Checkbox } from '@mui/material';
import '../ShowHide/ShowHide.css';
import { PatternCollectionType } from "../../ChartFieldFilter/UserFilterCardInterface";
import { Switch, FormControlLabel } from '@mui/material';
// import FetchData from '../../ServerCall/FetchData';
import { editChartPropItem, updateLeftFilterItem } from '../../../redux/ChartPoperties/ChartPropertiesActions';
import chartProperties from '../../../redux/ChartPoperties/ChartProperties';

interface Props {
	// field:any;
	// updateLeftFilterItem: any;
	// itemIndex:any;
	// uID:any;

	// chartProperties: any;
	chartProp: any;
	chartControls: any;
	tabTileProps: any;
	SortChartData: (propKey: string, chartData: string | any) => void;
	SortOrder: (propKey: string, order: string) => void;
	SortedValue: (propKey: string, chartData: string | any) => void;
}

const ShowHide = ({
	// field,
	// updateLeftFilterItem,
	// itemIndex,
	// uID,

	// chartProperties,
	chartProp,
	chartControls,
	tabTileProps,
	SortChartData,
	SortedValue
}: Props) => {


	// field.dataType = field.dataType.toLowerCase();
	// const { uId, fieldname, displayname, dataType, tableId } = field;
	// let filterFieldData = JSON.parse(JSON.stringify(field));
	// let currentChartAxesName = uID ? "chartAxes_" + uID : "chartAxes";


	// const updateUserFilterItem = (
	// 	propKey: string,
	// 	bIndex: number,
	// 	itemIndex: number,
	// 	field: any,
	// 	axesName: string
	//   ) => {
	// 	//if(chartProp.properties[propKey].droppedFieldChartAxesUID === uID){
	// 	updateLeftFilterItem(propKey, bIndex, itemIndex, field, axesName);
	// 	//}
	//   };
	// const handleCBChange = (event: any) => {
	// 	if (event.target.name.toString() === "(All)") {
	// 	  if (event.target.checked) {
	// 		filterFieldData["userSelection"] = [
	// 		  ...filterFieldData.rawselectmembers,
	// 		];
	// 		filterFieldData["filterTypeTillDate"] = "enabled";
	// 	  } else {
	// 		filterFieldData["userSelection"] = [];
	// 	  }
	// 	} else {
	// 	  filterFieldData["filterTypeTillDate"] = "disabled";
	// 	  if (event.target.checked) {
	// 		if (!isNaN(event.target.name) && isFinite(event.target.name)) {
	// 		  let _name = event.target.name;

	// 		  if (_name.includes(".")) {
	// 			_name = parseFloat(event.target.name);
	// 		  } else {
	// 			_name = parseInt(event.target.name);
	// 		  }

	// 		  if (_name) {
	// 			filterFieldData.userSelection.push(_name);
	// 		  }
	// 		} else {
	// 		  filterFieldData.userSelection.push(event.target.name);
	// 		}
	// 	  } else {
	// 		let idx = filterFieldData.userSelection.findIndex(
	// 		  (item: any) => item.toString() === event.target.name.toString()
	// 		);
	// 		filterFieldData.userSelection.splice(idx, 1);
	// 	  }
	// 	  if (!filterFieldData.userSelection.length) {
	// 		filterFieldData["filterTypeTillDate"] = "enabled";
	// 	  }

	// 	  let AllIdx = filterFieldData.userSelection.findIndex(
	// 		(item: any) => item.toString() === "(All)"
	// 	  );

	// 	  if (AllIdx >= 0) {
	// 		filterFieldData.userSelection.splice(AllIdx, 1);
	// 	  }
	// 	}
	// 	updateUserFilterItem(
	// 	  propKey,
	// 	  0,
	// 	  itemIndex,
	// 	  constructChartAxesFieldObject(),
	// 	  currentChartAxesName
	// 	);
	//   };
	// const SelecPickListCard = () => {
	// 	let _selectionMembers = null;

	// 	if (filterFieldData && filterFieldData.rawselectmembers) {
	// 	  console.log(filterFieldData)
	// 	  console.log(filterFieldData.rawselectmembers)
	// 	  _selectionMembers = filterFieldData.rawselectmembers.map(
	// 		(item: any, index: number) => {
	// 		  return (
	// 			<label className="UserFilterCheckboxes" key={index}>
	// 			  {filterFieldData.includeexclude === "Include" ? (
	// 				<Checkbox
	// 				  checked={
	// 					filterFieldData.userSelection
	// 					  ? filterFieldData.includeexclude === "Include"
	// 						? filterFieldData.userSelection.includes(item)
	// 						  ? true
	// 						  : false
	// 						: false
	// 					  : false
	// 				  }
	// 				  name={item}
	// 				  style={{
	// 					transform: "scale(0.6)",
	// 					// marginLeft: "10px",
	// 					paddingRight: "0px",
	// 				  }}
	// 				  sx={{
	// 					color: "red",
	// 					"&.Mui-checked": {
	// 					  color: "#a6a6a6",
	// 					},
	// 				  }}
	// 				  onChange={(e) => handleCBChange(e)}
	// 				/>
	// 			  ) : (
	// 				<Checkbox
	// 				  checked={
	// 					filterFieldData.userSelection
	// 					  ? filterFieldData.includeexclude === "Exclude"
	// 						? filterFieldData.userSelection.includes(item)
	// 						  ? true
	// 						  : false
	// 						: false
	// 					  : false
	// 				  }
	// 				  name={item}
	// 				  style={{
	// 					transform: "scale(0.6)",
	// 					paddingRight: "0px",
	// 				  }}
	// 				  sx={{
	// 					// color: "red",
	// 					"&.Mui-checked": {
	// 					  color: "orange",
	// 					},
	// 				  }}
	// 				  onChange={(e) => handleCBChange(e)}
	// 				/>
	// 			  )}

	// 			  <span
	// 				title={item}
	// 				style={
	// 				  filterFieldData.includeexclude === "Exclude" &&
	// 					filterFieldData.userSelection.includes(item)
	// 					? {
	// 					  marginLeft: 0,
	// 					  marginTop: "3.5px",
	// 					  justifySelf: "center",
	// 					  textOverflow: "ellipsis",
	// 					  whiteSpace: "nowrap",
	// 					  overflow: "hidden",
	// 					  textDecoration: "line-through",
	// 					}
	// 					: {
	// 					  marginLeft: 0,
	// 					  marginTop: "3.5px",
	// 					  justifySelf: "center",
	// 					  textOverflow: "ellipsis",
	// 					  whiteSpace: "nowrap",
	// 					  overflow: "hidden",
	// 					}
	// 				}
	// 			  >
	// 				{item}
	// 			  </span>
	// 			</label>
	// 		  );
	// 		}
	// 	  );
	// 	} else {
	// 	  _selectionMembers = null;
	// 	}

	// 	return (
	// 	  <div className="SelectionMembersCheckBoxArea">{_selectionMembers}</div>
	// 	);
	//   };

	//   const constructChartAxesFieldObject = () => {
	// 	return filterFieldData;
	//   };

	const [ascDescNotify, setAscDescNotify] = useState<string>("");

	const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const data: string | any = chartControls.properties[propKey].chartData.length > 0 ? chartControls.properties[propKey].chartData : [];

	const [chat, setchat] = useState();
	useEffect(() => {
		setchat(data);
	}, [])
	// console.log(chartControls.properties[propKey].chartData)
	//copy of data
	// var chartData: string | any = [...data];
	var chartData: string | any = JSON.parse(JSON.stringify(data))
	var descendingChartData: string | any = JSON.parse(JSON.stringify(data))
	descendingChartData = JSON.parse(JSON.stringify(chat || data));
	const firstObjKey = chartData.length > 0 ? Object.keys(chartData[0]) : [];

	const [isToggled1, setIsToggled1] = useState(false);  // last tick/non-tick for first
	const [isToggled2, setIsToggled2] = useState(false);  // last tick/non-tick for second

	const handleToggleChange1 = (event: any) => {
		// descendingChartData[chartControls.properties[propKey].sortedValue].length === 0;

		
		setIsToggled1(event.target.checked);
	};
	// descendingChartData[]

	const handleToggleChange2 = (event: any) => {
		setIsToggled2(event.target.checked);
	};
	useEffect(()=>{
		chartControls.properties[propKey].sortedValue = firstObjKey[0];
	}, [])
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	console.log(descendingChartData)
	useEffect(() => {
		
		const initialSelection = descendingChartData.map((item: any) => item[chartControls.properties[propKey].sortedValue]);   // Initially, all members are selected
		setSelectedMembers(initialSelection);
	}, [chartControls.properties[propKey].sortedValue]);

	const [inclnull, setInclnull] = useState<String[]>([]);

	const Func = ({ props }: { props: any }) => {

		const handleMemberSelect = (member: string) => {
			// member = selected column value like chennai, pune etc.
			setSelectedMembers(prevState => {
				// prevState is an array 
				if (prevState.includes(member)) {
					inclnull.push(member);
					return prevState.filter(item => item !== member);
				} else {
					inclnull.pop();
					return [...prevState, member];
				}
			});
		};
		return (
			<>
				<div style={{ display: "flex", flexDirection: "column", marginLeft: "4px" }}>
					{descendingChartData.map((member: any, index: number) => (
						<div className='a' key={index}>
							<div className='b'>
								<input
									type="checkbox"
									checked={selectedMembers.includes(member[props])}
									onChange={() => handleMemberSelect(member[props])}
								/>
								<div className='d'>
									{member[props]} {/* Display the member name */}
								</div>
							</div>
						</div>
					))}
					<FormControlLabel style={{ marginLeft: "0px" }}
						control={
							<Switch
								checked={isToggled1}
								onChange={handleToggleChange1}
								style={{ color: "rgb(113, 111, 111)", borderRadius: 17 }}
							/>
						}
						label={<span style={{ fontSize: '15px' }}>Incl null</span>}
					/>
					<FormControlLabel style={{ marginLeft: "0px", }}
						control={
							<Switch
								checked={isToggled2}
								onChange={handleToggleChange2}
								style={{ color: "rgb(113, 111, 111)", borderRadius: 17 }}
							/>
						}
						label={<span style={{ fontSize: '15px' }}>Incl everything else</span>}
					/>
				</div>
			</>
		);
	};
	const [storeind, setStoreind] = useState("")
	const handleSelectedColumnValue = (event: string | any) => {
		setAscDescNotify("");
		SortedValue(propKey, event.target.value);
	};

	if (chartControls.properties[propKey].sortedValue !== "") {
		if (firstObjKey.length !== 0) {
			const find = firstObjKey.some(value => value === chartControls.properties[propKey].sortedValue);
			if (find === false) {
				SortedValue(propKey, "");
				SortOrder(propKey, "");
			}
		}
	}

	const equalPatternCollections: PatternCollectionType[] = [
		{ key: "greaterThan", value: "> Greater than" },
		{ key: "lessThan", value: "< Less than" },
		{ key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
		{ key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
		{ key: "equalTo", value: "= Equal to" },
	];

	const [selectedValue, setSelectedValue] = useState(equalPatternCollections[0].value);

	const Numb = () => {
		const [value, setValue] = useState(0);
		const handlefunc = (prop: String) => {
			let dummy: string | any = chat;
			let filteredData;
			if (prop === "> Greater than") {
				filteredData =
					dummy.filter((item: any) => (item[chartControls.properties[propKey].sortedValue] > value));
			}
			else if (prop === "< Less than") {
				filteredData = dummy.filter((item: any) => item[chartControls.properties[propKey].sortedValue] < value);
			}
			else if (prop === ">= Greater than or Equal to") {
				filteredData = dummy.filter((item: any) => item[chartControls.properties[propKey].sortedValue] >= value);
			}
			else if (prop === "<= Less than or Equal to") {
				filteredData = dummy.filter((item: any) => (item[chartControls.properties[propKey].sortedValue] <= value))
			}
			else {
				filteredData = dummy.filter((item: any) => item[chartControls.properties[propKey].sortedValue] === value);
			}
			SortChartData(propKey, filteredData);
		}

		const SelectedColumnValue = (event: any) => {
			setSelectedValue(event.target.value);
			// You might want to update chartControls or perform any other actions here
		};
		const handleIncrease = () => {
			setValue(prevValue => prevValue + 1);
		};
		const handleDecrease = () => {
			setValue(prevValue => prevValue > 0 ? prevValue - 1 : 0);
		};
		const handleInputChange = (event: any) => {
			setValue(event.target.value);
		};
		return (
			<div>
				<FormControl fullWidth sx={{ margin: "5px 5px 5px 5px" }}>
					{chartControls.properties[propKey].sortedValue ? null :
						<Typography sx={{ color: "#ccc", fontSize: "10px", textAlign: "left", padding: "0 0 3px 5px", fontStyle: "italic" }}>
							*Select a Column name*
						</Typography>}
						
					<Select sx={{
						width: "95.5%", height: "26px", fontSize: "13px", '&.MuiOutlinedInput-root': {
							'& fieldset': {
								border: '1px solid rgb(211, 211, 211)',
							},
							'&:hover fieldset': {
								border: '1px solid #2bb9bb',
							},
							'&.Mui-focused fieldset': {
								border: '1px solid #2bb9bb',
							},
							'&.Mui-focused svg': {
								color: '#2bb9bb',
							},
						},
					}}
						onChange={SelectedColumnValue}
						value={selectedValue || ""}>

						{equalPatternCollections.map((data, index) => (
							<MenuItem key={index} value={data.value || ""} onClick={() => handlefunc(data.value)}
								sx={{ color: "black", fontSize: "13px", "&:hover": { backgroundColor: "rgb(238, 238, 238)" }, }}>

								{data.value}
							</MenuItem>
						))}

					</Select>
				</FormControl>
				<input
					type="number"
					value={value || ""}
					onChange={handleInputChange}
					style={{ borderRadius: "5px", width: "220px", marginLeft: "2px", margin: "8px", padding: "6px" }}
				/>
			</div>
		)
	}
	console.log(storeind)
	const [showcss, setShowcss] = useState(false);
	const [hidecss, setHidecss] = useState(false);
	const showbutton = () => {
		const filteredData = descendingChartData.filter((item: any) => selectedMembers.includes(item[chartControls.properties[propKey].sortedValue]));
		SortChartData(propKey, filteredData)
		console.log(descendingChartData)
		setShowcss(true)
		setHidecss(false)
	}
	
	const [absentMembers, setAbsentMembers] = useState<string[]>([]);
	const Hidebutton = () => {
		const result = descendingChartData.filter((item: any) => !selectedMembers.includes(item[chartControls.properties[propKey].sortedValue]));
		setAbsentMembers(result);
		setHidecss(true)
		setShowcss(false)
		SortChartData(propKey, result)
	}
	const handleclick =(index:any) =>{
		
		if(chartProp.properties[propKey].chartAxes[1]?.fields[index]?.dataType){
			setStoreind(chartProp.properties[propKey].chartAxes[1]?.fields[index]?.dataType)
		}
		else{
			setStoreind("integer")
		}
	}
	
	return (
		<React.Fragment>
			{/* <SelecPickListCard/> */}
			{data.length > 0 ?
				(
					<div>
						<div className='sort'>Show/Hide</div>
						<div style={{ display: "flex" }}>
							{chartControls.properties[propKey].sortedValue ?
								<>
									<div style={{ borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginBottom: "5px", transition: "0.2s", backgroundColor: showcss === false ? "white" : "#E0E0E0" }}
										className={chartControls.properties[propKey].sortOrder === "Ascending" ? "radioButtonSelected" : "radioButton"}
										onClick={() => {
											showbutton()
										}}>
										Show
									</div>

									<div style={{ borderRadius: "0 5px 5px 0", cursor: "pointer", marginBottom: "10px", transition: "0.2s", backgroundColor: hidecss === false ? "white" : "#E0E0E0" }}
										className={chartControls.properties[propKey].sortOrder === "Descending" ? "radioButtonSelected" : "radioButton"}
										onClick={() => {
											inclnull.length > 0 ? Hidebutton() : showbutton()
											
										}}>
										Hide
									</div>
								</>
								:
								<>
									<div style={{ borderRadius: "5px 0 0 5px", cursor: "pointer", marginLeft: "10px", marginTop: "10px", transition: "0.2s", backgroundColor: showcss === false ? "white" : "#E0E0E0" }} className="radioButton"	
										onClick={() => {
											setAscDescNotify("Firstly Please select column name");
										}}>
										Show
									</div>

									<div style={{ borderRadius: "0 5px 5px 0", cursor: "pointer", marginTop: "10px", transition: "0.2s" }} className="radioButton"
										onClick={() => {
											setAscDescNotify("Firstly Please select column name");
										}}>
										Hide
									</div>
								</>
							}
						</div>

						<div className='sort'>Column</div>

						<div>
							<FormControl fullWidth sx={{ margin: "0 5px 0 5px" }}>

								{chartControls.properties[propKey].sortedValue ? null :
									<Typography sx={{ color: "#ccc", fontSize: "10px", textAlign: "left", padding: "0 0 3px 5px", fontStyle: "italic" }}>
										*Select a Column name*
									</Typography>}

								<Select sx={{
									width: "95.5%", height: "26px", fontSize: "13px", '&.MuiOutlinedInput-root': {
										'& fieldset': {
											border: '1px solid rgb(211, 211, 211)',
										},
										'&:hover fieldset': {
											border: '1px solid #2bb9bb',
										},
										'&.Mui-focused fieldset': {
											border: '1px solid #2bb9bb',
										},
										'&.Mui-focused svg': {
											color: '#2bb9bb',
										},
									},
								}}
									onChange={handleSelectedColumnValue}
									value={chartControls.properties[propKey].sortedValue || ""}>


									{firstObjKey.map((data, index) => (
										<MenuItem key={index} value={data}
												onClick={()=>handleclick(index)}
												sx={{ color: "black", fontSize: "13px", "&:hover": { backgroundColor: "rgb(238, 238, 238)" }, }}>
													
												{data}
											</MenuItem>
										
									))}
								</Select>

							</FormControl>
						</div>

						<div>
							{ascDescNotify &&
								<p style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}>
									*{ascDescNotify}*
								</p>
							}
						</div>


						<div>
							{/* {(chartControls.properties[propKey].sortedValue === 'city')
								? <Func props={chartControls.properties[propKey].sortedValue} />
								: <Numb />} */}
								{storeind === 'integer' || storeind ==='number' || storeind === "decimal" ?<Numb />:
								<Func props={chartControls.properties[propKey].sortedValue} />
								}
						</div>
					</div>
				)
				:
				(
					<div>
						<div className='sortDisable'>Show/Hide</div>
						<div>
							<FormControl fullWidth disabled sx={{ margin: "0 10px 0 10px" }}>
								<Select sx={{ width: "95.5%", height: "26px" }}></Select>
							</FormControl>
						</div>
						<div className='sortDisable'>Show/Hide</div>
						<div style={{ display: "flex" }}>
							<div style={{ color: "#b6b6b6", borderRadius: "5px 0 0 5px", marginLeft: "10px" }} className="radioButton">
								Show
							</div>
							<div style={{ color: "#b6b6b6", borderRadius: "0 5px 5px 0" }} className="radioButton">
								Hide
							</div>
						</div>
					</div>
				)}
		</React.Fragment>
	)
}
const mapStateToProps = (state: any) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateLeftFilterItem: (
			propKey: string,
			binIndex: number,
			itemIndex: number,
			item: any,
			currentChartAxesName: string
		) =>
			dispatch(
				editChartPropItem("updateQuery", {
					propKey,
					binIndex,
					itemIndex,
					item,
					currentChartAxesName,
				})
			),
		SortChartData: (propKey: string, chartData: string | any) =>
			dispatch(SortChartData(propKey, chartData)),
		SortOrder: (propKey: string, order: string) =>
			dispatch(SortOrder(propKey, order)),
		SortedValue: (propKey: string, value: string | any) =>
			dispatch(SortedValue(propKey, value)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ShowHide);
