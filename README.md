# Sketch-to-UI Converter

An AI-powered web application that converts hand-drawn UI sketches into functional React components with Tailwind CSS.

## Features

### 🎨 Interactive Drawing Canvas
- Draw UI mockups by hand with smooth brush strokes
- Multiple pen colors and adjustable brush sizes
- Clear canvas functionality

### 🤖 AI-Powered Code Generation
- Uses Claude Vision API to interpret sketches
- Generates clean React components with Tailwind CSS
- Recognizes buttons, cards, charts, lists, weather widgets, and more

### 👁️ Live Preview
- See your generated UI rendered in real-time
- Side-by-side comparison of sketch and result
- Isolated iframe rendering with Tailwind CSS

### 💻 Code Display & Export
- Syntax-highlighted code display
- One-click copy to clipboard
- Ready-to-use React/JSX code

### Previous Features (Dream Library)
- Vintage journal-style dream library interface
- Book catalog with checkout system
- Shared dream collection
- Mobile-responsive design

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

- **React 19**: Modern React with hooks
- **Vite 7**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Canvas API**: HTML5 drawing
- **Claude Vision API**: Anthropic's multimodal AI
- **Prism.js**: Syntax highlighting

## Quick Start

### 1. Get Your API Key
Visit [Anthropic Console](https://console.anthropic.com/) to get your Claude API key.

### 2. Draw Your UI
- Use the canvas to sketch buttons, cards, charts, or any UI elements
- Choose different colors and brush sizes
- Add a description for better results

### 3. Generate Code
- Click "Generate UI from Sketch"
- Watch as AI converts your drawing into React code
- View the live preview and copy the code

### 4. Use the Code
- Copy the generated React component
- Paste it into your project
- Customize as needed

## Documentation

For detailed documentation, see [SKETCH_TO_UI_README.md](./SKETCH_TO_UI_README.md)

## How It Works

1. **Draw**: Create your UI mockup on the canvas
2. **Capture**: Canvas image is converted to base64 PNG
3. **Analyze**: Claude Vision API interprets the sketch
4. **Generate**: AI creates React component with Tailwind CSS
5. **Render**: Code is displayed and previewed in real-time

## Supported UI Elements

The AI can recognize and generate:
- Buttons and interactive elements
- Cards and containers
- Weather widgets
- Charts and graphs (line, bar, pie)
- Lists and menus
- Text headers and labels
- Icons and decorations
- Forms and inputs
- Navigation bars
- And much more!

## Example Use Cases

- **Rapid Prototyping**: Sketch ideas and get code instantly
- **Design Handoff**: Convert mockups to code
- **Learning**: See how different UI patterns are implemented
- **Experimentation**: Try different designs quickly
- **Wireframing**: Turn wireframes into functional components
