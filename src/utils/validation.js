import { toast } from "react-toastify";

export const validateTestChange = (originalTest, newResult, testId) => {
    console.log("Original Test Data:", originalTest);

    // Find the correct test from the original test history
    const filteredOriginalTest = originalTest.find((test) => test._id === testId);

    console.log("Filtered Original Test:", filteredOriginalTest);

    if (!filteredOriginalTest) {
        toast.error("Test not found in original history.");
        return false;
    }

    // Check if either testStatus or result has changed
    console.log(newResult)
    if (filteredOriginalTest.testStatus === newResult || filteredOriginalTest.result === newResult) {
        toast.info("No changes detected.");
        return false; // Indicating no changes
    }

    return true; // Indicating changes detected
};

