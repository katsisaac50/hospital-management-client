import React, { ReactNode } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400, md: 500 }, // Responsive width
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: "90vh", // Prevents modal from exceeding viewport height
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close Button (Fixed Position) */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "background.paper",
            zIndex: 10,
            display: "flex",
            justifyContent: "flex-end",
            padding: 1,
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Subtle divider
          }}
        >
          <IconButton onClick={onClose} sx={{ color: "grey.600" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content Area (Scrollable) */}
        <Box
          sx={{
            padding: 2,
            overflowY: "auto",
            flexGrow: 1, // Makes it take up remaining space
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;