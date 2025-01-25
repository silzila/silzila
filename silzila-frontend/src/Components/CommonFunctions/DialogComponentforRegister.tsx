import { Alert, Dialog } from "@mui/material";
import React from "react";

interface NotificationDialogRegisterProps {
  openAlert: boolean;
  severity: "error" | "warning" | "info" | "success";
  testMessage: string;
  onCloseAlert?: () => void;
}

const NotificationDialogRegister = ({
  openAlert,
  severity,
  testMessage,
  onCloseAlert,
}: NotificationDialogRegisterProps) => {
  console.log("NotificationDialogRegister", openAlert);
  return (
    <Dialog
      open={openAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Alert style={{ padding: "30px" }} severity={severity}>
        {testMessage}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onCloseAlert}
            style={{
              padding: "8px 30px",
              marginRight: "30px",
              border: "1px solid transparent",
              backgroundColor: "#2bb9bb",
              fontSize: "13px",
              color: "white",
              fontWeight: "800",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.0)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </div>
      </Alert>
    </Dialog>
  );
};

export default NotificationDialogRegister;

