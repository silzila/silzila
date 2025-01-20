import { Button, SxProps, Theme } from "@mui/material";
import React from "react";
interface IHoverButton {
  /**
   * @param text: text to be displayed on the button
   */
  text: string;
  /**
   * @param color: font color of the button
   */
  color: string;
  /**
   * @param hoverColor: font color of the button when hovered
   */
  hoverColor: string;
  /**
   * @param backgroundColor: background color of the button
   */
  backgroundColor: string;
  /**
   * @param hoverBackgroundColor: background color of the button when hovered
   */
  hoverBackgroundColor: string;
  /**
   * @param sx: style object for the button
   */
  sx?: SxProps<Theme>;
  /**
   * @param transitionTime: time taken for the button to change color when hovered
   */
  transitionTime: string;
  /**
   * @param disabled: boolean to disable the button
   */
  disabled?: boolean;
  /**
   * @param type: type of the button
   */
  type?:'submit'|'button'|'reset'
  /**
   * @param onClick: function to be called when the button is clicked
   * @returns void
   */

  onClick?: (e?:any) => void;
}
const HoverButton = ({
  text,
  transitionTime,
  color,
  hoverColor,
  backgroundColor,
  hoverBackgroundColor,
  sx,
  disabled,
  type='button',
  onClick,
}: IHoverButton) => {
  return (
    <Button
    type={type}
      onClick={onClick}
      disabled={disabled}
      sx={{
        ...sx,
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
        transition: `all ${transitionTime} ease-in-out`,
        color: color,
        cursor:disabled?"not-allowed":"pointer",
        backgroundColor: backgroundColor,
        pointerEvents:'auto',
        "&:hover:not(:disabled)": {
      color: hoverColor,
    },
    "&:hover:not(:disabled)::before": {
      transform: "translateX(0%)",
    },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: hoverBackgroundColor,
          zIndex: -1,
          transform: "translateX(-100%)",
          transition: `all ${transitionTime} ease-in-out`,
        },
        '&:disabled':{
          pointerEvents:'auto',
          cursor:'not-allowed'
        }
      }}
    >
      {text}
    </Button>
  );
};

export default HoverButton;
