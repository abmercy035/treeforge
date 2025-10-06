# 🌲 TreeForge Documentation Site

A modern, dark-themed documentation website for TreeForge - built with pure HTML, CSS, and JavaScript.

## 🎨 Design Features

### Modern Dark Theme
- **Professional Color Palette**: GitHub-inspired dark theme with purple gradient accents
- **Smooth Animations**: Fade-ins, slide-ins, and hover effects
- **Responsive Design**: Looks great on desktop, tablet, and mobile
- **Beautiful Typography**: Clean, modern font stack with perfect readability

### UI Components
- ✨ **Gradient Hero Section** with animated text
- 🎯 **Feature Cards** with hover effects
- 📝 **Code Blocks** with syntax highlighting (Highlight.js)
- 🔄 **Interactive Tabs** for installation methods
- 📋 **Copy-to-Clipboard** buttons for code snippets
- 🎨 **Theme Showcase** grid
- 📱 **Mobile Navigation** with hamburger menu
- 🎪 **CTA Section** with gradient background
- 🔗 **Smooth Scrolling** navigation

## 📂 File Structure

```
docs/
├── index.html              # Main documentation page
├── styles/
│   └── docs-style.css      # Complete dark theme stylesheet
├── scripts/
│   └── docs-app.js         # Interactive features & TreeForge demos
└── README.md               # This file
```

## 🚀 Features

### 1. **Hero Section**
- Animated gradient text
- Feature badges
- CTA buttons
- Live demo window

### 2. **Features Grid**
- 9 feature cards
- Hover animations
- Icon-based design
- Interactive links

### 3. **Getting Started**
- Installation tabs (npm, yarn, CDN)
- Copy-to-clipboard functionality
- Quick start example
- Live demo

### 4. **Live Examples**
- GitHub style demo
- VS Code dark demo
- Dracula theme demo
- Minimal theme demo
- Side-by-side code & preview

### 5. **Themes Section**
- 12+ theme cards
- Visual previews
- Code snippets
- Hover effects

### 6. **API Reference**
- Constructor docs
- Configuration options
- Methods overview
- Hooks reference

### 7. **CTA Section**
- Gradient background
- Call-to-action buttons
- GitHub/npm links

### 8. **Footer**
- Brand identity
- Navigation links
- Copyright info
- Social links

## 🎨 Color Palette

```css
--primary: #667eea         /* Purple */
--primary-dark: #5568d3    /* Darker purple */
--primary-light: #7c8eec   /* Lighter purple */
--secondary: #764ba2       /* Pink-purple */
--accent: #f093fb          /* Pink */

--bg-primary: #0d1117      /* Main background */
--bg-secondary: #161b22    /* Secondary background */
--bg-tertiary: #21262d     /* Card background */
--bg-code: #1e2228         /* Code block background */

--text-primary: #c9d1d9    /* Main text */
--text-secondary: #8b949e  /* Secondary text */
--text-accent: #58a6ff     /* Link text */
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern layout with CSS Grid & Flexbox
- **JavaScript (ES6+)**: Interactive features
- **Highlight.js**: Syntax highlighting for code blocks
- **CSS Variables**: Easy theme customization
- **CSS Animations**: Smooth transitions and effects

## 📱 Responsive Breakpoints

- **Desktop**: 1280px+ (max-width container)
- **Tablet**: 968px and below
- **Mobile**: 640px and below

## ✨ Interactive Features

### JavaScript Features:
1. **Smooth Scrolling** - Navigate between sections smoothly
2. **Tab Switching** - Toggle between installation methods
3. **Copy Buttons** - One-click code copying with feedback
4. **Mobile Menu** - Hamburger menu for mobile navigation
5. **Active Nav Links** - Highlights current section
6. **TreeForge Demos** - Live tree rendering (when TreeForge is loaded)
7. **Syntax Highlighting** - Code blocks with Highlight.js
8. **Keyboard Navigation** - ESC to close mobile menu

## 🚀 How to Use

### Local Development

1. **Clone the repository:**
```bash
cd docs
```

2. **Open in browser:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Or just open index.html directly
```

3. **Visit:**
```
http://localhost:8000
```

### Deploy to Production

#### GitHub Pages:
1. Push to `gh-pages` branch
2. Enable GitHub Pages in repository settings
3. Select `gh-pages` branch as source

#### Netlify:
1. Connect repository
2. Set build directory to `docs`
3. Deploy

#### Vercel:
1. Import repository
2. Set output directory to `docs`
3. Deploy

## 🎯 Customization

### Change Colors:
Edit CSS variables in `docs-style.css`:

```css
:root {
    --primary: #your-color;
    --bg-primary: #your-bg-color;
}
```

### Add New Sections:
1. Add HTML section in `index.html`
2. Add styles in `docs-style.css`
3. Add navigation link in navbar

### Modify Layout:
- Grid layouts use CSS Grid
- Responsive with media queries
- Mobile-first approach

## 📊 Performance

- **Fast Load Time**: Minimal dependencies
- **Optimized CSS**: ~30KB minified
- **Lazy Loading**: For images and demos
- **No jQuery**: Pure vanilla JavaScript
- **CDN Assets**: Highlight.js from CDN

## 🔧 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 📝 TODO

- [ ] Add more live TreeForge demos
- [ ] Create separate pages for API, Examples, Config
- [ ] Add search functionality
- [ ] Add dark/light theme toggle
- [ ] Add version switcher
- [ ] Add playground/REPL for live coding
- [ ] Add tutorials section
- [ ] Add video demos

## 🤝 Contributing

Want to improve the documentation site?

1. Fork the repository
2. Create your feature branch
3. Make your changes to `/docs` folder
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - Same as TreeForge

## 🌟 Credits

- **Design Inspiration**: Vue.js, Vite, Tailwind CSS docs
- **Icons**: Unicode emojis
- **Syntax Highlighting**: Highlight.js
- **Color Palette**: GitHub dark theme + custom gradients

---

Built with ❤️ for the TreeForge community

🌲 **TreeForge** - Modern File Tree Component for the Web
