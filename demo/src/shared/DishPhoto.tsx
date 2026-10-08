import { DISHES, photoSrc, type DishId } from './dishes'

type DishPhotoProps = {
  dish: DishId
  /** 대체 글 — 사진이 이름 옆에 붙어 같은 말을 되풀이하면 빈 문자열(장식)로 둔다 */
  alt?: string
  className?: string
}

/* 데모 공용 음식 사진 — 이모지를 상품 사진 대신 쓰지 않는다(진입 스킬 "글자·색·면").
 * 틀(부모나 className)이 크기·비율을 정하고, 사진은 object-fit: cover로 잘라 채운다(styles.css .dish-photo).
 * width·height는 원본 비율(4:3)을 알려 줘서 불러오기 전에도 자리가 흔들리지 않게 한다 */
export const DishPhoto = ({ dish, alt = '', className }: DishPhotoProps) => (
  <img
    className={className ? `dish-photo ${className}` : 'dish-photo'}
    src={photoSrc(dish)}
    alt={alt}
    width={DISHES[dish].width}
    height={DISHES[dish].height}
    loading="lazy"
    decoding="async"
    draggable={false}
  />
)
