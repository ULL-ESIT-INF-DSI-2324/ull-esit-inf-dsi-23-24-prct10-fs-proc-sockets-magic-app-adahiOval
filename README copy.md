[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct09-filesystem-magic-app-adahi-oval)

## Introducción

En esta práctica se presenta 1 ejercicio para familiarizarnos con el modulo yargs y el modulo chalk, así como con los principios SOLID. Para ello se han desarrollado este ejercicio en la carpeta `src` y sus correspondientes pruebas en la carpeta `test`. 

Para la instalación de las dependencias necesarias para hacer funcionar el código solo es necesario el comando:

```bash
npm install
```

## Objetivos

Los objetivos de esta práctica son la familiarización con los modulos yargs y chalk, así como los principios SOLID de programación orientada a objetos y también la implementación de coveralls en nuestro código. 

## Clases

Las clases desarrolladas para esta práctica son las siguientes:

 - Card: Clase base de los distintos tipos de cartas, con sus correspondientes atributos
 - CardCollection: Coleccion de cartas.
 - CardCollectionReader: Lector de Coleccion de cartas a partir de un directorio de un usuario
 - CardCollectionPrinter: Printer de una coleccion de cartas dada
 - CardCollectionWriter: Escritor de la coleccion de cartas en el directorio del usuario de la misma
 - CardReader: Lector de carta individual a partir de un objeto JSON

### Card

Esta es la clase base de los distintos tipos de cartas. Es una clase abstracta cuyo constructor tiene los atributos mínimos compartidos por todas las cartas. De ella se crea una clase diferente para cada tipo de carta:

- Tierra
- Encantamiento
- Conjuro
- Instantaneo
- Artefacto
- Criatura: Con el atributo adicional `stats`
- Planeswalker: Con el atributo adicional `loyalty`

También se define un método abstracto `print()` que cada una de las clases hijas implementa propiamente.

### CardCollection

Esta es la clase que representa una colección de cartas de un usuario dado. Su constructor recibe un array de objetos tipo `Card` y un string con el nombre de usuario. Dentro de esta clase se encuentran los siguientes métodos:

- `addCard`: Este es el método para añadir una carta a la colección, se le pasa una carta por parámetro y la añade al array de cartas de la colección
- `updateCard`: Este método modifica una carta existente, se le pasa una carta y elimina la carta existente con el mismo ID y añade la nueva carta dada por parametro.
- `deleteCard`: Este método elimina una carta de la colección, se le pasa un ID por parámetro que comprueba si existe primero y luego filtra la colección para que devuelva un nuevo array con los IDs que no coinciden.
- `showCard`: Este método muestra la información de una sola carta por consola, se le pasa un ID que busca en la colección e invoca el método print de la carta concreta.
- `listCollection`: Este método lista todas las cartas de la colección, para ello crea un objeto `CardCollectionPrinter` que toma la propia coleccion, y luego invoca a su método print que a su vez invoca el metodo print de todas las cartas de la colección.

### CardCollectionReader

Esta clase se encarga de leer las cartas del directorio de un usuario dado. Para ello, se le pasa el nombre de usuario en el constructor, que se encarga de crear la ruta relativa al directorio del usuario utilizando el módulo `path` de la siguiente manera:

```typescript
constructor(private user: string) {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const fatherdir = path.resolve(__dirname, '..');
  this.route = path.join(fatherdir, `database/users/${this.user}`);
}
```

Luego hace uso de un método `readDir` que lee todo el directorio con la ruta anterior, probando su existencia primero, y para cada archivo encontrado, llama al método `JSON.parse` y crea un objeto `CardReader` con ese resultado, luego hace uso del método `returnCard` del objeto `CardReader` que devuelve una Carta ya creada y la añade al array de la colección:

```typescript
const cards = fs.readdirSync(this.route);

cards.forEach((card) => {

  const content: string = fs.readFileSync(`${this.route}/${card}`, 'utf-8');
  const data: CardShape = JSON.parse(content);
  const reader: CardReader = new CardReader(data);

  this.collection.push(reader.returnCard());

});
```

### CardCollectionWriter

Esta es la clase encargada de escribir los resultados de las operaciones sobre la colección en el directorio del usuario inicial. Para ello, hace uso del método `write()` que primero borra todos los archivos del directorio del usuario, para luego escribir las cartas de la colección cada una en un archivo `JSON` separado. Se ha optado por esta forma ya que simplifica mucho el manejo del sistema de archivos del ordenador.

```typescript
write(): void {
  const files: string[] = fs.readdirSync(this.route);
  files.forEach((file) => {
    const filePath: string = path.join(this.route, file);
    fs.unlinkSync(filePath);
  });

  this.collection.collection.forEach((card) => {
    const cardPath: string = path.join(this.route, `${card.name}.json`);
    fs.writeFileSync(cardPath, JSON.stringify(card));
  });
}
```

## magic-app.ts

Este es el archivo principal del ejercicio. En él se utiliza el módulo `yargs` para parsear los argumentos dados por la línea de comandos y ejecutar la lógica del programa según corresponda. Para ello, se hacen uso de llamadas a `.command` una por cada operación que podamos hacer sobre la colección, estas son:

- add: añadir una carta
- remove: elminar una carta
- update: modificar una carta
- read: mostrar una carta por ID
- list: mostrar todas las cartas

El orden de ejecución de cada comando es el siguiente:

1. Se crea un objeto `CardCollectionReader` que lee el directorio del usuario dado en el parámetro `--user`.
2. Se crea un objeto `CardCollection` a partir de la colección leída en el paso anterior.
3. Se crea una carta (si fuese necesario) con los datos pasados por línea de comandos.
4. Se llama al método de `CardCollection` correspondiente a la operación dada, por ejemplo `addCard()` en caso de que sea un comando `add`.
5. Se crea un objeto `CardCollectionWriter` a partir de la nueva colección.
6. Se escribe la nueva colección en el directorio del usuario.

## Ejercicio PE

En el ejercicio PE de esta semana, se ha trabajado con la API Síncrona de Node así como con el patrón de diseño **Plantilla** o ***Template***. Para ello se desarrolló una clase abstracta `BagReader`, y de ella dos clases concretas `JSONReader` y `CSVReader`. En cada una de ella se implementaba el método `procesar()` que según la clase se implementaba para parsear argumentos de diferente manera, en el caso de CSV se tomaban en cuenta las comas y el orden para parsear los argumentos y retornar los beneficios y los pesos. Y en el caso de JSON se utilizaba `JSON.parse` para leer los diferentes campos en objetos con una forma estipulada por interfaces `BagJSON`y `ElementJSON`.

## Conclusiones

En esta práctica se ha profundizado en el desarrollo de código según los principios SOLID, así como familiarizarse con el uso de módulos `chalk` y `yargs`, así como de la API Síncrona de Node.js para el manejo del sistema de archivos. También del cubrimiento del código mediante Coveralls, la documentación del mismo mediante Typedoc y la gestión de calidad mediante SonarCloud.

## Bibliografía

- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/)
  - [Principios SOLID](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/typescript-solid.html)
  - [Patrones de diseño en typescript](https://ull-esit-inf-dsi-2324.github.io/typescript-theory/typescript-patterns.html#strategy)
- [Apuntes de la asignatura sobre Node.js](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/)