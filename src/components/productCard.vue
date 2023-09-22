<template>
  <section>
    <div class="card text-center py-4 w-full min-h-full max-w-[110px] flex items-center justify-between flex-col">
      <div class="relative">
        <img class="w-[100px] h-[100px] object-cover mb-4 mx-auto rounded-full" :src="products.product_image"
          alt="product-image">
        <p class="bg-light-green text-white flex items-center justify-center w-6 h-6 rounded-full absolute right-0 top-0"
          v-if="quantitiy > 0">
          {{ quantitiy }}
        </p>
      </div>
      <h1 class="text-lg font-semibold mt-3 min-[400px]:w-full">
        {{ (lang === 'ru' ? products.product_name_ru : products.product_name_uz) }}
      </h1>
      <p class="font-semibold mb-3">
        {{ (lang === 'ru' ? products.price + ` сум` : products.price + ` so'm`) }}
      </p>
      <button @click="$emit('action')" class="bg-light-green px-3 py-1 rounded-full text-white text-lg font-bold">
        {{ (lang === 'ru' ? 'Купить' : `Qo'shish`) }}
      </button>
    </div>
    <!-- <div v-else>
      <h1>Bunday mahsulot yo'q</h1>
    </div> -->
  </section>
</template>

<script>

export default {
  data() {
    return {
      products: this.info,
    }
  },
  methods: {},
  props: {
    info: {
      type: [String, Object],
      required: true
    },
    lang: {
      type: String
    },
    quantitiy: {
      type: [String, Number]
    },
    id: {
      type: [String, Number]
    }
  },
}
</script>

<style scoped>
.card img {
  animation: rotation 10s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}
</style>
