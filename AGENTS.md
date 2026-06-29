Here is the broken-down, technical layout of exactly **what each screen does** and the **data models** powering your database.

---

## 1. Application Screen Manifesto

### `login.tsx` (Entry & Authentication View)

* **What it does:** Captures the user's email input. It checks credentials against Firebase Authentication. If an entry is completely absent, it aborts the process and fires a localized native warning alert to prevent accidental account generation.
* **Layout Wrapper:** Wrapped inside a responsive keyboard management block (`KeyboardAvoidingView`) so the submission layout context remains fully viewable above the device virtual keyboard.

### `otp.tsx` (Secure Credential Verification View)

* **What it does:** Validates the second step of the onboarding sequence (Secure Token/Password processing).
* **State Behavior:** Upon successful validation, it triggers an automation script checking the underlying data platform. If it's a new registration, it instantly formats a persistent base document in your Firestore cluster.

### `(customer)/index.tsx` (Home Feed Hub)

* **What it does:** The traffic controller of your application.
* Computes a time-localized string greeting (`Good morning`, etc.) matched to the customer's account handle text dynamically via `currentUser.email`.
* Renders a static navigation grid (Property Registrations, Agreement Writing, etc.) using explicit, clean routing functions. Selecting these modules **only** executes navigation parameters; it performs zero database writes.
* Hosts a dual-state native `<Modal>` layout wrapper that renders either a fast agreement navigator profile or a localized "Request an Agent" dynamic text capture drawer.



### `(customer)/service/[id].tsx` (Dynamic Form Engine)

* **What it does:** Reads the incoming route identification string (`id`) to load a matching form schema array. It renders form components dynamically using the configuration mapping metrics.
* **Security Constraints:** Features a pre-execution guard script that scans all visible layout component data inputs locally. If empty values are present, it blocks database processing entirely and displays a layout alert banner.

### `(customer)/requests.tsx` (Active Dashboard Tracker)

* **What it does:** Establishes a live listener loop onto your Firestore collection. It formats responsive tracking cards detailing exact timeline updates, assignment tags, and submission files without needing page refreshes.

---

## 2. Core Firestore Data Models

Your application pipeline stores structure across two primary root collections in the Firestore database:

### Collection: `users`

* **Path:** `/users/{uid}`
* **Purpose:** Stores core profile details and handles feature accessibility privileges across protected routing blocks.

```json
{
  "uid": "string (Firebase Auth UID)",
  "email": "string (e.g., vidyadhar@example.com)",
  "role": "string (e.g., 'customer' | 'agent' | 'admin')",
  "activeStatus": "string ('active' | 'suspended')",
  "createdAt": "timestamp (ServerValue.TIMESTAMP)",
  "updatedAt": "timestamp (ServerValue.TIMESTAMP)"
}

```

### Collection: `service_requests`

* **Path:** `/service_requests/{requestId}`
* **Purpose:** Stores transaction logs, form data, and tracking fields for customer actions. It supports both manual dynamic form structures and field agent coordinate payloads.

```json
{
  "requestId": "string (Auto-generated Firestore UUID)",
  "customerId": "string (References users.uid)",
  "serviceType": "string (e.g., 'property_registration' | 'notary')",
  "status": "string ('pending' | 'in_review' | 'approved' | 'rejected')",
  
  "formData": {
    "partyOne": "string (Optional context field)",
    "surveyNumber": "string (Optional context field)",
    "complainantName": "string (Optional context field)"
  },
  
  "agentRequestData": {
    "customerAddress": "string (Captured from Request Agent Drawer)",
    "preferredSlot": "string ('morning' | 'afternoon' | 'evening')"
  },
  
  "createdAt": "timestamp (ServerValue.TIMESTAMP)",
  "updatedAt": "timestamp (ServerValue.TIMESTAMP)"
}

```