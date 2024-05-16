// This component returns one single tab within the tabRibbon.
// Each tab has actions to rename the tab & delete the tab

import React, { useState } from "react";
import "./IndividualTab.css";
import { Widgets } from "@mui/icons-material";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";

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
  const tabWidth = inPopup ? "" : tabName.length > 10 ? "180px" : "70px";

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
      <span style={{ width: tabWidth }}
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

        <div className={!inPopup ? "close-container" : ""}>
        <span style={{ backgroundColor: "transparent" }}
          title="Delete Tab"
          className={`closeTab ${inPopup && selectedTab !== tabId ? "popupClose" : ""}
          ${inPopup && selectedTab === tabId ? "hidden" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            removeTab(tabName, tabId);
          }}
        >
          X
        </span>
        </div>
      </span>
    );
  }
}

export default IndividualTab;
