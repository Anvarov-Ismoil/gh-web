<template>
  <div class="modal w-full max-w-[355px] bg-white mx-auto mt-12 pt-2 
    pb-3 py-9 rounded-3xl overflow-hidden" @click.stop>
    <div class="close pt-1 flex justify-end px-5 cursor-pointer border-b border-black/10">
      <button @click="$emit('close')">
        <i class="fas fa-times text-black/70 text-4xl"></i>
      </button>
    </div>
    <div class="content flex items-center justify-center gap-4 mx-3 my-5 transition-all duration-300">
      <div class="left w-[150px] h-[150px]">
        <img class="w-full h-full object-cover rounded-full" :src="product.product_image" alt="#">
      </div>
      <div class="right text-center font-semibold">
        <h1 class="text-black text-lg">
          {{ (lang === 'ru' ? product.product_name_ru : product.product_name_uz) }}
        </h1>
        <div class="bg-white rounded-2xl mt-3">
          <h1 class="text-lg">{{ product.price }} * {{ counter }}</h1>
          <h1 class="my-3 text-2xl font-bold">
            ***** so'm
          </h1>
          <div class="btns flex items-center justify-center gap-3">
            <!-- Minus -->
            <button @click="subtractPrice(product.price)"
              class="btn bg-light-red px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center"><span>-</span></button>
            <!-- Plus -->
            <button @click="countPrice(product.price)"
              class="btn bg-light-green px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center">
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-black/10">
      <div class="btns flex items-center justify-end gap-4 mt-5 mx-3 text-white">
        <button @click="$emit('close')" class="bg-light-gray px-3 py-3 rounded-xl w-32 text-[16px] font-bold">
          {{ (lang === 'ru' ? 'Отмена' : 'Bekor qilish') }}
        </button>
        <button @click="addProduct" class="bg-light-green px-3 py-3 rounded-xl w-32 text-[16px] font-bold">
          {{ (lang === 'ru' ? 'Добавить' : "Tasdiqlash") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // counter: 1,
      // answer: 0,
      // productCost: 0,
      // productIndex: 0,
      modalOpenedBefore: false,
      productObject: {
        id: this.productId,
        cost: null,
        price: null,
        count: null,
        [this.lang === 'ru' ? 'product_name_ru' : 'product_name_uz']: this.productName,
        product_image: this.productImage,
      },
      productDetails: [],
    }
  },
  props: {
    // details: {
    //   type: [Object, String]
    // },
    // productId: {
    //   type: [String, Number]
    // },
    // productName: {
    //   type: String,
    // },
    // productImage: {
    //   type: String
    // },
    product: Object,
    lang: {
      type: String
    },
  },
  methods: {
    countPrice(price) {
      this.counter++
      this.answer = this.counter * (typeof price === 'string' ? parseInt(price.replace(/\s/g, ""), 10) : price)
      // parseInt(price.replace(/\s/g, ""), 10)
    },
    subtractPrice(price) {
      if (this.counter > 1) {
        this.counter--;
        this.answer = this.answer - (typeof price === 'string' ? parseInt(price.replace(/\s/g, ""), 10) : price)
        // parseInt(price.replace(/\s/g, ""), 10)
      }
    },
    addProduct() {
      if (typeof (this.answer) === 'string') {
        this.productObject.cost = parseInt(this.answer.replace(/\s/g, ""), 10)
        // this.productObject.price = parseInt(this.answer.replace(/\s/g, ""), 10)
      } else {
        this.productObject.cost = this.answer
        // this.productObject.price =  this.answer
      }
      this.productObject.count = this.counter
      this.productObject.price = this.productObject.cost / this.productObject.count
      
      // console.log(narx)
      // this.productObject.cost = this.productObject.price / this.productObject.count

      // this.productDetails = [this.productObject];

      this.productDetails.push(this.productObject);

      this.updateLocalStorage();
      this.$emit('close', this.counter, this.productId)
      this.modalOpenedBefore = true;
    },
    updateLocalStorage() {
      // Get the existing local storage data
      const productDetailsData = localStorage.getItem('productDetails');
      const existingData = productDetailsData ? JSON.parse(productDetailsData) : [];

      // Check if the current product already exists in the local storage data
      const existingProductIndex = existingData.findIndex(item => item.id === this.productObject.id);

      if (existingProductIndex !== -1) {
        // Update the existing product in local storage with the current data
        existingData[existingProductIndex] = { ...this.productObject };
      } else {
        // Add the current product to the local storage data
        existingData.push(this.productObject);
      }

      // Update local storage with the updated data
      localStorage.setItem('productDetails', JSON.stringify(existingData));

      // Update this.productDetails with the updated data
      this.productDetails = existingData;

      // Push the current productObject to the cart
      this.cart.push(this.productObject);
    },
  },
  computed: { ...mapState(['cart']) },
  created() {
    const productDetailsData = localStorage.getItem('productDetails');
    const itemsById = {};

    if (productDetailsData) {
      const parsedAnswer = JSON.parse(productDetailsData);

      parsedAnswer.forEach(item => {
        itemsById[item.id] = item;
      });

      const currentItem = itemsById[this.productId];

      if (currentItem) {
        this.counter = (typeof currentItem.count === 'string' ? parseInt(currentItem.count, 10) : currentItem.count);
        this.answer = currentItem.price * this.counter;
      } else {
        // Handle the case where the product doesn't exist in local storage
        this.counter = 1;
        this.answer = this.answer * this.counter;
      }

      // Keep the original products from this.details
      this.productDetails = [...this.details];

      // Check if the product is already in productDetails and update its quantity
      const existingProduct = this.productDetails.find(item => item.id === this.productId);
      if (existingProduct) {
        existingProduct.count = this.counter;
      }
    } else {
      this.counter = 1;
      this.answer = this.answer;
      this.productDetails = [...this.details];
    }
  }
}
</script>