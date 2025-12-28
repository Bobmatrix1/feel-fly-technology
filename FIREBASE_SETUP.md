# Firebase Setup Guide for Feel-Fly Technology Portfolio

## Firebase Configuration

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `feel-fly-technology`
4. Follow the setup wizard

### 2. Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Create an admin user:
   - Email: `admin@feel-flytechnology.com`
   - Password: (Your secure password)

#### Firestore Database
1. Go to **Firestore Database**
2. Click **Create Database**
3. Start in **Production mode**
4. Choose a location closest to your users

#### Storage
1. Go to **Storage**
2. Click **Get Started**
3. Use default security rules for now

### 3. Get Firebase Configuration

1. In Project Settings (⚙️ icon)
2. Scroll to "Your apps"
3. Click web icon (</>) to create a web app
4. Register app with nickname: "Feel-Fly Portfolio"
5. Copy the Firebase configuration object

### 4. Update Configuration in Code

Open `/src/lib/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Firestore Database Structure

### Collection: `site`
Document: `config`
```json
{
  "title": "Feel-Fly Technology",
  "mission": "Mission statement...",
  "about": "About text...",
  "contact": {
    "email": "info@feel-flytechnology.com",
    "phone": "+234 XXX XXX XXXX",
    "address": "Nigeria"
  },
  "social": {
    "linkedin": "URL",
    "twitter": "URL",
    "instagram": "URL"
  },
  "logo": "CLOUDINARY_URL",
  "theme": "dark"
}
```

### Collection: `members`
Document ID: Auto-generated or custom
```json
{
  "name": "Member Name",
  "role": "Position Title",
  "bio": "Member biography",
  "avatar": "CLOUDINARY_URL",
  "socials": {
    "github": "URL",
    "linkedin": "URL",
    "portfolio": "URL"
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "image": "CLOUDINARY_URL"
    }
  ],
  "gallery": ["CLOUDINARY_URL_1", "CLOUDINARY_URL_2"]
}
```

### Collection: `admins`
Document ID: User email
```json
{
  "email": "admin@feel-flytechnology.com",
  "isAdmin": true,
  "createdAt": "TIMESTAMP"
}
```

## Cloudinary Setup for Image Uploads

### 1. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Note your Cloud Name, API Key, and API Secret

### 2. Integration Methods

#### Option A: Upload Widget (Recommended)
```typescript
// Add to component
import { Cloudinary } from '@cloudinary/url-gen';

const handleImageUpload = () => {
  window.cloudinary.openUploadWidget({
    cloudName: 'YOUR_CLOUD_NAME',
    uploadPreset: 'YOUR_UPLOAD_PRESET',
    sources: ['local', 'url'],
    multiple: false,
    resourceType: 'image'
  }, (error, result) => {
    if (!error && result.event === 'success') {
      const imageUrl = result.info.secure_url;
      // Save imageUrl to Firestore
    }
  });
};
```

#### Option B: Direct Upload
Use Cloudinary's signed upload API with your backend or serverless functions.

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /site/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    match /members/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    match /admins/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Initial Data Population

Use the Firebase Console to manually create initial documents:

1. Go to Firestore Database
2. Create collections: `site`, `members`, `admins`
3. Add documents with the structure shown above
4. Use the mock data from `/src/data/mockData.ts` as reference

## Admin Access

1. Create admin user in Authentication
2. Create corresponding document in `admins` collection
3. Login at `/admin` route
4. Access dashboard at `/admin/dashboard`

## Testing

1. **Public Pages**: Visit `/` to see the home page
2. **Member Profiles**: Click on team cards to view profiles
3. **Admin Login**: Visit `/admin` and login with admin credentials
4. **Dashboard**: After login, access `/admin/dashboard` to manage content

## Deployment

For production deployment:
1. Update Firebase security rules
2. Enable Firebase Hosting
3. Build the app: `npm run build`
4. Deploy: `firebase deploy`

## Support

For issues or questions:
- Firebase Documentation: https://firebase.google.com/docs
- Cloudinary Documentation: https://cloudinary.com/documentation
- Feel-Fly Technology: info@feel-flytechnology.com
