/**
 * Modelos TypeScript para la aplicación ExtractReq
 * Basados en las respuestas del backend FastAPI
 */

// Subcaracterísticas de Seguridad ISO 25010
export enum SecuritySubcharacteristic {
  AUTENTICIDAD = 'Autenticidad',
  CONFIDENCIALIDAD = 'Confidencialidad',
  INTEGRIDAD = 'Integridad',
  RESPONSABILIDAD = 'Responsabilidad',
  NO_REPUDIO = 'No-Repudio',
  RESISTENCIA = 'Resistencia'
}

// Información detallada de cada subcaracterística
export interface ISO25010Info {
  name: string;
  description: string;
  examples: string[];
  icon?: string; // Placeholder para icono
}

// Requisito de seguridad procesado
export interface SecurityRequirement {
  comment: string;
  subcharacteristic: string;
  description: string;
  binary_score?: number;
  multiclass_score?: number;
}

// Estadísticas de procesamiento (para Play Store URL)
export interface ProcessingStats {
  comments_processed: number;
  requirements_found: number;
  total_requirements_detected: number;
  success_rate: number;
  target: number;
}

// Respuesta del endpoint de comentario único
export interface SingleCommentResponse {
  // El backend retorna un PDF directamente
  pdf: Blob;
}

// Respuesta del endpoint de CSV
export interface CSVResponse {
  // El backend retorna un PDF directamente
  pdf: Blob;
}

// Respuesta del endpoint de Play Store
export interface PlayStoreResponse {
  // El backend retorna un PDF directamente
  pdf: Blob;
}

// Request para comentario único
export interface SingleCommentRequest {
  comment: string;
}

// Request para Play Store URL
export interface PlayStoreURLRequest {
  url: string;
}

// Estado de procesamiento
export interface ProcessingState {
  loading: boolean;
  progress?: number;
  message?: string;
  error?: string;
  results?: ProcessingResponse;
  showResults?: boolean;
  pdfBlob?: Blob;
  pdfFileName?: string;
}

// ============ NUEVOS MODELOS PARA VISUALIZACIÓN DE RESULTADOS ============

// Resultado individual de requisito (JSON del backend)
export interface RequirementResult {
  comment: string;
  is_requirement: boolean;
  subcharacteristic: string | null;
  description: string | null;
  binary_score: number;
  multiclass_score: number | null;
}

// Respuesta completa del procesamiento (JSON del backend)
export interface ProcessingResponse {
  total_comments: number;
  valid_requirements: number;
  requirements: RequirementResult[];
  processing_time_ms: number;
  source_type: 'single' | 'csv' | 'playstore';
}

// Estadísticas por subcaracterística para gráficos
export interface SubcharacteristicStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

// Colores para cada subcaracterística
export const SUBCHARACTERISTIC_COLORS: Record<string, string> = {
  'Autenticidad': '#667eea',
  'Confidencialidad': '#f093fb',
  'Integridad': '#4facfe',
  'Responsabilidad': '#43e97b',
  'No-Repudio': '#fa709a',
  'Resistencia': '#feca57'
};

// Iconos SVG para cada subcaracterística (SVG paths)
export const SUBCHARACTERISTIC_ICONS: Record<string, string> = {
  'Autenticidad': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
  'Confidencialidad': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />',
  'Integridad': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
  'Responsabilidad': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />',
  'No-Repudio': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />',
  'Resistencia': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />'
};
