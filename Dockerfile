FROM node:current-alpine

# Set working directory
WORKDIR /app

# Build args commonly passed during build-time (kept for compatibility)
ARG NEXT_PUBLIC_SESSION_MANAGER_URL
ARG NEXT_PUBLIC_COLLECTOR_URL
ARG NEXT_PUBLIC_CHATBOT_URL
ARG NEXT_PUBLIC_GTM_ID
ARG NODE_ENV
ARG NEXT_PUBLIC_CHATBOT_TENANT_ID
ARG NEXT_PUBLIC_CHATBOT_API_BASE_URL
ARG GITHUB_PACKAGES_TOKEN

ENV NEXT_PUBLIC_SESSION_MANAGER_URL=$NEXT_PUBLIC_SESSION_MANAGER_URL
ENV NEXT_PUBLIC_COLLECTOR_URL=$NEXT_PUBLIC_COLLECTOR_URL
ENV NEXT_PUBLIC_CHATBOT_URL=$NEXT_PUBLIC_CHATBOT_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NODE_ENV=$NODE_ENV
ENV NEXT_PUBLIC_CHATBOT_TENANT_ID=$NEXT_PUBLIC_CHATBOT_TENANT_ID
ENV NEXT_PUBLIC_CHATBOT_API_BASE_URL=$NEXT_PUBLIC_CHATBOT_API_BASE_URL
ENV GITHUB_PACKAGES_TOKEN=$GITHUB_PACKAGES_TOKEN
# Copy registry config and lockfiles before installing deps
COPY .npmrc ./
COPY package.json yarn.lock ./

# Install dependencies with token available only for this step
# Avoid printing the token in build logs by exporting it within the shell
RUN /bin/sh -lc 'export GITHUB_PACKAGES_TOKEN="$GITHUB_PACKAGES_TOKEN" && yarn install --frozen-lockfile'

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN yarn build

# Expose the application port (change if needed)
EXPOSE 3033

# Start the application
CMD ["yarn", "start"]
