import fs from 'fs';
import path from 'path';

const srcDir = './src';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes("import React") && !content.includes("import * as React")) {
                content = "import React from 'react';\n" + content;
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

processDirectory(srcDir);
