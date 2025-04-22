# Factura Móvil Gateway

Este proyecto implementa el backend Gateway para Factura Móvil.

## Archivos
- `src/`: Código fuente de Gateway (Node.js).
- `grafana-dashboard-mockup.json`: Diseño visual del dashboard.
- `grafana-dashboard.json`: Configuración de Grafana.
- `monitoring-config.yaml`: Configuración de Prometheus y alertas.
- `workers-config.json`: Configuración de workers.
- `redis-config.yaml`: Configuración de Redis.
- `gateway-api-endpoints.md`: Lista de endpoints REST.

## Contexto
- Procesa 10,000-15,000 solicitudes diarias (0.12-0.37 solicitudes/s, picos de 1-2 por segundo).
- Colas: clients:pending, invoices:pending, tickets:pending, products:pending.
- Integra con Factura Móvil (/services/fm/...), SII, y CloudWatch.
- Soporta VozPos (React Native, comandos de voz: "emitir boleta por $1000").
- Requisitos: municipalityCode obligatorio, activityCode opcional (clientes); ambos obligatorios en facturas, opcionales en boletas.

## Instrucciones
1. `npm install`
2. Configura `.env` con las variables necesarias.
3. Inicia el servidor: `npm start`
4. Inicia los workers: `npm run worker`
5. Configura Redis con `redis-config.yaml`.
6. Configura monitoreo con `monitoring-config.yaml`.
7. Importa `grafana-dashboard.json` en Grafana.