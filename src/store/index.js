import {
  createStore
} from 'vuex';

export default createStore({
  state: {
    data: [],
    products: [],
    cart: [],
    fullPrice: null,
    userId: null,
    token: '075c5aefc6963c4bd39805333e817d45aeca9a8f',
    updateCartCount: 0
  },
  getters: {
    getData: state => state.data,
    getProducts: state => state.products,
    postProducts: state => state.cart,
    getCartItems: () => JSON.parse(localStorage.getItem('productDetails')) || [],
    getTotalPrice: () => {
      const cart = JSON.parse(localStorage.getItem('productDetails'))
      if(cart) {
        let totalPrice = 0
        cart.forEach(item => {
          const price = parseInt(item.price.split(' ').join('')) * item.count
          totalPrice += price
        })
        return totalPrice
      } else {
        return 0
      }
    }
  },
  mutations: {
    setData(state, payload) {
      state.data = payload;
    },
    setProducts(state, payload) {
      state.products = payload
    },
    clearProducts(state) {
      state.products = []
    },
    setCart(state, payload) {
      state.cart = payload
    },
    setFullPrice(state, payload) {
      state.fullPrice = payload;
    },
    updateCartCount(state) {
      state.updateCartCount++
    }
  },
  actions: {
    refreshCart(_, newArray) {
      localStorage.setItem('productDetails', JSON.stringify(newArray))
    },
    setCartItem(_, product) {
      const cart = []
      const dataFromStorage = JSON.parse(localStorage.getItem('productDetails'))
      if(dataFromStorage?.length) {
        cart.push(...dataFromStorage)
        const getProductIdx = cart.findIndex(item => item.id === product.id)
        if(getProductIdx !== -1) {
          cart[getProductIdx] = product
        } else {
          cart.push(product)
        }
      } else {
        cart.push(product)
      }
      localStorage.setItem('productDetails', JSON.stringify(cart))
    },
    fetchData({
      commit
    }) {
      const url = 'https://grandhallbackend.supersite.uz/category_all/';

      fetch(url, {
          headers: {
            'Authorization': `token ${this.state.token}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          commit('setData', data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchProducts({
      commit
    }, id) {
      const url = `https://grandhallbackend.supersite.uz/get_products_by_categoryid/${id}/`;
      commit('clearProducts')
      fetch(url, {
          headers: {
            'Authorization': `token ${this.state.token}`,
          },
        })
        .then(response => response.json())
        .then(products => {
          commit('setProducts', products);
        })
        .catch(error => {
          console.error(error);
        });
    },
    async postData({
      state,
      commit
    }, payload) {
      try {
        const response = await fetch('https://grandhallbackend.supersite.uz/or/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${state.token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    clearCart({
      commit
    }) {
      commit('setCart', []);
    },
    clearPrice({
      commit
    }) {
      commit('setFullPrice', '');
    },
  },
})
