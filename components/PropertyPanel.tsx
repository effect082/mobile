
import React, { useState } from 'react';
import { BlockData, BlockType } from '../types';
import { Trash2, ChevronUp, ChevronDown, Wand2, Plus, X, Eye } from 'lucide-react';
import { enhanceText } from '../services/geminiService';

interface Props {
  selectedBlock: BlockData | null;
  updateBlock: (id: string, data: Partial<BlockData>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
}

const PropertyPanel: React.FC<Props> = ({ selectedBlock, updateBlock, deleteBlock, moveBlock }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full p-6 flex flex-col items-center justify-center text-gray-400">
        <p>편집할 블록을 선택하세요</p>
      </div>
    );
  }

  const handleContentChange = (key: string, value: any) => {
    updateBlock(selectedBlock.id, {
      content: { ...selectedBlock.content, [key]: value }
    });
  };

  const handleStyleChange = (key: string, value: any) => {
    updateBlock(selectedBlock.id, {
      styles: { ...selectedBlock.styles, [key]: value }
    });
  };

  const handleAiRewrite = async () => {
    if (selectedBlock.type === BlockType.TEXT || selectedBlock.type === BlockType.HEADER) {
      setIsEnhancing(true);
      const result = await enhanceText(selectedBlock.content.text, 'friendly');
      handleContentChange('text', result);
      setIsEnhancing(false);
    }
  };

  const renderCommonStyles = () => (
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h4 className="font-medium text-sm text-gray-500">스타일 설정</h4>
      <div>
        <label className="block text-xs text-gray-500 mb-1">배경색</label>
        <div className="flex gap-2">
          <input 
            type="color" 
            value={selectedBlock.styles.backgroundColor || '#ffffff'} 
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          />
          <span className="text-xs self-center text-gray-400">{selectedBlock.styles.backgroundColor}</span>
        </div>
      </div>
       <div>
        <label className="block text-xs text-gray-500 mb-1">글자색</label>
        <div className="flex gap-2">
          <input 
            type="color" 
            value={selectedBlock.styles.textColor || '#000000'} 
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          />
          <span className="text-xs self-center text-gray-400">{selectedBlock.styles.textColor}</span>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">여백 (Padding)</label>
        <select 
          className="w-full border rounded p-2 text-sm"
          value={selectedBlock.styles.padding || '16px'}
          onChange={(e) => handleStyleChange('padding', e.target.value)}
        >
          <option value="0px">없음</option>
          <option value="8px">좁게</option>
          <option value="16px">보통</option>
          <option value="32px">넓게</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700 text-sm">블록 편집</h3>
        <div className="flex gap-1">
          <button onClick={() => moveBlock(selectedBlock.id, 'up')} className="p-1 hover:bg-gray-200 rounded" title="위로 이동"><ChevronUp size={16} /></button>
          <button onClick={() => moveBlock(selectedBlock.id, 'down')} className="p-1 hover:bg-gray-200 rounded" title="아래로 이동"><ChevronDown size={16} /></button>
          <button onClick={() => deleteBlock(selectedBlock.id)} className="p-1 hover:bg-red-100 text-red-500 rounded ml-2" title="삭제"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Dynamic Content Fields based on Type */}
        
        {(selectedBlock.type === BlockType.HEADER || selectedBlock.type === BlockType.TEXT) && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">내용</label>
            <textarea 
              className="w-full border rounded p-2 text-sm h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedBlock.content.text}
              onChange={(e) => handleContentChange('text', e.target.value)}
            />
            <button 
              onClick={handleAiRewrite}
              disabled={isEnhancing || !process.env.API_KEY}
              className="flex items-center justify-center w-full gap-2 text-xs bg-purple-100 text-purple-700 py-2 rounded hover:bg-purple-200 transition-colors"
            >
              <Wand2 size={14} />
              {isEnhancing ? '작성 중...' : 'AI 다듬기 (Gemini)'}
            </button>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">텍스트 정렬</label>
              <div className="flex border rounded overflow-hidden">
                {['left', 'center', 'right'].map((align) => (
                  <button 
                    key={align}
                    className={`flex-1 py-1 text-xs ${selectedBlock.styles.textAlign === align ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => handleStyleChange('textAlign', align)}
                  >
                    {align === 'left' ? '좌' : align === 'center' ? '중앙' : '우'}
                  </button>
                ))}
              </div>
            </div>
            
             <div>
                <label className="block text-xs text-gray-500 mb-1">글자 크기</label>
                <select 
                value={selectedBlock.styles.fontSize || (selectedBlock.type === BlockType.HEADER ? '1.5rem' : '1rem')} 
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                >
                <option value="0.75rem">매우 작게 (XS)</option>
                <option value="0.875rem">작게 (S)</option>
                <option value="1rem">보통 (M)</option>
                <option value="1.25rem">중간 (L)</option>
                <option value="1.5rem">크게 (XL)</option>
                <option value="1.875rem">더 크게 (2XL)</option>
                <option value="2.25rem">매우 크게 (3XL)</option>
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">글자 굵기</label>
                <select 
                value={selectedBlock.styles.fontWeight || 'normal'} 
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full border rounded p-2 text-sm"
                >
                <option value="300">얇게</option>
                <option value="400">보통</option>
                <option value="500">중간</option>
                <option value="700">굵게</option>
                </select>
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.IMAGE && (
          <div className="space-y-3">
             {selectedBlock.content.url && (
                 <div className="relative group">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={selectedBlock.content.url} alt="Preview" className="w-full h-32 object-cover rounded border" />
                     <button 
                        onClick={() => handleContentChange('url', '')}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                        title="이미지 삭제"
                     >
                         <X size={12} />
                     </button>
                 </div>
             )}
             <div>
              <label className="block text-sm font-medium mb-1">이미지 URL</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.url} 
                onChange={(e) => handleContentChange('url', e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-400 mt-1">또는 파일을 선택하세요</p>
              <input 
                type="file" 
                accept="image/*"
                className="mt-2 text-xs w-full"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Use FileReader to convert to Base64 for persistent storage
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const result = reader.result as string;
                        handleContentChange('url', result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">설명 (Alt Text)</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.alt} 
                onChange={(e) => handleContentChange('alt', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">캡션</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.caption || ''} 
                onChange={(e) => handleContentChange('caption', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.VIDEO && (
          <div className="space-y-3">
             {selectedBlock.content.url && (
                 <div className="relative bg-black h-32 flex items-center justify-center rounded overflow-hidden mb-2">
                    <span className="text-white text-xs">동영상이 추가되었습니다</span>
                    <button 
                        onClick={() => handleContentChange('url', '')}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                        title="동영상 삭제"
                     >
                         <X size={12} />
                     </button>
                 </div>
             )}
            <label className="block text-sm font-medium">YouTube URL</label>
            <input 
              type="text" 
              className="w-full border rounded p-2 text-sm"
              value={selectedBlock.content.url} 
              onChange={(e) => handleContentChange('url', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        )}

        {selectedBlock.type === BlockType.SCHEDULE && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">행사명</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.title} 
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">시작</label>
                <input 
                  type="datetime-local" 
                  className="w-full border rounded p-2 text-xs"
                  value={selectedBlock.content.startDate} 
                  onChange={(e) => handleContentChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">종료</label>
                <input 
                  type="datetime-local" 
                  className="w-full border rounded p-2 text-xs"
                  value={selectedBlock.content.endDate} 
                  onChange={(e) => handleContentChange('endDate', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">장소</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.location} 
                onChange={(e) => handleContentChange('location', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.BUSINESS_INFO && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">사업명</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.title} 
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">사업 설명</label>
              <textarea 
                className="w-full border rounded p-2 text-sm h-20 resize-none"
                value={selectedBlock.content.description || ''} 
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="사업에 대한 설명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">상세 항목 (대상, 이용료 등)</label>
                <button 
                  onClick={() => {
                    const newItems = [...(selectedBlock.content.items || []), { id: Date.now().toString(), label: '항목', value: '' }];
                    handleContentChange('items', newItems);
                  }}
                  className="text-xs text-blue-600 flex items-center hover:underline"
                >
                  <Plus size={12} className="mr-1" /> 추가
                </button>
              </div>
              {selectedBlock.content.items?.map((item: any, idx: number) => (
                <div key={item.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded">
                  <div className="flex-1 space-y-1">
                    <input 
                      className="w-full border rounded px-1 py-1 text-xs"
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...selectedBlock.content.items];
                        newItems[idx].label = e.target.value;
                        handleContentChange('items', newItems);
                      }}
                      placeholder="라벨"
                    />
                    <input 
                      className="w-full border rounded px-1 py-1 text-xs"
                      value={item.value}
                      onChange={(e) => {
                        const newItems = [...selectedBlock.content.items];
                        newItems[idx].value = e.target.value;
                        handleContentChange('items', newItems);
                      }}
                      placeholder="내용"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const newItems = selectedBlock.content.items.filter((_: any, i: number) => i !== idx);
                      handleContentChange('items', newItems);
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.MAP && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">장소명</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.locationName} 
                onChange={(e) => handleContentChange('locationName', e.target.value)}
              />
            </div>
             <div>
              <label className="block text-sm font-medium mb-1">주소</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.address} 
                onChange={(e) => handleContentChange('address', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.FORM && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">버튼 텍스트</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-sm"
                value={selectedBlock.content.buttonText} 
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
              />
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">입력 필드</label>
                    <button 
                        onClick={() => {
                            const newFields = [...(selectedBlock.content.fields || []), { id: Date.now().toString(), label: '새 항목', type: 'text' }];
                            handleContentChange('fields', newFields);
                        }}
                        className="text-xs text-blue-600 flex items-center hover:underline"
                    >
                        <Plus size={12} className="mr-1" /> 추가
                    </button>
                </div>
                 {selectedBlock.content.fields?.map((field: any, idx: number) => (
                <div key={field.id} className="flex gap-2 items-center mb-2">
                  <input 
                      className="flex-1 border rounded px-2 py-1 text-xs"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...selectedBlock.content.fields];
                        newFields[idx].label = e.target.value;
                        handleContentChange('fields', newFields);
                      }}
                    />
                    <select 
                       className="border rounded px-1 py-1 text-xs w-16"
                       value={field.type}
                       onChange={(e) => {
                         const newFields = [...selectedBlock.content.fields];
                        newFields[idx].type = e.target.value;
                        handleContentChange('fields', newFields);
                       }}
                    >
                      <option value="text">문자</option>
                      <option value="email">이메일</option>
                      <option value="tel">전화</option>
                    </select>
                    <button 
                        onClick={() => {
                            const newFields = selectedBlock.content.fields.filter((_: any, i: number) => i !== idx);
                            handleContentChange('fields', newFields);
                        }}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X size={14} />
                    </button>
                </div>
                 ))}
            </div>
          </div>
        )}

        {selectedBlock.type === BlockType.SOCIAL && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">소셜 링크 관리</label>
                    <button 
                    onClick={() => {
                        const newLinks = [...(selectedBlock.content.links || []), { id: Date.now().toString(), platform: 'website', url: '' }];
                        handleContentChange('links', newLinks);
                    }}
                    className="text-xs text-blue-600 flex items-center hover:underline"
                    >
                    <Plus size={12} className="mr-1" /> 추가
                    </button>
                 </div>
                 {selectedBlock.content.links?.map((link: any, idx: number) => (
                    <div key={link.id} className="bg-gray-50 p-3 rounded border border-gray-100 relative">
                         <button 
                            onClick={() => {
                                const newLinks = selectedBlock.content.links.filter((_: any, i: number) => i !== idx);
                                handleContentChange('links', newLinks);
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                        <div className="mb-2">
                            <label className="text-xs text-gray-500 block mb-1">플랫폼</label>
                            <select 
                                className="w-full border rounded text-xs p-1"
                                value={link.platform}
                                onChange={(e) => {
                                    const newLinks = [...selectedBlock.content.links];
                                    newLinks[idx].platform = e.target.value;
                                    handleContentChange('links', newLinks);
                                }}
                            >
                                <option value="website">홈페이지/기타</option>
                                <option value="youtube">유튜브</option>
                                <option value="instagram">인스타그램</option>
                                <option value="blog">네이버 블로그</option>
                                <option value="kakao">카카오톡 채널</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">URL</label>
                            <input 
                                type="text" 
                                className="w-full border rounded text-xs p-1"
                                value={link.url}
                                onChange={(e) => {
                                    const newLinks = [...selectedBlock.content.links];
                                    newLinks[idx].url = e.target.value;
                                    handleContentChange('links', newLinks);
                                }}
                                placeholder="https://"
                            />
                        </div>
                    </div>
                 ))}
             </div>
        )}

        {renderCommonStyles()}
      </div>
    </div>
  );
};

export default PropertyPanel;
