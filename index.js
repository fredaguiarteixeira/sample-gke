const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello from sample-gke!'));

app.listen(port, () => console.log(`sample-gke listening at http://localhost:${port}`));
