
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon } from './icons';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment }) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Current Look</h2>
      <div className="space-y-3">
        {outfitHistory.map((layer, index) => (
          <div
            key={layer.garment?.id || 'base'}
            className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-fade-in"
          >
            <div className="flex items-center overflow-hidden">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 mr-3 text-[10px] font-bold text-gray-400 bg-gray-50 rounded-full border border-gray-100">
                  {index + 1}
                </span>
                {layer.garment ? (
                    <img src={layer.garment.url} alt={layer.garment.name} className="flex-shrink-0 w-10 h-10 object-cover rounded-xl mr-3 border border-gray-50 shadow-inner" />
                ) : (
                  <div className="w-10 h-10 bg-gray-900 rounded-xl mr-3 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">BASE</span>
                  </div>
                )}
                <span className="font-bold text-sm text-gray-900 truncate" title={layer.garment?.name}>
                  {layer.garment ? layer.garment.name : 'Your AI Model'}
                </span>
            </div>
            {index > 0 && index === outfitHistory.length - 1 && (
               <button
                onClick={onRemoveLastGarment}
                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                aria-label={`Remove ${layer.garment?.name}`}
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        {outfitHistory.length === 1 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select garments below</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;
