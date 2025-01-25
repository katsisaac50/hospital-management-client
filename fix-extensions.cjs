// const replace = require('replace-in-file');

// async function fixMissingExtensions() {
//   try {
//     const results = await replace({
//       files: 'node_modules/**/*.js',
//       from: /import (.+?) from '(.+?)';/g,
//       to: (match, p1, p2) => {
//         if (!p2.endsWith('.js')) {
//           return `import ${p1} from '${p2}.js';`;
//         }
//         return match;
//       },
//     });
//     console.log('Modified files:', results.filter(r => r.hasChanged).map(r => r.file));
//   } catch (error) {
//     console.error('Error occurred:', error);
//   }
// }

// fixMissingExtensions();
