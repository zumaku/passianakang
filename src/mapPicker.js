import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createIcons, icons } from 'lucide';

export class MapPicker {
  constructor(options = {}) {
    this.modal = document.getElementById('mapPickerModal');
    this.canvas = document.getElementById('mapPickerCanvas');
    this.coordsDisplay = document.getElementById('mapPickedCoordsDisplay');
    this.btnConfirm = document.getElementById('btnConfirmMapPicker');
    this.btnCancel = document.getElementById('btnCancelMapPicker');
    this.btnClose = document.getElementById('btnCloseMapPicker');
    this.btnLocate = document.getElementById('btnMapLocateMe');
    this.btnLayerStreet = document.getElementById('btnLayerStreet');
    this.btnLayerSat = document.getElementById('btnLayerSat');
    this.inputSearch = document.getElementById('mapSearchInput');
    this.btnSearch = document.getElementById('btnMapSearch');
    this.searchResults = document.getElementById('mapSearchResults');

    this.onConfirm = options.onConfirm || null;
    this.onCancel = options.onCancel || null;

    this.map = null;
    this.marker = null;
    this.tileLayer = null;
    this.currentMapType = 'street';
    this.currentLat = -5.147665;
    this.currentLng = 119.432732;

    this.searchAbortController = null;

    this.initEvents();
  }

  initMap() {
    if (this.map || !this.canvas) return;

    // Custom SVG marker pin
    this.markerIcon = L.divIcon({
      className: 'map-custom-marker-wrapper',
      html: `
        <div class="map-picker-pin">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 27.5 16 42 16 42C16 42 32 27.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="#e11d48"/>
            <circle cx="16" cy="16" r="7" fill="#ffffff"/>
            <circle cx="16" cy="16" r="3.5" fill="#9f1239"/>
          </svg>
          <div class="pin-shadow"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });

    this.map = L.map(this.canvas, {
      zoomControl: true,
      attributionControl: true
    }).setView([this.currentLat, this.currentLng], 13);

    this.updateTileLayer();

    // Draggable marker
    this.marker = L.marker([this.currentLat, this.currentLng], {
      icon: this.markerIcon,
      draggable: true,
      autoPan: true
    }).addTo(this.map);

    this.marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      this.updateCoords(pos.lat, pos.lng, false);
    });

    // Map click
    this.map.on('click', (e) => {
      this.updateCoords(e.latlng.lat, e.latlng.lng, true);
    });
  }

  setMapType(type) {
    this.currentMapType = type;
    this.updateTileLayer();
    if (this.btnLayerStreet && this.btnLayerSat) {
      if (type === 'street') {
        this.btnLayerStreet.classList.add('active');
        this.btnLayerSat.classList.remove('active');
      } else {
        this.btnLayerStreet.classList.remove('active');
        this.btnLayerSat.classList.add('active');
      }
    }
  }

  updateTileLayer() {
    if (!this.map) return;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    if (this.currentMapType === 'satellite') {
      this.tileLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri &mdash; Sumber: Esri, Maxar, Earthstar Geographics'
        }
      ).addTo(this.map);
    } else {
      this.tileLayer = L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> kontributor'
        }
      ).addTo(this.map);
    }
  }

  updateCoords(lat, lng, moveMarker = true) {
    this.currentLat = Number(lat);
    this.currentLng = Number(lng);

    if (moveMarker && this.marker) {
      this.marker.setLatLng([this.currentLat, this.currentLng]);
    }

    if (this.coordsDisplay) {
      const latFixed = this.currentLat.toFixed(6);
      const lngFixed = this.currentLng.toFixed(6);
      this.coordsDisplay.textContent = `${latFixed}, ${lngFixed}`;
    }
  }

  parseCoordinates(inputStr) {
    if (!inputStr || typeof inputStr !== 'string') return null;
    const trimmed = inputStr.trim();
    // Matches: -5.123456, 119.123456 or extracted from url
    const match = trimmed.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
    return null;
  }

  open(initialCoordsStr = '') {
    if (!this.modal) return;

    this.modal.classList.add('open');
    createIcons({ icons });

    // Parse initial coordinates or fallback
    const parsed = this.parseCoordinates(initialCoordsStr);
    let targetLat = -5.147665;
    let targetLng = 119.432732;
    let zoomLevel = 13;

    if (parsed) {
      targetLat = parsed.lat;
      targetLng = parsed.lng;
      zoomLevel = 16;
    }

    this.currentLat = targetLat;
    this.currentLng = targetLng;

    // Reset search
    if (this.inputSearch) this.inputSearch.value = '';
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
      this.searchResults.style.display = 'none';
    }

    // Init or refresh map after modal is visible
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      } else {
        this.updateTileLayer();
        this.map.invalidateSize();
      }

      this.updateCoords(targetLat, targetLng, true);
      if (this.map) {
        this.map.setView([targetLat, targetLng], zoomLevel, { animate: false });
      }
    }, 150);
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
    if (this.searchResults) {
      this.searchResults.style.display = 'none';
    }
    if (this.onCancel) {
      this.onCancel();
    }
  }

  async searchLocation(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();

    if (this.searchAbortController) {
      this.searchAbortController.abort();
    }
    this.searchAbortController = new AbortController();

    if (this.btnSearch) {
      this.btnSearch.disabled = true;
      this.btnSearch.textContent = 'Mencari...';
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=5&addressdetails=1`,
        {
          signal: this.searchAbortController.signal,
          headers: {
            'Accept-Language': 'id,en'
          }
        }
      );
      const data = await res.json();
      this.renderSearchResults(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Gagal mencari lokasi:', err);
      }
    } finally {
      if (this.btnSearch) {
        this.btnSearch.disabled = false;
        this.btnSearch.textContent = 'Cari';
      }
    }
  }

  renderSearchResults(results) {
    if (!this.searchResults) return;

    if (!Array.isArray(results) || results.length === 0) {
      this.searchResults.innerHTML = '<div class="map-search-empty">Lokasi tidak ditemukan. Coba gunakan nama kota atau kata kunci lain.</div>';
      this.searchResults.style.display = 'block';
      return;
    }

    this.searchResults.innerHTML = results.map((item, idx) => `
      <div class="map-search-item" data-idx="${idx}">
        <i data-lucide="map-pin"></i>
        <div class="map-search-item-info">
          <strong class="map-search-name">${item.display_name.split(',')[0]}</strong>
          <span class="map-search-detail">${item.display_name}</span>
        </div>
      </div>
    `).join('');

    this.searchResults.style.display = 'block';
    createIcons({ icons });

    // Event listener for search item selection
    this.searchResults.querySelectorAll('.map-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = Number(el.dataset.idx);
        const item = results[idx];
        if (item) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          this.updateCoords(lat, lng, true);
          if (this.map) {
            this.map.setView([lat, lng], 16);
          }
          this.searchResults.style.display = 'none';
        }
      });
    });
  }

  locateUser() {
    if (!navigator.geolocation) {
      alert('Peramban Anda tidak mendukung fitur deteksi lokasi otomatis (Geolocation).');
      return;
    }

    if (this.btnLocate) {
      this.btnLocate.disabled = true;
      this.btnLocate.innerHTML = '<i data-lucide="loader"></i> <span class="btn-text">Mendeteksi...</span>';
      createIcons({ icons });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.updateCoords(lat, lng, true);
        if (this.map) {
          this.map.setView([lat, lng], 16);
        }
        if (this.btnLocate) {
          this.btnLocate.disabled = false;
          this.btnLocate.innerHTML = '<i data-lucide="crosshair"></i> <span class="btn-text">Lokasi Saya</span>';
          createIcons({ icons });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Gagal mendeteksi lokasi saat ini. Pastikan izin akses GPS/Lokasi telah diaktifkan.');
        if (this.btnLocate) {
          this.btnLocate.disabled = false;
          this.btnLocate.innerHTML = '<i data-lucide="crosshair"></i> <span class="btn-text">Lokasi Saya</span>';
          createIcons({ icons });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  initEvents() {
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    if (this.btnCancel) {
      this.btnCancel.addEventListener('click', () => this.close());
    }

    if (this.btnConfirm) {
      this.btnConfirm.addEventListener('click', () => {
        if (this.currentLat !== null && this.currentLng !== null) {
          const latFixed = this.currentLat.toFixed(6);
          const lngFixed = this.currentLng.toFixed(6);
          const formatted = `${latFixed}, ${lngFixed}`;
          if (this.onConfirm) {
            this.onConfirm({
              lat: this.currentLat,
              lng: this.currentLng,
              formatted
            });
          }
        }
        this.close();
      });
    }

    if (this.btnLayerStreet) {
      this.btnLayerStreet.addEventListener('click', () => this.setMapType('street'));
    }

    if (this.btnLayerSat) {
      this.btnLayerSat.addEventListener('click', () => this.setMapType('satellite'));
    }

    if (this.btnLocate) {
      this.btnLocate.addEventListener('click', () => this.locateUser());
    }

    if (this.btnSearch && this.inputSearch) {
      this.btnSearch.addEventListener('click', () => {
        this.searchLocation(this.inputSearch.value);
      });
      this.inputSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.searchLocation(this.inputSearch.value);
        }
      });
    }

    // Dismiss search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (this.searchResults && this.searchResults.style.display !== 'none') {
        if (!this.searchResults.contains(e.target) && e.target !== this.inputSearch && e.target !== this.btnSearch) {
          this.searchResults.style.display = 'none';
        }
      }
    });
  }
}
