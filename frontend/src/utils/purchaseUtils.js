export const resolveCheckoutUrl = (response) => {
  if (!response) return null;

  if (typeof response === "string") return response;

  const directSessionUrl = response.sessionUrl || response.checkoutUrl;
  if (directSessionUrl) return directSessionUrl;

  const nestedCheckoutUrl =
    response?.data?.checkoutUrl || response?.data?.sessionUrl;
  if (nestedCheckoutUrl) return nestedCheckoutUrl;

  return null;
};
