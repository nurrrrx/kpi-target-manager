import { MonthData, ChartDataPoint, KPIData, LastYearActuals, TargetData } from './types';

export const getTargetKey = (modelId: number, month: string): string => `${modelId}-${month}`;

export const calculateYoYGrowth = (target: number, lastYearActual: number): string => {
  if (!lastYearActual || lastYearActual === 0) return '0.0';
  return ((target - lastYearActual) / lastYearActual * 100).toFixed(1);
};

export const getGrowthColor = (growth: string): string => {
  const numGrowth = parseFloat(growth);
  if (numGrowth > 10) return 'text-green-700 bg-green-100';
  if (numGrowth > 0) return 'text-green-600 bg-green-50';
  if (numGrowth > -10) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export const getMonthsInRange = (start: string, end: string): MonthData[] => {
  const months = [];
  const startDate = new Date(start + '-01');
  const endDate = new Date(end + '-01');
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push({
      value: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
      label: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      shortLabel: currentDate.toLocaleDateString('en-US', { month: 'short' }),
      year: currentDate.getFullYear()
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

export const generateMonthYearOptions = () => {
  const options = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = currentYear; year <= currentYear + 3; year++) {
    for (let month = 1; month <= 12; month++) {
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
  }
  return options;
};

export const get12MonthsData = (
  modelId: number, 
  lastYearActuals: LastYearActuals, 
  targets: TargetData,
  selectedKPI: string = 'Sessions'
): ChartDataPoint[] => {
  const chartData = [];
  const currentDate = new Date();
  
  for (let i = -11; i <= 0; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const dataKey = `${modelId}-${monthKey}`;
    
    // Get data from lastYearActuals (which now contains both Target_ and Actual_ fields)
    const historicalData = lastYearActuals[dataKey];
    const currentTargets = targets[dataKey];
    
    // Map KPI selection to data field names
    const actualField = `Actual_${selectedKPI}` as keyof typeof historicalData;
    const targetField = `Target_${selectedKPI}` as keyof typeof historicalData;
    
    // Get actual from historical data (Actual_ fields)
    const actual = historicalData?.[actualField] || 0;
    
    // Get target from either current targets or historical targets as fallback
    const target = currentTargets?.[targetField as keyof KPIData] || 
                   historicalData?.[targetField] || 
                   actual * 1.1; // Default to 10% above actual if no target
    
    chartData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      Actual: Number(actual),
      Target: Number(target)
    });
  }
  return chartData;
};

export const calculateAverageDelta = (
  chartData: ChartDataPoint[]
): { delta: number; isPositive: boolean } => {
  if (chartData.length === 0) return { delta: 0, isPositive: true };
  
  const totalDelta = chartData.reduce((sum, point) => {
    if (point.Actual === 0) return sum;
    return sum + ((point.Target - point.Actual) / point.Actual * 100);
  }, 0);
  
  const avgDelta = totalDelta / chartData.length;
  return {
    delta: Math.abs(avgDelta),
    isPositive: avgDelta >= 0
  };
};

export const formatDelta = (delta: number, isPositive: boolean): string => {
  const sign = isPositive ? '+' : '-';
  return `${sign}${delta.toFixed(1)}%`;
};

export const getDeltaColorClass = (isPositive: boolean): string => {
  return isPositive ? 'text-green-600' : 'text-red-600';
};