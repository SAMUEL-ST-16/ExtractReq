#!/bin/bash
# Script para verificar el estado del servidor actual

echo "=== Verificando estado del servidor ExtractReq ==="
echo ""

echo "[1] Verificando si los archivos de post-boot existen..."
ls -la /opt/extractreq-post-boot.sh 2>&1
ls -la /etc/systemd/system/extractreq-post-boot.service 2>&1
echo ""

echo "[2] Verificando servicios instalados..."
systemctl list-unit-files | grep extractreq
echo ""

echo "[3] Verificando estado del backend..."
systemctl status extractreq-backend.service --no-pager || echo "Backend service no existe"
echo ""

echo "[4] Verificando estado de nginx..."
systemctl status nginx.service --no-pager || echo "Nginx no está corriendo"
echo ""

echo "[5] Verificando si la aplicación está instalada..."
ls -la /opt/extractreq/ 2>&1
echo ""

echo "[6] Verificando cloud-init logs completos..."
echo "Últimas 50 líneas de cloud-init-output.log:"
tail -n 50 /var/log/cloud-init-output.log
echo ""

echo "=== Fin de verificación ==="
