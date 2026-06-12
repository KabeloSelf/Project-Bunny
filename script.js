let cart = [];

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
  cart.forEach((item , index)=> {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name} x${item.qty}</span><span>R${(item.price * item.qty).toFixed(2)}
     <button onclick="removeFromCart(${index})">❌</button></span>`;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = `R${total.toFixed(2)}`;
}

document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    addToCart(name, price);
    btn.textContent = '✓ Added';
    setTimeout(() => btn.textContent = '+ Add', 1000);
  });
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

  let orderText = `Hello Bra Love's Kota! \n\n`;
  orderText += `*New Order*\n`;
  orderText += `Name: ${name}\n`;
  orderText += `Phone: ${phone}\n`;
  orderText += `Type: ${orderType}\n`;
  orderText += `Payment: ${payType}\n\n`;
  orderText += `*Items:*\n`;

  let total = 0;
  cart.forEach(item => {
    orderText += `- ${item.name} x${item.qty} = R${(item.price * item.qty).toFixed(2)}\n`;
    total += item.price * item.qty;
  });

  orderText += `\n*Total: R${total.toFixed(2)}*`;

  const whatsappNumber = '27000000000';
  const encoded = encodeURIComponent(orderText);
  window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
}