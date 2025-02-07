import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
//import useSWR from "swr";
import styles from "./subworkspace.module.css";
import "./allPages.css";
import { useParams } from "react-router-dom";
import { AlertColor, createSvgIcon, Tooltip, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";
import FetchData from "./ServerCall/FetchData";
import {
  ConvertListOfListToDataConnectionRichTreeViewList,
  isNameAllowed,
} from "./CommonFunctions/CommonFunctions";
import RichTreeViewControl from "./Controls/RichTreeViewControl";
import DatabaseConnectionDialogComponents from "./DataConnection/DatabaseConnectionDialogComponents";
import { serverEndPoint } from "./ServerCall/EnvironmentVariables";
import { fontSize, palette } from "..";
import { PopUpSpinner } from "./CommonFunctions/DialogComponents";
import { Console } from "node:console";
import { useDispatch } from "react-redux";
import { setWorkspaceContents } from "../redux/Permissions/permissions.action";
import { useSelector } from "react-redux";
import { IPermission } from "../redux/Permissions/types";
import { RootState } from "../redux";
import { messages } from "./CommonFunctions/aliases";

// import SchemaIcon from '@mui/icons-material/Schema';
// const SchemaIcon = createSvgIcon(
//   <svg
//     width="100"
//     height="100"
//     viewBox="0 0 100 100"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <rect
//       x="6"
//       y="7"
//       width="30"
//       height="29"
//       stroke="#787878"
//       stroke-width="4"
//     />
//     <rect
//       x="10.5"
//       y="14.5"
//       width="19"
//       height="3"
//       fill="#808080"
//       stroke="#787878"
//     />
//     <path d="M38.5 20.5H80.5V21.5H38.5V20.5Z" fill="#808080" stroke="#787878" />
//     <path d="M37.5 79.5H80.5V80.5H37.5V79.5Z" fill="#808080" stroke="#787878" />
//     <rect
//       x="79.5"
//       y="32.5"
//       width="10"
//       height="1"
//       transform="rotate(-90 79.5 32.5)"
//       fill="#808080"
//       stroke="#787878"
//     />
//     <path
//       d="M79.5 66.5H80.5V78.5H79.5V69.7143V66.5Z"
//       fill="#808080"
//       stroke="#787878"
//     />
//     <path d="M10.5 24.5H29.5V27.5H10.5V24.5Z" fill="#808080" stroke="#787878" />
//     <rect
//       x="6"
//       y="66"
//       width="30"
//       height="29"
//       stroke="#787878"
//       stroke-width="4"
//     />
//     <rect
//       x="11.5"
//       y="74.5"
//       width="19"
//       height="3"
//       fill="#808080"
//       stroke="#787878"
//     />
//     <path d="M11.5 84.5H30.5V87.5H11.5V84.5Z" fill="#808080" stroke="#787878" />
//     <rect
//       x="64"
//       y="35"
//       width="30"
//       height="29"
//       stroke="#787878"
//       stroke-width="4"
//     />
//     <rect
//       x="69.5"
//       y="43.5"
//       width="19"
//       height="3"
//       fill="#808080"
//       stroke="#787878"
//     />
//     <path d="M69.5 53.5H88.5V56.5H69.5V53.5Z" fill="#808080" stroke="#787878" />
//   </svg>,
//   "Schema"
// );

const SubWorkspace = () => {
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editWorkspaceId, setEditWorkspaceId] = useState(null);
  const [selectedWorkSpaceItem, setSelectedWorkSpaceItem] = useState<any>({});
  const [modalType, setModalType] = useState("");
  const { parentId } = useParams();
  const [parentWorkspaceName, setParentWorkspaceName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const id_parent = null;
  const [mode] = useState("New");
  const [selectedSubworkspaces, setSelectedSubworkspaces] = useState<string[]>(
    []
  );
  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showDependencyPopup, setShowDependencyPopup] = useState(false);
  const [dependencyData, setDependencyData] = useState<Array<Object>>([]);
  const [filterOptions, setFilterOptions] = useState({
    "sub-workspace": false,
    playbook: false,
    flatfile: false,
    dataset: false,
    dbconnection: false,
  });
  const [tooltipText, setTooltipText] = useState("Filter Contents");
  const [selectedIconSrc, setSelectedIconSrc] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [placeholder, setPlaceholder] = useState("Search All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  }); // state for sorting

  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showContentDeleteConfirmation, setShowContentDeleteConfirmation] =
    useState(false);
  const [selectedContent, setSelectedContent] = useState<any>({});

  const [IndexToDelete, setIndexToDelete] = useState(null);
  const [showDatasetOptions, setShowDatasetOptions] = useState(false);

  const [severity, setSeverity] = useState<AlertColor>("success");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("Testing alert");

  const [subWorkspaces, setSubWorkspaces] = useState<any[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [hideNewIcon, setHideNewIcon] = useState<boolean>(false);
  const [disableNewWorkspace, setDisableNewWorkspace] =
    useState<boolean>(false);
  const [disableNewFlatfile, setDisableNewFlatfile] = useState<boolean>(false);
  const [disableNewDBConnection, setDisableNewDBConnection] =
    useState<boolean>(false);
  const [disableNewDataset, setDisableNewDataset] = useState<boolean>(false);
  const [disableNewPlaybook, setDisableNewPlaybook] = useState<boolean>(false);
  const dispatch = useDispatch();
  // const fetcher = (url: any) =>
  //   axios
  //     .get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     })
  //     .then((res) => res.data);

  // const {
  //   data: subWorkspaces,
  //   error,
  //   mutate,
  // } = useSWR(
  //   parentId ? `https://dev.silzila.com/api/workspace/${parentId}` : null,
  //   fetcher
  // );

  const fetchSubWorkspaces = useCallback(async () => {
    if (!parentId) return;

    setIsLoading(true);
    setHasFetched(false);
    // const response = await FetchData({
    //   requestType: "noData",
    //   method: "GET",
    //   url: `workspace/${parentId}`,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //   },
    // });

    // if (response.status) {
    //   setSubWorkspaces(response.data);
    //   sessionStorage.setItem("subWorkspaces", JSON.stringify(response.data));
    //   setError(null);
    //   setIsLoading(false);
    // } else {

    //   setIsLoading(false);
    // }
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "GET",
        url: `workspace/${parentId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.status) {
        setSubWorkspaces(response.data);
        sessionStorage.setItem("subWorkspaces", JSON.stringify(response.data));
        dispatch(setWorkspaceContents(response.data));
        setError(null);
      } else {
        setError(response.data);
        setSubWorkspaces([]);
      }
    } catch (error) {
      setError(error);
      setSubWorkspaces([]);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [parentId]);

  const hideSubworkSpacePageIcons = (workSpace: any) => {
    setHideNewIcon(workSpace?.roleId === 7 || workSpace?.roleId === 0);

    if (workSpace?.roleId === 6) {
      setDisableNewWorkspace(true);
      if (
        workSpace.customPermissions?.find(
          (item: any) => item.contentTypeId === 2
        )?.privilegeId === 1
      ) {
        setDisableNewDBConnection(false);
      } else {
        setDisableNewDBConnection(true);
      }
      if (
        workSpace.customPermissions?.find(
          (item: any) => item.contentTypeId === 3
        )?.privilegeId === 1
      ) {
        setDisableNewDataset(false);
      } else {
        setDisableNewDataset(true);
      }
      if (
        workSpace.customPermissions?.find(
          (item: any) => item.contentTypeId === 4
        )?.privilegeId === 1
      ) {
        setDisableNewFlatfile(false);
      } else {
        setDisableNewFlatfile(true);
      }
      if (
        workSpace.customPermissions?.find(
          (item: any) => item.contentTypeId === 5
        )?.privilegeId === 1
      ) {
        setDisableNewPlaybook(false);
      } else {
        setDisableNewPlaybook(true);
      }
    }
    if (workSpace?.roleId === 5) {
      setDisableNewWorkspace(true);
    }
  };

  // let workSpaces = useSelector(
  //   (state: RootState) => state.permissions.workspaces
  // );
  useEffect(() => {
    fetchSubWorkspaces();

    // let workSpaces: any = sessionStorage.getItem("workspaces");

    // workSpaces = workSpaces ? JSON.parse(workSpaces) : [];

    // let currentWorkspace = workSpaces?.find(
    //   (item: any) => item.id === parentId
    // );

    // hideSubworkSpacePageIcons(currentWorkspace);
  }, [fetchSubWorkspaces, parentId]);

  const getDependency = async (
    contentId: string,
    contentType: string,
    workspaceId: string
  ): Promise<{
    hasDependency: boolean;
    dependencies: any[];
    dependencyType: string;
    error: string | null;
  }> => {
    setDependencyLoading(true);
    const res = await FetchData({
      url: `content/dependency/${contentId}?workspaceId=${workspaceId}&contentType=${contentType}`,
      method: "GET",
      requestType: "noData",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (res.status) {
      setDependencyLoading(false);
      return {
        hasDependency: res.data.length > 0,
        dependencies: res.data,
        dependencyType: "",
        error: null,
      };
    } else {
      setDependencyLoading(false);
      return {
        hasDependency: false,
        dependencies: [],
        dependencyType: "",
        error: res.data,
      };
    }
  };

  const handleSubWorkspaceClick = (
    swid: string,
    swname: string,
    parentId: any
  ) => {
    navigate(`/SubWorkspaceDetails/${swid}`, {
      state: { wname: parentWorkspaceName, name: swname, parentId: parentId },
    });
    localStorage.setItem("parentWorkspaceId", parentId);
  };

  const deleteWorkspace = (index: any, name: any) => {
    setIndexToDelete(index);
    setWorkspaceName(name);
    setShowDeleteConfirmation(true);
  };

  const deleteContent = async (item: any) => {
    if (item.contentType === 5) {
      setIndexToDelete(item.id);
      setShowContentDeleteConfirmation(true);
      setSelectedContent(item);
    } else {
      const getDependencies = await getDependency(
        item.id,
        item.contentType,
        item.parentWorkspaceId
      );
      if (!getDependencies.hasDependency) {
        setIndexToDelete(item.id);
        setShowContentDeleteConfirmation(true);
        setSelectedContent(item);
      } else {
        const treeViewDependency =
          ConvertListOfListToDataConnectionRichTreeViewList(
            getDependencies.dependencies,
            item.contentType === 2 ? "dataset" : "playbook"
          );
        setDependencyData(treeViewDependency);
        setSelectedContent(item);
        setShowDependencyPopup(true);
      }
    }
  };

  // const handleDeleteContent = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `https://dev.silzila.com/api/content/delete/${selectedContent.id}?workspaceId=${parentId}&contentType=${selectedContent.contentType}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log(
  //         `${getContentTypeLabel(
  //           selectedContent.contentType
  //         )?.toUpperCase()} deleted successfully`
  //       );
  //       mutate();
  //     } else {
  //       console.error(
  //         `Failed to delete ${getContentTypeLabel(
  //           selectedContent.contentType
  //         )?.toUpperCase()}`
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       `Error deleting ${getContentTypeLabel(
  //         selectedContent.contentType
  //       )?.toUpperCase()}:`,
  //       error
  //     );
  //   } finally {
  //     setShowContentDeleteConfirmation(false);
  //     setIndexToDelete(null);
  //   }
  // };
  const handleDeleteContent = async () => {
    setIsLoading(true);
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "DELETE",
        url: `content/delete/${selectedContent.id}?workspaceId=${parentId}&contentType=${selectedContent.contentType}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status) {
        // console.log(
        //   `${getContentTypeLabel(
        //     selectedContent.contentType
        //   )?.toUpperCase()} deleted successfully`
        // );
        // mutate(); // Trigger a re-fetch or update
        fetchSubWorkspaces();
      } else {
        console.error(
          `Failed to delete ${getContentTypeLabel(
            selectedContent.contentType
          )?.toUpperCase()}:`,
          response.data?.detail || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        `Error deleting ${getContentTypeLabel(
          selectedContent.contentType
        )?.toUpperCase()}:`,
        error
      );
    } finally {
      setIsLoading(false);
      setShowContentDeleteConfirmation(false);
      setIndexToDelete(null);
    }
  };

  // const handleDeleteWorkspace = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `https://dev.silzila.com/api/workspace/delete/${IndexToDelete}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Workspace deleted successfully");
  //       mutate();
  //     } else {
  //       console.error("Failed to delete workspace");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting workspace:", error);
  //   } finally {
  //     setShowDeleteConfirmation(false);
  //     setIndexToDelete(null);
  //   }
  // };
  const handleDeleteWorkspace = async () => {
    let canDelete = true;
    setIsLoading(true);
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "GET",
        url: `workspace/${IndexToDelete}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.status && response.data.length) {
        setOpenAlert(true);
        canDelete = false;
        setTestMessage(
          "Workspace can't be deleted before deleting all of its contents first."
        );
        setSeverity("error");
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      if (!canDelete) {
        setIsLoading(false);
        setShowDeleteConfirmation(false);
        setIndexToDelete(null);
      }
    }

    if (canDelete) {
      try {
        const response = await FetchData({
          requestType: "noData",
          method: "DELETE",
          url: `sub-workspace/delete/${IndexToDelete}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.status) {
          // mutate(); // Trigger re-fetch or state update
          fetchSubWorkspaces();
        } else {
          console.error(
            `Failed to delete workspace:`,
            response.data?.detail || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error deleting workspace:", error);
      } finally {
        setIsLoading(false);
        setShowDeleteConfirmation(false);
        setIndexToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setIndexToDelete(null);
    setShowContentDeleteConfirmation(false);
  };

  // const handleEditWorkspace = async () => {
  //   try {
  //     let response:any = {};
  //     console.log(selectedWorkSpaceItem);

  //     if(selectedWorkSpaceItem.contentType === 1){
  //       response = await axios.put(
  //         "https://dev.silzila.com/api/workspace/update",
  //         {
  //           workspaceId: editWorkspaceId,
  //           name: workspaceName,
  //           parentId: parentId,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //     }
  //     else{
  //       response = await axios.put(
  //         "https://dev.silzila.com/api/content/rename",
  //         {
  //           contentId: selectedWorkSpaceItem.contentType === 1 ? editWorkspaceId : selectedWorkSpaceItem.id,
  //           name: workspaceName,
  //           workspaceId: selectedWorkSpaceItem.parentWorkspaceId,
  //           contentTypeId : selectedWorkSpaceItem.contentType
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           },
  //         }
  //       );
  //     }

  //     if (response.status === 200) {
  //       console.log("Workspace updated successfully");
  //       mutate();
  //       setIsEditModalOpen(false);
  //       setWorkspaceName("");
  //       setEditWorkspaceId(null);
  //     } else {
  //       console.error("Failed to update workspace");
  //     }
  //   } catch (error) {
  //     console.error("Error updating workspace:", error);
  //   }
  // };
  const handleEditWorkspace = async () => {
    const isValidName = isNameAllowed(workspaceName);

    if (!isValidName) {
      setErrorMessage(messages.workspace.wrongName);
      return;
    }

    try {
      let response: any = {};
      setIsLoading(true);

      if (selectedWorkSpaceItem.contentType === 1) {
        response = await FetchData({
          requestType: "withData",
          method: "PUT",
          url: "workspace/update",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: {
            workspaceId: editWorkspaceId,
            name: workspaceName,
            parentId: parentId,
          },
        });
      } else {
        response = await FetchData({
          requestType: "withData",
          method: "PUT",
          url: "content/rename",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: {
            contentId:
              selectedWorkSpaceItem.contentType === 1
                ? editWorkspaceId
                : selectedWorkSpaceItem.id,
            name: workspaceName,
            workspaceId: selectedWorkSpaceItem.parentWorkspaceId,
            contentTypeId: selectedWorkSpaceItem.contentType,
          },
        });
      }

      if (response.status) {
        // mutate();
        fetchSubWorkspaces();
        setIsEditModalOpen(false);
        setWorkspaceName("");
        setEditWorkspaceId(null);
      } else {
        console.error(
          "Failed to update workspace:",
          response.data?.detail || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (
    id: any,
    currentName: any,
    currentParentId: any,
    workspaceItem: any
  ) => {
    setEditWorkspaceId(id);
    setWorkspaceName(currentName);
    // setParentId(currentParentId);
    setIsEditModalOpen(true);
    setSelectedWorkSpaceItem(workspaceItem);
  };

  // useEffect(() => {
  //   const fetchParentWorkspaceName = async () => {
  //     if (parentId) {
  //       try {
  //         const response = await axios.get(
  //           `https://dev.silzila.com/api/workspace`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //           }
  //         );
  //         const foundWorkspace = response.data.find(
  //           (workspace: any) => workspace.id === parentId
  //         );

  //         if (foundWorkspace) {
  //           setParentWorkspaceName(foundWorkspace.name);
  //           setOwnerName(foundWorkspace.createdBy);
  //         } else {
  //           console.error("Workspace not found");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching workspace list:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchParentWorkspaceName();
  // }, [parentId]);
  useEffect(() => {
    const fetchParentWorkspaceName = async () => {
      if (parentId) {
        setIsLoading(true);
        try {
          const response = await FetchData({
            requestType: "noData",
            method: "GET",
            url: "workspace",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (response.status) {
            const foundWorkspace = response.data.find(
              (workspace: any) => workspace.id === parentId
            );

            hideSubworkSpacePageIcons(foundWorkspace);
            if (foundWorkspace) {
              setParentWorkspaceName(foundWorkspace.name);
              setOwnerName(foundWorkspace.createdBy);
            } else {
              console.error("Workspace not found");
            }
          } else {
            console.error(
              "Failed to fetch workspace list:",
              response.data?.detail || "Unknown error"
            );
          }
        } catch (error) {
          console.error("Error fetching workspace list:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    //setTimeout(fetchParentWorkspaceName, 1000);
    fetchParentWorkspaceName();
  }, [parentId]);

  // const handleCreateItem = async () => {
  //   let url;
  //   let data;

  //   switch (modalType) {
  //     case "Workspace":
  //       url = "https://dev.silzila.com/api/sub-workspace/create";
  //       data = { name: workspaceName, parentId: parentId || null };
  //       break;
  //     case "Flatfile":
  //     case "Playbook":
  //     case "DB Connections":
  //     case "Dataset":
  //       url = "https://dev.silzila.com/api/content/create";
  //       data = { name: workspaceName };
  //       break;
  //     default:
  //       return;
  //   }

  //   try {
  //     const response = await axios.post(url, data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       console.log(`${modalType} created successfully`);
  //       mutate(); // Revalidate the data after creating a new item
  //       setWorkspaceName("");
  //       setIsModalOpen(false);
  //     } else {
  //       console.error(`Failed to create ${modalType}`);
  //     }
  //   } catch (error) {
  //     console.error(`Error creating ${modalType}:`, error);
  //   }
  // };

  const isCreateContentDisabled = (contentName: string) => {
    if (contentName === "Workspace") {
      return disableNewWorkspace;
    } else if (contentName === "Flatfile") {
      return disableNewFlatfile;
    } else if (contentName === "DB Connection") {
      return disableNewDBConnection;
    } else if (contentName === "Dataset") {
      return disableNewDataset;
    } else if (contentName === "Playbook") {
      return disableNewPlaybook;
    }
  };

  const handleCreateItem = async () => {
    
    let url;
    let data;

    switch (modalType) {
      case "Workspace":
        url = "sub-workspace/create";
        data = { name: workspaceName, parentId: parentId || null };
        break;
      case "Flatfile":
      case "Playbook":
      case "DB Connection":
      case "Dataset":
        url = "content/create";
        data = { name: workspaceName };
        break;
      default:
        return;
    }
    const isValidName = isNameAllowed(workspaceName);

    if (!isValidName) {
      setErrorMessage(messages.workspace.wrongName);
      return;
    }

    try {
      setIsLoading(true);
      const response = await FetchData({
        requestType: "withData",
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: data,
      });

      if (response.status) {
        // mutate();
        fetchSubWorkspaces();
        setWorkspaceName("");
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message);
        console.error(
          `Failed to create ${modalType}:`,
          response.data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(`Error creating ${modalType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkspaceSelection = (id: string) => {
    if (selectedSubworkspaces.includes(id)) {
      // If already selected, remove it from the list
      setSelectedSubworkspaces(
        selectedSubworkspaces.filter((workspaceId) => workspaceId !== id)
      );
    } else {
      // Otherwise, add it to the list
      setSelectedSubworkspaces([...selectedSubworkspaces, id]);
    }
  };

  // Select All function
  const selectAllWorkspaces = () => {
    if (subWorkspaces) {
      const allWorkspaceIds = subWorkspaces.map(
        (workspace: any) => workspace.id
      );
      setSelectedSubworkspaces(allWorkspaceIds);
    }
  };

  const getImageSrc = (contentType: any) => {
    switch (contentType) {
      case 1:
        // return "/subworkspace.png";
        // return "/workspace_green.png"
        return "/folder_work.svg";
      case 2:
        return "/database_icon.svg";
      case 3:
        return "/ds.svg";
      case 4:
        return "/flat_file_icon.svg";
      case 5:
        return "/playbook_icon.svg";
      default:
        return ""; // Return a default image or an empty string if no match
    }
  };

  const getContentTypeLabel = (contentType: any) => {
    switch (contentType) {
      case 1:
        return "sub-workspace";
      case 2:
        return "dbconnection";
      case 3:
        return "dataset";
      case 4:
        return "flatfile";
      case 5:
        return "playbook";
      default:
        return "unknown";
    }
  };
  const getContentTypeName = (contentType: any) => {
    switch (contentType) {
      case 2:
        return "DB Connection";
      case 3:
        return "Data Set";
      case 4:
        return "Flat File";
      case 5:
        return "Playbook";
      default:
        return "unknown";
    }
  };

  const navigateToPages = (name: string, isFlatFile: boolean = false) => {
    switch (name) {
      case "DB Connection":
        navigate(`/newdataconnection/${parentId}`, {
          state: {
            mode: mode,
            parentId: parentId,
            workspaceName: parentWorkspaceName,
          },
        });
        break;
      case "Dataset":
        navigate(`/newdataset/${parentId}`, {
          state: {
            mode: mode,
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            isFlatFile: isFlatFile,
          },
        });
        break;
      case "Playbook":
        navigate(`/dataviewer/${parentId}`, {
          state: {
            mode: mode,
            parentId: parentId,
            workspaceName: parentWorkspaceName,
          },
        });
        break;
      case "Flatfile":
        navigate(`/flatfileupload/${parentId}`, {
          state: {
            mode: mode,
            parentId: parentId,
            workspaceName: parentWorkspaceName,
          },
        });
        break;
      default:
        return;
    }
  };

  const navigateToEditPages = (e: any) => {
    switch (e.contentType) {
      case 2:
        navigate(`/newdataconnection/${parentId}`, {
          state: {
            mode: "Edit",
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            id: e.id,
          },
        });
        break;
      case 3:
        navigate(`/editdataset/${parentId}`, {
          state: {
            mode: "Edit",
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            dsId: e.id,
          },
        });
        break;
      case 4:
        navigate(`/editflatfile/${parentId}`, {
          state: {
            mode: "Edit",
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            file: e,
          },
        });
        break;
      case 5:
        navigate(`/dataviewer/${parentId}`, {
          state: {
            mode: "Edit",
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            playbookId: e.id,
          },
        });
        break;
    }
  };

  useEffect(() => {
    if (subWorkspaces) {
      setFilterOptions({
        "sub-workspace": subWorkspaces.some(
          (item: any) => item.contentType === 1
        ),
        dbconnection: subWorkspaces.some((item: any) => item.contentType === 2),
        dataset: subWorkspaces.some((item: any) => item.contentType === 3),
        flatfile: subWorkspaces.some((item: any) => item.contentType === 4),
        playbook: subWorkspaces.some((item: any) => item.contentType === 5),
      });
    }
  }, [subWorkspaces]);

  const filteredWorkspaces = React.useMemo(() => {
    if (!subWorkspaces || !Array.isArray(subWorkspaces)) {
      return null;
    }

    return subWorkspaces.filter((workspace: any) => {
      const matchesSearch = workspace.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter
        ? getContentTypeLabel(workspace.contentType) === selectedFilter
        : true;

      return matchesSearch && matchesFilter;
    });
  }, [subWorkspaces, searchQuery, selectedFilter]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (selectedValue: any) => {
    setSelectedFilter(selectedValue);
    let contentType;
    switch (selectedValue) {
      case "sub-workspace":
        setPlaceholder("Search Workspace");
        setTooltipText("Filtered by Workspaces");
        contentType = 1;
        break;
      case "dbconnection":
        setPlaceholder("Search Database");
        setTooltipText("Filtered by Databases");
        contentType = 2;
        break;
      case "dataset":
        setPlaceholder("Search Dataset");
        setTooltipText("Filtered Datasets");
        contentType = 3;
        break;
      case "flatfile":
        setPlaceholder("Search Flatfile");
        setTooltipText("Filtered Flatfiles");
        contentType = 4;
        break;
      case "playbook":
        setPlaceholder("Search Playbook");
        setTooltipText("Filtered Playbooks");
        contentType = 5;
        break;
      default:
        setPlaceholder("Search All");
        setTooltipText("Filter Contents");
        break;
    }
    const iconSrc = getImageSrc(contentType);
    setSelectedIconSrc(iconSrc);
    setIsFilterDropdownOpen(false);
  };

  const openAccessModal = (workspaceId: any, workspaceName: string) => {
    // navigate(`/workspace/access/${parentId}`, { state: { workspaceId } });
    navigate(`/workspace/access/${workspaceId}`, {
      state: { parentId, workspaceName },
    });
  };

  const openAccessModalforContent = (workspaceId: any) => {
    navigate(`/content/access/${workspaceId}`, { state: { parentId } });
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const sortedAndFilteredWorkspaces = React.useMemo(() => {
    if (!filteredWorkspaces) {
      return null;
    }
    let sortedItems = [...filteredWorkspaces];

    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "name") {
          aValue = a.name ? a.name.toLowerCase() : "";
          bValue = b.name ? b.name.toLowerCase() : "";
        } else if (sortConfig.key === "type") {
          aValue = getContentTypeLabel(a.contentType) || "";
          bValue = getContentTypeLabel(b.contentType) || "";
        } else if (
          sortConfig.key === "modified" ||
          sortConfig.key === "createdAt"
        ) {
          const aDate = a.modified
            ? parseISO(a.modified)
            : a.createdAt
            ? parseISO(a.createdAt)
            : new Date(0);
          const bDate = b.modified
            ? parseISO(b.modified)
            : b.createdAt
            ? parseISO(b.createdAt)
            : new Date(0);

          aValue = aDate.getTime();
          bValue = bDate.getTime();
        } else {
          return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [filteredWorkspaces, sortConfig]);

  const handleSort = (key: any) => {
    const newDirection =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction: newDirection });
  };

  const getSortIcon = (key: any) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <img className="headerIcon-up" src="/sort-up.png" alt="Ascending" />
      ) : (
        <img
          className="headerIcon-down"
          src="/sort-down.png"
          alt="Descending"
        />
      );
    }
    return <img className="headerIcon" src="/sort.png" alt="Default" />;
  };

  if (error)
    return (
      <div className="loading-error-info">
        <p
          className="loading-default-text"
          style={{
            fontSize: fontSize.medium,
            color: palette.primary.contrastText,
          }}
        >
          Error loading sub-workspaces.
        </p>
      </div>
    );

  return (
    <React.Fragment>
      {showDependencyPopup ? (
        <RichTreeViewControl
          isWarning={true}
          list={dependencyData}
          showControls={false}
          showInPopup={true}
          handleCloseButtonClick={(e: any) => {
            setShowDependencyPopup(false);
            setSelectedContent({});
          }}
          title={[
            `Can't delete ${selectedContent.name}.`,
            "Here is the list of dependencies.",
          ]}
          hasMultipleTitle={true}
        />
      ) : null}
      <div className={`${styles.subworkspaceContainer} subworkspace-container`}>
        <div
          className="sub-heading"
          style={{ height: "50px", border: "1px solid transparent" }}
        >
          <img
            src="/folder_work.svg"
            style={{ width: "24px", height: "24px" }}
            alt="Workspace Icon"
          ></img>
          <div>
            <h3
              style={{
                // marginTop: "-4px",
                // marginBottom: "5px",
                padding: "0px",
                margin: "0px",
                marginLeft: "6px",
                fontSize: fontSize.large,
                color: palette.primary.contrastText,
              }}
            >
              {parentWorkspaceName}
            </h3>
          </div>
        </div>

        <div className="subworkspace-button-add-search-container">
          <div className="subworkspace-action-buttons">
            <div className={styles.dropdown}>
              {!hideNewIcon && !isLoading && (
                <button
                  className={`${styles.createWorkspace} create-workspace`}
                  style={{
                    fontSize: fontSize.medium,
                    color: palette.primary.main,
                  }}
                >
                  <img
                    className="addIcon addIconDefault"
                    src="/add_green.png"
                    alt="Add Users Logo"
                    style={{ width: "16px", height: "16px" }}
                  />
                  &nbsp;New
                </button>
              )}
              <div className={styles.dropdownContent}>
                {[
                  { name: "Workspace", icon: getImageSrc(1) },
                  { name: "Flatfile", icon: getImageSrc(4) },
                  { name: "DB Connection", icon: getImageSrc(2) },
                  { name: "Dataset", icon: getImageSrc(3) },
                  { name: "Playbook", icon: getImageSrc(5) },
                ].map((item) => (
                  <button
                    key={item.name}
                    style={{
                      display: "flex",
                      fontSize: fontSize.medium,
                      // color: palette.primary.contrastText,
                      alignItems: "center",
                    }}
                    className={
                      isCreateContentDisabled(item.name)
                        ? styles.disabledOption
                        : ""
                    }
                    onClick={() => {
                      if (item.name !== "Dataset") {
                        setModalType(item.name);

                        if (item.name === "Workspace") {
                          setIsModalOpen(true);
                        }
                        navigateToPages(item.name);
                      }
                    }}
                    onMouseOver={(e) => {
                      if (item.name === "Dataset") {
                        setShowDatasetOptions(true);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.name === "Dataset") {
                        setShowDatasetOptions(false);
                      }
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={`${item.name} Icon`}
                      style={{
                        marginRight: "15px",
                        // transform: "translateY(3px)",
                        width: "17px",
                        height: "17px",
                      }}
                    />

                    {item.name}
                    {item.name === "Dataset" && showDatasetOptions ? (
                      <div
                        className={styles.dropdownContent}
                        style={{ marginLeft: "7rem", marginTop: "-0.5rem" }}
                      >
                        {[
                          { name: "From Flat File" },
                          { name: "From DB Connection" },
                        ].map((item) => (
                          <button
                            key={item.name}
                            style={{
                              display: "flex",
                              fontSize: fontSize.medium,
                              color: palette.primary.contrastText,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setModalType("Dataset");
                              navigateToPages(
                                "Dataset",
                                item.name === "From Flat File"
                              );
                            }}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="subWorkspaceSelectActionContainer">
            <div className="subWorkspaceActionsContainer">
              {/* Future Update
        <p style={{ cursor: 'pointer' }} onClick={selectAllWorkspaces}>
          Select All
        </p>

        {selectedSubworkspaces?.length > 0 && (
        <div className='subWorkspaceActionsCountContainer'>
          <p style={{ cursor: 'pointer', marginLeft: "10px" }} onClick={() => setSelectedSubworkspaces([])}>
            Deselect All
          </p>
          <span>{`${selectedSubworkspaces?.length} selected`}</span>
          <p style={{ marginLeft: "10px" }}>Actions</p>
        </div>
      )} */}
            </div>

            <div className={styles.SearchFilterContainer}>
              <div className={styles.filterDropdownContainer}>
                <div
                  className={styles.filterTooltipImgContainer}
                  ref={dropdownRef}
                  onClick={toggleFilterDropdown}
                  onBlur={() => setIsFilterDropdownOpen(false)}
                  onMouseOver={() => setIsFilterDropdownOpen(true)}
                  onMouseLeave={() => setIsFilterDropdownOpen(false)}
                >
                  <Tooltip title={tooltipText}>
                    {selectedFilter ? (
                      <img
                        src="/filter.png"
                        alt="Filter Icon"
                        style={{ cursor: "pointer", marginTop: "3px" }}
                      />
                    ) : (
                      <img
                        src="/filter-outline.png"
                        alt="Filter Icon"
                        style={{ cursor: "pointer", marginTop: "3px" }}
                      />
                    )}
                  </Tooltip>
                  {selectedFilter && selectedIconSrc && (
                    <img
                      src={selectedIconSrc}
                      alt="Selected Filter Icon"
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        width: "14px",
                        height: "14px",
                      }}
                      onClick={() => handleFilterChange("")}
                    />
                  )}
                </div>
                {isFilterDropdownOpen && (
                  <div
                    className={styles.filterDropdown}
                    style={{ transform: "translate(0,0)" }}
                    onMouseOver={() => setIsFilterDropdownOpen(true)}
                    onMouseLeave={() => setIsFilterDropdownOpen(false)}
                  >
                    <ul
                      className={styles.filterDropdownContent}
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    >
                      <li
                        onClick={() => handleFilterChange("")}
                        style={{
                          paddingTop: "7px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> All
                      </li>

                      <li
                        onClick={() => handleFilterChange("sub-workspace")}
                        className={
                          !filterOptions["sub-workspace"]
                            ? styles.disabledOption
                            : ""
                        }
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <img src="/folder_work.svg" alt="Workspace"></img>
                        Workspace
                      </li>

                      <li
                        onClick={() => handleFilterChange("flatfile")}
                        className={
                          !filterOptions.flatfile ? styles.disabledOption : ""
                        }
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <img src="/flat_file_icon.svg" alt="Flat file"></img>
                        Flatfile
                      </li>

                      <li
                        onClick={() => handleFilterChange("dbconnection")}
                        className={
                          !filterOptions.dbconnection
                            ? styles.disabledOption
                            : ""
                        }
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <img src="/database_icon.svg" alt="Database"></img>
                        DB Connection{" "}
                      </li>

                      <li
                        onClick={() => handleFilterChange("dataset")}
                        className={
                          !filterOptions.dataset ? styles.disabledOption : ""
                        }
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        {/* <SchemaIcon
                        style={{
                          color: "#616164",
                          width: "14px",
                          height: "15px",
                          marginRight: "10px",
                          transform: "translateY(2px)",
                        }}
                      /> */}
                        <img src="/ds.svg" alt="Dataset"></img>
                        Dataset
                      </li>

                      <li
                        onClick={() => handleFilterChange("playbook")}
                        className={
                          !filterOptions.playbook ? styles.disabledOption : ""
                        }
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                      >
                        <img src="/playbook_icon.svg" alt="playbook"></img>
                        Playbook
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="subWorkspaceSearchContainer">
                <input
                  type="text"
                  className="subWorkspaceSearchInput"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder={placeholder}
                  style={{
                    fontSize: fontSize.medium,
                    color: palette.primary.contrastText,
                  }}
                />

                <img
                  src="/glass.png"
                  alt="Search Icon"
                  className="subWorkspaceSearchIcon"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.subLoadingContainer}>
            <div className="user-spinner"></div>
          </div>
        ) : hasFetched &&
          subWorkspaces?.length === 0 &&
          searchQuery.length === 0 ? (
          <div className="no-user-info">
            <p
              className="loading-default-text"
              style={{
                fontSize: fontSize.medium,
                color: palette.primary.contrastText,
              }}
            >
              No contents available.
            </p>
          </div>
        ) : (
          <div className="subworkspce-table-container">
            <table className={`${styles.subWorkspaceTable} subWorkspace-table`}>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th onClick={() => handleSort("name")}>
                    Name{" "}
                    <span className="icon-wrapper">{getSortIcon("name")}</span>
                  </th>
                  <th onClick={() => handleSort("type")}>
                    Type{" "}
                    <span className="icon-wrapper">{getSortIcon("type")}</span>
                  </th>
                  <th onClick={() => handleSort("modified")}>
                    Modified{" "}
                    <span className="icon-wrapper">
                      {getSortIcon("modified")}
                    </span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {!sortedAndFilteredWorkspaces ? (
                  <></>
                ) : sortedAndFilteredWorkspaces &&
                  sortedAndFilteredWorkspaces.length > 0 ? (
                  sortedAndFilteredWorkspaces.map(
                    (workspace: any, index: any) => (
                      <tr
                        key={workspace.id}
                        onMouseEnter={() => setHoveredRowId(workspace.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        className={
                          selectedSubworkspaces.includes(workspace.id)
                            ? "selectedRow"
                            : ""
                        }
                      >
                        <td>
                          {/* // <input
                        //   type="checkbox"
                        //   checked={selectedSubworkspaces.includes(workspace.id)}
                        //   onChange={() =>
                        //     handleWorkspaceSelection(workspace.id)
                        //   }
                        //   style={{ width: "16px", height: "16px" }}
                        // /> */}
                        </td>

                        <td>
                          {/* {workspace.contentType === 3 ? (
                          <SchemaIcon
                            style={{
                              color: "#616164",
                              width: "14px",
                              height: "15px",
                            }}
                          ></SchemaIcon>
                        ) : ( */}
                          <img
                            src={getImageSrc(workspace.contentType)}
                            alt="Content Type Icon"
                            style={{ width: "16px", height: "16px" }}
                          />
                        </td>

                        {workspace.contentType === 1 ? (
                          <td
                            onClick={() =>
                              handleSubWorkspaceClick(
                                workspace.id,
                                workspace.name,
                                parentId
                              )
                            }
                            className={styles.nameHyperlink}
                            style={{
                              fontSize: fontSize.medium,
                              color: palette.primary.contrastText,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "150px",
                            }}
                          >
                            {workspace.name}
                          </td>
                        ) : (
                          <td
                            style={{
                              fontSize: fontSize.medium,
                              color: palette.primary.contrastText,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "150px",
                            }}
                          >
                            {workspace.name}
                          </td>
                        )}

                        <td
                          style={{
                            fontSize: fontSize.medium,
                            color: palette.primary.contrastText,
                          }}
                        >
                          {getContentTypeLabel(workspace.contentType)}
                        </td>
                        <td
                          style={{
                            fontSize: fontSize.medium,
                            color: palette.primary.contrastText,
                          }}
                        >
                          {workspace.modified || workspace.createdAt
                            ? formatDistanceToNow(
                                parseISO(
                                  workspace.modified || workspace.createdAt
                                ),
                                { addSuffix: true }
                              )
                            : "No date available"}
                        </td>
                        <td>
                            <div className="subworkspace-img-icon">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  if (workspace.contentType === 1) {
                                    handleSubWorkspaceClick(
                                      workspace.id,
                                      workspace.name,
                                      parentId
                                    );
                                  } else {
                                    navigateToEditPages(workspace);
                                  }
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                }}
                              >
                                <Tooltip title="View / Edit">
                                  <img
                                    src={
                                      hoveredRowId === workspace.id
                                        ? "/eye_purple.png"
                                        : "/eye_white.png"
                                    }
                                    alt="Change"
                                    style={{
                                      marginTop: "5px",
                                      width: "17px",
                                      height: "17px",
                                    }}
                                  />
                                </Tooltip>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(
                                    workspace.id,
                                    workspace.name,
                                    workspace.parentId,
                                    workspace
                                  );
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                }}
                              >
                                <Tooltip title="Rename">
                                  <img
                                    src={
                                      hoveredRowId === workspace.id
                                        ? "/edit.png"
                                        : "/edit_white.png"
                                    }
                                    alt="Edit"
                                    style={{
                                      marginTop: "1px",
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />
                                </Tooltip>
                              </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (workspace.contentType === 1) {
                                        deleteWorkspace(
                                          workspace.id,
                                          workspace.name
                                        );
                                      } else {
                                        deleteContent(workspace);
                                      }
                                    }}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      marginLeft: "5px",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <Tooltip title="Delete">
                                      <img
                                        src={
                                          hoveredRowId === workspace.id
                                            ? "/delete_red.png"
                                            : "/delete_white.png"
                                        }
                                        alt="Delete"
                                        style={{
                                          marginTop: "1px",
                                          width: "17px",
                                          height: "17px",
                                        }}
                                      />
                                    </Tooltip>
                                  </button>
                            </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <div className="no-user-info">
                    <p
                      className="loading-default-text"
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    >
                      No content found.
                    </p>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        )}
        <PopUpSpinner show={dependencyLoading} />
        <Dialog open={showDeleteConfirmation} onClose={cancelDelete}>
          <div className="workspace-remove-modal" style={{ height: "auto" }}>
            <div
              className="workspace-remove-modalContent-close"
              style={{ visibility: "hidden" }}
            >
              <Tooltip title="Close">
                <CloseIcon
                  onClick={cancelDelete}
                  sx={{
                    fontSize: "large",
                    color: "#545454",
                    cursor: "pointer",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </Tooltip>
            </div>

            <div className="workspace-remove-modalContent-p">
              <p
                style={{
                  fontSize: fontSize.medium,
                  color: palette.primary.contrastText,
                }}
              >
                Are you sure you want to delete the workspace {workspaceName}?
              </p>
            </div>

            <div className="workspace-modal-buttons">
              <button
                onClick={cancelDelete}
                className="workspace-modal-cancel"
                style={{ fontSize: fontSize.medium }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkspace}
                className="workspace-modal-confirm"
                style={{ fontSize: fontSize.medium }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Dialog>

        <Dialog open={showContentDeleteConfirmation} onClose={cancelDelete}>
          <div className="workspace-remove-modal" style={{ height: "auto" }}>
            <div
              className="workspace-remove-modalContent-close"
              style={{ visibility: "hidden" }}
            >
              <Tooltip title="Close">
                <CloseIcon
                  onClick={cancelDelete}
                  sx={{
                    fontSize: "large",
                    color: "#545454",
                    cursor: "pointer",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                />
              </Tooltip>
            </div>

            <div className="workspace-remove-modalContent-p">
              <p
                style={{
                  fontSize: fontSize.medium,
                  color: palette.primary.contrastText,
                }}
              >
                Are you sure you want to delete the{" "}
                {getContentTypeName(selectedContent.contentType)}{" "}
                {selectedContent.name}?
              </p>
            </div>

            <div className="workspace-modal-buttons">
              <button
                onClick={cancelDelete}
                className="workspace-modal-cancel"
                style={{ fontSize: fontSize.medium }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContent}
                className="workspace-modal-confirm"
                style={{ fontSize: fontSize.medium }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Dialog>

        {/* Edit Workspace Modal  */}
        {isEditModalOpen && (
          <div className={styles.subworkspaceModal}>
            <div className={styles.subworkspaceModalContent}>
              <h3>Rename</h3>
              <div className={styles.subworkspaceModalContentInput}>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Workspace Name"
                />
                {errorMessage && (
                  <div className={styles.errorMessage}>{errorMessage}</div>
                )}
              </div>

              <div className={styles.subworkspaceModalButtons}>
                <button
                  className={styles.subworkspaceModalCancel}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setErrorMessage("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.workspaceSaveButton}
                  onClick={handleEditWorkspace}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className={styles.subworkspaceModal}>
            <div className={styles.subworkspaceModalContent}>
              <h3>Name your {modalType}</h3>
              <div className={styles.subworkspaceModalContentInput}>
                <input
                  type="text"
                  required
                  // value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder={`Enter ${modalType} name`}
                  // className={styles.workspaceInput}
                />
              </div>
              {/* Error message section */}
              {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}
              <div className={styles.subworkspaceModalButtons}>
                <button
                  className={styles.subworkspaceModalCancel}
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrorMessage("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.workspaceSaveButton}
                  onClick={handleCreateItem}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <DatabaseConnectionDialogComponents
          onCloseAlert={() => {
            setOpenAlert(false);
            setTestMessage("");
          }}
          severity={severity}
          testMessage={testMessage}
          openAlert={openAlert}
        />
      </div>
    </React.Fragment>
  );
};

export default SubWorkspace;
