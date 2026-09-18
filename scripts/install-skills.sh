#!/bin/sh
# fe-skills 설치 스크립트 — 스킬 폴더를 현재 프로젝트의 스킬 디렉토리에 복사한다.
#
# 스킬 문서(SKILL.md)는 열린 표준(Agent Skills) 형식이라, 에이전트가 읽는 폴더에 복사만 하면 된다.
# Codex·Cursor·Gemini CLI·GitHub Copilot은 .agents/skills/ 를 읽고(기본값), Claude Code는 .claude/skills/ 를 읽는다.
#
# 사용:
#   curl -fsSL https://raw.githubusercontent.com/Guksu/fe-skills/main/scripts/install-skills.sh | sh
#   curl -fsSL .../install-skills.sh | sh -s -- ui                 # fe-ui만
#   curl -fsSL .../install-skills.sh | sh -s -- --dest .claude/skills   # Claude Code 프로젝트 스킬 폴더로
#   sh scripts/install-skills.sh --dest ~/.agents/skills all       # 저장소를 이미 받았을 때 (개인 전역 폴더로)
#
# 옵션:
#   ui | system | all      설치할 플러그인 (기본 all)
#   --dest DIR             설치 폴더 (기본 .agents/skills)
#   --ref REF              가져올 브랜치·태그 (기본 main)
#   FE_SKILLS_REPO=URL     환경 변수 — 저장소 주소 덮어쓰기 (기본 https://github.com/Guksu/fe-skills.git)
#
# 같은 이름의 스킬 폴더가 이미 있으면 지우고 새로 복사한다(업데이트). 다른 폴더는 건드리지 않는다.
# 필요한 것: git, POSIX sh. Node.js는 필요 없다.

set -eu

REPO="${FE_SKILLS_REPO:-https://github.com/Guksu/fe-skills.git}"
DEST=".agents/skills"
REF="main"
WHAT="all"

while [ $# -gt 0 ]; do
  case "$1" in
    --dest) DEST="$2"; shift 2 ;;
    --dest=*) DEST="${1#--dest=}"; shift ;;
    --ref) REF="$2"; shift 2 ;;
    --ref=*) REF="${1#--ref=}"; shift ;;
    ui|system|all) WHAT="$1"; shift ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "알 수 없는 인자: $1 (ui | system | all | --dest DIR | --ref REF)" >&2; exit 2 ;;
  esac
done

command -v git >/dev/null 2>&1 || { echo "git이 필요합니다." >&2; exit 1; }

TMP="$(mktemp -d 2>/dev/null || mktemp -d -t fe-skills)"
trap 'rm -rf "$TMP"' EXIT INT TERM

echo "fe-skills 받는 중: $REPO ($REF)"
git clone --quiet --depth 1 --branch "$REF" "$REPO" "$TMP/repo"

mkdir -p "$DEST"
count=0

copy_plugin() {
  plugin_dir="$TMP/repo/plugins/$1/skills"
  [ -d "$plugin_dir" ] || { echo "플러그인 폴더가 없습니다: plugins/$1/skills" >&2; exit 1; }
  for skill in "$plugin_dir"/*/; do
    [ -f "$skill/SKILL.md" ] || continue
    name="$(basename "$skill")"
    rm -rf "$DEST/$name"
    cp -R "$skill" "$DEST/$name"
    count=$((count + 1))
  done
}

case "$WHAT" in
  ui) copy_plugin ui ;;
  system) copy_plugin system ;;
  all) copy_plugin ui; copy_plugin system ;;
esac

echo "설치 완료: 스킬 $count개 → $DEST/"
echo "에이전트를 다시 시작하면 스킬을 발견합니다. 목록: ls $DEST"
