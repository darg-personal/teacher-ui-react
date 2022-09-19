# Stage 1
FROM node:14 as react-build
WORKDIR /app
COPY . ./
RUN npm install
CMD ["npm", "start"]
