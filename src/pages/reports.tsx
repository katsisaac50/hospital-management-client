import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';

// Define the structure of the statistics data
interface Statistics {
  totalPatients: number;
  totalDoctors: number;
  totalRevenue: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ReportsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!token) {
        alert('Session expired or you are not logged in. Redirecting to login...');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/reports/statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatistics(response.data.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Hospital Reports
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Card sx={{ marginBottom: 3 }}>
            <CardHeader title="Statistics" />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Total Patients: {statistics?.totalPatients}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total Doctors: {statistics?.totalDoctors}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total Revenue: ${statistics?.totalRevenue}
              </Typography>
            </CardContent>
          </Card>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              href="/reports/doctor-reports"
            >
              Doctor Reports
            </Button>
            <Button
              variant="outlined"
              color="primary"
              href="/reports/patient-reports"
            >
              Patient Reports
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ReportsPage;
