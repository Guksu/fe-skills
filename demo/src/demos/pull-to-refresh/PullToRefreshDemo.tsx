import { useState } from 'react'
import { PullToRefresh } from '@skills/pull-to-refresh/assets/PullToRefresh'
import { defineCopy, useDemoLang } from '../../demoLang'
import './pull-to-refresh-demo.css'

const COPY = defineCopy({
  ko: {
    headlines: [
      '성수동 손칼국수, 곱빼기 무료 이벤트 연장',
      '왕만두 반죽 레시피가 바뀐 이유',
      '냉모밀 육수, 슬러시 직전이 정답인 이유',
      '지옥 비빔국수 완식 도전자 명단',
      '이번 주 면 뽑기 클래스 모집',
    ],
    fresh: (title: string) => `[새 글] ${title}`,
    issue: (n: number) => `국수신문 · ${n}호`,
    time: (date: Date) => date.toLocaleTimeString('ko-KR'),
    lastRefreshed: (time: string) => ` 마지막 새로고침: ${time}`,
    controlsLabel: '안내',
    note: '목록 최상단에서 아래로 끌어내려 보세요 — 당길수록 무거워지고(고무줄), 임계를 넘겨 놓으면 스피너가 돌며 1.2초 뒤 새 글이 추가됩니다.',
    feedLabel: '국수신문 글 목록',
  },
  en: {
    headlines: [
      'Seongsu-dong knife-cut noodle shop extends its free large-size offer',
      'Why the jumbo dumpling dough recipe changed',
      'Why cold soba broth is best just before it turns to slush',
      'Everyone who finished the inferno spicy mixed noodles',
      "Sign-ups open for this week's noodle-making class",
    ],
    fresh: (title: string) => `[New] ${title}`,
    issue: (n: number) => `Noodle News · No. ${n}`,
    time: (date: Date) => date.toLocaleTimeString('en-US'),
    lastRefreshed: (time: string) => ` Last refreshed: ${time}`,
    controlsLabel: 'How to use',
    note: 'At the top of the list, pull down. It gets heavier the farther you pull (rubber band). Let go past the threshold and the spinner turns, then a new post appears 1.2 seconds later.',
    feedLabel: 'Noodle News posts',
  },
})

// 글은 제목 번호만 들고 있고 문구는 그릴 때 COPY에서 고른다 — 언어를 바꾸면 이미 받은 글도 따라 바뀐다
type Post = { id: number; headline: number; fresh: boolean }

export const PullToRefreshDemo = () => {
  const t = COPY[useDemoLang()]
  const [feed, setFeed] = useState<Post[]>(() => t.headlines.map((_, i) => ({ id: i, headline: i, fresh: false })))
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null)

  const reload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200)) // 네트워크 흉내
    setFeed((prev) => {
      // id는 항상 기존 최대값보다 크게 — 잘린 목록의 첫 id 기준으로 만들면 중복 key가 생긴다
      const nextId = Math.max(...prev.map((item) => item.id)) + 1
      return [{ id: nextId, headline: nextId % t.headlines.length, fresh: true }, ...prev].slice(0, 8)
    })
    setRefreshedAt(new Date())
  }

  return (
    <div className="playground">
      <section className="controls" aria-label={t.controlsLabel}>
        <p className="controls-note">
          {t.note}
          {refreshedAt && t.lastRefreshed(t.time(refreshedAt))}
        </p>
      </section>

      <PullToRefresh onRefresh={reload} className="feed-frame" label={t.feedLabel}>
        <ul className="feed-list">
          {feed.map((item) => (
            <li key={item.id} className="feed-item">
              <strong>{item.fresh ? t.fresh(t.headlines[item.headline]) : t.headlines[item.headline]}</strong>
              <span>{t.issue(item.id)}</span>
            </li>
          ))}
        </ul>
      </PullToRefresh>
    </div>
  )
}
