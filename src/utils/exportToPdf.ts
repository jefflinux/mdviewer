import html2pdf from 'html2pdf.js';

export async function exportToPdf(element: HTMLElement, filename: string) {
  await html2pdf().set({
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: filename.replace(/\.md$/, '.pdf'),
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
  }).from(element).save();
}
