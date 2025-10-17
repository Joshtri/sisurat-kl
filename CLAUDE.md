Prompt ke Claude:

Tambahkan fitur penilaian bintang dan deskripsi pada sistem permohonan warga.

Fitur ini hanya muncul di halaman warga/permohonan/history jika status permohonan sudah DIVERIFIKASI_LURAH.

Penilaian dilakukan per tahap proses: RT, Staf, dan Lurah.

Setiap tahap memiliki penilaian masing-masing (bintang 1–5 dan deskripsi opsional).

Rating hanya bisa diberikan 1 kali per tahap oleh warga. Setelah rating diberikan, tampilkan hasilnya, bukan form-nya lagi.

Buat API untuk menyimpan dan mengambil data rating tersebut, serta validasi agar tidak bisa memberi rating dua kali di tahap yang sama.

Buat komponen frontend untuk tombol “Beri Penilaian”, modal/form bintang dan deskripsi, serta tampilan hasil rating per tahap.

Integrasikan dengan sistem autentikasi user yang sudah ada.

Pastikan UX-nya mulus: begitu rating diberikan, hasil langsung muncul tanpa perlu reload manual.