import { ISO25010Info } from '../models/requirement.model';

/**
 * Información detallada sobre ISO 25010 y sus subcaracterísticas de seguridad
 */

export const ISO25010_SECURITY_SUBCHARACTERISTICS: ISO25010Info[] = [
  {
    name: 'Confidencialidad',
    description: 'Garantiza que los datos solo sean accesibles por usuarios autorizados. Protege la información sensible contra accesos no autorizados.',
    examples: [
      'Cifrado de datos en tránsito y en reposo',
      'Control de acceso basado en roles (RBAC)',
      'Protección de credenciales y tokens',
      'Políticas de privacidad de datos personales'
    ],
    icon: 'confidentiality-icon.svg' // Placeholder
  },
  {
    name: 'Integridad',
    description: 'Asegura que los datos no sean modificados de manera no autorizada. Garantiza la exactitud y completitud de la información.',
    examples: [
      'Validación de datos de entrada',
      'Checksums y hash de archivos',
      'Protección contra inyección SQL',
      'Firmas digitales en transacciones'
    ],
    icon: 'integrity-icon.svg' // Placeholder
  },
  {
    name: 'No Repudio',
    description: 'Garantiza que una acción realizada no pueda ser negada posteriormente. Proporciona evidencia de acciones y transacciones.',
    examples: [
      'Logs de auditoría inmutables',
      'Firmas digitales en documentos',
      'Registro de timestamps en operaciones',
      'Trazabilidad completa de transacciones'
    ],
    icon: 'non-repudiation-icon.svg' // Placeholder
  },
  {
    name: 'Responsabilidad',
    description: 'Asegura que las acciones de un usuario puedan ser rastreadas de manera única. Permite identificar quién hizo qué y cuándo.',
    examples: [
      'Logs de actividad de usuarios',
      'Registro de accesos al sistema',
      'Identificación única de sesiones',
      'Auditoría de cambios en datos críticos'
    ],
    icon: 'accountability-icon.svg' // Placeholder
  },
  {
    name: 'Autenticidad',
    description: 'Verifica la identidad de usuarios y la procedencia de datos. Garantiza que las entidades son quienes dicen ser.',
    examples: [
      'Autenticación de dos factores (2FA)',
      'Verificación biométrica',
      'Certificados digitales',
      'OAuth y SSO (Single Sign-On)'
    ],
    icon: 'authenticity-icon.svg' // Placeholder
  },
  {
    name: 'Resistencia',
    description: 'Capacidad del sistema para resistir ataques y mantener funcionalidad bajo condiciones adversas o maliciosas.',
    examples: [
      'Protección contra DDoS',
      'Rate limiting en APIs',
      'Validación y sanitización de entradas',
      'Recuperación ante fallos de seguridad'
    ],
    icon: 'resilience-icon.svg' // Placeholder
  }
];

export const ISO25010_OVERVIEW = {
  title: 'ISO/IEC 25010 - Calidad de Producto de Software',
  description: `
    La norma ISO/IEC 25010 es un estándar internacional que define un modelo de calidad
    para productos de software y sistemas informáticos. Esta norma es parte de la familia
    SQuaRE (System and Software Quality Requirements and Evaluation).
  `,
  securityDescription: `
    La característica de Seguridad en ISO 25010 se enfoca en proteger la información y
    los datos del sistema de manera que solo usuarios y sistemas autorizados puedan
    acceder, modificar o revelar información de acuerdo con su nivel de autorización.
  `,
  benefits: [
    'Estandarización de requisitos de seguridad',
    'Mejora en la calidad del software',
    'Facilita la evaluación y comparación de productos',
    'Reduce riesgos de seguridad desde el diseño',
    'Alineación con regulaciones de privacidad y seguridad'
  ],
  reference: 'ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models'
};
