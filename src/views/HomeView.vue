<template>
  <section class="home flex items-center justify-center py-5 pb-20">
    <!-- <div v-if="checkTime" class="flex items-center justify-center flex-wrap gap-4">
      <div class="no-time">
        <h1 class="text-2xl font-bold mb-5 w-[240px]">
          {{ userLang === 'ru'
            ? `В данный момент бот не работает! Мы принимаем заказы с 08:00 до 23:59.🕥`
            : `Bot hozirda ish faoliyatida emas! Soat 08:00 dan 23:59 gacha buyurtmalarni qabul qilamiz.🕥` }}
        </h1>
      </div>
    </div> -->
    <div>
      <div class="category">
        <div class="lang flex items-center justify-end gap-5 px-5">
          <button @click="changeLang" v-if="userLang === 'ru'" class="btn flex items-center justify-center gap-1">
            <img class="w-5 h-5 object-cover rounded-full border" src="../assets/images/uzb.svg" alt="uzb" value="uzb">
            UZ
          </button>
          <button @click="changeLang" v-else class="btn flex items-center justify-center gap-1">
            <img class="w-5 h-5 object-cover rounded-full border" src="../assets/images/rus.svg" alt="rus" value="rus">
            <span>
              RU
            </span>
          </button>
        </div>
        <pre class="text-center">{{ isUserRegistered }} </pre>
        <pre class="text-center">{{ telegramUserID }} </pre>
        <div>
          <!-- <video autoplay muted src="../assets/images/black.mp4"></video> -->
          <!-- <video autoplay muted src="../assets/images/blue.mp4"></video> -->
        </div>
        <!-- <div class="flex flex-wrap justify-center items-stretch gap-x-5">
          <categoryCard v-for="card in data" :info="card" :key="card.id" :lang="this.userLang" @action="$router.push({
            name: `products`, params: { id: card.id }, query: {
              lang: this.userLang,
              category: this.userLang === 'ru' ? `${card.name_ru}` : `${card.name_uz}`
            }
          })" />
          <cartBtn :lang="this.userLang" />
        </div> -->
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from "vuex";
import cartBtn from "../components/cartBtn.vue";
import categoryCard from '../components/categoryCard.vue'

export default {
  components: {
    cartBtn,
    categoryCard
  },
  data() {
    return {
      isUserRegistered: false,
      userLang: 'uz',
      registerInfo: '',
      products: '',
      telegramUserID: '',
    }
  },
  methods: {
    ...mapActions(['fetchData']),
    changeLang() {
      const currentLang = localStorage.getItem('tg-lang')
      if (currentLang === 'uz') {
        this.userLang = 'ru'
        localStorage.setItem('tg-lang', this.userLang)
      } else {
        this.userLang = 'uz'
        localStorage.setItem('tg-lang', this.userLang)
      }
    },
    setLang() {
      const localeLang = localStorage.getItem('tg-lang')
      if (localeLang) {
        this.userLang = localeLang
      } else {
        localStorage.setItem('tg-lang', this.userLang)
      }
    },
    async getInfoFromTg() {
      const telegram = await window.Telegram.WebApp
      const telegramData = await telegram.initData
      telegram.expand()

      if (telegram) {
        if (window.navigator.userAgent.indexOf("Windows") != -1) {
          console.log("The user is running Windows");
          this.isUserRegistered = `Windows`
        } else if (window.navigator.userAgent.indexOf("Mac OS") != -1) {
          console.log("The user is running Mac OS");
          this.isUserRegistered = `Mac`
        } else if (window.navigator.userAgent.indexOf("Linux") != -1) {
          console.log("The user is running Linux");
          this.isUserRegistered = `Linux`
        } else {
          console.log("The user's operating system could not be determined");
          this.isUserRegistered = `No info`
        }

        // if (Object.keys(telegramData).length === 0 || typeof telegramData.user === 'undefined') {
        //   this.isUserRegistered = `No info`
        // } else {
      } else {
        this.isUserRegistered = telegramData
        // this.getUserLang(telegramData.user.id)
      }
    },
  },
  computed: {
    ...mapState(['data', 'cart', 'userId']),
    receivedData() {
      return this.data
    },
    computedCart() {
      return this.cart
    },
    checkTime() {
      const currentHour = new Date().getHours()
      const currentMinute = new Date().getMinutes()
      return (currentHour === 0 && currentMinute >= 58) || (currentHour >= 1 && currentHour < 8)
    },
  },
  mounted() {
    this.fetchData()
    this.setLang()
    this.getInfoFromTg()
    this.telegramUserID = this.$route.query.userId
  },
}
</script>