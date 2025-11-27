# Step 1: Use Node.js to build the app
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your code
COPY . .

# Step 5: Expose the port (React usually runs on 5173 or 3000)
EXPOSE 5173

# Step 6: Start the app
CMD ["npm", "run", "dev", "--", "--host"]