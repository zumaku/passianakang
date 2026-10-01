// Sample Data Silsilah Keluarga (3 Generasi Bahasa Indonesia)
export const DEFAULT_FAMILY_DATA = [
  // Generasi 1: Kakek & Nenek (Perintis)
  {
    id: "1",
    pids: ["2"],
    name: "H. Raden Soetomo",
    gender: "male",
    title: "Kakek (Generasi 1)",
    birthDate: "1945-08-17",
    deathDate: "2020-05-12",
    job: "Pensiunan Pegawai",
    bio: "Pendiri silsilah keluarga besar Soetomo. Cinta keluarga dan menyukai kebun.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    pids: ["1"],
    name: "Hj. Siti Rahmah",
    gender: "female",
    title: "Nenek (Generasi 1)",
    birthDate: "1948-11-10",
    deathDate: "",
    job: "Ibu Rumah Tangga",
    bio: "Penyayang, pandai memasak resep kuliner nusantara.",
    img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
  },

  // Generasi 2: Anak-anak & Pasangan
  {
    id: "3",
    fid: "1",
    mid: "2",
    pids: ["4"],
    name: "Bambang Soetomo",
    gender: "male",
    title: "Ayah / Anak Sulung",
    birthDate: "1972-03-25",
    deathDate: "",
    job: "Arsitek UI/UX",
    bio: "Anak pertama yang berprofesi sebagai arsitek. Bertanggung jawab dan ramah.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    pids: ["3"],
    name: "Ratna Kartika",
    gender: "female",
    title: "Ibu",
    birthDate: "1975-09-14",
    deathDate: "",
    job: "Dokter Spesialis",
    bio: "Ibu rumah tangga berhati lembut dan penuh pengabdian medis.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "5",
    fid: "1",
    mid: "2",
    pids: ["6"],
    name: "Dewi Soetomo",
    gender: "female",
    title: "Bibi / Anak Bungsu",
    birthDate: "1978-06-20",
    deathDate: "",
    job: "Pengusaha Daring",
    bio: "Anak kedua yang hobi traveling dan wirausaha kreatif.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "6",
    pids: ["5"],
    name: "Hendra Wijaya",
    gender: "male",
    title: "Paman",
    birthDate: "1976-01-30",
    deathDate: "",
    job: "Dosen Informatika",
    bio: "Paman yang gemar dengan teknologi baru dan fotografi.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },

  // Generasi 3: Cucu-Cucu
  {
    id: "7",
    fid: "3",
    mid: "4",
    name: "Rizky Pratama Soetomo",
    gender: "male",
    title: "Cucu (Anak Sulung Bambang)",
    birthDate: "2000-04-12",
    deathDate: "",
    job: "Software Engineer",
    bio: "Mahasiswa lulusan teknik komputer yang gemar open source.",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "8",
    fid: "3",
    mid: "4",
    name: "Nabila Putri Soetomo",
    gender: "female",
    title: "Cucu (Anak Bungsu Bambang)",
    birthDate: "2005-08-22",
    deathDate: "",
    job: "Mahasiswi Desain Visual",
    bio: "Suka melukis, musik akustik, dan aktif di organisasi kampus.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "9",
    fid: "6",
    mid: "5",
    name: "Bima Wijaya",
    gender: "male",
    title: "Cucu (Anak Dewi)",
    birthDate: "2007-12-05",
    deathDate: "",
    job: "Pelajar SMA",
    bio: "Pemain basket sekolah yang ceria dan menyukai animasi.",
    img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  }
];
