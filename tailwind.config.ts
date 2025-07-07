import { withUt } from "uploadthing/tw";

const config = withUt({
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
  	extend: {
  		colors: {
  			bacgkroundW: 'var(--bacgkroundW)',
  			textComment: 'var(--textComment)',
  			cardComment: 'var(--cardComment)',
  			iconsecendary: 'var(--iconsecendary)',
  			'text-about': 'var(--text-about)',
  			'card-body': 'var(--card-body)',
  			primary: 'var(--primary)',
  			'primary-foreground': 'var(--primary-foreground)',
  			secondary: 'var(--secondary)',
  			'secondary-static': 'var(--secondary-static)',
  			'secondary-foreground': 'var(--secondary-foreground)',
  			background: 'var(--background)',
  			bgDash: 'var(--bgDash)',
  			foreground: 'var(--foreground)',
  			subBg: 'var(--subBg)',
  			subBg2: 'var(--subBg2)',
  			subText: 'var(--subText)',
  			muted: 'var(--muted)',
  			'muted-foreground': 'var(--muted-foreground)',
  			accent: 'var(--accent)',
  			'accent-foreground': 'var(--accent-foreground)',
  			danger: 'var(--danger)',
  			orange: 'var(--orange)',
  			'orange-foreground': 'var(--orange-foreground)',
  			'accent-blue': 'var(--accent-blue)',
  			'accent-blue-foreground': 'var(--accent-blue-foreground)',
  			destructive: 'var(--destructive)',
  			border: 'var(--border)',
  			'secondary-light': 'var(--secondary-light)',
  			'secondary-light2': 'var(--secondary-light2)',
  			'secondary-light3': 'var(--secondary-light3)',
  			'secondary-light4': 'var(--secondary-light4)',
  			'blur-primary': 'var(--blur-primary)',
  			'blur-blue': 'var(--blur-blue)',
  			card: 'var(--card)',
  			'card-foreground': 'var(--card-foreground)',
  			popover: 'var(--popover)',
  			'popover-foreground': 'var(--popover-foreground)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			'card-light': 'var(--card-light)',
  			'card-secondary': 'var(--card-secondary)',
  			'card-secondary2': 'var(--card-secondary2)',
  			'card-secondary3': 'var(--card-secondary3)'
  		},
  		keyframes: {
  			popover: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			overlayShow: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			drawerSlideIn: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			drawerSlideOut: {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			popover: 'popover 0.2s ease-out',
  			overlayShow: 'overlayShow 0.15s ease-out',
  			drawerSlideIn: 'drawerSlideIn 0.25s ease-out',
  			drawerSlideOut: 'drawerSlideOut 0.2s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		fontFamily: {
  			sans: [
  				'IRANSans',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius)'
  		}
  	}
  },
  plugins: [],
});

export default config;
