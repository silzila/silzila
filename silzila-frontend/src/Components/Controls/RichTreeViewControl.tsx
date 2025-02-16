import React, { useEffect, useRef } from "react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import {
  Menu,
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  createSvgIcon,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

import { ffDialogTitle, ffButtonStyle } from "./muiStyles";

import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { DiDatabase } from "react-icons/di";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import "../allPages.css";

import {
  useTreeItem2,
  UseTreeItem2Parameters,
} from "@mui/x-tree-view/useTreeItem2";
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import { TreeItem2DragAndDropOverlay } from "@mui/x-tree-view/TreeItem2DragAndDropOverlay";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";
import { flattenList } from "../CommonFunctions/CommonFunctions";
import SchemaIcon from "@mui/icons-material/Schema";
import { fontSize, palette } from "../..";
import HoverButton from "../Buttons/HoverButton";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

const RichTreeViewControl = ({
  list,
  title,
  showInPopup,
  directClickedValue,
  currentButtonEvent,
  hasMultipleTitle = false,
  proceedButtonName,
  showControls = true,
  isWarning = false,
  currentWorkspace,
  handleCloseButtonClick,
  handleProceedButtonClick,
  handleDirectClick,
}: any) => {
  const currentWorkspaceRef = useRef<HTMLDivElement | null>(null)
  const sortedList = React.useMemo(() => {
    return [...list].sort((a: any, b: any) => {
      return a.label.localeCompare(b.label);
    });
  }, [list]);
  proceedButtonName = proceedButtonName || "Proceed";
  const [lastSelectedItem, setLastSelectedItem] = React.useState<string | null>(
    null
  );
  const apiRef = useTreeViewApiRef();

  const handleItemSelectionToggle = (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (isSelected) {
      setLastSelectedItem(itemId);
    }
  };

  const handleCurrentButtonClick = (event: any) => {
    let isWorkspace = sortedList.find(
      (item: any) => item.id === currentWorkspace
    );

    if (isWorkspace) {
      apiRef.current!.setItemExpansion(event, currentWorkspace, true);
      apiRef.current!.selectItem({event,itemId: currentWorkspace,keepExistingSelection:false,shouldBeSelected:true})
      currentWorkspaceRef.current?.scrollIntoView({behavior: "smooth", block: "center"})
    } else {
      let parentWorkspace: any = null;
      let current: any = null;

      [...sortedList].forEach((item: any) => {
        if (!current) {
          current = item.children.find(
            (subItem: any) => subItem.id === currentWorkspace
          );

          if (current) {
            parentWorkspace = item;
            return;
          }
        }
      });

      apiRef.current!.setItemExpansion(event, parentWorkspace?.id, true);
      apiRef.current!.selectItem({event,itemId: parentWorkspace?.id,keepExistingSelection:false,shouldBeSelected:true})
      setTimeout(() => {
        apiRef.current!.setItemExpansion(event, currentWorkspace, true);
        apiRef.current!.selectItem({event,itemId: currentWorkspace,keepExistingSelection:false,shouldBeSelected:true})
      }, 300);
    }
  };

  useEffect(() => {
    if (lastSelectedItem && handleDirectClick) {
      handleDirectClick(lastSelectedItem, sortedList);
    }
  }, [lastSelectedItem]);

  useEffect(() => {
    if (directClickedValue !== undefined && directClickedValue !== null) {
      handleCurrentButtonClick(currentButtonEvent);
    }
  }, [directClickedValue]);

  // useEffect(() => {
  //   let dialog = document.querySelector("#treeDialog");

  //   const handleMouseOver = (event:any) => {
  //     apiRef.current!.setItemExpansion(event,'grid', true);
  //   };

  //   // Attach the event listener to the window
  //    dialog?.addEventListener("mouseenter", handleMouseOver);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     dialog?.removeEventListener("mouseover", handleMouseOver);
  //   };

  // }, []);

  type FileType = "dbcon" | "folder" | "dataset" | "flatfile" | "playbook";

  function DotIcon() {
    return (
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "70%",
          bgcolor: "warning.main",
          display: "inline-block",
          verticalAlign: "middle",
          zIndex: 1,
          mx: 1,
        }}
      />
    );
  }

  const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color: theme.palette.grey[400],
    position: "relative",
    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: theme.spacing(3.5),
    },
    ...theme.applyStyles("light", {
      color: theme.palette.grey[800],
    }),
  })) as unknown as typeof TreeItem2Root;

  const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    flexDirection: "row-reverse",
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: 500,
    // fontFamily:'Axiforma Light',
    [`&.Mui-expanded `]: {
      "&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon":
        {
          color: theme.palette.primary.dark,
          ...theme.applyStyles("light", {
            color: "#2bb9bb",
          }),
        },
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        left: "16px",
        top: "44px",
        height: "calc(100% - 48px)",
        width: "1.5px",
        backgroundColor: theme.palette.grey[700],
        ...theme.applyStyles("light", {
          backgroundColor: theme.palette.grey[300],
        }),
      },
    },
    "&:hover": {
      backgroundColor: alpha("#2bb9bb", 0.1),
      color: "white",
      ...theme.applyStyles("light", {
        color: "#2bb9bb",
      }),
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      ...theme.applyStyles("light", {
        backgroundColor: "#2bb9bb",
      }),
    },
  }));

  const AnimatedCollapse = animated(Collapse);

  function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
      },
    });

    return <AnimatedCollapse style={style} {...props} />;
  }

  const StyledTreeItemLabelText = styled(Typography)({
    color: "inherit",
    fontFamily: "General Sans",
    fontWeight: 500,
  }) as unknown as typeof Typography;

  interface CustomLabelProps {
    itemId: string;
    children: React.ReactNode;
    icon?: React.ElementType;
    expandable?: boolean;
  }

  function CustomLabel({
    itemId,
    icon: Icon,
    expandable,
    children,
    ...other
  }: CustomLabelProps) {
    return (
      <TreeItem2Label
        ref={currentWorkspace === itemId ? currentWorkspaceRef: null}
        {...other}
        sx={{
          display: "flex",
          alignItems: "center",
          "&:hover .labelIcon": {
            color: palette.primary.main,
          },
          ".Mui-selected &:hover .labelIcon": {
            color: "white",
          },
        }}
      >
        {Icon && (
          <Box
            component={Icon}
            className="labelIcon"
            color="inherit"
            sx={{
              mr: 1,
              fontSize: "1.5rem",
              color: "gray",
              ".Mui-selected &": {
                color: "white",
              },
              ".Mui-selected &:hover": {
                color: "white",
              },
            }}
          />
        )}
        <StyledTreeItemLabelText
          variant="body2"
          sx={{
            fontFamily: "Roboto-Regular",
            fontSize: fontSize.medium,
            color: "primary.contrastText",
            lineHeight: "normal",
            ".Mui-selected &": {
              color: "white",
            },
          }}
        >
          {children}
        </StyledTreeItemLabelText>
        {expandable && <DotIcon />}
      </TreeItem2Label>
    );
  }
  const workspaceFolderWork = createSvgIcon(
    <svg width="89" height="72" viewBox="0 0 89 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M71.7145 67L6.97222 67" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M71.7145 67L6.97222 67" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M73 33H22.9088" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M73 33H22.9088" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.7106 16L37.8494 16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.7106 16L37.8494 16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M29.881 6L5.97621 6" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M29.881 6L5.97621 6" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M5.9762 66L5.9762 6" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M5.9762 66L5.9762 6" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.7106 30V16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.7106 30V16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M7.96826 62L21.9127 33" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M7.96826 62L21.9127 33" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M37.8493 16L30.8771 7.00001" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M37.8493 16L30.8771 7.00001" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.1044 66.7376L83.3408 41.3385C85.1132 37.3322 82.1337 32.8387 77.7534 32.912L72.5 32.9999" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    <path d="M72.1044 66.7376L83.3408 41.3385C85.1132 37.3322 82.1337 32.8387 77.7534 32.912L72.5 32.9999" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
    </svg>,"folderWork"
  )
  const customDatasetIcon = createSvgIcon(
    <svg
      width="90"
      height="100"
      viewBox="0 0 90 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="9"
        width="30"
        height="28"
        stroke="currentColor"
        stroke-width="6"
      />
      <rect
        x="10.9706"
        y="15.7727"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="10.9706"
        y="25.0454"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="5"
        y="65"
        width="30"
        height="28"
        stroke="currentColor"
        stroke-width="6"
      />
      <rect
        x="10.9706"
        y="71.7727"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="10.9706"
        y="81.0454"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="55"
        y="37"
        width="30"
        height="28"
        stroke="currentColor"
        stroke-width="6"
      />
      <rect
        x="60.9706"
        y="43.7727"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="60.9706"
        y="53.0454"
        width="18.0588"
        height="5.18182"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="38.5"
        y="19.5"
        width="29"
        height="3"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="38.5"
        y="78.5"
        width="34"
        height="3"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="68.5"
        y="33.5"
        width="14"
        height="3"
        transform="rotate(-90 68.5 33.5)"
        fill="currentColor"
        stroke="currentColor"
      />
      <rect
        x="69.5"
        y="77.5"
        width="9"
        height="3"
        transform="rotate(-90 69.5 77.5)"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>,
    "DatasetIcon"
  );
  const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };
  const playbookIcon = createSvgIcon(
    <svg
      width="94"
      height="89"
      viewBox="0 0 94 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M31 39V50"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M55 67L56.9101 77.8329"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="square"
      />
      <path
        d="M39.9101 68L38 78.8329"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="square"
      />
      <path
        d="M47 31V50"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M64 80H31"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M64 22V50"
        stroke="currentColor"
        stroke-width="8"
        stroke-linecap="round"
      />
      <mask id="path-7-inside-1_22_22" fill="white">
        <rect x="3" y="5" width="88" height="61" rx="7" />
      </mask>
      <rect
        x="3"
        y="5"
        width="88"
        height="61"
        rx="7"
        stroke="currentColor"
        stroke-width="16"
        mask="url(#path-7-inside-1_22_22)"
      />
    </svg>,
    "Playbook"
  );
  const getIconFromFileType = (fileType: FileType) => {
    switch (fileType) {
      case "folder":
        return workspaceFolderWork;
      case "dbcon":
        return DiDatabase;
      case "dataset":
        return customDatasetIcon;
      case "flatfile":
        return SchemaIcon;
      case "playbook":
        return playbookIcon;
      default:
        return workspaceFolderWork;
    }
  };

  interface CustomTreeItemProps
    extends Omit<UseTreeItem2Parameters, "rootRef">,
      Omit<React.HTMLAttributes<HTMLLIElement>, "onFocus"> {}

  const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>
  ) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
      getRootProps,
      getContentProps,
      getIconContainerProps,
      getCheckboxProps,
      getLabelProps,
      getGroupTransitionProps,
      getDragAndDropOverlayProps,
      status,
      publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    // if (expandable) {
    //   icon = FolderRounded;
    // } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
    // }

    return (
      <TreeItem2Provider itemId={itemId}>
        <StyledTreeItemRoot {...getRootProps(other)}>
          <CustomTreeItemContent
            {...getContentProps({
              className: clsx("content", {
                "Mui-expanded": status.expanded,
                "Mui-selected": status.selected,
                "Mui-focused": status.focused,
                "Mui-disabled": status.disabled,
              }),
            })}
          >
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
            <TreeItem2Checkbox {...getCheckboxProps()} />
            <CustomLabel
              {...getLabelProps({
                icon,
                itemId,
                expandable: expandable && status.expanded,
              })}
            />
            <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
          </CustomTreeItemContent>
          {children && <TransitionComponent {...getGroupTransitionProps()} />}
        </StyledTreeItemRoot>
      </TreeItem2Provider>
    );
  });
  return (
    <div id="treeDialog">
      {showInPopup ? (
        <Dialog
          id="basic-menu"
          className="geoHelpTable"
          open={showInPopup}
          PaperProps={{
            sx: {
              minHeight: "20%",
              maxWidth: "30rem",
            },
          }}
        >
          <DialogTitle
            sx={{
              ...ffDialogTitle,
              background: isWarning ? "orange" : "#424242",
            }}
          >
            <div>
              {hasMultipleTitle ? (
                title.map((t: string, index: number) => (
                  <React.Fragment key={index}>
                    <b style={{ color: "white" }}>{t}</b>
                    <br />
                  </React.Fragment>
                ))
              ) : (
                <b style={{ color: "white" }}>{title}</b>
              )}
            </div>

            <CloseOutlined
              onClick={handleCloseButtonClick}
              style={{ float: "right", color: "white", alignSelf: "center" }}
            />
          </DialogTitle>
          <DialogContent
            sx={{
              width: "30rem",
              height: "25rem",
              overflowY: "auto",
              paddingRight: "0.6rem",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {sortedList && sortedList.length > 0 ? (
            <RichTreeView
              apiRef={apiRef}
              items={sortedList}
              onItemSelectionToggle={handleItemSelectionToggle}
              sx={{
                minHeight:'15rem',
                height: "fit-content",
                flexGrow: 1,
                // maxWidth: 400,
                overflowY: "auto",
                fontSize: fontSize.medium,
              }}
              slots={{ item: CustomTreeItem }}
            />
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}>
                <Typography
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    textAlign: "center",
                    fontSize: fontSize.large,
                    paddingBottom: "3.5rem"
                  }}
                >
                  {title === "Select a DB Connection"
                    ? "Create a DB connection first before creating a dataset"
                    : (
                      <>
                        Seems you don't have any dataset available.<br />
                        Please create a dataset first to explore the data in playbook.
                      </>
                    )}
                </Typography>
            </div>
            )
          }
          </DialogContent>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              fontSize: fontSize.medium,
              columnGap: "1rem",
              paddingRight: "1rem",
              paddingBottom: "1rem",
              paddingTop: "1rem",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "space-between",
              fontSize: fontSize.medium,
              columnGap: "1rem",
              padding: "1rem 1rem",
              paddingRight: "0.6rem",
            }}
          >
            {currentWorkspace && currentWorkspace !== "" && (
              // <Button
              //   onClick={handleCurrentButtonClick}
              //   sx={{
              //     ...ffButtonStyle,
              //     fontSize: fontSize.medium,
              //     color: "#af98db",
              //     marginRight: "auto",
              //     marginLeft: "1rem",
              //     lineHeight: "normal",
              //     border: "2px solid #af98db",
              //     "&:hover": { backgroundColor: "#af98db", color: "white" },
              //   }}
              //   // sx={{  }}
              // >
              //   Current Workspace
              // </Button>
              <HoverButton
                text="Current Workspace"
                color="secondary.light"
                hoverColor="secondary.contrastText"
                backgroundColor="secondary.contastText"
                hoverBackgroundColor="secondary.light"
                sx={{
                  ...ffButtonStyle,
                  marginLeft: "1rem",
                  border: `1px solid ${palette.secondary.light}`,
                  fontSize: fontSize.medium,
                  lineHeight: "normal",
                }}
                transitionTime="0.2s"
                onClick={handleCurrentButtonClick}
                disabled = {sortedList.length === 0}
              />
            )}
            {showControls ? (
              <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                {/* <Button
                  onClick={handleCloseButtonClick}
                  sx={{
                    ...ffButtonStyle,
                    border: "2px solid grey",
                    color: "grey",
                    fontSize: fontSize.medium,
                    lineHeight: "normal",
                    "&:hover": { backgroundColor: "grey", color: "white" },
                  }}
                  style={{ marginRight: "1rem" }}
                >
                  Cancel
                </Button> */}
                <HoverButton
                  onClick={handleCloseButtonClick}
                  sx={{
                    ...ffButtonStyle,
                    border: `1px solid ${palette.primary.contrastText}`,
                    fontSize: fontSize.medium,
                    lineHeight: "normal",
                    marginRight: "1rem",
                  }}
                  text="Cancel"
                  hoverColor="secondary.contrastText"
                  color="primary.contrastText"
                  hoverBackgroundColor="primary.contrastText"
                  backgroundColor="secondary.contrastText"
                  transitionTime="0.2s"
                />
                {/* <Button
                  onClick={(e) =>
                    handleProceedButtonClick(lastSelectedItem, sortedList)
                  }
                  sx={{
                    ...ffButtonStyle,
                    border: "2px solid #2bb9bb",
                    fontSize: fontSize.medium,
                    color: "#2bb9bb",
                    lineHeight:'normal',
                    "&:hover": {
                      backgroundColor: "#2bb9bb",
                      color: "white",
                    },
                  }}
                >
                  {proceedButtonName}
                </Button> */}
                <HoverButton
                  onClick={(e) =>
                    handleProceedButtonClick(lastSelectedItem, sortedList)
                  }
                  text={proceedButtonName}
                  color="primary.main"
                  hoverColor="secondary.contrastText"
                  backgroundColor="secondary.contrastText"
                  hoverBackgroundColor="primary.main"
                  transitionTime="0.2s"
                  sx={{
                    ...ffButtonStyle,
                    border: `1px solid ${palette.primary.main}`,
                    fontSize: fontSize.medium,
                    lineHeight: "normal",
                  }}
                  disabled = {sortedList.length === 0}
                />
              </div>
            ) : null}
          </div>
        </Dialog>
      ) : (
        <RichTreeView
          apiRef={apiRef}
          onItemSelectionToggle={handleItemSelectionToggle}
          items={sortedList}
          sx={{
            minHeight:'15rem',
            height: "fit-content",
            flexGrow: 1,
            maxWidth: 400,
            overflowY: "auto",
          }}
          slots={{ item: CustomTreeItem }}
        />
      )}
    </div>
  );
};

export default RichTreeViewControl;
