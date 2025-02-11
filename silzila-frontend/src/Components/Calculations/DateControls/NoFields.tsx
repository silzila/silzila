import { Box, Container, Typography } from "@mui/material";

interface INoFields {
  flowName: string;
}
const NoFields = ({ flowName }: INoFields) => {
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingInline: "0.5rem",
        margin: 0,
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          padding: "0",
          margin: "0",
          fontWeight: "bold",
          color: "gray",
          textAlign: "start",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            color: "gray",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "gray",
               
            }}
          >
            {flowName.replace(/\b\w/g, (char) => char.toUpperCase())}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            (0 of 0/0)
          </Typography>
        </Box>
      </Box>
      <p style={{ fontSize: "11px", color: "#999999", textAlign: "left" }}>
        No fields are required for{" "}
        <b> {flowName.replace(/\b\w/g, (char) => char.toUpperCase())}</b>
      </p>
    </Container>
  );
};

export default NoFields;
