import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function FileUploader({ onFileSelect, error }) {
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => {
      if (files.length > 0) {
        onFileSelect(files[0]); // ✅ send file to form
      }
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #fff",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: "#8ee7b9",
        color: "#fff",
        "&:hover": { opacity: 0.9 },
      }}
    >
      {/* hidden input */}
      <input {...getInputProps()} />

      {/* Custom Icon */}
      <FontAwesomeIcon
        icon={faArrowUpFromBracket}
        size="2x"
        style={{
          //   backgroundColor: "#fff",
          color: "#009247",
          borderRadius: "50%",
          padding: "12px",
          cursor: "pointer",
          transition: "0.3s",
        }}
      />

      <Typography variant="body1" sx={{ mt: 1 }}>
        Drag & drop an image here, or click the icon
      </Typography>

      {acceptedFiles.length > 0 && (
        <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
          {acceptedFiles[0].name}
        </Typography>
      )}

      {error && (
        <Typography variant="body2" sx={{ mt: 1, color: "#ffdddd" }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
}
