# 🚀 Quick Start: Classroom Monitoring

## Enable Everything in 3 Steps

### Step 1: Start the Server
```bash
cd Ingilizce-Derslerim
npm run dev
```

### Step 2: Open the Page
Navigate to: **http://localhost:5000/classroom**

### Step 3: Enable Speech Recognition
1. Click **"Start Voice Input"** button
2. **Allow microphone access** when browser asks
3. Start speaking commands!

## 🎤 Voice Commands Cheat Sheet

| What to Say | What Happens |
|------------|--------------|
| **"2 - a"** | Opens class 2-A |
| **"assignments"** | Switches to assignments tab |
| **"John Doe"** | Selects student John Doe |
| **"plus"** | Adds participation point |
| **"assignment"** | Adds assignment point |

## 📱 First Time Setup

1. **Create a Class**
   - Click "Create Class" button
   - Enter: Name: `2-A`, Grade: `2`, Section: `A`
   - Click "Create Class"

2. **Add Students**
   - Select the class you created
   - Click "Add Student" button
   - Enter student name
   - Click "Add Student"

3. **Start Using Voice**
   - Click "Start Voice Input"
   - Say: **"2 - a"** to open your class
   - Say a student's name to select them
   - Say **"plus"** to add a point!

## ⚠️ Important Notes

- **Browser**: Use Chrome, Edge, or Safari (Firefox doesn't support speech recognition)
- **Microphone**: Must grant permission when asked
- **HTTPS**: Required in production (localhost works without HTTPS)
- **Data**: Currently stored in memory (lost on server restart)

## 🐛 Not Working?

1. **Speech recognition not starting?**
   - Check browser (must be Chrome/Edge/Safari)
   - Check microphone permission in browser settings
   - Try refreshing the page

2. **Backend not responding?**
   - Make sure server is running (`npm run dev`)
   - Check terminal for errors
   - Try accessing `/api/classroom/classes` directly

3. **Voice commands not working?**
   - Check the transcript box to see what was heard
   - Speak clearly and wait a moment
   - Try saying commands one at a time

## 📖 Full Documentation

See `CLASSROOM_SETUP.md` for complete documentation.
