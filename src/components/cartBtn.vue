<template>
  <div class="cart p-3 bg-zinc-500 fixed bottom-0 left-0 w-full flex items-center justify-center gap-3">
    <button disabled
      class="py-3 w-full mx-auto text-white bg-light-yellow text-lg font-semibold rounded-xl flex items-start justify-center">
      <span>{{ lang === 'ru' ? `${getTotalPrice} сум` : `${getTotalPrice} so'm` }}</span>
    </button>
    <button @click="onButtonClick" :disabled="isModalOpened"
      class="py-3 w-full mx-auto text-white text-lg font-semibold uppercase rounded-xl flex items-start justify-center"
      :class="computedArray.length > 0 ? 'bg-light-green' : 'bg-light-green'">
      <span>{{ lang === 'ru' ? 'Корзина' : 'Savat' }}</span>
      <p class="w-5 h-5 p-2 rounded-full flex items-center justify-center bg-red-500 text-white text-center text-bold text-md -translate-y-1"
        v-if="computedArray.length > 0">
        {{ computedArray.length }}
      </p>
    </button>
  </div>

  <div class="modal bg-black/30 w-full h-full fixed top-0 left-0"
    :class="isModalOpened ? 'translate-y-0' : '-translate-y-full transition-all'">
    <div class="content bg-white rounded-full flex items-center justify-between px-5 py-3 m-3"
      :class="isModalOpened ? 'active' : 'inactive'">
      <h1 class="text-xl font-semibold">
        {{ lang === 'ru' ? 'Корзина пуста!' : `Savatingiz bo'sh!` }}
      </h1>
      <button @click="isModalOpened = false">
        <i class="fas fa-times text-black/80 text-4xl"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      price: 0,
      isModalOpened: false,
      array: [],
    }
  },
  props: {
    lang: String,
    disabled: [String, Boolean]
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['getTotalPrice', 'getCartItems']),
    computedArray() {
      return this.array = this.getCartItems
    },
    fullPrice() {
      return this.cart.reduce((totalPrice, product) => {
        return totalPrice + product.cost;
      }, 0);
    },
    isBtnDisabled() {
      return this.cart.length === 0;
    },
  },
  methods: {
    onButtonClick() {
      if (this.computedArray.length > 0) {
        this.$router.push({ name: 'cart', query: { lang: this.lang } });
      } else {
        this.isModalOpened = true;
      }
    },
    closeModal() {
      setTimeout(() => {
        this.isModalOpened = !this.isModalOpened;
      }, 300);
    },
    filterProducts() {
      const filteredCart = Object.values(this.cart.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {}));

      this.array = filteredCart;
    },
    mounted() {
      this.filterProducts()
    },
  },
}
</script>

<style scoped>
.content {
  transition: 0.3s ease;
}

.content.active {
  transition: 0.3s;
  transform: translateY(0) scale(1);
}

.content.inactive {
  transition: 0.3s !important;
  transform: translateY(-100%) scale(0);
}
</style>
