const productCreationErrorInfo = (product) => {
  return `One or more properties were incomplete or invalid.
    Required properties:
    - name: need to be a string but recieved: ${product.name}
    - description: need to be a string but recieved: ${product.description}
    - category: need to be a string but recieved: ${product.category}
    - price: need to be a string but recieved: ${product.price}
    - thumbnail: need to be a string but recieved: ${product.thumbnail}
    `;
};

const nonExistentProductErrorInfo = (productId) => {
  return `The product with ID: "${productId}" doesn't exist`;
};

export { productCreationErrorInfo, nonExistentProductErrorInfo };
