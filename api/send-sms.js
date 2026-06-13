const twilio = require('twilio');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const { name, phone, orderType, payType, cart, total } = req.body;

  
  const items = cart.map(i => `${i.name} x${i.qty} = R${(i.price * i.qty).toFixed(2)}`).join('\n');

  const ownerMessage = `🛍 New Order!\nName: ${name}\nPhone: ${phone}\nType: ${orderType}\nPayment: ${payType}\nItems:\n${items}\nTotal: R${total}`;
  const customerMessage = `Hi ${name}! ✅ Your order at Bra Love's Kota has been received.\nTotal: R${total}\nWe'll get it ready soon!`;

  try {
    
    await client.messages.create({
      body: ownerMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.OWNER_PHONE_NUMBER,
    });

   
    await client.messages.create({
      body: customerMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone, 
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
