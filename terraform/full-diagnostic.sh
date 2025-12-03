#!/bin/bash
#
# Diagnóstico Completo del Backend - ExtractReq
#

echo "=========================================="
echo "  DIAGNÓSTICO COMPLETO DEL BACKEND"
echo "=========================================="
echo ""

echo "==> 1. Estado del servicio extractreq-backend:"
systemctl status extractreq-backend.service --no-pager -l || echo "ERROR: No se pudo obtener el estado"
echo ""

echo "==> 2. ¿El servicio está habilitado?"
systemctl is-enabled extractreq-backend.service || echo "NO está habilitado"
echo ""

echo "==> 3. ¿El servicio está activo?"
systemctl is-active extractreq-backend.service || echo "NO está activo"
echo ""

echo "==> 4. Logs del servicio (systemd journal):"
journalctl -u extractreq-backend.service -n 100 --no-pager || echo "Sin logs en journalctl"
echo ""

echo "==> 5. Logs de cloud-init (últimas 200 líneas):"
tail -200 /var/log/cloud-init-output.log
echo ""

echo "==> 6. ¿Existe el directorio de la aplicación?"
ls -la /opt/extractreq/
echo ""

echo "==> 7. ¿Existe el backend?"
ls -la /opt/extractreq/Backend/ | head -20
echo ""

echo "==> 8. ¿Existe el venv de Python?"
ls -la /opt/extractreq/Backend/venv/
echo ""

echo "==> 9. ¿Existe el archivo .env?"
ls -la /opt/extractreq/Backend/.env
echo ""

echo "==> 10. Contenido del .env (sin secretos):"
cat /opt/extractreq/Backend/.env | grep -v "TOKEN\|KEY" | head -20
echo ""

echo "==> 11. ¿Existe el usuario extractreq?"
id extractreq || echo "Usuario extractreq NO existe"
echo ""

echo "==> 12. Permisos del directorio Backend:"
ls -ld /opt/extractreq/Backend/
echo ""

echo "==> 13. Contenido del archivo del servicio systemd:"
cat /etc/systemd/system/extractreq-backend.service
echo ""

echo "==> 14. Intentar iniciar el servicio manualmente:"
systemctl start extractreq-backend.service
sleep 5
echo ""

echo "==> 15. Estado después de intentar iniciar:"
systemctl status extractreq-backend.service --no-pager -l
echo ""

echo "==> 16. Logs después de intentar iniciar:"
journalctl -u extractreq-backend.service -n 50 --no-pager
echo ""

echo "==> 17. ¿Está escuchando en el puerto 8000?"
ss -tlnp | grep 8000 || echo "Puerto 8000 NO está escuchando"
echo ""

echo "==> 18. Procesos de Python/Uvicorn:"
ps aux | grep -E 'python|uvicorn' | grep -v grep
echo ""

echo "==> 19. Intentar ejecutar uvicorn directamente (manual):"
echo "Ejecutando como usuario extractreq..."
su - extractreq -c "cd /opt/extractreq/Backend && source venv/bin/activate && timeout 10 uvicorn app.main:app --host 127.0.0.1 --port 8000 2>&1" &
MANUAL_PID=$!
sleep 8
kill $MANUAL_PID 2>/dev/null || true
echo ""

echo "==> 20. Verificar que las dependencias están instaladas:"
su - extractreq -c "cd /opt/extractreq/Backend && source venv/bin/activate && pip list | grep -E 'fastapi|uvicorn|torch|transformers'"
echo ""

echo "=========================================="
echo "  DIAGNÓSTICO COMPLETADO"
echo "=========================================="
