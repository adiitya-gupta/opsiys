const Razorpay = require("razorpay");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { amount, currency = "INR", packageName, customerName, customerEmail } = JSON.parse(event.body || "{}");

    if (!amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Amount is required" })
      };
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && keyId !== "your_razorpay_key_id_here") {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });

      const order = await instance.orders.create({
        amount: Math.round(amount * 100),
        currency: currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          packageName: packageName || "Custom Plan",
          customerName: customerName || "Client",
          customerEmail: customerEmail || "client@example.com"
        }
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        orderId: null,
        isMock: true,
        message: "Client-side Razorpay checkout active"
      })
    };
  } catch (error) {
    console.error("Netlify Razorpay Order Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Failed to create order" })
    };
  }
};
