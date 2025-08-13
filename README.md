# Qwik Influencer Signup Form

This is a Qwik application that provides an influencer signup form for Printerpix. It has been converted from a React application to use the Qwik framework with Qwik City for routing.

## Features

- **Modern Qwik Framework**: Built with Qwik for optimal performance and developer experience
- **Responsive Design**: Mobile-first design with Tailwind CSS 4
- **Form Validation**: Client-side validation using Zod schema validation
- **Toast Notifications**: Success and error feedback for form submissions
- **Regional Site Links**: Quick access to country-specific Printerpix websites
- **Instagram Integration**: Form specifically designed for Instagram influencers

## Tech Stack

- **Framework**: [Qwik](https://qwik.dev/) with [Qwik City](https://qwik.builder.io/qwikcity/overview/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or bun

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── InfluencerSignupForm.tsx  # Main form component
│   └── router-head/    # Router head component
├── routes/             # Qwik City routes
│   ├── index.tsx       # Home page
│   ├── layout.tsx      # Root layout
│   └── influencer-signup/  # Signup form route
├── assets/             # Static assets (flags, images)
├── entry.client.tsx    # Client entry point
├── entry.server.tsx    # Server entry point
├── global.css          # Global styles and Tailwind imports
└── root.tsx            # Root component
```

## Form Fields

The influencer signup form includes the following fields:

- **Instagram Username**: Required, must be valid Instagram handle
- **Follower Count**: Range selection (10K-500K+)
- **Traffic Range**: Monthly profile traffic selection
- **Email Address**: Required, must be valid email format
- **Country of Residence**: Dropdown with supported countries
- **Followers Location**: Where most followers are based
- **Product Selection**: Choose from available products to promote

## API Integration

The form submits to a Supabase Edge Function:
```
POST https://rrbbkiaguqmcgwvibiqv.supabase.co/functions/v1/submit-influencer-form
```

## Styling

The application uses Tailwind CSS 4 with custom CSS variables for theming. Custom gradients and shadows are defined for the Instagram-inspired design.

## Development

### Key Qwik Concepts Used

- **`component$`**: For creating Qwik components
- **`useSignal`**: For reactive state management
- **`$`**: For creating event handlers
- **`useTask$`**: For side effects and async operations

### Adding New Routes

To add new routes, create files in the `src/routes/` directory following the Qwik City file-based routing convention.

### Styling Components

Use Tailwind CSS classes and custom CSS variables defined in `src/global.css`. The design system includes Instagram-inspired colors and gradients.

## Deployment

The application can be deployed to any platform that supports Node.js applications. Popular options include:

- Vercel
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to Printerpix. Please contact the development team for licensing information.
