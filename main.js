const vm = require('vm');
const path = require('path');
const fs = require('fs');

const sandbox = {
    fs: {
        rmSync: (...params) => {
            throw new Error('This is a danger function');
        },
        readFileSync: (file) => {
            return fs.readFileSync(file);
        }
    }
};
vm.createContext(sandbox); // Contextify the sandbox.

const content = fs.readFileSync('./raw-code.txt', 'utf-8');
vm.runInContext(content, sandbox);

if (!sandbox['getMessageAsync']) {
    throw new Error('getMessageAsync method is required');
}

Promise.resolve(sandbox['getMessageAsync']())
    .then(m => {
        console.log('Got message object with content: ' + m.message);
    });

