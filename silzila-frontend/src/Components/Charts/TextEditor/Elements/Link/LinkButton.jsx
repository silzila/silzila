import { insertLink } from "../../utils/link.js";
import Button from "../../common/Button";
import Icon from "../../common/Icon";
import { isBlockActive } from "../../utils/SlateUtilityFunctions.js";
import "./styles.css"
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState } from "react";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const LinkButton = (props) => {
  const { editor } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInsertLink = () => {
    insertLink(editor, inputValue);
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label
            for="url-input"
            style={{ fontWeight: "bolder", fontSize: "500" }}
          >
            Enter URL
          </label>
          <input
            type="url"
            id="url-input"
            name="url-input"
            placeholder="example.com"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <Box sx={{ textAlign: "right" }}>
            <button
              onClick={handleInsertLink}
              variant="contained"
              style={{
                width: "fit-content",
                padding: "0.5rem 1rem",
                backgroundColor: "#2BB9BB",
                border: "none",
                color: "white",
              }}
            >
              Submit
            </button>
          </Box>
        </Box>
      </Modal>
      <Button
        active={isBlockActive(editor, "link")}
        format={"link"}
        onClick={() => setOpen(true)}
      >
        <Icon icon="link" />
      </Button>
    </>
  );
};

export default LinkButton;
