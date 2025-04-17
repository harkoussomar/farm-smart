# FarmSmart Frontend Architecture Documentation

## Overview

FarmSmart is a comprehensive farm management platform built with modern JavaScript frameworks. The frontend is a React-based single-page application (SPA) that works with a Laravel backend, using Inertia.js to bridge the two. The application provides farmers with tools to manage their farm profiles, visualize farm data, manage products and crops, process orders, and more.

## Table of Contents

1. [Component Structure and Hierarchy](#component-structure-and-hierarchy)
2. [State Management Approach](#state-management-approach)
3. [API Integration Patterns](#api-integration-patterns)
4. [Routing Implementation](#routing-implementation)
5. [UI/UX Design Principles](#uiux-design-principles)
6. [Key Dependencies and Libraries](#key-dependencies-and-libraries)
7. [Build and Deployment Process](#build-and-deployment-process)
8. [Code Organization](#code-organization)

## Component Structure and Hierarchy

### Layout Components

The application uses a consistent layout structure for each section:

- `FarmerLayout.tsx`: Main layout component for farmer-related pages
    - Provides common header and footer
    - Implements page transitions with AnimatePresence from Framer Motion

```jsx
// resources/js/layouts/FarmerLayout.tsx
const FarmerLayout = ({ children }: FarmerLayoutProps) => {
    return (
        <div className="bg-background min-h-screen">
            <MemoizedHeader />
            <main className="bg-background text-foreground">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={url}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <MemoizedFooter />
        </div>
    );
};
```

### UI Components

The application follows a component-based architecture with a mix of larger page components and smaller reusable UI components:

1. **Page Components** (`resources/js/pages/`)

    - Dashboard
    - Farm Profile
    - Farm Visualization
    - Products
    - Crops
    - Cart
    - Checkout
    - Orders
    - Authentication pages

2. **UI Components** (`resources/js/components/`)

    - Header (`farm-header.tsx`)
    - Footer (`farm-footer.tsx`)
    - Form inputs
    - Data display components
    - Dashboard-specific components
    - UI building blocks (buttons, cards, modals, etc.)

3. **Component Hierarchy Example for Dashboard**:

```
Dashboard
├── DashboardHeader
├── FarmerStatsSection
├── ClientStatsSection
├── RecentOrdersSection
├── ClientOrdersSection
├── NotificationsSection
└── AnalyticsSection
```

### Component Architecture Patterns

The frontend employs several React patterns:

1. **Memo Pattern**: High-frequency components are memoized to prevent unnecessary re-renders

    ```jsx
    const MemoizedHeader = memo(FarmHeader);
    const MemoizedFooter = memo(FarmFooter);
    ```

2. **Prop Typing**: TypeScript interfaces define component props

    ```tsx
    interface DashboardProps {
        farmer: {
            name: string;
        };
        recentOrders: Array<{
            id: number;
            order_number: string;
            status: string;
            total_amount: number;
            created_at: string;
        }>;
        stats: {
            // ...property definitions
        };
    }
    ```

3. **Conditional Rendering**: Components adapt their UI based on prop values and state
    ```jsx
    {
        defaultStats.orderStatusBreakdown && <AnalyticsSection orderStatusBreakdown={defaultStats.orderStatusBreakdown} />;
    }
    ```

## State Management Approach

The application employs a hybrid state management approach:

### 1. Zustand

Zustand is used for global state management, particularly for features requiring persistence and cross-component communication:

```typescript
// resources/js/hooks/useCart.ts
export const useCart = create<CartStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                items: [],
                addItem: (item) =>
                    set((state) => {
                        // Implementation
                    }),
                removeItem: (id) =>
                    set((state) => {
                        // Implementation
                    }),
                // Other methods
            }),
            {
                name: 'cart-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ items: state.items }),
            },
        ),
    ),
);
```

Key features of the Zustand implementation:

- Persistence through localStorage
- Custom event system for cross-component updates
- Optimized updates to prevent unnecessary renders

### 2. React Hooks

Local component state is managed with React's built-in hooks:

```jsx
const [isScrolled, setIsScrolled] = useState(false);
const [isMenuOpen, setIsMenuOpen] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 3. Inertia.js Form Handling

Form submission and server state is managed through Inertia.js:

```jsx
const form = useForm({});

const handleLogout = () => {
    useCart.getState().clearCart();
    form.post(route('farmer.logout'), {
        onSuccess: () => {
            // Logic after successful logout
        },
    });
};
```

### 4. Custom Event System

A custom event system is implemented for cross-component communication, particularly for cart updates:

```typescript
// Dispatch cart update events
function dispatchCartUpdate() {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
    setTimeout(() => {
        window.dispatchEvent(
            new CustomEvent(CART_UPDATED_EVENT, {
                bubbles: true,
                detail: { timestamp: Date.now() },
            }),
        );
    }, 50);
}

// Custom hook to listen for cart updates
export function useCartUpdates(callback: () => void) {
    React.useEffect(() => {
        const handleCartUpdate = () => {
            callback();
        };
        window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
        };
    }, [callback]);
}
```

## API Integration Patterns

The application uses Inertia.js to handle API communication with the Laravel backend:

### 1. Inertia.js Page Props

Data is passed from the server to React components via Inertia.js page props:

```jsx
const { auth } = usePage().props as unknown as { auth: Auth };
```

### 2. Inertia.js Form Submissions

Forms are submitted using Inertia.js's form handling:

```jsx
const form = useForm({
    // Form data
});

const handleSubmit = () => {
    form.post(route('farmer.updateProfile'), {
        onSuccess: () => {
            // Handle success
        },
        onError: () => {
            // Handle errors
        },
        preserveScroll: true,
    });
};
```

### 3. Route Generation with Ziggy

The application uses Ziggy to generate routes:

```jsx
import { route } from 'ziggy-js';

// Usage
form.post(route('farmer.logout'));
```

## Routing Implementation

The application uses a combination of Inertia.js and Laravel routing for page navigation:

### 1. Laravel Routes

Server-side routes are defined in Laravel's route files and handle the initial loading of pages.

### 2. Inertia.js Navigation

Client-side navigation is handled by Inertia.js's Link component:

```jsx
<Link href={item.href} className={`text-muted-foreground hover:text-foreground ${url === item.href ? 'text-foreground font-semibold' : ''}`}>
    {item.name}
</Link>
```

### 3. Route Structure

The frontend is organized into logical sections:

- `/farmer/dashboard`: Main dashboard
- `/farmer/farm-profile`: Farm profile management
- `/farmer/farm-visualization`: Farm data visualization
- `/farmer/products`: Product management
- `/farmer/crops`: Crop management
- `/farmer/cart`: Shopping cart
- `/farmer/checkout`: Order checkout
- `/farmer/orders`: Order management

## UI/UX Design Principles

### 1. Design System

The application uses a comprehensive design system with:

- **Theming**: Light/dark mode support via next-themes library
- **Consistent Typography**: Standardized text styles across the application
- **Spacing System**: Consistent spacing using TailwindCSS utilities
- **Color Palette**: Semantic color variables

### 2. Component Design

UI components follow consistent patterns:

- **Responsive Design**: Components adapt to different screen sizes
- **Accessibility**: Proper aria attributes and keyboard navigation
- **Interactive Feedback**: Visual feedback for user interactions
- **Transitions**: Smooth animations for state changes

### 3. Motion and Animation

Framer Motion is used for transitions and animations:

```jsx
<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mr-4 md:mr-8">
    <Link href="/farmer/dashboard" className="text-primary text-xl font-bold">
        FarmSmart
    </Link>
</motion.div>
```

### 4. Responsive Design

The application is fully responsive using Tailwind CSS:

```jsx
<div className="grid gap-6 md:grid-cols-2">
    <RecentOrdersSection orders={recentOrders} />
    <ClientOrdersSection clientOrders={displayClientOrders} />
</div>
```

## Key Dependencies and Libraries

### Core Framework and Rendering

- **React 19**: Frontend UI library
- **TypeScript**: Static typing for JavaScript
- **Inertia.js + React**: Server-side rendering and routing bridge

### State Management

- **Zustand**: Global state management with persist middleware
- **React Hooks**: Local component state

### UI Components and Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Headless UI**: Unstyled, accessible UI components

### Data Visualization

- **Recharts**: Charting library for data visualization
- **React-Leaflet**: Map visualization

### Form Management

- **React Hook Form**: Form state management and validation

### Date and Time

- **date-fns**: Date formatting and manipulation

### Other Utilities

- **clsx & class-variance-authority**: CSS class construction utilities
- **tailwind-merge**: Safely merge Tailwind classes

## Build and Deployment Process

The application uses Vite as its build tool, with several predefined scripts:

```json
"scripts": {
    "build": "vite build",
    "build:ssr": "vite build && vite build --ssr",
    "dev": "vite",
    "format": "prettier --write resources/",
    "format:check": "prettier --check resources/",
    "lint": "eslint . --fix",
    "types": "tsc --noEmit"
}
```

### Development Workflow

1. Run `npm run dev` to start the development server
2. Changes to files trigger hot module replacement
3. TypeScript errors and linting issues appear in real-time

### Code Quality Tooling

- **ESLint**: JavaScript and TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

### Production Build Process

1. Run `npm run build` to create a production build
2. Assets are optimized, minified, and code-split
3. Generated assets are placed in the public directory

## Code Organization

### Directory Structure

The frontend code is organized into logical directories:

- **resources/js/**
    - **components/**: Reusable UI components
        - **ui/**: Low-level UI components
        - **dashboard/**: Dashboard-specific components
        - **farm-profile/**: Farm profile components
        - **farm-visualization/**: Farm visualization components
    - **pages/**: Page-level components
        - **auth/**: Authentication pages
        - **farmer/**: Farmer dashboard pages
    - **layouts/**: Layout components
    - **hooks/**: Custom React hooks
    - **types/**: TypeScript type definitions
    - **utils/**: Utility functions
    - **lib/**: Shared library code

### Naming Conventions

- Component files use PascalCase (e.g., `FarmHeader.tsx`)
- Utility files use kebab-case (e.g., `farm-header.tsx`) or camelCase
- Hooks use camelCase with 'use' prefix (e.g., `useCart.ts`)

### Import Organization

- Imports are organized by type:
    1. External libraries
    2. Internal components
    3. Hooks
    4. Types
    5. Utilities

### Type Definitions

Types are defined using TypeScript interfaces:

```typescript
export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_path: string;
        sku: string;
        stock_quantity: number;
        product_type: {
            id: number;
            name: string;
        };
    };
    unit_price: number;
    discount_percentage: number;
    total_price: number;
}
```

---

This documentation provides a comprehensive overview of the FarmSmart frontend architecture. It serves as a guide for new developers joining the project and as a reference for technical partners understanding the system's design and implementation.
