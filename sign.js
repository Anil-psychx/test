
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
signaturePad.toSVG({includeBackgroundColor: true}); 
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


document.getElementById('clear-signature-btn').addEventListener('click', function () {
  signaturePad.clear();
});
document.getElementById('undo-signature-btn').addEventListener('click', function () {
  var data = signaturePad.toData();
  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});
document.getElementById('add-signature-btn').addEventListener('click', function () {
  if (signaturePad.isEmpty()) {
    return alert("Please provide a signature first.");
  }
  
  var data = signaturePad.toDataURL('image/png');
  console.log(data);
  window.open(data);
});