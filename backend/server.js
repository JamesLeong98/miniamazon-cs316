import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser'
import userRoute from './routes/userRoute';
import itemRoute from './routes/itemRoute';
import transactionRoute from './routes/transactionRoute';
import soldByRoute from './routes/soldByRoute';
import awsUploadRoute from './routes/awsUploadRoute';
import path from 'path';

const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .catch(err => console.log(err.reason));

const app = express();

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoute);
app.use("/api/products", itemRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/sells", soldByRoute)
app.use("/api/upload", awsUploadRoute)

app.listen(process.env.PORT || 8080, () => {console.log('Server started at http://localhost:8080')});


