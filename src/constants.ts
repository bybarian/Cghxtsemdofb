import { Scenario, ScheduleItem, RotationSession } from './types';

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
    iconName: "CheckCircle2",
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
    iconName: "Target",
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
    iconName: "AlertTriangle",
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

export const ROTATION_DATA: RotationSession[] = [
  {
    timeRange: "14:40-16:00 (Session 1)",
    assignments: [
      { room: "診間一", scenarioType: "病史詢問", facilitator: "陳信佑", sr: "王昱仁", group: "A" },
      { room: "診間二", scenarioType: "病情解釋", facilitator: "郭宇正", sr: "闕嘉儀", group: "B" },
      { room: "診間三", scenarioType: "病史詢問", facilitator: "鍾睿元", sr: "施雯文", group: "C" },
      { room: "診間四", scenarioType: "病情解釋", facilitator: "陳玉龍", sr: "劉品佳", group: "D" },
      { room: "診間五", scenarioType: "病史詢問", facilitator: "劉政亨", sr: "李佩庭", group: "E" },
      { room: "診間六", scenarioType: "病情解釋", facilitator: "吳人傑", sr: "蔡如庭", group: "F" },
    ]
  },
  {
    timeRange: "16:10-17:30 (Session 2)",
    assignments: [
      { room: "診間一", scenarioType: "病情解釋", facilitator: "郭宇正", sr: "闕嘉儀", group: "A" },
      { room: "診間二", scenarioType: "病史詢問", facilitator: "陳信佑", sr: "王昱仁", group: "B" },
      { room: "診間三", scenarioType: "病情解釋", facilitator: "陳玉龍", sr: "劉品佳", group: "C" },
      { room: "診間四", scenarioType: "病史詢問", facilitator: "鍾睿元", sr: "施雯文", group: "D" },
      { room: "診間五", scenarioType: "病情解釋", facilitator: "吳人傑", sr: "蔡如庭", group: "E" },
      { room: "診間六", scenarioType: "病史詢問", facilitator: "劉政亨", sr: "李佩庭", group: "F" },
    ]
  }
];

export const FACILITATOR_GUIDE = [
  {
    id: 1,
    title: "情境演練流程 (標準流程-40分鐘)",
    steps: [
      {
        label: "PDT 複習",
        duration: "7 分鐘",
        iconName: "RefreshCcw",
        items: [
          "向學員問好並自我介紹",
          "詢問誰將擔任『教師』角色",
          "建構 PDT：請學員在紙上寫下對住院醫師的期望表現與關鍵技能",
          "分發參考框架供團隊修訂清單"
        ]
      },
      {
        label: "觀察演練 (影片)",
        duration: "10 分鐘",
        iconName: "PlayCircle",
        items: [
          "觀看練習影片 (影片 A & 影片 B)",
          "引導學員專注觀察住院醫師的特定行為",
          "注意：每個 Session 需進行兩次連續的回饋練習 (Round 1 A -> Round 2 B)"
        ]
      },
      {
        label: "回饋準備",
        duration: "8 分鐘",
        iconName: "ClipboardList",
        items: [
          "信賴等級評分：讓參與者舉手詢問個別評分 1-5",
          "進行討論：詢問教師做得好的與可改進之處，引導差異化回饋",
          "最後提問：確認教師是否準備好，或對同事有其他問題"
        ]
      },
      {
        label: "進行回饋",
        duration: "7 分鐘",
        iconName: "Mic2",
        items: [
          "提醒其餘參與人被視為『看不見』",
          "提醒教師隨時可喊『暫停』尋求幫助",
          "作為協調者隨時準備喊停以維持時間"
        ]
      },
      {
        label: "回饋總結",
        duration: "8 分鐘",
        iconName: "Flag",
        items: [
          "詢問教師感受與希望得到的同儕回饋",
          "主持人模仿 ADAPT 回饋模型進行引導",
          "確保住院醫師帶著具體的改變行動計劃離開"
        ]
      }
    ]
  }
];

export const SR_PROGRESSION = [
  { stage: "第一階段: 正常 (Normal)", description: "演出基本的住院醫師水準，以便教練觀察。" },
  { 
    stage: "第二階段: 表面認同 (Yes-man)", 
    description: "轉為不斷點頭客套。切換點：當教練請學員進行『回顧 (Review)』時，立即恢復正常。" 
  },
  { 
    stage: "第三階段: 完美主義 (Perfectionist)", 
    description: "轉為極度自我要求與焦慮。切換點：在獲得教練具體『鼓勵』後，展現改進意願。" 
  },
  { 
    stage: "第四階段: 抗拒/焦慮 (Resistant)", 
    description: "展現防禦性、一直看手錶。切換點：當教練主動詢問『是否有事情發生？』後，恢復正常討論。" 
  }
];
