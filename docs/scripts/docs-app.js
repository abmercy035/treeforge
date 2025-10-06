// ==========================================
// TreeForge Documentation Site - Interactive Features
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
	// Initialize
	initHighlightJS();
	initSmoothScroll();
	initTabs();
	initExampleTabs();
	initCopyButtons();
	initMobileMenu();
	initSidebar();
	initActiveNavLinks();
	initPageNavigation();
	initTreeForgeDemos();
});

// ==========================================
// Syntax Highlighting
// ==========================================
function initHighlightJS() {
	if (typeof hljs !== 'undefined') {
		hljs.highlightAll();
	}
}

// ==========================================
// Smooth Scrolling
// ==========================================
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			if (href === '#') return;

			e.preventDefault();
			const target = document.querySelector(href);

			if (target) {
				const navHeight = document.querySelector('.navbar').offsetHeight;
				const targetPosition = target.offsetTop - navHeight - 20;

				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});
}

// ==========================================
// Installation Tabs
// ==========================================
function initTabs() {
	const tabButtons = document.querySelectorAll('.tab-btn');
	const tabContents = document.querySelectorAll('.tab-content');

	tabButtons.forEach(button => {
		button.addEventListener('click', () => {
			const targetTab = button.getAttribute('data-tab');

			// Remove active class from all
			tabButtons.forEach(btn => btn.classList.remove('active'));
			tabContents.forEach(content => content.classList.remove('active'));

			// Add active class to clicked
			button.classList.add('active');
			const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
			if (targetContent) {
				targetContent.classList.add('active');
			}
		});
	});
}

// ==========================================
// Example Tabs
// ==========================================
function initExampleTabs() {
	const exampleTabs = document.querySelectorAll('.example-tab');
	const exampleContents = document.querySelectorAll('.example-content');

	exampleTabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const targetExample = tab.getAttribute('data-example');

			// Remove active class from all
			exampleTabs.forEach(t => t.classList.remove('active'));
			exampleContents.forEach(content => content.classList.remove('active'));

			// Add active class to clicked
			tab.classList.add('active');
			const targetContent = document.querySelector(`[data-example-content="${targetExample}"]`);
			if (targetContent) {
				targetContent.classList.add('active');
			}
		});
	});
}

// ==========================================
// Copy to Clipboard
// ==========================================
function initCopyButtons() {
	const copyButtons = document.querySelectorAll('.copy-btn');

	copyButtons.forEach(button => {
		button.addEventListener('click', async function () {
			const copyData = this.getAttribute('data-copy');
			let textToCopy = copyData;

			// If data-copy is an element ID, get that element's text
			if (!copyData.includes(' ') && !copyData.includes('\n')) {
				const element = document.getElementById(copyData);
				if (element) {
					textToCopy = element.textContent;
				}
			}

			try {
				await navigator.clipboard.writeText(textToCopy);

				// Visual feedback
				const originalHTML = this.innerHTML;
				this.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                `;
				this.classList.add('copied');

				setTimeout(() => {
					this.innerHTML = originalHTML;
					this.classList.remove('copied');
				}, 2000);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		});
	});
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
function initMobileMenu() {
	const menuToggle = document.querySelector('.mobile-menu-toggle');
	const navLinks = document.querySelector('.nav-links');

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', () => {
			navLinks.classList.toggle('active');
			menuToggle.classList.toggle('active');
		});

		// Close menu when clicking outside
		document.addEventListener('click', (e) => {
			if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
				navLinks.classList.remove('active');
				menuToggle.classList.remove('active');
			}
		});

		// Close menu when clicking a link
		navLinks.querySelectorAll('.nav-link').forEach(link => {
			link.addEventListener('click', () => {
				navLinks.classList.remove('active');
				menuToggle.classList.remove('active');
			});
		});
	}
}

// ==========================================
// Sidebar Navigation
// ==========================================
function initSidebar() {
	const sidebar = document.getElementById('sidebar');
	const sidebarToggle = document.getElementById('sidebarToggle');
	const sidebarClose = document.querySelector('.sidebar-close');
	const sidebarLinks = document.querySelectorAll('.sidebar .nav-item');

	// Toggle sidebar on mobile
	if (sidebarToggle) {
		sidebarToggle.addEventListener('click', () => {
			sidebar.classList.toggle('active');
		});
	}

	// Close sidebar
	if (sidebarClose) {
		sidebarClose.addEventListener('click', () => {
			sidebar.classList.remove('active');
		});
	}

	// Close sidebar when clicking a link on mobile
	sidebarLinks.forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 1024) {
				sidebar.classList.remove('active');
			}
		});
	});

	// Close sidebar when clicking outside on mobile
	document.addEventListener('click', (e) => {
		if (window.innerWidth <= 1024) {
			if (!sidebar.contains(e.target) &&
				!sidebarToggle.contains(e.target) &&
				sidebar.classList.contains('active')) {
				sidebar.classList.remove('active');
			}
		}
	});
}

// ==========================================
// Page Navigation (Previous/Next)
// ==========================================
function initPageNavigation() {
	// Define the documentation pages in order
	const pages = [
		{ id: 'home', title: 'Introduction', href: '#home' },
		{ id: 'features', title: 'Features', href: '#features' },
		{ id: 'getting-started', title: 'Installation', href: '#getting-started' },
		{ id: 'examples', title: 'Examples', href: '#examples' },
		{ id: 'themes', title: 'Themes', href: '#themes' },
		{ id: 'api', title: 'API Reference', href: '#api' },
		{ id: 'cta', title: 'Get Started', href: '#cta' }
	];

	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const prevTitle = document.getElementById('prevTitle');
	const nextTitle = document.getElementById('nextTitle');

	function updatePageNav() {
		const sections = document.querySelectorAll('section[id]');
		let currentIndex = 0;
		const scrollPosition = window.scrollY + 200;

		// Find current section
		sections.forEach((section, index) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				currentIndex = pages.findIndex(p => p.id === section.getAttribute('id'));
			}
		});

		// Update previous button
		if (currentIndex > 0) {
			const prevPage = pages[currentIndex - 1];
			prevBtn.href = prevPage.href;
			prevTitle.textContent = prevPage.title;
			prevBtn.style.display = 'flex';
		} else {
			prevBtn.style.display = 'none';
		}

		// Update next button
		if (currentIndex < pages.length - 1) {
			const nextPage = pages[currentIndex + 1];
			nextBtn.href = nextPage.href;
			nextTitle.textContent = nextPage.title;
			nextBtn.style.display = 'flex';
		} else {
			nextBtn.style.display = 'none';
		}
	}

	// Update on scroll
	window.addEventListener('scroll', debounce(updatePageNav, 100));
	updatePageNav();
}

// ==========================================
// Active Navigation Links
// ==========================================
function initActiveNavLinks() {
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
	const topNavLinks = document.querySelectorAll('.nav-link[href^="#"]');

	function updateActiveLink() {
		const scrollPosition = window.scrollY + 100;

		sections.forEach(section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute('id');

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				// Update sidebar nav
				navLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});

				// Update top nav
				topNavLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});
			}
		});
	}

	window.addEventListener('scroll', updateActiveLink);
	updateActiveLink();
}

// ==========================================
// TreeForge Demo Initialization
// ==========================================
function initTreeForgeDemos() {
	// Sample data for demos
	const sampleData = {
		name: 'my-project',
		type: 'folder',
		children: [
			{
				name: 'src',
				type: 'folder',
				children: [
					{ name: 'index.js', type: 'file' },
					{ name: 'app.js', type: 'file' },
					{
						name: 'components', type: 'folder', children: [
							{ name: 'Header.js', type: 'file' },
							{ name: 'Footer.js', type: 'file' }
						]
					}
				]
			},
			{
				name: 'public',
				type: 'folder',
				children: [
					{ name: 'index.html', type: 'file' },
					{ name: 'style.css', type: 'file' }
				]
			},
			{ name: 'package.json', type: 'file' },
			{ name: 'README.md', type: 'file' },
			{ name: '.gitignore', type: 'file' }
		]
	};

	// Check if TreeForge is available
	if (typeof TreeForge === 'undefined') {
		console.warn('TreeForge not loaded. Demos will not be initialized.');
		showTreeForgePlaceholders();
		return;
	}

	// Initialize hero demo
	try {
		const heroContainer = document.getElementById('hero-tree-container');
		if (heroContainer) {
			createTreeDemo(heroContainer, sampleData, 'GITHUB');
		}
	} catch (err) {
		console.error('Failed to initialize hero demo:', err);
	}

	// Initialize quick start demo
	try {
		const quickStartDemo = document.getElementById('quick-start-demo');
		if (quickStartDemo) {
			createTreeDemo(quickStartDemo, sampleData, 'GITHUB');
		}
	} catch (err) {
		console.error('Failed to initialize quick start demo:', err);
	}

	// Initialize example demos
	const examples = [
		{ id: 'example-github', style: 'GITHUB' },
		{ id: 'example-vscode', style: 'VSCODE_DARK' },
		{ id: 'example-dracula', style: 'DRACULA' },
		{ id: 'example-minimal', style: 'MINIMAL' }
	];

	examples.forEach(example => {
		try {
			const container = document.getElementById(example.id);
			if (container) {
				createTreeDemo(container, sampleData, example.style);
			}
		} catch (err) {
			console.error(`Failed to initialize ${example.id}:`, err);
		}
	});
}

// ==========================================
// Create TreeForge Demo
// ==========================================
function createTreeDemo(container, data, style) {
	// Create a unique ID for this tree
	const treeId = `tree-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	container.id = treeId;

	// Render the tree as ASCII
	container.innerHTML = renderTreeASCII(data);
	container.style.fontFamily = 'monospace';
	container.style.fontSize = '14px';
	container.style.lineHeight = '1.6';
	container.style.color = '#c9d1d9';
	container.style.whiteSpace = 'pre';
	container.style.overflowX = 'auto';
}

// ==========================================
// Render Tree as ASCII (Fallback)
// ==========================================
function renderTreeASCII(node, prefix = '', isLast = true) {
	let result = '';
	const connector = isLast ? '└── ' : '├── ';
	const icon = node.type === 'folder' ? '📁 ' : '📄 ';

	result += prefix + connector + icon + node.name + '\n';

	if (node.children && node.children.length > 0) {
		const newPrefix = prefix + (isLast ? '    ' : '│   ');
		node.children.forEach((child, index) => {
			const childIsLast = index === node.children.length - 1;
			result += renderTreeASCII(child, newPrefix, childIsLast);
		});
	}

	return result;
}

// ==========================================
// Show Placeholder for TreeForge Demos
// ==========================================
function showTreeForgePlaceholders() {
	const demoContainers = [
		'hero-tree-container',
		'quick-start-demo',
		'example-github',
		'example-vscode',
		'example-dracula',
		'example-minimal'
	];

	demoContainers.forEach(id => {
		const container = document.getElementById(id);
		if (container) {
			container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #8b949e;">
                    <p style="margin-bottom: 1rem;">📦 TreeForge Demo</p>
                    <p style="font-size: 0.9rem;">Load TreeForge to see interactive demo</p>
                </div>
            `;
		}
	});
}

// ==========================================
// Scroll Progress Indicator
// ==========================================
window.addEventListener('scroll', () => {
	const windowHeight = window.innerHeight;
	const documentHeight = document.documentElement.scrollHeight - windowHeight;
	const scrolled = (window.scrollY / documentHeight) * 100;

	// You can add a progress bar if you want
	// document.querySelector('.progress-bar').style.width = scrolled + '%';
});

// ==========================================
// Keyboard Navigation
// ==========================================
document.addEventListener('keydown', (e) => {
	// ESC to close mobile menu
	if (e.key === 'Escape') {
		const navLinks = document.querySelector('.nav-links');
		const menuToggle = document.querySelector('.mobile-menu-toggle');
		if (navLinks && menuToggle) {
			navLinks.classList.remove('active');
			menuToggle.classList.remove('active');
		}
	}
});

// ==========================================
// Lazy Loading for Images/Demos
// ==========================================
if ('IntersectionObserver' in window) {
	const lazyElements = document.querySelectorAll('[data-lazy]');
	const lazyObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const element = entry.target;
				// Load content
				element.classList.add('loaded');
				lazyObserver.unobserve(element);
			}
		});
	});

	lazyElements.forEach(element => lazyObserver.observe(element));
}

// ==========================================
// Performance: Debounce Scroll Events
// ==========================================
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// ==========================================
// Analytics (Optional - Add your tracking)
// ==========================================
function trackEvent(category, action, label) {
	// Add your analytics tracking here
	// Example: Google Analytics, Plausible, etc.
	console.log('Event:', category, action, label);
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
	button.addEventListener('click', () => {
		const text = button.textContent.trim();
		trackEvent('Button', 'Click', text);
	});
});

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
	link.addEventListener('click', () => {
		const href = link.getAttribute('href');
		trackEvent('External Link', 'Click', href);
	});
});

console.log('🌲 TreeForge Documentation Site Loaded');
