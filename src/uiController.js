import { createIcons, icons } from 'lucide';
import { StorageService } from './storageService.js';

export class UIController {
  constructor(treeService) {
    this.treeService = treeService;
    this.currentData = [];
    this.activeMemberId = null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Sidebar detail elements
    this.detailPanel = document.getElementById('detailPanel');
    this.detailAvatar = document.getElementById('detailAvatar');
    this.detailName = document.getElementById('detailName');
    this.detailTitle = document.getElementById('detailTitle');
    this.detailGenderBadge = document.getElementById('detailGenderBadge');
    this.detailBirthDate = document.getElementById('detailBirthDate');
    this.detailDeathDate = document.getElementById('detailDeathDate');
    this.detailJob = document.getElementById('detailJob');
    this.detailBio = document.getElementById('detailBio');
    this.detailParentsList = document.getElementById('detailParentsList');
    this.detailSpousesList = document.getElementById('detailSpousesList');
    this.detailChildrenList = document.getElementById('detailChildrenList');
    this.btnEditMember = document.getElementById('btnEditMember');
    this.btnDeleteMember = document.getElementById('btnDeleteMember');
    this.btnCloseDetail = document.getElementById('btnCloseDetail');

    // Modals
    this.memberModal = document.getElementById('memberModal');
    this.memberModalTitle = document.getElementById('memberModalTitle');
    this.memberForm = document.getElementById('memberForm');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelForm = document.getElementById('btnCancelForm');

    // Form inputs
    this.inputId = document.getElementById('memberId');
    this.inputName = document.getElementById('memberName');
    this.inputGender = document.getElementById('memberGender');
    this.inputTitle = document.getElementById('memberTitle');
    this.inputBirthDate = document.getElementById('memberBirthDate');
    this.inputDeathDate = document.getElementById('memberDeathDate');
    this.inputJob = document.getElementById('memberJob');
    this.inputImg = document.getElementById('memberImg');
    this.inputFather = document.getElementById('memberFather');
    this.inputMother = document.getElementById('memberMother');
    this.inputSpouse = document.getElementById('memberSpouse');
    this.inputBio = document.getElementById('memberBio');

    // Controls bar
    this.btnAddMember = document.getElementById('btnAddMember');
    this.btnEditNav = document.getElementById('btnEditNav');
    this.btnResetData = document.getElementById('btnResetData');
    this.btnExportJSON = document.getElementById('btnExportJSON');
    this.btnImportJSON = document.getElementById('btnImportJSON');
    this.btnExportPNG = document.getElementById('btnExportPNG');
    this.btnExportPDF = document.getElementById('btnExportPDF');
    this.fileInputJSON = document.getElementById('fileInputJSON');
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');

    // Stats counter
    this.statTotalMembers = document.getElementById('statTotalMembers');
    this.statGenerations = document.getElementById('statGenerations');

    // Hamburger menu & Theme Toggle
    this.btnThemeToggle = document.getElementById('btnThemeToggle');
    this.btnHamburger = document.getElementById('btnHamburger');
    this.btnCloseDrawer = document.getElementById('btnCloseDrawer');
    this.navActions = document.getElementById('navActions');
    this.navOverlay = document.getElementById('navOverlay');
  }

  bindEvents() {
    // Lucide icons render
    createIcons({ icons });

    // Theme toggle init and bind
    this.initTheme();
    if (this.btnThemeToggle) {
      this.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Hamburger menu toggle
    if (this.btnHamburger) {
      this.btnHamburger.addEventListener('click', () => this.toggleMobileMenu());
    }
    if (this.btnCloseDrawer) {
      this.btnCloseDrawer.addEventListener('click', () => this.closeMobileMenu());
    }
    if (this.navOverlay) {
      this.navOverlay.addEventListener('click', () => this.closeMobileMenu());
    }
    // Auto-close mobile menu when any nav button is clicked
    if (this.navActions) {
      this.navActions.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) {
          this.closeMobileMenu();
        }
      });
    }

    // Close detail panel
    if (this.btnCloseDetail) {
      this.btnCloseDetail.addEventListener('click', () => this.closeDetailPanel());
    }

    // Modal controls
    if (this.btnAddMember) {
      this.btnAddMember.addEventListener('click', () => this.openAddMemberModal());
    }
    if (this.btnEditNav) {
      this.btnEditNav.addEventListener('click', () => {
        if (this.activeMemberId) {
          this.openEditMemberModal(this.activeMemberId);
        } else if (this.currentData.length > 0) {
          // If no member selected, edit first member or show notice
          this.openEditMemberModal(this.currentData[0].id);
          this.showToast(`Membuka form edit untuk "${this.currentData[0].name}". Klik node anggota lain untuk mengeditnya.`, 'info');
        } else {
          this.showToast('Belum ada data anggota untuk diedit.', 'error');
        }
      });
    }
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => this.closeMemberModal());
    }
    if (this.btnCancelForm) {
      this.btnCancelForm.addEventListener('click', () => this.closeMemberModal());
    }

    // Form submit
    if (this.memberForm) {
      this.memberForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Detail actions
    if (this.btnEditMember) {
      this.btnEditMember.addEventListener('click', () => {
        if (this.activeMemberId) {
          this.openEditMemberModal(this.activeMemberId);
        }
      });
    }

    if (this.btnDeleteMember) {
      this.btnDeleteMember.addEventListener('click', () => {
        if (this.activeMemberId) {
          this.deleteMember(this.activeMemberId);
        }
      });
    }

    // Search bar & dropdown
    if (this.searchInput && this.searchResults) {
      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.handleSearchInput(query);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = this.searchInput.value.trim();
          if (query && this.currentData.length > 0) {
            const match = this.currentData.find(m => 
              m.name.toLowerCase().includes(query.toLowerCase())
            );
            if (match) {
              this.selectSearchResult(match);
            }
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
          this.closeSearchResults();
        }
      });
    }

    // Zoom controls
    document.getElementById('btnZoomIn')?.addEventListener('click', () => this.treeService.zoomIn());
    document.getElementById('btnZoomOut')?.addEventListener('click', () => this.treeService.zoomOut());
    document.getElementById('btnFitScreen')?.addEventListener('click', () => this.treeService.fitToScreen());

    // Export / Import
    if (this.btnExportJSON) {
      this.btnExportJSON.addEventListener('click', () => {
        StorageService.exportJSON(this.currentData);
        this.showToast('File data JSON berhasil diunduh.', 'success');
      });
    }

    if (this.btnExportPNG) {
      this.btnExportPNG.addEventListener('click', () => {
        this.treeService.exportPNG();
        this.showToast('Mengekspor gambar PNG...', 'info');
      });
    }

    if (this.btnExportPDF) {
      this.btnExportPDF.addEventListener('click', () => {
        this.treeService.exportPDF();
        this.showToast('Mengekspor dokumen PDF...', 'info');
      });
    }

    if (this.btnImportJSON && this.fileInputJSON) {
      this.btnImportJSON.addEventListener('click', () => this.fileInputJSON.click());
      this.fileInputJSON.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imported = await StorageService.importJSON(file);
          this.updateDataAndRender(imported);
          this.showToast(`Berhasil mengimpor ${imported.length} data anggota.`, 'success');
        } catch (err) {
          this.showToast(`Gagal mengimpor JSON: ${err.message}`, 'error');
        }
        this.fileInputJSON.value = '';
      });
    }

    if (this.btnResetData) {
      this.btnResetData.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin mengembalikan data ke template default silsilah?')) {
          const resetData = await StorageService.resetToDefault();
          await this.updateDataAndRender(resetData);
          this.showToast('Data silsilah telah dikembalikan ke template bawaan.', 'info');
        }
      });
    }
  }

  setData(data) {
    this.currentData = data;
    this.updateStats();
  }

  updateStats() {
    if (this.statTotalMembers) {
      this.statTotalMembers.textContent = this.currentData.length;
    }
  }

  async updateDataAndRender(newData) {
    this.currentData = newData;
    await StorageService.saveData(newData);
    this.treeService.render(newData);
    this.updateStats();
    this.closeDetailPanel();
  }

  showMemberDetail(member) {
    if (!member) return;
    this.activeMemberId = member.id;

    // Fill detail fields
    this.detailAvatar.src = member.img || (member.gender === 'female' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' 
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

    this.detailName.textContent = member.name || 'Tanpa Nama';
    this.detailTitle.textContent = member.title || 'Anggota Keluarga';
    
    // Gender badge
    if (member.gender === 'female') {
      this.detailGenderBadge.className = 'badge badge-pink';
      this.detailGenderBadge.textContent = '♀ Wanita';
    } else {
      this.detailGenderBadge.className = 'badge badge-blue';
      this.detailGenderBadge.textContent = '♂ Pria';
    }

    this.detailBirthDate.textContent = member.birthDate ? `Tanggal Lahir: ${member.birthDate}` : 'Tanggal Lahir: -';
    this.detailDeathDate.textContent = member.deathDate ? `Tanggal Wafat: ${member.deathDate}` : '';
    this.detailJob.textContent = member.job ? `Pekerjaan: ${member.job}` : 'Pekerjaan: -';
    this.detailBio.textContent = member.bio || 'Belum ada catatan biografi.';

    // Populate relations lists
    this.renderRelationsList(member);

    // Open panel slider
    this.detailPanel.classList.add('open');
  }

  renderRelationsList(member) {
    // Clear old lists
    this.detailParentsList.innerHTML = '';
    this.detailSpousesList.innerHTML = '';
    this.detailChildrenList.innerHTML = '';

    // Parents
    const father = this.currentData.find(m => m.id === member.fid);
    const mother = this.currentData.find(m => m.id === member.mid);
    
    if (father) this.appendRelationItem(this.detailParentsList, father, 'Ayah');
    if (mother) this.appendRelationItem(this.detailParentsList, mother, 'Ibu');
    if (!father && !mother) {
      this.detailParentsList.innerHTML = '<li class="text-subtle">Tidak terdaftar</li>';
    }

    // Spouses
    const pids = member.pids || [];
    const spouses = this.currentData.filter(m => pids.includes(m.id));
    if (spouses.length > 0) {
      spouses.forEach(s => this.appendRelationItem(this.detailSpousesList, s, 'Pasangan'));
    } else {
      this.detailSpousesList.innerHTML = '<li class="text-subtle">Tidak terdaftar</li>';
    }

    // Children (members where fid == member.id OR mid == member.id)
    const children = this.currentData.filter(m => m.fid === member.id || m.mid === member.id);
    if (children.length > 0) {
      children.forEach(c => this.appendRelationItem(this.detailChildrenList, c, 'Anak'));
    } else {
      this.detailChildrenList.innerHTML = '<li class="text-subtle">Belum ada anak</li>';
    }
  }

  appendRelationItem(container, member, roleLabel) {
    const li = document.createElement('li');
    li.className = 'relation-item';
    li.innerHTML = `
      <img src="${member.img}" class="relation-avatar" alt="${member.name}" />
      <div class="relation-info">
        <span class="relation-name">${member.name}</span>
        <span class="relation-role">${roleLabel}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      this.showMemberDetail(member);
      this.treeService.search(member.name);
    });
    container.appendChild(li);
  }

  closeDetailPanel() {
    this.detailPanel.classList.remove('open');
    this.activeMemberId = null;
  }

  toggleMobileMenu() {
    const isOpen = this.navActions.classList.toggle('open');
    this.btnHamburger.classList.toggle('active', isOpen);
    this.navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.navActions.classList.remove('open');
    this.btnHamburger.classList.remove('active');
    this.navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  populateParentOptions(excludeId = null) {
    // Clear father, mother, spouse options
    this.inputFather.innerHTML = '<option value="">-- Tanpa Ayah --</option>';
    this.inputMother.innerHTML = '<option value="">-- Tanpa Ibu --</option>';
    this.inputSpouse.innerHTML = '<option value="">-- Tanpa Pasangan --</option>';

    this.currentData.forEach(m => {
      if (m.id === excludeId) return;

      const optionF = document.createElement('option');
      optionF.value = m.id;
      optionF.textContent = `${m.name} (${m.title || 'Pria'})`;
      if (m.gender === 'male') this.inputFather.appendChild(optionF);

      const optionM = document.createElement('option');
      optionM.value = m.id;
      optionM.textContent = `${m.name} (${m.title || 'Wanita'})`;
      if (m.gender === 'female') this.inputMother.appendChild(optionM);

      const optionS = document.createElement('option');
      optionS.value = m.id;
      optionS.textContent = `${m.name} (${m.gender === 'male' ? 'Pria' : 'Wanita'})`;
      this.inputSpouse.appendChild(optionS);
    });
  }

  openAddMemberModal() {
    this.memberModalTitle.textContent = 'Tambah Anggota Keluarga Baru';
    this.memberForm.reset();
    this.inputId.value = '';
    this.populateParentOptions();
    this.memberModal.classList.add('open');
  }

  openAddRelativeModal(relatedMemberId) {
    this.openAddMemberModal();
    const related = this.currentData.find(m => m.id === String(relatedMemberId));
    if (related) {
      if (related.gender === 'male') {
        this.inputFather.value = related.id;
      } else {
        this.inputMother.value = related.id;
      }
    }
  }

  openEditMemberModal(id) {
    const member = this.currentData.find(m => m.id === String(id));
    if (!member) return;

    this.memberModalTitle.textContent = `Edit Data ${member.name}`;
    this.populateParentOptions(member.id);

    this.inputId.value = member.id;
    this.inputName.value = member.name || '';
    this.inputGender.value = member.gender || 'male';
    this.inputTitle.value = member.title || '';
    this.inputBirthDate.value = member.birthDate || '';
    this.inputDeathDate.value = member.deathDate || '';
    this.inputJob.value = member.job || '';
    this.inputImg.value = member.img || '';
    this.inputBio.value = member.bio || '';

    this.inputFather.value = member.fid || '';
    this.inputMother.value = member.mid || '';
    this.inputSpouse.value = (member.pids && member.pids.length > 0) ? member.pids[0] : '';

    this.memberModal.classList.add('open');
  }

  closeMemberModal() {
    this.memberModal.classList.remove('open');
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const id = this.inputId.value ? this.inputId.value : String(Date.now());
    const name = this.inputName.value.trim();
    if (!name) {
      this.showToast('Nama anggota tidak boleh kosong!', 'error');
      return;
    }

    const gender = this.inputGender.value;
    const title = this.inputTitle.value.trim();
    const birthDate = this.inputBirthDate.value;
    const deathDate = this.inputDeathDate.value;
    const job = this.inputJob.value.trim();
    const img = this.inputImg.value.trim();
    const bio = this.inputBio.value.trim();
    const fid = this.inputFather.value || undefined;
    const mid = this.inputMother.value || undefined;
    const spouseId = this.inputSpouse.value;

    const pids = spouseId ? [spouseId] : [];

    const memberObject = {
      id,
      name,
      gender,
      title,
      birthDate,
      deathDate,
      job,
      img,
      bio,
      fid,
      mid,
      pids
    };

    let updatedData = [...this.currentData];
    const existingIndex = updatedData.findIndex(m => m.id === id);

    if (existingIndex >= 0) {
      // Edit existing
      updatedData[existingIndex] = memberObject;
    } else {
      // Add new
      updatedData.push(memberObject);
    }

    // Bidirectional spouse linking check
    if (spouseId) {
      const spouseIndex = updatedData.findIndex(m => m.id === spouseId);
      if (spouseIndex >= 0) {
        const spouseObj = { ...updatedData[spouseIndex] };
        if (!spouseObj.pids) spouseObj.pids = [];
        if (!spouseObj.pids.includes(id)) {
          spouseObj.pids.push(id);
          updatedData[spouseIndex] = spouseObj;
        }
      }
    }

    this.updateDataAndRender(updatedData);
    this.closeMemberModal();
    this.showToast(`Anggota "${name}" berhasil disimpan.`, 'success');
  }

  deleteMember(id) {
    const member = this.currentData.find(m => m.id === String(id));
    if (!member) return;

    if (confirm(`Apakah Anda yakin ingin menghapus "${member.name}" dari silsilah keluarga?`)) {
      let updatedData = this.currentData.filter(m => m.id !== String(id));

      // Remove references in other members
      updatedData = updatedData.map(m => {
        const copy = { ...m };
        if (copy.fid === String(id)) delete copy.fid;
        if (copy.mid === String(id)) delete copy.mid;
        if (copy.pids) {
          copy.pids = copy.pids.filter(p => p !== String(id));
        }
        return copy;
      });

      this.updateDataAndRender(updatedData);
      this.showToast(`Anggota "${member.name}" telah dihapus.`, 'info');
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4000);
  }

  handleSearchInput(query) {
    if (!query) {
      this.closeSearchResults();
      return;
    }

    const q = query.toLowerCase();
    const matches = this.currentData.filter(m => 
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.job && m.job.toLowerCase().includes(q))
    );

    this.renderSearchResults(matches);
  }

  renderSearchResults(matches) {
    if (!this.searchResults) return;
    this.searchResults.innerHTML = '';

    if (matches.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">Tidak ada anggota yang cocok</div>';
      this.searchResults.classList.add('active');
      return;
    }

    matches.slice(0, 8).forEach(member => {
      const defaultAvatar = member.gender === 'female' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <img src="${member.img || defaultAvatar}" class="search-item-avatar" alt="${member.name}" />
        <div class="search-item-info">
          <span class="search-item-name">${member.name}</span>
          <span class="search-item-title">${member.title || (member.gender === 'female' ? 'Wanita' : 'Pria')}</span>
        </div>
      `;

      item.addEventListener('click', () => this.selectSearchResult(member));
      this.searchResults.appendChild(item);
    });

    this.searchResults.classList.add('active');
  }

  selectSearchResult(member) {
    if (!member) return;
    this.closeSearchResults();
    if (this.searchInput) this.searchInput.value = member.name;
    
    // Center tree & highlight node
    this.treeService.centerNode(member.id);
    
    // Open detail panel
    this.showMemberDetail(member);

    // Close mobile menu if open
    this.closeMobileMenu();
  }

  closeSearchResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove('active');
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('passianakang_theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  toggleTheme() {
    const currentIsLight = document.body.classList.contains('theme-light');
    const newTheme = currentIsLight ? 'dark' : 'light';
    this.applyTheme(newTheme);
    localStorage.setItem('passianakang_theme', newTheme);
    this.showToast(`Beralih ke Tema ${newTheme === 'light' ? 'Terang' : 'Gelap'}`, 'info');
  }

  applyTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    // Toggle theme icons
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    
    if (sunIcon) sunIcon.style.display = isLight ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = isLight ? 'block' : 'none';
  }
}
