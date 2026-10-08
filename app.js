/* =====================================================================
   HOW TO CUSTOMISE THIS SITE (read this before publishing)
   1. WhatsApp number: currently set to 2348131327023 (0813 132 7023).
      Search for that number if you ever need to change it — it appears
      in 4 places (hero, CTA banner, footer, and the order script below).
   2. Prices: edit the PRODUCTS array below — update `price` (Naira) and
      `unit` for each item to match your real, current market prices.
      These are the FALLBACK prices, used if live pricing (see #5) isn't
      set up yet, or if the live sheet can't be reached.
   3. Products: add/remove items from PRODUCTS the same way — each needs
      a local name, English name, unit, price and two swatch colors.
   4. Contact info & address: edit the footer HTML directly (second phone
      number 0813 431 0263 is set on the "Call" link there).
   5. LIVE PRICING FROM GOOGLE SHEETS (update prices from your phone):
      a) Make a Google Sheet with two columns and one header row, e.g.:
           id          | price
           millet      | 1200
           sorghum     | 1100
           maize       | 1000
           rice        | 1500
           beans       | 1800
           groundnut   | 1600
           soybean     | 1400
           pepper      | 2000
           crayfish    | 2500
           egusi       | 2200
           ginger      | 1300
           yam         | 1700
         The `id` values must match the `id` field of each item in the
         PRODUCTS array below exactly (lowercase, no spaces).
      b) In Google Sheets: File > Share > "Publish to web". Choose the
         sheet, pick "Comma-separated values (.csv)" as the format, and
         click Publish. Copy the link it gives you.
      c) Paste that link as the value of LIVE_PRICE_SHEET_URL just below.
      d) That's it. Anyone editing that sheet from the Sheets phone app
         will see their price changes appear on the website automatically
         next time a visitor loads the page (and every few minutes for
         anyone who leaves the page open — see LIVE_PRICE_REFRESH_MINUTES).
         No app, no password system, no code to touch.
   ===================================================================== */

// Paste your published Google Sheet CSV link here (see step 5 above).
// Leave as '' to skip live pricing and just use the PRODUCTS prices below.
const LIVE_PRICE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQFYu32yEykKdIlHMy7vZ6gtLqfXhKcbFG9ZsmDorNtf4t2GriSY8q5tfUJbRpiOl8uuZxVZG6rB-rP/pub?output=csv';

// How often (in minutes) to re-check the sheet for anyone who leaves the
// page open in a browser tab. Doesn't affect fresh page loads, which
// always check immediately.
const LIVE_PRICE_REFRESH_MINUTES = 5;

const PRODUCTS = [
  {
    id: 'millet',
    local: 'Gero',
    name: 'Millet',
    unit: 'mudu',
    price: 1200,
    c1: '#E9C468',
    c2: '#B9821E',
    img: 'images/products/millet.webp',
  },
  {
    id: 'sorghum',
    local: 'Dawa',
    name: 'Guinea Corn',
    unit: 'mudu',
    price: 1100,
    c1: '#C25A32',
    c2: '#7A2E14',
    img: 'images/products/sorghum.webp',
  },
  {
    id: 'maize',
    local: 'Masara',
    name: 'Maize',
    unit: 'mudu',
    price: 1000,
    c1: '#F1CE7A',
    c2: '#C99A2E',
    img: 'images/products/maize.webp',
  },
  {
    id: 'rice',
    local: 'Shinkafa',
    name: 'Local Rice',
    unit: 'derica',
    price: 1500,
    c1: '#F7F1E1',
    c2: '#D8CBA0',
    img: 'images/products/rice.webp',
  },
  {
    id: 'beans',
    local: 'Wake',
    name: 'Brown Beans',
    unit: 'mudu',
    price: 1800,
    c1: '#7A2C3E',
    c2: '#4A1520',
    img: 'images/products/beans.webp',
  },
  {
    id: 'groundnut',
    local: 'Gyada',
    name: 'Groundnut',
    unit: 'derica',
    price: 1600,
    c1: '#E8CB94',
    c2: '#9C6B34',
    img: 'images/products/groundnut.webp',
  },
  {
    id: 'soybean',
    local: 'Waken Soya',
    name: 'Soybean',
    unit: 'mudu',
    price: 1300,
    c1: '#E4DBB0',
    c2: '#B7A768',
    img: 'images/products/soybean.webp',
  },
  {
    id: 'pepper',
    local: 'Barkono',
    name: 'Dried Pepper',
    unit: 'kg',
    price: 3500,
    c1: '#D0522F',
    c2: '#8C2A16',
    img: 'images/products/pepper.webp',
  },
  {
    id: 'crayfish',
    local: 'Kifi',
    name: 'Crayfish',
    unit: 'kg',
    price: 6500,
    c1: '#D69C7C',
    c2: '#9C5C3A',
    img: 'images/products/crayfish.webp',
  },
  {
    id: 'egusi',
    local: 'Gushi',
    name: 'Melon Seed',
    unit: 'derica',
    price: 2200,
    c1: '#EDE3A6',
    c2: '#C6B563',
    img: 'images/products/egusi.webp',
  },
  {
    id: 'ginger',
    local: 'Citta',
    name: 'Dried Ginger',
    unit: 'kg',
    price: 4200,
    c1: '#E0C88E',
    c2: '#A9803F',
    img: 'images/products/ginger.webp',
  },
  {
    id: 'yam',
    local: 'Doya',
    name: 'Yam Tuber',
    unit: 'each',
    price: 1200,
    c1: '#F3EFE0',
    c2: '#D6CBA8',
    img: 'images/products/yam.webp',
  },
];

const basket = {}; // id -> qty

/* ---------------------------------------------------------------------
   LIVE PRICE SYNC (Google Sheets)
   Fetches the published CSV, matches rows to PRODUCTS by `id`, and
   overwrites `price` in-memory. Falls back silently to the prices
   already in PRODUCTS above if the sheet URL is blank, unreachable,
   or a row doesn't match — the site always keeps working either way.
   --------------------------------------------------------------------- */
// Google Drive "uc?export=view&id=..." and "/file/d/<id>/view" links often
// fail to render in a plain <img> tag (Drive returns an HTML interstitial
// instead of the raw image). This rewrites any such link into the
// lh3.googleusercontent.com form, which hotlinks reliably. Non-Drive URLs
// (e.g. Imgur, your own CDN) are returned unchanged.
function normalizeImageUrl(url) {
  if (!url) return url;
  let id = null;
  let m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) id = m[1];
  if (!id) {
    m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (m) id = m[1];
  }
  if (id) return `https://lh3.googleusercontent.com/d/${id}=w1000`;
  return url;
}

function parsePriceCSV(text) {
  // More flexible CSV parser: reads header row and supports additional
  // columns (id, price, local, name, unit, c1, c2, img). Returns an
  // object keyed by id with parsed fields. Falls back to empty object
  // for malformed input.
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return {};

  // Parse header and map columns to keys
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const colIndex = (key) => header.indexOf(key);
  const idCol = colIndex('id');
  const priceCol = colIndex('price');
  if (idCol === -1 || priceCol === -1) return {};

  const updates = {};
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = lines[i].split(',').map((c) => c.trim());
    const id = (cols[idCol] || '').toLowerCase();
    if (!id) continue;
    const priceRaw = (cols[priceCol] || '').replace(/[^\d.]/g, '');
    const price = priceRaw === '' ? NaN : parseFloat(priceRaw);

    const entry = {};
    if (!isNaN(price) && price > 0) entry.price = Math.round(price);
    // optional columns
    const localCol = colIndex('local');
    const nameCol = colIndex('name');
    const unitCol = colIndex('unit');
    const c1Col = colIndex('c1');
    const c2Col = colIndex('c2');
    const imgCol = colIndex('img');

    if (localCol !== -1) entry.local = cols[localCol] || undefined;
    if (nameCol !== -1) entry.name = cols[nameCol] || undefined;
    if (unitCol !== -1) entry.unit = cols[unitCol] || undefined;
    if (c1Col !== -1) entry.c1 = cols[c1Col] || undefined;
    if (c2Col !== -1) entry.c2 = cols[c2Col] || undefined;
    if (imgCol !== -1) entry.img = normalizeImageUrl(cols[imgCol]) || undefined;

    updates[id] = entry;
  }
  return updates;
}

async function syncLivePrices() {
  if (!LIVE_PRICE_SHEET_URL) return; // not configured — use fallback prices
  try {
    const res = await fetch(LIVE_PRICE_SHEET_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Sheet fetch failed: ' + res.status);
    const csvText = await res.text();
    const updates = parsePriceCSV(csvText);
    console.info('Live price sync — parsed updates:', updates);

    let changed = false;
    // Apply updates: update existing products or create new ones when
    // the sheet includes an id not found in PRODUCTS.
    for (const [id, data] of Object.entries(updates)) {
      console.debug('processing sheet row id=', id, 'data=', data);
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) {
        if (data.hasOwnProperty('price') && data.price !== p.price) {
          p.price = data.price;
          changed = true;
        }
        ['local', 'name', 'unit', 'c1', 'c2', 'img'].forEach((k) => {
          if (data[k] && data[k] !== p[k]) {
            p[k] = data[k];
            changed = true;
          }
        });
      } else {
        console.info('Adding new product from sheet:', id, data);
        // create a minimal product entry from available sheet columns
        const newP = {
          id: id,
          local: data.local || id,
          name: data.name || id.charAt(0).toUpperCase() + id.slice(1),
          unit: data.unit || 'mudu',
          price: data.price || 0,
          c1: data.c1 || '#E9C468',
          c2: data.c2 || '#B9821E',
          img: data.img || '',
        };
        PRODUCTS.push(newP);
        changed = true;
      }
    }

    if (changed) {
      renderBoard(); // redraw prices and any newly added products
      renderBasket(); // redraw basket total in case prices changed
    }
  } catch (err) {
    // Sheet unreachable or misconfigured — quietly keep using whatever
    // prices are already loaded (fallback or last successful sync).
    console.warn('Live price sync skipped:', err.message);
  }
}

function money(n) {
  return '₦' + n.toLocaleString('en-NG');
}

function renderBoard() {
  const grid = document.getElementById('boardGrid');
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <div class="card" data-id="${p.id}">
      <div class="card-media">
        ${
          p.img
            ? `<img src="${p.img}" alt="${p.name} (${p.local})" loading="lazy">`
            : `<div class="swatch-fill" style="background:radial-gradient(circle at 32% 28%, ${p.c1}, ${p.c2} 75%);"></div>`
        }
      </div>
      <div class="card-body">
        <div class="card-top">
          <div class="card-names">
            <span class="local-name">${p.local}</span>
            <span class="eng-name">${p.name}</span>
          </div>
        </div>
        <div class="card-meta">
          <span>per ${p.unit}</span>
          <span class="price">${money(p.price)}</span>
        </div>
        <div class="card-actions">
          <div class="qty-control">
            <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="qty-val" id="qty-${p.id}">0</span>
            <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="add-btn" data-action="add">Add</button>
        </div>
      </div>
    </div>
  `,
  ).join('');
}

function changeQty(id, delta) {
  const el = document.getElementById(`qty-${id}`);
  let val = parseInt(el.textContent, 10) || 0;
  val = Math.max(0, val + delta);
  el.textContent = val;
}

function addToBasket(id) {
  const el = document.getElementById(`qty-${id}`);
  const qty = parseInt(el.textContent, 10) || 0;
  if (qty <= 0) return;
  basket[id] = qty;
  renderBasket();
}

function clearBasket() {
  Object.keys(basket).forEach((id) => delete basket[id]);
  PRODUCTS.forEach((p) => {
    const el = document.getElementById(`qty-${p.id}`);
    if (el) el.textContent = '0';
  });
  renderBasket();
}
document.getElementById('clearBasketBtn').addEventListener('click', clearBasket);

function renderBasket() {
  const list = document.getElementById('basketList');
  const totalEl = document.getElementById('basketTotal');
  const waBtn = document.getElementById('waButton');
  const mobileCount = document.getElementById('mobileBasketCount');
  const clearBtn = document.getElementById('clearBasketBtn');

  const entries = Object.entries(basket).filter(([, qty]) => qty > 0);
  mobileCount.textContent = entries.reduce((s, [, q]) => s + q, 0);
  clearBtn.hidden = entries.length === 0;

  if (entries.length === 0) {
    list.innerHTML = '<p class="basket-empty">Your basket is empty — tap "Add" on any item.</p>';
    totalEl.textContent = money(0);
    waBtn.disabled = true;
    return;
  }

  let total = 0;
  list.innerHTML = entries
    .map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      const lineTotal = p.price * qty;
      total += lineTotal;
      return `
      <div class="basket-row">
        <div>
          <div class="b-name">${p.name}</div>
          <div class="b-meta">${qty} × ${p.unit} · ${money(p.price)}</div>
        </div>
        <div class="b-meta">${money(lineTotal)}</div>
      </div>
    `;
    })
    .join('');

  totalEl.textContent = money(total);
  waBtn.disabled = false;
}

function buildWhatsAppLink() {
  const entries = Object.entries(basket).filter(([, qty]) => qty > 0);
  if (entries.length === 0) return null;
  let lines = ["Hello HenryTomz Foodstuff Hub, I'd like to order:"];
  let total = 0;
  entries.forEach(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    total += p.price * qty;
    lines.push(`- ${p.name} (${p.local}): ${qty} ${p.unit}`);
  });
  lines.push(`Estimated total: ${money(total)}`);
  lines.push('Please confirm price, availability and delivery.');
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/2348131327023?text=${text}`;
}

document.getElementById('boardGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const card = e.target.closest('.card');
  const id = card.dataset.id;
  const action = btn.dataset.action;
  if (action === 'inc') changeQty(id, 1);
  if (action === 'dec') changeQty(id, -1);
  if (action === 'add') addToBasket(id);
});

document.getElementById('waButton').addEventListener('click', () => {
  const link = buildWhatsAppLink();
  if (link) window.open(link, '_blank');
});

document.getElementById('mobileBasketBtn').addEventListener('click', () => {
  document.getElementById('market').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('menuToggle').addEventListener('click', () => {
  const links = document.getElementById('navLinks');
  const open = links.classList.toggle('open');
  document.getElementById('menuToggle').setAttribute('aria-expanded', open);
});

document.querySelectorAll('#navLinks a').forEach((a) => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

renderBoard();
renderBasket();

// Check the Google Sheet for updated prices right away, then keep
// re-checking every LIVE_PRICE_REFRESH_MINUTES for anyone who leaves
// the page open. No-op if LIVE_PRICE_SHEET_URL hasn't been set above.
syncLivePrices();
if (LIVE_PRICE_SHEET_URL) {
  setInterval(syncLivePrices, LIVE_PRICE_REFRESH_MINUTES * 60 * 1000);
}

/* About section photo slideshow: crossfades through all supplied shop/product photos.
   Pauses on hover, and skips auto-advance entirely for reduced-motion users. */
(function initAboutGallery() {
  const gallery = document.getElementById('aboutGallery');
  if (!gallery) return;
  const slides = Array.from(gallery.querySelectorAll('img'));
  if (slides.length === 0) return;

  slides[0].classList.add('active');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || slides.length === 1) return;

  let index = 0;
  let timer = null;

  function nextSlide() {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }

  function start() {
    if (!timer) timer = setInterval(nextSlide, 3200);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  start();
  gallery.addEventListener('mouseenter', stop);
  gallery.addEventListener('mouseleave', start);
})();
