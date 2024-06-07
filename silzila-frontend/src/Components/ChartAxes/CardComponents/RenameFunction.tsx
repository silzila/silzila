
import React, { useEffect, useState } from "react";
import { Box, Button, Menu, MenuItem, TextField, Typography } from "@mui/material";
import { connect } from "react-redux";
import { ChartPropertiesProps} from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { editChartPropItem } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { updateisTextRenamed } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { initial } from "lodash";



interface RenameFunctionProps {
    renamefn: boolean;
    setRenamefn: React.Dispatch<React.SetStateAction<boolean>>;
    propKey: string;
    bIndex: number;
    itemIndex: number;
    chartProp: ChartPropertiesProps ;
    updateQueryParam: (
        propKey: string,
        binIndex: number,
        itemIndex: number,
        item: any
    ) => void;
    updateisTextRenamed: (propKey:string,isTextRenamed: boolean) => void;
}

const RenameFunction = ({
    renamefn,
    setRenamefn,
    propKey,
    bIndex,
    itemIndex,
    chartProp,
    updateQueryParam,
    updateisTextRenamed,
}: RenameFunctionProps) => {
     
   
    const displayfield = chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex];

     // Initialize renameText with the current name_with_aggr value
    const Aggname=`${displayfield.agg} of ${displayfield.fieldname}`;

    const initialRenameText= displayfield.agg && displayfield.agg.trim() !== "" 
    ? Aggname:displayfield.displayname;
     
    const [renameText, setRenameText] = useState( initialRenameText);
    const [error, setError] = useState("");
    const [isManualInput, setIsManualInput] = useState(false); // Track if the value was manually entered

    useEffect(() => {
        if ( !isManualInput) {
        const displayCopy = { ...displayfield, displayname: initialRenameText, Aggname: Aggname };
        updateQueryParam(propKey, bIndex, itemIndex, displayCopy);
    }
    // }, [ displayfield.agg, displayfield.displayname,isManualInput]);
}, [ initialRenameText]);

    useEffect(() => {
        if (renamefn && !isManualInput) {
            setRenameText(displayfield.agg && displayfield.agg.trim() !== "" ? Aggname :displayfield.displayname );
            setError(""); // Clear any previous error when renaming starts
        }
    }, [renamefn, displayfield.agg, displayfield.displayname,isManualInput]);


     // Get all fieldnames except the current field's fieldname
     const allFieldNames = chartProp.properties[propKey].chartAxes.flatMap((axis:any) => axis.fields.map((field:any) => field.fieldname));
     const otherFieldNames = allFieldNames.filter((name:string) => name !== displayfield.fieldname);
    
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
        const displayCopy = { ...displayfield, displayname:renameText,isTextRenamed: true,Aggname:Aggname}; // Update the displayname with the entered text
        updateQueryParam(propKey, bIndex, itemIndex, displayCopy); // Update Redux store with the new displayname
        setRenamefn(false); // Close the rename menu
        updateisTextRenamed(propKey,true); // Update Redux store with the new rename status
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
                   
                    {/* {renameText.trim() !== "" && (                   */}
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
             {/* )}  */}
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
            item: any
        ) => dispatch(editChartPropItem("updateQuery", { propKey, binIndex, itemIndex, item })),
        updateisTextRenamed:(propKey:string,isTextRenamed:boolean)=>
			dispatch(updateisTextRenamed(propKey,isTextRenamed)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RenameFunction);
