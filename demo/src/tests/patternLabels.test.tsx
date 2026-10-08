import { useRef } from 'react'
import { render, renderHook, screen } from '@testing-library/react'
import { LikeButton } from '@skills/like-pop/assets/LikeButton'
import { ThemeToggle } from '@skills/theme-toggle/assets/ThemeToggle'
import { SwipeDismissViewer } from '@skills/swipe-dismiss-viewer/assets/SwipeDismissViewer'
import { FileDropZone, type UploadFile } from '@skills/file-upload/assets/FileDropZone'
import { useDragReorder } from '@skills/drag-to-reorder/assets/useDragReorder'
import { OtpInput } from '@skills/otp-input/assets/OtpInput'
import { QuantityStepper } from '@skills/quantity-stepper/assets/QuantityStepper'
import { BottomNav } from '@skills/bottom-nav/assets/BottomNav'
import { Select } from '@skills/select/assets/Select'
import { LongPressMenu } from '@skills/long-press-menu/assets/LongPressMenu'
import { PullToRefresh } from '@skills/pull-to-refresh/assets/PullToRefresh'

// 패턴의 화면 낭독 문구는 기본이 한국어다. 다른 언어로 쓰는 프로젝트가 코드를 고치지 않고 바꿀 수 있어야 한다.
// 각 패턴마다 두 가지를 본다: 아무것도 넘기지 않으면 지금 문구 그대로, 넘기면 넘긴 문구.

describe('like-pop — labels', () => {
  it('기본은 한국어, labels를 넘기면 그 문구', () => {
    const { rerender } = render(<LikeButton liked={false} onChange={() => {}} />)
    expect(screen.getByRole('button')).toHaveAccessibleName('좋아요')
    rerender(<LikeButton liked onChange={() => {}} labels={{ like: 'Like', unlike: 'Unlike' }} />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Unlike')
  })
})

describe('theme-toggle — label', () => {
  it('기본은 "다크 모드", label을 넘기면 그 문구', () => {
    const { rerender } = render(<ThemeToggle />)
    expect(screen.getByRole('switch')).toHaveAccessibleName('다크 모드')
    rerender(<ThemeToggle label="Dark mode" />)
    expect(screen.getByRole('switch')).toHaveAccessibleName('Dark mode')
  })
})

describe('swipe-dismiss-viewer — closeLabel', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
  })

  it('기본은 "닫기", closeLabel을 넘기면 그 문구', () => {
    const { unmount } = render(<SwipeDismissViewer src="a.jpg" alt="잔치국수" onClose={() => {}} />)
    expect(screen.getByRole('button')).toHaveAccessibleName('닫기')
    unmount()
    render(<SwipeDismissViewer src="a.jpg" alt="Noodles" onClose={() => {}} closeLabel="Close" />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Close')
  })
})

describe('file-upload — labels', () => {
  const files: UploadFile[] = [{ id: '1', file: new File(['x'], 'menu.pdf', { type: 'application/pdf' }), progress: 40 }]

  it('기본은 "… 업로드"·"… 지우기", labels를 넘기면 그 문구', () => {
    const { unmount } = render(<FileDropZone files={files} onAdd={() => {}} onRemove={() => {}} />)
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('menu.pdf 업로드')
    expect(screen.getByRole('button', { name: 'menu.pdf 지우기' })).toBeInTheDocument()
    unmount()
    render(
      <FileDropZone
        files={files}
        onAdd={() => {}}
        onRemove={() => {}}
        labels={{ uploading: (name) => `Uploading ${name}`, remove: (name) => `Remove ${name}` }}
      />,
    )
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Uploading menu.pdf')
    expect(screen.getByRole('button', { name: 'Remove menu.pdf' })).toBeInTheDocument()
  })
})

describe('drag-to-reorder — messages', () => {
  it('손잡이 라벨: 기본은 한국어, messages.handle을 넘기면 그 문구', () => {
    const { result: ko } = renderHook(() => useDragReorder({ onReorder: () => {} }))
    expect(ko.current.getHandleProps({ label: '잔치국수' })['aria-label']).toBe('잔치국수 순서 바꾸기 — 위아래 방향키로 이동')

    const { result: en } = renderHook(() =>
      useDragReorder({
        onReorder: () => {},
        messages: { handle: (label) => `Reorder ${label}, use arrow keys`, moved: ({ to, total }) => `Moved to ${to} of ${total}` },
      }),
    )
    expect(en.current.getHandleProps({ label: 'Noodles' })['aria-label']).toBe('Reorder Noodles, use arrow keys')
  })
})

describe('otp-input — digitLabel', () => {
  it('칸 라벨: 기본은 "인증번호 N번째 자리", digitLabel을 넘기면 그 문구', () => {
    const { unmount } = render(<OtpInput length={4} onComplete={() => {}} />)
    expect(screen.getAllByRole('textbox')[1]).toHaveAccessibleName('인증번호 2번째 자리')
    unmount()
    render(<OtpInput length={4} onComplete={() => {}} label="Code" digitLabel={({ label, position }) => `${label} digit ${position}`} />)
    expect(screen.getAllByRole('textbox')[1]).toHaveAccessibleName('Code digit 2')
  })
})

describe('quantity-stepper — buttonLabels', () => {
  it('버튼 라벨: 기본은 "… 줄이기"·"… 늘리기", buttonLabels를 넘기면 그 문구', () => {
    const { unmount } = render(<QuantityStepper value={2} onChange={() => {}} label="멸치국수 수량" />)
    expect(screen.getByRole('button', { name: '멸치국수 수량 줄이기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '멸치국수 수량 늘리기' })).toBeInTheDocument()
    unmount()
    render(
      <QuantityStepper
        value={1}
        onChange={() => {}}
        onBelowMin={() => {}}
        label="Noodles"
        buttonLabels={{ decrease: (label) => `Decrease ${label}`, remove: (label) => `Remove ${label}`, increase: (label) => `Increase ${label}` }}
      />,
    )
    expect(screen.getByRole('button', { name: 'Remove Noodles' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Increase Noodles' })).toBeInTheDocument()
  })
})

describe('bottom-nav — badgeLabels', () => {
  const items = [
    { href: '/', label: 'Home', icon: null, badge: 3 },
    { href: '/my', label: 'My', icon: null, badge: 'dot' as const },
  ]

  it('배지 낭독: 기본은 한국어, badgeLabels를 넘기면 그 문구', () => {
    const { unmount } = render(<BottomNav items={items} path="/" />)
    expect(screen.getByText('새 항목 3개')).toBeInTheDocument()
    unmount()
    render(<BottomNav items={items} path="/" label="Main" badgeLabels={{ count: (n) => `${n} new`, overflow: '99+ new', dot: 'New' }} />)
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByText('3 new')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
  })
})

describe('select — 이름', () => {
  const options = [{ value: 'somyeon', label: '소면' }]

  it('label을 넘기면 콤보박스의 이름이 된다', () => {
    render(<Select options={options} value={null} onChange={() => {}} label="면 종류" />)
    expect(screen.getByRole('combobox')).toHaveAccessibleName('면 종류')
  })

  it('label이 없으면 자리표시 문구가 이름이 된다 — 이름 없는 콤보박스를 만들지 않는다', () => {
    render(<Select options={options} value={null} onChange={() => {}} placeholder="면 종류 선택" />)
    expect(screen.getByRole('combobox')).toHaveAccessibleName('면 종류 선택')
  })

  it('labelledBy를 넘기면 화면의 라벨을 가리킨다', () => {
    const Labelled = () => {
      const id = useRef('noodle-label').current
      return (
        <>
          <span id={id}>면 고르기</span>
          <Select options={options} value={null} onChange={() => {}} labelledBy={id} />
        </>
      )
    }
    render(<Labelled />)
    expect(screen.getByRole('combobox')).toHaveAccessibleName('면 고르기')
  })
})

describe('long-press-menu — 트리거 역할', () => {
  it('트리거는 button 역할이라 aria-expanded·aria-haspopup이 허용된다', () => {
    render(
      <LongPressMenu label="잔치국수 동작" items={[{ label: '담기', onSelect: () => {} }]}>
        <article>잔치국수</article>
      </LongPressMenu>,
    )
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('pull-to-refresh — 스크롤 영역', () => {
  it('스크롤 상자는 키보드로 닿고, label을 넘기면 이름 있는 영역이 된다', () => {
    render(
      <PullToRefresh onRefresh={() => {}} label="가게 소식">
        <p>소식</p>
      </PullToRefresh>,
    )
    const region = screen.getByRole('region', { name: '가게 소식' })
    expect(region).toHaveAttribute('tabindex', '0')
  })
})
