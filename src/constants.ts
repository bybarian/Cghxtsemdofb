import { Scenario, ScheduleItem } from './types';

export const WORKSHOP_SCHEDULE: ScheduleItem[] = [
  { time: "13:00-13:05", minutes: 5, topic: "長官與貴賓致詞", location: "33會議室" },
  { time: "13:05-13:35", minutes: 30, topic: "Clinical Coach 在能力導向教育的角色", location: "33會議室" },
  { time: "13:35-14:05", minutes: 30, topic: "回饋技巧理論架構介紹 (ERCP)", location: "33會議室" },
  { time: "14:05-14:35", minutes: 30, topic: "回饋技巧實務探討", location: "33會議室" },
  { time: "14:35-14:40", minutes: 15, topic: "茶敘", location: "33會議室", isBreak: true },
  { time: "14:40-16:00", minutes: 80, topic: "情境演練 Session 1 (病史詢問 / 病情解釋)", location: "臨床技能中心" },
  { time: "16:00-16:10", minutes: 10, topic: "茶敘", location: "臨床技能中心", isBreak: true },
  { time: "16:10-17:30", minutes: 80, topic: "情境演練 Session 2 (病史詢問 / 病情解釋)", location: "臨床技能中心" },
  { time: "17:30-17:50", minutes: 20, topic: "總結 (Closing Remarks)", location: "臨床技能中心" }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "情境一：表面認同型 (Yes-Man)",
    timeRange: "14:40~15:20",
    personality: 'agreeable_vague',
    description: "不斷點頭認同，但教練無法得知你的真實想法或具體學習痛點。",
    roleBehavior: "當教練問你『覺不覺得剛才哪裡可以更好？』時，你總是回答『老師說得對，我都覺得很好，我會改進』。你的目標是讓教練練習如何『深挖』學員的內心想法。",
    tips: [
      "過度點頭：『是的，老師。』『對，我下次會注意。』",
      "給予抽象的回答，避免具體的自我評估",
      "眼神略微飄忽或過於客氣，展現一種『客套的學習心態』"
    ]
  },
  {
    id: 2,
    title: "情境二：完美主義型 (Perfectionist)",
    timeRange: "15:20~16:00",
    personality: 'perfectionist',
    description: "對自己要求極高，教練給予正面肯定時反而讓你感到挫折或不自在。",
    roleBehavior: "即便教練稱讚你，你也要強調自己做得不好的地方。例如：『老師，我覺得我剛才那個解釋太爛了，病人一定覺得我不專業。』測試教練如何處理這種『自我價值感低落』的學員。",
    tips: [
      "拒絕表揚：『沒有啦，我真的覺得我那天表現很糟...』",
      "專注於微小的失誤並將其放大",
      "對於教練提出的優點表現出不相信的表情"
    ]
  },
  {
    id: 3,
    title: "情境三：抗拒/焦慮型 (Resistant)",
    timeRange: "16:10~17:00",
    personality: 'resistant_anxious',
    description: "表現出非常焦慮或是有急事想離開，對回饋內容表現出防禦性。",
    roleBehavior: "頻繁看手錶，表現出心思不在這裡。當教練點出問題時，嘗試用外部原因開脫，如：『因為那天急診室真的很忙...』測試教練如何建立關係並穩定你的情緒。",
    tips: [
      "不時撥弄手機或看手錶",
      "給予防禦性的回應：『我平常不會這樣，是那天情況太特殊。』",
      "肢體語言緊繃，避免與教練有過多的情感連結"
    ]
  }
];
