<template>
  <div class="cart overflow-x-hidden">
    <div class="nav flex items-center pr-10">
      <button @click="$router.back()">
        <i class="fas fa-arrow-left m-5 text-4xl"></i>
      </button>
      <div class="flex-grow text-center">
        <h1 class="text-3xl font-bold underline text-center my-2">
          {{ lang === 'ru' ? 'Корзина' : 'Savat' }}
        </h1>
      </div>
    </div>
    <div class="wrapper pb-[150px] overflow-y-scroll">
      <div v-if="array.length" class="content">
        <div class="card flex items-start justify-center flex-wrap gap-7 py-3 border-b-2" v-for="(card, idx) in array"
          :key="card.id">
          <div class="left">
            <img :src="card.product_image" alt="product-image" class="w-[90px] h-[80px] object-cover rounded-full">
          </div>
          <div class="center">
            <div class="titles flex items-center justify-between">
              <h3 class="text-xl font-bold w-32">
                {{ (lang === 'ru' ? card.product_name_ru : card.product_name_uz) }}
              </h3>
              <h3 class="text-xl font-bold">{{ card.cost }}</h3>
            </div>
            <div class="flex items-center justify-between gap-4 mt-4 mb-3">
              <div class="btns flex items-center justify-center gap-3">
                <!-- Minus -->
                <button @click="subtractPrice(card.price, card.count, idx, card.cost, card.id)"
                  class="btn bg-light-red px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center"><span>-</span>
                </button>
                <p>{{ card.count }}</p>
                <!-- Plus -->
                <button @click="countPrice(card.price, card?.count, idx, card.cost, card.id)"
                  class="btn bg-light-green px-7 py-1 rounded-xl text-white text-xl flex items-center justify-center">
                  <span>+</span>
                </button>
              </div>
              <button class="right rounded-full bg-light-red w-10 h-10 flex items-center justify-center"
                @click="deleteOneProduct(card.id)">
                <i class="fas fa-trash text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-xl text-semibold text-center underline mt-14">
          {{ lang === 'ru' ? 'Ваша корзина пуста' : "Savatingiz bo'sh" }}
        </h1>
      </div>
    </div>
    <div class="cart p-3 pt-1 bg-zinc-500 fixed bottom-0 left-0 w-full">
      <div class="flex justify-between items-center mb-1 text-white  text-xl px-1">
        <h1 class="font-semibold">{{ lang === 'ru' ? 'Общая сумма:' : 'Umumiy narx:' }}</h1>
        <h3 class="font-bold">
          {{ countTotalPrice }}
        </h3>
      </div>

      <div class="btns flex gap-2 bg-zinc-500">
        <button
          class="py-3 w-1/2 text-white  text-base font-semibold uppercase rounded-lg flex items-start justify-center gap-3"
          @click="deleteAllProduct" :disabled="isBtnDisabled"
          :class="computedCart.length > 0 ? 'bg-light-red' : 'bg-light-red/50'">
          {{ lang === 'ru' ? 'Очистить' : 'Savatni tozalash' }}
        </button>
        <button
          class="py-3 w-1/2  text-white text-base font-semibold uppercase rounded-lg flex items-start justify-center gap-3"
          @click="orderProducts" :class="computedCart.length > 0 ? 'bg-light-green' : 'bg-light-green/50'"
          :disabled="isBtnDisabled">
          {{ lang === 'ru' ? 'Заказать' : 'Buyurtma berish' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      array: this.getCartItems || [],
      lang: this.$route.query.lang,
      model: '',
      counter: null,
      answer: {},
      tgId: 'ID',
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['getCartItems']),
    computedCart() {
      return this.array;
    },
    isBtnDisabled() {
      return this.array.length === 0;
    },
    countTotalPrice() {
      const cart = this.array
      if (cart) {
        let totalPrice = 0
        cart.forEach(item => {
          let price = 0
          if (typeof item.price === 'string') {
            price = parseInt(item.price.split(' ').join('')) * item.count
          } else {
            price = item.price * item.count
          }
          totalPrice += price
        })
        return totalPrice
      } else {
        return 0
      }
    },
  },
  methods: {
    ...mapActions(['postData', 'clearCart', 'setCartItem', 'refreshCart', 'postData']),
    countPrice(price, count, idx, cost, id) {
      if (id) {
        count++
        cost = count * parseInt(price.split(' ').join(''))
        this.array[idx].count = count
        this.array[idx].cost = cost
      }
    },
    subtractPrice(price, count, idx, cost, id) {
      if (count > 1) {
        count--;
        cost = cost - parseInt(price.split(' ').join(''))
      }
      this.array[idx].count = count;
      this.array[idx].cost = cost;
    },
    deleteOneProduct(id) {
      const idx = this.array.findIndex(item => item.id === id);

      if (idx !== -1) {
        this.array.splice(idx, 1);
        this.refreshCart(this.array)
      }
    },
    async deleteAllProduct() {
      this.array.splice(0)
      await this.clearCart();
      localStorage.removeItem('productDetails');
    },
    async orderProducts() {
      try {
        this.array.forEach(item => {
          if ('product_name_uz' in item || 'product_name_ru' in item) {
            item.productValue = this.lang === 'uz' ? item.product_name_uz : item.product_name_ru
            delete item.product_name_uz;
            delete item.product_name_ru;
          }
          item.price = parseInt(item.price.split(' ').join(''))
        });


        const telegram = await window.Telegram.WebApp;
        const telegramData = await telegram.initDataUnsafe;
        // const userId = telegramData.user?.id;
        const userId = 596968325
        this.tgId = userId

        if (userId) {
          try {
            const payload = {
              telegram_id: userId,
              data: JSON.stringify(this.array),
            };
            await this.postData(payload);
            this.clearCart();
            telegram.expand()
            telegram.close();
            localStorage.clear();
            this.$router.push({ name: 'home' });
          } catch (error) {
            console.error(error);
          }
          return
        } else {
          telegram.sendData(JSON.stringify(this.array));
          telegram.expand();
          telegram.close();
          localStorage.clear();
        }

      } catch (error) {
        console.error("Error sending data:", error);
      }

      this.clearCart();
      this.$router.push({ name: 'home' });
    },
  },
  mounted() {
    this.array.push(...this.getCartItems);
  },
}
</script>
