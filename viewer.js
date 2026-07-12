import * as pdfjsLib from "./pdf/pdf.mjs";
let pdfDoc = null;


pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf/pdf.worker.mjs");

const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");

const pdfUrl = chrome.runtime.getURL("sample.pdf");

console.log(pdfUrl);

const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl
});

loadingTask.promise.then(async (pdf) => {
    console.log("PDF loaded");

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: context,
        viewport
    }).promise;

    console.log("Rendered");
}).catch(err => {
    console.error(err);
});