<template>
  <div class="about overflow-x-hidden pb-14">
    <div class="nav flex items-center pr-10">
      <button @click="$router.push({ name: 'home' })">
        <i class="fas fa-arrow-left m-5 text-4xl"></i>
      </button>
      <div class="flex-grow text-center">
        <h1 class="text-3xl font-bold underline my-2">
          {{ category }}
        </h1>
      </div>
    </div>
    <Transition name="fade">
      <div
        class="wrapper w-full flex flex-wrap justify-center items-stretch gap-x-4 py-3 gap-1 min-[750px]:gap-10 relative">
        <productCard v-for="(card) in receivedData" :info="card" :key="card.id" :lang="lang" :quantitiy="card.count"
          :id="oneId" @action="openModal(), selectedProduct = card" />
      </div>
    </Transition>
  </div>
  <cartBtn :lang="lang" :key="updateCartCount" />
  <Transition name="fade">
    <div v-if="isModalOpened" class="modal w-full h-full mx-auto fixed left-0 top-0 z-20 bg-black/70">
      <Modal @close="closeModal" :selectedProduct="selectedProduct" :key="selectedProduct" :lang="lang" />
    </div>
  </Transition>
</template>

<script>
import Modal from "../components/productModal.vue"
import productCard from "../components/productCard.vue";
import cartBtn from "../components/cartBtn.vue";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  components: {
    Modal,
    productCard,
    cartBtn
  },
  data() {
    return {
      isModalOpened: false,
      id: this.$route.params.id,
      lang: this.$route.query.lang,
      category: this.$route.query.category,
      quantity: "",
      oneId: "",
      selectedProduct: {}
    }
  },
  methods: {
    ...mapActions(['fetchProducts']),
    async productsFunc() {
      await this.fetchProducts(this.id)
    },
    openModal() {
      this.isModalOpened = true
    },
    closeModal(counter) {
      this.isModalOpened = false
      this.quantity = counter
    },
    getId(info) {
      this.oneId = info.id
      this.getProductName = (this.lang === 'ru' ? info.product_name_ru : info.product_name_uz)
      this.getProductImage = info.product_image
    },
  },
  computed: {
    ...mapState(['products', 'updateCartCount']),
    ...mapGetters(['getCartItems']),
    receivedData() {
      const cart = this.getCartItems
      if(cart?.length && this.products?.length) {
        let products = [...this.products]
        cart.forEach(item => {
          const idx = this.products.findIndex(prod => item.id === prod.id)
          if(idx !== -1) {
            products[idx].count = item.count
          }
        })
        return products
      } else {
        return this.products;
      }
    },
  },
  mounted() {
    this.productsFunc()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
