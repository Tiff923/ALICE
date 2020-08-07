FROM node:latest
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json ./
COPY ./package-lock.json ./
RUN rm -rf node_modules
RUN npm install --no-progress --ignore-optional
COPY . ./
EXPOSE 3000
CMD npm start
