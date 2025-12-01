"""
PDF Service
Generates PDF documents with requirement analysis results
"""

from typing import List
from io import BytesIO
from datetime import datetime
import html
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from app.schemas.models import RequirementResult, ProcessingResponse
from app.core.config import settings
from app.core.logger import get_logger
from app.core.exceptions import PDFGenerationException

logger = get_logger(__name__)


class PDFService:
    """
    Service for generating PDF reports of requirement analysis
    """

    def __init__(self):
        """Initialize PDF service"""
        logger.info("Initializing PDF Service")
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    @staticmethod
    def _escape_text(text: str) -> str:
        """
        Escape text for safe use in PDF Paragraphs
        Handles special characters like tildes, ñ, etc.

        Args:
            text: Text to escape

        Returns:
            Escaped text safe for ReportLab
        """
        if not text:
            return ""
        # Escape HTML special characters
        return html.escape(str(text))

    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a237e'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))

        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#283593'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))

        # Requirement style
        self.styles.add(ParagraphStyle(
            name='Requirement',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            leftIndent=20
        ))

    def generate_pdf(
        self,
        response: ProcessingResponse,
        filename: str = "requisitos_seguridad.pdf"
    ) -> BytesIO:
        """
        Generate a PDF report from processing response

        Args:
            response: Processing response with requirement results
            filename: Output filename

        Returns:
            BytesIO buffer with PDF content

        Raises:
            PDFGenerationException: If PDF generation fails
        """
        try:
            logger.info(f"Generating PDF report with {response.total_comments} comments")

            # Create PDF buffer
            buffer = BytesIO()

            # Create document with UTF-8 support
            doc = SimpleDocTemplate(
                buffer,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18,
                title="Informe de Requisitos de Seguridad",
                author="ExtractReq",
                subject="Análisis de Requisitos de Seguridad ISO 25010"
            )

            # Build content
            story = []

            # Add header
            story.extend(self._build_header(response))

            # Add summary statistics
            story.extend(self._build_summary(response))

            # Add requirements table
            story.extend(self._build_requirements_table(response))

            # Add detailed requirements
            story.extend(self._build_detailed_requirements(response))

            # Build PDF
            doc.build(story)

            # Reset buffer position
            buffer.seek(0)

            logger.info("PDF generated successfully")
            return buffer

        except Exception as e:
            error_msg = f"Failed to generate PDF: {str(e)}"
            logger.error(error_msg)
            raise PDFGenerationException(error_msg, details={"error": str(e)})

    def _build_header(self, response: ProcessingResponse) -> List:
        """Build PDF header section"""
        story = []

        # Title
        title = Paragraph(
            "Informe de Requisitos de Seguridad",
            self.styles['CustomTitle']
        )
        story.append(title)
        story.append(Spacer(1, 0.2 * inch))

        # Metadata
        metadata = f"""
        <para alignment="center">
        <b>Fecha:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}<br/>
        <b>Tipo de fuente:</b> {response.source_type.upper()}<br/>
        <b>Tiempo de procesamiento:</b> {response.processing_time_ms:.2f} ms
        </para>
        """
        story.append(Paragraph(metadata, self.styles['Normal']))
        story.append(Spacer(1, 0.3 * inch))

        return story

    def _build_summary(self, response: ProcessingResponse) -> List:
        """Build summary statistics section"""
        story = []

        # Summary title
        story.append(Paragraph("Resumen Ejecutivo", self.styles['CustomSubtitle']))

        # Statistics table
        data = [
            ["Métrica", "Valor"],
            ["Comentarios procesados", str(response.total_comments)],
            ["Requisitos válidos encontrados", str(response.valid_requirements)],
            [
                "Tasa de éxito",
                f"{(response.valid_requirements / response.total_comments * 100):.1f}%"
                if response.total_comments > 0 else "0%"
            ]
        ]

        table = Table(data, colWidths=[3.5 * inch, 2 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#283593')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))

        story.append(table)
        story.append(Spacer(1, 0.3 * inch))

        return story

    def _build_requirements_table(self, response: ProcessingResponse) -> List:
        """Build requirements summary table"""
        story = []

        # Get only valid requirements
        valid_reqs = [r for r in response.requirements if r.is_requirement]

        if not valid_reqs:
            story.append(Paragraph(
                "No se encontraron requisitos de seguridad válidos.",
                self.styles['Normal']
            ))
            return story

        # Count by subcharacteristic
        subchar_counts = {}
        for req in valid_reqs:
            subchar = req.subcharacteristic or "Sin clasificar"
            subchar_counts[subchar] = subchar_counts.get(subchar, 0) + 1

        # Distribution table
        story.append(Paragraph(
            "Distribución por Subcaracterística ISO 25010",
            self.styles['CustomSubtitle']
        ))

        data = [["Subcaracterística", "Cantidad", "Porcentaje"]]
        for subchar, count in sorted(subchar_counts.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / len(valid_reqs) * 100)
            # Note: Tables don't need HTML escaping, just Unicode support
            data.append([subchar, str(count), f"{percentage:.1f}%"])

        table = Table(data, colWidths=[3 * inch, 1.5 * inch, 1.5 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#283593')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#e3f2fd')),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))

        story.append(table)
        story.append(Spacer(1, 0.4 * inch))

        return story

    def _build_detailed_requirements(self, response: ProcessingResponse) -> List:
        """Build detailed requirements section"""
        story = []

        valid_reqs = [r for r in response.requirements if r.is_requirement]

        if not valid_reqs:
            return story

        story.append(PageBreak())
        story.append(Paragraph("Requisitos Detallados", self.styles['CustomSubtitle']))
        story.append(Spacer(1, 0.2 * inch))

        for idx, req in enumerate(valid_reqs, 1):
            # Requirement header
            subchar_escaped = self._escape_text(req.subcharacteristic)
            header_text = f"<b>Requisito {idx}: {subchar_escaped}</b>"
            story.append(Paragraph(header_text, self.styles['Heading3']))

            # Original comment
            comment_escaped = self._escape_text(req.comment)
            comment_text = f"<b>Comentario original:</b> <i>{comment_escaped}</i>"
            story.append(Paragraph(comment_text, self.styles['Normal']))
            story.append(Spacer(1, 0.1 * inch))

            # Generated description
            if req.description:
                desc_escaped = self._escape_text(req.description)
                desc_text = f"<b>Descripción formal:</b> {desc_escaped}"
                story.append(Paragraph(desc_text, self.styles['Requirement']))

            # Confidence scores
            scores_text = f"<b>Confianza:</b> Binaria: {req.binary_score:.2%}"
            if req.multiclass_score:
                scores_text += f" | Multiclase: {req.multiclass_score:.2%}"
            story.append(Paragraph(scores_text, self.styles['Normal']))

            story.append(Spacer(1, 0.2 * inch))

        return story


# Global service instance
pdf_service = PDFService()
