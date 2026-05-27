#!/bin/bash
# HRMS API Test Runner
# Usage: ./run-tests.sh [base-url]
# Example: ./run-tests.sh http://localhost:5000

BASE_URL=${1:-"http://localhost:5000"}
COLLECTION="$(dirname "$0")/HRMS_Collection.postman_collection.json"
REPORT_DIR="$(dirname "$0")/reports"

mkdir -p "$REPORT_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "========================================"
echo "  HRMS API Test Runner"
echo "  Base URL: $BASE_URL"
echo "========================================"

# Check Newman is installed
if ! command -v newman &> /dev/null; then
  echo "Newman not found. Installing..."
  npm install -g newman newman-reporter-htmlextra
fi

# Run tests with HTML report
newman run "$COLLECTION" \
  --env-var "baseUrl=$BASE_URL" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export "$REPORT_DIR/report_$TIMESTAMP.html" \
  --reporter-htmlextra-title "HRMS API Test Report" \
  --delay-request 100 \
  --timeout-request 10000

EXIT_CODE=$?

echo ""
echo "========================================"
echo "  Report saved: reports/report_$TIMESTAMP.html"
echo "  Open with:  open $REPORT_DIR/report_$TIMESTAMP.html"
echo "========================================"

open "$REPORT_DIR/report_$TIMESTAMP.html" 2>/dev/null || true

exit $EXIT_CODE
