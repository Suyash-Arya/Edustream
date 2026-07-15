import api from "./axios";

export const purchaseAPI = {
  createRazorpayOrder: async (courseId) => {
    return api.post("/razorpay/create-order", { courseId });
  },

  verifyRazorpayPayment: async (payload) => {
    return api.post("/razorpay/verify-payment", payload);
  },

  createStripeCheckout: async (courseId) => {
    return api.post("/purchase/checkout/create-checkout-session", { courseId });
  },

  getPurchasedCourses: async () => {
    return api.get("/purchase");
  },

  getCoursePurchaseStatus: async (courseId) => {
    return api.get(`/purchase/course/${courseId}/detail-with-status`);
  },
};
