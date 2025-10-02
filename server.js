const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '20mb' }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', (req, res) => {
  const { dataUrl } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return res.status(400).json({ ok: false, error: 'Invalid image data' });
  }

  const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return res.status(400).json({ ok: false, error: 'Invalid dataURL format' });

  const ext = matches[1].split('/')[1]; // jpg/png
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const filename = `capture_${Date.now()}.${ext}`;
  const filepath = path.join(uploadsDir, filename);

  fs.writeFile(filepath, buffer, (err) => {
    if (err) return res.status(500).json({ ok: false, error: 'File write error' });
    const url = `/uploads/${filename}`;
    res.json({ ok: true, url });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
                         
