let cart = [];

function showCategory(category) {
  document.querySelectorAll('.category-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById('cat-' + category).classList.add('active');
  event.target.classList.add('active');
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: parseFloat(price), qty: 1 });
  }
  updateCart();
}

function removeFromCart(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name} x${item.qty}</span><span>R${(item.price * item.qty).toFixed(2)}
     <button onclick="removeFromCart(${index})">X</button></span>`;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = `R${total.toFixed(2)}`;
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('order-btn')) {
    const btn = e.target;
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    addToCart(name, price);
    btn.textContent = 'Added';
    setTimeout(() => btn.textContent = '+ Add', 1000);
  }
});

function placeOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const orderType = document.querySelector('input[name="order-type"]:checked').value;
  const payType = document.querySelector('input[name="pay-type"]:checked').value;

  if (!name || !phone) {
    alert('Please enter your name and phone number!');
    return;
  }

  if (cart.length === 0) {
    alert('Please add items to your order first!');
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
  });

  let formattedPhone = phone.replace(/\s+/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '+27' + formattedPhone.slice(1);
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+27' + formattedPhone;
  }

  const orderPayload = {
    name,
    phone: formattedPhone,
    orderType,
    payType,
    cart,
    total: total.toFixed(2),
  };

  const btn = document.getElementById('place-order-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  })
    .then(res => res.json())
    .then(() => {
      alert('Order placed! You and the shop will receive an SMS shortly.');
      cart = [];
      updateCart();
      document.getElementById('customer-name').value = '';
      document.getElementById('customer-phone').value = '';
    })
    .catch(() => {
      alert('Order could not be sent. Please call the shop directly.');
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Place Order';
      }
    });
}