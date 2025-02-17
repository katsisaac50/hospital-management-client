import { toast } from "react-toastify";

export const validateTestChange = (originalTest, newResult) => {
  if (originalTest && originalTest.result === newResult) {
    toast.info("No changes detected.");
    return false; // Indicating no changes
  }
  return true; // Indicating changes detected
};
