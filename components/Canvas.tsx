import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockData } from '../types';
import BlockRenderer from './BlockRenderer';

interface Props {
  blocks: BlockData[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onReorderBlocks: (activeId: string, overId: string) => void;
  themeColor: string;
}

interface SortableBlockItemProps {
  block: BlockData;
  isSelected: boolean;
  onClick: () => void;
}

// Sortable Item Wrapper
const SortableBlockItem: React.FC<SortableBlockItemProps> = ({ block, isSelected, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={(e) => {
        // Ensure click propagates if not dragging
        onClick();
      }}
      className={`relative cursor-pointer group touch-none transition-all duration-200 mb-2 rounded-sm
        ${isSelected 
          ? 'ring-2 ring-blue-500 z-10' 
          : 'hover:ring-1 hover:ring-blue-300 border border-transparent hover:bg-gray-50'
        }`}
    >
      <BlockRenderer block={block} />
      {/* Overlay to prevent iframe interaction while dragging/selecting */}
      <div className="absolute inset-0 bg-transparent z-10" /> 
    </div>
  );
};

const Canvas: React.FC<Props> = ({ blocks, selectedBlockId, onSelectBlock, onReorderBlocks, themeColor }) => {
  const sensors = useSensors(
    // Add activation constraint (distance) so simple clicks are not interpreted as drags
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderBlocks(active.id as string, over.id as string);
    }
  };

  return (
    <div 
      className="flex-1 bg-gray-100 flex items-start justify-center py-8 overflow-y-auto min-h-0 cursor-default"
      onClick={() => onSelectBlock(null)} // Deselect when clicking background
    >
      {/* Mobile Frame */}
      <div 
        className="relative bg-white w-[375px] min-h-[667px] shadow-2xl rounded-3xl overflow-hidden border-[8px] border-gray-800 flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent deselect when clicking phone
      >
        {/* Status Bar Mockup */}
        <div className="h-6 bg-gray-800 w-full flex justify-between items-center px-4 text-[10px] text-white font-medium select-none z-20">
            <span>9:41</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full border border-white opacity-50"></div>
                <div className="w-3 h-3 rounded-full border border-white opacity-50"></div>
                <div className="w-4 h-2.5 border border-white rounded-[2px]"></div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white relative">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(b => b.id)} 
              strategy={verticalListSortingStrategy}
            >
              {blocks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                  <p>블록을 추가하여<br/>콘텐츠를 만들어보세요.</p>
                </div>
              ) : (
                <div className="pb-10 min-h-full">
                    {blocks.map((block) => (
                    <SortableBlockItem 
                        key={block.id} 
                        block={block} 
                        isSelected={selectedBlockId === block.id}
                        onClick={() => onSelectBlock(block.id)}
                    />
                    ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default Canvas;