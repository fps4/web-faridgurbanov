FROM node:current-alpine

# Set working directory
WORKDIR /app

# Provide GitHub Packages token at build-time only
ARG NODE_AUTH_TOKEN

# Copy registry config and lockfiles before installing deps
COPY .npmrc ./
COPY package.json yarn.lock ./

# Install dependencies with token available only for this step
# Avoid printing the token in build logs by exporting it within the shell
RUN /bin/sh -lc 'export NODE_AUTH_TOKEN="$NODE_AUTH_TOKEN" && yarn install --frozen-lockfile'

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the application port (change if needed)
EXPOSE 3033

# Start the application
CMD ["yarn", "start"]
