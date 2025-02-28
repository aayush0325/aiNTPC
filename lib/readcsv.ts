import * as fs from 'fs';

let csvData = '';
try {
    csvData = fs.readFileSync('./lib/input.csv', 'utf-8');
    console.log('CSV data imported successfully');
} catch (err) {
    console.error('Error reading CSV file:', err);
    process.exit(1);
}

export default csvData;
