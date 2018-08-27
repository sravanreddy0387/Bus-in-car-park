/**
 * bus Simulator app. Master module that starts the simmulator 
 * app. It requires the bus instance and uses its methods to
 * operate it.
 */

/**
 * Declare and initialize variables
 */
import os from "os";                     // to interact with users

const // standard input handle
stdin = process.stdin;

const // standard output handle
stdout = process.stdout;

const // standard error handle
stderr = process.stderr;

import bus from './busFactory';
const EOL = os.EOL;
import fs from 'fs';
import http from 'http';
import url from 'url';
import util from 'util';
import readline from 'readline';

let // readline instance
rl;

let // for cli arguments, particularly to get a file path
argv;

import config from './config';
import path from 'path';
const messenger = bus.getMessenger();

stdin.setEncoding('utf8');
process.title = "Bus in a car park Simulator"; // Terminal title

argv = process.argv.slice(2); // get only the name of the file from user prompt


// read stdin
// this piece of code is for reading user's input from CLI
stdin.on('data', data => {
    outputMesage(data);
});



if (argv.length) {
    // Input from front end
    if ( argv[0] !== undefined && argv[0].includes('--port')) { 
        const root = path.dirname(require.main.filename);
        const port = argv[1] || config.defaultPort;
        
        http.createServer((req, res) => { 
            const pathname = url.parse(req.url).pathname;
            let m;
            if (pathname == '/') {
                bus._resetBusPosition(); 
                res.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream(`${root}/build/index.html`).pipe(res);
                return;
            } 
            else if (m = pathname.match(/^\/js\//)) {
                const filename = `${root}/build${pathname}`;
                const stats = fs.existsSync(filename) && fs.statSync(filename);
                if (stats && stats.isFile()) {
                    res.writeHead(200, {'Content-Type' : 'application/javascript'});
                    fs.createReadStream(filename).pipe(res);
                    return;
                }
            }
            else if (pathname == '/fetch-simulator-config'){
                res.writeHead(200, {'Content-Type' : 'application/json'});
                res.write(JSON.stringify({config}));
                res.end();
                return;
            }
            else if (req.method == 'POST' && pathname == '/control-bus'){
                let body = '';
                let message;
                let success;
                req.on('data', data => {
                    body += data;
                });

                req.on('end', () => {
                    const jsonObj = JSON.parse(body);
                    let message;
                    let success;
                    if (jsonObj !== undefined && jsonObj.cmd !== undefined ) {
                        const output = outputMesage(jsonObj.cmd);
                        if (output instanceof Error) {
                            message =  output.message;
                            success = false;
                        } else if (typeof output == 'string') {
                            message = output;
                            success = true;
                        } else {
                            success = true;
                        }

                        const currentPos = bus.currentPosition();
                        res.writeHead(200, {'Content-Type' : 'application/json'});
                        res.write(JSON.stringify({message, success, currentPos}));
                        res.end();
                    } 
                    else {
                        return;
                    }
                });
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
        }).listen(port, 'localhost');

        console.log(`Server running on port ${port}`);
    }
    else { // this piece of code is for reading commands from a file
        try {
            fs.accessSync(argv[0], fs.F_OK | fs.R_OK)
        } catch (e) {
            stderr.write(messenger.getMessage({
                msg: 'fileNotFound',
                fileName: argv[0]
            }));
            process.exit();
        }

        stderr.write(messenger.getMessage({
            msg: 'fileRead',
            fileName: argv[0],
                        eol: EOL
        }));

        rl = readline.createInterface({
            input: fs.createReadStream(argv[0]),
            terminal: false
        });

        // event handler. is called when a line is read from a file
        rl.on('line', line => {
            stdout.write(line + EOL);
            outputMesage(line);
        });

        // event handler. is called when all the lines in a file have been read
        // closes a stream and exit
        rl.on('close', () => {
            rl.close();
            process.exit();
        });
    }
}


/**
 * This parser encapsulates the task of reading a user's input, either form CLI
 * or from a file.
 *
 * @param  {String} cmd A command from a user, like "PLACE, MOVE, etc."
 * @return {Error|String|Object} Returns either an Error instance, or a message
 * string, or the bus instance. A successful action returns bus's instance.
 * @private
 */
const processCmd = cmd => {
    let res;
    // PLACE X(,| )Y(,| )F(  *)
    if (cmd.match(/^\s*place\s+\w+(?:,?\s*|\s+)\w+(?:,?\s*|\s+)\w+\s*$/i)) {
        const params = cmd.trim().split(/(?:\s+|,\s*)/i).slice(1);
        res = bus.place(params[0], params[1], params[2]);
    } else if (cmd.match(/^move\s*$/i)) {
        res = bus.move();
    } else if (cmd.match(/^left\s*$/i)) {
        res = bus.left();
    } else if (cmd.match(/^right\s*$/i)) {
        res = bus.right();
    } else if (cmd.match(/^report\s*$/i)) {
        res = bus.report();
    } else {
        res = new Error(messenger.getMessage({
            msg: 'unknownCommand'
        }));
    }
    return res;
};

/**
 * Sends a response from processCmd() to stdout or stderr
 * @param  {Error|String|Object} either an Error instance, or a message string,
 * or bus instance.
 * @return {undefined}      no return. the func only sends to stdout or stderr
 */
var outputMesage = data => {
    let res;
    const _data = data.trim();

    if (_data.match(/(q|quit|exit)/i))
        process.exit();

    res = processCmd(_data);

    // send response to UI if being operated from the UI
    if (argv[0] !== undefined && argv[0].includes('--port')) {
        return res;
    } else {
        if (res instanceof Error) {
            stdout.write(`${res.message + EOL}> `);
        } else if (typeof res == 'string') {
            stdout.write(`${res + EOL}> `);
        } else {
            stdout.write('> ');
        }
    }
};


/**
 * BusSimulator class
 * It has only one static method .run() to start the app
 */
class BusSimulator {
    /**
     * @static
     */
    static run() {
        stdout.write(`${messenger.getMessage({
    msg: 'welcome',
    eol: EOL
}) + EOL}> `);
        stdin.resume();
    }
}

export default BusSimulator;

