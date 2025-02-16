import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const AddTestResultModal = ({
  isOpen,
  onClose,
  availableTests,
  newTest,
  setNewTest,
  newResult,
  setNewResult,
  addTestMutation,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await addTestMutation.mutateAsync();
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            pb: 0,
            fontSize: "1.4rem",
          }}
        >
          Add New Test Result
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select Test</InputLabel>
            <Select
              value={newTest}
              onChange={(e) => setNewTest(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: "8px" }}
            >
              {availableTests.map((test) => (
                <MenuItem key={test._id} value={test._id}>
                  {test.testName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Result"
            value={newResult}
            onChange={(e) => setNewResult(e.target.value)}
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "8px", px: 3 }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ borderRadius: "8px", px: 3, minWidth: "100px" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </motion.div>
    </Dialog>
  );
};

export default AddTestResultModal;
