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
        <img class="w-full h-full object-cover rounded-full" :src="selectedProduct.product_image" alt="#">
      </div>
      <div class="right text-center font-semibold">
        <h1 class="text-black text-lg">
          {{ (lang === 'ru' ? selectedProduct.product_name_ru : selectedProduct.product_name_uz) }}
        </h1>
        <div class="bg-white rounded-2xl mt-3">
          <h1 class="text-lg">
            {{ selectedProduct.price }}
            <span v-if="count > 1" class="text-xs">
              x{{ count }}
            </span>
          </h1>
          <h1 class="my-3 text-2xl font-bold">
            {{ totalPrice }} {{ lang === 'ru' ? 'сум' : `so'm` }}
          </h1>
          <div class="btns flex items-center justify-center gap-3">
            <!-- Minus -->
            <button @click="count--"
              class="btn bg-light-red px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center"><span>-</span></button>
            <!-- Plus -->
            <button @click="count++"
              class="btn bg-light-green px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center">
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- actions -->
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
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      product: this.selectedProduct || {},
      count: 1
    }
  },
  props: {
    selectedProduct: {
      type: Object,
      default: {}
    },
    lang: {
      type: String
    },
  },
  methods: {
    ...mapActions(['setCartItem']),
    ...mapMutations(['updateCartCount']),
    addProduct() {
      this.product.count = this.count
      this.product.cost = this.count * parseInt(this.product.price.split(' ').join(''))
      this.setCartItem(this.product)
      this.updateCartCount()
      this.$emit('close')
    },
    getProductFromCart() {
      const cartItems = this.getCartItems
      if(!cartItems?.length) return
      cartItems.forEach(item => {
        if(item.id === this.selectedProduct.id) {
          this.count = item.count
        }
      })
    }
  },
  computed: { 
    ...mapState(['cart']),
    ...mapGetters(['getCartItems']),
    totalPrice() {
      if(this.count < 1) {
        this.count = 1
      }
      return parseInt(this.product.price.split(' ').join('')) * this.count
    }
  },
  mounted() {
    this.getCartItems
    this.getProductFromCart()
  },
}
</script>