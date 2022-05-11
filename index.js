const express = require('express');
const app = express();
const PORT = process.env.PORT || 1045;
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const baseurl = '/wuipi/payment/v1';

const pay = require('./app/routes/payRoute');

app.use(baseurl + '/pay', pay);

app.all('*',(req, res) => {
    res.status(404).json({
        status: 'not found',
        message: `Can´t find ${req.method} : ${req.originalUrl} on this API`,
    })
})


app.listen(PORT, () =>{
    console.log(`Servicio wuipi-mercantil-service listening ${PORT}`)
    console.log('endpoints:')
    console.table({
      pay:`${baseurl}/pay`
    })
})
