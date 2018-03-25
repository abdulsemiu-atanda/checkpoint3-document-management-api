/* eslint no-console: "off" */
import express from 'express';
import bodyParser from 'body-parser';
import docRoutes from './server/routes/docRoutes';
import roleRoutes from './server/routes/roleRoutes';
import userRoutes from './server/routes/userRoutes';

// Set up the express app
const app = express();
const port = process.env.PORT || 3000;


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api', (req, res) => res.status(200).send({
  message: 'Welcome to the Document Management API!'
}));

app.use('/api/v1/role', roleRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/document', docRoutes);

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to Document management',
}));

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});

export default app;
