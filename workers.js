const Queue = require('bull');
const redisClient = require('./redis');
const axios = require('axios');

const queues = {
  'clients': new Queue('clients', process.env.REDIS_URL),
  'invoices': new Queue('invoices', process.env.REDIS_URL),
  'tickets': new Queue('tickets', process.env.REDIS_URL),
  'products': new Queue('products', process.env.REDIS_URL),
};

const { completedRequests } = require('./routes/metrics');

// Procesar trabajos
Object.keys(queues).forEach(queueName => {
  queues[queueName].process(async (job) => {
    const data = job.data;
    try {
      // Simular integración con Factura Móvil o SII
      let response;
      if (queueName === 'invoices') {
        response = await axios.post(`${process.env.FM_URL}/invoices`, data);
      } else if (queueName === 'tickets') {
        response = await axios.post(`${process.env.FM_URL}/tickets`, data);
      } else if (queueName === 'clients') {
        response = await axios.post(`${process.env.FM_URL}/clients`, data);
      } else {
        response = await axios.post(`${process.env.FM_URL}/products`, data);
      }

      // Mover de pending a completed
      await redisClient.lRem(`${queueName}:pending`, 1, JSON.stringify(data));
      completedRequests.inc({ status: 'completed', queue: queueName });
      return { status: 'completed' };
    } catch (error) {
      // Mover a failed
      await redisClient.lRem(`${queueName}:pending`, 1, JSON.stringify(data));
      await redisClient.rPush(`${queueName}:failed`, JSON.stringify(data));
      completedRequests.inc({ status: 'failed', queue: queueName });
      throw new Error(`Failed to process ${queueName}: ${error.message}`);
    }
  });
});

console.log('Workers started');