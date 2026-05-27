// ============================================================
//  GUEST PHOTO SHARING — photos.js
//  Sarah & James Wedding · September 20, 2026
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
// Replace all placeholder values below with your own credentials.
const CONFIG = {

  // ── Cloudinary ─────────────────────────────────────────────
  // 1. Sign up free at https://cloudinary.com
  // 2. Dashboard → copy your "Cloud name"
  // 3. Settings → Upload → "Add upload preset" → Mode: Unsigned → Save
  //    Copy the preset name below.
  cloudinary: {
    cloudName:    'dglrmyjwi',
    uploadPreset: 'wedding_photos',
  },

  firebase: {
    apiKey:            'AIzaSyCqFDv0fZ4RxVIyVU04xFayC0_ceVXzhws',
    authDomain:        'sarah-james-wedding.firebaseapp.com',
    projectId:         'sarah-james-wedding',
    storageBucket:     'sarah-james-wedding.firebasestorage.app',
    messagingSenderId: '687026602753',
    appId:             '1:687026602753:web:8582ce17d00fb2b7d35100',
  },

  // ── App settings ───────────────────────────────────────────
  collection: 'wedding_photos',  // Firestore collection name
  pageSize: 20,                  // photos per "page"

  // ── Compression settings ────────────────────────────────────
  // browser-image-compression options (adjust to taste)
  compression: {
    maxSizeMB: 1,              // max file size after compression
    maxWidthOrHeight: 2000,    // max dimension in px
    useWebWorker: true,
  },
};
// ────────────────────────────────────────────────────────────

// ── Firebase init ─────────────────────────────────────────────
firebase.initializeApp(CONFIG.firebase);
const db = firebase.firestore();

// ── State ──────────────────────────────────────────────────────
let selectedFiles  = [];   // File objects waiting to upload
let galleryDocs    = [];   // All loaded Firestore docs for lightbox
let lastDoc        = null; // Pagination cursor
let lbIndex        = 0;   // Current lightbox index
let unsubscribe    = null; // Firestore real-time listener

// ── DOM refs ───────────────────────────────────────────────────
const nameInput    = document.getElementById('uploader-name');
const captionInput = document.getElementById('uploader-caption');
const charCount    = document.getElementById('char-count');
const dropZone     = document.getElementById('drop-zone');
const fileInput    = document.getElementById('file-input');
const previewGrid  = document.getElementById('preview-grid');
const progressList = document.getElementById('progress-list');
const submitBtn    = document.getElementById('submit-btn');
const masonry      = document.getElementById('masonry');
const emptyState   = document.getElementById('gallery-empty');
const loadMoreBtn  = document.getElementById('load-more-btn');
const toast        = document.getElementById('toast');
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lb-img');
const lbName       = document.getElementById('lb-name');
const lbCaption    = document.getElementById('lb-caption');
const lbCounter    = document.getElementById('lb-counter');

// ── Persist name in localStorage ───────────────────────────────
const STORAGE_KEY = 'wedding_uploader_name';
nameInput.value = localStorage.getItem(STORAGE_KEY) || '';
nameInput.addEventListener('input', () => {
  localStorage.setItem(STORAGE_KEY, nameInput.value.trim());
  updateSubmitBtn();
});

// ── Caption counter ────────────────────────────────────────────
captionInput.addEventListener('input', () => {
  charCount.textContent = `${captionInput.value.length} / 200`;
});

// ── Drag & drop ────────────────────────────────────────────────
['dragenter', 'dragover'].forEach(evt =>
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.add('drag-over'); })
);
['dragleave', 'drop'].forEach(evt =>
  dropZone.addEventListener(evt, e => { e.preventDefault(); dropZone.classList.remove('drag-over'); })
);
dropZone.addEventListener('drop', e => addFiles(Array.from(e.dataTransfer.files)));
fileInput.addEventListener('change', () => addFiles(Array.from(fileInput.files)));

function addFiles(files) {
  const images = files.filter(f => f.type.startsWith('image/'));
  images.forEach(f => {
    if (selectedFiles.find(s => s.name === f.name && s.size === f.size)) return;
    selectedFiles.push(f);
    renderPreview(f, selectedFiles.length - 1);
  });
  updateSubmitBtn();
  fileInput.value = '';
}

function renderPreview(file, index) {
  const reader = new FileReader();
  reader.onload = e => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.dataset.index = index;
    item.innerHTML = `
      <img src="${e.target.result}" alt="preview" />
      <button class="preview-remove" data-index="${index}" title="Remove">✕</button>
    `;
    previewGrid.appendChild(item);
  };
  reader.readAsDataURL(file);
}

previewGrid.addEventListener('click', e => {
  const btn = e.target.closest('.preview-remove');
  if (!btn) return;
  const idx = parseInt(btn.dataset.index);
  selectedFiles[idx] = null;
  btn.closest('.preview-item').remove();
  selectedFiles = selectedFiles.filter(Boolean);
  updateSubmitBtn();
});

function updateSubmitBtn() {
  const hasFiles = selectedFiles.length > 0;
  const hasName  = nameInput.value.trim().length > 0;
  submitBtn.disabled = !(hasFiles && hasName);
  submitBtn.textContent = hasFiles && hasName
    ? `Upload ${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} ✦`
    : hasFiles
    ? 'Enter your name to continue'
    : 'Select photos to upload ✦';
}

// ── Submit ─────────────────────────────────────────────────────
submitBtn.addEventListener('click', async () => {
  if (!nameInput.value.trim()) { nameInput.focus(); return; }

  submitBtn.disabled = true;
  progressList.innerHTML = '';
  const name    = nameInput.value.trim();
  const caption = captionInput.value.trim();
  const files   = [...selectedFiles];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Progress UI for this file
    const label = document.createElement('div');
    label.className = 'progress-label';
    label.textContent = file.name;

    const wrap = document.createElement('div');
    wrap.className = 'progress-wrap';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    wrap.appendChild(fill);

    progressList.appendChild(label);
    progressList.appendChild(wrap);

    try {
      // 1. Compress
      label.textContent = `${file.name} — compressing…`;
      const compressed = await imageCompression(file, CONFIG.compression);

      // 2. Upload to Cloudinary
      label.textContent = `${file.name} — uploading…`;
      const url = await uploadToCloudinary(compressed, fill);

      // 3. Save to Firestore
      label.textContent = `${file.name} — saving…`;
      await db.collection(CONFIG.collection).add({
        url,
        name,
        caption,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      fill.style.width = '100%';
      label.textContent = `${file.name} ✓`;
      label.style.color = 'rgba(201,169,110,0.8)';

    } catch (err) {
      label.textContent = `${file.name} — failed: ${err.message}`;
      label.style.color = 'rgba(240,100,100,0.8)';
      console.error(err);
    }
  }

  // Reset form
  selectedFiles = [];
  previewGrid.innerHTML = '';
  captionInput.value = '';
  charCount.textContent = '0 / 200';
  updateSubmitBtn();

  showToast();

  setTimeout(() => { progressList.innerHTML = ''; }, 4000);
});

function uploadToCloudinary(file, progressFill) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CONFIG.cloudinary.uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/image/upload`);

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) {
        progressFill.style.width = `${Math.round((e.loaded / e.total) * 90)}%`;
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        reject(new Error(`Cloudinary error: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(fd);
  });
}

// ── Toast ──────────────────────────────────────────────────────
function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ── Gallery — initial load ──────────────────────────────────────
async function loadGallery() {
  const snap = await db.collection(CONFIG.collection)
    .orderBy('createdAt', 'desc')
    .limit(CONFIG.pageSize)
    .get();

  if (snap.empty) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  lastDoc = snap.docs[snap.docs.length - 1];
  galleryDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  masonry.innerHTML = '';
  galleryDocs.forEach((doc, i) => masonry.appendChild(buildCard(doc, i)));

  loadMoreBtn.style.display = snap.docs.length === CONFIG.pageSize ? 'block' : 'none';

  // Subscribe to new photos in real-time
  startListener();
}

function startListener() {
  if (unsubscribe) unsubscribe();
  const newestTs = galleryDocs[0]?.createdAt || new Date(0);

  unsubscribe = db.collection(CONFIG.collection)
    .orderBy('createdAt', 'desc')
    .where('createdAt', '>', newestTs)
    .onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const doc = { id: change.doc.id, ...change.doc.data() };
          galleryDocs.unshift(doc);
          emptyState.style.display = 'none';
          const card = buildCard(doc, 0);
          card.style.animation = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-12px)';
          masonry.insertBefore(card, masonry.firstChild);
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 500ms ease, transform 500ms ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          // Update all card indices
          masonry.querySelectorAll('.photo-card').forEach((el, i) => el.dataset.index = i);
        }
      });
    });
}

// ── Load More ──────────────────────────────────────────────────
loadMoreBtn.addEventListener('click', async () => {
  if (!lastDoc) return;
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading…';

  const snap = await db.collection(CONFIG.collection)
    .orderBy('createdAt', 'desc')
    .startAfter(lastDoc)
    .limit(CONFIG.pageSize)
    .get();

  if (!snap.empty) {
    lastDoc = snap.docs[snap.docs.length - 1];
    const newDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const offset = galleryDocs.length;
    galleryDocs.push(...newDocs);
    newDocs.forEach((doc, i) => masonry.appendChild(buildCard(doc, offset + i)));
  }

  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = 'Load More Photos';
  if (snap.docs.length < CONFIG.pageSize) loadMoreBtn.style.display = 'none';
});

// ── Card builder ───────────────────────────────────────────────
function buildCard(doc, index) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.dataset.index = index;

  // Use Cloudinary w_400 thumbnail
  const thumb = doc.url
    ? doc.url.replace('/upload/', '/upload/w_400,c_limit,q_auto,f_auto/')
    : doc.url;

  const ts = doc.createdAt?.toDate
    ? doc.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  card.innerHTML = `
    <img src="${thumb}" alt="${doc.caption || 'Wedding photo'}" loading="lazy" />
    <div class="photo-meta">
      <div class="name">${escHtml(doc.name)}</div>
      ${doc.caption ? `<div class="caption">${escHtml(doc.caption)}</div>` : ''}
      <div class="ts">${ts}</div>
    </div>
  `;

  card.addEventListener('click', () => openLightbox(index));
  return card;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Lightbox ───────────────────────────────────────────────────
function openLightbox(index) {
  lbIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const doc = galleryDocs[lbIndex];
  if (!doc) return;
  const full = doc.url
    ? doc.url.replace('/upload/', '/upload/w_1200,c_limit,q_auto,f_auto/')
    : doc.url;
  lbImg.src = full;
  lbImg.alt = doc.caption || 'Wedding photo';
  lbName.textContent = doc.name || '';
  lbCaption.textContent = doc.caption || '';
  lbCounter.textContent = `${lbIndex + 1} / ${galleryDocs.length}`;

  document.getElementById('lb-prev').style.opacity = lbIndex === 0 ? '0.3' : '1';
  document.getElementById('lb-next').style.opacity = lbIndex === galleryDocs.length - 1 ? '0.3' : '1';
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => {
  if (lbIndex > 0) { lbIndex--; renderLightbox(); }
});
document.getElementById('lb-next').addEventListener('click', () => {
  if (lbIndex < galleryDocs.length - 1) { lbIndex++; renderLightbox(); }
});
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && lbIndex > 0)                    { lbIndex--; renderLightbox(); }
  if (e.key === 'ArrowRight' && lbIndex < galleryDocs.length-1) { lbIndex++; renderLightbox(); }
});

// ── Init ───────────────────────────────────────────────────────
loadGallery();
updateSubmitBtn();
