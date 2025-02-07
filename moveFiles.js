const fs = require('fs');
const path = require('path');

const structure = {
  'src': {
    'components': ['Button.tsx', 'FormField.tsx', 'Modal.tsx', 'Table.tsx'],
    'layouts': ['DashboardLayout.tsx', 'ModalLayout.tsx'],
    'modules': {
      'Patients': ['PatientList.tsx', 'PatientDetails.tsx', 'PatientForm.tsx'],
      'Appointments': [],
      'Billing': []
    },
    'hooks': ['usePatient.tsx', 'useForm.tsx', 'usePDF.tsx'],
    'services': ['patientService.ts', 'appointmentService.ts', 'billingService.ts'],
    'context': ['PatientContext.tsx', 'AppContext.tsx'],
    'utils': ['dateUtils.ts', 'validationUtils.ts'],
    'pages': ['index.tsx', 'patients.tsx', 'appointments.tsx'],
    'styles': ['globals.css', 'tailwind.config.js'],
    'config': ['apiConfig.ts', 'constants.ts']
  },
  'public': {
    'images': [],
    'icons': []
  }
};

const moveFile = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`Source file not found: ${src}`);
    return;
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.renameSync(src, dest);
  console.log(`Moved: ${src} -> ${dest}`);
};

const updateImports = (filePath, newPathPrefix) => {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Replace relative imports with new paths
  fileContent = fileContent.replace(/from '(\.\.\/[^']+)'/g, (match, p1) => {
    let newImportPath = path.join(newPathPrefix, p1).replace(/\\/g, '/');
    return `from '${newImportPath}'`;
  });
  
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Updated imports in: ${filePath}`);
};

const moveAndRefactor = () => {
  const rootDir = path.resolve(__dirname);

  // Move files and directories
  Object.keys(structure).forEach((dir) => {
    const dirPath = path.join(rootDir, dir);

    // Recursively move files for subdirectories
    if (typeof structure[dir] === 'object') {
      Object.keys(structure[dir]).forEach((subDir) => {
        const subDirPath = path.join(dirPath, subDir);
        fs.mkdirSync(subDirPath, { recursive: true });
        structure[dir][subDir].forEach((fileName) => {
          const src = path.join(rootDir, fileName);
          const dest = path.join(subDirPath, fileName);
          moveFile(src, dest);
        });
      });
    } else {
      structure[dir].forEach((fileName) => {
        const src = path.join(rootDir, fileName);
        const dest = path.join(dirPath, fileName);
        moveFile(src, dest);
      });
    }
  });

  // Update imports in files
  const srcDir = path.join(rootDir, 'src');
  fs.readdirSync(srcDir).forEach((dir) => {
    const dirPath = path.join(srcDir, dir);
    if (fs.statSync(dirPath).isDirectory()) {
      fs.readdirSync(dirPath).forEach((file) => {
        const filePath = path.join(dirPath, file);
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          updateImports(filePath, `src/${dir}`);
        }
      });
    }
  });

  console.log('File migration and import update completed. node moveFiles.js');
};

moveAndRefactor();
