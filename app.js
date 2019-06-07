// variables

const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector(".topcart");
const cartPR = document.querySelector(".header-xtra pull-right");
const cartItem = document.querySelector(".ci-item");
const cartTotal = document.querySelector(".ci-total");
const cartInfo = document.querySelector(".ci-info");
const productsDOM = document.querySelector(".product-item");

//getting all products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {}

//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts().then(data => console.log(data));
});
