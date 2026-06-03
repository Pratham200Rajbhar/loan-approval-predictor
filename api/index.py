import sys
import os

# Resolve backend path dynamically relative to this entrypoint
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
backend_dir = os.path.join(project_root, "backend")

# Insert backend directory to python path so module app can be imported
sys.path.insert(0, backend_dir)

# Programmatically set MODELS_DIR to point to backend/models inside the deployed folder.
# This overrides the default models/ configuration without needing a manual Vercel env variable.
if "MODELS_DIR" not in os.environ:
    os.environ["MODELS_DIR"] = os.path.join(backend_dir, "models")

# Import the FastAPI application
from app.main import app
