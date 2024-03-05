// This component returns one single tab within the tabRibbon.
// Each tab has actions to rename the tab & delete the tab

import React, { useState } from "react";
import "./IndividualTab.css";

interface IndividualTabProps {
  tabName: string;
  editing: boolean;
  selectedTab: number;
  tabId: number;
  showDash: boolean;
  dashMode: string;

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
      <span
        className={
          selectedTab === tabId
            ? "commonTab indiItemHighlightTab"
            : "commonTab indiItemTab"
        }
        onDoubleClick={(e) => {
          if (dashMode !== "Present") {
            e.stopPropagation();
            renameTabBegin(tabId);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectTab(tabName, tabId);
        }}
        title={`${tabName}. Double click to edit name`}
      >
        <span className="tabText">
          {tabName.length > 20 ? tabName.substring(0, 15) + ".." : tabName}
        </span>

        {/* If dashboard is in presentation mode, the 'X'(close tab icon) will disappear */}

        <span
          title="Delete Tab"
          className="closeTab"
          onClick={(e) => {
            e.stopPropagation();
            removeTab(tabName, tabId);
          }}
          style={
            dashMode !== "Present"
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          X
        </span>
      </span>
    );
  }
}

export default IndividualTab;
