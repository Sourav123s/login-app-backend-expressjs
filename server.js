const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}));
app.use('/api', require('./routes'))

// app.post('/login', (req, res) => {
//     res.send({
//         data:req.body,
//         token: 'test123'
//     });
// });

app.listen(8080, () => console.log('API is running on http://localhost:8080'));