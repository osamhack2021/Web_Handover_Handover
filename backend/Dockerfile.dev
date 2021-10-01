FROM node:14

# following will only run when the package.json is changed
COPY package.json /tmp/package.json
RUN cd /tmp && npm install && cd ..
RUN mkdir -p /app/backend && cp -a /tmp/node_modules /app/backend/

# load applicaton code on top of cache if available
WORKDIR /app/backend
COPY . .

CMD npm start
