import React, { useState, useEffect, useRef } from "react";
import styles from "./SubWorkspaceDetails.module.css";
import "./allPages.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createSvgIcon, Tooltip, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow, parseISO } from "date-fns";
import FetchData from "./ServerCall/FetchData";
import {
  ConvertListOfListToDataConnectionRichTreeViewList,
  isNameAllowed,
} from "./CommonFunctions/CommonFunctions";
import RichTreeViewControl from "./Controls/RichTreeViewControl";
import { serverEndPoint } from "./ServerCall/EnvironmentVariables";
import { fontSize, palette } from "..";
import { PopUpSpinner } from "./CommonFunctions/DialogComponents";
import { useDispatch, useSelector } from "react-redux";
import { setSubWorkspaceContents } from "../redux/Permissions/permissions.action";
import { RootState } from "../redux";
import { messages } from "./CommonFunctions/aliases";
const SchemaIcon = createSvgIcon(
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="7"
      width="30"
      height="29"
      stroke="#787878"
      stroke-width="4"
    />
    <rect
      x="10.5"
      y="14.5"
      width="19"
      height="3"
      fill="#808080"
      stroke="#787878"
    />
    <path d="M38.5 20.5H80.5V21.5H38.5V20.5Z" fill="#808080" stroke="#787878" />
    <path d="M37.5 79.5H80.5V80.5H37.5V79.5Z" fill="#808080" stroke="#787878" />
    <rect
      x="79.5"
      y="32.5"
      width="10"
      height="1"
      transform="rotate(-90 79.5 32.5)"
      fill="#808080"
      stroke="#787878"
    />
    <path
      d="M79.5 66.5H80.5V78.5H79.5V69.7143V66.5Z"
      fill="#808080"
      stroke="#787878"
    />
    <path d="M10.5 24.5H29.5V27.5H10.5V24.5Z" fill="#808080" stroke="#787878" />
    <rect
      x="6"
      y="66"
      width="30"
      height="29"
      stroke="#787878"
      stroke-width="4"
    />
    <rect
      x="11.5"
      y="74.5"
      width="19"
      height="3"
      fill="#808080"
      stroke="#787878"
    />
    <path d="M11.5 84.5H30.5V87.5H11.5V84.5Z" fill="#808080" stroke="#787878" />
    <rect
      x="64"
      y="35"
      width="30"
      height="29"
      stroke="#787878"
      stroke-width="4"
    />
    <rect
      x="69.5"
      y="43.5"
      width="19"
      height="3"
      fill="#808080"
      stroke="#787878"
    />
    <path d="M69.5 53.5H88.5V56.5H69.5V53.5Z" fill="#808080" stroke="#787878" />
  </svg>,
  "Schema"
);

interface SubWorkspace {
  id: string;
  name: string;
  contentType: number;
  modified: any;
  type: any;
  createdAt: any;
}

const fetcher = (url: any) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data);

const SubWorkspaceDetails = () => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [workspaceIndexToDelete, setWorkspaceIndexToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editWorkspaceId, setEditWorkspaceId] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const { parentId } = useParams();
  const [parentWorkspaceName, setParentWorkspaceName] = useState("");
  const [childWorkspaceName, setChildWorkspaceName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [subWorkspaces, setSubWorkspaces] = useState<SubWorkspace[] | null>(
    null
  );
  const navigate = useNavigate();
  const [mode] = useState("New");
  const [selectedSubworkspaces, setSelectedSubworkspaces] = useState<string[]>(
    []
  );
  const [dependencyLoading, setDependencyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    dbconnection: false,
    dataset: false,
    flatfile: false,
    playbook: false,
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
  const [showContentDeleteConfirmation, setShowContentDeleteConfirmation] =
    useState(false);
  const [selectedContent, setSelectedContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showDatasetOptions, setShowDatasetOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [selectedWorkSpaceItem, setSelectedWorkSpaceItem] = useState<any>({});
  const [showDependencyPopup, setShowDependencyPopup] = useState(false);
  const [dependencyData, setDependencyData] = useState<Array<Object>>([]);

  const [hideNewIcon, setHideNewIcon] = useState<boolean>(false);
  const [disableNewFlatfile, setDisableNewFlatfile] = useState<boolean>(false);
  const [disableNewDBConnection, setDisableNewDBConnection] =
    useState<boolean>(false);
  const [disableNewDataset, setDisableNewDataset] = useState<boolean>(false);
  const [disableNewPlaybook, setDisableNewPlaybook] = useState<boolean>(false);
  const id_parent = localStorage.getItem("parentId");
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const dispatch = useDispatch();
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

  const hideSubworkSpacePageIcons = (workSpace: any) => {
    setHideNewIcon(workSpace?.roleId === 7 || workSpace?.roleId === 0);

    if (workSpace?.roleId === 6) {
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
  };

  // let subWorkSpaces = useSelector(
  //   (state: RootState) => state.permissions.workspaceContents
  // );

  useEffect(() => {
    fetchSubWorkspaces();

    // let workSpaces: any = sessionStorage.getItem("subWorkspaces");

    // workSpaces = workSpaces ? JSON.parse(workSpaces) : [];

    // let currentWorkspace = subWorkSpaces?.find(
    //   (item: any) => item.id === parentId
    // );

    // hideSubworkSpacePageIcons(currentWorkspace);
  }, [parentId]);

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

      const commonHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };

      setIsLoading(true);
      setIsEditModalOpen(false);
      if (selectedWorkSpaceItem.contentType === 1) {
        response = await FetchData({
          requestType: "withData",
          method: "PUT",
          url: "workspace/update",
          headers: commonHeaders,
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
          headers: commonHeaders,
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
        setWorkspaceName("");
        setEditWorkspaceId(null);
        fetchSubWorkspaces();
        setErrorMessage("");
      } else {
        setErrorMessage(response.data?.message);
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
    setDependencyLoading(false);
    if (res.status) {
      return {
        hasDependency: res.data.length > 0,
        dependencies: res.data,
        dependencyType: "",
        error: null,
      };
    } else {
      return {
        hasDependency: false,
        dependencies: [],
        dependencyType: "",
        error: res.data,
      };
    }
  };

  const deleteContent = async (item: any) => {
    if (item.contentType === 5) {
      // setIndexToDelete(item.id);
      setShowContentDeleteConfirmation(true);
      setSelectedContent(item);
    } else {
      const getDependencies = await getDependency(
        item.id,
        item.contentType,
        item.parentWorkspaceId
      );
      if (!getDependencies.hasDependency) {
        // setIndexToDelete(item.id);
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

  const cancelDelete = () => {
    setShowContentDeleteConfirmation(false);
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
  //   }
  // };
  const handleDeleteContent = async () => {
    setIsLoading(true);
    setShowContentDeleteConfirmation(false);
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "DELETE",
        url: `content/delete/${selectedContent.id}?workspaceId=${parentId}&contentType=${selectedContent.contentType}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: null, // No body data for DELETE request
      });

      if (response.status) {
        // console.log(
        //   `${getContentTypeLabel(
        //     selectedContent.contentType
        //   )?.toUpperCase()} deleted successfully`
        // );
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
    }
  };

  // useEffect(() => {
  //   const fetchParentWorkspaceName = async () => {
  //     if (parentId) {
  //       setIsLoading(true);
  //       try {
  //         const response = await axios.get(
  //           `https://dev.silzila.com/api/workspace/${id_parent}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //           }
  //         );

  //         console.log("Parent Workspace Response:", response.data);

  //         const foundWorkspace = response.data.find(
  //           (workspace: any) => workspace.id === parentId
  //         );

  //         if (foundWorkspace) {
  //           setParentWorkspaceName(foundWorkspace.parentWorkspaceName);
  //           setChildWorkspaceName(foundWorkspace.name);
  //           setOwnerName(foundWorkspace.createdBy);
  //         } else {
  //           console.error("Workspace not found");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching parent workspace:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchParentWorkspaceName();
  // }, [id_parent]);

  useEffect(() => {
    const fetchParentWorkspaceName = async () => {
      if (parentId) {
        setIsLoading(true);
        try {
          const response = await FetchData({
            requestType: "noData",
            method: "GET",
            url: `workspace/${id_parent}`, // Assuming the URL is dynamically constructed
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          // console.log("Parent Workspace Response:", response.data);

          const foundWorkspace = response.data.find(
            (workspace: any) => workspace.id === parentId
          );

          hideSubworkSpacePageIcons(foundWorkspace);

          if (foundWorkspace) {
            setParentWorkspaceName(foundWorkspace.parentWorkspaceName);
            setChildWorkspaceName(foundWorkspace.name);
            setOwnerName(foundWorkspace.createdBy);
          } else {
            console.error("Workspace not found");
          }
        } catch (error) {
          console.error("Error fetching parent workspace:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchParentWorkspaceName();
  }, [id_parent]);

  // useEffect(() => {
  //   const fetchSubWorkspaces = async () => {
  //     if (parentId) {
  //       try {
  //         const response = await axios.get(
  //           `https://dev.silzila.com/api/workspace/${parentId}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //             },
  //           }
  //         );

  //         console.log("Sub Workspaces Response:", response.data);

  //         // Assuming response.data.subWorkspaces contains the list of sub-workspaces
  //         setSubWorkspaces(response.data || []);
  //       } catch (error) {
  //         console.error("Error fetching sub-workspaces:", error);
  //       }
  //     }
  //   };

  //   fetchSubWorkspaces();
  // }, [parentId]);

  const fetchSubWorkspaces = async () => {
    if (parentId) {
      setIsLoading(true);
      setHasFetched(false);
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

        // console.log("Sub Workspaces Response:", response.data);

        // Assuming response.data.subWorkspaces contains the list of sub-workspaces
        setSubWorkspaces(response.data || []);
        dispatch(setSubWorkspaceContents(response.data || []));
      } catch (error) {
        console.error("Error fetching sub-workspaces:", error);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    }
  };
  useEffect(() => {
    fetchSubWorkspaces();
  }, [parentId]);

  const isCreateContentDisabled = (contentName: string) => {
    if (contentName === "Flatfile") {
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

    try {
      setIsLoading(true);
      setIsModalOpen(false);
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
        // console.log(`${modalType} created successfully`);
        setWorkspaceName("");
      } else {
        console.error(
          `Failed to create ${modalType}:`,
          response.data?.detail || "Unknown error"
        );
      }
    } catch (error) {
      console.error(`Error creating ${modalType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = (contentType: any) => {
    switch (contentType) {
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
            childWorkspaceName: childWorkspaceName,
          },
        });
        break;
      case "Dataset":
        navigate(`/newdataset/${parentId}`, {
          state: {
            mode: mode,
            parentId: parentId,
            workspaceName: parentWorkspaceName,
            childWorkspaceName: childWorkspaceName,
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
            childWorkspaceName: childWorkspaceName,
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

  useEffect(() => {
    if (subWorkspaces) {
      setFilterOptions({
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
        setPlaceholder("Search Workspaces");
        setTooltipText("Filtered by Workspaces");
        contentType = 1;
        break;
      case "dbconnection":
        setPlaceholder("Search Databases");
        setTooltipText("Filtered by Databases");
        contentType = 2;
        break;
      case "dataset":
        setPlaceholder("Search Datasets");
        setTooltipText("Filtered Datasets");
        contentType = 3;
        break;
      case "flatfile":
        setPlaceholder("Search Flatfiles");
        setTooltipText("Filtered Flatfiles");
        contentType = 4;
        break;
      case "playbook":
        setPlaceholder("Search Playbooks");
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

  const openAccessModal = (workspaceId: any) => {
    // navigate(`/content/access/${parentId}`, { state: { workspaceId } });
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

  const handleSort = (key: any) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredWorkspaces = React.useMemo(() => {
    if (!filteredWorkspaces || !Array.isArray(filteredWorkspaces)) {
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
            alt="Folder Icon"
          />
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
              {childWorkspaceName}
            </h3>
          </div>
        </div>

        <div className="subworkspace-button-add-search-container">
          <div className="subworkspace-action-buttons">
            <div className={styles.dropdown}>
              {!hideNewIcon && !isLoading && (
                <button
                  className={`${styles.createWorkspace} create-workspace`}
                >
                  <img
                    className="addIcon addIconDefault"
                    src="/add_green.png"
                    alt="Add Users Logo"
                    style={{
                      width: "16px",
                      height: "16px",
                      fontSize: fontSize.medium,
                    }}
                  />
                  &nbsp;New
                </button>
              )}
              <div className={styles.dropdownContent}>
                {[
                  { name: "Flatfile", icon: getImageSrc(4) },
                  { name: "DB Connection", icon: getImageSrc(2) },
                  { name: "Dataset", icon: getImageSrc(3) },
                  { name: "Playbook", icon: getImageSrc(5) },
                ].map((item) => (
                  <button
                    key={item.name}
                    style={{
                      display: "flex",
                      // color: palette.primary.contrastText,
                      fontSize: fontSize.medium,
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
                        navigateToPages(item.name);

                        if (item.name === "Workspace") {
                          setIsModalOpen(true);
                        }
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
                              color: palette.primary.contrastText,
                              fontSize: fontSize.medium,
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

        {selectedSubworkspaces.length > 0 && (
          <div className='subWorkspaceActionsCountContainer'>    
          <p style={{ cursor: 'pointer', marginLeft: "10px" }} onClick={() => setSelectedSubworkspaces([])}>Deselect All</p>
          <span>{subWorkspaces.length > 0 && `${selectedSubworkspaces.length} selected`}</span>
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
                    <ul className={styles.filterDropdownContent}>
                      <li
                        onClick={() => handleFilterChange("")}
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                      >
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> All
                      </li>

                      <li
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                        onClick={() => handleFilterChange("dbconnection")}
                        className={
                          !filterOptions.dbconnection
                            ? styles.disabledOption
                            : ""
                        }
                      >
                        <img src="/database_icon.svg"></img>Database{" "}
                      </li>

                      <li
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                        onClick={() => handleFilterChange("dataset")}
                        className={
                          !filterOptions.dataset ? styles.disabledOption : ""
                        }
                      >
                        {/* <SchemaIcon
                          style={{
                            marginRight: "18px",
                            transform: "translateY(2px)",
                            color: "#616164",
                            width: "14px",
                            height: "15px",
                          }}
                        ></SchemaIcon> */}
                        <img src="/ds.svg" alt="Dataset"></img>
                        Dataset
                      </li>

                      <li
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                        onClick={() => handleFilterChange("flatfile")}
                        className={
                          !filterOptions.flatfile ? styles.disabledOption : ""
                        }
                      >
                        <img src="/flat_file_icon.svg"></img>Flatfile
                      </li>

                      <li
                        style={{
                          fontSize: fontSize.medium,
                          color: palette.primary.contrastText,
                        }}
                        onClick={() => handleFilterChange("playbook")}
                        className={
                          !filterOptions.playbook ? styles.disabledOption : ""
                        }
                      >
                        <img src="/playbook_icon.svg"></img>Playbook
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
            <div className={styles.spinner}></div>
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

              {/* <thead>
              <tr>
                <th style={{ width: "80px", paddingLeft: "60px" }}></th>
                <th style={{ paddingLeft: "50px" }}>Name</th>
                <th style={{ paddingLeft: "50px" }}>Type</th>
                <th style={{ paddingLeft: "50px" }}>Modified</th>
              </tr>
            </thead> */}
              <tbody>
                {!sortedAndFilteredWorkspaces ? (
                  <></>
                ) : sortedAndFilteredWorkspaces?.length > 0 ? (
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
                          {/* <input
                          type="checkbox"
                          checked={selectedSubworkspaces.includes(workspace.id)}
                          onChange={() =>
                            handleWorkspaceSelection(workspace.id)
                          }
                          style={{ width: "16px", height: "16px" }}
                        /> */}
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
                          {/* )} */}
                        </td>

                        <td
                          style={{
                            fontSize: fontSize.medium,
                            color: palette.primary.contrastText,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "9.5rem",
                          }}
                        >
                          {workspace.name}
                        </td>

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
                          {workspace.roleId <= 8 && (
                            <div className="subworkspace-img-icon">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToEditPages(workspace);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                }}
                              >
                                <Tooltip title="View / Edit ">
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

                              {
                                // workspace.contentType === 1 &&
                                // workspace.roleId < 5 ||
                                (workspace.levelId && workspace.levelId < 3) ||
                                workspace.roleId === 8 ? (
                                  <>
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
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                      </Tooltip>
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // handleDeleteWorkspace(workspace.id);
                                        // deleteWorkspace(workspace.id,workspace.name)
                                        if (workspace.contentType !== 1) {
                                          deleteContent(workspace);
                                        }
                                      }}
                                      style={{
                                        background: "none",
                                        border: "none",
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
                                            width: "17px",
                                            height: "17px",
                                          }}
                                        />
                                      </Tooltip>
                                    </button>

                                    {workspace.roleId < 5 ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openAccessModal(workspace.id);
                                        }}
                                        style={{
                                          background: "none",
                                          border: "none",
                                        }}
                                      >
                                        <Tooltip title="Manage Access">
                                          <img
                                            src={
                                              hoveredRowId === workspace.id
                                                ? "/access.png"
                                                : "/access_white.png"
                                            }
                                            alt="Access"
                                            style={{
                                              marginBottom: "-2.5px",
                                              width: "20px",
                                              height: "20px",
                                            }}
                                          />
                                        </Tooltip>
                                      </button>
                                    ) : (
                                      <button
                                        style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "not-allowed",
                                        }}
                                      >
                                        <Tooltip title="Manage Access">
                                          <img
                                            src={"/access_white.png"}
                                            alt="Access"
                                            style={{
                                              marginBottom: "-2.5px",
                                              width: "20px",
                                              height: "20px",
                                              pointerEvents: "none",
                                            }}
                                          />
                                        </Tooltip>
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <button
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "not-allowed",
                                      }}
                                    >
                                      <Tooltip title="Rename">
                                        <img
                                          src={"/edit_white.png"}
                                          alt="Edit"
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                            pointerEvents: "none",
                                          }}
                                        />
                                      </Tooltip>
                                    </button>

                                    <button
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "not-allowed",
                                      }}
                                    >
                                      <Tooltip title="Delete">
                                        <img
                                          src={"/delete_white.png"}
                                          alt="Delete"
                                          style={{
                                            width: "17px",
                                            height: "17px",
                                            pointerEvents: "none",
                                          }}
                                        />
                                      </Tooltip>
                                    </button>

                                    <button
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "not-allowed",
                                      }}
                                    >
                                      <Tooltip title="Manage Access">
                                        <img
                                          src={"/access_white.png"}
                                          alt="Access"
                                          style={{
                                            marginBottom: "-2.5px",
                                            width: "20px",
                                            height: "20px",
                                            pointerEvents: "none",
                                          }}
                                        />
                                      </Tooltip>
                                    </button>
                                  </>
                                )
                              }
                            </div>
                          )}
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
        {/* Edit Workspace Modal  */}
        {isEditModalOpen ? (
          <div className={styles.subworkspaceModal}>
            <div className={styles.subworkspaceModalContent}>
              <h3
                style={{
                  fontSize: fontSize.large,
                  color: palette.primary.contrastText,
                }}
              >
                Rename
              </h3>
              <div className={styles.subworkspaceModalContentInput}>
                <input
                  type="text"
                  style={{
                    fontSize: fontSize.medium,
                    color: palette.primary.contrastText,
                  }}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Workspace Name"
                />
                {errorMessage && (
                  <div className={styles.errorMessage}>{errorMessage}</div>
                )}
              </div>
              <br />
              <br />
              <div className={styles.subworkspaceModalButtons}>
                <button
                  className={styles.subworkspaceModalCancel}
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setErrorMessage("");
                  }}
                  style={{ fontSize: fontSize.medium }}
                >
                  Cancel
                </button>
                <button
                  className={styles.workspaceSaveButton}
                  onClick={handleEditWorkspace}
                  style={{ fontSize: fontSize.medium }}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Name your {modalType}</h3>
            <input
              type="text"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder={`Enter ${modalType} name`}
            />
            <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button lassName={styles.saveButton} onClick={handleCreateItem}>Create</button>

          </div>
        </div>
      )}  */}

        <Dialog open={!!showContentDeleteConfirmation} onClose={cancelDelete}>
          {showContentDeleteConfirmation ? (
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
          ) : null}
        </Dialog>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3
                style={{
                  fontSize: fontSize.large,
                  color: palette.primary.contrastText,
                }}
              >
                Name your {modalType}
              </h3>
              <input
                type="text"
                required
                style={{
                  fontSize: fontSize.medium,
                  color: palette.primary.contrastText,
                }}
                // value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder={`Enter ${modalType} name`}
              />
              {/* Error message section */}
              {/* {errorMessage && (
              <div className={styles.errorMessage}>
                {errorMessage}
              </div> 
            )} */}
              <div className="modal-buttons">
                <button
                  className="modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                  style={{ fontSize: fontSize.medium }}
                >
                  Cancel
                </button>
                <button
                  className="modal-create"
                  onClick={handleCreateItem}
                  style={{ fontSize: fontSize.medium }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default SubWorkspaceDetails;
