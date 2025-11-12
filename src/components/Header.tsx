'use client'

import { Building2, Info, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* 로고 및 제목 */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-white p-2 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">용인시장 업무추진비</h1>
              <p className="text-sm text-blue-100">투명성 모니터링 시스템</p>
            </div>
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-4">
            <Link
              href="/comparison"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">타 특례시와의 비교</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              <span className="font-medium">소개</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* 용인블루 강조 배너 */}
      <div className="bg-blue-700 border-t border-blue-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">🏛️ 용인블루</span>
              <span className="text-blue-200">|</span>
              <span className="text-blue-100">시민이 만드는 투명한 행정 모니터링</span>
              <span className="text-blue-200">|</span>
              <span className="text-yellow-200 font-semibold">⚠️ 테스트 단계 (일부 내역은 실제와 차이가 있을 수 있습니다)</span>
            </div>
            <div className="text-blue-100">
              데이터 출처: 용인특례시청 | 제작: 용인블루
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
