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
WORKDIR /home/developer/workspace

# Clone on startup if not already cloned
ENTRYPOINT ["bash", "-c", "if [ ! -d .git ]; then git clone $REPO_URL . && git config user.email 'you@example.com' && git config user.name 'Your Name'; fi && /bin/bash"]
