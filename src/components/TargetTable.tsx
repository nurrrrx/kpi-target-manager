import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { CarModel, MonthData, KPIData, KPI_FIELDS } from '../types';
import { calculateYoYGrowth, getGrowthColor } from '../utils';

interface TargetTableProps {
  selectedModel: CarModel;
  months: MonthData[];
  getTargetData: (modelId: number, month: string) => Partial<KPIData>;
  getLastYearActual: (modelId: number, month: string) => Partial<KPIData>;
  updateTarget: (modelId: number, month: string, field: string, value: string) => void;
}

const TargetTable: React.FC<TargetTableProps> = ({
  selectedModel,
  months,
  getTargetData,
  getLastYearActual,
  updateTarget
}) => {
  const getGrowthIcon = (growth: string) => {
    const numGrowth = parseFloat(growth);
    if (numGrowth > 5) return <ArrowUp className="h-3 w-3 text-green-600" />;
    if (numGrowth < -5) return <ArrowDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-yellow-600" />;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-gray-200 p-3 text-left font-semibold text-gray-900">Month</th>
              {KPI_FIELDS.map(field => (
                <th key={field.key} className="border-b border-gray-200 p-3 text-center font-semibold text-gray-900 min-w-40">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-sm">{field.icon}</span>
                    <span className="text-xs">{field.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 grid grid-cols-2 gap-1">
                    <div>Target</div>
                    <div>Previous</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((month, index) => {
              const targetData = getTargetData(selectedModel.id, month.value);
              const lastYearData = getLastYearActual(selectedModel.id, month.value);
              
              return (
                <tr key={month.value} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border-b border-gray-200 p-3 font-medium text-gray-900">
                    <div>
                      <div className="text-sm font-semibold">{month.shortLabel}</div>
                      <div className="text-xs text-gray-500">{month.year}</div>
                    </div>
                  </td>
                  {KPI_FIELDS.map(field => {
                    const targetValue = targetData[field.key] || 0;
                    const lastYearValue = lastYearData[field.key] || 0;
                    const growth = calculateYoYGrowth(targetValue, lastYearValue);
                    
                    return (
                      <td key={field.key} className="border-b border-gray-200 p-2">
                        <div className="space-y-2">
                          <div>
                            <input
                              type="number"
                              value={targetValue}
                              onChange={(e) => updateTarget(selectedModel.id, month.value, field.key, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent font-semibold"
                              placeholder="Target"
                              min="0"
                            />
                          </div>
                          
                          <div className="bg-gray-100 p-2 rounded text-center">
                            <div className="text-xs text-gray-500 mb-1">Previous</div>
                            <div className="text-sm font-medium text-gray-700">
                              {lastYearValue.toLocaleString()}
                            </div>
                          </div>
                          
                          {targetValue > 0 && lastYearValue > 0 && (
                            <div className={`text-center p-1 rounded text-xs font-semibold ${getGrowthColor(growth)}`}>
                              <div className="flex items-center justify-center gap-1">
                                {getGrowthIcon(growth)}
                                <span>{parseFloat(growth) > 0 ? '+' : ''}{growth}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TargetTable;