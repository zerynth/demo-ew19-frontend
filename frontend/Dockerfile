FROM library/node:11-alpine

# Set up a folder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Now we can copy the code, then build React
COPY . /usr/src/app
RUN npm run build

# Expose default port
EXPOSE 3000

# Finally execute the server
CMD [ "npm", "start" ]
