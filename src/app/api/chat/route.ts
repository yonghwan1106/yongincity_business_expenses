import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { fetchExpenseData } from '@/lib/googleSheets'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    // 현재 데이터 가져오기
    const expenses = await fetchExpenseData()

    // 데이터 요약 생성
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.사용금액, 0)
    const totalCount = expenses.length

    // 월별 집계
    const monthlyStats = expenses.reduce((acc, exp) => {
      const month = exp.사용일시.substring(0, 7)
      if (!acc[month]) {
        acc[month] = { 금액: 0, 건수: 0 }
      }
      acc[month].금액 += exp.사용금액
      acc[month].건수++
      return acc
    }, {} as Record<string, { 금액: number; 건수: number }>)

    // 비목별 집계
    const categoryStats = expenses.reduce((acc, exp) => {
      const category = exp.비목
      if (!acc[category]) {
        acc[category] = { 금액: 0, 건수: 0 }
      }
      acc[category].금액 += exp.사용금액
      acc[category].건수++
      return acc
    }, {} as Record<string, { 금액: number; 건수: number }>)

    // 사용처별 집계 (상위 20개)
    const locationStats = expenses.reduce((acc, exp) => {
      const location = exp.사용장소
      if (!acc[location]) {
        acc[location] = { 금액: 0, 건수: 0 }
      }
      acc[location].금액 += exp.사용금액
      acc[location].건수++
      return acc
    }, {} as Record<string, { 금액: number; 건수: number }>)

    const topLocations = Object.entries(locationStats)
      .sort(([, a], [, b]) => b.금액 - a.금액)
      .slice(0, 20)
      .map(([location, stats]) => ({ location, ...stats }))

    // 시스템 프롬프트
    const systemPrompt = `당신은 용인시장 업무추진비 투명성 모니터링 시스템의 AI 어시스턴트입니다.
시민들이 업무추진비 데이터에 대해 질문하면 친절하고 정확하게 답변해주세요.

현재 데이터 (2024년 9월 ~ 2025년 9월):
- 총 집행액: ${totalAmount.toLocaleString()}원
- 총 건수: ${totalCount}건
- 기간: ${Object.keys(monthlyStats).sort()[0]} ~ ${Object.keys(monthlyStats).sort().reverse()[0]}

월별 통계:
${Object.entries(monthlyStats)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([month, stats]) => `- ${month}: ${stats.금액.toLocaleString()}원 (${stats.건수}건)`)
  .join('\n')}

비목별 통계:
${Object.entries(categoryStats)
  .map(([category, stats]) => `- ${category}: ${stats.금액.toLocaleString()}원 (${stats.건수}건, ${((stats.금액 / totalAmount) * 100).toFixed(1)}%)`)
  .join('\n')}

상위 사용처 (TOP 20):
${topLocations
  .map((loc, idx) => `${idx + 1}. ${loc.location}: ${loc.금액.toLocaleString()}원 (${loc.건수}건)`)
  .join('\n')}

답변 시 주의사항:
1. 구체적인 숫자와 비율을 포함하여 명확하게 설명하세요
2. 시민들이 이해하기 쉬운 언어를 사용하세요
3. 필요한 경우 비교 분석을 제공하세요
4. 데이터에 없는 내용은 추측하지 말고 "데이터에 없습니다"라고 명확히 말하세요
5. 한국어로 답변하세요
6. 답변은 간결하면서도 충분한 정보를 담아주세요`

    // 대화 히스토리 구성
    const messages = [
      ...(conversationHistory || []),
      {
        role: 'user',
        content: message
      }
    ]

    // Claude API 호출
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '죄송합니다. 답변을 생성할 수 없습니다.'

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: [
        ...messages,
        {
          role: 'assistant',
          content: assistantMessage
        }
      ]
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: '챗봇 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}
