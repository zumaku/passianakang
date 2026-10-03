import FamilyTree from '@balkangraph/familytree.js';

export class FamilyTreeService {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.familyTree = null;
    this.onNodeSelectedCallback = options.onNodeSelected || null;
    this.onDataChangedCallback = options.onDataChanged || null;
    this.initCustomTemplates();
  }

  initCustomTemplates() {
    // Custom modern template based on 'tommy'
    FamilyTree.templates.modernGlass = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.modernGlass.size = [250, 110];

    // Three dots menu button (positioned top right)
    FamilyTree.templates.modernGlass.menuButton =
      '<g style="cursor:pointer;" transform="matrix(1,0,0,1,216,10)" data-ctrl-n-menu-id="{id}">' +
        '<rect x="0" y="0" width="24" height="26" rx="6" fill="rgba(255, 255, 255, 0.08)" class="ft-menu-btn"></rect>' +
        '<circle cx="12" cy="6" r="2" fill="#cbd5e1"></circle>' +
        '<circle cx="12" cy="13" r="2" fill="#cbd5e1"></circle>' +
        '<circle cx="12" cy="20" r="2" fill="#cbd5e1"></circle>' +
      '</g>';

    // Image avatar configuration
    FamilyTree.templates.modernGlass.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="44" cy="55" r="26"></circle>' +
      '</clipPath>' +
      '<circle cx="44" cy="55" r="29" fill="none" stroke="#45A692" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="18" y="29" width="52" height="52"></image>';

    // Name text (clipped within card)
    FamilyTree.templates.modernGlass.field_0 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 13px; font-weight: 700; font-family: Inter, sans-serif;" fill="#ffffff" x="80" y="48">{val}</text>';

    // Title / Relationship text (clipped)
    FamilyTree.templates.modernGlass.field_1 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 11px; font-weight: 500; font-family: Inter, sans-serif;" fill="#94a3b8" x="80" y="66">{val}</text>';

    // Birth Date text (clipped)
    FamilyTree.templates.modernGlass.field_2 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 10px; font-weight: 400; font-family: Inter, sans-serif;" fill="#64748b" x="80" y="83">{val}</text>';

    // Custom male node accent & gender indicator badge
    FamilyTree.templates.modernGlass_male = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_male.node =
      '<rect x="0" y="0" height="110" width="250" fill="#0f172a" rx="14" ry="14" stroke="#3A8D7B" stroke-width="1.5" class="ft-node-card"></rect>' +
      '<g transform="translate(80, 12)">' +
        '<rect x="0" y="0" width="48" height="18" rx="9" fill="rgba(69, 166, 146, 0.2)" stroke="rgba(69, 166, 146, 0.4)" stroke-width="1"/>' +
        '<text x="24" y="12" text-anchor="middle" font-size="10" font-weight="600" font-family="Inter, sans-serif" fill="#7AD4C0">♂ Pria</text>' +
      '</g>' +
      '<clipPath id="textClip_{id}"><rect x="80" y="34" width="132" height="70" /></clipPath>';

    // Custom female node accent & gender indicator badge
    FamilyTree.templates.modernGlass_female = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_female.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="44" cy="55" r="26"></circle>' +
      '</clipPath>' +
      '<circle cx="44" cy="55" r="29" fill="none" stroke="#ec4899" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="18" y="29" width="52" height="52"></image>';

    FamilyTree.templates.modernGlass_female.node =
      '<rect x="0" y="0" height="110" width="250" fill="#0f172a" rx="14" ry="14" stroke="#db2777" stroke-width="1.5" class="ft-node-card"></rect>' +
      '<g transform="translate(80, 12)">' +
        '<rect x="0" y="0" width="58" height="18" rx="9" fill="rgba(236, 72, 153, 0.2)" stroke="rgba(236, 72, 153, 0.4)" stroke-width="1"/>' +
        '<text x="29" y="12" text-anchor="middle" font-size="10" font-weight="600" font-family="Inter, sans-serif" fill="#fbcfe8">♀ Wanita</text>' +
      '</g>' +
      '<clipPath id="textClip_{id}"><rect x="80" y="34" width="132" height="70" /></clipPath>';
  }

  render(nodesData) {
    if (this.familyTree) {
      this.familyTree.destroy();
      this.container.innerHTML = '';
    }

    // Default fallback image if missing
    const defaultAvatarMale = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    const defaultAvatarFemale = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

    const processedNodes = nodesData.map(node => {
      const copy = { ...node };
      if (!copy.img) {
        copy.img = copy.gender === 'female' ? defaultAvatarFemale : defaultAvatarMale;
      }
      if (!copy.tags || !Array.isArray(copy.tags)) {
        copy.tags = [copy.gender || 'male'];
      }
      return copy;
    });

    this.familyTree = new FamilyTree(this.container, {
      nodes: processedNodes,
      template: 'modernGlass',
      mouseScrool: FamilyTree.action.zoom,
      enableSearch: false,
      scaleInitial: FamilyTree.match.boundary,
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'birthDate',
        img_0: 'img'
      },
      tags: {
        male: {
          template: 'modernGlass_male'
        },
        female: {
          template: 'modernGlass_female'
        }
      },
      nodeMenu: {
        details: {
          text: '🔍 Lihat Detail',
          onClick: (id) => this.triggerSelectNode(id)
        },
        edit: {
          text: '✏️ Edit Data Anggota',
          onClick: (id) => this.triggerEditNode(id)
        },
        add: {
          text: '➕ Tambah Kerabat',
          onClick: (id) => this.triggerAddRelative(id)
        }
      },
      editForm: null // Disable built-in Balkan edit form to prevent overlapping sidebars
    });

    // Handle node click event - return false to cancel Balkan built-in sidebar popup
    this.familyTree.onNodeClick((args) => {
      if (this.onNodeSelectedCallback) {
        const node = this.getNodeById(args.node.id);
        this.onNodeSelectedCallback(node);
      }
      return false;
    });

    // Auto-fit tree scale after render
    setTimeout(() => {
      if (this.familyTree) {
        this.familyTree.fit();
      }
    }, 100);

    // Return current count
    return processedNodes.length;
  }

  getNodeById(id) {
    if (!this.familyTree) return null;
    return this.familyTree.get(id);
  }

  getAllNodes() {
    if (!this.familyTree) return [];
    // Extract array of node objects from familyTree instance
    const nodesMap = this.familyTree.nodes;
    const result = [];
    for (let id in nodesMap) {
      if (nodesMap.hasOwnProperty(id)) {
        const n = nodesMap[id];
        result.push({
          id: String(n.id),
          pids: n.pids ? n.pids.map(String) : [],
          mid: n.mid ? String(n.mid) : undefined,
          fid: n.fid ? String(n.fid) : undefined,
          name: n.name || '',
          gender: n.gender || 'male',
          title: n.title || '',
          birthDate: n.birthDate || '',
          deathDate: n.deathDate || '',
          job: n.job || '',
          bio: n.bio || '',
          img: n.img || ''
        });
      }
    }
    return result;
  }

  triggerSelectNode(id) {
    const node = this.getNodeById(id);
    if (node && this.onNodeSelectedCallback) {
      this.onNodeSelectedCallback(node);
    }
  }

  triggerEditNode(id) {
    if (window.appUI) {
      window.appUI.openEditMemberModal(id);
    }
  }

  triggerAddRelative(parentId) {
    if (window.appUI) {
      window.appUI.openAddRelativeModal(parentId);
    }
  }

  search(query) {
    if (this.familyTree && query) {
      this.familyTree.search(query);
    }
  }

  zoomIn() {
    if (this.familyTree) {
      this.familyTree.zoom(true);
    }
  }

  zoomOut() {
    if (this.familyTree) {
      this.familyTree.zoom(false);
    }
  }

  fitToScreen() {
    if (this.familyTree) {
      this.familyTree.fit();
    }
  }

  exportPDF() {
    if (this.familyTree) {
      this.familyTree.exportPDF({
        filename: 'silsilah_keluarga.pdf',
        format: 'A4',
        header: 'Silsilah Keluarga - Passianakang',
        footer: 'Dibuat dengan Passianakang FamilyTree.js'
      });
    }
  }

  exportPNG() {
    if (this.familyTree) {
      this.familyTree.exportPNG({
        filename: 'silsilah_keluarga.png'
      });
    }
  }

  exportSVG() {
    if (this.familyTree) {
      this.familyTree.exportSVG({
        filename: 'silsilah_keluarga.svg'
      });
    }
  }
}
