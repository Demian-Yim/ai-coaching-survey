
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadResultsAsPDF = async (elementId: string, filename: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    try {
        const canvas = await html2canvas(input, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with margin
        const imgHeight = imgWidth / ratio;

        let heightLeft = imgHeight;
        let position = 10; // top margin

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20); // page height with margin

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
