FROM mcr.microsoft.com/devcontainers/dotnet:1-10.0

# The upstream image currently contains an expired Yarn APT signing key.
# Yarn is not needed by this workshop, and the stale source breaks feature installation.
RUN rm -f /etc/apt/sources.list.d/yarn.list /etc/apt/sources.list.d/yarn.list.save
