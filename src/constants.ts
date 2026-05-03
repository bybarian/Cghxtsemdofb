import { Scenario, ScheduleItem, RotationSession } from './types';

export const WORKSHOP_SCHEDULE: ScheduleItem[] = [
  { time: "13:00-13:05", minutes: 5, topic: "長官與貴賓致詞", location: "國泰人壽大樓 33 會議室", speaker: "簡志誠院長" },
  { time: "13:05-13:35", minutes: 30, topic: "Clinical Coach 在能力導向教育的角色", location: "國泰人壽大樓 33 會議室", speaker: "楊志偉教授" },
  { time: "13:35-14:05", minutes: 30, topic: "回饋技巧理論架構介紹 (ERCP)", location: "國泰人壽大樓 33 會議室", speaker: "劉政亨醫師" },
  { time: "14:05-14:20", minutes: 15, topic: "回饋技巧實務探討", location: "國泰人壽大樓 33 會議室", speaker: "鍾睿元副主任 / 郭宇正主任" },
  { time: "14:20-14:55", minutes: 35, topic: "回饋演練 Session 1 (Round 1)", location: "國泰人壽大樓 33 會議室" },
  { time: "14:55-15:00", minutes: 5, topic: "換場休息", location: "國泰人壽大樓 33 會議室", isBreak: true },
  { time: "15:00-15:25", minutes: 25, topic: "回饋演練 Session 1 (Round 2)", location: "國泰人壽大樓 33 會議室" },
  { time: "15:25-15:45", minutes: 20, topic: "咖啡茶敘", location: "國泰人壽大樓 33 會議室", isBreak: true },
  { time: "15:45-16:20", minutes: 35, topic: "回饋演練 Session 2 (Round 1)", location: "國泰人壽大樓 33 會議室" },
  { time: "16:20-16:25", minutes: 5, topic: "換場休息", location: "國泰人壽大樓 33 會議室", isBreak: true },
  { time: "16:25-16:50", minutes: 25, topic: "回饋演練 Session 2 (Round 2)", location: "國泰人壽大樓 33 會議室" },
  { time: "16:50-17:10", minutes: 20, topic: "總結 (Closing Remarks)", location: "國泰人壽大樓 33 會議室" }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "案例一：表面認同型 (Yes-Man)",
    iconName: "CheckCircle2",
    timeRange: "14:20~14:55",
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
    title: "案例二：完美主義型 (Perfectionist)",
    iconName: "Target",
    timeRange: "15:00~15:25",
    personality: 'perfectionist',
    description: "對自己要求極高，教練給予正面肯定時反而讓你感到挫折或不自在。",
    roleBehavior: "即便教練稱稱讚你，你也要強調自己做得不好的地方。例如：『老師，我覺得我剛才那個解釋太爛了，病人一定覺得我不專業。』測試教練如何處理這種『自我價值感低落』的學員。",
    tips: [
      "拒絕表揚：『沒有啦，我真的覺得我那天表現很糟...』",
      "專注於微小的失誤並將其放大",
      "對於教練提出的優點表現出不相信的表情"
    ]
  },
  {
    id: 3,
    title: "案例三：抗拒/焦慮型 (Resistant)",
    iconName: "AlertTriangle",
    timeRange: "15:45~16:20",
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
    timeRange: "14:20-15:25 (Session 1)",
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
    timeRange: "15:45-16:50 (Session 2)",
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
    title: "回饋演練流程 (標準流程-35~40分鐘)",
    steps: [
      {
        label: "PDT 複習",
        duration: "7 分鐘",
        iconName: "RefreshCcw",
        items: [
          "引言 (2分)：問好、自我介紹、問名字與臨床角色、詢問誰擔任『教師』",
          "建構 PDT (5分)：請學員在空白紙寫下住院醫師應有的表現與關鍵行為特徵",
          "修訂清單：團隊創建清單後，分發參考框架供團隊修訂",
          "註：因為一組會練習同一個主題兩次，因此 Round 2 不用重新建立 PDT"
        ]
      },
      {
        label: "播放影片 (Observation)",
        duration: "5 分鐘",
        iconName: "PlayCircle",
        items: [
          "觀看練習影片 (病史詢問 A/B ; 病情解釋 A/B)",
          "引導學員專注觀察住院醫師的特定行為特徵",
          "準備後續的回饋討論亮點"
        ]
      },
      {
        label: "回饋準備 (Prep)",
        duration: "6-8 分鐘",
        iconName: "ClipboardList",
        items: [
          "信賴等級評分：在小組討論前，舉手詢問個別評分 1-5 (2~3分)",
          "進行討論 (4~5分)：先問教師做得好的/不同的做法，再問其他人。討論回饋分流、限制或優先順序",
          "檢查推斷：強調推斷並邀請討論。確認教師準備狀況與計劃 (ADAPT/ERCP)"
        ]
      },
      {
        label: "進行回饋 (Execution)",
        duration: "7 分鐘",
        iconName: "Mic2",
        items: [
          "標準住院醫師進入診間 (提醒除教師及醫師外，其餘參與人均視為『看不見』)",
          "提醒其餘參與人被視為『看不見』",
          "教師可隨時喊『暫停』尋求幫助，或由協調者喊停以維持時間"
        ]
      },
      {
        label: "回饋總結 (Summary)",
        duration: "7-8 分鐘",
        iconName: "Flag",
        items: [
          "回饋評估：問教師過程感受，詢問希望得到的同儕回饋 (模仿 ADAPT/ERCP 模型)",
          "引導對話：邀請觀察者進行建設性引導。確認醫師帶著行動計畫離開",
          "住院醫師回饋：詢問住院醫師對本次過程的回饋"
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
