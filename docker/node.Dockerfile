FROM node:18

WORKDIR /usr/local/app

RUN apt-get update && apt-get install -y python3 g++ make

COPY ./server .

RUN rm -rf node_modules

RUN npm install sqlite3

RUN npm install

RUN npm rebuild sqlite3

RUN npm install -g nodemon

EXPOSE 3000

CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm run migrate && node ./configurations/generateData/dataInit.js && nodemon index.js"]