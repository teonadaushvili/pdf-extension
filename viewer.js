import * as pdfjsLib from "./pdf/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf/pdf.worker.mjs");

let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;

const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");

const currentPageElement = document.getElementById("current-page");
const totalPagesElement = document.getElementById("total-pages");

const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");

const pdfUrl = chrome.runtime.getURL("sample.pdf");

async function renderPage(pageNumber) {
    const page = await pdfDoc.getPage(pageNumber);

    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
        canvasContext: context,
        viewport
    }).promise;

    currentPageElement.textContent = pageNumber;
}

async function loadPdf() {
    const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl
    });

    pdfDoc = await loadingTask.promise;

    totalPagesElement.textContent = pdfDoc.numPages;

    await renderPage(currentPage);

    console.log("PDF loaded");
}

loadPdf().catch(console.error);

nextPageButton.addEventListener("click", async () => {

    if (currentPage >= pdfDoc.numPages) {
        return;
    }

    currentPage++;

    await renderPage(currentPage);

});



