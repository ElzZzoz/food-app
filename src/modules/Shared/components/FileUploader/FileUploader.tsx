import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function FileUploader({
  onFileSelect,
  error,
  value,
  mode = "create",
}) {
  const [preview, setPreview] = useState("");

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    disabled: mode === "view",
    onDrop: (files) => {
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
  });

  console.log("Uploader value:", value);

  useEffect(() => {
    if (!value) {
      setPreview("");
      return;
    }

    let fileUrl;

    if (typeof value === "string") {
      setPreview(`https://upskilling-egypt.com:3006/${value}`);
    } else if (value instanceof File) {
      fileUrl = URL.createObjectURL(value);
      setPreview(fileUrl);
    }

    // cleanup only if File
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [value]);

  // VIEW MODE → show only image
  if (mode === "view") {
    return (
      <Box sx={{ my: 2, textAlign: "center" }}>
        {preview ? (
          <img
            src={preview}
            alt="Recipe"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="body2">No image available</Typography>
        )}
      </Box>
    );
  }

  // CREATE / UPDATE MODE → uploader
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
      <input {...getInputProps()} />

      <FontAwesomeIcon
        icon={faArrowUpFromBracket}
        size="2x"
        style={{
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

      {preview && (
        <Box sx={{ mt: 2 }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </Box>
      )}

      {acceptedFiles.length > 0 && (
        <Typography variant="body2" sx={{ mt: 1 }}>
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
