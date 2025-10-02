const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const result = document.getElementById('result');
const consentBox = document.getElementById('consent');

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    alert('Camera access denied or not available: ' + err.message);
  }
}

function captureImage() {
  const w = video.videoWidth || 320;
  const h = video.videoHeight || 240;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.9);
}

async function uploadImage(dataUrl) {
  try {
    const resp = await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl })
    });
    const j = await resp.json();
    if (j.ok) {
      result.innerHTML = `<p>Uploaded:</p><img src="${j.url}" alt="uploaded" />`;
    } else {
      alert('Upload failed: ' + (j.error || 'unknown'));
    }
  } catch (e) {
    alert('Network error: ' + e.message);
  }
}

captureBtn.addEventListener('click', () => {
  if (!consentBox.checked) { alert('Please give consent first'); return; }
  const dataUrl = captureImage();
  uploadImage(dataUrl);
});

startCamera();
    
