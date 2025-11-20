
import React, { useState, useEffect, useCallback } from 'react';
import { BlockData, BlockType, Project, TemplateType, BlockStyle } from './types';
import { ICON_MAP, BLOCK_LABELS, INITIAL_BLOCKS } from './constants';
import { saveProject, getProjects, deleteProject, getProjectById } from './services/storageService';
import { Plus, Layout, Share2, ArrowLeft, Lock, Eye } from 'lucide-react';
import Canvas from './components/Canvas';
import PropertyPanel from './components/PropertyPanel';
import BlockRenderer from './components/BlockRenderer';
import { arrayMove } from '@dnd-kit/sortable';

// --- Sub-components defined here to keep file count low per instructions ---

const Dashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectType, setNewProjectType] = useState<TemplateType>('NEWSLETTER');
  const [newProjectPassword, setNewProjectPassword] = useState('');
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    setProjects(getProjects().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleCreate = () => {
    if (!newProjectTitle) return alert('제목을 입력하세요.');
    const newProject: Project = {
      id: Date.now().toString(),
      title: newProjectTitle,
      type: newProjectType,
      password: newProjectPassword || undefined,
      blocks: INITIAL_BLOCKS[newProjectType], // Deep copy recommended in real app
      createdAt: Date.now(),
      themeColor: '#3b82f6'
    };
    saveProject(newProject);
    setProjects(getProjects().sort((a, b) => b.createdAt - a.createdAt));
    setCreateModalOpen(false);
    setNewProjectTitle('');
    setNewProjectPassword('');
    onNavigate(`#editor/${newProject.id}`);
  };

  const handleDelete = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project?.password && passwordInput !== project.password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeletePromptId(null);
    setPasswordInput('');
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">WelfareOne Maker</h1>
            <p className="text-gray-500 mt-1">복지관 모바일 콘텐츠 제작 플랫폼</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={20} /> 새 프로젝트 만들기
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => onNavigate(`#view/${project.id}`)}
                 className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
                 title="미리보기"
               >
                 <Eye size={16} />
               </button>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{
              backgroundColor: project.type === 'INVITATION' ? '#ecfdf5' : project.type === 'NEWSLETTER' ? '#eff6ff' : '#fef3c7',
              color: project.type === 'INVITATION' ? '#047857' : project.type === 'NEWSLETTER' ? '#1d4ed8' : '#b45309'
            }}>
              {project.type === 'INVITATION' ? '초대장' : project.type === 'NEWSLETTER' ? '뉴스레터' : '홍보'}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.title}</h3>
            <p className="text-sm text-gray-400 mb-6">생성일: {new Date(project.createdAt).toLocaleDateString()}</p>
            
            <div className="flex gap-2 mt-auto">
              <button 
                onClick={() => onNavigate(`#editor/${project.id}`)}
                className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                편집하기
              </button>
              <button 
                onClick={() => setDeletePromptId(project.id)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                삭제
              </button>
            </div>

            {/* Delete Confirm Overlay */}
            {deletePromptId === project.id && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center p-4 z-10">
                 <p className="text-sm font-bold text-gray-800 mb-2">삭제하시겠습니까?</p>
                 {project.password && (
                   <input 
                    type="password" 
                    placeholder="비밀번호 4자리" 
                    className="border p-2 rounded text-sm w-full mb-2"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    maxLength={4}
                   />
                 )}
                 <div className="flex gap-2 w-full">
                   <button onClick={() => {setDeletePromptId(null); setPasswordInput('');}} className="flex-1 py-2 text-xs border rounded">취소</button>
                   <button onClick={() => handleDelete(project.id)} className="flex-1 py-2 text-xs bg-red-500 text-white rounded">확인</button>
                 </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <Layout size={48} className="mb-4 opacity-20" />
                <p>아직 생성된 콘텐츠가 없습니다.</p>
            </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">새 프로젝트 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="예: 5월 가정의달 행사 초대"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NEWSLETTER', 'PROMOTION', 'INVITATION'] as TemplateType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewProjectType(t)}
                      className={`py-2 px-1 rounded border text-sm font-medium transition-colors ${newProjectType === t ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      {t === 'NEWSLETTER' ? '뉴스레터' : t === 'PROMOTION' ? '홍보' : '초대장'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 (선택, 삭제 방지용)</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProjectPassword}
                  onChange={(e) => setNewProjectPassword(e.target.value)}
                  placeholder="숫자 4자리"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setCreateModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">생성하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PublishedView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProjectById(projectId);
    if (p) setProject(p);
  }, [projectId]);

  if (!project) return <div className="p-10 text-center">존재하지 않는 페이지입니다.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl">
         {project.blocks.map(block => (
           <BlockRenderer key={block.id} block={block} readOnly={true} />
         ))}
         <div className="p-8 text-center text-gray-400 text-xs pb-20">
           Powered by WelfareOne
         </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Routing Logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setRoute(hash);
      
      if (hash.startsWith('#editor/')) {
        const id = hash.split('/')[1];
        setCurrentProjectId(id);
        const proj = getProjectById(id);
        if (proj) {
            setCurrentProject(proj);
        } else {
            window.location.hash = '#';
        }
      } else if (hash.startsWith('#view/')) {
         // View handling handled by component rendering
      } else {
        setCurrentProjectId(null);
        setCurrentProject(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-save
  useEffect(() => {
    if (currentProject) {
      saveProject(currentProject);
    }
  }, [currentProject]);

  const addBlock = (type: BlockType) => {
    if (!currentProject) return;
    
    const defaultStyle: BlockStyle = { padding: '16px', backgroundColor: '#ffffff' };
    let content: any = {};

    switch(type) {
      case BlockType.HEADER: content = { text: '새로운 제목' }; defaultStyle.fontSize = '1.5rem'; defaultStyle.fontWeight = 'bold'; break;
      case BlockType.TEXT: content = { text: '내용을 입력하세요.' }; break;
      case BlockType.IMAGE: content = { url: '', alt: '' }; defaultStyle.padding = '0px'; break;
      case BlockType.VIDEO: content = { url: '' }; break;
      case BlockType.SCHEDULE: content = { title: '일정 제목', startDate: '', endDate: '', location: '' }; break;
      case BlockType.BUSINESS_INFO: 
        content = { 
          title: '사업 안내', 
          description: '사업에 대한 자세한 설명을 입력하세요.',
          items: [
            {id: '1', label: '이용 대상', value: '누구나'},
            {id: '2', label: '이용료', value: '무료'}
          ] 
        }; 
        break;
      case BlockType.MAP: content = { locationName: '장소명', address: '주소 입력' }; defaultStyle.padding = '0px'; break;
      case BlockType.FORM: content = { buttonText: '제출하기', fields: [{id: '1', label: '이름', type: 'text'}] }; break;
      case BlockType.SOCIAL: content = { links: [{id: '1', platform: 'website', url: ''}] }; defaultStyle.textAlign = 'center'; break;
      case BlockType.DIVIDER: content = {}; break;
    }

    const newBlock: BlockData = {
      id: Date.now().toString(),
      type,
      content,
      styles: defaultStyle
    };

    const updatedBlocks = [...currentProject.blocks, newBlock];
    setCurrentProject({ ...currentProject, blocks: updatedBlocks });
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, data: Partial<BlockData>) => {
    if (!currentProject) return;
    const updatedBlocks = currentProject.blocks.map(b => b.id === id ? { ...b, ...data } : b);
    setCurrentProject({ ...currentProject, blocks: updatedBlocks });
  };

  const deleteBlock = (id: string) => {
    if (!currentProject) return;
    const updatedBlocks = currentProject.blocks.filter(b => b.id !== id);
    setCurrentProject({ ...currentProject, blocks: updatedBlocks });
    setSelectedBlockId(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    if (!currentProject) return;
    const index = currentProject.blocks.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentProject.blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedBlocks = arrayMove(currentProject.blocks, index, targetIndex);
    setCurrentProject({ ...currentProject, blocks: updatedBlocks });
  };

  const handleReorderDrag = (activeId: string, overId: string) => {
      if (!currentProject) return;
      const oldIndex = currentProject.blocks.findIndex(b => b.id === activeId);
      const newIndex = currentProject.blocks.findIndex(b => b.id === overId);
      const updatedBlocks = arrayMove(currentProject.blocks, oldIndex, newIndex);
      setCurrentProject({ ...currentProject, blocks: updatedBlocks });
  };

  const handleShare = () => {
      // Optimize sharing URL for GitHub Pages (supports subdirectories)
      const baseUrl = window.location.href.split('#')[0];
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const url = `${cleanBaseUrl}/#view/${currentProject?.id}`;
      navigator.clipboard.writeText(url);
      alert('공유 링크가 클립보드에 복사되었습니다: ' + url);
  };

  // --- Rendering ---

  if (route.startsWith('#view/')) {
    const id = route.split('/')[1];
    return <PublishedView projectId={id} />;
  }

  if (route.startsWith('#editor') && currentProject) {
    const selectedBlock = currentProject.blocks.find(b => b.id === selectedBlockId) || null;

    return (
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Editor Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.hash = '#'} className="text-gray-500 hover:text-gray-800"><ArrowLeft /></button>
            <div>
                <h1 className="font-bold text-gray-800 text-lg">{currentProject.title}</h1>
                <span className="text-xs text-gray-400">자동 저장됨</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
                <Share2 size={16} /> 발행/공유
            </button>
          </div>
        </header>

        {/* Editor Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Blocks */}
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col z-10 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-bold text-sm text-gray-500 mb-4 uppercase tracking-wider">블록 추가</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(BLOCK_LABELS).map((key) => {
                  const type = key as BlockType;
                  const Icon = ICON_MAP[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                    >
                      <Icon className="mb-2 text-gray-500 group-hover:text-blue-500" size={24} />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">{BLOCK_LABELS[type]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center: Canvas */}
          <Canvas 
            blocks={currentProject.blocks} 
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onReorderBlocks={handleReorderDrag}
            themeColor={currentProject.themeColor}
          />

          {/* Right: Properties */}
          <PropertyPanel 
            selectedBlock={selectedBlock}
            updateBlock={updateBlock}
            deleteBlock={deleteBlock}
            moveBlock={moveBlock}
          />
        </div>
      </div>
    );
  }

  // Default: Dashboard
  return <Dashboard onNavigate={(path) => window.location.hash = path} />;
};

export default App;
