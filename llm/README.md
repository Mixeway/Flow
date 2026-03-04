## 🏗️ Local LLM Infrastructure (Ollama + ROCm)
This deployment is based on Ollama, optimized for high-performance inference on AMD hardware.

📋 Prerequisites
* OS: Linux (Ubuntu recommended)
* Hardware: AMD iGPU/GPU with ROCm support.
* Drivers: /dev/kfd and /dev/dri are accessible.


⚙️ Configuration (.env)
```bash
OPENAI_MODEL=qwen2.5:0.5b
OPENAI_EMBEDDING_MODEL=nomic-embed-text:latest

OLLAMA_PORT=8000
OLLAMA_MAX_LOADED_MODELS=2
OLLAMA_CONTEXT_LENGTH=32768
OLLAMA_NUM_PARALLEL=1
OLLAMA_KEEP_ALIVE=-1
OLLAMA_HIP_VISIBLE_DEVICES=0
```

🐳 Docker Compose Architecture

1. Engine (llm-engine): Runs the core Ollama server with ROCm integration.
2. Initializer (llm-init): A one-time sidecar container. It handles:
* Pulling the weights for the `${OPENAI_EMBEDDING_MODEL}`.
* Pulling the weights for the `${OPENAI_MODEL}`.
