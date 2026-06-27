# Abhishek Portfolio

A modern, responsive portfolio website built with cutting-edge web technologies.

## 🚀 Features

- **Modern Design** - Beautiful UI with Tailwind CSS and custom components
- **Light Gradient Background** - Elegant light gradient for a professional look
- **Responsive Layout** - Works seamlessly on all devices
- **Admin Panel** - Manage portfolio content with ease
- **Fast Performance** - Built with Vite for lightning-fast load times
- **Type-Safe** - Full TypeScript support

## 📋 Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: TanStack Router
- **Language**: TypeScript
- **Server**: Bun
- **Component Library**: shadcn/ui components

## 📦 Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # shadcn/ui component library
├── routes/           # Application routes
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and stores
├── router.tsx        # Route configuration
├── server.ts         # Server setup
├── start.ts          # Application entry point
└── styles.css        # Global styles and theme
```

## 🏃 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Bun runtime

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/abhishek-portfolio.git
cd Abhishekprotfolio
```

2. **Install dependencies**
```bash
bun install
```

3. **Start the development server**
```bash
bun dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Available Commands

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun lint` - Run ESLint

## 📄 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `components.json` - shadcn/ui configuration
- `bunfig.toml` - Bun configuration

## 🎨 Customization

### Colors & Theme

The color scheme is defined in `src/styles.css`:
- Light mode colors are in the `.light` class
- Dark mode colors are in the `:root` class
- All colors use OKLCH color space for better color manipulation

### Add New Routes

Edit `src/routes/` to add new pages to your portfolio.

### Modify Components

All reusable UI components are in `src/components/`. Use shadcn/ui components as building blocks.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any inquiries, please reach out to [your-email@example.com](mailto:your-email@example.com)

---

Made with ❤️ by Abhishek
