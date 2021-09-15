FROM node:12

WORKDIR /backend
COPY . .

RUN npm install
# RUN npm install -g pm2
RUN npm install -g mongoose
RUN npm install -g nodemon
CMD ["npm", "start"]
# CMD ["pm2", "start", "app.js", "--watch"]

# "start": "nodemon --watch . app.js"