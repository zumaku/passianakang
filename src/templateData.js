// Template Data Silsilah Keluarga Bawaan (Default Generic Template)
export const DEFAULT_TEMPLATE_FAMILY_DATA = [
  // Generasi 1: Kakek & Nenek
  {
    id: "1",
    pids: ["2"],
    name: "Kakek Utama",
    gender: "male",
    title: "Kakek (Generasi 1)",
    birthDate: "1950-01-01",
    deathDate: "",
    job: "Kepala Keluarga Pertama",
    bio: "Leluhur / Pendiri silsilah keluarga.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    pids: ["1"],
    name: "Nenek Utama",
    gender: "female",
    title: "Nenek (Generasi 1)",
    birthDate: "1953-01-01",
    deathDate: "",
    job: "Ibu Rumah Tangga",
    bio: "Matriark keluarga besar.",
    img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"
  },

  // Generasi 2: Anak-anak (Ayah/Ibu & Paman/Bibi)
  {
    id: "3",
    fid: "1",
    mid: "2",
    pids: ["4"],
    name: "Nama Ayah",
    gender: "male",
    title: "Ayah (Anak Sulung)",
    birthDate: "1975-01-01",
    deathDate: "",
    job: "Pekerjaan Ayah",
    bio: "Catatan biografi Ayah.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    pids: ["3"],
    name: "Nama Ibu",
    gender: "female",
    title: "Ibu",
    birthDate: "1978-01-01",
    deathDate: "",
    job: "Pekerjaan Ibu",
    bio: "Catatan biografi Ibu.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "5",
    fid: "1",
    mid: "2",
    pids: ["6"],
    name: "Paman / Bibi",
    gender: "female",
    title: "Bibi (Anak Bungsu)",
    birthDate: "1980-01-01",
    deathDate: "",
    job: "Pekerjaan Bibi",
    bio: "Catatan biografi Bibi.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "6",
    pids: ["5"],
    name: "Suami Bibi",
    gender: "male",
    title: "Paman",
    birthDate: "1978-01-01",
    deathDate: "",
    job: "Pekerjaan Paman",
    bio: "Catatan biografi Paman.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },

  // Generasi 3: Cucu-cucu / Anak
  {
    id: "7",
    fid: "3",
    mid: "4",
    name: "Anak Pertama",
    gender: "male",
    title: "Cucu (Anak Sulung)",
    birthDate: "2002-01-01",
    deathDate: "",
    job: "Pelajar / Mahasiswa",
    bio: "Anggota keluarga generasi 3.",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "8",
    fid: "3",
    mid: "4",
    name: "Anak Kedua",
    gender: "female",
    title: "Cucu (Anak Bungsu)",
    birthDate: "2006-01-01",
    deathDate: "",
    job: "Pelajar",
    bio: "Anggota keluarga generasi 3.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "9",
    fid: "6",
    mid: "5",
    name: "Sepupu",
    gender: "male",
    title: "Cucu (Anak Bibi)",
    birthDate: "2008-01-01",
    deathDate: "",
    job: "Pelajar",
    bio: "Sepupu dari keturunan Paman & Bibi.",
    img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80"
  }
];
