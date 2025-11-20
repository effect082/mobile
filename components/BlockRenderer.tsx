
import React from 'react';
import { BlockData, BlockType } from '../types';
import { MapPin, Calendar, Video as VideoIcon, Image as ImageIcon, Youtube, Instagram, MessageCircle, Globe, BookOpen } from 'lucide-react';

interface Props {
  block: BlockData;
  readOnly?: boolean;
}

const BlockRenderer: React.FC<Props> = ({ block, readOnly }) => {
  const { type, content, styles } = block;
  
  const containerStyle: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || 'transparent',
    padding: styles.padding || '16px',
    color: styles.textColor || 'inherit',
    textAlign: styles.textAlign || 'left',
  };

  const textStyle: React.CSSProperties = {
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
  };

  switch (type) {
    case BlockType.HEADER:
      return (
        <div style={containerStyle}>
          <h1 style={textStyle} className="break-words whitespace-pre-wrap">{content.text}</h1>
        </div>
      );
    
    case BlockType.TEXT:
      return (
        <div style={containerStyle}>
          <p style={textStyle} className="break-words whitespace-pre-wrap leading-relaxed">{content.text}</p>
        </div>
      );

    case BlockType.IMAGE:
      return (
        <div style={{ ...containerStyle, padding: styles.padding === '0px' ? 0 : styles.padding }}>
          {content.url ? (
             // eslint-disable-next-line @next/next/no-img-element
            <img src={content.url} alt={content.alt} className="w-full h-auto object-cover block" />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={40} />
              <span className="text-sm mt-2">이미지 없음</span>
            </div>
          )}
          {content.caption && <p className="text-xs text-center text-gray-500 mt-2">{content.caption}</p>}
        </div>
      );

    case BlockType.VIDEO:
      // Enhanced YouTube embed handling with robust Regex and Origin fix
      const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const videoId = getYouTubeId(content.url);
      // Adding origin is critical to prevent Error 153/150
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const embedUrl = videoId 
        ? `https://www.youtube.com/embed/${videoId}?origin=${origin}&rel=0&playsinline=1` 
        : '';

      return (
        <div style={containerStyle}>
          <div className="aspect-video bg-black rounded overflow-hidden relative">
            {embedUrl ? (
              <iframe 
                src={embedUrl} 
                // Only disable pointer events in the editor (when readOnly is false/undefined)
                // This allows playback in Preview/Publish mode, but prevents iframe capturing clicks during Drag & Drop editing
                className={`w-full h-full ${readOnly ? '' : 'pointer-events-none'}`} 
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <VideoIcon size={40} />
                <span className="text-sm mt-2">동영상 URL을 입력하세요</span>
              </div>
            )}
          </div>
        </div>
      );

    case BlockType.SCHEDULE:
      return (
        <div style={containerStyle}>
          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-white rounded shadow-sm text-gray-800">
            <h3 className="font-bold text-lg mb-2">{content.title}</h3>
            <div className="flex items-center text-gray-600 mb-1 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>{content.startDate ? new Date(content.startDate).toLocaleString() : '-'} ~ {content.endDate ? new Date(content.endDate).toLocaleString() : '-'}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={16} className="mr-2" />
              <span>{content.location}</span>
            </div>
          </div>
        </div>
      );

    case BlockType.BUSINESS_INFO:
      return (
        <div style={containerStyle}>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-gray-800">
            <h3 className="font-bold text-lg text-gray-900 mb-2 border-b pb-2">{content.title}</h3>
            {content.description && (
               <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{content.description}</p>
            )}
            <dl className="space-y-3">
              {content.items && content.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-500 w-24 shrink-0">{item.label}</dt>
                  <dd className="text-gray-800 text-right break-words flex-1">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      );

    case BlockType.MAP:
      return (
        <div style={containerStyle}>
          {/* Simulated Map Visual */}
          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center relative overflow-hidden rounded-lg border mb-4 shadow-inner">
             <div className="absolute inset-0 bg-gray-200 opacity-50">
                <div className="w-full h-full" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
             </div>
             <MapPin size={40} className="text-red-500 z-10 mb-2 drop-shadow-md" />
             <p className="z-10 font-bold text-gray-800 text-lg bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{content.locationName}</p>
          </div>

          {/* Address Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-3">
             <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                   <p className="text-xs text-gray-500 mb-1 font-medium">주소</p>
                   <p className="text-gray-800 text-sm">{content.address}</p>
                </div>
             </div>
          </div>

          {/* Map Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`https://map.naver.com/v5/search/${encodeURIComponent(content.address)}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-white border border-[#03C75A] text-[#03C75A] rounded-lg text-sm font-bold hover:bg-[#03C75A] hover:text-white transition-colors shadow-sm"
            >
               <MapPin size={16} /> 네이버지도
            </a>
            <a 
              href={`https://map.kakao.com/link/search/${encodeURIComponent(content.address)}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] text-[#191919] rounded-lg text-sm font-bold hover:bg-[#FDD835] transition-colors shadow-sm"
            >
               <MapPin size={16} /> 카카오맵
            </a>
          </div>
        </div>
      );

    case BlockType.FORM:
      return (
        <div style={containerStyle}>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {content.fields && content.fields.map((field: any) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input 
                  type={field.type} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                  disabled={!readOnly} 
                  placeholder={`${field.label} 입력`}
                />
              </div>
            ))}
            <button className="w-full bg-blue-600 text-white py-3 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors mt-4">
              {content.buttonText}
            </button>
          </form>
        </div>
      );

    case BlockType.SOCIAL:
        return (
            <div style={containerStyle}>
                <div className="flex flex-wrap justify-center gap-4">
                    {content.links && content.links.map((link: any) => {
                        let Icon = Globe;
                        let label = 'Link';
                        let colorClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';

                        if (link.platform === 'youtube') {
                            Icon = Youtube;
                            label = 'Youtube';
                            colorClass = 'bg-red-50 text-red-600 hover:bg-red-100';
                        } else if (link.platform === 'instagram') {
                            Icon = Instagram;
                            label = 'Instagram';
                            colorClass = 'bg-pink-50 text-pink-600 hover:bg-pink-100';
                        } else if (link.platform === 'kakao') {
                            Icon = MessageCircle;
                            label = 'Kakao';
                            colorClass = 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
                        } else if (link.platform === 'blog') {
                            Icon = BookOpen;
                            label = 'Blog';
                            colorClass = 'bg-green-50 text-green-600 hover:bg-green-100';
                        }

                        return (
                            <a 
                                key={link.id} 
                                href={link.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${colorClass}`}
                                title={label}
                            >
                                <Icon size={20} />
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    
    case BlockType.DIVIDER:
      return (
        <div style={{ padding: '10px 0' }}>
          <hr className="border-t border-gray-300" />
        </div>
      );

    default:
      return <div className="p-4 text-red-500">알 수 없는 블록 타입</div>;
  }
};

export default BlockRenderer;
