#!/bin/bash
# Seclock Application Launcher Script
echo "=========================================================================="
echo " Starting Seclock: Legally-Aware Digital Inheritance & Access Vault "
echo "=========================================================================="

export PATH=$PATH:/usr/local/bin:/Library/Frameworks/Python.framework/Versions/3.12/bin

/usr/local/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
