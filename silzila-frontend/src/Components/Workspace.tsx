import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import styles from "./workspace.module.css";
import "./allPages.css";
import { Link, useNavigate } from "react-router-dom";
import { AlertColor, Tooltip, Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { jwtDecode } from "jwt-decode";
import DatabaseConnectionDialogComponents from "./DataConnection/DatabaseConnectionDialogComponents";
import { serverEndPoint } from "./ServerCall/EnvironmentVariables";

import FetchData from "./ServerCall/FetchData";
import { setEditApiResponse } from "../redux/FlatFile/FlatFileStateActions";
import { fontSize, palette } from "..";
import { useDispatch } from "react-redux";
import { setWorkspaces as reduxSetWorkspaces } from "../redux/Permissions/permissions.action";
import { isNameAllowed } from "./CommonFunctions/CommonFunctions";
import { messages } from "./CommonFunctions/aliases";

const WorkspaceList = () => {
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [editWorkspaceId, setEditWorkspaceId] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  // const [workspace, setWorkspaces] = useState([]);

  // Assume you get the token from localStorage or any auth service
  const token = localStorage.getItem("accessToken");
  let access: any = null;

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      access = decodedToken.access; // Access could be 'user' or 'admin'
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [workspaceIndexToDelete, setWorkspaceIndexToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "workspace",
    direction: "asc",
  }); // state for sorting
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const [severity, setSeverity] = useState<AlertColor>("success");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("Testing alert");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const dispatch = useDispatch();
  // const fetcher = (url: any) =>
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => res.data);
  // const fetcher = (url: any) =>
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       console.log('Response:', res);  // Log the full response
  //       return res.data;  // Return the data as usual
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);  // Log any errors
  //       throw error;  // Rethrow the error
  //     });

  // // Use SWR for fetching workspaces
  // const {
  //   data: workspaces = [],
  //   error,
  //   isLoading,
  //   // mutate,
  // } = useSWR(`${serverEndPoint}workspace`, fetcher);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "GET",
        url: "workspace",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status) {
        setWorkspaces(response.data);
        sessionStorage.setItem("workspaces", JSON.stringify(response.data));
        dispatch(reduxSetWorkspaces(response.data));
      } else {
        setError(response.data.detail || "Failed to fetch workspaces");
      }
      // console.log(workspacess);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching workspaces");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(fetchWorkspaces, 2000);

    //fetchWorkspaces();
  }, []);

  const handleWorkspaceClick = (wid: any, wname: any) => {
    navigate(`/workspace/${wid}`, { state: { wname } });
  };

  // const handleCreateWorkspace = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://dev.silzila.com/api/workspace/create",
  //       {
  //         name: workspaceName,
  //         parentId: parentId || null,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Workspace created successfully");
  //       mutate();
  //       setIsModalOpen(false);
  //       setIsDropdownOpen(false);
  //       setWorkspaceName("");
  //     } else {
  //       console.error("Failed to create workspace");
  //     }
  //   } catch (error) {
  //     console.error("Error creating workspace:", error);
  //   }
  // };
  const handleCreateWorkspace = async () => {
    const isValidName = isNameAllowed(workspaceName);

    if (!isValidName) {
      setErrorMessage(messages.workspace.wrongName);
      return;
    }
    setIsLoading(true);
    try {
      const response = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "workspace/create",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: {
          name: workspaceName,
          parentId: parentId || null,
        },
      });

      if (response.status) {
        console.log("Workspace created successfully");
        // mutate();
        fetchWorkspaces();
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setWorkspaceName("");
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message || "Failed to create workspace.");
        console.error("Failed to create workspace:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkspaces = React.useMemo(() => {
    return workspaces.filter((workspace: any) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workspaces, searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectAll = () => {
    setSelectedWorkspaces(workspaces.map((workspace: any) => workspace.id));
  };

  const sortedAndFilteredWorkspaces = React.useMemo(() => {
    let sortedItems = [...filteredWorkspaces];
    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "workspace") {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (sortConfig.key === "created at") {
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
        } else if (sortConfig.key === "created by") {
          aValue = a.createdBy.toLowerCase();
          bValue = b.createdBy.toLowerCase();
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

  const handleWorkspaceSelection = (id: string) => {
    if (selectedWorkspaces.includes(id)) {
      // If already selected, remove it from the list
      setSelectedWorkspaces(
        selectedWorkspaces.filter((workspaceId) => workspaceId !== id)
      );
    } else {
      // Otherwise, add it to the list
      setSelectedWorkspaces([...selectedWorkspaces, id]);
    }
  };

  // const handleEditWorkspace = async () => {
  //   try {
  //     const response = await axios.put(
  //       "https://dev.silzila.com/api/workspace/update",
  //       {
  //         workspaceId: editWorkspaceId,
  //         name: workspaceName,
  //         parentId: parentId,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );

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
    setIsLoading(true);
    try {
      const response = await FetchData({
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
      if (response.data === "Name is already taken") {
        setErrorMessage(
          "A workspace exists with the same name. Please try other names."
        );
        setWorkspaceName(""); // Reset the workspace name
      } else if (response.status) {
        console.log("Workspace updated successfully");
        fetchWorkspaces();
        // mutate();
        setIsEditModalOpen(false);
        setWorkspaceName("");
        setEditWorkspaceId(null);
      } else {
        console.error(
          "Failed to update workspace:",
          response.data.detail || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkspace = (index: any, name: any) => {
    setWorkspaceIndexToDelete(index);
    setWorkspaceName(name);
    setShowDeleteConfirmation(true);
  };
  // const confirmDeleteUser = async () => {
  //     try {
  //         const userToDelete = users[userIndexToDelete];
  //         if (!userToDelete.id) throw new Error("User ID is missing");

  //         await axiosInstance.delete(`${serverEndPoint}user/delete/${userToDelete.id}`);
  //         const updatedUsers = users.filter((_, i) => i !== userIndexToDelete);
  //         setUsers(updatedUsers);
  //     } catch (error) {
  //         console.error('There was an error deleting the user:', error);
  //         alert('Error deleting user. Please try again.');
  //     } finally {
  //         setShowDeleteConfirmation(false);
  //         setUserIndexToDelete(null);
  //     }
  // };
  // const handleDeleteWorkspace = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `https://dev.silzila.com/api/workspace/delete/${workspaceIndexToDelete}`,
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
  //     setWorkspaceIndexToDelete(null);
  //   }
  // };

  const handleDeleteWorkspace = async () => {
    let canDelete = true;

    setIsLoading(true);
    try {
      const response = await FetchData({
        requestType: "noData",
        method: "GET",
        url: `workspace/${workspaceIndexToDelete}`,
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
        setWorkspaceIndexToDelete(null);
      }
    }

    if (canDelete) {
      try {
        const response = await FetchData({
          requestType: "withData",
          method: "DELETE",
          url: `workspace/${workspaceIndexToDelete}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.status) {
          console.log("Workspace deleted successfully");
          fetchWorkspaces();
          // mutate();
        } else {
          console.error(
            "Failed to delete workspace:",
            response.data.detail || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error deleting workspace:", error);
      } finally {
        setIsLoading(false);
        setShowDeleteConfirmation(false);
        setWorkspaceIndexToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setWorkspaceIndexToDelete(null);
  };

  const openEditModal = (id: any, currentName: any, currentParentId: any) => {
    setEditWorkspaceId(id);
    setWorkspaceName(currentName);
    setParentId(currentParentId);
    setIsEditModalOpen(true);
  };

  const openAccessModal = (workspaceId: any) => {
    // navigate(`/workspace/access/${parentId}`, { state: { workspaceId } });
    navigate(`/workspace/access/${workspaceId}`, { state: { parentId } });
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
          Error loading workspaces.
        </p>
      </div>
    );

  return (
    <div className={`${styles.workspaceContainer} workspace-container`}>
      <div
        className="heading"
        style={{
          height: "50px",
          border: "1px solid transparent",
          visibility: "hidden",
        }}
      >
        <img
          src="/user.png"
          alt="Users"
          style={{ width: "24px", height: "24px" }}
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
            Users
          </h3>
        </div>
      </div>

      {/* <Link to="/admin/users">
        <button className={styles.backLink}>Back</button>
      </Link> */}
      <div className="workspace-button-add-search-container">
        <div className="workspace-action-buttons">
          {(access === "community" ||
            access === "account_admin" ||
            access === "admin" ||
            workspaces.some(
              (workspace: any) =>
                (workspace.roleId < 3 && workspace.roleId > 0) ||
                workspace.roleId === 8
            )) &&
            !isLoading && (
              <div
                className={styles.dropdown}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className={`${styles.createWorkspace} create-workspace`}
                  // onClick={() => setIsModalOpen(true)}
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

                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => setIsModalOpen(true)}
                      style={{
                        color: palette.primary.contrastText,
                        fontSize: fontSize.medium,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="folder_work.svg"
                        alt="Folder Icon"
                        style={{
                          width: "17px",
                          height: "17px",
                          color: palette.primary.contrastText,
                          fontSize: fontSize.medium,
                        }}
                        className={styles.dropdownIcon}
                      ></img>
                      Workspace
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>

        <div className="workspaceSelectActionContainer">
          <div className="workspaceActionsContainer">
            {/* Future Update
        <p onClick={handleSelectAll} style={{ cursor: 'pointer' }}>
          Select All
        </p>

        {selectedWorkspaces.length > 0 && (
          <div className='workspaceActionsCountContainer'>    
          <p onClick={() => setSelectedWorkspaces([])} style={{ cursor: 'pointer', marginLeft: "10px" }}>Deselect All</p>
          <span>{selectedWorkspaces.length > 0 && `${selectedWorkspaces.length} selected`}</span>
          <p style={{ marginLeft: "10px" }}>Actions</p>
          </div>
        )}*/}
          </div>

          <div className="workspaceSearchContainer">
            <input
              type="text"
              placeholder="Search Workspace"
              value={searchQuery}
              onChange={handleSearch}
              style={{
                color: palette.primary.contrastText,
                fontSize: fontSize.medium,
              }}
              className="workspaceSearchInput"
            />
            <img
              src="/glass.png"
              alt="Search Icon"
              className="workspaceSearchIcon"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : workspaces.length === 0 && searchQuery.length === 0 ? (
        <div className="no-user-info">
          <p
            className="loading-default-text"
            style={{
              color: palette.primary.contrastText,
              fontSize: fontSize.medium,
            }}
          >
            Currently, there are no workspaces created.
          </p>
        </div>
      ) : (
        <div className="workspace-tableContainer">
          <table className={`${styles.workspaceTable} workspace-table`}>
            <thead>
              <tr>
                <th></th>

                <th style={{ fontSize: fontSize.medium }}>Type</th>

                <th
                  onClick={() => handleSort("workspace")}
                  style={{ fontSize: fontSize.medium }}
                >
                  Workspace{" "}
                  <span className="icon-wrapper">
                    {getSortIcon("workspace")}
                  </span>
                </th>

                <th
                  onClick={() => handleSort("created by")}
                  style={{ fontSize: fontSize.medium }}
                >
                  Created by{" "}
                  <span className="icon-wrapper">
                    {getSortIcon("created by")}
                  </span>
                </th>

                <th
                  onClick={() => handleSort("created at")}
                  style={{ fontSize: fontSize.medium }}
                >
                  Created at{" "}
                  <span className="icon-wrapper">
                    {getSortIcon("created at")}
                  </span>
                </th>

                <th style={{ fontSize: fontSize.medium }}>Actions</th>
              </tr>
            </thead>

            {sortedAndFilteredWorkspaces.length === 0 &&
            searchQuery.length !== 0 ? (
              <div className="no-user-info-insideTable">
                <p
                  className="loading-default-text"
                  style={{
                    fontSize: fontSize.medium,
                    color: palette.primary.contrastText,
                  }}
                >
                  No workspace found.
                </p>
              </div>
            ) : (
              <tbody>
                {sortedAndFilteredWorkspaces.map((workspace) => (
                  <tr
                    key={workspace.id}
                    onMouseEnter={() => setHoveredRowId(workspace.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    className={
                      selectedWorkspaces.includes(workspace.id)
                        ? "selectedRow"
                        : ""
                    }
                  >
                    <td>
                      {/* <input
                        type="checkbox"
                        checked={selectedWorkspaces.includes(workspace.id)}
                        onChange={() => handleWorkspaceSelection(workspace.id)}
                        style={{ width: "16px", height: "16px" }}
                      /> */}
                    </td>

                    <td>
                      <img
                        src="/folder_work.svg"
                        className={styles.icon}
                        style={{ width: "17px", height: "17px" }}
                        alt="Folder Icon"
                      />
                    </td>

                    <td
                      className={styles.nameHyperlink}
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                      onClick={() =>
                        handleWorkspaceClick(workspace.id, workspace.name)
                      }
                    >
                      {workspace.name}
                    </td>

                    <td
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    >
                      {workspace.createdBy}
                    </td>

                    <td
                      style={{
                        fontSize: fontSize.medium,
                        color: palette.primary.contrastText,
                      }}
                    >
                      {" "}
                      {workspace.createdAt
                        ? formatDistanceToNow(new Date(workspace.createdAt), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </td>

                    <td>
                      {(workspace.roleId < 3 && workspace.roleId > 0) ||
                      workspace.roleId === 8 ? (
                        <div className="workspace-img-icon">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(
                                workspace.id,
                                workspace.name,
                                workspace.parentId
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
                              deleteWorkspace(workspace.id, workspace.name);
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
                                  marginTop: "1px",
                                  width: "17px",
                                  height: "17px",
                                  fontSize: fontSize.medium,
                                  color: palette.primary.contrastText,
                                }}
                              />
                            </Tooltip>
                          </button>

                          {workspace.roleId < 3 && workspace.roleId > 0 ? (
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
                        </div>
                      ) : (
                        <div className="workspace-img-icon">
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
                                  marginTop: "1px",
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
                                  marginTop: "1px",
                                  width: "17px",
                                  height: "17px",
                                  fontSize: fontSize.medium,
                                  color: palette.primary.contrastText,
                                  pointerEvents: "none",
                                }}
                              />
                            </Tooltip>
                          </button>

                          {workspace.roleId < 3 && workspace.roleId > 0 ? (
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      )}

      <Dialog open={showDeleteConfirmation} onClose={cancelDelete}>
        <div className="workspace-remove-modal">
          <div className="workspace-remove-modalContent-close">
            <Tooltip title="Close">
              <CloseIcon
                onClick={() => setShowDeleteConfirmation(false)}
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

          <div className="workspace-remove-modalContent-Buttons">
            <button
              onClick={cancelDelete}
              className="workspace-remove-modalCancel"
              style={{ fontSize: fontSize.medium }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteWorkspace}
              className="workspace-remove-modalConfirm"
              style={{ fontSize: fontSize.medium }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className={styles.workspaceModal}>
          <div className={styles.workspaceModalContent}>
            <h3
              style={{
                fontSize: fontSize.large,
                color: palette.primary.contrastText,
              }}
            >
              Create Workspace
            </h3>
            <div className={styles.workspaceModalContentInput}>
              <input
                type="text"
                // value={""}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Workspace Name"
                style={{
                  fontSize: fontSize.medium,
                  color: palette.primary.contrastText,
                }}
              />
            </div>
            {/* Error message section */}
            {errorMessage && (
              <div
                className={styles.errorMessage}
                style={{
                  fontSize: fontSize.medium,
                  color: palette.primary.contrastText,
                }}
              >
                {errorMessage}
              </div>
            )}
            <div className={styles.workspaceModalButtons}>
              <button
                className={styles.workspaceModalCancel}
                onClick={() => {
                  setIsModalOpen(false);
                  setErrorMessage("");
                }}
                style={{ fontSize: fontSize.medium }}
              >
                Cancel
              </button>
              <button
                className={styles.workspaceSaveButton}
                onClick={handleCreateWorkspace}
                style={{ fontSize: fontSize.medium, color: "white" }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal  */}
      {isEditModalOpen && (
        <div className={styles.workspaceModal}>
          <div className={styles.workspaceModalContent}>
            <h3
              style={{
                fontSize: fontSize.large,
                color: palette.primary.contrastText,
              }}
            >
              Rename
            </h3>
            <div className={styles.workspaceModalContentInput}>
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
                <p style={{ color: "red", fontSize: fontSize.small }}>
                  {errorMessage}
                </p>
              )}
            </div>
            <div className={styles.workspaceModalButtons}>
              <button
                className={styles.workspaceModalCancel}
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
  );
};

export default WorkspaceList;

// 'use client'
// import React, { useState } from "react";
// import useSWR from "swr";
// import axios from "axios";
// import styles from "./workspace.module.css";
// import { Link } from "react-router-dom";
// const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhY2hpbnR5YS5yYWpAc2lsemlsYS5jb20iLCJhdWRpZW5jZSI6IndlYiIsImFjY2VzcyI6ImFjY291bnRfYWRtaW4iLCJpYXQiOjE3MjM2MTczOTQsInRlbmFudCI6InNpbHppbGEiLCJleHAiOjE3MjM2NzQ5OTR9.w7A0D0KnMrrhwQV02-c6n4psUohlZw92C0t3JOlMkTqrcE9HuLuPVqhBNBQ-RbnNQNvGl_sGRy_DdIAIGgEacQ";
// localStorage.setItem('accessToken', token)
// // Define a fetcher function using axios
// const fetcher = (url) =>
//   axios
//     .get(url, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         "Content-Type": "application/json",
//       },
//     })
//     .then((res) => res.data);

// const WorkspaceList = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [workspaceName, setWorkspaceName] = useState("");
//   const [editWorkspaceId, setEditWorkspaceId] = useState(null);
//   const [parentId, setParentId] = useState(null);
//   const [hoveredRowId, setHoveredRowId] = useState(null);

//   // Use SWR for fetching workspaces
//   const { data: workspaces = [], error, isLoading, mutate } = useSWR(
//     "${serverEndPoint}workspace",
//     fetcher
//   );

// const handleCreateWorkspace = async () => {
//   try {
//     const response = await axios.post(
//       "${serverEndPoint}workspace/create",
//       {
//         name: workspaceName,
//         parentId: parentId || null,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       console.log("Workspace created successfully");
//       // Mutate the SWR cache to update workspaces
//       mutate();
//       setIsModalOpen(false); // Close the modal
//       setWorkspaceName(""); // Reset the workspace name
//     } else {
//       console.error("Failed to create workspace");
//     }
//   } catch (error) {
//     console.error("Error creating workspace:", error);
//   }
// };

// const handleEditWorkspace = async () => {
//   try {
//     const response = await axios.put(
//       "${serverEndPoint}workspace/update",
//       {
//         workspaceId: editWorkspaceId,
//         name: workspaceName,
//         parentId: parentId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       console.log("Workspace updated successfully");
//       mutate(); // Mutate the SWR cache to update workspaces
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

// const handleDeleteWorkspace = async (id) => {
//   try {
//     const response = await axios.delete(
//       `${serverEndPoint}workspace/delete/${id}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }
//     );

//     if (response.status === 200) {
//       console.log("Workspace deleted successfully");
//       mutate(); // Mutate the SWR cache to update workspaces
//     } else {
//       console.error("Failed to delete workspace");
//     }
//   } catch (error) {
//     console.error("Error deleting workspace:", error);
//   }
// };

// const openEditModal = (id, currentName, currentParentId) => {
//   setEditWorkspaceId(id);
//   setWorkspaceName(currentName);
//   setParentId(currentParentId);
//   setIsEditModalOpen(true);
// };

//   if (error) return <p>Error loading workspaces.</p>;

//   return (
//     <>
//       <Link to="/admin/users">
//         <button className={styles.backLink}>Back</button>
//       </Link>
//       {/* <div className={styles.actionButtons}>
//         <button
//           className={styles.createWorkspace}
//           onClick={() => setIsModalOpen(true)}
//         >
//           <img
//             className="addIcon addIconDefault"
//             src="/add.png"
//             alt="Add Users Logo"
//             width={20}
//             height={20}
//           />
//           Create Workspace
//         </button>
//       </div> */}
//       <div className={styles.workspaceList}>
//         {isLoading ? (
//           <p>Loading workspaces...</p>
//         ) : workspaces.length === 0 ? (
//           <p className={styles.noWorkspaces}>
//             Currently, there are no workspaces created.
//           </p>
//         ) : (
//           <table className={styles.workspaceTable}>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Workspace</th>
//                 {/* <th className={styles.icons}><img src='/subworkspace.png' alt='' height={20} width={20} /></th>
//                 <th className={styles.icons}><img src='/database_header.png' alt='' height={20} width={20} /></th>
//                 <th className={styles.icons}><img src='/dataset_header.png' alt='' height={20} width={20} /></th>
//                 <th className={styles.icons}><img src='/flatfile_header.png' alt='' height={20} width={20} /></th>
//                 <th className={styles.icons}><img src='/playbook_header.png' alt='' height={20} width={20} /></th> */}
//                 <th>Modified at</th>
//                 <th>Modified by</th>
//                 {/* <th>Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {workspaces.map((workspace) => (
//                 <tr
//                   key={workspace.id}
//                   onMouseEnter={() => setHoveredRowId(workspace.id)}
//                   onMouseLeave={() => setHoveredRowId(null)}
//                 >
//                   <td><img src='/open_folder.png' className={styles.icon} height={20} width={20}></img></td>
//                   <td>
//                     <Link to={`/subworkspace/${workspace.id}`}>
//                       {workspace.name}
//                     </Link>
//                   </td>
//                   {/* <td>{workspace.subWorkspaceCount}</td>
//                   <td>{workspace.dbConnectionCount}</td>
//                   <td>{workspace.datasetCount}</td>
//                   <td>{workspace.flatfileCount}</td>
//                   <td>{workspace.playbookCount}</td> */}
//                   <td>{workspace.createdAt}</td>
//                   <td>{workspace.createdBy}</td>
//     {/* <td>
//       <img
//         src={
//           hoveredRowId === workspace.id
//             ? "/edit.png"
//             : "/edit_white.png"
//         }
//         alt="Edit"
//         className={`${styles.actionIcon} ${styles.editIcon}`}
//         onClick={(e) => {
//           e.stopPropagation();
//           openEditModal(
//             workspace.id,
//             workspace.workspaceName,
//             workspace.parentId
//           );
//         }}
//         height={20}
//         width={20}
//       />
//       <img
//         src={
//           hoveredRowId === workspace.id
//             ? "/delete.png"
//             : "/delete_white.png"
//         }
//         alt="Delete"
//         className={`${styles.actionIcon} ${styles.deleteIcon}`}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleDeleteWorkspace(workspace.id);
//         }}
//         height={20}
//         width={20}
//       />
//     </td> */}
//   </tr>
// ))}

//             </tbody>
//           </table>
//         )}
//       </div>
// {/* Create Workspace Modal */}
// {isModalOpen && (
//   <div className={styles.modal}>
//     <div className={styles.modalContent}>
//       <h2>Create Workspace</h2>
//       <input
//         type="text"
//         value={workspaceName}
//         onChange={(e) => setWorkspaceName(e.target.value)}
//         placeholder="Workspace Name"
//       />
//       <button onClick={handleCreateWorkspace}>Create</button>
//       <button onClick={() => setIsModalOpen(false)}>Cancel</button>
//     </div>
//   </div>
// )}

// {/* Edit Workspace Modal */}
// {isEditModalOpen && (
//   <div className={styles.modal}>
//     <div className={styles.modalContent}>
//       <h2>Edit Workspace</h2>
//       <input
//         type="text"
//         value={workspaceName}
//         onChange={(e) => setWorkspaceName(e.target.value)}
//         placeholder="Workspace Name"
//       />
//       <button onClick={handleEditWorkspace}>Save</button>
//       <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
//     </div>
//   </div>
// )}

//     </>
//   );
// };

// export default WorkspaceList;
