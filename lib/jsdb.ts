import fs from 'fs';

/**
 * A JSON based database
 */
export class JSDB {
    private data: any = [];
    constructor(public filepath: string){
        if(!fs.existsSync(filepath)){
            fs.writeFileSync(filepath, '[]');
        }
    }

    setData(data: any){
        this.data = data;
    }

    getData(): any {
        return this.data
    }

    /**
     * Writing data into file as json string 
     */
    write(){
        const json = JSON.stringify(this.data); 
        fs.writeFileSync(this.filepath, json); 
    }

    /**
     * Reading data from file and parse into object 
     */
    read(): any {
        const json = fs.readFileSync(this.filepath, 'utf-8');
        try{
            this.data = JSON.parse(json);
            return this.data
        } catch(error){
            console.log('Something error', error);
            return null;
        }
    }
}