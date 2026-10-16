(() => {
  'use strict';

  const API_BASE = window.API_BASE || 'https://real-estate-backend-1374.onrender.com';
  const loginForm = document.getElementById('login-form');
  const loginContainer = document.getElementById('login-container');
  const loginFeedback = document.getElementById('login-feedback');
  const loginButton = document.getElementById('login-button');
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  const dashboardContainer = document.getElementById('dashboard-container');
  const propertyForm = document.getElementById('property-form');
  const formFeedback = document.getElementById('form-feedback');
  const propertySubmitButton = document.getElementById('property-submit-button');
  const listingsSection = document.getElementById('listings');
  const propertyList = document.getElementById('admin-property-list');
  const logoutButton = document.getElementById('logout-button');
  const mediaInput = document.getElementById('media-upload');
  let authToken = localStorage.getItem('dboAdminToken') || '';
  let properties = [];

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function setFeedback(element, message, isError = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('error', isError);
  }

  function updateAuthUI() {
    const isLoggedIn = Boolean(authToken);
    if (loginContainer) loginContainer.hidden = isLoggedIn;
    if (dashboardContainer) dashboardContainer.hidden = !isLoggedIn;
    if (listingsSection) listingsSection.hidden = !isLoggedIn;
    if (!isLoggedIn) {
      if (propertyList) propertyList.innerHTML = '<p class="empty-state">Sign in to view listings.</p>';
      properties = [];
    }
  }

  async function parseResponse(response) {
    const text = await response.text();
    if (!text) return {};
    try { return JSON.parse(text); } catch { return { message: text }; }
  }

  function getErrorMessage(data, fallback) {
    return data?.message || data?.error || data?.detail || fallback;
  }

  function getMedia(property) {
    if (Array.isArray(property.media)) return property.media;
    if (Array.isArray(property.images)) return property.images;
    if (property.image) return [property.image];
    return [];
  }

  function mediaMarkup(property) {
    return getMedia(property).map((entry) => {
      const media = typeof entry === 'string' ? { url: entry } : entry;
      const url = media?.url || media?.src || media?.path || '';
      if (!url) return '';
      const safeUrl = escapeHTML(url);
      const isVideo = Boolean(media.isVideo) || /\.(mp4|webm|ogg)(\?|$)/i.test(url) || String(media.type || '').startsWith('video/');
      return isVideo
        ? `<video controls preload="metadata" src="${safeUrl}"></video>`
        : `<img loading="lazy" src="${safeUrl}" alt="${escapeHTML(property.title || 'Property image')}">`;
    }).join('');
  }

  function renderProperties() {
    if (!propertyList) return;
    if (!properties.length) {
      propertyList.innerHTML = '<p class="empty-state">No properties were returned by the backend yet.</p>';
      return;
    }
    propertyList.innerHTML = properties.map((property, index) => {
      const id = property._id ?? property.id ?? property.propertyId ?? '';
      return `<article class="admin-property-card">
        ${mediaMarkup(property)}
        <h3>${escapeHTML(property.title || `Property ${index + 1}`)}</h3>
        <p><strong>Location:</strong> ${escapeHTML(property.location || 'Not specified')}</p>
        <p><strong>Price:</strong> ${escapeHTML(property.price || 'Contact us')}</p>
        <p><strong>Type:</strong> ${escapeHTML(property.type || 'Not specified')}</p>
        <p>${escapeHTML(property.description || '')}</p>
        ${id !== '' ? `<button type="button" data-delete-id="${escapeHTML(id)}">Delete property</button>` : '<p class="form-feedback">This item has no ID, so it cannot be deleted here.</p>'}
      </article>`;
    }).join('');
  }

  async function loadProperties() {
    if (!authToken) return;
    if (propertyList) propertyList.innerHTML = '<p class="empty-state">Loading properties…</p>';
    try {
      const response = await fetch(`${API_BASE}/api/properties`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await parseResponse(response);
      if (response.status === 401 || response.status === 403) {
        authToken = '';
        localStorage.removeItem('dboAdminToken');
        updateAuthUI();
        setFeedback(loginFeedback, 'Your session has expired. Please sign in again.', true);
        return;
      }
      if (!response.ok) throw new Error(getErrorMessage(data, 'Could not load properties.'));
      properties = Array.isArray(data) ? data : Array.isArray(data.properties) ? data.properties : Array.isArray(data.data) ? data.data : [];
      renderProperties();
    } catch (error) {
      if (propertyList) propertyList.innerHTML = `<p class="empty-state">${escapeHTML(error.message || 'Could not load properties. Check the backend and connection.')}</p>`;
    }
  }

  async function loginAdmin(event) {
    event.preventDefault();
    setFeedback(loginFeedback, 'Signing in…');
    if (loginButton) loginButton.disabled = true;
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput?.value.trim(),
          email: usernameInput?.value.trim(),
          password: passwordInput?.value
        })
      });
      const data = await parseResponse(response);
      const token = data.token || data.accessToken || data.access_token || data.jwt;
      if (!response.ok || !token) {
        throw new Error(getErrorMessage(data, 'Login failed. Check your credentials and confirm the backend login response returns a token.'));
      }
      authToken = token;
      localStorage.setItem('dboAdminToken', authToken);
      if (passwordInput) passwordInput.value = '';
      updateAuthUI();
      setFeedback(loginFeedback, 'Login successful.');
      await loadProperties();
    } catch (error) {
      setFeedback(loginFeedback, error.message || 'Unable to sign in. Check your internet connection and backend URL.', true);
    } finally {
      if (loginButton) loginButton.disabled = false;
    }
  }

  async function addProperty(event) {
    event.preventDefault();
    if (!authToken) {
      setFeedback(formFeedback, 'Please sign in again.', true);
      updateAuthUI();
      return;
    }
    setFeedback(formFeedback, 'Saving property…');
    if (propertySubmitButton) propertySubmitButton.disabled = true;

    try {
      const formData = new FormData(propertyForm);
      // Avoid sending empty file inputs. Keep the backend's expected media field name.
      if (mediaInput && !mediaInput.files.length) formData.delete('media');
      const response = await fetch(`${API_BASE}/api/properties`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData
      });
      const data = await parseResponse(response);
      if (response.status === 401 || response.status === 403) {
        authToken = '';
        localStorage.removeItem('dboAdminToken');
        updateAuthUI();
        throw new Error('Your session expired. Please sign in again.');
      }
      if (!response.ok) throw new Error(getErrorMessage(data, 'Could not save the property.'));
      propertyForm.reset();
      setFeedback(formFeedback, data.message || 'Property added successfully.');
      await loadProperties();
    } catch (error) {
      setFeedback(formFeedback, error.message || 'Could not save the property.', true);
    } finally {
      if (propertySubmitButton) propertySubmitButton.disabled = false;
    }
  }

  async function deleteProperty(id) {
    if (!id || !authToken) return;
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/properties/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await parseResponse(response);
      if (response.status === 401 || response.status === 403) {
        authToken = '';
        localStorage.removeItem('dboAdminToken');
        updateAuthUI();
        throw new Error('Your session expired. Please sign in again.');
      }
      if (!response.ok) throw new Error(getErrorMessage(data, 'Could not delete the property.'));
      setFeedback(formFeedback, data.message || 'Property deleted.');
      await loadProperties();
    } catch (error) {
      setFeedback(formFeedback, error.message || 'Could not delete the property.', true);
    }
  }

  function logout() {
    authToken = '';
    localStorage.removeItem('dboAdminToken');
    updateAuthUI();
    setFeedback(loginFeedback, 'You have been logged out.');
  }

  if (loginForm) loginForm.addEventListener('submit', loginAdmin);
  if (propertyForm) propertyForm.addEventListener('submit', addProperty);
  if (logoutButton) logoutButton.addEventListener('click', logout);
  if (propertyList) propertyList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-id]');
    if (button) deleteProperty(button.dataset.deleteId);
  });

  updateAuthUI();
  if (authToken) loadProperties();
})();
