import { FirebaseService } from './firebaseService.js';
import { DEFAULT_TEMPLATE_FAMILY_DATA } from './templateData.js';

export class StorageService {
  /**
   * Mengambil data silsilah keluarga HANYA dari Firebase Cloud Firestore.
   */
  static async loadData() {
    if (!FirebaseService.isAvailable()) {
      console.warn('⚠️ Firebase belum terkonfigurasi. Pastikan file .env telah diisi.');
      return { data: DEFAULT_TEMPLATE_FAMILY_DATA, source: 'unconfigured' };
    }

    try {
      const cloudData = await FirebaseService.fetchMembers();
      return { data: cloudData || [], source: 'firestore' };
    } catch (err) {
      console.error('🔥 Gagal mengambil data dari Firestore Cloud:', err);
      throw err;
    }
  }

  /**
   * Menyimpan seluruh data secara eksklusif ke Firebase Cloud Firestore.
   */
  static async saveData(data) {
    if (FirebaseService.isAvailable()) {
      return await FirebaseService.saveAllMembers(data);
    }
    return false;
  }

  /**
   * Menyimpan 1 anggota keluarga ke Firestore
   */
  static async saveMember(member) {
    if (FirebaseService.isAvailable()) {
      return await FirebaseService.saveMember(member);
    }
    return false;
  }

  /**
   * Menghapus 1 anggota keluarga dari Firestore
   */
  static async deleteMember(memberId) {
    if (FirebaseService.isAvailable()) {
      return await FirebaseService.deleteMember(memberId);
    }
    return false;
  }

  /**
   * Reset data Firestore ke template bawaan generik (Kakek, Ayah, Ibu, dll)
   */
  static async resetToDefault() {
    if (FirebaseService.isAvailable()) {
      await FirebaseService.saveAllMembers(DEFAULT_TEMPLATE_FAMILY_DATA);
    }
    return DEFAULT_TEMPLATE_FAMILY_DATA;
  }

  /**
   * Ekspor data ke file JSON
   */
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

  /**
   * Impor data dari file JSON langsung ke Firestore
   */
  static async importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error('Format file JSON tidak valid. Data tidak boleh kosong.');
          }
          const isValid = parsed.every(item => item && typeof item === 'object' && 'id' in item);
          if (!isValid) {
            throw new Error('Data JSON tidak memiliki struktur id anggota yang benar.');
          }

          // Simpan langsung ke Firestore
          await this.saveData(parsed);
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
