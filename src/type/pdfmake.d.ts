declare module "pdfmake/build/vfs_fonts" {
    const pdfFonts: { pdfMake: { vfs: any } };
    export default pdfFonts;
  }
  
  declare module "pdfmake/build/pdfmake" {
    const pdfMake: { vfs: any; createPdf: (documentDefinition: any) => any };
    export default pdfMake;
  }
  
