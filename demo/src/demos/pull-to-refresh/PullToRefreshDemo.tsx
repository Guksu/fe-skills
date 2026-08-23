import { useState } from 'react'
import { PullToRefresh } from '@skills/pull-to-refresh/assets/PullToRefresh'
import './pull-to-refresh-demo.css'

const HEADLINES = [
  '성수동 손칼국수, 곱빼기 무료 이벤트 연장',
  '왕만두 반죽 레시피가 바뀐 이유',
  '냉모밀 육수, 슬러시 직전이 정답인 이유',
  '지옥 비빔국수 완식 도전자 명단',
  '이번 주 면 뽑기 클래스 모집',
]

export const PullToRefreshDemo = () => {
  const [feed, setFeed] = useState(() => HEADLINES.map((title, i) => ({ id: i, title })))
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)

  const reload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200)) // 네트워크 흉내
    setFeed((prev) => {
      // id는 항상 기존 최대값보다 크게 — 잘린 목록의 첫 id 기준으로 만들면 중복 key가 생긴다
      const nextId = Math.max(...prev.map((item) => item.id)) + 1
      const title = HEADLINES[nextId % HEADLINES.length]
      return [{ id: nextId, title: `[새 글] ${title}` }, ...prev].slice(0, 8)
    })
    setRefreshedAt(new Date().toLocaleTimeString('ko-KR'))
  }

  return (
    <div className="playground">
      <section className="controls" aria-label="안내">
        <p className="controls-note">
          목록 최상단에서 아래로 끌어내려 보세요 — 당길수록 무거워지고(고무줄), 임계를 넘겨 놓으면
          스피너가 돌며 1.2초 뒤 새 글이 추가됩니다.
          {refreshedAt && ` 마지막 새로고침: ${refreshedAt}`}
        </p>
      </section>

      <PullToRefresh onRefresh={reload} className="feed-frame">
        <ul className="feed-list">
          {feed.map((item) => (
            <li key={item.id} className="feed-item">
              <strong>{item.title}</strong>
              <span>국수신문 · {item.id}호</span>
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </div>
  )
}
