
import { WorldEntity, TimelineEvent, SystemLog } from './types';

export const INITIAL_ENTITIES: WorldEntity[] = [
  // --- RSCP (Security/Containment) ---
  { 
    id: 'r1', 
    name: 'RSCP-001: 寂静尖塔', 
    type: 'LOCATION', 
    faction: 'RSCP',
    containmentClass: 'KETER',
    hazardLevel: 'S',
    status: '沉睡中', 
    resonance: 92, 
    coordinates: { x: 50, y: 50 },
    description: '位于行星本初子午线上的不明巨型结构。其表面材质无法解析，似乎在不断吸收周围环境的背景熵值。周围5公里内无声波传递。',
    secretData: '最新读数表明，尖塔并非在“吸收”熵，而是在向高维空间“传输”数据。它不是坟墓，而是发射塔。代号已变更为：THREAT-ALPHA。'
  },
  { 
    id: 'r2', 
    name: 'RSCP-204: 柯罗诺斯碎片', 
    type: 'ARTIFACT', 
    faction: 'RSCP',
    containmentClass: 'EUCLID',
    hazardLevel: 'A',
    status: '不稳定', 
    resonance: 75, 
    coordinates: { x: 45, y: 48 },
    description: '一块凝固的时间碎片，呈现为不断变幻的多面体。任何与其发生物理接触的有机体都会经历急速的细胞衰老或退行（变成胚胎）。',
    secretData: '该碎片似乎与实体“万古行者”产生量子共鸣。推测其可能是进行时间跳跃的催化剂。'
  },
  
  // --- HUMAN UNION (Civil/Survival) ---
  { 
    id: 'u1', 
    name: '第七扇区：平民窟', 
    type: 'LOCATION', 
    faction: 'UNION',
    containmentClass: 'N/A',
    hazardLevel: 'D',
    status: '活跃', 
    resonance: 15, 
    coordinates: { x: 25, y: 60 },
    description: 'B环区公民的主要居住地。生活条件维持在标准基准线。大气过滤系统当前以89%的效率运行，偶有酸雨渗透。',
    secretData: '在第七扇区的水库中检测到微量记忆清除剂（Amnestic-Class）。人联正在人为地维持人口的顺从性，以掩盖资源枯竭的事实。'
  },
  { 
    id: 'u2', 
    name: '人联真理广播站', 
    type: 'LOCATION', 
    faction: 'UNION',
    containmentClass: 'N/A',
    hazardLevel: 'E',
    status: '广播中', 
    resonance: 40, 
    coordinates: { x: 28, y: 58 },
    description: '人联的核心宣传机构，24小时不间断播放“人类团结”与“外界即地狱”的意识形态广播，确保士气稳定。',
  },

  // --- OBSERVER (Anomalies/Observers) ---
  { 
    id: 'a1', 
    name: '苍白行者', 
    type: 'PHENOMENON', 
    faction: 'OBSERVER',
    containmentClass: 'KETER',
    hazardLevel: 'S',
    status: '游荡中', 
    resonance: 98, 
    coordinates: { x: 80, y: 30 }, // Pollution zone
    description: '用户“Observer_9”报告：在红色迷雾区目击到一个瘦长的人形轮廓，未穿戴任何防护装备，且并未受到污染侵蚀。',
    secretData: '视觉分析确认该实体没有热信号。它不是在反射光线，而是在“擦除”光线。任何靠近它10米内的物质都会湮灭。'
  },
  { 
    id: 'a2', 
    name: '沃拉的回响', 
    type: 'CHARACTER', 
    faction: 'OBSERVER',
    containmentClass: 'EUCLID',
    hazardLevel: 'B',
    status: '显化中', 
    resonance: 65, 
    coordinates: { x: 52, y: 52 },
    description: '尖塔废墟附近报告了自发性的幻听现象。受害者声称听到了死去亲人的低语，诱导他们前往废墟中心。',
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  { id: 't1', era: '大崩塌前', year: '2088', title: '第一次共鸣', description: '全球各地的尖塔同时苏醒，引发了第一次空间震荡。', affectedEntities: ['r1'] },
  { id: 't2', era: '虚空纪元', year: '2102', title: '沃拉的沉寂', description: '高阶女祭司遇刺，灵能网络暂时断连。', affectedEntities: ['a2'] },
  { id: 't3', era: '重构期', year: '2145', title: '发现碎片', description: '万古行者在废墟中定位到了柯罗诺斯碎片。', affectedEntities: ['r2'] },
];

export const MOCK_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: '08:42:11', level: 'INFO', message: '观察者链路已建立。' },
  { id: 'l2', timestamp: '08:42:15', level: 'INFO', message: '正在扫描世界共鸣频率...' },
  { id: 'l3', timestamp: '08:43:02', level: 'WARN', message: '第七扇区检测到熵增异常。', code: 'ERR_ENTROPY_OVERFLOW' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: '全景概览' },
  { id: 'entities', label: '异常档案' },
  { id: 'timeline', label: '时间轴' },
  { id: 'oracle', label: '神谕系统' },
];