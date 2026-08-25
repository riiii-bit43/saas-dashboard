/* IRCTC Interactive Web Application Controller */

let currentState = {
  fromStation: 'NDLS',
  toStation: 'PNBE',
  journeyDate: '2026-08-25',
  quota: 'GN',
  tatkalTurbo: false,
  selectedTrain: null,
  selectedClass: null,
  selectedSeat: 'Lower Berth',
  selectedPassengers: ['p1']
};

document.addEventListener('DOMContentLoaded', () => {
  initAppRouter();
  initSearchForm();
  initThemeToggle();
  renderTrainResults();
});

/* View Switcher: Prototype vs UX Case Study */
function initAppRouter() {
  const btnPrototype = document.getElementById('btn-prototype-view');
  const btnCaseStudy = document.getElementById('btn-case-study-view');
  const prototypePanel = document.getElementById('prototype-panel');
  const caseStudyPanel = document.getElementById('case-study-panel');

  if (btnPrototype && btnCaseStudy) {
    btnPrototype.addEventListener('click', () => {
      btnPrototype.classList.add('active');
      btnCaseStudy.classList.remove('active');
      prototypePanel.classList.add('active');
      caseStudyPanel.classList.remove('active');
    });

    btnCaseStudy.addEventListener('click', () => {
      btnCaseStudy.classList.add('active');
      btnPrototype.classList.remove('active');
      caseStudyPanel.classList.add('active');
      prototypePanel.classList.remove('active');
    });
  }
}

/* Theme Switcher */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      themeToggleBtn.innerHTML = newTheme === 'dark' ? 
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>` : 
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }
}

/* Search Engine & Autocomplete */
function initSearchForm() {
  const fromInput = document.getElementById('from-station-input');
  const toInput = document.getElementById('to-station-input');
  const swapBtn = document.getElementById('swap-stations-btn');
  const tatkalToggle = document.getElementById('tatkal-switch');
  const tatkalBox = document.getElementById('tatkal-container');

  if (swapBtn && fromInput && toInput) {
    swapBtn.addEventListener('click', () => {
      const tempVal = fromInput.value;
      const tempCode = currentState.fromStation;
      
      fromInput.value = toInput.value;
      currentState.fromStation = currentState.toStation;
      
      toInput.value = tempVal;
      currentState.toStation = tempCode;

      renderTrainResults();
    });
  }

  if (tatkalToggle) {
    tatkalToggle.addEventListener('change', (e) => {
      currentState.tatkalTurbo = e.target.checked;
      if (currentState.tatkalTurbo) {
        tatkalBox.classList.add('active');
        showToast('Tatkal Turbo Mode Activated. Saved passenger profiles locked for fast checkout.');
      } else {
        tatkalBox.classList.remove('active');
      }
      renderTrainResults();
    });
  }

  // Setup Autocomplete
  setupAutocomplete(fromInput, 'from');
  setupAutocomplete(toInput, 'to');

  // Search button submit
  const searchBtn = document.getElementById('search-trains-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderTrainResults();
    });
  }
}

function setupAutocomplete(inputEl, fieldType) {
  if (!inputEl) return;

  const container = inputEl.parentElement;
  
  inputEl.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    closeAllAutocompletes();

    if (!val) return;

    const matches = STATIONS.filter(s => 
      s.code.toLowerCase().includes(val) || 
      s.name.toLowerCase().includes(val) || 
      s.city.toLowerCase().includes(val)
    );

    if (matches.length === 0) return;

    const listEl = document.createElement('div');
    listEl.className = 'autocomplete-results';

    matches.forEach(stn => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.innerHTML = `<div><strong>${stn.city}</strong> (${stn.code})<br><small style="color:var(--text-muted)">${stn.name}</small></div>`;
      item.addEventListener('click', () => {
        inputEl.value = `${stn.city} (${stn.code})`;
        if (fieldType === 'from') currentState.fromStation = stn.code;
        if (fieldType === 'to') currentState.toStation = stn.code;
        closeAllAutocompletes();
      });
      listEl.appendChild(item);
    });

    container.appendChild(listEl);
  });
}

function closeAllAutocompletes() {
  const lists = document.querySelectorAll('.autocomplete-results');
  lists.forEach(l => l.remove());
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-group')) {
    closeAllAutocompletes();
  }
});

/* Render Train Search Results */
function renderTrainResults() {
  const resultsContainer = document.getElementById('train-results-list');
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '';

  const filteredTrains = TRAINS_DATABASE.filter(t => 
    t.from === currentState.fromStation && t.to === currentState.toStation
  );

  const trainsToDisplay = filteredTrains.length > 0 ? filteredTrains : TRAINS_DATABASE;

  trainsToDisplay.forEach(train => {
    const trainCard = document.createElement('div');
    trainCard.className = 'train-card';

    let classesHTML = train.classes.map(cls => {
      let statusClass = 'status-available';
      let probHTML = '';

      if (cls.statusType === 'rac') statusClass = 'status-rac';
      if (cls.statusType === 'wl') statusClass = 'status-wl';

      if (cls.prob) {
        let probColor = 'prob-high';
        if (cls.prob < 85) probColor = 'prob-med';
        if (cls.prob < 50) probColor = 'prob-low';
        probHTML = `<div class="prob-indicator ${probColor}"><span>•</span> ${cls.prob}% Confirmation</div>`;
      }

      return `
        <div class="class-card" onclick="selectBookingClass('${train.number}', '${cls.code}')">
          <div class="class-header">
            <span>${cls.code}</span>
            <span>₹${cls.price}</span>
          </div>
          <span class="status-badge ${statusClass}">${cls.status}</span>
          ${probHTML}
        </div>
      `;
    }).join('');

    trainCard.innerHTML = `
      <div class="train-card-header">
        <div class="train-title-info">
          <h3>${train.name} <span class="train-number">#${train.number}</span></h3>
          <p style="font-size:0.8rem; color:var(--text-muted)">${train.speedClass} • Runs On: ${train.days.join(' ')}</p>
        </div>
        <button class="btn-search" style="margin-top:0; padding:0.5rem 1rem; font-size:0.85rem" onclick="openBerthModal('${train.number}')">
          Book Ticket
        </button>
      </div>

      <div class="timeline-row">
        <div class="time-box">
          <div class="time">${train.deptTime}</div>
          <div class="station">${train.from}</div>
        </div>
        <div class="duration-line">
          <div class="duration">${train.duration}</div>
          <div class="line-bar"></div>
        </div>
        <div class="time-box" style="text-align:right">
          <div class="time">${train.arrivalTime}</div>
          <div class="station">${train.to}</div>
        </div>
      </div>

      <div class="class-grid">
        ${classesHTML}
      </div>
    `;

    resultsContainer.appendChild(trainCard);
  });
}

/* Open Interactive Berth Selector & Checkout Modal */
function openBerthModal(trainNumber) {
  const train = TRAINS_DATABASE.find(t => t.number === trainNumber) || TRAINS_DATABASE[0];
  currentState.selectedTrain = train;

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const passChips = SAVED_PASSENGERS.map(p => `
    <label class="checkbox-label" style="background:var(--bg-main); padding:0.5rem 0.8rem; border-radius:var(--radius-sm); border:1px solid var(--border-light)">
      <input type="checkbox" checked>
      <strong>${p.name}</strong> (${p.age}y, ${p.gender})
    </label>
  `).join('');

  modalContainer.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(event)">
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="flex-between" style="margin-bottom:1rem">
          <h2>Complete Booking - ${train.name}</h2>
          <button class="icon-btn" onclick="closeModalDirect()">✕</button>
        </div>

        <div style="background:var(--primary-light); padding:0.8rem; border-radius:var(--radius-md); margin-bottom:1.25rem">
          <p style="font-size:0.85rem"><strong>Route:</strong> ${train.from} to ${train.to} | <strong>Class:</strong> AC 3 Tier (3A)</p>
        </div>

        <h4 style="margin-bottom:0.6rem">1. Select Passengers (Quick Autofill):</h4>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem">
          ${passChips}
        </div>

        <h4 style="margin-bottom:0.6rem">2. Select Berth Preference:</h4>
        <div class="coach-map-container">
          <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem">Click on a preferred seat in Coach B3:</p>
          <div class="coach-grid">
            <div class="berth-seat selected" onclick="selectBerth(this, 'Lower Berth 12')">LB 12 (Lower)</div>
            <div class="berth-seat" onclick="selectBerth(this, 'Middle Berth 13')">MB 13 (Middle)</div>
            <div class="berth-seat" onclick="selectBerth(this, 'Upper Berth 14')">UB 14 (Upper)</div>
            <div class="berth-seat occupied">SL 15 (Occupied)</div>
            <div class="berth-seat" onclick="selectBerth(this, 'Side Upper 16')">SU 16 (Side Upper)</div>
            <div class="berth-seat" onclick="selectBerth(this, 'Lower Berth 17')">LB 17 (Lower)</div>
            <div class="berth-seat occupied">MB 18 (Occupied)</div>
            <div class="berth-seat" onclick="selectBerth(this, 'Upper Berth 19')">UB 19 (Upper)</div>
          </div>
        </div>

        <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center">
          <div>
            <span style="font-size:0.8rem; color:var(--text-muted)">Total Fare:</span>
            <div style="font-size:1.4rem; font-weight:800; color:var(--primary)">₹2,150</div>
          </div>
          <button class="btn-search" style="margin-top:0" onclick="processInstantPayment()">
            Pay & Issue Ticket
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
}

function selectBerth(el, seatName) {
  document.querySelectorAll('.berth-seat').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  currentState.selectedSeat = seatName;
  showToast(`Seat ${seatName} Selected`);
}

function closeModalDirect() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) modalContainer.classList.add('hidden');
}

function closeModal(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    closeModalDirect();
  }
}

/* Process Payment & Issue Digital QR Ticket */
function processInstantPayment() {
  const modalContainer = document.getElementById('modal-container');
  const train = currentState.selectedTrain || TRAINS_DATABASE[0];
  const pnrNumber = '842910' + Math.floor(1000 + Math.random() * 9000);

  modalContainer.innerHTML = `
    <div class="modal-backdrop" onclick="closeModal(event)">
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="flex-between" style="margin-bottom:1rem">
          <h2 style="color:var(--status-available)">Booking Confirmed</h2>
          <button class="icon-btn" onclick="closeModalDirect()">✕</button>
        </div>

        <div class="ticket-container">
          <div class="ticket-header">
            <div>
              <p style="font-size:0.75rem; color:#64748b">PNR NUMBER</p>
              <div class="pnr-tag">${pnrNumber}</div>
            </div>
            <div class="qr-code-placeholder">
              [ SCAN QR ]
            </div>
          </div>

          <h3 style="font-size:1.1rem; margin-bottom:0.4rem">${train.name} (${train.number})</h3>
          <p style="font-size:0.85rem; color:#475569; margin-bottom:0.8rem">
            <strong>${train.from}</strong> to <strong>${train.to}</strong> | Class: 3A (AC 3 Tier)
          </p>

          <table style="width:100%; font-size:0.85rem; border-top:1px solid #cbd5e1; padding-top:0.5rem">
            <tr>
              <td><strong>Passenger:</strong> Vikram Sharma (29, M)</td>
              <td style="text-align:right"><strong>Status:</strong> <span style="color:#10b981">CNF / B3 / 42</span></td>
            </tr>
            <tr>
              <td><strong>Berth:</strong> ${currentState.selectedSeat}</td>
              <td style="text-align:right"><strong>Date:</strong> 25 Aug 2026</td>
            </tr>
          </table>
        </div>

        <div style="margin-top:1.25rem; display:flex; gap:0.75rem">
          <button class="btn-search" style="flex:1; margin-top:0" onclick="showToast('Digital Pass Saved to Wallet')">
            Download Pass PDF
          </button>
          <button class="switch-btn" style="border:1px solid var(--border-light); padding:0.75rem" onclick="closeModalDirect()">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}

/* Check PNR Status Logic */
function checkPNRStatus() {
  const pnrInput = document.getElementById('pnr-input');
  const pnrResultBox = document.getElementById('pnr-result-box');

  if (!pnrInput || !pnrResultBox) return;

  const val = pnrInput.value.trim();
  const pnrData = MOCK_PNRS['8429104523'];

  pnrResultBox.innerHTML = `
    <div style="background:var(--bg-card); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.25rem; margin-top:1rem">
      <div class="flex-between" style="margin-bottom:0.8rem">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted)">PNR: 8429104523</span>
          <h3>${pnrData.trainName} (#${pnrData.trainNumber})</h3>
        </div>
        <span class="status-badge status-available">CNF / CONFIRMED</span>
      </div>

      <div class="pnr-timeline">
        ${pnrData.timeline.map(stn => `
          <div class="timeline-step ${stn.status}">
            <strong style="font-size:0.9rem">${stn.station}</strong> (${stn.time})
            <p style="font-size:0.75rem; color:var(--text-muted)">${stn.label}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* Toast Message Notification */
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0f172a;
    color: white;
    padding: 0.8rem 1.25rem;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  `;
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
