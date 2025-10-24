import { create } from 'zustand'
import { ExpenseRecord } from '@/types'

export interface FilterState {
  // Date filters
  dateFrom: string | null
  dateTo: string | null

  // Amount filters
  amountMin: number
  amountMax: number

  // Category filters
  selectedCategories: string[]

  // Payment method filters
  selectedPaymentMethods: string[]

  // Search
  searchText: string

  // Actions
  setDateRange: (from: string | null, to: string | null) => void
  setAmountRange: (min: number, max: number) => void
  setCategories: (categories: string[]) => void
  setPaymentMethods: (methods: string[]) => void
  setSearchText: (text: string) => void
  resetFilters: () => void

  // Computed
  applyFilters: (data: ExpenseRecord[]) => ExpenseRecord[]
}

const initialState = {
  dateFrom: null,
  dateTo: null,
  amountMin: 0,
  amountMax: Infinity,
  selectedCategories: [],
  selectedPaymentMethods: [],
  searchText: '',
}

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,

  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),

  setAmountRange: (min, max) => set({ amountMin: min, amountMax: max }),

  setCategories: (categories) => set({ selectedCategories: categories }),

  setPaymentMethods: (methods) => set({ selectedPaymentMethods: methods }),

  setSearchText: (text) => set({ searchText: text }),

  resetFilters: () => set(initialState),

  applyFilters: (data: ExpenseRecord[]) => {
    const state = get()

    return data.filter(record => {
      // Date filter
      if (state.dateFrom && record.사용일시 < state.dateFrom) return false
      if (state.dateTo && record.사용일시 > state.dateTo) return false

      // Amount filter
      if (record.사용금액 < state.amountMin) return false
      if (record.사용금액 > state.amountMax) return false

      // Category filter
      if (state.selectedCategories.length > 0 && !state.selectedCategories.includes(record.비목)) {
        return false
      }

      // Payment method filter
      if (state.selectedPaymentMethods.length > 0 && !state.selectedPaymentMethods.includes(record.결제방법)) {
        return false
      }

      // Search filter
      if (state.searchText) {
        const searchLower = state.searchText.toLowerCase()
        const matchesSearch =
          record.사용장소.toLowerCase().includes(searchLower) ||
          record.집행목적.toLowerCase().includes(searchLower) ||
          record.비고.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      return true
    })
  }
}))
