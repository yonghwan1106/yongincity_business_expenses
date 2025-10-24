'use client'

import { useState, useEffect } from 'react'
import { useFilterStore } from '@/store/filterStore'
import { X, ChevronDown, ChevronUp, Calendar, DollarSign, Tag, CreditCard, Search } from 'lucide-react'
import { ExpenseRecord } from '@/types'

interface FilterBarProps {
  data: ExpenseRecord[]
}

export function FilterBar({ data }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    selectedCategories,
    selectedPaymentMethods,
    searchText,
    setDateRange,
    setAmountRange,
    setCategories,
    setPaymentMethods,
    setSearchText,
    resetFilters,
    applyFilters
  } = useFilterStore()

  // Calculate min and max amounts from data
  const [dataAmountMin, setDataAmountMin] = useState(0)
  const [dataAmountMax, setDataAmountMax] = useState(10000000)

  useEffect(() => {
    if (data.length > 0) {
      const amounts = data.map(r => r.사용금액)
      const min = Math.min(...amounts)
      const max = Math.max(...amounts)
      setDataAmountMin(min)
      setDataAmountMax(max)

      // Initialize amount range if not set
      if (amountMax === Infinity) {
        setAmountRange(min, max)
      }
    }
  }, [data, amountMax, setAmountRange])

  // Extract unique categories and payment methods
  const uniqueCategories = Array.from(new Set(data.map(r => r.비목).filter(Boolean)))
  const uniquePaymentMethods = Array.from(new Set(data.map(r => r.결제방법).filter(Boolean)))

  // Quick date presets
  const setQuickDate = (preset: string) => {
    const now = new Date()
    let from = ''
    let to = ''

    switch (preset) {
      case 'thisMonth':
        from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
        to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`
        break
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        from = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-01`
        const lastDay = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate()
        to = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${lastDay}`
        break
      case 'last3Months':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        from = `${threeMonthsAgo.getFullYear()}-${String(threeMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`
        to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-31`
        break
      case 'all':
        setDateRange(null, null)
        return
    }

    setDateRange(from, to)
  }

  // Quick amount presets
  const setQuickAmount = (preset: string) => {
    switch (preset) {
      case 'under1M':
        setAmountRange(dataAmountMin, 1000000)
        break
      case '1M-5M':
        setAmountRange(1000000, 5000000)
        break
      case 'over5M':
        setAmountRange(5000000, dataAmountMax)
        break
      case 'all':
        setAmountRange(dataAmountMin, dataAmountMax)
        break
    }
  }

  // Toggle category
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setCategories(selectedCategories.filter(c => c !== category))
    } else {
      setCategories([...selectedCategories, category])
    }
  }

  // Toggle payment method
  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethods.includes(method)) {
      setPaymentMethods(selectedPaymentMethods.filter(m => m !== method))
    } else {
      setPaymentMethods([...selectedPaymentMethods, method])
    }
  }

  // Count active filters
  const activeFilterCount = [
    dateFrom || dateTo,
    amountMin !== dataAmountMin || amountMax !== dataAmountMax,
    selectedCategories.length > 0,
    selectedPaymentMethods.length > 0,
    searchText.trim() !== ''
  ].filter(Boolean).length

  const filteredData = applyFilters(data)

  return (
    <div className="bg-white rounded-lg shadow-md mb-8 border-2 border-blue-100">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">필터 및 검색</h3>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {activeFilterCount}개 적용
            </span>
          )}
          <span className="text-sm text-gray-600">
            {filteredData.length}건 / {data.length}건
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                resetFilters()
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
            >
              모두 초기화
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 pt-0 space-y-6 border-t">
          {/* Search Bar */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Search className="w-4 h-4" />
              전체 텍스트 검색
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="사용장소, 집행목적, 비고에서 검색..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchText && (
              <div className="mt-2 text-sm text-gray-600">
                '{searchText}' 검색 결과: {filteredData.length}건
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              날짜 범위
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={() => setQuickDate('thisMonth')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                이번 달
              </button>
              <button
                onClick={() => setQuickDate('lastMonth')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                지난 달
              </button>
              <button
                onClick={() => setQuickDate('last3Months')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                최근 3개월
              </button>
              <button
                onClick={() => setQuickDate('all')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                전체
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">시작일</label>
                <input
                  type="date"
                  value={dateFrom || ''}
                  onChange={(e) => setDateRange(e.target.value || null, dateTo)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">종료일</label>
                <input
                  type="date"
                  value={dateTo || ''}
                  onChange={(e) => setDateRange(dateFrom, e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign className="w-4 h-4" />
              금액 범위
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={() => setQuickAmount('under1M')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                100만원 이하
              </button>
              <button
                onClick={() => setQuickAmount('1M-5M')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                100~500만원
              </button>
              <button
                onClick={() => setQuickAmount('over5M')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                500만원 이상
              </button>
              <button
                onClick={() => setQuickAmount('all')}
                className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                전체
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-20">최소:</span>
                <input
                  type="range"
                  min={dataAmountMin}
                  max={dataAmountMax}
                  step={10000}
                  value={amountMin}
                  onChange={(e) => setAmountRange(Number(e.target.value), amountMax)}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-gray-900 w-32 text-right">
                  {amountMin.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-20">최대:</span>
                <input
                  type="range"
                  min={dataAmountMin}
                  max={dataAmountMax}
                  step={10000}
                  value={amountMax === Infinity ? dataAmountMax : amountMax}
                  onChange={(e) => setAmountRange(amountMin, Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-gray-900 w-32 text-right">
                  {(amountMax === Infinity ? dataAmountMax : amountMax).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              비목
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {category}
                  {selectedCategories.includes(category) && (
                    <X className="inline-block ml-1 w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CreditCard className="w-4 h-4" />
              결제방법
            </label>
            <div className="flex flex-wrap gap-2">
              {uniquePaymentMethods.map(method => (
                <button
                  key={method}
                  onClick={() => togglePaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedPaymentMethods.includes(method)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  {method}
                  {selectedPaymentMethods.includes(method) && (
                    <X className="inline-block ml-1 w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">적용된 필터</span>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  모두 제거
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(dateFrom || dateTo) && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    날짜: {dateFrom || '시작'} ~ {dateTo || '끝'}
                    <button onClick={() => setDateRange(null, null)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {(amountMin !== dataAmountMin || amountMax !== dataAmountMax) && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    금액: {amountMin.toLocaleString()} ~ {amountMax === Infinity ? dataAmountMax.toLocaleString() : amountMax.toLocaleString()}원
                    <button onClick={() => setAmountRange(dataAmountMin, dataAmountMax)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {selectedCategories.map(cat => (
                  <div key={cat} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    비목: {cat}
                    <button onClick={() => toggleCategory(cat)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedPaymentMethods.map(method => (
                  <div key={method} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    결제: {method}
                    <button onClick={() => togglePaymentMethod(method)}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {searchText && (
                  <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    검색: {searchText}
                    <button onClick={() => setSearchText('')}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
