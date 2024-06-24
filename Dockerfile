FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

#RUN npm run build
# copy .next folder into the docker next folder in the next directory 
#COPY .next ./.next
CMD ["npm","run","dev"]


