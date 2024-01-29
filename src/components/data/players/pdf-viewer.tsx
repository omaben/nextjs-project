import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// Specify the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

interface PDFViewerProps {
   pdfUrl: string // Assuming pdfUrl is a string representing the URL of the PDF file
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
   const [numPages, setNumPages] = useState<number | null>(null)
   const [pageNumber, setPageNumber] = useState<number>(1)

   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
   }

   return (
      <div>
         <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
         </Document>
         <p>
            Page {pageNumber} of {numPages}
         </p>
         {/* <button onClick={() => setPageNumber(prevPage => prevPage - 1)} disabled={pageNumber <= 1}>
        Previous Page
      </button>
      <button onClick={() => setPageNumber(prevPage => prevPage + 1)} disabled={pageNumber >= numPages!}>
        Next Page
      </button> */}
      </div>
   )
}

export default PDFViewer
