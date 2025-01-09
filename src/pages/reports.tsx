import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Spin } from 'antd';

// Define the structure of the statistics data
interface Statistics {
  totalPatients: number;
  totalDoctors: number;
  totalRevenue: number;
}

const ReportsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null); // Use null initially to handle loading state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];

        if (!token) {
          alert('Session expired or you are not logged in. Redirecting to login...');
          window.location.href = '/login';
          return;
        }

        const response = await axios.get('http://localhost:5000/api/reports/statistics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setStatistics(response.data.data); // Typing this as Statistics
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hospital Reports</h2>
      {loading ? (
        <Spin tip="Loading statistics..." />
      ) : (
        <div className="reports-section">
          <Card title="Statistics" style={{ marginBottom: '20px' }}>
            <p>Total Patients: {statistics?.totalPatients}</p>
            <p>Total Doctors: {statistics?.totalDoctors}</p>
            <p>Total Revenue: ${statistics?.totalRevenue}</p>
          </Card>

          <Button type="primary" href="/reports/doctor-reports">
            Doctor Reports
          </Button>
          <Button type="default" href="/reports/patient-reports" style={{ marginLeft: '10px' }}>
            Patient Reports
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;