import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import { Pillbox } from '../entities/Pillbox.entity';

export async function createPdfAndShare(pillbox: Pillbox): Promise<void> {
  const rows = pillbox.rows;
  const cols = pillbox.cols;
  let tableHtml = '<table style="border-collapse: collapse; width: 100%;">';

  for (let row = 0; row < rows; row++) {
    tableHtml += '<tr>';
    for (let col = 0; col < cols; col++) {
      const cell = pillbox.cells.find(c => c.position.row === row && c.position.col === col);
      const label = cell ? cell.label : '';
      tableHtml += `<td style="border: 1px solid black; width: 2cm; height: 2cm; text-align: center;">${label}</td>`;
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</table>';

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-size: 12pt; }
          table, th, td { border: 1px solid black; }
        </style>
      </head>
      <body>
        <h1>Pillbox Labels</h1>
        ${tableHtml}
      </body>
    </html>
  `;

  const options = {
    html: htmlContent,
    fileName: 'pillbox_labels',
    directory: 'Documents',
    base64: false,
  };

  try {
    const pdf = await RNHTMLtoPDF.convert(options);

    // Share the PDF file using native sharing options
    await Share.open({
      url: `file://${pdf.filePath}`,
      title: 'Pillbox Labels PDF',
    });
  } catch (error) {
    // Handle user canceling the share dialog or other errors
    if (error && error.message && error.message.includes('User did not share')) {
    } else {
      Alert.alert('Error', 'Unable to share the PDF file.');
    }
  } finally {
    // Ensure app state is reset after share attempt
  }
}
