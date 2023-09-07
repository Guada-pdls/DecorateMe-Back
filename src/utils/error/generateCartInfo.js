const nonExistentCart = (cid) => {
  return `The cart with ID ${cid} doesn't exist`;
};

const invalidUnits = 'The units must be greater than 0'

const notFoundCarts = 'Not found carts'

const nonExistentProductInCart = (productId) => `The product with ID "${productId} does not exist in cart`

const emptyCart = 'The cart is empty'

const invalidStocks = 'The cart only has out-of-stock products'

export { nonExistentCart, invalidUnits, notFoundCarts, nonExistentProductInCart, emptyCart, invalidStocks };
