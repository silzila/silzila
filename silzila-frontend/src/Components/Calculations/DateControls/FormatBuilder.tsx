import {
  Box,
  Button,
  ButtonGroup,
  InputLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
interface IFormatBuilder {
  yearFormat: string;
  monthFormat: string;
  dayFormat: string;
  separator: string[];
  sources: any[];
  updateFormatValue: (idx: number | undefined, value: any,_delete?:boolean) => void;
}
type TDateCategory = "Year" | "Month" | "Day" | "Separator";
const FormatBuilder = ({
  sources,
  separator,
  updateFormatValue,
}: IFormatBuilder) => {
  const [customSeparator, setCustomSeparator] = React.useState(separator);
  const [editMode, setEditMode] = React.useState(false);
  const formatMapping = useMemo(
    () => ({
      Year: [
        {
          label: "2024",
          format: "%Y",
          description: "Year as a numeric, 4-digit value",
        },
        {
          label: "24",
          format: "%y",
          description: "Year as a numeric, 2-digit value",
        },
      ],
      Month: [
        {
          label: "January",
          format: "%M",
          description: "Month name in full (January to December)",
        },
        {
          label: "Jan",
          format: "%b",
          description: "Abbreviated month name (Jan to Dec)",
        },
        {
          label: "1",
          format: "%c",
          description: "Numeric month name (0 to 12)",
        },
        {
          label: "01",
          format: "%m",
          description: "Month name as a numeric value (00 to 12)",
        },
      ],
      Day: [
        {
          label: "01",
          format: "%d",
          description: "Day of the month as a numeric value (01 to 31)",
        },
        {
          label: "1",
          format: "%e",
          description: "Day of the month as a numeric value (0 to 31)",
        },
        {
          label: "1st",
          format: "%D",
          description:
            "Day of the month as a numeric value, followed by suffix (1st, 2nd, 3rd, ...)",
        },
      ],
      Separator: [
        {
          label: "/",
          format: "/",
          description: "Separator is a forward slash",
        },
        {
          label: "-",
          format: "-",
          description: "Separator is a hyphen",
        },
        {
          label: "Custom",
          format: customSeparator,
          description: "Add a custom separator",
        },
      ],
    }),
    [customSeparator]
  );
  let inputFormat = "";
  function getLabelFromFormat(category: TDateCategory, format: string) {
    if (formatMapping[category]) {
      // if(!["%Y", "%y", "%M", "%b", "%c", "%m", "%e", "%d", "%D","/","-"].includes(format)){
      //   const formats=formatMapping.Separator[2].format

      // }
      // else {
      const matchedItem = formatMapping[category].find(
        (item) => item.format === format
      );
      const label = matchedItem ? matchedItem.label : format;
      inputFormat += label ? label : "";
      return label;
      // }
    } else {
      return "Category not found";
    }
  }
  return (
    <Box
      sx={{
        // marginInline: "0.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <Typography textAlign={"left"} color={"gray"}>
        Format Builder
      </Typography>
      <InputLabel
        sx={{
          textAlign: "left",
          marginTop: "0.25rem",
          fontSize: "0.8rem",
          // color: "gray",
        }}
      >
        Year
      </InputLabel>
      <ButtonGroup size="small" aria-label="year button group">
        {formatMapping.Year.map((item) => (
          <Tooltip title={item.description} key={item.label}>
            <Button
              key={item.label}
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                border: "1px solid #999999",
                borderRadius: "0.25rem",
                color: "black",
                height: "1.3rem",
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                  // color: "#999999",
                  border: "1px solid #999999",
                },
              }}
              onClick={() => {
                updateFormatValue(undefined, item.format);
                // setFormat((prev) => prev + item.format);
              }}
            >
              {item.label}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
      <InputLabel
        sx={{
          textAlign: "left",
          marginTop: "0.2rem",
          fontSize: "0.8rem",
          // color: "gray",
        }}
      >
        Month
      </InputLabel>
      <ButtonGroup size="small" aria-label="month button group">
        {formatMapping.Month.map((item) => (
          <Tooltip title={item.description}>
            <Button
              key={item.label}
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                border: "1px solid #999999",
                borderRadius: "0.25rem",
                color: "black",
                height: "1.3rem",
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                  // color: "#999999",
                  border: "1px solid #999999",
                },
              }}
              onClick={() => {
                updateFormatValue(undefined, item.format);
                // setFormat((prev) => prev + item.format);
              }}
            >
              {item.label}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
      <InputLabel
        sx={{
          textAlign: "left",
          marginTop: "0.2rem",
          fontSize: "0.8rem",
          // color: "gray",
        }}
      >
        Day
      </InputLabel>
      <ButtonGroup size="small" aria-label="day button group">
        {formatMapping.Day.map((item) => (
          <Tooltip title={item.description}>
            <Button
              key={item.label}
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                border: "1px solid #999999",
                borderRadius: "0.25rem",
                color: "black",
                height: "1.3rem",
                backgroundColor: "inherit",
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                  // color: "#999999",
                  border: "1px solid #999999",
                },
              }}
              onClick={() => {
                updateFormatValue(undefined, item.format);
                // setFormat((prev) => prev + item.format);
              }}
            >
              {item.label}
            </Button>
          </Tooltip>
        ))}
      </ButtonGroup>
      <InputLabel
        sx={{
          textAlign: "left",
          marginTop: "0.2rem",
          fontSize: "0.8rem",
          // color: "gray",
        }}
      >
        Separator
      </InputLabel>
      <ButtonGroup size="small" aria-label="separator button group">
        {formatMapping.Separator.map((item) => {
          if (item.label === "Custom") {
            return editMode ? (
              <input
                style={{
                  width: "3rem",
                  height: "1.3rem",
                  fontSize: "0.8rem",
                  border: "1px solid #2bb9bb",
                  borderRadius: "0.25rem",
                  textAlign: "center",
                  outline: "none",
                }}
                autoFocus
                type="text"
                onBlur={(e) => {
                  setEditMode(false);
                  setCustomSeparator((prev) => [...prev, e.target.value]);
                  updateFormatValue(undefined, e.target.value);
                }}
              />
            ) : (
              <Tooltip title={item.description}>
                <Button
                  key={item.label}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.8rem",
                    border
                        : "1px solid #999999",
                    borderRadius: "0.25rem",
                    color:"black",
                    height: "1.3rem",
                    backgroundColor: "inherit",
                    "&:hover": {
                      backgroundColor:"#f2f2f2",
                      // color:  "#999999",
                      border:"1px solid #999999",
                    },
                  }}
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  {item.label}
                </Button>
              </Tooltip>
            );
          }
          return (
            <Tooltip title={item.description}>
              <Button
                key={item.label}
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  border: "1px solid #999999",
                  borderRadius: "0.25rem",
                  color: "black",
                  height: "1.3rem",
                  backgroundColor: "inherit",
                  "&:hover": {
                    backgroundColor: "#f2f2f2",
                    // color: "#999999",
                    border: "1px solid #999999",
                  },
                }}
                onClick={() => {
                  updateFormatValue(undefined, item.format);
                  // setFormat((prev) => prev + item.format);
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          );
        })}
      </ButtonGroup>
      <Box
        sx={{
          // marginInline: "0.2rem",
          border: "1px solid #999999",
          width: "95%",
          marginTop: "0.5rem",
          display: "flex",
          flexDirection: "column",
          minHeight: "3rem",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "black",
            marginLeft: "0.2rem",
          }}
        >
          Format
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            maxWidth: "14rem",
            flexWrap: "wrap",
            marginLeft: "0.2rem",
            textAlign: "center",
          }}
        >
          {sources.length > 1 ? (
            <>
              {sources.map(
                (source, idx) =>
                  idx !== 0 &&
                  source !== null &&
                  source !== undefined && (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                        margin: "0.5rem",
                        border: "1px solid #2bb9bb",
                        minWidth: "1.5rem",
                        textAlign: "center",
                        paddingInline: "0.2rem",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          color: "#2bb9bb",
                          fontWeight: "bold",
                        }}
                      >
                        {getLabelFromFormat(
                          ["%Y", "%y"].includes(source)
                            ? "Year"
                            : ["%M", "%b", "%c", "%m"].includes(source)
                            ? "Month"
                            : ["%e", "%d", "%D"].includes(source)
                            ? "Day"
                            : "Separator",
                          source
                        )}
                      </Typography>
                      <button
                        type="button"
                        className="buttonCommon columnClose"
                        onClick={() => {
                          updateFormatValue(idx, source,true);
                        }}
                        title="Remove field"
                      >
                        <CloseRoundedIcon style={{ fontSize: "13px" }} />
                      </button>
                    </Box>
                  )
              )}
            </>
          ) : (
            <div style={{ fontSize: "11px", color: "#999999" ,margin:"auto"}}>
              No format is selected
            </div>
          )}
        </div>
        <div
          style={{ fontSize: "12px", color: "#999999", margin: "0.2rem auto", display:"flex", flexWrap: "wrap", wordBreak: "break-word", overflowWrap: "break-word",}}
        >
          Input format:&nbsp;{inputFormat}
        </div>
      </Box>
    </Box>
  );
};

export default FormatBuilder;
