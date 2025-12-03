#!/bin/bash
# Script para desplegar el sistema de caché Redis en producción
# Uso: ./deploy-cache.sh

set -e

SERVER_IP="192.241.129.118"
SERVER_USER="root"

echo "================================================"
echo "  Desplegando Sistema de Caché Redis"
echo "================================================"
echo ""
echo "Servidor: $SERVER_USER@$SERVER_IP"
echo ""

# Verificar conexión SSH
echo "==> Verificando conexión SSH..."
if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'Conexión exitosa'"; then
    echo "❌ Error: No se puede conectar al servidor"
    exit 1
fi

echo "✓ Conexión SSH exitosa"
echo ""

# Instalar Redis
echo "==> Instalando Redis en el servidor..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

# Actualizar paquetes e instalar Redis
apt-get update -y
apt-get install -y redis-server

# Configurar Redis para iniciar automáticamente
systemctl enable redis-server
systemctl start redis-server

# Verificar que Redis está corriendo
if systemctl is-active --quiet redis-server; then
    echo "✓ Redis instalado y corriendo"
else
    echo "❌ Error: Redis no está corriendo"
    exit 1
fi

# Verificar conectividad
redis-cli ping
ENDSSH

echo "✓ Redis instalado correctamente"
echo ""

# Actualizar código del backend
echo "==> Actualizando código del backend..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

cd /opt/extractreq/Backend

# Hacer pull del último código
git pull origin main || echo "⚠ Warning: git pull failed, continuando..."

# Activar entorno virtual e instalar dependencias
source venv/bin/activate
pip install redis==5.0.1

echo "✓ Dependencias actualizadas"
ENDSSH

echo "✓ Backend actualizado"
echo ""

# Copiar nuevo servicio de caché
echo "==> Copiando servicio de caché al servidor..."
scp backend/app/services/cache_service.py $SERVER_USER@$SERVER_IP:/opt/extractreq/Backend/app/services/

echo "✓ Servicio de caché copiado"
echo ""

# Copiar orchestrator actualizado
echo "==> Copiando orchestrator actualizado..."
scp backend/app/services/orchestrator.py $SERVER_USER@$SERVER_IP:/opt/extractreq/Backend/app/services/

echo "✓ Orchestrator actualizado"
echo ""

# Actualizar permisos
echo "==> Actualizando permisos..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
chown -R extractreq:extractreq /opt/extractreq/Backend
ENDSSH

echo "✓ Permisos actualizados"
echo ""

# Reiniciar servicio backend
echo "==> Reiniciando servicio backend..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
systemctl restart extractreq-backend

# Esperar 5 segundos para que el servicio inicie
sleep 5

# Verificar que el servicio está corriendo
if systemctl is-active --quiet extractreq-backend; then
    echo "✓ Backend reiniciado correctamente"
else
    echo "❌ Error: Backend no está corriendo"
    systemctl status extractreq-backend
    exit 1
fi
ENDSSH

echo "✓ Servicio backend reiniciado"
echo ""

# Verificar que el API responde
echo "==> Verificando que el API responde..."
sleep 3
if curl -s http://$SERVER_IP/health | grep -q "healthy"; then
    echo "✓ API respondiendo correctamente"
else
    echo "❌ Warning: API no responde como se esperaba"
fi

echo ""
echo "================================================"
echo "  ✓ Despliegue Completado Exitosamente"
echo "================================================"
echo ""
echo "Sistema de caché Redis desplegado:"
echo "  - Redis instalado y corriendo"
echo "  - Backend actualizado con cache_service.py"
echo "  - Servicio reiniciado"
echo ""
echo "Prueba el caché:"
echo "  1. Procesa una URL de PlayStore"
echo "  2. Procesa la MISMA URL de nuevo"
echo "  3. La segunda vez debería ser instantánea (<1s)"
echo ""
echo "Monitorear logs:"
echo "  ssh $SERVER_USER@$SERVER_IP 'journalctl -u extractreq-backend -f'"
echo ""
