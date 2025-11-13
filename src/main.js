import { server } from "./app.setup.js";
import { initialiseDatabaseConnection } from "./common/db.js";
import {getOrThrowEnvKey, validateConfig} from "./config/config.js";



validateConfig();


async function bootstrap() {
    try{
        await initialiseDatabaseConnection().then(() => {
            server.listen(getOrThrowEnvKey('PORT'), () => {


                console.info(`Server listening on port ${server.address().port}`);
            });
        });
    }
    catch(error) {
        console.error(error);
        process.exit(1);
    }
}

bootstrap()

