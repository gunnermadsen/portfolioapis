import * as mongoose from 'mongoose';
import { Logger } from '@overnightjs/logger';

export class DatabaseConnection {

    constructor() {
        this.connect();
    }

    private async connect(): Promise<void> {
        const connectionString = process.env.MONGODB_URI || 'mongodb://heroku_cf279h4z:8tuqnuihu94nu4j3mdft4ku5pf@ds131676.mlab.com:31676/heroku_cf279h4z'
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(connectionString, options).then(() => Logger.Info(`Mongoose connected to ds131676.mlab.com:31676/heroku_cf279h4z`)).catch((error: any) => Logger.Err(`Database connection error: ${error}`));
    }
}