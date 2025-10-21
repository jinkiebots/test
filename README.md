# Windows 95 Style Website

An interactive, nostalgic Windows 95-themed website built with React and @react95/core.

## Features

- Classic Windows 95 desktop with teal background
- Desktop icons (My Computer, Notepad, About)
- Draggable windows
- Working Start menu/TaskBar
- Functional Notepad application
- My Computer with tabbed interface
- Live clock in the taskbar
- Authentic Windows 95 UI components and styling

## Setup Instructions

### Fix npm Cache Issue (if needed)

If you encounter npm permission errors, run:

```bash
sudo chown -R 501:20 "/Users/melodyyu/.npm"
```

### Installation

1. Navigate to the project directory:
```bash
cd win95-app
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- React 19.1.1
- Vite 7.1.7
- @react95/core 9.6.2
- @react95/icons 2.2.0

## Explore the Interface

- Click on desktop icons to open windows
- Use the Start button (bottom-left) to access the Programs menu
- Close windows using the × button
- Type in the Notepad window
- Switch between tabs in My Computer
- Enjoy the nostalgic Windows 95 experience!
