import React, { useRef, useState } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Select, MenuItem } from "@mui/material";
import { fontSize, palette } from "../../..";

interface SourceListCardProps {
  displayName: string;
  aggregationMethod: string;
  index: number;
  value: any;
  isAggregationActive: boolean;
  propKey: string;
  calculationFlowUID: string;

  moveCard: (dragIndex: number, hoverIndex: number) => void;
  handleSourceCardCrossButton: (sourceId: string, sourceIndex: number) => void;
  updateAggregation: (
    propKey: string,
    calculationFlowUID: string,
    step: number,
    sourceIndex: number,
    newAggregation: string
  ) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

// const sourceListDownArrowOptions = [
//     'Sum',
//     'Avg',
//     'Min',
//     'Max',
//     'Count',
//     'Count Non Null',
//     'Count Null',
//     'Count Unique'
// ]

export const sourceListDownArrowOptions = [
  { displayName: "sum", value: "sum" },
  { displayName: "avg", value: "avg" },
  { displayName: "min", value: "min" },
  { displayName: "max", value: "max" },
  { displayName: "count", value: "count" },
  { displayName: "count Non Null", value: "countnn" },
  { displayName: "count Null", value: "countn" },
  { displayName: "count Unique", value: "countu" },
];

const SourceListCard: React.FC<SourceListCardProps> = ({
  displayName,
  aggregationMethod,
  index,
  isAggregationActive,
  propKey,
  calculationFlowUID,
  moveCard,
  value,
  handleSourceCardCrossButton,
  updateAggregation,
}) => {
  const [sourceCardHoverActive, setSourceCardHoverActive] = useState(false);
  const [isDownArrowActive, setIsDownArrowActive] = useState(false);
  const [selectedDisplayName, setSelectedDisplayName] = React.useState("sum");

  const ref = useRef<HTMLDivElement>(null);

  // introduce step
  const handleSourceAggregationUpdate = (
    sourceIndex: number,
    newAggregation: string
  ) =>
    updateAggregation(
      propKey,
      calculationFlowUID,
      0,
      sourceIndex,
      newAggregation
    );

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: "source-card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    unknown,
    { isDragging: boolean }
  >({
    type: "source-card",
    item: (): DragItem => {
      return { id: value, index, type: "source-card" };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onMouseEnter={() => setSourceCardHoverActive(true)}
      onMouseLeave={() => setSourceCardHoverActive(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: isDragging ? 0 : 1,
        cursor: "move",
        position: "relative",
        border: "1px solid rgb(211, 211, 211)",
        borderRadius: "2px",
        margin: "4px",
        fontSize: fontSize.medium,
        padding: "4px",
        height: "24px",
      }}
      data-handler-id={handlerId}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          userSelect: "none",
        }}
      >
        <button
          type="button"
          className="buttonCommon columnClose"
          title="Remove field"
          onClick={() => handleSourceCardCrossButton(value, index)}
          style={{ width: "13px", height: "13px" }}
        >
          <CloseRoundedIcon
            style={{
              fontSize: "13px",
              display: sourceCardHoverActive ? "block" : "none",
            }}
          />
        </button>
        <span style={{ margin: 0, userSelect: "none", alignContent: "center" }}>
          {displayName}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {isAggregationActive && (
          <span style={{ userSelect: "none" }}>
            {isAggregationActive ? aggregationMethod : ""}
          </span>
        )}
        {isAggregationActive && (
          <Select
            size="small"
            sx={{
              backgroundColor: "white",
              cursor: "auto",
              border: "none",
              outline: "none",
              ".MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              boxShadow: "none",
              padding: "0",
              ".MuiSelect-select": {
                padding: "2px 28px", 
              },
              ".MuiSelect-select.MuiInputBase-input": {
                paddingRight: "0", 
              },
            }}
          >
            {sourceListDownArrowOptions.map((item, id) => {
              return (
                <MenuItem
                  sx={{
                    listStyle: "none",
                    cursor: "pointer",
                    color: "black",
                    backgroundColor:
                      selectedDisplayName === item.displayName
                        ? "rgba(43, 185, 187, 0.5) !important"
                        : "white !important",
                    "&:hover": {
                      backgroundColor: "rgba(43, 185, 187, 0.3) !important",
                    },
                  }}
                  key={id}
                  title="Window Function"
                  onClick={() => {
                    setIsDownArrowActive(false);
                    setSelectedDisplayName(item.displayName);
                    handleSourceAggregationUpdate(index, item.value);
                    console.log(item.displayName);
                  }}
                >
                  {item.displayName}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </div>
    </div>
  );
};

export default SourceListCard;
