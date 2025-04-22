const express = require('express');
const router = express.Router();
const client = require('prom-client');

// Configurar métricas de Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const completedRequests = new client.Counter({
  name: 'gateway_workers_requests_total',
  help: 'Total requests processed by workers',
  labelNames: ['status', 'queue'],
});

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

router.get('/:metric', (req, res) => {
  const { metric } = req.params;
  if (metric === 'completed_requests') {
    // Simulación de métricas (en un entorno real, obtener de Prometheus o DB)
    return res.json({
      invoices: 1234,
      tickets: 567,
      total_sales: 500000,
    });
  }
  res.status(400).json({ error: 'Invalid metric' });
});

module.exports = { router, completedRequests };