# Sketch-to-UI Converter

A powerful web application that converts hand-drawn UI sketches into functional React components with Tailwind CSS, powered by Claude Vision AI.

## Features

### Core Functionality
- **Interactive Drawing Canvas**: Draw UI mockups by hand using an intuitive canvas interface
- **AI-Powered Conversion**: Uses Anthropic's Claude Vision API to interpret sketches and generate code
- **Live Preview**: See your generated UI rendered in real-time
- **Code Display**: View and copy the generated React/Tailwind CSS code
- **Side-by-Side Layout**: Compare your sketch with the generated UI simultaneously

### Drawing Tools
- **Multiple Colors**: Choose from 6 different pen colors
- **Adjustable Brush Size**: 1-10px brush sizes for detailed or rough sketches
- **Clear Canvas**: Start fresh with a single click
- **Smooth Drawing**: High-quality canvas rendering with smooth strokes

### Supported UI Components
The AI can recognize and generate:
- Buttons with labels
- Cards and containers
- Weather widgets (temperature, location)
- Lists (numbered and bulleted)
- Charts (line charts, bar charts)
- Text labels and headers
- Icons and decorative elements
- Forms and input fields
- Navigation menus
- And much more!

## How to Use

### 1. Setup
First, you'll need a Claude API key from Anthropic:
1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create an account and generate an API key
3. When you first open the app, enter your API key in the modal
4. Your key is stored securely in your browser's localStorage

### 2. Draw Your UI
1. Use the drawing tools to sketch your UI mockup
2. Be creative! The AI can interpret various UI elements:
   - Draw rectangles for buttons or cards
   - Sketch charts and graphs
   - Add text labels (write words like "Login", "Dashboard", etc.)
   - Create weather widgets with temperature indicators
   - Design lists and menus

### 3. Add Description (Optional)
- Use the description field to provide additional context
- Example: "Weather widget showing 72°F in San Francisco"
- This helps the AI generate more accurate code

### 4. Generate UI
1. Click the "Generate UI from Sketch" button
2. Wait a few seconds while Claude Vision analyzes your sketch
3. View the generated UI in the live preview panel
4. Copy the code to use in your own projects

### 5. Iterate
- If the result isn't perfect, clear the canvas and try again
- Refine your sketch or adjust your description
- Experiment with different drawing styles

## Technical Details

### Technology Stack
- **React 19**: Modern React with hooks
- **Vite**: Fast development and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Canvas API**: HTML5 canvas for drawing
- **Claude Vision API**: Anthropic's multimodal AI
- **Prism.js**: Syntax highlighting for code display

### Project Structure
```
src/
├── SketchToUI.jsx    # Main application component
├── main.jsx          # Application entry point
├── index.css         # Global styles + Tailwind directives
└── App.jsx           # Original Dream Library app (preserved)
```

### How It Works
1. **Drawing Phase**: User draws on HTML5 canvas, strokes are rendered in real-time
2. **Image Capture**: Canvas content is converted to base64 PNG image
3. **AI Processing**: Image + prompt sent to Claude Vision API
4. **Code Extraction**: Generated code is extracted from AI response
5. **Live Rendering**: Code is rendered in an isolated iframe with Tailwind CSS
6. **Syntax Highlighting**: Code is displayed with Prism.js highlighting

### API Integration
The app uses Anthropic's Claude 3.5 Sonnet model with vision capabilities:
```javascript
model: 'claude-3-5-sonnet-20241022'
max_tokens: 4096
```

## Installation & Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
App will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Configuration

### Change API Key
Click "Change API Key" in the top-right corner to update your Claude API key at any time.

### Customize Prompts
Edit the `generateUI` function in `SketchToUI.jsx` to customize how the AI interprets sketches.

### Adjust Canvas Size
Modify the canvas dimensions in the component:
```jsx
<canvas
  width={700}    // Change width
  height={500}   // Change height
  ...
/>
```

## Tips for Best Results

### Drawing Tips
1. **Be Clear**: Draw distinct shapes with clear boundaries
2. **Add Labels**: Write text labels for buttons, headers, etc.
3. **Use Descriptions**: Provide context in the description field
4. **Keep It Simple**: Start with simple layouts and build complexity
5. **Iterate**: Don't expect perfection on the first try

### Common Patterns
- **Buttons**: Draw rounded rectangles with text labels
- **Cards**: Draw nested rectangles for card containers
- **Charts**: Sketch line/bar patterns that resemble graphs
- **Weather Widgets**: Draw a card with temperature numbers
- **Lists**: Draw bullet points or numbers with text lines

## Limitations

- Requires internet connection for API calls
- API usage may incur costs (check Anthropic pricing)
- Complex sketches may not always generate perfect code
- Preview rendering depends on valid React/JSX syntax
- Some advanced UI patterns may require manual code refinement

## Privacy & Security

- **API Key Storage**: Keys are stored only in your browser's localStorage
- **Data Privacy**: Sketches are sent only to Anthropic's API
- **No Server**: Everything runs client-side in your browser
- **No Tracking**: No analytics or tracking tools are used

## Future Enhancements

Potential features for future versions:
- [ ] Undo/Redo for drawing
- [ ] Save/Load sketches
- [ ] Export as standalone HTML file
- [ ] Edit generated code inline
- [ ] Multiple sketch layers
- [ ] Shape tools (rectangle, circle, line)
- [ ] Image upload for reference
- [ ] Template library
- [ ] Collaborative drawing
- [ ] Code optimization suggestions

## Troubleshooting

### "API request failed"
- Check your API key is valid
- Verify you have API credits available
- Check your internet connection

### "Render Error"
- The generated code may have syntax errors
- Try redrawing or adjusting your description
- Check the browser console for details

### Canvas not drawing
- Ensure you're clicking and dragging on the canvas
- Try adjusting brush size
- Refresh the page if issues persist

### Preview not showing
- Generated code may have runtime errors
- Check browser console for errors
- Try simpler sketches first

## Contributing

This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Built with Claude Code (Anthropic's AI coding assistant)
- Powered by Claude Vision API
- UI framework: React + Tailwind CSS
- Inspired by Cursor Agent's canvas feature

## Support

For issues or questions:
- Open an issue on GitHub
- Check Anthropic's API documentation
- Review the code comments in SketchToUI.jsx

---

**Happy Sketching!** ✨🎨
