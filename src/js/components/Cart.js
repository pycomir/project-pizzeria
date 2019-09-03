import {templates, classNames, select, settings} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    //console.log('thisCart:', thisCart);
    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    console.log('delivery:', thisCart.deliveryFee);
    thisCart.getElements(element);
    thisCart.initActions();


    //console.log('new Cart:', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    //console.log('thisApp.dom.toggleTrigger:', thisCart.dom.toggleTrigger);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    //console.log(thisCart.dom.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    console.log('phone DOM:', thisCart.dom.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    console.log('address DOM:', thisCart.dom.address);
    for(let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions() {
    const thisCart = this;
    //console.log ('thisCart:', this);
    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
      console.log('product removed');
    });

    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });

  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      products: [],
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
    };

    for(let product of thisCart.products) {
      payload.products.push(product.getData());
      console.log('products:', payload.products);
      console.log('product',product);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse:', parsedResponse);
      });
  }

  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log('generatedHTML:', generatedHTML);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //console.log('generatedDOM:', generatedDOM);

    //const cartContainer = document.querySelector(select.containerOf.cart);
    thisCart.dom.productList.appendChild(generatedDOM);
    //console.log('adding product:', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products:', thisCart.products);

    thisCart.update();
    console.log('product add');
    console.log('products in cart', thisCart.products);
    //console.log('cartProduct:', cartProduct);


  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for(let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    if(thisCart.totalNumber == 0) {
      thisCart.totalPrice = 0;
    }

    //console.log('thisCart.totalNumber:', thisCart.totalNumber);
    //console.log('thisCart.subtotalPrice:', thisCart.subtotalPrice);
    //console.log('thisCart.totalPrice:', thisCart.totalPrice);

    for(let key of thisCart.renderTotalsKeys) {
      for(let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;
    console.log('thisCart', this);
    const index = thisCart.products.indexOf(cartProduct);
    console.log('cartProduct:', cartProduct);
    console.log('index:', index);
    thisCart.products.splice(index, 1);
    event.detail.cartProduct.dom.wrapper.remove();
    thisCart.update();

  }
/* END of Cart class */
}

export default Cart;
