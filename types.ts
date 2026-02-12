export interface Supplement {
  name: string;
  reason: string;
  dosage: string;
}

export interface AnalysisReport {
  pharmacistAnalysis: string;
  recommendedSupplements: Supplement[];
  synergyInsight: string;
  precautions: string;
  financialInsight: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}
