// Commonly used notifications / alerts in many components for
// 	- alerting actions of User interactions
// 	- Server success / failure message display

import { Alert, AlertColor, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, PaperProps, SxProps, Theme } from "@mui/material";
import { resetState } from "../../redux/DataSet/datasetActions";
import { useDispatch } from "react-redux";
import { palette } from "../..";

// Simple alert to display for 2-3 seconds after a user action like deleting, adding items, server CallSharp, etc

interface NotificationProps {
  openAlert: boolean;
  severity: AlertColor;
  testMessage: string;
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
type Message = {
  text: string;
  style?: React.CSSProperties;
  highlights?: { substring: string; style: React.CSSProperties }[];
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
}: {
  open: boolean;
  acceptFunction: () => void;
  rejectFunction: () => void;
  closeFunction: () => void;
  messages: Message[];
  heading: string;
  acceptText?: string;
  rejectText?: string;
}) => {
  const renderMessage = (message: Message, idx: number) => {
    const { text, style, highlights = [] } = message;
  
    const styledText = highlights.reduce<(string | JSX.Element)[]>((acc, { substring, style }) => {
      return acc.flatMap((part, index) => {
        if (typeof part === "string") {
          const splitParts = part.split(substring);
          return splitParts.flatMap((splitPart, i) =>
            i < splitParts.length - 1
              ? [splitPart, <span key={`${index}-${i}`} style={style}>{substring}</span>]
              : splitPart
          );
        }
        return part;
      });
    }, [text]);
  
    return <p key={idx} style={style}>{styledText}</p>;
  };
  

  return (
    <Dialog
      open={open}
      onClose={closeFunction}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {heading}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {messages?.map(renderMessage)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={rejectFunction}>{rejectText}</Button>
        <Button onClick={acceptFunction} autoFocus>
          {acceptText}
        </Button>
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
