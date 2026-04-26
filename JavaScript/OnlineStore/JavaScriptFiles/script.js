const products = [
  { id: 1, name: "iPhone 17 Pro Max", price: 111199, image: "images/iphone.jpg", category: "موبایل", categoryId: 'mobile' },
  { id: 2, name: "Samsung Galaxy S26", price: 154999, image: "images/s26ultra.jpg", category: "موبایل", categoryId: 'mobile' },

  { id: 3, name: "MacBook Pro M5", price: 229999, image: "images/applepc.jpg", category: "کمپیوتر", categoryId: 'computer' },
  { id: 4, name: "Gaming PC RTX 6090", price: 199999, image: "images/gaming.jpg", category: "کمپیوتر", categoryId: 'computer' },

  { id: 5, name: "کوچ ترکی", price: 54999, image: "images/turkish.jpg", category: "لوازم خانه", categoryId: 'homeFurniture' },
  { id: 6, name: "میز غدا خوری شیک", price: 29999, image: "images/table.jpg", category: "لوازم خانه", categoryId: 'homeFurniture' },

  { id: 7, name: "یخچال هوشمند", price: 99999, image: "images/fridge.jpg", category: "لوازم برقی", categoryId: 'electric' },
  { id: 8, name: "ماشین لباس شویی هوشمند", price: 49999, image: "images/washing.jpg", category: "لوازم برقی", categoryId: 'electric' },

  { id: 9, name: "VR Headset Ultra", price: 17999, image: "", category: "گجت های دلچسپ", categoryId: 'gajets' },
  { id: 10, name: "عینک های هوشمند", price: 36000, image: "", category: "گجت های دلچسپ", categoryId: 'gajets' },

  { id: 11, name: "موتر ریموتی", price: 1599, image: "", category: "اسباب بازی کودکان", categoryId: 'toys' },
  { id: 12, name: "روبات بازی هوشمند", price: 4999, image: "", category: "اسباب بازی کودکان", categoryId: 'toys' }
];

let cart = [];

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const productsContainer = document.getElementById("productsContainer");


function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);

    // Disable add buttons for items already in cart
    cart.forEach(item => {
      const btn = document.getElementById(`add-${item.id}`);
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "<span class='material-symbols-outlined cart-icon'>check</span>";
      }
    });

    updateCart();
  }
}

// Render the elements
function renderProducts() {
  productsContainer.innerHTML = "";

  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(category => {
    const section = document.createElement("div");
    section.classList.add("category-section");
    section.innerHTML = `
      <h2>${category}</h2>
      <div class="product-grid"></div>
    `;

    const grid = section.querySelector(".product-grid");
    const filteredProducts = products.filter(p => p.category === category);
    filteredProducts.forEach(product => {
      section.id = product.categoryId;
      grid.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <div class="product-title">${product.name}</div>
            <div class="product-price">${product.price}afg</div>
            <button class="primary-btn add-btn" id="add-${product.id}">
              افزودن به سبد
            </button>
          </div>
        </div>
      `;
    });

    productsContainer.appendChild(section);
  });

  attachAddEvents();
}

//Add to cart
function attachAddEvents() {
  products.forEach(product => {
    const btn = document.getElementById(`add-${product.id}`);
    if (btn) {
      btn.addEventListener("click", () => addToCart(product.id));
    }
  });
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) return;

  const product = products.find(p => p.id === id);

  cart.push({
    ...product,
    quantity: 1
  });

  const btn = document.getElementById(`add-${id}`);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "<span class='material-symbols-outlined cart-icon'>check</span>";
  }

  updateCart();
}

//update the cart after changes
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div class="cart-controls">
          <span>${item.price}afg</span>

          <span class="material-symbols-outlined cart-icon" id="minus-${item.id}">
            remove
          </span>

          <span class="quantity">${item.quantity}</span>

          <span class="material-symbols-outlined cart-icon" id="plus-${item.id}">
            add
          </span>

          <span class="material-symbols-outlined cart-icon" id="delete-${item.id}">
            delete
          </span>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = total;
  cartCount.textContent = cart.length;

  attachCartEvents();

  saveCartToLocalStorage();
}


//cart buttons events
function attachCartEvents() {
  cart.forEach(item => {

    const plus = document.getElementById(`plus-${item.id}`);
    const minus = document.getElementById(`minus-${item.id}`);
    const del = document.getElementById(`delete-${item.id}`);

    if (plus) {
      plus.addEventListener("click", () => {
        item.quantity++;
        updateCart();
      });
    }

    if (minus) {
      minus.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          removeFromCart(item.id);
        }
        updateCart();
      });
    }

    if (del) {
      del.addEventListener("click", () => {
        removeFromCart(item.id);
        updateCart();
      });
    }
  });
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  const btn = document.getElementById(`add-${id}`);
  if (btn) {
    btn.disabled = false;
    btn.textContent = "افزودن به سبد";
  }
}

//Cart side bar switch
document.getElementById("cartBtn").addEventListener('click', () => {
  cartSidebar.classList.toggle("active");
});

//Checkout button
document.getElementById("checkoutBtn").addEventListener('click', () => {
  alert("Checkout successful!");
  cart = [];
  updateCart();

  products.forEach(product => {
    const btn = document.getElementById(`add-${product.id}`);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "افزودن به سبد";
    }
  });
});

//Dark mode switch
let darkButton = document.getElementById('darkToggle');

// Load dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

darkButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

//Call functions
renderProducts();
loadCartFromLocalStorage();