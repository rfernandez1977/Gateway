const express = require('express');
const router = express.Router();
const redisClient = require('../redis');
const Queue = require('bull');

// Configuración de colas Bull
const queues = {
  'clients': new Queue('clients', process.env.REDIS_URL),
  'invoices': new Queue('invoices', process.env.REDIS_URL),
  'tickets': new Queue('tickets', process.env.REDIS_URL),
  'products': new Queue('products', process.env.REDIS_URL),
};

// Obtener longitud de una cola
router.get('/:queue/length', async (req, res) => {
  const { queue } = req.params;
  const validQueues = ['clients:pending', 'invoices:pending', 'tickets:pending', 'products:pending'];
  if (!validQueues.includes(queue)) {
    return res.status(400).json({ error: 'Invalid queue' });
  }
  const length = await redisClient.lLen(queue);
  res.json({ length });
});

// Procesar una solicitud
router.post('/:queue/process', async (req, res) => {
  const { queue } = req.params;
  const { data } = req.body;
  const validQueues = ['clients', 'invoices', 'tickets', 'products'];
  if (!validQueues.includes(queue)) {
    return res.status(400).json({ error: 'Invalid queue' });
  }

  // Validar datos según requisitos
  if (queue === 'clients') {
    if (!data.municipalityCode) {
      return res.status(400).json({ error: 'municipalityCode is required' });
    }
  } else if (queue === 'invoices') {
    if (!data.municipalityCode || !data.activityCode) {
      return res.status(400).json({ error: 'municipalityCode and activityCode are required' });
    }
  } else if (queue === 'tickets') {
    // municipalityCode y activityCode opcionales, cliente opcional
  }

  // Agregar a la cola
  await queues[queue].add(data, { attempts: 3 });
  await redisClient.rPush(`${queue}:pending`, JSON.stringify(data));
  res.json({ status: 'queued' });
});

module.exports = router;