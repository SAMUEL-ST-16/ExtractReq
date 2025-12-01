import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProcessingState, ProcessingResponse } from '../../models/requirement.model';
import { ResultsDashboardComponent } from '../results-dashboard/results-dashboard';
import {
  MOCK_SINGLE_COMMENT_RESULT,
  MOCK_CSV_RESULT,
  MOCK_PLAYSTORE_RESULT
} from '../../data/mock-results.data';

/**
 * Componente Home - Página principal con diseño v0.app
 * Diseño profesional y limpio adaptado de v0.app
 * Incluye: Header, Hero, Input Cards, Security Characteristics, Demo Mode, Dark/Light Theme
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultsDashboardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit() {
    // Detectar tema preferido del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    }
  }

  // ==================== ESTADO ====================
  // Señales para el estado de cada funcionalidad
  singleCommentState = signal<ProcessingState>({ loading: false });
  csvState = signal<ProcessingState>({ loading: false });
  playStoreState = signal<ProcessingState>({ loading: false });

  // Datos de formularios
  singleComment = signal<string>('');
  csvFile = signal<File | null>(null);
  csvFileName = signal<string>('');
  playStoreURL = signal<string>('');

  // Modo demostración activado/desactivado
  demoMode = signal<boolean>(false);

  // Característica expandida en la sección de security characteristics
  expandedCharacteristic = signal<string | null>('chart1');

  // Dark mode
  isDarkMode = signal<boolean>(false);

  // ==================== VALIDACIÓN ====================
  readonly MIN_COMMENT_LENGTH = 10;
  readonly MIN_URL_LENGTH = 30;

  // ==================== DATOS DE CARACTERÍSTICAS ====================
  securityCharacteristics = [
    {
      id: 'chart1',
      name: 'Confidencialidad',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />',
      color: 'chart1',
      description: 'Grado en que un producto o sistema asegura que los datos son accesibles solo a quienes están autorizados.',
      details: [
        'Cifrado de datos en reposo y en tránsito',
        'Control de acceso basado en roles (RBAC)',
        'Protección contra acceso no autorizado',
        'Gestión segura de credenciales'
      ],
      examples: 'La app no encripta mis datos personales / Mi información está expuesta'
    },
    {
      id: 'chart2',
      name: 'Integridad',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
      color: 'chart2',
      description: 'Grado en que un sistema protege contra modificación o eliminación no autorizada de datos.',
      details: [
        'Validación de integridad de datos',
        'Protección contra manipulación',
        'Checksums y firmas digitales',
        'Prevención de inyección de datos'
      ],
      examples: 'Los datos se modificaron sin mi autorización / La información está corrupta'
    },
    {
      id: 'chart3',
      name: 'No Repudio',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />',
      color: 'chart3',
      description: 'Grado en que las acciones o eventos pueden probarse que han ocurrido.',
      details: [
        'Registro de auditoría completo',
        'Timestamps verificables',
        'Firmas digitales de transacciones',
        'Trazabilidad de acciones de usuario'
      ],
      examples: 'No hay registro de mis transacciones / No puedo demostrar qué hice'
    },
    {
      id: 'chart4',
      name: 'Responsabilidad',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />',
      color: 'chart4',
      description: 'Grado en que las acciones de una entidad pueden rastrearse únicamente a esa entidad.',
      details: [
        'Identificación única de usuarios',
        'Logs de actividad por usuario',
        'Atribución de acciones',
        'Gestión de sesiones seguras'
      ],
      examples: 'Alguien accedió a mi cuenta / No sé quién hizo cambios'
    },
    {
      id: 'chart5',
      name: 'Autenticidad',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
      color: 'chart5',
      description: 'Grado en que la identidad de un sujeto o recurso puede probarse como la reclamada.',
      details: [
        'Autenticación multifactor (MFA)',
        'Verificación de identidad',
        'Certificados digitales',
        'Protección contra suplantación'
      ],
      examples: 'No tiene verificación en dos pasos / Cualquiera puede entrar a mi cuenta'
    },
    {
      id: 'chart6',
      name: 'Resistencia',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
      color: 'chart6',
      description: 'Capacidad del sistema para resistir ataques y mantener funcionalidad bajo condiciones adversas o maliciosas.',
      details: [
        'Protección contra DDoS',
        'Rate limiting en APIs',
        'Validación y sanitización de entradas',
        'Recuperación ante fallos de seguridad'
      ],
      examples: 'La app se cae cuando hay muchos usuarios / No resiste ataques'
    }
  ];

  // ==================== COMPUTED ====================
  // Determina si hay resultados para mostrar
  hasResults = computed(() => {
    return this.singleCommentState().showResults ||
           this.csvState().showResults ||
           this.playStoreState().showResults;
  });

  // Obtiene los resultados actuales para mostrar
  currentResults = computed(() => {
    if (this.singleCommentState().showResults) {
      return this.singleCommentState().results;
    }
    if (this.csvState().showResults) {
      return this.csvState().results;
    }
    if (this.playStoreState().showResults) {
      return this.playStoreState().results;
    }
    return null;
  });

  // Obtiene el PDF blob actual
  currentPdfBlob = computed(() => {
    if (this.singleCommentState().showResults) {
      return this.singleCommentState().pdfBlob;
    }
    if (this.csvState().showResults) {
      return this.csvState().pdfBlob;
    }
    if (this.playStoreState().showResults) {
      return this.playStoreState().pdfBlob;
    }
    return null;
  });

  // Obtiene el nombre del archivo PDF actual
  currentPdfFileName = computed(() => {
    if (this.singleCommentState().showResults) {
      return this.singleCommentState().pdfFileName;
    }
    if (this.csvState().showResults) {
      return this.csvState().pdfFileName;
    }
    if (this.playStoreState().showResults) {
      return this.playStoreState().pdfFileName;
    }
    return 'requisitos_seguridad.pdf';
  });

  // ==================== TEMA (DARK/LIGHT) ====================
  toggleTheme(): void {
    const newDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // ==================== CARACTERÍSTICAS DE SEGURIDAD ====================
  toggleCharacteristic(id: string): void {
    if (this.expandedCharacteristic() === id) {
      this.expandedCharacteristic.set(null);
    } else {
      this.expandedCharacteristic.set(id);
    }
  }

  // ==================== MODO DEMOSTRACIÓN ====================
  toggleDemoMode(): void {
    this.demoMode.set(!this.demoMode());
  }

  showDemoResults(type: 'single' | 'csv' | 'playstore'): void {
    // Limpiar resultados anteriores
    this.clearAllResults();

    // Mostrar resultados de demostración
    setTimeout(() => {
      switch (type) {
        case 'single':
          this.singleCommentState.set({
            loading: false,
            showResults: true,
            results: MOCK_SINGLE_COMMENT_RESULT,
            message: 'Resultados de demostración - Comentario único'
          });
          break;
        case 'csv':
          this.csvState.set({
            loading: false,
            showResults: true,
            results: MOCK_CSV_RESULT,
            message: 'Resultados de demostración - Archivo CSV'
          });
          break;
        case 'playstore':
          this.playStoreState.set({
            loading: false,
            showResults: true,
            results: MOCK_PLAYSTORE_RESULT,
            message: 'Resultados de demostración - Google Play Store'
          });
          break;
      }

      // Scroll al dashboard
      setTimeout(() => {
        const dashboard = document.querySelector('.results-dashboard');
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 500);
  }

  clearAllResults(): void {
    this.singleCommentState.set({ loading: false, showResults: false });
    this.csvState.set({ loading: false, showResults: false });
    this.playStoreState.set({ loading: false, showResults: false });
  }

  // ==================== FUNCIONALIDAD 1: COMENTARIO ÚNICO ====================
  onSingleCommentSubmit(): void {
    const comment = this.singleComment().trim();

    // Validación
    if (!comment || comment.length < this.MIN_COMMENT_LENGTH) {
      this.singleCommentState.set({
        loading: false,
        error: `El comentario debe tener al menos ${this.MIN_COMMENT_LENGTH} caracteres`
      });
      return;
    }

    // Limpiar resultados anteriores
    this.clearAllResults();

    // Iniciar procesamiento
    this.singleCommentState.set({
      loading: true,
      message: 'Analizando comentario con modelos BERT...',
      progress: 30
    });

    // Intentar obtener PDF + JSON (resultados reales)
    this.apiService.processSingleCommentWithResults(comment).subscribe({
      next: ({ pdf, results }) => {
        // Usar resultados reales del backend
        this.singleCommentState.set({
          loading: false,
          showResults: true,
          results: results, // Datos reales del backend
          pdfBlob: pdf,
          pdfFileName: 'requisito_individual.pdf',
          message: 'Análisis completado - Descarga el PDF desde el botón abajo'
        });

        // Scroll al dashboard
        setTimeout(() => {
          const dashboard = document.querySelector('.results-dashboard');
          if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error obteniendo resultados JSON, intentando solo PDF...', error);

        // Fallback: usar solo PDF con datos MOCK si el endpoint /analyze/* no existe
        this.apiService.processSingleComment(comment).subscribe({
          next: (pdfBlob) => {
            this.singleCommentState.set({
              loading: false,
              showResults: true,
              results: MOCK_SINGLE_COMMENT_RESULT, // Datos de demostración como fallback
              pdfBlob: pdfBlob,
              pdfFileName: 'requisito_individual.pdf',
              message: 'Análisis completado - Descarga el PDF desde el botón abajo (Mostrando datos de demostración)'
            });

            setTimeout(() => {
              const dashboard = document.querySelector('.results-dashboard');
              if (dashboard) {
                dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          },
          error: (pdfError) => {
            console.error('Error procesando comentario:', pdfError);
            this.singleCommentState.set({
              loading: false,
              error: this.getErrorMessage(pdfError)
            });
          }
        });
      }
    });
  }

  clearSingleComment(): void {
    this.singleComment.set('');
    this.singleCommentState.set({ loading: false, showResults: false });
  }

  // ==================== FUNCIONALIDAD 2: ARCHIVO CSV ====================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.name.endsWith('.csv')) {
        this.csvState.set({
          loading: false,
          error: 'El archivo debe ser un CSV (.csv)'
        });
        return;
      }

      this.csvFile.set(file);
      this.csvFileName.set(file.name);
      this.csvState.set({ loading: false, error: undefined });
    }
  }

  onCSVSubmit(): void {
    const file = this.csvFile();

    if (!file) {
      this.csvState.set({
        loading: false,
        error: 'Por favor selecciona un archivo CSV'
      });
      return;
    }

    // Limpiar resultados anteriores
    this.clearAllResults();

    this.csvState.set({
      loading: true,
      message: 'Procesando archivo CSV...',
      progress: 20
    });

    // Intentar obtener PDF + JSON (resultados reales)
    this.apiService.processCSVWithResults(file).subscribe({
      next: ({ pdf, results }) => {
        // Usar resultados reales del backend
        this.csvState.set({
          loading: false,
          showResults: true,
          results: results, // Datos reales del backend
          pdfBlob: pdf,
          pdfFileName: `requisitos_${file.name.replace('.csv', '')}.pdf`,
          message: 'Análisis completado - Descarga el PDF desde el botón abajo'
        });

        // Scroll al dashboard
        setTimeout(() => {
          const dashboard = document.querySelector('.results-dashboard');
          if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error obteniendo resultados JSON, intentando solo PDF...', error);

        // Fallback: usar solo PDF con datos MOCK si el endpoint /analyze/* no existe
        this.apiService.processCSVFile(file).subscribe({
          next: (pdfBlob) => {
            this.csvState.set({
              loading: false,
              showResults: true,
              results: MOCK_CSV_RESULT, // Datos de demostración como fallback
              pdfBlob: pdfBlob,
              pdfFileName: `requisitos_${file.name.replace('.csv', '')}.pdf`,
              message: 'Análisis completado - Descarga el PDF desde el botón abajo (Mostrando datos de demostración)'
            });

            setTimeout(() => {
              const dashboard = document.querySelector('.results-dashboard');
              if (dashboard) {
                dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          },
          error: (pdfError) => {
            console.error('Error procesando CSV:', pdfError);
            this.csvState.set({
              loading: false,
              error: this.getErrorMessage(pdfError)
            });
          }
        });
      }
    });
  }

  clearCSV(): void {
    this.csvFile.set(null);
    this.csvFileName.set('');
    this.csvState.set({ loading: false, showResults: false });
  }

  // ==================== FUNCIONALIDAD 3: GOOGLE PLAY STORE ====================
  onPlayStoreSubmit(): void {
    const url = this.playStoreURL().trim();

    // Validación
    if (!url || url.length < this.MIN_URL_LENGTH) {
      this.playStoreState.set({
        loading: false,
        error: 'Por favor ingresa una URL válida de Google Play Store'
      });
      return;
    }

    if (!url.includes('play.google.com') || !url.includes('id=')) {
      this.playStoreState.set({
        loading: false,
        error: 'La URL debe ser de Google Play Store y contener el ID de la app'
      });
      return;
    }

    // Limpiar resultados anteriores
    this.clearAllResults();

    this.playStoreState.set({
      loading: true,
      message: 'Extrayendo comentarios de Google Play Store...',
      progress: 10
    });

    const appId = url.split('id=')[1].split('&')[0];

    // Intentar obtener PDF + JSON (resultados reales)
    this.apiService.processPlayStoreWithResults(url).subscribe({
      next: ({ pdf, results }) => {
        // Usar resultados reales del backend
        this.playStoreState.set({
          loading: false,
          showResults: true,
          results: results, // Datos reales del backend
          pdfBlob: pdf,
          pdfFileName: `requisitos_${appId}.pdf`,
          message: 'Análisis completado - Descarga el PDF desde el botón abajo'
        });

        // Scroll al dashboard
        setTimeout(() => {
          const dashboard = document.querySelector('.results-dashboard');
          if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error obteniendo resultados JSON, intentando solo PDF...', error);

        // Fallback: usar solo PDF con datos MOCK si el endpoint /analyze/* no existe
        this.apiService.processPlayStoreURL(url).subscribe({
          next: (pdfBlob) => {
            this.playStoreState.set({
              loading: false,
              showResults: true,
              results: MOCK_PLAYSTORE_RESULT, // Datos de demostración como fallback
              pdfBlob: pdfBlob,
              pdfFileName: `requisitos_${appId}.pdf`,
              message: 'Análisis completado - Descarga el PDF desde el botón abajo (Mostrando datos de demostración)'
            });

            setTimeout(() => {
              const dashboard = document.querySelector('.results-dashboard');
              if (dashboard) {
                dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          },
          error: (pdfError) => {
            console.error('Error procesando Play Store URL:', pdfError);
            this.playStoreState.set({
              loading: false,
              error: this.getErrorMessage(pdfError)
            });
          }
        });
      }
    });
  }

  clearPlayStore(): void {
    this.playStoreURL.set('');
    this.playStoreState.set({ loading: false, showResults: false });
  }

  // ==================== UTILIDADES ====================
  getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
    }
    return 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
  }
}
