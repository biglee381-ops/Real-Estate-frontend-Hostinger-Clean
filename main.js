const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');
const searchForm = document.getElementById('map-search-form');
const locationInput = document.getElementById('location-input');
const propertyTypeInput = document.getElementById('property-type-input');
const quickLinks = document.querySelectorAll('.quick-links a');
const homePropertyGrid = document.getElementById('property-grid');
const premiumSearchForm = document.getElementById('premium-search-form');
const premiumLocationInput = document.getElementById('premium-location');
const premiumPropertyType = document.getElementById('premium-property-type');
const searchTabs = document.querySelectorAll('.search-tab');

// Shared backend URL. admin.js reads this without redeclaring a top-level const.
window.API_BASE = 'https://real-estate-backend-1374.onrender.com';

const fallbackProperties = [
    {
        title: 'Skyline Haven',
        location: 'Benin City',
        price: '₦450M',
        type: 'Luxury Villa',
        description: 'A premium residence with panoramic views and modern architecture.',
        media: [{ url: 'assets/project_img_1.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Vista Verde',
        location: 'Auchi',
        price: '₦280M',
        type: 'Executive Home',
        description: 'A refined family home designed for comfort and privacy.',
        media: [{ url: 'assets/project_img_2.jpg', type: 'image/jpeg', isVideo: false }]
    }
];

const localFeaturedProperties = [
    {
        title: 'Serenity Suites',
        location: 'Ekpoma',
        price: '₦190K/mo',
        type: 'Apartment for Rent',
        description: 'Contemporary apartments crafted for premium city living.',
        media: [{ url: 'assets/project_img_3.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Central Square',
        location: 'Uromi',
        price: '₦620M',
        type: 'Estate for Sale',
        description: 'A landmark property for investors seeking long-term value.',
        media: [{ url: 'assets/project_img_4.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Hilltop Reserve',
        location: 'Benin City',
        price: '₦520M',
        type: 'Secure Estate for Sale',
        description: 'Private hilltop residences featuring modern amenities and scenic views.',
        media: [{ url: 'assets/project_img_5.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Riverbend Cottages',
        location: 'Ekpoma',
        price: '₦120K/mo',
        type: 'Luxury Cottage for Rent',
        description: 'Cozy riverside cottages ideal for short-term stays and premium vacation booking.',
        media: [{ url: 'assets/project_img_6.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Luxury Hotel',
        location: 'Uyo, Akwa Ibom State',
        price: '₦550M',
        type: 'Hotel for Sale',
        description: '26-room hotel behind Ibom Tropicana at Udoudoma, off Ring Road 3.',
        media: [{ url: 'assets/hotel.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: 'Tank Farm',
        location: 'Calabar',
        price: '₦10B',
        type: 'Viable and Functional Tank Farm for Sale',
        description: 'Major depot area close to the jetty, with three 12-million-litre tanks: two for PMS and one for AGO, for a total capacity of 36 million litres.',
        media: [{ url: 'assets/water-tank.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: 'Intended 40-Room Hotel',
        location: 'Benin-Sapele Road, opposite Ogheghe Junction, Edo State',
        price: '₦240M',
        type: 'Hotel for Sale',
        description: 'Uncompleted 40-room hotel project along Benin-Sapele Road, opposite Ogheghe Junction.',
        media: [{ url: 'assets/vd6.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: 'Farm Lands',
        location: 'Okada Area, Edo State',
        price: '₦70K/hectare',
        type: 'Farm Land for Lease',
        description: '6,000 hectares with a Registered Survey Plan and C of O.',
        media: [{ url: 'assets/land.jpg', type: 'image/jpeg', isVideo: false }]
    },
    {
        title: '100 × 100 Plot in Aruogba',
        location: 'Eze Okasia Avenue, Aruogba, off Iriri Road, Airport Road, Benin City',
        price: '₦50M',
        type: 'Land for Sale',
        description: '100 × 100 ft plot in a fenced compound, cut out from the compound. Deed of Ownership document available.',
        media: [{ url: 'assets/vd8.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: '100 × 100 Plot in Ugbor Village',
        location: 'Ugbor Village Road, boundary between Ugbor and Amagba communities',
        price: '₦60M',
        type: 'Land for Sale',
        description: '100 × 100 ft plot, just 3 poles from the tarred road. Survey document and CofO available.',
        media: [{ url: 'assets/vd9.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: 'Apartment Buildings off Joromi',
        location: 'Off Joromi, Ekehuan, Benin City, Edo State',
        price: '₦1.2B',
        type: 'Apartment Buildings for Sale',
        description: '12 two-bedroom apartments, 6 three-bedroom apartments, and 6 one-bedroom apartments. Videos available.',
        media: [{ url: 'assets/vd3.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: '5-Bedroom Duplex in Obazagbon / Okhoromi',
        location: 'Obazagbon / Okhoromi, Benin City',
        price: '₦95M',
        type: 'Duplex for Sale',
        description: 'Standard 5-bedroom duplex, 80% completed, on 700 sqm of land. 3 plots to a tarred road. C of O in process.',
        media: [{ url: 'assets/vd5.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: '3-Bedroom and 2-Bedroom Flats in Ewodia',
        location: 'Ewodia Community, Airport Road, Benin City',
        price: 'Make an offer',
        type: 'Apartments for Sale',
        description: 'One 3-bedroom flat and two 2-bedroom flats for sale. 75% completed. Give us your offer.',
        media: [{ url: 'assets/vd4.mp4', type: 'video/mp4', isVideo: true }]
    },
    {
        title: '100 × 200 Property by Ogheghe Junction',
        location: 'Benin-Sapele Road, opposite the healthcare centres, by Ogheghe Junction, Benin City',
        price: '₦190M',
        type: 'Land for Sale',
        description: '100 × 200 plot with Survey document and CofO.',
        media: [{ url: 'assets/vd7.mp4', type: 'video/mp4', isVideo: true }]
    }
];

function mergePropertyListings(properties) {
    const merged = [];
    const titles = new Set();

    [...(Array.isArray(properties) ? properties : []), ...fallbackProperties, ...localFeaturedProperties]
        .forEach((property) => {
            const title = (property.title || '').trim().toLowerCase();
            if (title && !titles.has(title)) {
                titles.add(title);
                merged.push(property);
            }
        });

    return merged;
}

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[tag] || tag));
}

function normalizeMedia(media, index) {
    const fallbackImage = `assets/project_img_${(index % 4) + 1}.jpg`;
    if (!Array.isArray(media) || !media.length) {
        return [{ url: fallbackImage, type: 'image/jpeg', isVideo: false }];
    }

    const normalized = media
        .filter(Boolean)
        .map((item) => {
            if (typeof item === 'string') {
                return { url: item, type: 'image/jpeg', isVideo: false };
            }
            return {
                url: item.url || item.src || '',
                type: item.type || 'image/jpeg',
                isVideo: Boolean(item.isVideo)
            };
        })
        .filter((item) => item.url);

    return normalized.length ? normalized : [{ url: fallbackImage, type: 'image/jpeg', isVideo: false }];
}

function normalizeProperties(properties) {
    if (!Array.isArray(properties)) return [];

    return properties.map((property, index) => ({
        ...property,
        title: escapeHTML(property.title || `Property ${index + 1}`),
        location: escapeHTML(property.location || 'Edo State'),
        price: escapeHTML(property.price || 'Contact us'),
        type: escapeHTML(property.type || 'Featured Property'),
        description: escapeHTML(property.description || 'Premium property available now.'),
        media: normalizeMedia(property.media, index)
    }));
}

function getMediaMarkup(property, index) {
    const fallbackImage = `assets/project_img_${(index % 4) + 1}.jpg`;
    const media = property.media || [];

    if (!media.length) {
        return '<div class="placeholder-media">Premium media loading</div>';
    }

    return media.map((item) => {
        if (item.isVideo) {
            return `<video controls src="${item.url}"></video>`;
        }
        return `<img src="${item.url || fallbackImage}" alt="${property.title}" onerror="this.onerror=null;this.src='${fallbackImage}';">`;
    }).join('');
}

function createSlideMarkup(property, index) {
    const mediaMarkup = getMediaMarkup(property, index);
    return `
        <div class="swiper-slide">
            <article class="property-card reveal">
                <div class="property-media-stack">${mediaMarkup}</div>
                <div class="property-content">
                    <h3>${property.title}</h3>
                    <p>${property.location} • ${property.type}</p>
                    <p>${property.description}</p>
                    <div class="property-meta">
                        <strong>${property.price}</strong>
                        <a href="#contact">Schedule Visit</a>
                    </div>
                </div>
            </article>
        </div>
    `;
}

function renderHomeProperties(properties) {
    if (!homePropertyGrid) return;

    const items = normalizeProperties(properties && properties.length ? properties : fallbackProperties);
    const hasSlider = Boolean(document.querySelector('#property-grid .mySwiper'));

    if (hasSlider) {
        homePropertyGrid.innerHTML = `
            <div class="swiper mySwiper">
                <div class="swiper-wrapper">
                    ${items.map(createSlideMarkup).join('')}
                </div>
                <div class="swiper-button-next">
                    <img src="assets/right_arrow.svg" alt="Next slide">
                </div>
                <div class="swiper-button-prev">
                    <img src="assets/left_arrow.svg" alt="Previous slide">
                </div>
                <div class="swiper-pagination"></div>
            </div>
        `;
    } else {
        homePropertyGrid.innerHTML = items.map((property, index) => `
            <article class="property-card reveal">
                <div class="property-media-stack">${getMediaMarkup(property, index)}</div>
                <div class="property-content">
                    <h3>${property.title}</h3>
                    <p>${property.location} • ${property.type}</p>
                    <p>${property.description}</p>
                    <div class="property-meta">
                        <strong>${property.price}</strong>
                        <a href="#contact">Schedule Visit</a>
                    </div>
                </div>
            </article>
        `).join('');
    }

    requestAnimationFrame(() => {
        initScrollReveal();
        initPropertySwiper();
    });
}

function initPropertySwiper() {
    if (typeof Swiper === 'undefined') return;
    const slider = document.querySelector('.mySwiper');
    if (!slider || slider.swiper) return;

    new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            640: {
                slidesPerView: 1.05,
                spaceBetween: 24
            },
            900: {
                slidesPerView: 2,
                spaceBetween: 26
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 28
            }
        },
        observer: true,
        observeParents: true,
        a11y: true
    });
}

async function loadProperties() {
    if (!homePropertyGrid) return;

    try {
        const response = await fetch(`${window.API_BASE}/api/properties`);
        if (!response.ok) throw new Error('Unable to load listings');
        const data = await response.json();
        if (Array.isArray(data)) {
            renderHomeProperties(mergePropertyListings(data));
            return;
        }
    } catch (error) {
        console.warn('Using fallback listings:', error);
    }

    renderHomeProperties(mergePropertyListings([]));
}

if (year) {
    year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

function openMapSearch(locationValue, propertyValue) {
    const location = (locationValue || '').trim();
    const propertyType = (propertyValue || '').trim();
    const query = [propertyType, location, 'Edo State Nigeria'].filter(Boolean).join(' ');
    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
}

if (searchTabs.length) {
    searchTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            searchTabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        });
    });
}

if (premiumSearchForm && premiumLocationInput) {
    premiumSearchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        openMapSearch(premiumLocationInput.value, premiumPropertyType?.value || '');
    });
}

if (searchForm && locationInput && propertyTypeInput) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        openMapSearch(locationInput.value, propertyTypeInput.value);
    });
}

quickLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        openMapSearch(link.dataset.location, link.dataset.type);
    });
});

function initScrollReveal() {
    const updatedRevealElements = document.querySelectorAll('.reveal');
    if (!updatedRevealElements.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
        updatedRevealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -40px 0px'
        });

        updatedRevealElements.forEach((element) => observer.observe(element));
    }
}

loadProperties();
initScrollReveal();