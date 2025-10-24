'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { ExpenseRecord } from '@/types'

interface DownloadButtonProps {
  data: ExpenseRecord[]
  filename?: string
}

export function DownloadButton({ data, filename = '용인시장_업무추진비' }: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadCSV = () => {
    setIsDownloading(true)

    try {
      // CSV 헤더
      const headers = ['번호', '사용자', '사용일시', '사용장소', '집행목적', '대상인원', '사용금액', '결제방법', '비목', '비고']

      // CSV 데이터 생성
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.번호,
          `"${row.사용자}"`,
          `"${row.사용일시}"`,
          `"${row.사용장소}"`,
          `"${row.집행목적}"`,
          row.대상인원,
          row.사용금액,
          `"${row.결제방법}"`,
          `"${row.비목}"`,
          `"${row.비고}"`
        ].join(','))
      ].join('\n')

      // BOM 추가 (한글 깨짐 방지)
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)

      setIsOpen(false)
    } catch (error) {
      console.error('CSV 다운로드 오류:', error)
      alert('CSV 다운로드 중 오류가 발생했습니다.')
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadExcel = () => {
    setIsDownloading(true)

    try {
      // 워크북 생성
      const wb = XLSX.utils.book_new()

      // 데이터 준비
      const wsData = [
        ['번호', '사용자', '사용일시', '사용장소', '집행목적', '대상인원', '사용금액', '결제방법', '비목', '비고'],
        ...data.map(row => [
          row.번호,
          row.사용자,
          row.사용일시,
          row.사용장소,
          row.집행목적,
          row.대상인원,
          row.사용금액,
          row.결제방법,
          row.비목,
          row.비고
        ])
      ]

      // 워크시트 생성
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // 컬럼 너비 설정
      ws['!cols'] = [
        { wch: 6 },  // 번호
        { wch: 10 }, // 사용자
        { wch: 16 }, // 사용일시
        { wch: 25 }, // 사용장소
        { wch: 30 }, // 집행목적
        { wch: 10 }, // 대상인원
        { wch: 12 }, // 사용금액
        { wch: 10 }, // 결제방법
        { wch: 8 },  // 비목
        { wch: 20 }  // 비고
      ]

      // 워크시트를 워크북에 추가
      XLSX.utils.book_append_sheet(wb, ws, '업무추진비')

      // 통계 시트 추가
      const stats = generateStatistics(data)
      const statsWs = XLSX.utils.aoa_to_sheet(stats)
      XLSX.utils.book_append_sheet(wb, statsWs, '통계')

      // 파일 다운로드
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)

      setIsOpen(false)
    } catch (error) {
      console.error('Excel 다운로드 오류:', error)
      alert('Excel 다운로드 중 오류가 발생했습니다.')
    } finally {
      setIsDownloading(false)
    }
  }

  const generateStatistics = (data: ExpenseRecord[]) => {
    const totalAmount = data.reduce((sum, exp) => sum + exp.사용금액, 0)
    const totalCount = data.length

    // 월별 집계
    const monthlyStats = data.reduce((acc, exp) => {
      const month = exp.사용일시.substring(0, 7)
      if (!acc[month]) {
        acc[month] = { 금액: 0, 건수: 0 }
      }
      acc[month].금액 += exp.사용금액
      acc[month].건수++
      return acc
    }, {} as Record<string, { 금액: number; 건수: number }>)

    // 비목별 집계
    const categoryStats = data.reduce((acc, exp) => {
      const category = exp.비목
      if (!acc[category]) {
        acc[category] = { 금액: 0, 건수: 0 }
      }
      acc[category].금액 += exp.사용금액
      acc[category].건수++
      return acc
    }, {} as Record<string, { 금액: number; 건수: number }>)

    return [
      ['용인시장 업무추진비 통계'],
      [''],
      ['전체 요약'],
      ['총 집행액', totalAmount],
      ['총 건수', totalCount],
      ['건당 평균', totalCount > 0 ? Math.round(totalAmount / totalCount) : 0],
      [''],
      ['월별 통계'],
      ['월', '금액', '건수'],
      ...Object.entries(monthlyStats)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, stats]) => [month, stats.금액, stats.건수]),
      [''],
      ['비목별 통계'],
      ['비목', '금액', '건수', '비율'],
      ...Object.entries(categoryStats)
        .map(([category, stats]) => [
          category,
          stats.금액,
          stats.건수,
          `${((stats.금액 / totalAmount) * 100).toFixed(1)}%`
        ])
    ]
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span className="font-medium">데이터 다운로드</span>
      </button>

      {isOpen && !isDownloading && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <p className="text-sm font-semibold text-gray-700">다운로드 형식 선택</p>
              <p className="text-xs text-gray-500 mt-1">
                {data.length}건의 데이터
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={downloadExcel}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-lg transition-colors group"
              >
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileSpreadsheet className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">Excel 파일</p>
                  <p className="text-xs text-gray-500">통계 시트 포함 (.xlsx)</p>
                </div>
              </button>

              <button
                onClick={downloadCSV}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors group mt-1"
              >
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">CSV 파일</p>
                  <p className="text-xs text-gray-500">간단한 형식 (.csv)</p>
                </div>
              </button>
            </div>

            <div className="p-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-600 text-center">
                💡 Excel은 통계 시트가 포함됩니다
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
