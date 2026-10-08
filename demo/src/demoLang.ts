import { createContext, useContext } from 'react'
import type { Lang } from './i18n'

/** 데모 안 문구의 언어. 셸(App)이 언어 토글 값을 내려 준다.
 * 기본값이 'ko'라서 테스트처럼 셸 없이 데모만 렌더해도 지금처럼 한국어로 나온다 */
export const DemoLangContext = createContext<Lang>('ko')

export const useDemoLang = () => useContext(DemoLangContext)

/** 데모 문구 두 벌. en의 모양을 ko에서만 읽으므로(NoInfer) 영어판에 키가 빠지거나 남으면 타입 검사가 막는다 */
export const defineCopy = <T>({ ko, en }: { ko: T; en: NoInfer<T> }) => ({ ko, en })
