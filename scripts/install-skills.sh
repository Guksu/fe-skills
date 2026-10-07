#!/bin/sh
# suta 설치 스크립트 — 진입 스킬 폴더(skills/suta) 하나를 현재 프로젝트의 스킬 디렉토리에 복사한다.
#
# suta는 열린 표준(Agent Skills) 스킬 하나다(SKILL.md + 통합 검사 scripts/ + 패턴 patterns/). 에이전트가 읽는 폴더에 복사만 하면 된다.
# Codex·Cursor·Gemini CLI·GitHub Copilot은 .agents/skills/ 를 읽고(기본값), Claude Code는 .claude/skills/ 를 읽는다.
#
# 사용:
#   curl -fsSL https://raw.githubusercontent.com/Guksu/suta/main/scripts/install-skills.sh | sh
#   curl -fsSL .../install-skills.sh | sh -s -- --dest .claude/skills   # Claude Code 프로젝트 스킬 폴더로
#   sh scripts/install-skills.sh --dest ~/.agents/skills           # 저장소를 이미 받았을 때 (개인 전역 폴더로)
#   sh scripts/install-skills.sh --local . --dest /tmp/try         # 커밋 전 작업 폴더를 그대로 시험
#
# 옵션:
#   --dest DIR             설치 폴더 (기본 .agents/skills)
#   --ref REF              가져올 브랜치·태그 (기본 main)
#   --local DIR            저장소를 받지 않고 이 폴더(저장소 루트)에서 복사
#   SUTA_REPO=URL          환경 변수 — 저장소 주소 덮어쓰기 (기본 https://github.com/Guksu/suta.git)
#   ui | all               예전 인자 — 무시한다
#
# 이미 있는 suta 폴더는 지우고 새로 복사한다(업데이트). 다른 폴더는 건드리지 않는다.
# 예전 버전(fe-skills)의 패턴별 스킬 폴더가 남아 있으면 지우지 않고 목록만 알려 준다.
# 필요한 것: git(--local이면 불필요), POSIX sh. 설치 후 레이아웃·모션 검사(suta/scripts/audit.mjs)를 돌리려면 Node.js 22.18 이상.

set -eu

REPO="${SUTA_REPO:-https://github.com/Guksu/suta.git}"
DEST=".agents/skills"
REF="main"
LOCAL=""

while [ $# -gt 0 ]; do
  case "$1" in
    --dest) DEST="$2"; shift 2 ;;
    --dest=*) DEST="${1#--dest=}"; shift ;;
    --ref) REF="$2"; shift 2 ;;
    --ref=*) REF="${1#--ref=}"; shift ;;
    --local) LOCAL="$2"; shift 2 ;;
    --local=*) LOCAL="${1#--local=}"; shift ;;
    # 예전 설치 명령(sh -s -- ui)이 그대로 동작하도록 받아서 무시한다
    ui|all) shift ;;
    system) echo "설계 문답 스킬(system)은 제거되었습니다. 인자 없이 실행하세요." >&2; exit 2 ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "알 수 없는 인자: $1 (--dest DIR | --ref REF | --local DIR)" >&2; exit 2 ;;
  esac
done

if [ -n "$LOCAL" ]; then
  SRC="$LOCAL"
else
  command -v git >/dev/null 2>&1 || { echo "git이 필요합니다." >&2; exit 1; }
  TMP="$(mktemp -d 2>/dev/null || mktemp -d -t suta)"
  trap 'rm -rf "$TMP"' EXIT INT TERM
  echo "suta 받는 중: $REPO ($REF)"
  git clone --quiet --depth 1 --branch "$REF" "$REPO" "$TMP/repo"
  SRC="$TMP/repo"
fi

skill_dir="$SRC/skills/suta"
[ -f "$skill_dir/SKILL.md" ] || { echo "스킬 폴더가 없습니다: skills/suta" >&2; exit 1; }

mkdir -p "$DEST"
rm -rf "$DEST/suta"
cp -R "$skill_dir" "$DEST/suta"
echo "설치 완료: suta (패턴 $(ls "$DEST/suta/patterns" | wc -l | tr -d ' ')종) → $DEST/suta/"

# 예전 버전의 패턴별 스킬 폴더는 suta와 같은 요청에 겹쳐 걸린다 — 지우지는 않고 알려 준다
legacy=""
for pattern in "$skill_dir"/patterns/*/; do
  name="$(basename "$pattern")"
  if [ -f "$DEST/$name/SKILL.md" ]; then legacy="$legacy $name"; fi
done
if [ -n "$legacy" ]; then
  echo "예전 버전(fe-skills)의 스킬 폴더가 남아 있습니다. suta와 겹쳐 걸리므로 지우세요:"
  for name in $legacy; do echo "  rm -rf $DEST/$name"; done
fi
echo "에이전트를 다시 시작하면 suta를 발견합니다."
