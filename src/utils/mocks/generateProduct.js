import { faker } from "@faker-js/faker";

const getRandomCategory = () => {
  const categories = [
    "Lightning",
    "Wall Deco",
    "Accessories",
    "Textile",
    "Art",
    "Nature",
    "Furniture",
  ];
  const randomIndex = faker.number.int({ min: 0, max: categories.length - 1 });
  return categories[randomIndex];
};

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(["Lightning",
    "Wall Deco",
    "Accessories",
    "Textile",
    "Art",
    "Nature",
    "Furniture",]),
    price: faker.commerce.price(),
    thumbnail: faker.image.url(),
    stock: faker.string.numeric({ min: 5, max: 100 }),
    rating: faker.string.numeric({ min: 0, max: 5 }),
  };
};

export default generateProduct;
