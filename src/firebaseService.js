import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  writeBatch, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { DEFAULT_TEMPLATE_FAMILY_DATA } from './templateData.js';

const COLLECTION_NAME = 'family_tree_members';

export class FirebaseService {
  /**
   * Cek apakah Firebase siap digunakan
   */
  static isAvailable() {
    return isFirebaseConfigured && db !== null;
  }

  /**
   * Mengambil semua data anggota keluarga dari koleksi Firestore.
   * Jika koleksi masih kosong, otomatis melakukan seeding data template default.
   */
  static async fetchMembers() {
    if (!this.isAvailable()) return null;

    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);

      if (snapshot.empty) {
        console.log('🌱 Koleksi Firestore kosong. Melakukan auto-seed template silsilah bawaan...');
        await this.seedTemplateData();
        return DEFAULT_TEMPLATE_FAMILY_DATA;
      }

      const members = [];
      snapshot.forEach((document) => {
        members.push({ id: document.id, ...document.data() });
      });

      return members;
    } catch (error) {
      console.error('🔥 Gagal membaca data dari Firestore:', error);
      throw error;
    }
  }

  /**
   * Mengunggah data template bawaan (tanpa data pribadi dummy) ke Firestore
   */
  static async seedTemplateData() {
    if (!this.isAvailable()) return false;

    try {
      const batch = writeBatch(db);
      DEFAULT_TEMPLATE_FAMILY_DATA.forEach((member) => {
        const docRef = doc(db, COLLECTION_NAME, String(member.id));
        const cleanMember = { ...member };
        delete cleanMember.id; // Menyimpan id sebagai ID dokumen
        batch.set(docRef, cleanMember);
      });

      await batch.commit();
      console.log('✅ Auto-seed data template ke Firestore berhasil.');
      return true;
    } catch (error) {
      console.error('🔥 Gagal melakukan auto-seed data template:', error);
      return false;
    }
  }

  /**
   * Mendengarkan perubahan data real-time dari Firestore (Real-time listener)
   */
  static subscribeToMembers(onDataReceived, onError) {
    if (!this.isAvailable()) return () => {};

    const colRef = collection(db, COLLECTION_NAME);
    return onSnapshot(colRef, (snapshot) => {
      if (snapshot.empty) {
        onDataReceived([]);
        return;
      }

      const members = [];
      snapshot.forEach((document) => {
        members.push({ id: document.id, ...document.data() });
      });

      onDataReceived(members);
    }, (error) => {
      console.error('🔥 Error Real-time Snapshot Firestore:', error);
      if (onError) onError(error);
    });
  }

  /**
   * Menyimpan / Memperbarui satu anggota keluarga
   */
  static async saveMember(member) {
    if (!this.isAvailable() || !member || !member.id) return false;

    try {
      const docRef = doc(db, COLLECTION_NAME, String(member.id));
      const payload = { ...member };
      delete payload.id;
      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (error) {
      console.error(`🔥 Gagal menyimpan anggota ID ${member.id} ke Firestore:`, error);
      return false;
    }
  }

  /**
   * Menghapus satu anggota keluarga dari Firestore
   */
  static async deleteMember(memberId) {
    if (!this.isAvailable() || !memberId) return false;

    try {
      const docRef = doc(db, COLLECTION_NAME, String(memberId));
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`🔥 Gagal menghapus anggota ID ${memberId} dari Firestore:`, error);
      return false;
    }
  }

  /**
   * Menyimpan seluruh array data (digunakan saat reset atau import JSON)
   */
  static async saveAllMembers(membersArray) {
    if (!this.isAvailable()) return false;

    try {
      // 1. Ambil dokumen eksisting & hapus batch lama jika ada yang terhapus
      const colRef = collection(db, COLLECTION_NAME);
      const existingSnapshot = await getDocs(colRef);
      
      const batch = writeBatch(db);
      existingSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      // 2. Tulis dokumen baru
      membersArray.forEach((member) => {
        const docRef = doc(db, COLLECTION_NAME, String(member.id));
        const cleanMember = { ...member };
        delete cleanMember.id;
        batch.set(docRef, cleanMember);
      });

      await batch.commit();
      console.log('✅ Seluruh data berhasil diperbarui ke Cloud Firestore.');
      return true;
    } catch (error) {
      console.error('🔥 Gagal memperbarui seluruh data ke Firestore:', error);
      return false;
    }
  }
}
