import type { ControlGroup } from './types';

const defaultOption = { label: { en: 'Default', zh: '默认' }, value: '' };

export const CONTROL_GROUPS: ControlGroup[] = [
  {
    name: { en: 'Anatomical System', zh: '解剖系统' },
    controls: [
      {
        id: 'system',
        name: { en: 'System', zh: '系统/部位' },
        options: [
          defaultOption,
          { label: { en: 'Cardiovascular System', zh: '心血管系统' }, value: 'Cardiovascular System' },
          { label: { en: 'Skeletal System', zh: '骨骼系统' }, value: 'Skeletal System' },
          { label: { en: 'Nervous System', zh: '神经系统' }, value: 'Nervous System' },
          { label: { en: 'Muscular System', zh: '肌肉系统' }, value: 'Muscular System' },
          { label: { en: 'Digestive System', zh: '消化系统' }, value: 'Digestive System' },
          { label: { en: 'Respiratory System', zh: '呼吸系统' }, value: 'Respiratory System' },
          { label: { en: 'Cellular Structure', zh: '细胞微观结构' }, value: 'Cellular Structure' },
        ],
      },
      {
        id: 'organ',
        name: { en: 'Specific Organ', zh: '具体器官' },
        options: [
            defaultOption,
            { label: { en: 'Heart', zh: '心脏' }, value: 'Heart' },
            { label: { en: 'Brain', zh: '大脑' }, value: 'Brain' },
            { label: { en: 'Lungs', zh: '肺部' }, value: 'Lungs' },
            { label: { en: 'Liver', zh: '肝脏' }, value: 'Liver' },
            { label: { en: 'Kidney', zh: '肾脏' }, value: 'Kidney' },
            { label: { en: 'Stomach', zh: '胃' }, value: 'Stomach' },
            { label: { en: 'Intestine', zh: '肠道' }, value: 'Intestine' },
            { label: { en: 'Spine', zh: '脊柱' }, value: 'Spine' },
            { label: { en: 'Skull', zh: '头骨' }, value: 'Skull' },
        ]
      }
    ],
  },
  {
    name: { en: 'View & Perspective', zh: '视角与切面' },
    controls: [
      {
        id: 'view',
        name: { en: 'View', zh: '视角' },
        options: [
          defaultOption,
          { label: { en: 'Anterior View', zh: '前视图' }, value: 'Anterior View' },
          { label: { en: 'Posterior View', zh: '后视图' }, value: 'Posterior View' },
          { label: { en: 'Lateral View', zh: '侧视图' }, value: 'Lateral View' },
          { label: { en: 'Superior View', zh: '顶视图' }, value: 'Superior View' },
          { label: { en: 'Inferior View', zh: '底视图' }, value: 'Inferior View' },
        ],
      },
      {
        id: 'section',
        name: { en: 'Section', zh: '切面' },
        options: [
          defaultOption,
          { label: { en: 'Cross-section', zh: '横切面' }, value: 'Cross-section' },
          { label: { en: 'Longitudinal Section', zh: '纵切面' }, value: 'Longitudinal Section' },
          { label: { en: 'Sagittal Section', zh: '矢状面' }, value: 'Sagittal Section' },
          { label: { en: 'Coronal Section', zh: '冠状面' }, value: 'Coronal Section' },
        ],
      },
      {
        id: 'magnification',
        name: { en: 'Magnification', zh: '放大倍率' },
        options: [
            defaultOption,
            { label: { en: 'Macroscopic', zh: '宏观' }, value: 'Macroscopic' },
            { label: { en: 'Microscopic (10x)', zh: '显微 (10x)' }, value: 'Microscopic (10x)' },
            { label: { en: 'Microscopic (40x)', zh: '显微 (40x)' }, value: 'Microscopic (40x)' },
            { label: { en: 'Electron Microscope', zh: '电子显微镜' }, value: 'Electron Microscope' },
        ]
      }
    ],
  },
  {
    name: { en: 'Pathology & Condition', zh: '病理与状态' },
    controls: [
      {
        id: 'condition',
        name: { en: 'Condition', zh: '状态' },
        options: [
          defaultOption,
          { label: { en: 'Healthy', zh: '健康' }, value: 'Healthy' },
          { label: { en: 'Inflamed', zh: '发炎' }, value: 'Inflamed' },
          { label: { en: 'Infected', zh: '感染' }, value: 'Infected' },
          { label: { en: 'Fractured', zh: '骨折' }, value: 'Fractured' },
          { label: { en: 'Tumorous', zh: '肿瘤' }, value: 'Tumorous' },
          { label: { en: 'Necrotic', zh: '坏死' }, value: 'Necrotic' },
          { label: { en: 'Hypertrophic', zh: '肥大' }, value: 'Hypertrophic' },
          { label: { en: 'Atrophic', zh: '萎缩' }, value: 'Atrophic' },
        ],
      },
      {
        id: 'stage',
        name: { en: 'Stage', zh: '阶段' },
        options: [
            defaultOption,
            { label: { en: 'Early Stage', zh: '早期' }, value: 'Early Stage' },
            { label: { en: 'Advanced Stage', zh: '晚期' }, value: 'Advanced Stage' },
            { label: { en: 'Post-operative', zh: '术后' }, value: 'Post-operative' },
            { label: { en: 'Healing', zh: '愈合中' }, value: 'Healing' },
        ]
      }
    ],
  },
  {
    name: { en: 'Art Style', zh: '艺术风格' },
    controls: [
      {
        id: 'style',
        name: { en: 'Style', zh: '风格' },
        options: [
          defaultOption,
          { label: { en: 'Realistic Textbook Illustration', zh: '写实教科书插画' }, value: 'Realistic Textbook Illustration' },
          { label: { en: 'Line Art / Sketch', zh: '黑白线稿/素描' }, value: 'Line Art / Sketch' },
          { label: { en: '3D Render', zh: '3D 渲染' }, value: '3D Render' },
          { label: { en: 'Flat Schematic', zh: '扁平示意图' }, value: 'Flat Schematic' },
          { label: { en: 'Vintage Medical', zh: '复古医学图谱' }, value: 'Vintage Medical' },
          { label: { en: 'MRI / CT Style', zh: 'MRI/CT 影像风格' }, value: 'MRI / CT Style' },
        ],
      },
      {
        id: 'background',
        name: { en: 'Background', zh: '背景' },
        options: [
            defaultOption,
            { label: { en: 'Clean White', zh: '纯白背景' }, value: 'Clean White' },
            { label: { en: 'Transparent', zh: '透明背景' }, value: 'Transparent' },
            { label: { en: 'Dark Blue (Medical)', zh: '深蓝 (医学)' }, value: 'Dark Blue (Medical)' },
            { label: { en: 'Black', zh: '黑色' }, value: 'Black' },
        ]
      }
    ],
  },
];