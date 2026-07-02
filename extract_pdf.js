const fs = require('fs');

async function extractPdf() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = fs.readFileSync('SN_Huisstijl_1503_LR.pdf');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += `\n--- PAGE ${i} ---\n`;
    out += content.items.map(item => item.str).join(' ');
  }
  console.log(out);
}

extractPdf().catch(error => {
  console.error(error);
  process.exit(1);
});
