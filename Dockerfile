FROM node:14.15.4

#RUN npm install -g yarn
RUN mkdir -p /code
WORKDIR /code
COPY package.json yarn.lock ./
RUN yarn install && cd node_modules && rm -rf tui-calendar
COPY tui-calendar node_modules/tui-calendar
RUN cd node_modules/tui-calendar && npm install -D webpack-cli && npm run bundle
WORKDIR /code
#ENV PATH="./node_modules/.bin:$PATH"
COPY . /code/
RUN rm -rf /code/node_modules/react-scripts/config/webpackDevServer.config.js && mv webpackDevServer.config.js /code/node_modules/react-scripts/config/webpackDevServer.config.js
CMD ["yarn","start"]
