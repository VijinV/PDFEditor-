import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

function FillablePDFForm() {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const pdfBytes = new Uint8Array(fileReader.result);
        setPdfBytes(pdfBytes);
        setErrorMessage('');
      };
      fileReader.onerror = () => {
        setErrorMessage('Error reading the selected PDF file.');
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const fillPdfForm = async () => {
    if (pdfBytes) {
      try {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        // Modify form fields (if applicable)
        // const textField = form.getTextField('fieldName');
        // textField.setText('New text');

        // Save the PDF
        const updatedPdfBytes = await pdfDoc.save();
        setPdfBytes(updatedPdfBytes);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Error filling the PDF form.');
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={fillPdfForm} disabled={!pdfBytes}>
        Fill PDF Form
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {pdfBytes && (
        <iframe
          title="Filled PDF"
          src={URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))}
          width="600"
          height="400"
        />
      )}
    </div>
  );
}

export default FillablePDFForm;
