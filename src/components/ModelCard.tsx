import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { CarModel, ChartDataPoint } from '../types';
import { calculateAverageDelta, formatDelta, getDeltaColorClass } from '../utils';

interface ModelCardProps {
  model: CarModel;
  chartData: ChartDataPoint[];
  selectedKPI: string;
  selectedTimePeriod: string;
  isSelected: boolean;
  onSelect: (model: CarModel) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  chartData,
  selectedKPI,
  selectedTimePeriod,
  isSelected,
  onSelect
}) => {
  const { delta, isPositive } = calculateAverageDelta(chartData);
  const deltaText = formatDelta(delta, isPositive);
  const deltaColorClass = getDeltaColorClass(isPositive);

  return (
    <div 
      className={`bg-white rounded-xl border-2 p-6 shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}  
      onClick={() => onSelect(model)}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-700 mb-2">{model.name}</h3>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">Actuals vs Target</p>
          <span className={`font-bold text-sm ${deltaColorClass}`}>
            {deltaText}
          </span>
        </div>
        <div className="h-32 bg-gray-50 rounded">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis hide />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="Actual" 
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="Target" 
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;