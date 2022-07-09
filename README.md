# dev-media-api-node
API desenvolvida para o teste prático para desenvolvedores back-end da empresa QuikDev

## Stack utilizada
Construi essa API com **nodeJS**(versão 16.16.0) em **typescript**(versão 4.7.4) pois é a stack com a qual melhor me identifico e tenho mais facilidade de trabalho, e também pela performance e versatilidade que o nodeJS tras. O servidor HTTP foi instanciado utilizando o pacote **express** do node.

O banco de dados foi feito utilizando **SQLite** pois como esse é um projeto pequeno e para um teste ele seria o mais fácil e rápido de instanciar para executar os testes.  

## Dependências
As dependencias adicionadas nesse projeto foram:

### Dev dependencies:
 - nodemon(2.0.19)
 - ts-node(10.8.2)
 - typescript(4.7.4)
### Dependencies:
 - express(4.18.1)
 - dotenv(16.0.1)
 - cors(2.8.5)
 
## Inicialização do projeto
Verificar a instalação do [nodeJS](https://nodejs.org/en/download/) e do [typescript CLI](https://www.typescriptlang.org/download) na máquina.
```
  #primeiro deve ser gerada a build
  npm run build
  ou
  yarn build
  
  #então é só iniciar
  npm run start
  ou
  yarn start
```
