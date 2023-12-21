import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderBy', () => {
  const orderBy = reactive({
    orderByDateDsc: null,
    orderByRatingDsc: null,
  });

  return { orderBy }
})
