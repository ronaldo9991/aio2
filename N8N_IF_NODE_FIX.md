# n8n IF Node Fix - Going to False Branch

## Problem
The IF node is going to the "false" branch instead of "true", so the HTTP Request node never executes.

## Root Cause
The IF node condition is not matching the data structure from the Function node.

## Solution

### Option 1: Check `hasError` Property

In your IF node, set the condition to:

**Condition Type:** Boolean
**Value 1:** `{{ $json.hasError }}`
**Operation:** `equals`
**Value 2:** `false`

OR

**Condition Type:** Boolean  
**Value 1:** `{{ $json.hasError }}`
**Operation:** `not equals`
**Value 2:** `true`

### Option 2: Check if `ticketRef` Exists (Recommended)

Since you need `ticketRef` to proceed, check if it exists:

**Condition Type:** String
**Value 1:** `{{ $json.ticketRef }}`
**Operation:** `is not empty`

OR

**Condition Type:** String
**Value 1:** `{{ $json.ticketRef }}`
**Operation:** `exists`

### Option 3: Simple Boolean Check

**Condition Type:** Boolean
**Value 1:** `{{ $json.hasError }}`
**Operation:** `is false`

---

## Recommended IF Node Configuration

### Step 1: Open IF Node Settings

1. Click on the IF node
2. Click "Edit" or double-click

### Step 2: Set Condition

**Mode:** Rules (not Expression)

**Rule 1:**
- **Field:** `hasError`
- **Operation:** `equals`
- **Value:** `false`

OR

**Rule 1:**
- **Field:** `ticketRef`
- **Operation:** `is not empty`

### Step 3: Test the Condition

After setting the condition, you should see:
- **True branch** → HTTP Request node (when `hasError === false` or `ticketRef` exists)
- **False branch** → Error handling or skip (when `hasError === true` or `ticketRef` is missing)

---

## Debugging: Check Function Node Output

To see what data the IF node is receiving:

1. Click on the "Code in JavaScript" node
2. Check the output data
3. Verify the structure is:
   ```json
   {
     "json": {
       "ticketRef": "T-20260120-7079",
       "message": "...",
       "hasError": false,
       ...
     }
   }
   ```

If the output shows `hasError: false` and `ticketRef` exists, but IF still goes to false, the condition syntax is wrong.

---

## Common Issues

### Issue 1: Wrong Property Path
❌ Wrong: `{{ $json.json.hasError }}`  
✅ Correct: `{{ $json.hasError }}`

### Issue 2: String vs Boolean
If `hasError` is a string `"false"` instead of boolean `false`:
- Use: `{{ $json.hasError }}` equals `"false"` (with quotes)

### Issue 3: Missing Property
If `hasError` doesn't exist in the output:
- Check Function node returns `hasError: false` in the `json` wrapper

---

## Quick Fix: Remove IF Node (Simplest)

If you want to skip error handling for now:

1. Delete the IF node
2. Connect "Code in JavaScript" directly to "HTTP Request"
3. The HTTP Request will fail if `ticketRef` is missing, but that's okay for testing

---

## Verify After Fix

1. Run test: `./test-n8n-inbound.sh`
2. Check n8n execution:
   - IF node should show green checkmark
   - Should go to "true" branch
   - HTTP Request should execute
3. Check ticket conversation for manager message

---

## Example: Complete IF Node Setup

```
IF Node Configuration:
├─ Mode: Rules
├─ Rule 1:
│  ├─ Field: hasError
│  ├─ Operation: equals
│  └─ Value: false
└─ Outputs:
   ├─ True → HTTP Request
   └─ False → (skip or error handling)
```
