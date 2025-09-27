
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { put } from '@vercel/blob';
import { body, validationResult } from 'express-validator';
import mime from 'mime-types';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine + layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// static
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer in-memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    cb(allowed.includes(file.mimetype) ? null : new Error('只接受 JPG/PNG/WEBP/GIF 圖片'));
  }
});

// Pricing logic
function basePricePerGram(type) {
  const map = {
    'amethyst': 2.5,
    'rose_quartz': 1.8,
    'clear_quartz': 1.2,
    'citrine': 3.0,
    'black_onyx': 1.5,
    'aquamarine': 6.0,
    'jade': 8.0,
    'tourmaline': 10.0,
    'others': 1.0
  };
  return map[type] ?? map['others'];
}
function conditionMultiplier(c) {
  const map = { 'mint': 1.0, 'good': 0.85, 'fair': 0.65, 'poor': 0.45 };
  return map[c] ?? 0.6;
}
function sizeBonus(size) {
  const map = { 'xs': 0, 's': 5, 'm': 12, 'l': 25, 'xl': 45 };
  return map[size] ?? 0;
}
function estimatePrice({ type, weight, condition, size }) {
  const w = Math.max(0, Number(weight) || 0);
  const base = basePricePerGram(type) * w;
  const cond = base * conditionMultiplier(condition);
  const bonus = sizeBonus(size);
  return Math.max(0, Math.round(cond + bonus));
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Éclat Reborn｜高端二手水晶回收與估價' });
});
app.get('/process', (req, res) => res.redirect('/#how-it-works'));

app.post('/quote',
  upload.array('photos', 5),
  [
    body('name').trim().isLength({ min: 1 }).withMessage('請填寫姓名'),
    body('email').trim().isEmail().withMessage('請提供有效電郵'),
    body('type').isString().isLength({ min: 1 }).withMessage('請選擇水晶種類'),
    body('weight').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('重量需為數字'),
    body('condition').isString(),
    body('size').isString(),
    body('notes').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('index', {
        title: 'Éclat Reborn｜高端二手水晶回收與估價',
        errors: errors.array(),
      });
    }

    const { name, email, phone, type, weight, condition, size, notes } = req.body;
    const price = estimatePrice({ type, weight, condition, size });

    const images = [];
    for (const file of (req.files || [])) {
      const ext = path.extname(file.originalname) || '.' + (mime.extension(file.mimetype) || 'jpg');
      const safeBase = path.basename(file.originalname, path.extname(file.originalname))
        .replace(/[^\w\-]+/g, '_')
        .slice(0, 40);
      const stamp = Date.now();
      const key = `uploads/${safeBase}-${stamp}${ext}`;
      const { url } = await put(key, file.buffer, { access: 'public', contentType: file.mimetype });
      images.push({ filename: key, url });
    }

    res.render('thanks', {
      title: '已收到您的估價申請',
      data: { name, email, phone, type, weight, condition, size, notes, price, images }
    });
  }
);

export default app;
