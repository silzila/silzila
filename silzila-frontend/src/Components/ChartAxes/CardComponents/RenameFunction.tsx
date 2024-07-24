
import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { connect } from "react-redux";
import { ChartPropertiesProps} from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { editChartPropItem } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { initial } from "lodash";



interface RenameFunctionProps {
    renamefn: boolean;
    setRenamefn: React.Dispatch<React.SetStateAction<boolean>>;
    propKey: string;
    bIndex: number;
    itemIndex: number;
    chartProp: ChartPropertiesProps ;
    uID:String;
    updateQueryParam: (
        propKey: string,
        binIndex: number,
        itemIndex: number,
        item: any,
        currentChartAxesName:string
    ) => void;
}

const RenameFunction = ({
    renamefn,
    setRenamefn,
    propKey,
    bIndex,
    itemIndex,
    uID,
    chartProp,
    updateQueryParam,
}: RenameFunctionProps) => {
     
   
	//let currentChartAxesName = uID ? "chartAxes_" + uID : "chartAxes";
    let currentChartAxesName = "chartAxes";

    const field = chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex] || {};

     // Initialize renameText with the current name_with_aggr value
    const Aggname=`${field.agg}${field.timeGrain ? ' ' + field.timeGrain : ''} of ${field.fieldname}`;

    const initialRenameText = field.agg && field.agg.trim() !== "" && !field.isTextRenamed ? Aggname : field.displayname;
     
    const [renameText, setRenameText] = useState(initialRenameText || "");
    const [error, setError] = useState("");
    const [isManualInput, setIsManualInput] = useState(false); // Track if the value was manually entered

    useEffect(() => {
        if (initialRenameText && !isManualInput) {
        const displayCopy = { ...field, displayname: initialRenameText, Aggname: Aggname };
        updateQueryParam(propKey, bIndex, itemIndex, displayCopy, currentChartAxesName);
    }
    // }, [ field.agg, field.displayname,isManualInput]);
}, [ initialRenameText]);

    useEffect(() => {
        if (renamefn && !isManualInput) {
            setRenameText(field.agg && field.agg.trim() !== "" && !field.isTextRenamed  ? Aggname :field.displayname );
            setError(""); // Clear any previous error when renaming starts
        }
    }, [renamefn, field.agg, field.displayname,isManualInput]);


     // Get all fieldnames except the current field's fieldname
     const allFieldNames = chartProp.properties[propKey].chartAxes.flatMap((axis:any) => axis.fields.map((field:any) => field.fieldname));
     const otherFieldNames = allFieldNames.filter((name:string) => name !== field.fieldname);
    
        const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newText = event.target.value;
            setIsManualInput(true);
            setRenameText(newText);
           
    
            // Check if the new text conflicts with other field names
            if (newText.trim() !== "" && otherFieldNames.includes(newText.trim())) {
                setError("Fieldname already taken!");
            } 
            else if(newText.trim() === "" ){
                setError("Input some value!");
            }
            
            else {
                setError(""); // Clear the error if the new text is valid
            }
        };
    

    const handleOkClick = () => {

        // Validate if the new name is not already in the fieldnames list
        if (otherFieldNames.includes(renameText.trim())) {
            setError("Fieldname already taken!");
        } 
        else if(renameText.trim() === "" ){
            setError("Input some value!");
        }
        else {
            const displayCopy = { ...field, displayname:renameText, isTextRenamed: true, Aggname:Aggname }; // Update the displayname with the entered text
            updateQueryParam(propKey, bIndex, itemIndex, displayCopy, currentChartAxesName); // Update Redux store with the new displayname
            setRenamefn(false); // Close the rename menu
        }
    };
    const handleCancelClick=()=>{
        setRenamefn(false);
    }
    return (
        <div>
            <Menu  
                open={renamefn}
                onClose={() => setRenamefn(false)}
                sx={{ textAlign:"center",
                '&:hover': {
                    backgroundColor: 'transparent !important',
                },
                }}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}

            >

     
               <Typography variant="h5" sx={{ padding: "px",color:"#b6b6b6",marginBottom:"20px",marginTop:'10px',
               }}
               >
                     Rename for Visual
                </Typography>

                <MenuItem disableRipple
                 sx={{
                    '&:hover': {
                        backgroundColor: 'transparent !important',
                    },
                    '&.Mui-focusVisible': {
                        backgroundColor: 'transparent !important',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'transparent !important',
                    },
                }}
                >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',marginBottom:"10px"}}>
                    
                   
                    <TextField
                        value={renameText}
                        onChange={handleRenameChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && renameText.trim() !== "") {
                                handleOkClick();
                            }
                        }}
                        placeholder="Rename for Visual"
                        size="small" 
                        autoFocus
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#b6b6b6',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#b6b6b6',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#b6b6b6',
                                },
                                '& input': {
                                    backgroundColor: 'transparent !important',
                                },
                                '&:hover input': {
                                    backgroundColor: 'transparent !important',
                                },
                                '&.Mui-focused input': {
                                    backgroundColor: 'transparent !important',
                                },

                                '&:hover': {
                                    backgroundColor: 'transparent !important',
                                },
                                '&.Mui-focusVisible': {
                                    backgroundColor: 'transparent !important',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'transparent !important',
                                },
                            },
                        }}
                        
                    />
                    {/* </MenuItem>
                    <MenuItem> */}
                        {error && <Typography color="error">{error}</Typography>}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%',marginTop:'30px'}}>
                            <Button
                                onClick={handleCancelClick}
                                sx={{
                                    fontSize: "10px",
                                    color:"#b6b6b6",
                                    border: "2px solid  #b6b6b6",
                                    borderRadius: "2px",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        boxShadow: "0px 0px 2px 1px  #b6b6b6",
                                    },
                                    '&:focus': {
                                        backgroundColor: "transparent",
                                        boxShadow: "0px 0px 2px 1px #b6b6b6",
                                    },
                                }}
                            >
                                CANCEL
                            </Button>
                        
                            <Button
                                onClick={handleOkClick}
                                disabled={renameText.trim() === ""||otherFieldNames.includes(renameText.trim())}
                                sx={{
                                    fontSize: "10px",
                                    color:"#2bb9bb",
                                    border:renameText.trim() === ""||otherFieldNames.includes(renameText.trim())?"2px solid #b6b6b6" :"2px solid #2bb9bb",
                                    borderRadius: "2px",
                                    // textTransform: "initial",
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                        boxShadow: "0px 0px 2px 1px #2bb9bb",
                                    },
                                    '&:focus': {
                                        backgroundColor: "transparent",
                                        boxShadow: "0px 0px 2px 1px #2bb9bb",
                                    },
                                }}
                            >
                                OK
                            </Button>             
                        </Box>
                    </Box>
                  
                </MenuItem>
            </Menu>
        </div>
    );
};

const mapStateToProps = (state:any, ownProps:any) => {
    return {
        chartProp:state.chartProperties
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateQueryParam: (
            propKey: string,
            binIndex: number,
            itemIndex: number,
            item: any,
            currentChartAxesName : string
        ) => dispatch(editChartPropItem("updateQuery", { propKey, binIndex, itemIndex, item, currentChartAxesName })),
      
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RenameFunction);
