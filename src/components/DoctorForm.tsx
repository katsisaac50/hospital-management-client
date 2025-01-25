import React from "react";
import { Grid, TextField } from "@mui/material";

interface DoctorFormValues {
  name: string;
  email: string;
  specialization: string;
  phone: string;
}

const labels: { [K in keyof DoctorFormValues]: string } = {
  name: "Name",
  email: "Email",
  specialization: "Specialization",
  phone: "Phone",
};

const DoctorForm: React.FC<{
  formValues: DoctorFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<DoctorFormValues>>;
  errors?: Partial<Record<keyof DoctorFormValues, string>>;
}> = ({ formValues, setFormValues, errors = {} }) => (
  <Grid container spacing={2}>
    {Object.entries(formValues).map(([key, value]) => (
      <Grid item xs={12} key={key}>
        <TextField
          label={labels[key as keyof DoctorFormValues]}
          fullWidth
          value={value}
          error={!!errors[key as keyof DoctorFormValues]}
          helperText={errors[key as keyof DoctorFormValues]}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [key]: e.target.value,
            })
          }
        />
      </Grid>
    ))}
  </Grid>
);

export default DoctorForm;