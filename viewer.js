import * as pdfjsLib from "./pdf/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("pdf/pdf.worker.mjs");

let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;

let sentences = [];
let currentSentence = 0;

const canvas = document.getElementById("pdf-canvas");
const context = canvas.getContext("2d");

const textLayer = document.getElementById("text-layer");

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

    textLayer.style.width = `${viewport.width}px`;
    textLayer.style.height = `${viewport.height}px`
    ;
    textLayer.innerHTML = "";

    await page.render({
        canvasContext: context,
        viewport
    }).promise;

    const textContent = await page.getTextContent();

    // const text = textContent.items
    //     .map(item => item.str)
    //     .join(" ");

    // sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // console.log(sentences);
    // console.log(`Total sentences: ${sentences.length}`);

    // currentSentence = 0;

    // showCurrentSentence();
    textLayer.innerHTML = "";

textContent.items.forEach((item) => {

    const span = document.createElement("span");

    span.textContent = item.str;

    span.style.marginRight = "3px";
    span.style.background = "yellow";
    span.style.color = "black";

    textLayer.appendChild(span);

});

    currentPageElement.textContent = pageNumber;
}

function showCurrentSentence() {

    if (sentences.length === 0) {
        textLayer.textContent = "";
        return;
    }

    textLayer.innerHTML = `
    <div style="
        background: yellow;
        padding: 6px 10px;
        margin-top:20px;
        display:inline-block;
    ">
        ${sentences[currentSentence]}
    </div>
`;
    console.log(`Current sentence: ${sentences[currentSentence]}`);
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

    if (currentPage >= pdfDoc.numPages) return;

    currentPage++;

    await renderPage(currentPage);

});

prevPageButton.addEventListener("click", async () => {

    if (currentPage <= 1) return;

    currentPage--;

    await renderPage(currentPage);

});
document.addEventListener("keydown", (event) => {

    console.log(event.key);

    if (event.key !== "Tab") return;

    event.preventDefault();

    console.log("TAB PRESSED");

    if (event.shiftKey) {

        console.log("SHIFT + TAB");

        if (currentSentence > 0) {
            currentSentence--;
            console.log(currentSentence);
            showCurrentSentence();
        }

    } else {

        console.log("TAB");

        if (currentSentence < sentences.length - 1) {
            currentSentence++;
            console.log(currentSentence);
            showCurrentSentence();
        }

    }

});