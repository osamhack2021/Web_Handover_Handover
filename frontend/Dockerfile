FROM node:14

WORKDIR /app/frontend
# COPY package.json .
COPY . .

RUN npm install

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$API_BASE_URL

CMD npm run build && npm start
