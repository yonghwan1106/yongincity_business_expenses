'use client'

import { Building2, Mail, Phone, MapPin, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* 주요 정보 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 용인시 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">용인특례시</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              시민과 함께하는 투명한 행정을 실천합니다.
              용인시장 업무추진비 사용 내역을 실시간으로 공개하여
              시민의 알 권리를 보장합니다.
            </p>
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <span className="text-2xl">🏛️</span>
              <span>용인블루</span>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">연락처</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-200">용인시청</p>
                  <p className="text-gray-400">경기도 용인시 처인구 삼남로 77</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <div className="text-sm">
                  <p className="text-gray-400">대표전화: 031-324-2114</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div className="text-sm">
                  <a
                    href="https://www.yongin.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    www.yongin.go.kr
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">관련 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.yongin.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  → 용인시청 홈페이지
                </a>
              </li>
              <li>
                <a
                  href="https://www.open.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  → 정부 공공데이터 포털
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  → 시스템 소개
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 저작권 */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 용인특례시. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>투명한 행정, 신뢰받는 용인</span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Github className="w-4 h-4" />
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
