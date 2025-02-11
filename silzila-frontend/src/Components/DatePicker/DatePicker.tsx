
import { TextField } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker  as MUIDatePicker} from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns";

interface IDatePicker {
    value: string;
    onChange: (newValue: Date|null) => void;
}

const DatePicker = ({value,onChange}:IDatePicker) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MUIDatePicker
            format="yyyy-MM-dd"
            value={parseISO(value)}
            onChange={onChange}
            sx={{ outline: "none", border: "none" }}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      height: "1.5rem", // Set a fixed height to match ListItem
                      fontSize: "0.8rem", // Adjust font size if needed
                      outline: "none",
                      border: "none",
                    },
                  }}
                  className="customDatePickerHeight"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove border from the notched outline
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensure no border on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensure no border when focused
                    },
                  }}
                />
              ),
            }}
          />
        </LocalizationProvider>
  )
}
export default DatePicker