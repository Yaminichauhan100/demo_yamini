/**
 * @file server
 * @description the server entry point
 * @created 2019-05-19 00:10:59
*/

import { CONFIG } from "./common";
import App from "./app";

// create server and start listening on port
let server = App.instance.listen(CONFIG.APP_PORT);

// add server listener
server.on('listening', function () {
    console.info(`Server started listening on port ${CONFIG.APP_PORT}`);
});