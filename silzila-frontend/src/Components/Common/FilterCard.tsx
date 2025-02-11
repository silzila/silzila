import React, { useEffect, useState } from 'react'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from '@mui/material/Button';
import update from 'immutability-helper';
import {
    Checkbox,
    Divider,
    FormControl,
    Menu,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from "@mui/material";
import { connect } from 'react-redux';
import Radio from "@mui/material/Radio";
import { deleteSourceFromFlow, updateSearchConditionFilter } from '../../redux/Calculations/CalculationsActions';

const FilterCard = ({

    cardName, // have to be passed down
    calculations,
    tabTileProps,
    cardUID, // have to be passed down,
    cardIndex,
    sourceOption,

    deleteSourceFromFlow,
    updateSearchConditionFilter,
    setSourceOption

}: {

    cardName: string,
    calculations?: any,
    tabTileProps?: any,
    cardUID: string,
    cardIndex: number,
    sourceOption: {
        [key: string]: {
            sourceId: string,
            sourceOption: string,
            dataType: string
        }
    },

    deleteSourceFromFlow: (calculationFlowUID: string, sourceUID: string, propKey: string, sourceIndex: number) => void,
    updateSearchConditionFilter: (propKey: string, conditionFilterUid: string, sourceUid: string, shouldExclude: boolean) => void,
    setSourceOption: React.Dispatch<React.SetStateAction<any>>,

}) => {

    const [isCardCollapsed, setIsCardCollapsed] = React.useState<boolean>(false);
    const [showOptions, setShowOptions] = React.useState<boolean>(false);
    const propKey = tabTileProps.selectedTabId + '.' + tabTileProps.selectedTileId;
    const currentCalculationSession = calculations.properties[propKey].currentCalculationSession;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const activeFlow = currentCalculationSession.activeFlow;

    const cardInfo = currentCalculationSession.calculationInfo.fields[cardUID]
    const activeConditonIndex = currentCalculationSession.activeCondition

    const cardFilterUid = currentCalculationSession.calculationInfo.flows[activeFlow][activeConditonIndex].filter;

    // this why is conditions an array here i don't know. I mean my doubt is 
    const shouldExclude = currentCalculationSession.calculationInfo.conditionFilters[cardFilterUid][cardIndex].conditions[0].shouldExclude;
    const conditionFilter = currentCalculationSession.calculationInfo.conditionFilters[cardFilterUid][cardIndex];

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div
            className="axisFilterField"
            // style={styles}
            style={
                !isCardCollapsed
                    ? {
                        border: "1px #af99db solid",
                        color: "#af99db",
                        fontWeight: "bold",
                        position: 'relative',
                    }
                    : {}
            }
        >
            {/* remove column  */}
            <button
                type="button"
                className="buttonCommon columnClose"
                onClick={() => {
                    setSourceOption(update(sourceOption, {
                        $apply: (sourceOption: any) => {
                            const newSourceOption = sourceOption;
                            delete newSourceOption[cardUID]
                            return newSourceOption
                        }
                    }))
                    deleteSourceFromFlow(activeFlow, cardUID, propKey, cardIndex)
                }}
                title="Remove field"
            >
                <CloseRoundedIcon style={{ fontSize: "13px" }} />
            </button>

            {/* filter column name */}

            <span className="columnName" style={{ lineHeight: "15px" }}>
                {cardName}
            </span>
            {/* down arrow icon */}
            <Button
                type="button"
                className="buttonCommon"
                style={{ backgroundColor: "transparent" }}
                title="More Options"
                onClick={handleClick}
            >
                <MoreVertIcon style={{ fontSize: "16px", color: "#999999" }} />
            </Button>

            <RenderMenu
                sourceOption={sourceOption}
                setSourceOption={setSourceOption}
                conditionFilterUid={cardFilterUid}
                sourceUid={cardUID}
                propKey={propKey}
                updateSearchConditionFilter={updateSearchConditionFilter}
                isExcluded={shouldExclude}
                setAnchorEl={setAnchorEl}
                anchorEl={anchorEl}
                open={open}
                cardInfo={cardInfo}
            />

            {/* expand colapse icon */}
            <button
                type="button"
                className="buttonCommon columnDown"
                title={showOptions ? "Expand" : "Collapse"}
            >
                <ExpandCollaseIconSwitch setShowOptions={setShowOptions} showOptions={showOptions} />
            </button>

        </div>
    )
}

const ExpandCollaseIconSwitch = ({
    showOptions,
    setShowOptions
}: {
    showOptions: boolean,
    setShowOptions: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return showOptions ? (
        <ChevronRightIcon
            style={{ height: "18px", width: "18px", color: "#999999" }}
            onClick={(e) => {
                setShowOptions(false);
            }}
        />
    ) : (
        <KeyboardArrowDownIcon
            style={{ height: "18px", width: "18px", color: "#999999" }}
            onClick={(e) => {
                setShowOptions(true)
            }}
        />
    );
};

const RenderMenu = ({
    cardInfo,
    anchorEl,
    open,
    isExcluded,
    propKey,
    sourceUid,
    conditionFilterUid,
    sourceOption,

    setAnchorEl,
    updateSearchConditionFilter,
    setSourceOption
}: {
    cardInfo: any,
    anchorEl: any,
    open: boolean,
    isExcluded: boolean,
    propKey: string,
    sourceUid: string,
    conditionFilterUid: string,
    sourceOption: {
        [key: string]: {
            sourceId: string,
            sourceOption: string,
            dataType: string
        }
    },

    setAnchorEl: React.Dispatch<React.SetStateAction<any>>,
    setSourceOption: React.Dispatch<React.SetStateAction<any>>,
    updateSearchConditionFilter: (propKey: string, conditionFilterUid: string, sourceUid: string, shouldExclude: boolean) => void,
}) => {

    var options = ["Include", "Exclude"];
    var options2 = ["Pick List", "Search Condition"];
    ///Relative Filter option ony for "date" and "timestamp"

    useEffect(() => {

        if (sourceUid in sourceOption && sourceOption[sourceUid].sourceOption !== 'Pick List') return;
        if (!(localStorage.getItem('accessToken'))) return;

    }, [])

    if (
        cardInfo.dataType === "timestamp" ||
        cardInfo.dataType === "date"
    )
        options2 = ["Pick List", "Search Condition", "Relative Filter"];

    return (

        <Menu
            style={{ border: '2px solid red' }}
            id="basic-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "center", horizontal: "right" }}
            open={open}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
        >
            {Object.keys(sourceOption).length > 0 && options2.length > 0
                ? options2.map((opt2, index) => {
                    return (
                        <div
                            key={index}
                            style={{ display: "flex" }}
                            onClick={() => {

                                // if (sourceOption[sourceUid].sourceOption === 'Search Condition') {

                                //     if (sourceOption[sourceUid].dataType === 'date' || sourceOption[sourceUid].dataType === 'timestamp') {
                                //         // update the operator to the first item of the list
                                //     }
                                // }

                                const newState = update(sourceOption, {
                                    [sourceUid]: {
                                        sourceOption: { $set: opt2 }
                                    }
                                })
                                setSourceOption(newState)
                                setAnchorEl(null)
                            }}
                        >
                            <Tooltip
                                title={
                                    opt2 === cardInfo.fieldtypeoption
                                        ? "Selected"
                                        : null
                                }
                            >
                                <Radio
                                    checked={
                                        (opt2 === 'Search Condition' && sourceUid in sourceOption && (sourceOption[sourceUid].sourceOption === 'Search Condition')) ||
                                        (opt2 === 'Pick List' && sourceUid in sourceOption && (sourceOption[sourceUid].sourceOption === 'Pick List'))}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "12px",
                                            height: "12px",
                                            color: "#af99db",
                                        },
                                        // fontSize: "0px",
                                        alignSelf: "center",
                                        marginLeft: "5px",
                                    }}
                                />
                            </Tooltip>
                            <MenuItem
                                key={index}
                                sx={{
                                    flex: 1,
                                    fontSize: "12px",
                                    alignSelf: "center",
                                    padding: "2px 0px",
                                    paddingRight: "1rem",
                                }}
                            >
                                {opt2}
                            </MenuItem>
                        </div>
                    );
                })
                : null}

            <Divider
                sx={{
                    margin: "5px 0px",
                }}
            />

            {options.length > 0
                ? options.map((opt, index) => {
                    if (cardInfo.fieldtypeoption === "Relative Filter")
                        cardInfo.includeexclude = "Include";
                    return (
                        <div
                            key={index}
                            style={{ display: "flex" }}
                            onClick={() => {
                                updateSearchConditionFilter(propKey, conditionFilterUid, sourceUid, !isExcluded)
                            }}
                        >
                            <Tooltip
                                title={
                                    opt === cardInfo.includeexclude ? "Selected" : null
                                }
                            >
                                <Radio
                                    checked={(opt === 'Include' && !isExcluded) || (opt === 'Exclude' && isExcluded)}
                                    disabled={
                                        opt === "Exclude" &&
                                        cardInfo.fieldtypeoption === "Relative Filter"
                                    }
                                    sx={
                                        cardInfo.includeexclude === "Exclude" &&
                                            opt === cardInfo.includeexclude
                                            ? {
                                                // flex: 1,
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "12px",
                                                    height: "12px",
                                                    color: "#ffb74d",
                                                },
                                                alignSelf: "center",
                                                marginLeft: "5px",
                                            }
                                            : {
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "12px",
                                                    height: "12px",
                                                    color: "#af99db",
                                                },
                                                alignSelf: "center",
                                                marginLeft: "5px",
                                            }
                                    }
                                />
                            </Tooltip>
                            <MenuItem
                                disabled={
                                    opt === "Exclude" &&
                                    cardInfo.fieldtypeoption === "Relative Filter"
                                }
                                sx={{
                                    fontSize: "12px",
                                    alignSelf: "center",
                                    padding: "2px 0px",
                                    flex: 1,
                                }}
                                key={index}
                            >
                                {opt}
                            </MenuItem>
                        </div>
                    );
                    // }
                })
                : null}
        </Menu>
    );
};

const mapStateToProps = (state: any) => {
    return {
        calculations: state.calculations,
        tabTileProps: state.tabTileProps,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteSourceFromFlow: (calculationFlowUID: string, sourceUID: string, propKey: string, sourceIndex: number) =>
            dispatch(deleteSourceFromFlow(calculationFlowUID, sourceUID, propKey, sourceIndex)),
        updateSearchConditionFilter: (propKey: string, conditionFilterUid: string, sourceUid: string, shouldExclude: boolean) =>
            dispatch(updateSearchConditionFilter(propKey, conditionFilterUid, sourceUid, shouldExclude)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterCard)