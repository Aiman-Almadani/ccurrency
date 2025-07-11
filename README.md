# 💱 CCurrency - Modern Currency Converter

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.23.1-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<div align="center">
  <h3>🌟 A beautiful, fast, and reliable currency converter built with modern React</h3>
  <p>
    <strong>
      <a href="https://ccurrency-nine.vercel.app/">🚀 Live Demo</a> •
      <a href="#-features">✨ Features</a> •
      <a href="#-installation">📦 Installation</a> •
      <a href="#-usage">💻 Usage</a>
    </strong>
  </p>
</div>

---

## 🎯 Overview

CCurrency is a production-ready currency converter application that provides real-time exchange rates with a beautiful, intuitive interface. Built with React 19 and modern web technologies, it offers a seamless user experience across all devices.

**🌐 Live Application:** [ccurrency-nine.vercel.app](https://ccurrency-nine.vercel.app/)

---

## ✨ Features

### 🔥 Core Functionality
- **Real-time Currency Conversion** - Get live exchange rates instantly
- **10 Major Currencies** - USD, EUR, GBP, JPY, CAD, AUD, EGP, SAR, CHF, CNY
- **Smart API Fallback** - Multiple API endpoints ensure 99.9% uptime
- **Offline Support** - Cached rates work even without internet
- **Copy to Clipboard** - One-click copy of converted amounts

### 🎨 User Experience
- **Dark/Light Mode** - Seamless theme switching with persistence
- **Smooth Animations** - Framer Motion powered micro-interactions
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Intuitive Interface** - Clean, modern design with excellent UX
- **Currency Flags** - Visual currency identification with flag emojis

### 🛡️ Reliability & Performance
- **Multi-API Architecture** - 3 fallback APIs for maximum reliability
- **Smart Caching** - 5-minute cache with timestamp tracking
- **Error Handling** - Graceful degradation with user-friendly messages
- **Optimized Performance** - Debounced API calls and efficient re-renders
- **Accessibility** - Full ARIA support and keyboard navigation

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion 12** - Production-ready motion library
- **Modern JavaScript** - ES6+ features and best practices

### Architecture
- **Component-Based** - Modular, reusable components
- **Custom Hooks** - Separation of concerns and logic reuse
- **Service Layer** - Clean API abstraction
- **Context API** - Global state management

### APIs & Services
- **exchangerate.host** - Primary exchange rate API
- **frankfurter.app** - Secondary fallback API
- **exchangerate-api.com** - Tertiary fallback API

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Aiman-Almadani/ccurrency.git

# Navigate to project directory
cd ccurrency

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Serve locally (optional)
npm install -g serve
serve -s build
```

---

## 💻 Usage

### Basic Currency Conversion
1. **Enter Amount** - Type the amount you want to convert
2. **Select Currencies** - Choose from/to currencies using the dropdowns
3. **View Result** - See the converted amount instantly
4. **Copy Result** - Click the converted amount to copy to clipboard

### Advanced Features
- **Swap Currencies** - Click the swap button to reverse conversion
- **Dark Mode** - Toggle between light and dark themes
- **Offline Mode** - App works with cached rates when offline

### Keyboard Shortcuts
- **Enter** - Focus on amount input
- **Space** - Swap currencies
- **Tab** - Navigate between elements

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedNumber.jsx   # Smooth number animations
│   ├── Card.jsx            # Container component
│   ├── CustomSelect.jsx    # Currency selector dropdown
│   ├── DarkModeToggle.jsx  # Theme switcher
│   ├── Input.jsx           # Amount input field
│   └── SwapButton.jsx      # Currency swap button
├── hooks/              # Custom React hooks
│   ├── useCountUp.js       # Number animation hook
│   ├── useCurrencyConverter.js # Currency conversion logic
│   ├── useDarkMode.js      # Dark mode management
│   └── useLocalStorage.js  # Local storage utilities
├── services/           # API and business logic
│   ├── apiClient.js        # HTTP client with retry logic
│   └── currencyService.js  # Currency conversion service
├── context/            # React context providers
│   └── ThemeContext.jsx    # Theme management context
├── utils/              # Utility functions
│   └── constants.js        # App constants and config
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and Tailwind
```

---

## 🔧 Configuration

### Environment Variables
No environment variables required - all APIs are public and free.

### Supported Currencies
- 🇺🇸 **USD** - US Dollar
- 🇪🇺 **EUR** - Euro
- 🇬🇧 **GBP** - British Pound
- 🇯🇵 **JPY** - Japanese Yen
- 🇨🇦 **CAD** - Canadian Dollar
- 🇦🇺 **AUD** - Australian Dollar
- 🇪🇬 **EGP** - Egyptian Pound
- 🇸🇦 **SAR** - Saudi Riyal
- 🇨🇭 **CHF** - Swiss Franc
- 🇨🇳 **CNY** - Chinese Yuan

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### Netlify
```bash
# Build the project
npm run build

# Deploy build folder to Netlify
# Or connect your GitHub repository
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/ccurrency",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

---

## 🎨 Customization

### Themes
The app supports custom themes through CSS variables:

```css
:root {
  --primary-color: #a0e870;
  --primary-dark: #7fcf4c;
  --primary-hover: #6bb83a;
}
```

### Adding New Currencies
1. Update `getSupportedCurrencies()` in `currencyService.js`
2. Add currency data with flag emoji and symbol
3. Test conversion functionality

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## 📈 Performance

### Optimization Features
- **Debounced API Calls** - Prevents excessive API requests
- **Intelligent Caching** - Reduces API calls and improves speed
- **Code Splitting** - Optimized bundle loading
- **Lazy Loading** - Components load on demand
- **Memoization** - Prevents unnecessary re-renders

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx serve -s build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices
- Use TypeScript for new features
- Write tests for new functionality
- Follow the existing code style
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aiman Almadani**
- GitHub: [@Aiman-Almadani](https://github.com/Aiman-Almadani)

---

## 🙏 Acknowledgments

- **Exchange Rate APIs** - Thanks to exchangerate.host, frankfurter.app, and exchangerate-api.com
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Vercel** - For excellent deployment platform

---

## 📊 Stats

<div align="center">
  <img src="https://img.shields.io/github/stars/Aiman-Almadani/ccurrency?style=for-the-badge" alt="Stars" />
  <img src="https://img.shields.io/github/forks/Aiman-Almadani/ccurrency?style=for-the-badge" alt="Forks" />
  <img src="https://img.shields.io/github/issues/Aiman-Almadani/ccurrency?style=for-the-badge" alt="Issues" />
  <img src="https://img.shields.io/github/license/Aiman-Almadani/ccurrency?style=for-the-badge" alt="License" />
</div>

---

<div align="center">
  <p>
    <strong>⭐ Star this repository if you found it helpful!</strong>
  </p>
  <p>
    Made with ❤️ by <a href="https://github.com/Aiman-Almadani">Aiman Almadani</a>
  </p>
</div>
