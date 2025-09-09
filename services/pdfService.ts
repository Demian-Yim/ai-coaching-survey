import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadResultsAsPDF = async (elementId: string, filename: string): Promise<void> => {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // Get direct children of the report element to process them one by one
    const sections = Array.from(reportElement.children) as HTMLElement[];

    for (const section of sections) {
        try {
            // Ensure styles are applied before rendering
            await new Promise(resolve => setTimeout(resolve, 0));

            const canvas = await html2canvas(section, {
                scale: 2,
                useCORS: true,
                backgroundColor: null, // Use the element's background
            });

            const imgData = canvas.toDataURL('image/png');
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;

            const imgWidth = pdfWidth - margin * 2;
            const imgHeight = imgWidth / ratio;

            // Check if the image fits on the current page
            if (y + imgHeight > pdfHeight - margin) {
                pdf.addPage();
                y = margin; // Reset y position for new page
            }

            pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10; // Add image height and some padding between sections
        } catch (error) {
            console.error('Could not process section for PDF:', section, error);
        }
    }

    pdf.save(`${filename}.pdf`);
};
