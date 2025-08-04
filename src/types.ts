export interface CarModel {
  id: number;
  name: string;
  category: string;
}

export interface KPIData {
  Target_Sessions: number;
  Target_Leads: number;
  Target_HotLeads: number;
  Target_Enquiries: number;
  Target_TestDrive: number;
  Target_Orders: number;
  Target_Invoices: number;
}

// New interface for combined Target and Actual data
export interface CombinedKPIData {
  Target_Sessions: number;
  Target_Leads: number;
  Target_HotLeads: number;
  Target_Enquiries: number;
  Target_TestDrive: number;
  Target_Orders: number;
  Target_Invoices: number;
  Actual_Sessions: number;
  Actual_Leads: number;
  Actual_HotLeads: number;
  Actual_Enquiries: number;
  Actual_TestDrive: number;
  Actual_Orders: number;
  Actual_Invoices: number;
}

export interface KPIField {
  key: keyof KPIData;
  label: string;
  icon: string;
  color: string;
}

export interface MonthData {
  value: string;
  label: string;
  shortLabel: string;
  year: number;
}

export interface ChartDataPoint {
  month: string;
  Actual: number;
  Target: number;
}

export interface TargetData {
  [key: string]: KPIData;
}

// Updated to use CombinedKPIData for lastYearActuals
export interface LastYearActuals {
  [key: string]: CombinedKPIData;
}

export interface ModelOption {
  id: string;
  name: string;
}

export const CAR_MODEL_OPTIONS: ModelOption[] = [
  { id: 'toyota-camry', name: 'Toyota Camry' },
  { id: 'toyota-rav4', name: 'Toyota RAV4' },
  { id: 'toyota-prius', name: 'Toyota Prius' },
  { id: 'toyota-corolla', name: 'Toyota Corolla' },
  { id: 'honda-civic', name: 'Honda Civic' },
  { id: 'honda-cr-v', name: 'Honda CR-V' },
  { id: 'nissan-altima', name: 'Nissan Altima' },
  { id: 'mazda-cx-5', name: 'Mazda CX-5' },
  { id: 'subaru-outback', name: 'Subaru Outback' },
  { id: 'hyundai-elantra', name: 'Hyundai Elantra' },
  { id: 'bmw-3-series', name: 'BMW 3 Series' },
  { id: 'mercedes-c-class', name: 'Mercedes C-Class' },
  { id: 'audi-a4', name: 'Audi A4' },
  { id: 'lexus-es', name: 'Lexus ES' },
  { id: 'infiniti-q50', name: 'Infiniti Q50' },
  { id: 'custom', name: 'Enter custom model...' }
];

export const KPI_FIELDS: KPIField[] = [
  { key: 'Target_Sessions', label: 'Sessions', icon: '👥', color: 'bg-blue-500' },
  { key: 'Target_Leads', label: 'Leads', icon: '📧', color: 'bg-green-500' },
  { key: 'Target_HotLeads', label: 'Hot Leads', icon: '🔥', color: 'bg-red-500' },
  { key: 'Target_Enquiries', label: 'Enquiries', icon: '💬', color: 'bg-purple-500' },
  { key: 'Target_TestDrive', label: 'Test Drives', icon: '🚗', color: 'bg-yellow-500' },
  { key: 'Target_Orders', label: 'Orders', icon: '📋', color: 'bg-indigo-500' },
  { key: 'Target_Invoices', label: 'Invoices', icon: '💰', color: 'bg-emerald-500' }
];

export const TIME_PERIOD_OPTIONS = [
  { value: 'YTD', label: 'YTD' },
  { value: 'QTD', label: 'QTD' },
  { value: 'MTD', label: 'MTD' },
  { value: 'YOY', label: 'YOY' },
  { value: 'QOQ', label: 'QOQ' },
  { value: 'MOM', label: 'MOM' },
  { value: 'Rolling 12', label: 'Rolling 12 months' },
  { value: 'Rolling 6', label: 'Rolling 6 months' },
  { value: 'Rolling 3', label: 'Rolling 3 months' }
];

export const KPI_OPTIONS = [
  { value: 'Sessions', label: 'Sessions' },
  { value: 'Leads', label: 'Leads' },
  { value: 'Hot Leads', label: 'Hot Leads' },
  { value: 'Enquiries', label: 'Enquiries' },
  { value: 'Test Drives', label: 'Test Drives' },
  { value: 'Orders', label: 'Orders' },
  { value: 'Invoices', label: 'Invoices' }
];