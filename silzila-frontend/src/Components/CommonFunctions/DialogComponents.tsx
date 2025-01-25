// Commonly used notifications / alerts in many components for
// 	- alerting actions of User interactions
// 	- Server success / failure message display

import { Alert, AlertColor, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, PaperProps, SxProps, Theme } from "@mui/material";
import { resetState } from "../../redux/DataSet/datasetActions";
import { useDispatch } from "react-redux";
import { fontSize, palette } from "../..";
import HoverButton from "../Buttons/HoverButton";

// Simple alert to display for 2-3 seconds after a user action like deleting, adding items, server CallSharp, etc

interface NotificationProps {
  openAlert: boolean;
  severity: AlertColor;
  testMessage: string;
  onCloseAlert?: () => void;
}
interface NotificationV2Props {
  openAlert: boolean;
  severity: AlertColor;
  textMessages: string[];
  onCloseAlert?: () => void;
}
interface ChangeConnectionProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setReset?: any;
  heading: string;
  message: string;
  onChangeOrAddDataset?: any;
}
export const NotificationDialog = ({
  openAlert,
  severity,
  testMessage,
  onCloseAlert,
}: NotificationProps) => {
  return (
    <>
      <Dialog
        open={openAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={onCloseAlert}
      >
        <Alert style={{ padding: "30px" }} severity={severity}>
          {testMessage}
        </Alert>
      </Dialog>
    </>
  );
};
interface IPopUpSpinner {
  show: boolean;
  sx?: SxProps<Theme>;
  spinnerColor?: string;
  paperProps?: PaperProps;
}
export const PopUpSpinner = ({
  sx = {},
  show,
  spinnerColor = palette.primary.main,
  paperProps = {},
}: IPopUpSpinner) => {
  return (
    <Dialog open={show} PaperProps={{ ...paperProps }}>
      <Box
        sx={{
          display: "flex",
          height: "10rem",
          width: "10rem",
          alignItems: "center",
          justifyContent: "center",
          ...sx,
        }}
      >
        <CircularProgress sx={{ color: spinnerColor }} />
      </Box>
    </Dialog>
  );
};
export const NotificationDialogV2 = ({
  openAlert,
  severity,
  textMessages,
  onCloseAlert,
}: NotificationV2Props) => {
  return (
    <Dialog
      open={openAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={onCloseAlert}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {textMessages.map((Message, index) => {
          if (index === 0) {
            // For the first message, show Alert with an icon
            return (
              <Alert
                key={index}
                severity={severity}
                sx={{ paddingBottom: "0" }}
              >
                {Message}
              </Alert>
            );
          }

          // For other messages, render without an icon
          return (
            <div
              key={index}
              style={{
                paddingTop: "0",
              }}
              className="MuiAlert-colorWarning MuiAlert-standardWarning MuiAlert-standard css-y8tvd1-MuiPaper-root-MuiAlert-root"
              role="alert"
            >
              <div
                style={{
                  paddingInline: "2rem",
                }}
                className="MuiAlert-message css-1pxa9xg-MuiAlert-message"
              >
                {Message}
              </div>
            </div>
          );
        })}
      </Box>
    </Dialog>
  );
};
type TMessage = {
  text: string;
  style?: React.CSSProperties;
  highlights?: { substring: string; style: React.CSSProperties }[];
};
type TBGTransition = {
  color: string;
  transitionTime: string;
  backgroundColor: string;
  hoverColor: string;
  hoverBackgroundColor: string;
};
const defaultTransitionForAccept: TBGTransition = {
  color: "primary.main",
  transitionTime: "0.3s",
  backgroundColor: "secondary.contrastText",
  hoverColor: "secondary.contrastText",
  hoverBackgroundColor: "primary.main",
};
const defaultTransitionForReject: TBGTransition = {
  color: "primary.contastText",
  transitionTime: "0.3s",
  backgroundColor: "secondary.contrastText",
  hoverColor: "secondary.contrastText",
  hoverBackgroundColor: "primary.contrastText",
};
export const AcceptRejectDialog = ({
  open,
  acceptFunction,
  rejectFunction,
  closeFunction,
  messages,
  heading,
  acceptText = "Accept",
  rejectText = "Reject",
  acceptButtonStyle,
  rejectButtonStyle,
  varient = "static",
  acceptTransition = defaultTransitionForAccept,
  rejectTransition = defaultTransitionForReject,
}: {
  open: boolean;
  acceptFunction: () => void;
  rejectFunction: () => void;
  closeFunction?: () => void;
  messages: TMessage[];
  heading: string;
  acceptText?: string;
  rejectText?: string;
  acceptButtonStyle?: SxProps<Theme>;
  rejectButtonStyle?: SxProps<Theme>;
  /**
   * @param has a default value of "static"
   */
  varient?: "animated" | "static";
  acceptTransition?: TBGTransition;
  rejectTransition?: TBGTransition;
}) => {
  const renderMessage = (message: TMessage, idx: number) => {
    const { text, style, highlights = [] } = message;

    const styledText = highlights.reduce<(string | JSX.Element)[]>(
      (acc, { substring, style }) => {
        return acc.flatMap((part, index) => {
          if (typeof part === "string") {
            const splitParts = part.split(substring);
            return splitParts.flatMap((splitPart, i) =>
              i < splitParts.length - 1
                ? [
                    splitPart,
                    <span key={`${index}-${i}`} style={style}>
                      {substring}
                    </span>,
                  ]
                : splitPart
            );
          }
          return part;
        });
      },
      [text]
    );

    return (
      <p key={idx} style={style}>
        {styledText}
      </p>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={closeFunction}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontSize: fontSize.large }}>
        {heading}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {messages?.map(renderMessage)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {varient === "static" ? (
          <>
            <Button onClick={rejectFunction} sx={rejectButtonStyle}>
              {rejectText}
            </Button>
            <Button onClick={acceptFunction} autoFocus sx={acceptButtonStyle}>
              {acceptText}
            </Button>
          </>
        ) : (
          <>
            <HoverButton
              text={rejectText}
              transitionTime={rejectTransition.transitionTime}
              color={rejectTransition.color}
              hoverColor={rejectTransition.hoverColor}
              backgroundColor={rejectTransition.backgroundColor}
              hoverBackgroundColor={rejectTransition.hoverBackgroundColor}
              onClick={rejectFunction}
              sx={rejectButtonStyle}
            />
            <HoverButton
              text={acceptText}
              transitionTime={acceptTransition.transitionTime}
              color={acceptTransition.color}
              hoverColor={acceptTransition.hoverColor}
              backgroundColor={acceptTransition.backgroundColor}
              hoverBackgroundColor={acceptTransition.hoverBackgroundColor}
              onClick={acceptFunction}
              sx={acceptButtonStyle}
            />
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Alert do display specifically in dataset create / edit page when a new dataConnection is selected
export const ChangeConnection = ({
  open,
  setOpen,
  setReset,
  heading,
  message,
  onChangeOrAddDataset,
}: ChangeConnectionProps) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={open}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "5px",
          width: "350px",
          height: "auto",
          justifyContent: "center",
        }}
      >
        <div style={{ fontWeight: "bold", textAlign: "center" }}>
          {heading}
          <br />
          <br />
          <p style={{ fontWeight: "normal" }}>{message}</p>
        </div>
        <div
          style={{
            padding: "15px",
            justifyContent: "space-around",
            display: "flex",
          }}
        >
          <Button
            style={{ backgroundColor: "grey", float: "right" }}
            onClick={() => setOpen(false)}
            variant="contained"
          >
            Cancel
          </Button>
          {heading === "RESET DATASET" ? (
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={() => {
                dispatch(resetState());
                setOpen(false);
                setReset(true);
              }}
            >
              Discard
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              onClick={onChangeOrAddDataset}
            >
              Ok
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
};
