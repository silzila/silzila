import * as ColorFormat from "./ConditionalColorFormat";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import debounce from "lodash.debounce";
import ShowDataPopup from "../../ChartOptions/ShowDataPopup";
import * as CrossTab from "./CrossTab";

export const BuildTable = ({
  crossTabData,
  dustbinRows,
  dustbinValues,
  dustbinColumns,
  chartPropData,
  chartProperties,
  propKey,
  chartControls,
  graphDimension,
}: any) => {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  const tableRef = useRef<HTMLTableElement>(null);

  useLayoutEffect(() => {
    // Get the widths of the columns after the table has rendered
    if (tableRef.current) {
      const thElements = tableRef.current.querySelectorAll("th"); // For all <th> elements

      const widths = Array.from(thElements).map(
        (th) => th.getBoundingClientRect().width
      );

      setColumnWidths(widths);
    }
  }, [crossTabData]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState({});

  const [userClickedCell, serUserClickedCell] = useState(
    chartProperties.properties[propKey].crossTabUserClicked
  );

  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = userClickedCell;
  });

  /* Construct cell data to show on popup */
  const _mouseEnterHandler = (e: any) => {
    let _compareObj = JSON.parse(e.target.getAttribute("data-compareobj"));

    if (
      !(
        Object.keys(_compareObj).length === 0 &&
        _compareObj.constructor === Object
      )
    ) {
      setPopupData({
        data: _compareObj,
        rect: e.target.getClientRects()[0],
        remove: null,
        style: null,
      });
      setShowPopup(true);
    }
  };

  const _hideCellDataPopup = () => {
    setShowPopup(false);
  };

  const debouncedMouseEnterHandler = useMemo(
    () => debounce(_mouseEnterHandler.bind(this), 300),
    []
  );

  const debouncedMouseLeaveHandler = useMemo(
    () => debounce(_hideCellDataPopup.bind(this), 300),
    []
  );

  /*  TODO:: Feature to change color of Row/Column cells on header cell click */
  const _getUserClickedColor = (
    col: any,
    rowIndex: number,
    colIndex: number
  ) => {
    let _className = "";

    if (
      userClickedCell &&
      userClickedCell.id &&
      userClickedCell.compare &&
      col &&
      col.displayData !== undefined &&
      col.displayData !== null &&
      col.displayData !== ""
    ) {
      ////TODO:: Need a generic function to check null. i.e. col.displayData

      let _userCellCompareJSON = {}; //// JSON.parse(userClickedCell.compare);
      let _idArray = userClickedCell.id.split("_");
      let _cellData = crossTabData[_idArray[0]].columnItems[_idArray[1]];
      _userCellCompareJSON = _cellData?.compareObj;

      if (Object.keys(_userCellCompareJSON).length > 0) {
        if (_idArray[2] === "true") {
          _className = "UserClickedCellRemainingChildren";

          if (_idArray[0] < dustbinColumns.length + 1) {
            if (colIndex >= dustbinRows.length) {
              return CrossTab.getUserClickedClassNameForColor(
                chartPropData,
                col,
                _userCellCompareJSON
              );
            }
          } else if (_idArray[1] < dustbinRows.length) {
            if (col.rowSpan > 1) {
              return CrossTab.getUserClickedClassNameForColor(
                chartPropData,
                col,
                _userCellCompareJSON
              );
            } else {
              if (rowIndex === _idArray[0]) {
                return "UserClickedCellChildren";
              }
            }
          } else {
            if (colIndex === _idArray[1]) {
              return "UserClickedCellChildren";
            }
          }
        } else {
          if (dustbinValues.length > 1) {
          } else {
          }
        }
      }
    } else {
    }
    return _className;
  };

  /*  Adding class to both Row & Column headers */
  const _getHeaderClassName = (
    col: any,
    rowIndex: number,
    colIndex: number
  ) => {
    let _header = "";

    _header =
      rowIndex < dustbinColumns.length
        ? "CrossTabHeader "
        : "CrossTabLeftColumnHeader";

    if (chartProperties.properties[propKey].chartType === "table") {
      _header = "TableHeader";
    }

    return col.displayData
      ? _header + _getUserClickedColor(col, rowIndex, colIndex)
      : "EmptyHeaderCell";
  };

  /*  Construct table header and cell with data */
  const GetTableContent = (
    crossTabData: any,
    col: any,
    rowIndex: number,
    colIndex: number
  ) => {
    if (col.isHeaderField && !col.skip) {
      let tdStyle: any = ColorFormat.setCellColor(
        true,
        crossTabData,
        colIndex,
        rowIndex,
        col.displayData,
        chartProperties,
        propKey,
        chartControls
      );

      const topPosition =
        rowIndex *
          chartControls.properties[propKey].crossTabHeaderLabelOptions
            .fontSize *
          1.01 *
          chartControls.properties[propKey].crossTabStyleOptions.lineHeight -
        // rowIndex *
        //   chartControls.properties[propKey].crossTabStyleOptions.borderWidth -
        chartControls.properties[propKey].crossTabStyleOptions.borderWidth;

      let leftPosition = columnWidths[colIndex - 1];
      for (let ind = 2; ind <= colIndex; ind++) {
        leftPosition += columnWidths[colIndex - ind];
      }

      return (
        /*  Construct header area */
        <th
          id={rowIndex + "_" + colIndex + "_" + col.isHeaderField}
          className={_getHeaderClassName(col, rowIndex, colIndex)}
          data-compareobj={JSON.stringify(col.compareObj)}
          key={colIndex}
          colSpan={col.columnSpan}
          rowSpan={col.rowSpan}
          style={{
            ...tdStyle,
            position: "sticky",

            top:
              rowIndex < 1 + dustbinColumns.length
                ? `${topPosition}px`
                : "auto", // Fix for OverflowX
            left:
              colIndex < dustbinRows.length
                ? (leftPosition || 0) -
                  (colIndex + 1) *
                    chartControls.properties[propKey].crossTabStyleOptions
                      .borderWidth
                : "auto", // Fix for OverflowY
            zIndex:
              rowIndex < 1 + dustbinColumns.length &&
              colIndex < dustbinRows.length
                ? 3
                : rowIndex < 1 + dustbinColumns.length
                ? 2
                : colIndex === 0
                ? 1
                : 0, // Ensure headers are above other content
            backgroundColor:
              chartProperties?.properties[propKey]?.chartType === "table"
                ? "#fff"
                : "auto", // Ensure the background stays solid
          }}
        >
          {col.displayData}
        </th>
      );
    } else {
      if (!col.skip) {
        let tdStyle: any = ColorFormat.setCellColor(
          false,
          crossTabData,
          colIndex,
          rowIndex,
          col.displayData,
          chartProperties,
          propKey,
          chartControls
        );

        return (
          /*  Construct table body area */
          <td
            id={rowIndex + "_" + colIndex + "_" + col.isHeaderField}
            className={
              "CrossTabCell " + _getUserClickedColor(col, rowIndex, colIndex)
            }
            key={colIndex}
            style={{
              ...tdStyle,
              position: colIndex === 0 ? "sticky" : "auto",
              left: colIndex === 0 ? 0 : "auto",
              zIndex: colIndex < dustbinRows.length ? 1 : 0,
            }}
            colSpan={col.columnSpan}
            rowSpan={col.rowSpan}
            data-compareobj={JSON.stringify(col.compareObj)}
            onMouseEnter={(e) => {
              if (chartControls.properties[propKey].mouseOver.enable) {
                e.persist();
                debouncedMouseEnterHandler(e);
              }
            }}
            onMouseLeave={(e: any) => {
              e.persist();
              debouncedMouseLeaveHandler();
            }}
          >
            {col.displayData}
          </td>
        );
      } else {
        return null;
      }
    }
  };

  let _tableContent = [];

  /*  Construct cross tab chart table  rows */
  if (crossTabData.length > 0) {
    _tableContent = crossTabData.map((row: any, rowIndex: number) => {
      let _rowContent = [];
      _rowContent.push(
        row.columnItems.map((col: any, colIndex: number) => {
          return GetTableContent(crossTabData, col, rowIndex, colIndex);
        })
      );

      return (
        <tr
          className="CrossTabRow"
          style={{
            lineHeight:
              chartControls.properties[propKey].crossTabStyleOptions.lineHeight,
            zIndex: 0,
          }}
          key={rowIndex}
        >
          {_rowContent}
        </tr>
      );
    });
  }

  /*  Render table and show popup */
  return (
    <div className="CrossTab">
      <div
        style={{
          maxHeight: graphDimension.height,
          maxWidth: graphDimension.width,
          overflowY: "auto",
          // overflowX: "hidden",
        }}
      >
        <table
          ref={tableRef}
          className="CrossTabTable"
          style={{
            borderWidth:
              chartControls.properties[propKey].crossTabStyleOptions
                .borderWidth,
            borderCollapse: "collapse",
          }}
        >
          {_tableContent}
        </table>
      </div>
      {showPopup ? (
        <ShowDataPopup
          chartProp={chartControls.properties[propKey]}
          show={showPopup}
          {...popupData}
        ></ShowDataPopup>
      ) : null}
    </div>
  );
};
