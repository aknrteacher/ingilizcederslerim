# Classroom Monitoring Setup Guide

This guide explains how to enable and use the Classroom Monitoring system with speech recognition.

## 🚀 Quick Start

### 1. Start the Development Server

```bash
cd Ingilizce-Derslerim
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in your PORT environment variable).

### 2. Access the Classroom Monitoring Page

Navigate to one of these URLs:
- **Public access**: `http://localhost:5000/classroom`
- **Admin protected**: `http://localhost:5000/admin/classroom` (requires admin password)

## 🎤 Speech Recognition Setup

### Browser Requirements

Speech recognition uses the **Web Speech API**, which is supported in:

✅ **Supported Browsers:**
- Google Chrome (recommended)
- Microsoft Edge (Chromium-based)
- Safari (iOS 14.5+, macOS 11+)
- Opera

❌ **Not Supported:**
- Firefox (does not support Web Speech API)
- Older browsers

### Enabling Speech Recognition

1. **Grant Microphone Permission**
   - When you click "Start Voice Input", your browser will ask for microphone permission
   - Click "Allow" to enable speech recognition
   - **Important**: The page must be served over HTTPS in production, or use `localhost` for development

2. **HTTPS Requirement (Production)**
   - Speech recognition requires HTTPS in production environments
   - For local development, `localhost` works without HTTPS
   - For production, ensure your site is served over HTTPS

3. **Mobile Devices**
   - Works great on mobile phones (iOS Safari, Chrome Mobile)
   - Make sure to grant microphone permissions in your device settings

## 🎯 Voice Commands

Once speech recognition is enabled, you can use these voice commands:

### Navigation Commands

| Command | Example | Action |
|---------|---------|-------|
| **Class Selection** | "2 - a", "2 a", "grade 2 a" | Opens class 2-A |
| **Tab Navigation** | "assignments" | Switches to assignments tab |
| | "participation" | Switches to participation tab |
| | "students" | Switches to students tab |

### Student & Points Commands

| Command | Example | Action |
|---------|---------|-------|
| **Select Student** | Say student's name | Selects that student |
| **Add Participation Point** | "plus", "add point" | Adds +1 participation point |
| **Add Assignment Point** | "assignment", "homework" | Adds +1 assignment point |

### Example Workflow

1. Say: **"2 - a"** → Opens class 2-A
2. Say: **"assignments"** → Switches to assignments tab
3. Say: **"John Doe"** → Selects student John Doe
4. Say: **"plus"** → Adds a participation point for John Doe this week

## 📊 Features

### Class Management
- Create new classes with grade and section
- View all classes in the sidebar
- Select a class to view its students and data

### Student Management
- Add students to classes
- View all students in a class
- See participation and assignment counts per student

### Weekly Tracking
- Automatically tracks data by week (Monday to Sunday)
- Each week starts fresh for participation/assignments
- View current week's data at the top of the page

### Real-time Updates
- Changes are saved immediately
- Data refreshes automatically after mutations
- Visual feedback with toast notifications

## 🔧 Backend API Endpoints

All endpoints are prefixed with `/api/classroom`:

### Classes
- `GET /api/classroom/classes` - Get all classes
- `GET /api/classroom/classes/:id` - Get class by ID
- `GET /api/classroom/classes/name/:name` - Get class by name
- `POST /api/classroom/classes` - Create new class

### Students
- `GET /api/classroom/students/:classId` - Get students for a class
- `POST /api/classroom/students` - Add student to class

### Participation
- `GET /api/classroom/participation/:classId/:week` - Get participation data
- `POST /api/classroom/participation/point` - Add participation point
- `POST /api/classroom/participation/assignment` - Add assignment point

## 🗄️ Data Storage

Currently, the system uses **in-memory storage**, which means:
- ✅ Data persists during the server session
- ❌ Data is lost when the server restarts

### Future: Database Integration

The schema is ready for PostgreSQL integration. To enable database storage:

1. Set up your PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Run migrations: `npm run db:push`
4. Update storage implementation to use Drizzle ORM

## 🐛 Troubleshooting

### Speech Recognition Not Working?

1. **Check Browser Support**
   - Make sure you're using Chrome, Edge, or Safari
   - Firefox does not support Web Speech API

2. **Check Microphone Permission**
   - Go to browser settings → Privacy → Microphone
   - Make sure the site has permission
   - Try refreshing the page and granting permission again

3. **Check HTTPS (Production)**
   - Speech recognition requires HTTPS in production
   - For development, `localhost` works without HTTPS

4. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for errors in the Console tab
   - Common errors:
     - "Speech recognition is not supported" → Wrong browser
     - "Permission denied" → Microphone permission not granted
     - "Network error" → Check your internet connection

### Backend Not Responding?

1. **Check Server is Running**
   ```bash
   # Should see: "serving on port 5000"
   ```

2. **Check API Endpoints**
   - Open browser DevTools → Network tab
   - Try making a request manually
   - Check for CORS errors (shouldn't happen on same origin)

3. **Check Server Logs**
   - Look at terminal where server is running
   - API requests should be logged automatically

### Data Not Persisting?

- Remember: Currently using in-memory storage
- Data is lost on server restart
- To persist data, set up database integration

## 📱 Mobile Usage Tips

1. **Use Chrome or Safari** on mobile
2. **Grant microphone permission** when prompted
3. **Speak clearly** and wait for confirmation
4. **Check the transcript** to see what was heard
5. **Use headphones** to reduce feedback

## 🎓 Best Practices

1. **Speak Clearly**: Enunciate class names and student names
2. **Wait for Confirmation**: Check the transcript to verify what was heard
3. **Use Consistent Naming**: Use the same format for class names (e.g., always "2-A" not "2 A" or "two a")
4. **Test First**: Create a test class and student to practice voice commands
5. **Check Weekly Reset**: Remember that data is tracked per week

## 🔐 Security Notes

- The `/admin/classroom` route is protected with admin password
- The `/classroom` route is public (consider adding authentication if needed)
- All API endpoints are currently public (consider adding authentication)
- In production, use HTTPS for speech recognition

## 📝 Next Steps

1. **Test the system** with a few test classes and students
2. **Practice voice commands** to get familiar with the workflow
3. **Set up database** if you need persistent storage
4. **Add authentication** if you need to restrict access
5. **Customize** the voice command parser for your specific needs

---

**Need Help?** Check the browser console for errors and the server logs for API issues.
