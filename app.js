// variables

const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector(".topcart");
const cartPR = document.querySelector(".header-xtra pull-right");
const cartItem = document.querySelector(".ci-item");
const cartTotal = document.querySelector(".ci-total");
const cartInfo = document.querySelector(".ci-info");
const productsDOM = document.querySelector(".product-carousel3");

//getting all products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(product => {
      result += `
                            <div class="pc-wrap ">
                                <div class="product-item">
                                    <div class="item-thumb">
                                        <span class="badge new">New</span>
                                        <img src=${
                                          product.image
                                        } class="img-responsive" alt="" />
                                        <div class="overlay-rmore fa fa-search quickview" data-toggle="modal"
                                            data-target="#myModal"></div>
                                        <div class="product-overlay" data-id=${
                                          product.id
                                        }>
                                            <a href="#" class="addcart fa fa-shopping-cart"></a>
                                            <a href="#" class="compare fa fa-signal"></a>
                                            <a href="#" class="likeitem fa fa-heart-o"></a>
                                        </div>
                                    </div>
                                    <div class="product-info">
    <h4 class="product-title">${
      product.title
    }<a href="single-product.html">Product fashion</a></h4>
                                        <span class="product-price">$${
                                          product.price
                                        }</span>
                                        <div class="item-colors">
                                            <a href="#" class="brown"></a>
                                            <a href="#" class="white"></a>
                                            <a href="#" class="litebrown"></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                  
      `;
    });
    productsDOM.innerHTML = result;
  }
}

//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products.getProducts().then(products => ui.displayProducts(products));
});
