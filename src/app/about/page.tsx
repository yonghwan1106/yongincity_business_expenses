import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Target, Eye, Heart, Shield, TrendingUp, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white mb-12 shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              투명성 모니터링 시스템 소개
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              용인특례시는 시민과 함께하는 투명한 행정을 실천하기 위해
              업무추진비 사용 내역을 실시간으로 공개합니다.
            </p>
          </div>
        </div>

        {/* 미션 & 비전 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 미션 */}
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold">미션</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              공공 데이터의 투명한 공개를 통해 시민의 알 권리를 보장하고,
              행정의 신뢰성을 높여 시민 중심의 열린 정부를 실현합니다.
            </p>
          </div>

          {/* 비전 */}
          <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-bold">비전</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              데이터 기반의 투명한 행정으로 시민과 소통하며,
              신뢰받는 지방정부의 모범 사례를 만들어갑니다.
            </p>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">핵심 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">투명성</h3>
              <p className="text-gray-600 text-sm">
                모든 업무추진비 사용 내역을 실시간으로 공개하여
                시민의 알 권리를 보장합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">시민 중심</h3>
              <p className="text-gray-600 text-sm">
                시민이 이해하기 쉬운 형태로 데이터를 제공하며,
                AI 챗봇을 통해 질문에 답합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">혁신</h3>
              <p className="text-gray-600 text-sm">
                최신 기술을 활용하여 데이터 시각화와
                인사이트를 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 주요 기능 */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-blue-600">📊 실시간 대시보드</h3>
              <p className="text-gray-600 text-sm">
                월별 추이, 비목별 분석, 사용처 통계 등 다양한 차트로
                데이터를 시각화합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-green-600">🔍 고급 필터</h3>
              <p className="text-gray-600 text-sm">
                기간, 비목, 사용처, 금액 범위 등 다양한 조건으로
                데이터를 필터링할 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-purple-600">🤖 AI 챗봇</h3>
              <p className="text-gray-600 text-sm">
                자연어로 질문하면 AI가 실시간으로 데이터를 분석하여
                답변해 드립니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-orange-600">📥 데이터 다운로드</h3>
              <p className="text-gray-600 text-sm">
                Excel, CSV 형식으로 원하는 데이터를 다운로드하여
                별도 분석이 가능합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-red-600">💡 인사이트 제공</h3>
              <p className="text-gray-600 text-sm">
                이달의 하이라이트, 트렌드 분석, 이상치 감지 등
                자동 분석 결과를 제공합니다.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-teal-600">📱 반응형 디자인</h3>
              <p className="text-gray-600 text-sm">
                PC, 태블릿, 모바일 등 모든 기기에서
                최적화된 경험을 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 용인블루 브랜딩 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center shadow-xl">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-3xl font-bold mb-4">용인블루</h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              용인특례시의 상징 색상인 블루는 투명성, 신뢰, 혁신을 의미합니다.
              우리는 용인블루 정신으로 시민과 함께하는 열린 행정을 실천합니다.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div>
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p>시민 참여</p>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <p>투명한 행정</p>
              </div>
              <div>
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <p>신뢰받는 정부</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
