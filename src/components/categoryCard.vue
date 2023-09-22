<template>
  <div
    class="card text-center py-4 w-full min-h-full max-w-[110px] flex items-center justify-between flex-col">
    <img class="w-[100px] h-[100px] object-cover mb-4 mx-auto rounded-full" :src="products.image"
      alt="product-image">
    <h1 class="text-lg font-semibold my-3 min-[400px]:w-full">
      {{(lang === 'ru' ? products.name_ru : products.name_uz)}}
    </h1>
    <button @click="$emit('action')" class="bg-light-green px-3 py-1 rounded-full text-white text-lg font-bold">
      {{(lang === 'ru' ? 'Купить' : `Tanlash`)}}
    </button>
  </div>
</template>

<script>

export default {
  components: {
  },
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
