import { Snackbar } from "@mui/material";

const SnackBar = ({ show,message ,onClose}: { show: boolean ,message:string,onClose:(val:any)=>void}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={show}
      message={message}
      key={"topcenter"}
      sx={{
        ".MuiSnackbarContent-root": { backgroundColor: "rgb(255, 244, 229)", height: "3rem",color:"primary.contrastText" },
      }}
      autoHideDuration={2000}
      onClose={onClose}
    />
  );
};

export default SnackBar;
