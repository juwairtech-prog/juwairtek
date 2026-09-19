import './style.css';

const products = [
  { id: 1, name: 'مصباح أورا الطاولة', price: 189, category: 'home', art: 'lamp-art', badge: 'الأكثر طلباً' },
  { id: 2, name: 'طقم أكواب الصباح', price: 95, category: 'home', art: 'cups-art' },
  { id: 3, name: 'شمعة خشب الصندل', price: 72, category: 'life', art: 'candle-art', badge: 'جديد' },
  { id: 4, name: 'زيت الورد المغذي', price: 118, category: 'care', art: 'oil-art' },
  { id: 5, name: 'دفتر لحظات هادئة', price: 54, category: 'life', art: 'notebook-art' },
  { id: 6, name: 'صينية ترافرتين', price: 145, category: 'home', art: 'tray-art' }
];
let cart = [];
const productGrid = document.querySelector('#productGrid');
const money = (amount) => `${amount.toLocaleString('ar-SA')} ر.س`;
const productCard = (p) => `<article class="product-card" data-category="${p.category}"><div class="product-art ${p.art}">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<button class="heart" aria-label="إضافة للمفضلة">♡</button><div class="art-object"></div></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.category === 'home' ? 'للمنزل' : p.category === 'care' ? 'عناية وجمال' : 'أسلوب حياة'}</p></div><strong>${money(p.price)}</strong></div><button class="add" data-id="${p.id}">أضف للسلة <span>+</span></button></article>`;
function renderProducts(filter = 'all') { productGrid.innerHTML = products.filter(p => filter === 'all' || p.category === filter).map(productCard).join(''); }
renderProducts();
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => { document.querySelector('.filter.active').classList.remove('active'); btn.classList.add('active'); renderProducts(btn.dataset.filter); }));

const cartDrawer = document.querySelector('#cartDrawer'), overlay = document.querySelector('#overlay');
function showPanel(panel) { document.querySelector(`#${panel}`).classList.add('open'); overlay.classList.add('visible'); }
function hidePanels() { document.querySelectorAll('.open').forEach(el => el.classList.remove('open')); overlay.classList.remove('visible'); }
function updateCart() { const count = cart.reduce((sum, item) => sum + item.quantity, 0); document.querySelector('#cartCount').textContent = count; document.querySelector('#cartItemsLabel').textContent = `${count} ${count === 1 ? 'منتج' : 'منتجات'}`; document.querySelector('#cartTotal').textContent = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)); document.querySelector('#cartItems').innerHTML = cart.length ? cart.map(item => `<div class="cart-item"><div class="mini-art ${item.art}"><div class="art-object"></div></div><div><h3>${item.name}</h3><strong>${money(item.price)}</strong><div class="quantity"><button data-quantity="minus" data-id="${item.id}">−</button><span>${item.quantity}</span><button data-quantity="plus" data-id="${item.id}">+</button></div></div><button class="remove" data-remove="${item.id}">×</button></div>`).join('') : '<p class="empty">سلتك تنتظر أول اختيار جميل ✦</p>'; }
productGrid.addEventListener('click', e => { const id = Number(e.target.closest('[data-id]')?.dataset.id); if (!id) return; const product = products.find(p => p.id === id); const existing = cart.find(item => item.id === id); existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 }); updateCart(); showToast(`أضفنا «${product.name}» إلى سلتك`); });
document.querySelector('#cartItems').addEventListener('click', e => { const id = Number(e.target.dataset.id); if (!id) return; const item = cart.find(p => p.id === id); if (e.target.dataset.remove) cart = cart.filter(p => p.id !== id); if (e.target.dataset.quantity === 'plus') item.quantity++; if (e.target.dataset.quantity === 'minus') { item.quantity--; if (!item.quantity) cart = cart.filter(p => p.id !== id); } updateCart(); });
document.querySelector('#openCart').addEventListener('click', () => showPanel('cartDrawer')); document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', hidePanels)); overlay.addEventListener('click', hidePanels);
document.querySelector('#checkout').addEventListener('click', () => cart.length ? showToast('سننقلك للدفع الآمن قريباً ✦') : showToast('أضف منتجاً واحداً على الأقل أولاً'));

const authModal = document.querySelector('#authModal'), authInput = document.querySelector('#authInput'); let method = 'email';
document.querySelector('#openAuth').addEventListener('click', () => showPanel('authModal'));
document.querySelectorAll('.method').forEach(btn => btn.addEventListener('click', () => { document.querySelector('.method.active').classList.remove('active'); btn.classList.add('active'); method = btn.dataset.method; const whatsapp = method === 'whatsapp'; document.querySelector('#authLabel').textContent = whatsapp ? 'رقم واتساب' : 'البريد الإلكتروني'; authInput.type = whatsapp ? 'tel' : 'email'; authInput.placeholder = whatsapp ? '05X XXX XXXX' : 'name@example.com'; }));
document.querySelector('#authForm').addEventListener('submit', e => { e.preventDefault(); document.querySelector('#authStepOne').hidden = true; document.querySelector('#authStepTwo').hidden = false; document.querySelector('#sentTo').textContent = `أرسلنا رمزاً إلى ${authInput.value} عبر ${method === 'email' ? 'البريد الإلكتروني' : 'واتساب'}.`; document.querySelector('.otp-inputs input').focus(); });
document.querySelector('#backToAuth').addEventListener('click', () => { document.querySelector('#authStepOne').hidden = false; document.querySelector('#authStepTwo').hidden = true; });
document.querySelectorAll('.otp-inputs input').forEach((input, idx, inputs) => input.addEventListener('input', () => { if (input.value && inputs[idx + 1]) inputs[idx + 1].focus(); }));
document.querySelector('#otpForm').addEventListener('submit', e => { e.preventDefault(); const code = [...document.querySelectorAll('.otp-inputs input')].map(i => i.value).join(''); if (code === '1234') { hidePanels(); document.querySelector('#openAuth').innerHTML = 'حسابي <span>✓</span>'; showToast('أهلاً بك في نُقطة!'); } else showToast('الرمز غير صحيح، جرّب 1234'); });
document.querySelector('#resend').addEventListener('click', () => showToast('أعدنا إرسال الرمز بنجاح'));
document.querySelector('#newsletter').addEventListener('submit', e => { e.preventDefault(); document.querySelector('#newsletterMessage').textContent = 'شكراً! أصبحت من مجتمع نُقطة.'; e.target.reset(); });
let toastTimer; function showToast(message) { const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }
