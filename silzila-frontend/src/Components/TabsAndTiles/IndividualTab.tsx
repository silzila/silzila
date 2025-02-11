// This component returns one single tab within the tabRibbon.
// Each tab has actions to rename the tab & delete the tab

import React, { useState } from "react";
import "./IndividualTab.css";
import { Widgets } from "@mui/icons-material";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";
import ClearIcon from "@mui/icons-material/Clear";

interface IndividualTabProps {
  tabName: string;
  editing: boolean;
  selectedTab: number;
  tabId: number;
  showDash: boolean;
  dashMode: string;
  popupClass?: string;
  inPopup?: boolean;

  selectTab: (tabName: string, tabId: number) => void;
  removeTab: (tabName: string, tabId: number) => void;
  renameTabBegin: (tabId: number) => void;
  renameTabComplete: (renameValue: string, tabId: number) => void;
}

function IndividualTab({
  // props from Parent
  tabName,
  editing,
  selectedTab,
  tabId,
  showDash,
  dashMode,
  popupClass,
  inPopup = false,

  // functions in parent
  selectTab,
  removeTab,
  renameTabBegin,
  renameTabComplete
}: IndividualTabProps) {
  const [renameValue, setRenameValue] = useState<string>(tabName);

  const handleTabNameValue = (e: any) => {
    setRenameValue(e.target.value);
  };

  const tabWidth = inPopup ? "" : tabName.length <= 7 ? "70px" : tabName.length <= 10 ? "100px" : tabName.length >= 10 && tabName.length <= 14 ? "120px" 
   : tabName.length >= 14 && tabName.length <= 16 ? "130px" : "150px";  
 
  if (selectedTab === tabId && editing) {
    return (
      <form
        style={{ display: "inline" }}
        onSubmit={(evt: any) => {
          evt.currentTarget.querySelector("input").blur();
          evt.preventDefault();
        }}
      >
        <input
          autoFocus
          value={renameValue}
          onChange={handleTabNameValue}
          className="editTabSelected"
          onBlur={() => renameTabComplete(renameValue, tabId)}
          title="Press enter or click away to save"
        />
      </form>
    );
  } else {
    return (
      <div
        style={{ 
          width: tabWidth, 
          height: "1.5rem",
          display: "flex",
          alignItems: "center",
          paddingTop: 0,
          overflow: "hidden",
          ...(popupClass ? { paddingLeft: '7px' ,width:'100%'} : {}), }}
        className={`${
          selectedTab === tabId
            ? "commonTab indiItemHighlightTab"
            : "commonTab indiItemTab"
        } ${popupClass}`}
        onDoubleClick={(e) => {
          if (dashMode !== "Present") {
            e.stopPropagation();
            renameTabBegin(tabId);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          setTimeout(() => {
            selectTab(tabName, tabId);
          }, 100);
        }}
        title={`${tabName}. Double click to edit name`}
      >
        <span className="tabText">
          {tabName.length > 20 ? tabName.substring(0, 25) + ".." : tabName}
        </span>
        {dashMode === "Edit" && (
            <ClearIcon
              style={{
                fontSize: "0.75rem",
                right: "5px",
                transform: "none",
                ...(inPopup ? {width:'0.75rem',height:'0.75rem', } : {position:'absolute',top:'0.4rem'}),
              }}
              className={`closeTab ${inPopup?'top-auto':""} ${
                inPopup && selectedTab !== tabId ? "popupClose" : ""
              }
              ${inPopup && selectedTab === tabId ? "hidden" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tabName, tabId);
              }}
              // title="Delete Tab"
            />
        )}
      </div>
    );
  }
}

export default IndividualTab;
