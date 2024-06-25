import { getDocument } from 'pdfjs-dist';
import { createCanvas } from 'canvas';

async function getFirstPageAsImage(pdfPath) {
  const loadingTask = getDocument(pdfPath);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  
  const viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas.toDataURL('image/jpeg');
}

export default getFirstPageAsImage;
