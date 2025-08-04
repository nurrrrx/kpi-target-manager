// @ts-nocheck
import React, { useState } from 'react';
import { Plus, Car, Target, Search, ChevronDown } from 'lucide-react';

// Data imports
import modelsData from '../data/models.json';
import lastYearActualsData from '../data/lastYearActuals.json';

// Component imports
import ModelCard from './ModelCard';
import AddModelCard from './AddModelCard';
import TargetTable from './TargetTable';
import SummaryDashboard from './SummaryDashboard';

// Types and utils
import { CarModel, TargetData, LastYearActuals, KPIData, KPI_OPTIONS, TIME_PERIOD_OPTIONS } from '../types';
import { 
  getTargetKey, 
  getMonthsInRange, 
  get12MonthsData 
} from '../utils';

const KPITargetManager = () => {
  console.log('KPITargetManager rendering'); // Debug line
  
  // 🔍 DEBUG: Log model ID mappings for understanding
  console.log('📋 Available Models with IDs:');
  modelsData.forEach(model => {
    console.log(`  ID ${model.id}: ${model.name} (${model.category})`);
  });
  
  // 🔍 DEBUG: Log sample lastYearActuals keys
  console.log('🔑 Sample lastYearActuals keys:', Object.keys(lastYearActualsData).slice(0, 5));
  
  // 🔍 DEBUG: Log sample data structure
  const sampleKey = Object.keys(lastYearActualsData)[0];
  if (sampleKey) {
    console.log('📊 Sample data structure for key', sampleKey, ':', lastYearActualsData[sampleKey]);
  }

  const [models, setModels] = useState<CarModel[]>(modelsData);
  const [lastYearActuals] = useState<LastYearActuals>(lastYearActualsData);
  const [targets, setTargets] = useState<TargetData>({});
  const [selectedModel, setSelectedModel] = useState<CarModel | null>(null);
  const [selectedKPI, setSelectedKPI] = useState('Sessions');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Rolling 12');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('2024-08');
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Target Setting specific state (separate from top filters)
  const [targetBrand, setTargetBrand] = useState('');
  const [targetModel, setTargetModel] = useState('');
  
  // Date range selector
  const [startMonth, setStartMonth] = useState('2025-08');
  const [endMonth, setEndMonth] = useState('2026-07');

  const months = getMonthsInRange(startMonth, endMonth);

  // Get unique brands for filter
  const uniqueBrands = Array.from(new Set(models.map(model => model.category))).sort();

  // Handle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Handle model selection
  const toggleModel = (modelName: string) => {
    setSelectedModels(prev => 
      prev.includes(modelName) 
        ? prev.filter(m => m !== modelName)
        : [...prev, modelName]
    );
  };

  // Get filtered models for dropdown based on selected brands
  const getFilteredModelsForDropdown = () => {
    if (selectedBrands.length === 0) return models;
    return models.filter(model => selectedBrands.includes(model.category));
  };

  // Get filtered models for Target Setting dropdown based on target brand
  const getFilteredModelsForTargetSetting = () => {
    if (!targetBrand) return models;
    return models.filter(model => model.category === targetBrand);
  };

  const getTargetData = (modelId: number, month: string): Partial<KPIData> => {
    const key = getTargetKey(modelId, month);
    const data = targets[key] || {};
    
    // Extract only Target_ fields from the combined data
    return {
      Target_Sessions: data.Target_Sessions || 0,
      Target_Leads: data.Target_Leads || 0,
      Target_HotLeads: data.Target_HotLeads || 0,
      Target_Enquiries: data.Target_Enquiries || 0,
      Target_TestDrive: data.Target_TestDrive || 0,
      Target_Orders: data.Target_Orders || 0,
      Target_Invoices: data.Target_Invoices || 0
    };
  };

  const getLastYearActual = (modelId: number, month: string): Partial<KPIData> => {
    const key = getTargetKey(modelId, month);
    const data = lastYearActuals[key] || {};
    
    // Extract Actual_ fields and map them to Target_ field names for compatibility
    return {
      Target_Sessions: data.Actual_Sessions || 0,
      Target_Leads: data.Actual_Leads || 0,
      Target_HotLeads: data.Actual_HotLeads || 0,
      Target_Enquiries: data.Actual_Enquiries || 0,
      Target_TestDrive: data.Actual_TestDrive || 0,
      Target_Orders: data.Actual_Orders || 0,
      Target_Invoices: data.Actual_Invoices || 0
    };
  };

  const updateTarget = (modelId: number, month: string, field: string, value: string) => {
    const key = getTargetKey(modelId, month);
    setTargets(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const addModel = (name: string) => {
    const newModel: CarModel = {
      id: Math.max(...models.map(m => m.id), 0) + 1,
      name: name,
      category: 'Other' // Since we removed category input
    };
    setModels([...models, newModel]);
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(model.category);
    const matchesModel = selectedModels.length === 0 || selectedModels.includes(model.name);
    return matchesSearch && matchesBrand && matchesModel;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6" onClick={(e) => {
      // Close dropdowns when clicking outside
      if (!(e.target as Element).closest('.relative')) {
        setShowBrandDropdown(false);
        setShowModelDropdown(false);
      }
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-4">
            <span>Data Products</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Target Setup</span>
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 items-center mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search car model ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => {
                setShowBrandDropdown(false);
                setShowModelDropdown(false);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Brand Filter */}
          <div className="relative">
            <button 
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              onClick={() => {
                setShowBrandDropdown(!showBrandDropdown);
                setShowModelDropdown(false);
              }}
            >
              Brand ({selectedBrands.length}) <ChevronDown className="h-4 w-4" />
            </button>
            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {uniqueBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Models Filter */}
          <div className="relative">
            <button 
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              onClick={() => {
                setShowModelDropdown(!showModelDropdown);
                setShowBrandDropdown(false);
              }}
            >
              Models ({selectedModels.length}) <ChevronDown className="h-4 w-4" />
            </button>
            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {getFilteredModelsForDropdown().map(model => (
                  <label key={model.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.name)}
                      onChange={() => toggleModel(model.name)}
                      className="rounded"
                    />
                    <span className="text-sm">{model.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Month/Year Selector */}
          <div className="flex items-center gap-2">
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Statistics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>
          
          {/* KPI and Time Period Controls */}
          <div className="flex gap-4 items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">KPI:</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedKPI}
                onChange={(e) => setSelectedKPI(e.target.value)}
              >
                {KPI_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Time Period:</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedTimePeriod}
                onChange={(e) => setSelectedTimePeriod(e.target.value)}
              >
                {TIME_PERIOD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => {
              const chartData = get12MonthsData(model.id, lastYearActuals, targets, selectedKPI);
              const isSelected = selectedModel?.id === model.id;
              
              return (
                <ModelCard
                  key={model.id}
                  model={model}
                  chartData={chartData}
                  selectedKPI={selectedKPI}
                  selectedTimePeriod={selectedTimePeriod}
                  isSelected={isSelected}
                  onSelect={setSelectedModel}
                />
              );
            })}
            
            {/* Add New Model Card */}
            <AddModelCard
              showAddModel={showAddModel}
              onShowAddModel={setShowAddModel}
              onAddModel={addModel}
            />
          </div>
        </div>

        {/* Target Setting Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Target Setting</h2>
          
          {/* Date Range Settings */}
          <div className="bg-white rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={targetBrand}
                  onChange={(e) => {
                    setTargetBrand(e.target.value);
                    setTargetModel(''); // Reset model selection when brand changes
                    setSelectedModel(null);
                  }}
                >
                  <option value="">Select Brand</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={targetModel}
                  onChange={(e) => {
                    const selectedModelName = e.target.value;
                    setTargetModel(selectedModelName);
                    // Set selectedModel based on the selected model name
                    if (selectedModelName) {
                      const model = models.find(m => m.name === selectedModelName);
                      console.log('Looking for model:', selectedModelName); // Debug
                      console.log('Found model:', model); // Debug
                      console.log('All models:', models); // Debug
                      setSelectedModel(model || null);
                    } else {
                      setSelectedModel(null);
                    }
                  }}
                >
                  <option value="">Select Model</option>
                  {getFilteredModelsForTargetSetting().map(model => (
                    <option key={model.id} value={model.name}>{model.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                <input 
                  type="month" 
                  value={startMonth} 
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                <input 
                  type="month" 
                  value={endMonth} 
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Selected period: {months.length} months ({startMonth} to {endMonth})
            </div>
          </div>
          
          {selectedModel && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedModel.name} - Target Setting
                    </h3>
                    <p className="text-gray-600">Set targets with year-over-year comparison</p>
                  </div>
                  <button
                    onClick={() => {
                      // Handle save functionality with new data structure
                      console.log('💾 Saving targets for:', selectedModel.name, '(ID:', selectedModel.id, ')');
                      console.log('📊 Current targets data:', targets);
                      
                      // Show which months have data
                      const modelTargets = Object.keys(targets).filter(key => key.startsWith(`${selectedModel.id}-`));
                      console.log(`📅 Found ${modelTargets.length} months of target data for this model`);
                      
                      // Sample the data structure
                      if (modelTargets.length > 0) {
                        console.log('📈 Sample target entry:', modelTargets[0], '→', targets[modelTargets[0]]);
                      }
                      
                      alert(`Targets saved successfully for ${selectedModel.name}! Check console for details.`);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Target Setting Table */}
              <TargetTable
                selectedModel={selectedModel}
                months={months}
                getTargetData={getTargetData}
                getLastYearActual={getLastYearActual}
                updateTarget={updateTarget}
              />

              {/* Summary Dashboard */}
              <SummaryDashboard
                selectedModel={selectedModel}
                months={months}
                getTargetData={getTargetData}
                getLastYearActual={getLastYearActual}
              />
            </>
          )}

          {!selectedModel && (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select Brand and Model</h3>
              <p className="text-gray-500">Choose a brand and model above to start setting targets with performance insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPITargetManager;