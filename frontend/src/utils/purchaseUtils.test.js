import test from "node:test";
import assert from "node:assert/strict";
import { resolveCheckoutUrl } from "./purchaseUtils.js";

test("extracts checkout URL from the backend response shape", () => {
  const response = {
    success: true,
    data: {
      checkoutUrl: "https://checkout.stripe.com/pay/cs_test_123",
    },
  };

  assert.equal(
    resolveCheckoutUrl(response),
    "https://checkout.stripe.com/pay/cs_test_123",
  );
});

test("supports the older frontend response shape", () => {
  const response = {
    sessionUrl: "https://checkout.stripe.com/pay/cs_test_456",
  };

  assert.equal(
    resolveCheckoutUrl(response),
    "https://checkout.stripe.com/pay/cs_test_456",
  );
});
