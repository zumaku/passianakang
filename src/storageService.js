import { DEFAULT_FAMILY_DATA } from './sampleData.js';

const STORAGE_KEY = 'passianakang_family_tree_data_v1';

export class StorageService {
  static loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const isValid = parsed.every(item => item && typeof item === 'object' && item.id);
          if (isValid) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca LocalStorage, memulihkan data default:', e);
    }

    // Auto-heal LocalStorage if empty or invalid
    const defaultData = JSON.parse(JSON.stringify(DEFAULT_FAMILY_DATA));
    this.saveData(defaultData);
    return defaultData;
  }

  static saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan data ke LocalStorage:', e);
      return false;
    }
  }

  static resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    const defaultData = JSON.parse(JSON.stringify(DEFAULT_FAMILY_DATA));
    this.saveData(defaultData);
    return defaultData;
  }

  static exportJSON(data, filename = 'silsilah_keluarga.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error('Format file JSON tidak valid. Data tidak boleh kosong.');
          }
          const isValid = parsed.every(item => item && typeof item === 'object' && 'id' in item);
          if (!isValid) {
            throw new Error('Data JSON tidak memiliki struktur id anggota yang benar.');
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file JSON.'));
      reader.readAsText(file);
    });
  }
}
