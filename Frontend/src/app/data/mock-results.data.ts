import { ProcessingResponse } from '../models/requirement.model';

/**
 * Datos de ejemplo para demostración del dashboard
 * Simula resultados de un procesamiento real
 */

export const MOCK_SINGLE_COMMENT_RESULT: ProcessingResponse = {
  total_comments: 1,
  valid_requirements: 1,
  processing_time_ms: 1234.56,
  source_type: 'single',
  requirements: [
    {
      comment: 'La aplicación debería implementar autenticación de dos factores para mayor seguridad',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar un mecanismo de autenticación de dos factores (2FA) que permita a los usuarios verificar su identidad mediante un segundo factor además de la contraseña.',
      binary_score: 0.9523,
      multiclass_score: 0.8756
    }
  ]
};

export const MOCK_CSV_RESULT: ProcessingResponse = {
  total_comments: 25,
  valid_requirements: 12,
  processing_time_ms: 5234.78,
  source_type: 'csv',
  requirements: [
    {
      comment: 'Necesito que la app encripte mis datos personales',
      is_requirement: true,
      subcharacteristic: 'Confidencialidad',
      description: 'El sistema debe implementar cifrado de extremo a extremo para proteger los datos personales del usuario, garantizando que la información sensible esté protegida tanto en tránsito como en reposo.',
      binary_score: 0.9234,
      multiclass_score: 0.8923
    },
    {
      comment: 'La app debe verificar la identidad del usuario antes de permitir cambios',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar un proceso de verificación de identidad antes de autorizar modificaciones en la configuración o datos del usuario.',
      binary_score: 0.8945,
      multiclass_score: 0.8234
    },
    {
      comment: 'Quiero que haya un registro de todas las operaciones que hago',
      is_requirement: true,
      subcharacteristic: 'Responsabilidad',
      description: 'El sistema debe mantener un registro de auditoría completo de todas las operaciones realizadas por el usuario, incluyendo timestamp, acción realizada e identificador único del usuario.',
      binary_score: 0.9123,
      multiclass_score: 0.8567
    },
    {
      comment: 'Los datos no deberían poder ser modificados sin autorización',
      is_requirement: true,
      subcharacteristic: 'Integridad',
      description: 'El sistema debe implementar controles de acceso y validación para prevenir modificaciones no autorizadas de datos, incluyendo checksums y validación de integridad.',
      binary_score: 0.8834,
      multiclass_score: 0.8112
    },
    {
      comment: 'Necesito prueba de que realicé una transacción específica',
      is_requirement: true,
      subcharacteristic: 'No-Repudio',
      description: 'El sistema debe proporcionar evidencia irrefutable de las transacciones realizadas mediante firmas digitales y registros de auditoría inmutables.',
      binary_score: 0.9456,
      multiclass_score: 0.9012
    },
    {
      comment: 'La aplicación debe protegerse contra intentos de hackeo',
      is_requirement: true,
      subcharacteristic: 'Resistencia',
      description: 'El sistema debe implementar mecanismos de defensa contra ataques maliciosos, incluyendo rate limiting, validación de entradas y detección de patrones de ataque.',
      binary_score: 0.8923,
      multiclass_score: 0.8456
    },
    {
      comment: 'Mis contraseñas deben estar protegidas',
      is_requirement: true,
      subcharacteristic: 'Confidencialidad',
      description: 'El sistema debe almacenar las contraseñas utilizando algoritmos de hashing robustos (bcrypt, Argon2) y nunca almacenarlas en texto plano.',
      binary_score: 0.9012,
      multiclass_score: 0.8734
    },
    {
      comment: 'Solo yo debería poder acceder a mi perfil',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar controles de autenticación y autorización que garanticen que solo el usuario autorizado pueda acceder a su perfil personal.',
      binary_score: 0.8767,
      multiclass_score: 0.8345
    },
    {
      comment: 'Quiero saber quién accedió a mi cuenta',
      is_requirement: true,
      subcharacteristic: 'Responsabilidad',
      description: 'El sistema debe mantener un registro de todos los accesos a la cuenta, incluyendo dirección IP, dispositivo, ubicación y timestamp.',
      binary_score: 0.9234,
      multiclass_score: 0.8901
    },
    {
      comment: 'Los datos no deben ser alterados durante la transmisión',
      is_requirement: true,
      subcharacteristic: 'Integridad',
      description: 'El sistema debe implementar checksums y validación de integridad para garantizar que los datos no sean modificados durante la transmisión.',
      binary_score: 0.8912,
      multiclass_score: 0.8234
    },
    {
      comment: 'Necesito confirmación firmada de mis pedidos',
      is_requirement: true,
      subcharacteristic: 'No-Repudio',
      description: 'El sistema debe generar confirmaciones firmadas digitalmente para cada pedido realizado, proporcionando evidencia verificable de la transacción.',
      binary_score: 0.9123,
      multiclass_score: 0.8678
    },
    {
      comment: 'La app debe resistir ataques de fuerza bruta',
      is_requirement: true,
      subcharacteristic: 'Resistencia',
      description: 'El sistema debe implementar medidas contra ataques de fuerza bruta, incluyendo bloqueo temporal de cuentas después de múltiples intentos fallidos.',
      binary_score: 0.9345,
      multiclass_score: 0.8923
    }
  ]
};

export const MOCK_PLAYSTORE_RESULT: ProcessingResponse = {
  total_comments: 150,
  valid_requirements: 18,
  processing_time_ms: 12456.89,
  source_type: 'playstore',
  requirements: [
    {
      comment: 'La app debería tener verificación en dos pasos',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar verificación en dos pasos (2FA) como capa adicional de seguridad para la autenticación de usuarios.',
      binary_score: 0.9423,
      multiclass_score: 0.8934
    },
    {
      comment: 'Mis mensajes deberían estar cifrados de extremo a extremo',
      is_requirement: true,
      subcharacteristic: 'Confidencialidad',
      description: 'El sistema debe implementar cifrado de extremo a extremo para todas las comunicaciones, garantizando que solo el emisor y receptor puedan leer los mensajes.',
      binary_score: 0.9567,
      multiclass_score: 0.9123
    },
    {
      comment: 'Quiero ver un historial de inicio de sesión',
      is_requirement: true,
      subcharacteristic: 'Responsabilidad',
      description: 'El sistema debe proporcionar un historial completo de todos los inicios de sesión, incluyendo dispositivo, ubicación y hora.',
      binary_score: 0.8923,
      multiclass_score: 0.8456
    },
    {
      comment: 'Los archivos subidos no deben poder ser modificados por otros',
      is_requirement: true,
      subcharacteristic: 'Integridad',
      description: 'El sistema debe implementar controles de acceso que prevengan modificaciones no autorizadas de archivos subidos por usuarios.',
      binary_score: 0.9012,
      multiclass_score: 0.8734
    },
    {
      comment: 'Necesito recibos digitales de mis pagos',
      is_requirement: true,
      subcharacteristic: 'No-Repudio',
      description: 'El sistema debe generar recibos digitales firmados para cada transacción de pago, proporcionando evidencia verificable.',
      binary_score: 0.9234,
      multiclass_score: 0.8867
    },
    {
      comment: 'La app debe bloquear intentos sospechosos de acceso',
      is_requirement: true,
      subcharacteristic: 'Resistencia',
      description: 'El sistema debe detectar y bloquear automáticamente intentos de acceso sospechosos o maliciosos.',
      binary_score: 0.9123,
      multiclass_score: 0.8678
    },
    {
      comment: 'Mi información bancaria debe estar protegida',
      is_requirement: true,
      subcharacteristic: 'Confidencialidad',
      description: 'El sistema debe implementar medidas de seguridad robustas para proteger información bancaria, incluyendo cifrado y tokenización.',
      binary_score: 0.9456,
      multiclass_score: 0.9012
    },
    {
      comment: 'Solo mi huella digital debería abrir la app',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar autenticación biométrica mediante huella digital como método seguro de acceso.',
      binary_score: 0.9234,
      multiclass_score: 0.8901
    },
    {
      comment: 'Quiero saber quién vio mi perfil',
      is_requirement: true,
      subcharacteristic: 'Responsabilidad',
      description: 'El sistema debe mantener un registro de visualizaciones de perfil, permitiendo al usuario saber quién ha accedido a su información.',
      binary_score: 0.8834,
      multiclass_score: 0.8345
    },
    {
      comment: 'Los datos de mi cuenta no deben poder ser alterados sin mi confirmación',
      is_requirement: true,
      subcharacteristic: 'Integridad',
      description: 'El sistema debe requerir confirmación explícita del usuario antes de aplicar cualquier modificación a los datos de su cuenta.',
      binary_score: 0.9123,
      multiclass_score: 0.8756
    },
    {
      comment: 'Necesito comprobantes firmados de mis transferencias',
      is_requirement: true,
      subcharacteristic: 'No-Repudio',
      description: 'El sistema debe generar comprobantes con firma digital para cada transferencia realizada, garantizando la no-repudiación de la transacción.',
      binary_score: 0.9345,
      multiclass_score: 0.8923
    },
    {
      comment: 'La app debería tener protección contra ataques DDoS',
      is_requirement: true,
      subcharacteristic: 'Resistencia',
      description: 'El sistema debe implementar mecanismos de protección contra ataques de denegación de servicio distribuidos (DDoS).',
      binary_score: 0.8912,
      multiclass_score: 0.8567
    },
    {
      comment: 'Mis fotos privadas deben estar encriptadas',
      is_requirement: true,
      subcharacteristic: 'Confidencialidad',
      description: 'El sistema debe cifrar todas las fotos marcadas como privadas utilizando algoritmos de cifrado robustos.',
      binary_score: 0.9234,
      multiclass_score: 0.8901
    },
    {
      comment: 'Quiero reconocimiento facial para acceder',
      is_requirement: true,
      subcharacteristic: 'Autenticidad',
      description: 'El sistema debe implementar reconocimiento facial como método de autenticación biométrica.',
      binary_score: 0.9012,
      multiclass_score: 0.8678
    },
    {
      comment: 'Debe haber un log de todas las operaciones administrativas',
      is_requirement: true,
      subcharacteristic: 'Responsabilidad',
      description: 'El sistema debe mantener un registro inmutable de todas las operaciones administrativas realizadas.',
      binary_score: 0.9456,
      multiclass_score: 0.9123
    },
    {
      comment: 'Los datos médicos no deben poder ser modificados',
      is_requirement: true,
      subcharacteristic: 'Integridad',
      description: 'El sistema debe garantizar que los datos médicos no puedan ser modificados una vez registrados, manteniendo su integridad.',
      binary_score: 0.9234,
      multiclass_score: 0.8834
    },
    {
      comment: 'Necesito certificados digitales de mis documentos',
      is_requirement: true,
      subcharacteristic: 'No-Repudio',
      description: 'El sistema debe generar certificados digitales para documentos importantes, proporcionando evidencia de su autenticidad.',
      binary_score: 0.9123,
      multiclass_score: 0.8756
    },
    {
      comment: 'La app debe detectar y bloquear malware',
      is_requirement: true,
      subcharacteristic: 'Resistencia',
      description: 'El sistema debe implementar detección y bloqueo de malware para proteger a los usuarios de amenazas maliciosas.',
      binary_score: 0.9345,
      multiclass_score: 0.8912
    }
  ]
};
