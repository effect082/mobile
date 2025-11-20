
import { BlockType, BlockData, TemplateType } from './types';
import { 
  Type, Image, Video, Calendar, Briefcase, MapPin, FormInput, Minus, LayoutTemplate, Share2
} from 'lucide-react';

export const ICON_MAP = {
  [BlockType.HEADER]: LayoutTemplate,
  [BlockType.TEXT]: Type,
  [BlockType.IMAGE]: Image,
  [BlockType.VIDEO]: Video,
  [BlockType.SCHEDULE]: Calendar,
  [BlockType.BUSINESS_INFO]: Briefcase,
  [BlockType.MAP]: MapPin,
  [BlockType.FORM]: FormInput,
  [BlockType.SOCIAL]: Share2,
  [BlockType.DIVIDER]: Minus,
};

export const BLOCK_LABELS = {
  [BlockType.HEADER]: '헤더 (제목)',
  [BlockType.TEXT]: '텍스트',
  [BlockType.IMAGE]: '이미지',
  [BlockType.VIDEO]: '동영상',
  [BlockType.SCHEDULE]: '일정/날짜',
  [BlockType.BUSINESS_INFO]: '사업 안내',
  [BlockType.MAP]: '지도',
  [BlockType.FORM]: '입력 폼',
  [BlockType.SOCIAL]: '소셜 링크',
  [BlockType.DIVIDER]: '구분선',
};

export const INITIAL_BLOCKS: Record<TemplateType, BlockData[]> = {
  INVITATION: [
    {
      id: 'default-header',
      type: BlockType.HEADER,
      content: { text: '2024년 복지관 개관 기념행사' },
      styles: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', padding: '20px', backgroundColor: '#ffffff', textColor: '#1f2937' }
    },
    {
      id: 'default-schedule',
      type: BlockType.SCHEDULE,
      content: { title: '행사 일시', startDate: '2024-05-20T14:00', endDate: '2024-05-20T17:00', location: '복지관 1층 대강당' },
      styles: { padding: '16px', backgroundColor: '#f9fafb' }
    },
    {
      id: 'default-map',
      type: BlockType.MAP,
      content: { locationName: '서울시 행복복지관', address: '서울시 강남구 테헤란로 123' },
      styles: { padding: '0px' }
    },
    {
      id: 'default-form',
      type: BlockType.FORM,
      content: { buttonText: '참석 여부 제출하기', fields: [{id: 'f1', label: '성함', type: 'text'}, {id: 'f2', label: '연락처', type: 'tel'}] },
      styles: { padding: '20px', backgroundColor: '#ffffff' }
    }
  ],
  NEWSLETTER: [
    {
      id: 'default-header',
      type: BlockType.HEADER,
      content: { text: '5월의 복지 소식' },
      styles: { textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', padding: '30px', backgroundColor: '#3b82f6', textColor: '#ffffff' }
    },
    {
      id: 'default-text',
      type: BlockType.TEXT,
      content: { text: '안녕하세요. 이번 달 복지관의 다양한 소식을 전해드립니다. 따뜻한 봄날, 행복한 하루 보내세요.' },
      styles: { padding: '20px', fontSize: '1rem', backgroundColor: '#ffffff' }
    },
    {
      id: 'default-image',
      type: BlockType.IMAGE,
      content: { url: 'https://picsum.photos/600/400', alt: '활동 사진' },
      styles: { padding: '0px' }
    },
    {
      id: 'default-social',
      type: BlockType.SOCIAL,
      content: { 
        links: [
          { id: 's1', platform: 'website', url: 'https://welfareone.com' },
          { id: 's2', platform: 'youtube', url: 'https://youtube.com' }
        ]
      },
      styles: { padding: '16px', backgroundColor: '#f3f4f6', textAlign: 'center' }
    }
  ],
  PROMOTION: [
    {
      id: 'default-header',
      type: BlockType.HEADER,
      content: { text: '신규 프로그램 모집' },
      styles: { textAlign: 'left', fontSize: '1.5rem', fontWeight: 'bold', padding: '20px', backgroundColor: '#ffffff' }
    },
    {
      id: 'default-biz',
      type: BlockType.BUSINESS_INFO,
      content: { 
        title: '스마트폰 활용 교육', 
        description: '어르신들의 디지털 격차 해소를 위한 스마트폰 기초 및 활용 교육 프로그램입니다.',
        items: [
          { id: '1', label: '대상', value: '60세 이상 어르신' },
          { id: '2', label: '이용료', value: '무료' },
          { id: '3', label: '기간', value: '5월 ~ 7월 (매주 화)' }
        ] 
      },
      styles: { padding: '16px', backgroundColor: '#eff6ff' }
    },
     {
      id: 'default-form',
      type: BlockType.FORM,
      content: { buttonText: '신청하기', fields: [{id: 'f1', label: '성함', type: 'text'}, {id: 'f2', label: '연락처', type: 'tel'}] },
      styles: { padding: '20px', backgroundColor: '#ffffff' }
    }
  ]
};
