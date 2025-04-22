# Gateway API Endpoints

## Queues
- **GET /api/queues/{queue}/length**: Get the length of a queue.
  - Example: `/api/queues/invoices:pending/length`
  - Response: `{ "length": 10 }`
- **POST /api/queues/{queue}/process**: Process a request.
  - Example: `/api/queues/tickets/process`
  - Body: `{ "data": { "amount": 1000, "municipalityCode": "123", "activityCode": "456" } }`
  - Response: `{ "status": "queued" }`

## Metrics
- **GET /api/metrics/{metric}**: Get metrics.
  - Example: `/api/metrics/completed_requests`
  - Response: `{ "invoices": 1234, "tickets": 567, "total_sales": 500000 }`
- **GET /api/metrics**: Prometheus metrics endpoint.