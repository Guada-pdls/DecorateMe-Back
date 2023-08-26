const nonExistentCartErrorInfo = (productId) => {
  return `The product with ID: "${productId}" doesn't exist`;
};

const invalidUnits = () => 'The units must be greater than 0'

export default { nonExistentCartErrorInfo, invalidUnits };
