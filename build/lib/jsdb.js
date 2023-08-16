import fs from 'fs';
/**
 * A JSON based database
 */
export class JSDB {
    constructor(filepath) {
        this.filepath = filepath;
        this.data = [];
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, '[]');
        }
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    /**
     * Writing data into file as json string
     */
    write() {
        const json = JSON.stringify(this.data);
        fs.writeFileSync(this.filepath, json);
    }
    /**
     * Reading data from file and parse into object
     */
    read() {
        const json = fs.readFileSync(this.filepath, 'utf-8');
        try {
            this.data = JSON.parse(json);
            return this.data;
        }
        catch (error) {
            console.log('Something error', error);
            return null;
        }
    }
}
