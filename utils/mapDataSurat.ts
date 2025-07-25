export function mapDataSurat(data: Record<string, any>, kode: string) {
  switch (kode) {
    case "SUKET_USAHA":
      return {
        namaUsaha: data.namaUsaha,
        jenisUsaha: data.jenisUsaha,
        alamatUsaha: data.alamatUsaha,
        lamaUsaha: data.lamaUsaha,
        jumlahKaryawan: data.jumlahKaryawan,
        penghasilanBulanan: data.penghasilanBulanan,
        tanggalMulaiUsaha: data.tanggalMulaiUsaha,
        fotoUsahaBase64: data.fotoUsahaBase64,
      };

    case "KEMATIAN":
      return {
        namaAlmarhum: data.namaAlmarhum,
        nikAlmarhum: data.nikAlmarhum,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin,
      };

    case "AHLI_WARIS":
      // Ambil semua field yang dimulai dengan aktaLahirAnak_
      const aktaLahirFiles: Record<string, any> = {};
      Object.keys(data).forEach(key => {
        if (key.startsWith('aktaLahirAnak_') && key.includes('_Base64')) {
          aktaLahirFiles[key] = data[key];
        }
      });

      return {
        daftarAnak: data.daftarAnak,
        aktaNikahBase64: data.aktaNikahBase64,
        ktpSaksiBase64: data.ktpSaksiBase64,
        // Spread semua akta lahir files
        ...aktaLahirFiles,
      };

    case "KELAHIRAN":
      return {
        namaAnak: data.namaAnak,
        jenisKelaminAnak: data.jenisKelaminAnak,
        tempatLahirAnak: data.tempatLahirAnak,
        tanggalLahirAnak: data.tanggalLahirAnak,
        agamaAnak: data.agamaAnak,
        namaAyah: data.namaAyah,
        namaIbu: data.namaIbu,
        namaSaksi1: data.namaSaksi1,
        namaSaksi2: data.namaSaksi2,
        suketRSBase64: data.suketRSBase64,
        ktpSaksiBase64: data.ktpSaksiBase64,
      };

    case "SUKET_ORTU":
      return {
        namaAyah: data.namaAyah,
        pekerjaanAyah: data.pekerjaanAyah,
        namaIbu: data.namaIbu,
        pekerjaanIbu: data.pekerjaanIbu,
        alamatOrtu: data.alamatOrtu,
        namaAnak: data.namaAnak,
        tanggalLahirAnak: data.tanggalLahirAnak,
        fileKtpAyahBase64: data.fileKtpAyahBase64,
        fileKtpIbuBase64: data.fileKtpIbuBase64,
        fileAktaLahirAnakBase64: data.fileAktaLahirAnakBase64,
      };

    case "TIDAK_DI_TEMPAT":
      return {
        idPasangan: data.idPasangan,
        namaYangTidakDiTempat: data.namaYangTidakDiTempat,
        hubungan: data.hubungan,
        alasanTidakDiTempat: data.alasanTidakDiTempat,
        lokasiTujuan: data.lokasiTujuan,
        tanggalMulai: data.tanggalMulai,
        tanggalSelesai: data.tanggalSelesai,
        suketPribadiPasanganBase64: data.suketPribadiPasanganBase64,
      };

    case "BELUM_MENIKAH":
      return {
        nama: data.nama,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        agama: data.agama,
        pekerjaan: data.pekerjaan,
        alamat: data.alamat,
        suratPengantarBase64: data.suratPengantarBase64,
        ktpBase64: data.ktpBase64,
      };

    case "NIKAH":
      return {
        binBinti: data.binBinti,
        statusPerkawinan: data.statusPerkawinan,
        statusSebelumnya: data.statusSebelumnya,
        alamatTinggal: data.alamatTinggal,
      };

    case "DOMISILI":
      return {
        alamatDomisili: data.alamatDomisili,
        tanggalTinggal: data.tanggalTinggal,
        statusTempatTinggal: data.statusTempatTinggal,
        namaPemilikRumah: data.namaPemilikRumah,
      };

    case "JANDA_DUDA":
      return {
        namaPasangan: data.namaPasangan,
        tempatLahirPasangan: data.tempatLahirPasangan,
        tanggalLahirPasangan: data.tanggalLahirPasangan,
        tanggalMeninggal: data.tanggalMeninggal,
        tempatMeninggal: data.tempatMeninggal,
        penyebab: data.penyebab,
        statusPerkawinan: data.statusPerkawinan,

        // Tambahan untuk file upload
        // aktaKematianSuamiIstri: data.aktaKematianSuamiIstri,
        aktaKematianSuamiIstriBase64: data.aktaKematianSuamiIstriBase64,
      };

    case "SKTM":
      return {
        namaAnak: data.namaAnak,
        nikAnak: data.nikAnak,
        sekolah: data.sekolah,
        alasan: data.alasan,
        aktaLahirBase64: data.aktaLahirBase64,
        suratPengantarBase64: data.suratPengantarBase64,
      };

    case "PINDAH_KELUAR":
      return {
        alasanPindah: data.alasanPindah,
        jenisKepindahan: data.jenisKepindahan,
        klasifikasiPindah: data.klasifikasiPindah,
        statusKK: data.statusKK,
        alamatTujuan: data.alamatTujuan,
        rtTujuan: data.rtTujuan,
        rwTujuan: data.rwTujuan,
        provinsi: data.provinsi,
        kabupaten: data.kabupaten,
        kecamatan: data.kecamatan,
        kelurahan: data.kelurahan,
      };

    default:
      return {};
  }
}
