import { StorageService } from './storageService.js';
import { FirebaseService } from './firebaseService.js';
import { FamilyTreeService } from './familyTreeService.js';
import { UIController } from './uiController.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('treeCanvas');
  if (!container) return;

  // 1. Instantiate tree service
  const treeService = new FamilyTreeService(container, {
    onNodeSelected: (node) => {
      if (window.appUI) {
        window.appUI.showMemberDetail(node);
      }
    }
  });

  // 2. Instantiate UI controller
  const ui = new UIController(treeService);
  window.appUI = ui;

  // 3. Load initial data dari Firestore Cloud
  try {
    const { data } = await StorageService.loadData();
    ui.setData(data);
    treeService.render(data);
  } catch (err) {
    console.error('Gagal memuat data dari Cloud Firestore:', err);
  }

  // 4. Subscribe to Firestore Real-time Updates (Live Sync)
  if (FirebaseService.isAvailable()) {
    FirebaseService.subscribeToMembers((cloudMembers) => {
      if (Array.isArray(cloudMembers) && cloudMembers.length > 0) {
        console.log('🔄 Live Update dari Cloud Firestore diterima:', cloudMembers.length, 'anggota');
        ui.setData(cloudMembers);
        treeService.render(cloudMembers);
      }
    });
  }

  console.log('Passianakang FamilyTree App (Firestore Mode) successfully initialized.');
});
