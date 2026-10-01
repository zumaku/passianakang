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
    FamilyTree.templates.modernGlass.size = [230, 100];
    
    // Node SVG background with smooth rounded corners and border
    FamilyTree.templates.modernGlass.node = 
      '<rect x="0" y="0" height="100" width="230" fill="#1e293b" rx="14" ry="14" stroke="#475569" stroke-width="1.5" class="ft-node-rect"></rect>' +
      '<line x1="0" y1="0" x2="230" y2="0" stroke="#3b82f6" stroke-width="4" rx="2" class="ft-node-accent"></line>';

    // Image avatar configuration
    FamilyTree.templates.modernGlass.img_0 = 
      '<clipPath id="avatarClip_{val}">' +
        '<circle cx="42" cy="50" r="28"></circle>' +
      '</clipPath>' +
      '<circle cx="42" cy="50" r="30" fill="#3b82f6" opacity="0.3"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{val})" xlink:href="{val}" x="14" y="22" width="56" height="56"></image>';

    // Name text
    FamilyTree.templates.modernGlass.field_0 = 
      '<text style="font-size: 14px; font-weight: 600; font-family: Inter, sans-serif;" fill="#f8fafc" x="84" y="42">{val}</text>';

    // Title / Relationship text
    FamilyTree.templates.modernGlass.field_1 = 
      '<text style="font-size: 11px; font-family: Inter, sans-serif;" fill="#94a3b8" x="84" y="60">{val}</text>';

    // Birth Date text
    FamilyTree.templates.modernGlass.field_2 = 
      '<text style="font-size: 10px; font-family: Inter, sans-serif;" fill="#64748b" x="84" y="76">🎂 {val}</text>';

    // Custom male & female node accents
    FamilyTree.templates.modernGlass_male = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_male.node = 
      '<rect x="0" y="0" height="100" width="230" fill="#0f172a" rx="14" ry="14" stroke="#2563eb" stroke-width="1.5"></rect>' +
      '<rect x="0" y="0" height="100" width="6" fill="#3b82f6" rx="3"></rect>';

    FamilyTree.templates.modernGlass_female = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_female.node = 
      '<rect x="0" y="0" height="100" width="230" fill="#0f172a" rx="14" ry="14" stroke="#db2777" stroke-width="1.5"></rect>' +
      '<rect x="0" y="0" height="100" width="6" fill="#ec4899" rx="3"></rect>';
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
      return copy;
    });

    this.familyTree = new FamilyTree(this.container, {
      nodes: processedNodes,
      template: 'modernGlass',
      mouseScrool: FamilyTree.action.zoom,
      enableSearch: true,
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
        add: { 
          text: '➕ Tambah Kerabat', 
          onClick: (id) => this.triggerAddRelative(id) 
        }
      },
      editForm: {
        readOnly: true
      }
    });

    // Handle node click event
    this.familyTree.onNodeClick((args) => {
      if (this.onNodeSelectedCallback) {
        const node = this.getNodeById(args.node.id);
        this.onNodeSelectedCallback(node);
      }
      return true;
    });

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
        header: 'Silsilah Keluarga - Passiana Kang',
        footer: 'Dibuat dengan Passiana Kang FamilyTree.js'
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
