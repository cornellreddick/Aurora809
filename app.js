// variables

const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector(".topcart");
const cartPR = document.querySelector(".header-xtra pull-right");
const cartItem = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".ci-total");
const cartInfo = document.querySelector(".ci-item-info");
const productsDOM = document.querySelector(".product-content");
const clearCartBtn = document.querySelector(".clear-cart");

// cart
let cart = [];
//buttons
let butonsDOM = [];

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
                                        <div class="product-overlay">
                                            <button class="addcart" data-id=${
                                              product.id
                                            }> 
                                            <i class="fas fa-shopping-cart"></i>
                                            </button>
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
                       
                  
      `;
    });
    productsDOM.innerHTML = result;
  }
  getAddButtons() {
    const buttons = [...document.querySelectorAll(".addcart")];
    butonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        // save the cart in local Storage
        Storage.saveCart(cart);
        // set the value in the cart
        this.setCartValues(cart);
        // add cart item
        this.addCartItem(cartItem);
        // show the cart
        //this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItem.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("ci-item");
    div.innerHTML = `
    <img src=${item.image} width="80" alt="" />
                                            <div class="ci-item-info">
                                                <h5><a>${item.title}</a></h5>
                                                <p>$${item.price}</p>
                                                <button class="remove-item" data-id=${
                                                  item.id
                                                }>remove</button>
                                                <div>
                                                    <i class="fas fa-chevron-up" data-id=${
                                                      item.id
                                                    }></i>
                                                    <p class="ci-amount">${
                                                      item.amount
                                                    }</p>
                                                    <i class="fas fa-chevron-down" data-id=${
                                                      item.id
                                                    }></i>
                                                </div>
                                                <div class="ci-edit">
                                                    <a href="#" class="edit fa fa-edit"></a>
                                                    <a href="#" class="edit fa fa-trash" data-id=${
                                                      item.id
                                                    }></a>
                                                </div>
                                            </div>
                                            
    `;

    cartInfo.appendChild(div);
  }

  // showCart(){

  // }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populate(cart);
    // cartBtn.addEventListener('click', this.showCart)
    //closeCartBtn.add
  }

  populate(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  cartLogic() {
    // clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartInfo.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        //cartInfo.removeChild
        cartInfo.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // console.log(addAmount);
        let tempItem = cart.find(item => item.id == id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }
    });
  }

  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    console.log(cartInfo.children);

    while (cartInfo.children.length > 0) {
      cartInfo.removeChild(cartInfo.children[0]);
    }
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>`;
  }

  getSingleButton(id) {
    return butonsDOM.find(button => button.dataset.id === id);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products)); //using local storage on the browser.
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // set up App
  ui.setupApp();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products); //setting all of the values to the local storage.
    })
    .then(() => {
      ui.getAddButtons(); //this is an extention using the then to get the add butons.
      ui.cartLogic();
    });
});
