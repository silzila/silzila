import { Alert, AlertColor, Dialog } from "@mui/material";


// Simple alert to display for 2-3 seconds after a user action like deleting, adding items, server CallSharp, etc

interface NotificationProps {
	openAlert: boolean;
	severity: AlertColor;
	testMessage: string;
	onCloseAlert?: () => void;
}

const DatabaseConnectionDialogComponents = ({
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
                sx={{marginLeft:'16.5rem'}}
			>
				<Alert style={{ padding: "30px" }} severity={severity} sx={{
            color: severity === 'success' ? '#2bb9bb' : undefined, // Custom text color for success
            '& .MuiAlert-icon': {
              color: severity === 'success' ? '#2bb9bb' : undefined, // Custom icon color for success
            },
          }}>
					{testMessage}
				</Alert>
			</Dialog>
    </>
  )
}

export default DatabaseConnectionDialogComponents;