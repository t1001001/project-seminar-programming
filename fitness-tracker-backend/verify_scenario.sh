#!/bin/bash
BASE_URL="http://localhost:8080/api/v1"

# Function to extract ID from JSON
get_id() {
  echo "$1" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])"
}

# Wait for server to be ready
echo "Waiting for server to start..."
for i in {1..30}; do
    if curl -s "$BASE_URL/exercises" > /dev/null; then
        echo "Server is up!"
        break
    fi
    sleep 2
done

# 1. Create Exercise
echo "Creating Exercise..."
RESP=$(curl -s -X POST "$BASE_URL/exercises" -H "Content-Type: application/json" -d '{"name":"Burpees","category":"Cardio","muscleGroups":["Full Body"],"description":"Burpees"}')
echo "Response: $RESP"
EXERCISE_ID=$(get_id "$RESP")
echo "Exercise ID: $EXERCISE_ID"

if [ -z "$EXERCISE_ID" ] || [ "$EXERCISE_ID" == "null" ]; then
    echo "Failed to create exercise"
    exit 1
fi

# 2. Create Session
echo "Creating Session..."
RESP=$(curl -s -X POST "$BASE_URL/sessions" -H "Content-Type: application/json" -d "{\"name\":\"Test Session\",\"scheduledDate\":\"2025-11-22\",\"exerciseExecutions\":[\"$EXERCISE_ID\"]}")
echo "Response: $RESP"
SESSION_ID=$(get_id "$RESP")
echo "Session ID: $SESSION_ID"

if [ -z "$SESSION_ID" ] || [ "$SESSION_ID" == "null" ]; then
    echo "Failed to create session"
    exit 1
fi

# 3. Verify Session contains Exercise
echo "Verifying Session contains Exercise..."
RESP=$(curl -s -X GET "$BASE_URL/sessions/$SESSION_ID")
if echo "$RESP" | grep -q "$EXERCISE_ID"; then
  echo "SUCCESS: Session contains Exercise."
else
  echo "FAILURE: Session does not contain Exercise."
  echo "Response: $RESP"
  exit 1
fi

# 4. Delete Exercise
echo "Deleting Exercise..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/exercises/$EXERCISE_ID")
if [ "$STATUS" -eq 204 ]; then
    echo "Deletion successful (204)."
else
    echo "Deletion failed with status $STATUS."
    exit 1
fi

# 5. Verify Session does not contain Exercise
echo "Verifying Session again..."
RESP=$(curl -s -X GET "$BASE_URL/sessions/$SESSION_ID")
if echo "$RESP" | grep -q "$EXERCISE_ID"; then
  echo "FAILURE: Session still contains Exercise."
  echo "Response: $RESP"
  exit 1
else
  echo "SUCCESS: Session does not contain Exercise."
  echo "Final Session JSON: $RESP"
fi
