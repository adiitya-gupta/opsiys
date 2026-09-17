import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency = "INR", packageName, customerName, customerEmail } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If API keys are configured on the server, create an official Razorpay order
    if (keyId && keySecret && keyId !== "your_razorpay_key_id_here") {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });

      const options = {
        amount: Math.round(amount * 100), // amount in paise
        currency: currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          packageName: packageName || "Custom Plan",
          customerName: customerName || "Client",
          customerEmail: customerEmail || "client@example.com"
        }
      };

      const order = await instance.orders.create(options);
      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      });
    }

    // Fallback response for client-side mode when server keys are not yet provided
    return res.status(200).json({
      success: true,
      orderId: null,
      isMock: true,
      message: "Client-side Razorpay checkout active"
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({ error: error.message || "Failed to create order" });
  }
}
