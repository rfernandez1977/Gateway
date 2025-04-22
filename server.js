const express = require('express');
const app = express();
require('dotenv').config();
const authMiddleware = require('./middleware/auth');

// Configuración de Express
app.use(express.json());

// Rutas
const queuesRouter = require('./routes/queues');
const { router: metricsRouter } = require('./routes/metrics');
app.use('/api/queues', authMiddleware, queuesRouter);
app.use('/api/metrics', authMiddleware, metricsRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});