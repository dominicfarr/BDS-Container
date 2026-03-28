FROM node:22-bookworm

# Install essentials as root
RUN apt-get update && apt-get install -y \
    git curl wget vim nano \
    python3 python3-pip \
    build-essential \
    gh \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Create non-root user
RUN useradd -m -s /bin/bash developer && \
    mkdir -p /home/developer/workspace /home/developer/.claude/commands && \
    chown -R developer:developer /home/developer/workspace /home/developer/.claude

USER developer
# Configure git for Claude Code
RUN git config --global user.email "domincfarr@gmail.com" && \
    git config --global user.name "domincfarr"
WORKDIR /home/developer/workspace

# Clone on startup if not already cloned
# ENTRYPOINT ["bash", "-c", "if [ ! -d .git ]; then git clone $REPO_URL . && git config user.email 'you@example.com' && git config user.name 'Your Name'; fi && /bin/bash"]
# ENTRYPOINT ["bash", "-c", "if [ ! -d .git ]; then gh repo clone $GH_REPO . -- --depth=1; fi && /bin/bash"]
# ENTRYPOINT ["bash", "-c", "if [ ! -d .git ]; then git clone git@github.com:dominicfarr/BDS-Container.git . ; fi && /bin/bash"]
# ENTRYPOINT ["/bin/bash"]
# ENTRYPOINT ["bash", "-c", "echo $GH_TOKEN | gh auth login --with-token && /bin/bash"]
ENTRYPOINT ["bash", "-c", "if ! gh auth status &>/dev/null; then echo $GH_TOKEN | gh auth login --with-token; fi && if [ ! -d .git ]; then git clone git@github.com:dominicfarr/BDS-Container.git . ; fi && /bin/bash"]