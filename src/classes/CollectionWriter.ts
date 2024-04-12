import path from 'path';
import fs from 'fs';
import { CardCollection } from './Collection.js';


export class CardCollectionWriter {
  private route: string = '';

  /**
   * El constructor de la clase, se encarga de crear la ruta hasta el directorio del usuario dado
   * @param user El usuario del que se crea el objeto colección
   */
  constructor(private collection: CardCollection) {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const fatherdir1 = path.resolve(__dirname, '..');
    const fatherdir = path.resolve(fatherdir1, '..');
    this.route = path.join(fatherdir, `src/database/users/${this.collection.user}`);
  }

  clean(callback: (err: string | undefined) => void): void {
    fs.readdir(this.route, (err, files) => {
      if (err) {
        throw new Error(err.message);
      } else {
        if(files.length == 0) {
          callback(undefined);
        } else {
          let fileCount = 0;
          files.forEach((file) => {
            const filePath: string = path.join(this.route, file);
            fs.unlink(filePath, (err) => {
              if (err) {
                throw new Error(err.message);
              } else {
                fileCount++;
                if(fileCount === files.length) {
                  callback(undefined);
                }
              }
            });
          });
        }
      }
    });
  }

  write(): void {
    this.clean((err) => {
      if(err){
        throw new Error(err);
      } else {
        this.collection.collection.forEach((card) => {
          const cardPath: string = path.join(this.route, `${card.name}.json`);
          fs.writeFile(cardPath, JSON.stringify(card), (err) => {
            if (err) {
              throw new Error(err.message);
            }
          });
        });
      } 
    });
  }

  /*
      write(): void {
    fs.readdir(this.route, (err, files) => {
      files.forEach((file) => {
        const filePath: string = path.join(this.route, file);
        fs.unlink(filePath, (err) => {
          if(err){
            throw new Error(err.message);
          } else {
            
          }
        });
      });
    });

    this.collection.collection.forEach((card) => {
      const cardPath: string = path.join(this.route, `${card.name}.json`);
      fs.writeFileSync(cardPath, JSON.stringify(card));
    });

  }
  */
}