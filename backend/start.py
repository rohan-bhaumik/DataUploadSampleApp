#!/usr/bin/env python3
"""
Startup script for the E-Commerce Portal API
"""
import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("Installing Python dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def start_server():
    """Start the FastAPI server"""
    print("Starting E-Commerce Portal API server...")
    print("API will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    
    # Import and run
    import uvicorn
    from main import app
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Install dependencies if they don't exist
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
    except ImportError:
        install_requirements()
    
    # Start the server
    start_server()
