// 五星及其五行
export const FIVE_STARS = [
  { name: "辰星", element: "水" },
  { name: "荧惑", element: "火" },
  { name: "岁德", element: "木" },
  { name: "太白", element: "金" },
  { name: "镇星", element: "土" },
]

// 十二地支
export const EARTHLY_BRANCHES = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]

// 十二时辰五行
export const HOUR_ELEMENTS: Record<string, string> = {
  亥: "水",
  子: "水",
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  申: "金",
  酉: "金",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
}

// 十二月将
export const MONTH_GENERALS = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]

// 五行相生相克关系
export const ELEMENT_RELATIONS: Record<string, { generates: string; controls: string }> = {
  木: { generates: "火", controls: "土" },
  火: { generates: "土", controls: "金" },
  土: { generates: "金", controls: "水" },
  金: { generates: "水", controls: "木" },
  水: { generates: "木", controls: "火" },
}

// 旺相休废表
export const PROSPERITY_TABLE: Record<string, Record<string, string>> = {
  春: { 木: "旺", 火: "相", 水: "休", 金: "囚", 土: "死" },
  夏: { 火: "旺", 土: "相", 木: "休", 水: "囚", 金: "死" },
  秋: { 金: "旺", 水: "相", 土: "休", 火: "囚", 木: "死" },
  冬: { 水: "旺", 木: "相", 金: "休", 土: "囚", 火: "死" },
}

export interface DivinationResult {
  monthGeneral: string
  dayPosition: string
  useStar: string
  bodyElement: string
  useElement: string
  relationship: string
  fortune: string
  explanation: string
  season: string
  prosperityTable: Array<{ element: string; status: string }>
}

export function calculateDivination(month: number, day: number, hour: string): DivinationResult {
  // 步骤1: 寅上起月 - 从寅起，顺时针数到月将落宫
  const monthGeneralIndex = (month - 1) % 12
  const monthGeneral = MONTH_GENERALS[monthGeneralIndex]

  // 步骤2: 月上起日 - 从月落宫起，顺时针数到日落宫
  const monthPositionIndex = EARTHLY_BRANCHES.indexOf(monthGeneral)
  const dayPositionIndex = (monthPositionIndex + day - 1) % 12
  const dayPosition = EARTHLY_BRANCHES[dayPositionIndex]

  // 步骤3: 日上加星 - 从日落宫起，按五星顺序顺时针加到时辰落宫
  const hourIndex = EARTHLY_BRANCHES.indexOf(hour)
  const stepsFromDay = (hourIndex - dayPositionIndex + 12) % 12
  const useStarIndex = stepsFromDay % 5
  const useStar = FIVE_STARS[useStarIndex]

  // 确定体用五行
  const bodyElement = HOUR_ELEMENTS[hour]
  const useElement = useStar.element

  // 判断体用关系
  let relationship = ""
  if (bodyElement === useElement) {
    relationship = "比和"
  } else if (ELEMENT_RELATIONS[bodyElement].controls === useElement) {
    relationship = "体克用"
  } else if (ELEMENT_RELATIONS[useElement].controls === bodyElement) {
    relationship = "用克体"
  } else if (ELEMENT_RELATIONS[bodyElement].generates === useElement) {
    relationship = "体生用"
  } else if (ELEMENT_RELATIONS[useElement].generates === bodyElement) {
    relationship = "用生体"
  }

  // 判断吉凶
  let fortune = ""
  let explanation = ""

  if (relationship === "体克用") {
    fortune = "吉"
    explanation = "体克用为吉，表示你能够掌控局面，主动权在手，事情发展对你有利。"
  } else if (relationship === "用克体") {
    fortune = "凶"
    explanation = "用克体为凶，表示受到外界制约，处于被动局面，需谨慎行事，避免冲突。"
  } else if (relationship === "体生用") {
    fortune = "凶"
    explanation = "体生用为凶，表示付出多而回报少，容易耗损自身精力，需注意保存实力。"
  } else if (relationship === "用生体") {
    fortune = "吉"
    explanation = "用生体为吉，表示能得到外界帮助和支持，贵人相助，事半功倍。"
  } else {
    fortune = "吉"
    explanation = "比和为吉，表示五行相同，气场和谐，事情发展平稳顺利。"
  }

  // 确定季节
  let season = ""
  if (month >= 1 && month <= 3) {
    season = "春"
  } else if (month >= 4 && month <= 6) {
    season = "夏"
  } else if (month >= 7 && month <= 9) {
    season = "秋"
  } else {
    season = "冬"
  }

  // 生成旺相休废表
  const prosperityData = PROSPERITY_TABLE[season]
  const prosperityTable = ["木", "火", "土", "金", "水"].map((element) => ({
    element,
    status: prosperityData[element],
  }))

  // 结合旺相休废调整吉凶判断
  const bodyStatus = prosperityData[bodyElement]
  const useStatus = prosperityData[useElement]

  if (bodyStatus === "旺" || bodyStatus === "相") {
    explanation += ` 体（${bodyElement}）处于${bodyStatus}态，力量较强。`
  } else if (bodyStatus === "囚" || bodyStatus === "死") {
    explanation += ` 体（${bodyElement}）处于${bodyStatus}态，力量较弱，需借助外力。`
  }

  return {
    monthGeneral,
    dayPosition,
    useStar: `${useStar.name}（${useStar.element}）`,
    bodyElement,
    useElement,
    relationship,
    fortune,
    explanation,
    season,
    prosperityTable,
  }
}
