import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'hospital.db', location: 'default' });

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS patients (id TEXT PRIMARY KEY, name TEXT, age INTEGER, diagnosis TEXT);'
    );
  });
};

export const savePatientOffline = (patient: any) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO patients (id, name, age, diagnosis) VALUES (?, ?, ?, ?)', [
      patient.id,
      patient.name,
      patient.age,
      patient.diagnosis,
    ]);
  });
};

export const getOfflinePatients = (callback: (patients: any[]) => void) => {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM patients', [], (_, results) => {
      const rows = results.rows.raw();
      callback(rows);
    });
  });
};
