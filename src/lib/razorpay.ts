import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
    RAZORPAY_KEY_ID?: string;
  }
}

// Default fallback key for test environments when VITE_RAZORPAY_KEY_ID is not yet set in .env
export const DEFAULT_RAZORPAY_KEY_ID = "rzp_test_opsiys_growth";

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Returns the active Razorpay Key ID from environment variables or fallback
 */
export const getRazorpayKeyId = (): string => {
  const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
  if (envKey && envKey !== "your_razorpay_key_id_here") {
    return envKey;
  }
  if (window.RAZORPAY_KEY_ID) {
    return window.RAZORPAY_KEY_ID;
  }
  return DEFAULT_RAZORPAY_KEY_ID;
};

export interface RazorpayCustomerDetails {
  name: string;
  email: string;
  phone: string;
  company?: string;
  gstin?: string;
}

export interface RazorpayPaymentSuccessPayload {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface InitiatePaymentParams {
  amountInINR: number;
  packageName: string;
  customer: RazorpayCustomerDetails;
  isDeposit?: boolean;
  depositNote?: string;
  onSuccess: (payload: RazorpayPaymentSuccessPayload) => void;
  onFailure?: (error: any) => void;
}

/**
 * Saves completed payment records into Firebase Firestore for audit logging
 */
export const savePaymentRecordToFirestore = async (recordData: {
  paymentId: string;
  orderId?: string;
  amountInINR: number;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  gstin?: string;
  isDeposit?: boolean;
  depositNote?: string;
  status: "success" | "failed";
}) => {
  try {
    const docRef = await addDoc(collection(db, "payments"), {
      ...recordData,
      createdAt: serverTimestamp(),
      currency: "INR",
      gateway: "Razorpay"
    });
    console.log("Payment record logged in Firestore:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Firestore Payment Audit Logging Error:", error);
    return null;
  }
};

/**
 * Creates an order via backend server endpoint if available
 */
export const createServerRazorpayOrder = async (params: {
  amountInINR: number;
  packageName: string;
  customerName: string;
  customerEmail: string;
}) => {
  try {
    const response = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: params.amountInINR,
        packageName: params.packageName,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        currency: "INR"
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.orderId || null;
    }
  } catch (err) {
    console.warn("Backend order creation endpoint fallback:", err);
  }
  return null;
};

/**
 * Initializes the Razorpay Checkout Modal
 */
export const initiateRazorpayPayment = async ({
  amountInINR,
  packageName,
  customer,
  isDeposit = false,
  depositNote = "",
  onSuccess,
  onFailure
}: InitiatePaymentParams): Promise<boolean> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Razorpay payment gateway failed to load. Please check your internet connection.");
    if (onFailure) onFailure(new Error("Script load failed"));
    return false;
  }

  const keyId = getRazorpayKeyId();
  const serverOrderId = await createServerRazorpayOrder({
    amountInINR,
    packageName: isDeposit ? `${packageName} (Token Deposit)` : packageName,
    customerName: customer.name,
    customerEmail: customer.email
  });

  const amountInPaise = Math.round(amountInINR * 100);

  const options = {
    key: keyId,
    amount: amountInPaise,
    currency: "INR",
    name: "OPSIYS Systems Inc.",
    description: isDeposit ? `Booking Deposit: ${packageName}` : `Package Subscription: ${packageName}`,
    image: "https://opsiys.in/logos/opsiyslogo.png",
    order_id: serverOrderId || undefined,
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone
    },
    notes: {
      package: packageName,
      isDeposit: isDeposit ? "Yes" : "No",
      depositNote: depositNote || "N/A",
      company: customer.company || "Individual",
      gstin: customer.gstin || "N/A"
    },
    theme: {
      color: "#0B0B0B"
    },
    modal: {
      ondismiss: function () {
        console.log("Razorpay checkout modal dismissed by user.");
        if (onFailure) onFailure(new Error("Checkout dismissed"));
      }
    },
    handler: async function (response: RazorpayPaymentSuccessPayload) {
      console.log("Razorpay Payment Success Response:", response);
      
      // Save record to Firestore
      await savePaymentRecordToFirestore({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id || serverOrderId || "N/A",
        amountInINR,
        packageName,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        company: customer.company,
        gstin: customer.gstin,
        isDeposit,
        depositNote,
        status: "success"
      });

      onSuccess(response);
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      console.error("Razorpay Payment Failed:", response.error);
      savePaymentRecordToFirestore({
        paymentId: response.error?.metadata?.payment_id || "FAILED_" + Date.now(),
        amountInINR,
        packageName,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        status: "failed"
      });
      if (onFailure) onFailure(response.error);
    });

    rzp.open();
    return true;
  } catch (error) {
    console.error("Razorpay Modal Launch Error:", error);
    if (onFailure) onFailure(error);
    return false;
  }
};
