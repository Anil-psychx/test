const canvas = document.getElementById("signature-canvas");
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
const signaturePad = new SignaturePad(canvas);

signaturePad.toDataURL(); // save image as PNG
signaturePad.toDataURL("image/jpeg"); // save image as JPEG
signaturePad.toDataURL("image/jpeg", 0.5); // save image as JPEG with 0.5 image quality
signaturePad.toDataURL("image/svg+xml"); // save image as SVG data url

// Return svg string without converting to base64
signaturePad.toSVG(); // "<svg...</svg>"
signaturePad.toSVG({ includeBackgroundColor: true });
const data = signaturePad.toData();

signaturePad.fromData(data);

signaturePad.fromData(data, { clear: false });

// Clears the canvas
signaturePad.clear();

// Returns true if canvas is empty, otherwise returns false
signaturePad.isEmpty();

// Unbinds all event handlers
signaturePad.off();

// Rebinds all event handlers
signaturePad.on();

document
  .getElementById("clear-signature-btn")
  .addEventListener("click", function () {
    signaturePad.clear();
  });
document
  .getElementById("undo-signature-btn")
  .addEventListener("click", function () {
    var data = signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      signaturePad.fromData(data);
    }
  });
document
  .getElementById("add-signature-btn")
  .addEventListener("click", function () {
    if (signaturePad.isEmpty()) {
      return alert("Please provide a signature first.");
    }

    loader.style.display = "flex";
    var data = signaturePad.toDataURL();
    UploadSign(data);
  });
async function createBlob(dataURL) {
  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: contentType });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
async function UploadSign(dataURL) {
  const content = await createBlob(dataURL);
  const formData = new FormData();
  formData.append("lead_id", LeadID);
  formData.append("signature_image", content);
  const response = await fetch(
    `${baseUrl}attach-signature?lead_id=${LeadID}`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  if (data?.status?.toLowerCase() === "true") {
    loader.style.display = "none";
    alert("Signature updated successfully.");
  } else {
    loader.style.display = "none";
    alert("Something went wrong. Please try agin.");
  }
}
