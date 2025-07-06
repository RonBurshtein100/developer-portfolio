#!/bin/bash

echo "Starting portfolio server on port 8085..."
echo "Portfolio will be available at: http://localhost:8085"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8085
