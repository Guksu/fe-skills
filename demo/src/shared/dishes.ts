/// <reference types="vite/client" />
import type { Lang } from '../i18n'
/* 데모 공용 음식 사진의 단일 출처 — 파일은 demo/public/photos/{id}.webp.
 * 위키미디어 공용(Wikimedia Commons)의 CC0·CC BY 사진을 4:3으로 잘라 줄이고 WebP로 바꿨다(각 40KB 이하).
 * 출처 페이지(#/credits)가 이 목록을 그대로 보여 준다 — 사진을 바꾸거나 더하면 credit도 함께 고친다.
 * width·height는 저장한 파일의 크기다(img의 자리 잡기용). */

type Credit = {
  /** 공용 파일 이름(File: 뒤) */
  file: string
  author: string
  license: 'CC0' | 'CC BY 2.0' | 'CC BY 2.0 KR' | 'CC BY 4.0'
  licenseUrl: string
  source: string
}

/** name은 한국어, nameEn은 데모 사이트의 영어 화면용 — 뜻을 옮긴 이름이다 */
type Dish = { name: string; nameEn: string; width: number; height: number; credit: Credit }

const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/'
const BY2 = 'https://creativecommons.org/licenses/by/2.0/'
const BY2_KR = 'https://creativecommons.org/licenses/by/2.0/kr/'
const BY4 = 'https://creativecommons.org/licenses/by/4.0/'
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ', '_'))}`

const dish = ({
  name,
  nameEn,
  size,
  file,
  author,
  license,
  licenseUrl,
}: {
  name: string
  nameEn: string
  size: [number, number]
  file: string
  author: string
  license: Credit['license']
  licenseUrl: string
}): Dish => ({
  name,
  nameEn,
  width: size[0],
  height: size[1],
  credit: { file, author, license, licenseUrl, source: commons(file) },
})

export const DISHES = {
  janchi: dish({ name: '잔치국수', nameEn: 'Feast noodles', size: [800, 600], file: 'Janchi guksu (noodle soup).jpg', author: 'daecheonnet', license: 'CC0', licenseUrl: CC0 }),
  myeolchi: dish({ name: '멸치국수', nameEn: 'Anchovy-broth noodles', size: [800, 600], file: 'Janchiguksu잔치국수IMG 0714.jpg', author: 'Choikwangmo9', license: 'CC0', licenseUrl: CC0 }),
  bibim: dish({ name: '비빔국수', nameEn: 'Spicy mixed noodles', size: [800, 600], file: 'Bibim-guksu.jpg', author: 'JeongHO Suh (daecheonnet)', license: 'CC0', licenseUrl: CC0 }),
  kalguksu: dish({ name: '칼국수', nameEn: 'Knife-cut noodles', size: [800, 600], file: 'Kal-guksu 4.jpg', author: 'insatiablemunch', license: 'CC BY 2.0', licenseUrl: BY2 }),
  bajirak: dish({ name: '바지락칼국수', nameEn: 'Clam knife-cut noodles', size: [800, 600], file: 'Bajirak-kalguksu.jpg', author: 'Suh Jeong-ho', license: 'CC0', licenseUrl: CC0 }),
  deulkkae: dish({ name: '들깨칼국수', nameEn: 'Perilla knife-cut noodles', size: [600, 450], file: 'Deulkkae-chik-kal-guksu.jpg', author: '향긋한 커피매니아', license: 'CC BY 4.0', licenseUrl: BY4 }),
  kong: dish({ name: '콩국수', nameEn: 'Cold soy-milk noodles', size: [800, 600], file: 'Kong-guksu.jpg', author: 'lazy fri13th', license: 'CC BY 2.0', licenseUrl: BY2 }),
  mandu: dish({ name: '손만두', nameEn: 'Handmade dumplings', size: [800, 600], file: 'Jjin-mandu 3.jpg', author: 'Chloe Lim', license: 'CC BY 2.0', licenseUrl: BY2 }),
  manduguk: dish({ name: '만둣국', nameEn: 'Dumpling soup', size: [800, 600], file: 'Mandu-guk 1.jpg', author: 'lazy fri13th', license: 'CC BY 2.0', licenseUrl: BY2 }),
  naengmyeon: dish({ name: '물냉면', nameEn: 'Cold buckwheat noodles', size: [800, 600], file: 'Mul-naengmyeon 3.jpg', author: 'chomjong', license: 'CC BY 2.0', licenseUrl: BY2 }),
  memil: dish({ name: '냉모밀', nameEn: 'Cold soba', size: [640, 480], file: 'Zaru-Soba-1.jpg', author: 'Evelyn-rose', license: 'CC0', licenseUrl: CC0 }),
  sujebi: dish({ name: '수제비', nameEn: 'Hand-torn noodle soup', size: [640, 480], file: 'Korean.cuisine-Sujebi-01.jpg', author: 'Steve Longus', license: 'CC BY 2.0', licenseUrl: BY2 }),
  eomuk: dish({ name: '어묵탕', nameEn: 'Fish cake soup', size: [800, 600], file: 'Eomuk-tang.jpg', author: 'Chloe Lim', license: 'CC BY 2.0', licenseUrl: BY2 }),
  gamjajeon: dish({ name: '감자전', nameEn: 'Potato pancake', size: [640, 480], file: '원주행복한집밥 감자전 IMG 0699.jpg', author: 'Choikwangmo9', license: 'CC0', licenseUrl: CC0 }),
  geotjeori: dish({ name: '겉절이', nameEn: 'Fresh kimchi', size: [800, 600], file: 'Fresh kimchi (8560055699).jpg', author: 'jeffreyw', license: 'CC BY 2.0', licenseUrl: BY2 }),
  rice: dish({ name: '공기밥', nameEn: 'Bowl of rice', size: [800, 600], file: 'Bowl of white rice 02.jpg', author: 'Douglas Perkins', license: 'CC0', licenseUrl: CC0 }),
  dough: dish({ name: '칼국수 반죽 썰기', nameEn: 'Cutting knife-cut noodle dough', size: [708, 531], file: 'Kal-guksu 3.jpg', author: '백만볼투', license: 'CC BY 4.0', licenseUrl: BY4 }),
  broth: dish({ name: '육수 재료(멸치·다시마)', nameEn: 'Broth ingredients (anchovy, kelp)', size: [512, 384], file: 'Broth ingredients.jpg', author: '굿바이 조미료', license: 'CC BY 2.0 KR', licenseUrl: BY2_KR }),
} satisfies Record<string, Dish>

export type DishId = keyof typeof DISHES

/** 고른 언어의 메뉴 이름 — 사진 alt와 출처 페이지가 쓴다 */
export const dishName = ({ id, lang }: { id: DishId; lang: Lang }) => (lang === 'en' ? DISHES[id].nameEn : DISHES[id].name)

/** 배포 경로(VITE_BASE)를 따라가는 사진 주소 — public/ 아래 파일은 base 뒤에 붙는다 */
export const photoSrc = (id: DishId) => `${import.meta.env.BASE_URL}photos/${id}.webp`
