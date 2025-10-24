'use client'

import { useState } from 'react'
import { ExpenseRecord } from '@/types'

interface ExpenseTableProps {
  data: ExpenseRecord[]
}

export function ExpenseTable({ data }: ExpenseTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof ExpenseRecord>('번호')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const itemsPerPage = 20

  // 정렬
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal)
    const bStr = String(bVal)
    return sortOrder === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr)
  })

  // 페이지네이션
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: keyof ExpenseRecord) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ column }: { column: keyof ExpenseRecord }) => {
    if (sortKey !== column) return <span className="text-gray-400">⇅</span>
    return sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('번호')}
              >
                번호 <SortIcon column="번호" />
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('사용일시')}
              >
                사용일시 <SortIcon column="사용일시" />
              </th>
              <th className="px-3 py-3 text-left">사용장소</th>
              <th className="px-3 py-3 text-left">집행목적</th>
              <th
                className="px-3 py-3 text-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('대상인원')}
              >
                인원 <SortIcon column="대상인원" />
              </th>
              <th
                className="px-3 py-3 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('사용금액')}
              >
                금액 <SortIcon column="사용금액" />
              </th>
              <th className="px-3 py-3 text-center">결제</th>
              <th className="px-3 py-3 text-center">비목</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((record) => (
              <tr key={record.번호} className="hover:bg-gray-50">
                <td className="px-3 py-3">{record.번호}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {record.사용일시.substring(0, 16).replace(' ', '\n')}
                </td>
                <td className="px-3 py-3 max-w-[150px] truncate" title={record.사용장소}>
                  {record.사용장소}
                </td>
                <td className="px-3 py-3 max-w-[250px] truncate" title={record.집행목적}>
                  {record.집행목적}
                </td>
                <td className="px-3 py-3 text-center">{record.대상인원}</td>
                <td className="px-3 py-3 text-right font-semibold">
                  {record.사용금액.toLocaleString()}원
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.결제방법}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    record.비목 === '기관' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {record.비목}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-gray-700">
          전체 {sortedData.length}건 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)}건 표시
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="맨 앞으로"
          >
            ⇤
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="맨 뒤로"
          >
            ⇥
          </button>
        </div>
      </div>
    </div>
  )
}
