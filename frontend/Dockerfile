FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# FIX: Force permission for binaries
RUN chmod +x node_modules/.bin/vite

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]