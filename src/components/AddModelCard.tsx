import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CAR_MODEL_OPTIONS } from '../types';

interface AddModelCardProps {
  showAddModel: boolean;
  onShowAddModel: (show: boolean) => void;
  onAddModel: (name: string) => void;
}

const AddModelCard: React.FC<AddModelCardProps> = ({
  showAddModel,
  onShowAddModel,
  onAddModel
}) => {
  const [selectedModelOption, setSelectedModelOption] = useState('');
  const [customModelName, setCustomModelName] = useState('');

  const handleAdd = () => {
    let modelName = '';
    
    if (selectedModelOption === 'custom') {
      modelName = customModelName.trim();
    } else {
      const selectedOption = CAR_MODEL_OPTIONS.find(option => option.id === selectedModelOption);
      modelName = selectedOption?.name || '';
    }
    
    if (modelName) {
      onAddModel(modelName);
      setSelectedModelOption('');
      setCustomModelName('');
      onShowAddModel(false);
    }
  };

  const handleCancel = () => {
    setSelectedModelOption('');
    setCustomModelName('');
    onShowAddModel(false);
  };

  if (!showAddModel) {
    return (
      <div 
        className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 shadow-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center min-h-48"
        onClick={() => onShowAddModel(true)}
      >
        <Plus className="h-12 w-12 text-gray-400 mb-3" />
        <span className="text-gray-500 font-medium">Add Model</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-blue-300 p-6 shadow-sm min-h-48">
      <div className="space-y-3">
        <select
          value={selectedModelOption}
          onChange={(e) => setSelectedModelOption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          autoFocus
        >
          <option value="">Select a model...</option>
          {CAR_MODEL_OPTIONS.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        
        {selectedModelOption === 'custom' && (
          <input
            type="text"
            placeholder="Enter custom model name"
            value={customModelName}
            onChange={(e) => setCustomModelName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={!selectedModelOption || (selectedModelOption === 'custom' && !customModelName.trim())}
            className="flex-1 p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 p-3 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModelCard;