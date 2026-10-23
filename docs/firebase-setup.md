# Setting up Firebase for the admin side

The game works without Firebase, using the built-in data. Firebase adds reviewer accounts, live editing, comments, change history and pronunciation recordings. It all runs on the free Spark plan: pictures and recordings are kept small and stored in Firestore, so Cloud Storage is not needed.

## 1. Add a web app and copy its settings

In the Firebase console, open Project settings, then Your apps, and add a Web app. Copy the values from the `firebaseConfig` block into `FALLBACK` in `src/lib/firebase/config.ts`, or set them as environment variables in Vercel (Project, Settings, Environment Variables):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

These values are public by design. Access is controlled by the security rules.

## 2. Switch on sign-in

Authentication, Sign-in method: enable Email/Password, and Google if wanted. Under Authentication, Settings, Authorised domains, add the live domain (`nhaka-mutupo.vercel.app`) and `localhost`.

## 3. Create the database and publish the rules

Firestore Database, Create database, production mode, in a location close to Zimbabwe. Then open the Rules tab, replace everything with the contents of `firestore.rules` from this project and click Publish.

## 4. Choose the first admin

The email addresses in `BOOTSTRAP_ADMINS` (in `src/lib/firebase/config.ts`) and in `adminEmails()` (in `firestore.rules`) become admins the first time they sign in. Keep the two lists the same. Everyone else starts as "waiting for approval".

## 5. Starter data loads by itself

The first time the admin email signs in at `/admin` and the database is empty, the researched entries, pictures and sources are copied into Firestore automatically. Nothing already there is ever overwritten, and the "Import starter data" button stays available for adding new entries from the data files later.

The import also switches on **Live game: play entries waiting for review**, so children can play while review is under way. Unresolved entries are never playable. An admin can switch this off on the admin side once enough entries are verified; from then on only verified entries are playable.

## 6. Approve reviewers

Reviewers create their own accounts at `/admin`. They appear under People, where an admin approves them as reviewers.

## Collections

| Collection | Contents | Who can read | Who can write |
| --- | --- | --- | --- |
| `users` | Name, email and role of each account | The person and admins | The person (not their role) and admins |
| `totems` | Entries, plus a `notes` sub-collection for review comments | Anyone for verified entries (and waiting ones while `showPending` is on); reviewers for all | Reviewers; admins delete |
| `pictures` | Animal and symbol pictures | Anyone for verified pictures; reviewers for all | Reviewers; admins delete |
| `sources` | Sources | Anyone | Reviewers |
| `audio` | Pronunciation recordings | Anyone | Reviewers |
| `history` | Record of every change | Reviewers | Reviewers add; nobody edits |
| `settings` | `public.showPending`: whether entries waiting for review are playable | Anyone | Admins |
