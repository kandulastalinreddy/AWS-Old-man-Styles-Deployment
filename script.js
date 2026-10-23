/* ================= Product data ================= */
const PRODUCTS = [
  {id:1, name:"Oxford Cotton Shirt", cat:"Casual", price:1799, mrp:null, img:"OxfordCottonShirt", tag:"BESTSELLER"},
  {id:2, name:"Heavyweight Crew Tee", cat:"Casual", price:899, mrp:null, img:"HeavyweightCrewTee", tag:null},
  {id:3, name:"Slim Fit Chinos", cat:"Casual", price:1999, mrp:null, img:"SlimFitChinos", tag:null},
  {id:4, name:"Rugged Denim Jacket", cat:"Casual", price:3499, mrp:3999, img:"RuggedDenimJacket", tag:"SALE"},
  {id:5, name:"Corduroy Overshirt", cat:"Casual", price:2799, mrp:null, img:"CorduroyOvershirt", tag:"NEW"},
  {id:6, name:"Cargo Utility Trousers", cat:"Casual", price:2199, mrp:null, img:"CargoUtilityTrousers", tag:null},

  {id:7, name:"Charcoal Wool Blazer", cat:"Formal", price:6999, mrp:8999, img:"CharcoalWoolBlazer", tag:"SALE"},
  {id:8, name:"Classic White Shirt", cat:"Formal", price:1699, mrp:null, img:"ClassicWhiteShirt", tag:"BESTSELLER"},
  {id:9, name:"Pinstripe Trousers", cat:"Formal", price:2499, mrp:null, img:"PinstripeTrousers", tag:null},
  {id:10, name:"Three-Piece Suit", cat:"Formal", price:12999, mrp:15999, img:"ThreePieceSuit", tag:"SALE"},
  {id:11, name:"Silk Neck Tie", cat:"Formal", price:999, mrp:null, img:"SilkNeckTie", tag:null},

  {id:12, name:"Cotton Kurta Set", cat:"Ethnic", price:2499, mrp:null, img:"CottonKurtaSet", tag:"BESTSELLER"},
  {id:13, name:"Nehru Jacket", cat:"Ethnic", price:3299, mrp:null, img:"NehruJacket", tag:"NEW"},
  {id:14, name:"Bandhgala Sherwani", cat:"Ethnic", price:8999, mrp:10999, img:"BandhgalaSherwani", tag:"SALE"},
  {id:15, name:"Silk Blend Kurta", cat:"Ethnic", price:3999, mrp:null, img:"SilkBlendKurta", tag:null},

  {id:16, name:"Full-Grain Leather Belt", cat:"Accessories", price:1299, mrp:null, img:"FullGrainLeatherBelt", tag:null},
  {id:17, name:"Chronograph Watch", cat:"Accessories", price:4999, mrp:6499, img:"ChronographWatch", tag:"SALE"},
  {id:18, name:"Leather Bifold Wallet", cat:"Accessories", price:1499, mrp:null, img:"LeatherBifoldWallet", tag:"BESTSELLER"},
  {id:19, name:"Pocket Square", cat:"Accessories", price:599, mrp:null, img:"PocketSquare", tag:null},
  {id:20, name:"Aviator Sunglasses", cat:"Accessories", price:1799, mrp:null, img:"AviatorSunglasses", tag:"NEW"},
];

let currentFilter = "All";
let cart = []; // {id, qty}

/* ================= Rendering ================= */
function productImg(query, id){
  return `${query}.jpg`;
}

function renderGrid(){
  const grid = document.getElementById('productGrid');
  const list = currentFilter === "All"
    ? PRODUCTS
    : currentFilter === "Sale"
      ? PRODUCTS.filter(p => p.mrp)
      : PRODUCTS.filter(p => p.cat === currentFilter);

  grid.innerHTML = list.map(p => {
    const discount = p.mrp ? Math.round((1 - p.price/p.mrp) * 100) : null;
    const badge = p.tag === "SALE" ? `<span class="badge badge-sale">Sale</span>`
      : p.tag === "NEW" ? `<span class="badge badge-new">New</span>`
      : p.tag === "BESTSELLER" ? `<span class="badge badge-best">Bestseller</span>` : "";
    return `
    <div class="product-card">
      <div class="product-img-wrap">
        ${badge}
        <img src="${productImg(p.img, p.id)}" alt="${p.name}" loading="lazy">
        <div class="quick-add">
          <button class="btn btn-gold btn-sm" onclick="addToCart(${p.id})">Add to Bag — ₹${p.price.toLocaleString('en-IN')}</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-row">
          <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.mrp ? `<span class="mrp">₹${p.mrp.toLocaleString('en-IN')}</span><span class="discount-pct">${discount}% off</span>` : ""}
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterCat(cat, el){
  currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if(el) el.classList.add('active');
  else {
    document.querySelectorAll('.filter-tab').forEach(t => {
      if(t.textContent.trim() === cat) t.classList.add('active');
    });
  }
  document.querySelectorAll('nav.primary-nav button').forEach(a => {
    a.classList.toggle('active', a.textContent.trim() === (cat === 'All' ? 'Shop' : cat));
  });
  renderGrid();
  document.getElementById('shop').scrollIntoView({behavior:'smooth', block:'start'});
}

function goTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ================= Cart logic ================= */
function addToCart(id){
  const existing = cart.find(c => c.id === id);
  if(existing) existing.qty += 1;
  else cart.push({id, qty:1});
  renderCart();
  updateBadge();
  const p = PRODUCTS.find(x=>x.id===id);
  toast(`${p.name} added to your bag`);
}

function changeQty(id, delta){
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c => c.id !== id);
  renderCart();
  updateBadge();
}

function removeItem(id){
  cart = cart.filter(c => c.id !== id);
  renderCart();
  updateBadge();
}

function cartTotal(){
  return cart.reduce((sum, c) => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return sum + p.price * c.qty;
  }, 0);
}

function updateBadge(){
  const count = cart.reduce((s,c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = count;
}

function renderCart(){
  const wrap = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if(cart.length === 0){
    wrap.innerHTML = `<div class="empty-cart"><span class="eyebrow">Empty</span><p>Your bag is empty. Time to fix that.</p></div>`;
    footer.style.display = 'none';
    return;
  }
  footer.style.display = 'block';
  wrap.innerHTML = cart.map(c => {
    const p = PRODUCTS.find(x => x.id === c.id);
    return `
    <div class="cart-item">
      <img src="${productImg(p.img, p.id)}" alt="${p.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-cat">${p.cat}</div>
        <div class="cart-item-bottom">
          <div class="qty-control">
            <button onclick="changeQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
            <span>${c.qty}</span>
            <button onclick="changeQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
          <span class="price">₹${(p.price * c.qty).toLocaleString('en-IN')}</span>
        </div>
        <button class="remove-link" onclick="removeItem(${p.id})">Remove</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartSubtotal').textContent = `₹${cartTotal().toLocaleString('en-IN')}`;
}

/* ================= Panels ================= */
function openCart(){
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeAllPanels(){
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('checkoutModal').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  closeSearch();
}

/* ================= Search ================= */
function openSearch(){
  document.getElementById('searchBar').classList.add('open');
  const input = document.getElementById('searchInput');
  input.value = '';
  document.getElementById('searchResults').innerHTML = '';
  setTimeout(() => input.focus(), 50);
}

function closeSearch(){
  document.getElementById('searchBar').classList.remove('open');
}

function renderSearchResults(query){
  const box = document.getElementById('searchResults');
  const q = query.trim().toLowerCase();
  if(q === ''){
    box.innerHTML = '';
    return;
  }
  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  );
  if(matches.length === 0){
    box.innerHTML = `<div class="search-empty">No results for "${query}". Try a different term.</div>`;
    return;
  }
  box.innerHTML = matches.slice(0, 8).map(p => `
    <button class="search-result" onclick="goToProduct(${p.id})">
      <img src="${productImg(p.img, p.id)}" alt="${p.name}">
      <div class="search-result-info">
        <div class="search-result-name">${p.name}</div>
        <div class="search-result-cat">${p.cat} · ₹${p.price.toLocaleString('en-IN')}</div>
      </div>
    </button>
  `).join('');
}

function goToProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  closeSearch();
  filterCat(p.cat);
}

/* ================= Checkout ================= */
let selectedPayment = "COD";

function openCheckout(){
  if(cart.length === 0){ toast("Your bag is empty"); return; }
  renderCheckoutForm();
  document.getElementById('checkoutModal').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}

function renderCheckoutForm(){
  const box = document.getElementById('checkoutBox');
  const shipping = cartTotal() >= 2999 ? 0 : 149;
  const total = cartTotal() + shipping;
  box.innerHTML = `
    <span class="eyebrow">Checkout</span>
    <h3>Shipping details</h3>
    <form id="checkoutForm" onsubmit="placeOrder(event)">
      <div class="form-row">
        <div class="field"><label>Full name</label><input required name="name" placeholder="Ravi Kumar"></div>
        <div class="field"><label>Phone</label><input required name="phone" pattern="[0-9]{10}" placeholder="98765 43210"></div>
      </div>
      <div class="form-row full">
        <div class="field"><label>Address</label><input required name="address" placeholder="House no., street, area"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>City</label><input required name="city" placeholder="Bengaluru"></div>
        <div class="field"><label>Pincode</label><input required name="pincode" pattern="[0-9]{6}" placeholder="560001"></div>
      </div>

      <span class="eyebrow" style="display:block;margin:20px 0 10px;">Payment method</span>
      <div class="pay-options" id="payOptions">
        <label class="pay-option selected" data-val="COD">
          <input type="radio" name="pay" value="COD" checked onchange="setPayment('COD')"> <span>Cash on Delivery</span>
        </label>
        <label class="pay-option" data-val="UPI">
          <input type="radio" name="pay" value="UPI" onchange="setPayment('UPI')"> <span>UPI (GPay / PhonePe / Paytm)</span>
        </label>
        <label class="pay-option" data-val="CARD">
          <input type="radio" name="pay" value="CARD" onchange="setPayment('CARD')"> <span>Credit / Debit Card</span>
        </label>
      </div>

      <div id="upiFields" class="card-fields">
        <div class="field"><label>UPI ID</label><input name="upi" placeholder="yourname@upi"></div>
      </div>
      <div id="cardFields" class="card-fields">
        <div class="form-row full"><div class="field"><label>Card number</label><input name="cardnum" placeholder="1234 5678 9012 3456" maxlength="19"></div></div>
        <div class="form-row">
          <div class="field"><label>Expiry</label><input name="exp" placeholder="MM/YY"></div>
          <div class="field"><label>CVV</label><input name="cvv" placeholder="•••" maxlength="3"></div>
        </div>
      </div>

      <div class="order-summary-box" style="margin-top:18px;">
        <div class="order-summary-row"><span>Subtotal</span><span>₹${cartTotal().toLocaleString('en-IN')}</span></div>
        <div class="order-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '₹'+shipping}</span></div>
        <div class="order-summary-row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
      </div>

      <button type="submit" class="btn btn-gold btn-full">Place Order — ₹${total.toLocaleString('en-IN')}</button>
      <button type="button" class="btn btn-outline btn-full" style="margin-top:10px;" onclick="closeAllPanels()">Cancel</button>
    </form>
  `;
}

function setPayment(val){
  selectedPayment = val;
  document.querySelectorAll('.pay-option').forEach(o => o.classList.toggle('selected', o.dataset.val === val));
  document.getElementById('upiFields').classList.toggle('show', val === 'UPI');
  document.getElementById('cardFields').classList.toggle('show', val === 'CARD');
}

function placeOrder(e){
  e.preventDefault();
  const orderId = 'OMS' + Math.floor(100000 + Math.random()*900000);
  const box = document.getElementById('checkoutBox');
  box.innerHTML = `
    <div class="confirm-view">
      <div class="confirm-icon">✓</div>
      <h3>Order placed</h3>
      <p>Thank you. Your order has been confirmed and will ship within 24 hours.</p>
      <div class="order-id">Order ID: ${orderId}</div>
      <p>Payment method: ${selectedPayment === 'COD' ? 'Cash on Delivery' : selectedPayment === 'UPI' ? 'UPI' : 'Card'}</p>
      <button class="btn btn-gold btn-full" style="margin-top:24px;" onclick="finishOrder()">Continue Shopping</button>
    </div>
  `;
  cart = [];
  updateBadge();
  renderCart();
}

function finishOrder(){
  closeAllPanels();
}

/* ================= Toast ================= */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2400);
}

/* ================= Notice bar rotation ================= */
(function(){
  const items = document.querySelectorAll('#noticeTrack .notice-item');
  let idx = 0;
  setInterval(() => {
    items[idx].classList.remove('active');
    idx = (idx + 1) % items.length;
    items[idx].classList.add('active');
  }, 6000); // each message stays for 6 full seconds
})();

/* ================= Init ================= */
renderGrid();
renderCart();
updateBadge();
