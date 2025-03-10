import { useState } from "react";
import { UseMutationResult } from '@tanstack/react-query';
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

interface AddTestResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTests: Test[];
  newTest: Test | null;
  setNewTest: (test: Test | null) => void;
  newResult: string;
  setNewResult: React.Dispatch<React.SetStateAction<string>>;
  addTestMutation: UseMutationResult<void, Error, void>; 
}interface Test {
  _id: string;
  testName: string;
  category?: string;
};

const AddTestResultModal: React.FC<AddTestResultModalProps> = ({
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
              onChange={(e) => {
                const selectedTest = availableTests.find(test => test._id === e.target.value);
                setNewTest(selectedTest || null); // Only set the test if it's found, otherwise set to null
              }}
              variant="outlined"
              sx={{ borderRadius: "8px" }}
            >
              {availableTests.map((test, index) => (
                <MenuItem key={`${test._id}-${index}`} {...test} value={test._id}>
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
