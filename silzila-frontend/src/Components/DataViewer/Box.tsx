// This component is the draggable table column are then dropped into dropzones

import React, { useState } from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AiOutlineFunction } from "react-icons/ai";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { fontSize, palette } from "../..";
import { AcceptRejectDialog } from "../CommonFunctions/DialogComponents";
import { Area } from "../CommonFunctions/aliases";

export const Box = ({
  name,
  type,
  fieldData,
  colsOnly,
  isSavedCalculation,
  isPresentInAxes,
  handleEditButton,
  handleDeleteButton,
  allSavedCalculations,
  deleteIfPresentInAxes,
  informationForPropDeletion
}: any) => {

  let boxUUID: string | null

  if (isSavedCalculation) {
    boxUUID = allSavedCalculations.find((calc: any) => calc.calculationInfo.calculatedFieldName.toLowerCase().replace(/[^a-z0-9]/g, '') === fieldData.fieldname.toLowerCase().replace(/[^a-z0-9]/g, ''))?.uuid
  } else {
    boxUUID = null
  }

  const [opacity, drag] = useDrag<any>({
    type: type ?? 'card',
    item: { name, type, fieldData, bIndex: 99, boxUUID,dragFrom:Area.TABLE},
    collect: (monitor: any) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  const [isDivHoverActive, setIsDivHoverActive] = React.useState(false);
  const [arrowDirection, setArrowDirection] = React.useState<string>("down");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsDivHoverActive(true)}
      onMouseLeave={() => setIsDivHoverActive(false)}
      ref={drag}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: !isSavedCalculation ? "100%" : "10rem",
        paddingInline: '0.2rem'
      }}
      className={colsOnly ? "styleForColumnsOnly" : "styleForTableHeader"}
    >
      {
        isPresentInAxes && <AcceptRejectDialog
          acceptFunction={() => {
            setIsDivHoverActive(false);
            handleDeleteButton();
            handleClose();

            for (const propKeyForThisDeleteInfo in informationForPropDeletion) {

              informationForPropDeletion[propKeyForThisDeleteInfo].forEach((item: any) => {
                const binIndexForThisPropKey = item.binIndex
                const fieldIndexForThisPropKey = item.fieldIndex

                console.log("deleting", {
                  propKeyForThisDeleteInfo,
                  binIndexForThisPropKey,
                  fieldIndexForThisPropKey
                })

                deleteIfPresentInAxes(propKeyForThisDeleteInfo, binIndexForThisPropKey, fieldIndexForThisPropKey)
              })

            }

          }}
          rejectFunction={() => {
            setIsDeleteDialogOpen(false)
          }}
          messages={[{
            text: `This calculation is used in the axes. Do you still want to delete it?`
          }]}
          open={isDeleteDialogOpen}
          closeFunction={() => { setIsDeleteDialogOpen(false) }}
          heading=""
          acceptText="Delete"
          rejectText="Cancel"
          varient='static'
        />
      }

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <DragIndicatorIcon
          style={{
            color: palette.primary.contrastText,
          }}
          fontSize="small"
        />
        <span
          className="boxText"
          style={{
            fontSize: "0.75rem",
            fontFamily: "Roboto-Bold",
            color: palette.primary.contrastText,
            maxWidth: isSavedCalculation ? "72px" : "100px", // Set a fixed width
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </span>
        {isSavedCalculation && (
          <AiOutlineFunction color={palette.primary.main} size={15} />
        )}
        {isSavedCalculation && (
          <div
            style={{
              visibility: `${isDivHoverActive ? "visible" : "hidden"}`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => {
                if (arrowDirection === "down") {
                  setArrowDirection("up");
                } else {
                  setArrowDirection("down");
                }
                handleClick(e);
                // handleEditButton()
              }}
              style={{
                height: "100%",
                minWidth: "1.5rem",
                maxWidth: "1.5rem",
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              {arrowDirection === "down" ? (
                <MdOutlineKeyboardArrowDown style={{ color: palette.primary.contrastText }} />
              ) : (
                <MdOutlineKeyboardArrowUp style={{ color: "#5D5C5C" }} />
              )}
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setIsDivHoverActive(false);
                handleClose();
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                sx={{ color: palette.primary.contrastText, fontSize: '0.75rem' }}
                dense
                onClick={() => {
                  setIsDivHoverActive(false);
                  handleEditButton();
                  handleClose();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                sx={{ color: palette.primary.contrastText, fontSize: fontSize.medium }}
                dense
                onClick={() => {
                  if (isPresentInAxes) {
                    setIsDeleteDialogOpen(true)
                  } else {
                    setIsDivHoverActive(false);
                    handleDeleteButton();
                    handleClose();
                  }
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
      {/* {
				isSavedCalculation &&
				<div
					style={{
						visibility: `${isDivHoverActive ? "visible" : "hidden"}`,
					}}
				>
					<Button
						id="basic-button"
						aria-controls={open ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={(e) => {
							if (arrowDirection === "down") {
								setArrowDirection("up")
							} else {
								setArrowDirection("down")
							}
							handleClick(e)
							// handleEditButton()
						}}
					>
						{
							arrowDirection === "down" ?
								<MdOutlineKeyboardArrowDown style={{ color: "#2BB9BB" }} />
								:
								<MdOutlineKeyboardArrowUp style={{ color: "#2BB9BB" }} />
						}
					</Button>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={() => {
							setIsDivHoverActive(false)
							handleClose()
						}}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem dense onClick={() => {
							setIsDivHoverActive(false)
							handleEditButton()
							handleClose()
						}}>Edit</MenuItem>
						<MenuItem dense onClick={() => {
							setIsDivHoverActive(false)
							handleDeleteButton()
							handleClose()
						}}>Delete</MenuItem>
					</Menu>
				</div>
			} */}
    </div>
  );
};
