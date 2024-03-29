if (LeadID) {
  var url = "Indian_Bank.pdf";
  var pageNum = 1;
  var { pdfjsLib } = globalThis;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";

  var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    canvas = document.getElementById("pdf-canvas"),
    ctx = canvas.getContext("2d");

  function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      var renderTask = page.render(renderContext);

      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });
    document.getElementById("page_num").textContent = num;
  }

  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById("prev").addEventListener("click", onPrevPage);
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById("next").addEventListener("click", onNextPage);

  function RenderPDF() {
    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_;
      document.getElementById("page_count").textContent = pdfDoc.numPages;
      renderPage(pageNum);
    });
  }

  getData();

  async function getData() {
    loader.style.display = "flex";
    const response = await fetch(
      `${baseUrl}banking-lead-pdf-s3url`,
      {
        method: "POST",
        body: JSON.stringify({
          lead_id: LeadID,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    const data = await response.json();
    if (data?.result?.status.toLowerCase() === "true") {
      url = data.result.s3_url;
      RenderPDF();
      const mq = window.matchMedia("(min-width: 481px)");
      if (mq.matches) {
        document.getElementById("pdf-canvas-iframe").setAttribute("src", url);
      }
      loader.style.display = "none";
    } else {
      LeadID = null;
      loader.style.display = "none";
      document.getElementById("content").innerHTML = empty;
    }
  }
}
