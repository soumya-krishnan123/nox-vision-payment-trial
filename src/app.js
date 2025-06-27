const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const webhookRoutes = require('./routes/stripeWebhook');
const app = express();
app.use('/webhook', webhookRoutes);

// Middleware
app.use(helmet());
app.use(cors());

app.use(morgan('dev'));

// Routes
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
});

module.exports = app;
