import { Target, BarChart3, TrendingUp, Car } from 'lucide-react';
import { CarModel, MonthData, KPIData } from '../types';

interface SummaryDashboardProps {
  selectedModel: CarModel;
  months: MonthData[];
  getTargetData: (modelId: number, month: string) => Partial<KPIData>;
  getLastYearActual: (modelId: number, month: string) => Partial<KPIData>;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  selectedModel,
  months,
  getTargetData,
  getLastYearActual
}) => {
  const totalTargets = months.reduce((total, month) => {
    const monthTargets = getTargetData(selectedModel.id, month.value);
    return total + Object.values(monthTargets).reduce((sum: number, val: any) => sum + (val || 0), 0);
  }, 0);

  const totalActuals = months.reduce((total, month) => {
    const monthActuals = getLastYearActual(selectedModel.id, month.value);
    return total + Object.values(monthActuals).reduce((sum: number, val: any) => sum + (val || 0), 0);
  }, 0);

  const overallGrowth = totalActuals > 0 ? ((totalTargets - totalActuals) / totalActuals * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Total Targets</h3>
        </div>
        <div className="text-3xl font-bold">
          {totalTargets.toLocaleString()}
        </div>
        <div className="text-sm opacity-90">All KPIs planned</div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Previous Performance</h3>
        </div>
        <div className="text-3xl font-bold">
          {totalActuals.toLocaleString()}
        </div>
        <div className="text-sm opacity-90">Historical reference</div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Growth Target</h3>
        </div>
        <div className="text-3xl font-bold">
          {parseFloat(overallGrowth) > 0 ? '+' : ''}{overallGrowth}%
        </div>
        <div className="text-sm opacity-90">Overall growth</div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <Car className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Planning Period</h3>
        </div>
        <div className="text-3xl font-bold">{months.length}</div>
        <div className="text-sm opacity-90">Months selected</div>
      </div>
    </div>
  );
};

export default SummaryDashboard;