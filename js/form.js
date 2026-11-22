const labelPaket = {
  rumahan: "Paket rumahan",
  kantor: "Paket kantor",
  reseller: "Paket reseller",
};

const labelTopik = {
  produk: "Informasi produk",
  pesanan: "Status pesanan",
  "kerja-sama": "Kerja sama",
};

const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "wa", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const topikGroup = document.querySelector("#topik-group");
const topikError = document.querySelector("#topik-error");

const teksPreviewAwal = "Data form akan muncul setelah tombol dikirim.";

console.log("Field form:", fields);

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) {
    if (field.type === "checkbox") return "Centang persetujuan ini untuk melanjutkan.";
    if (field.tagName === "SELECT") return "Pilih salah satu paket.";
    return "Bagian ini wajib diisi.";
  }
  if (validity.typeMismatch) {
    return field.type === "email"
      ? "Format email belum sesuai, contoh: nama@email.com."
      : "Format data belum sesuai.";
  }
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) {
    return field.placeholder
      ? `Format belum sesuai, contoh: ${field.placeholder}.`
      : "Format belum sesuai contoh yang diminta.";
  }

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);                   
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");                         
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const valid = Array.from(topikInputs).some((input) => input.checked);

  if (topikError) {
    topikError.textContent = valid ? "" : "Pilih salah satu topik pertanyaan.";
  }
  if (topikGroup) {
    topikGroup.setAttribute("aria-invalid", valid ? "false" : "true");
  }
  return valid;
}

function tampilkanPreview() {
  const data = new FormData(form);
  const paket = data.get("paket");
  const topik = data.get("topik");

  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `No. WhatsApp: ${data.get("wa")}`,
    `Paket: ${labelPaket[paket] ?? paket}`,
    `Topik: ${labelTopik[topik] ?? topik}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

const STORAGE_KEY = "kopi-ku-preferensi-kontak";
const channelInputs = document.querySelectorAll("[data-channel]");
const statusPreferensi = document.querySelector("#status-preferensi");
const tombolSimpan = document.querySelector("#simpan-preferensi");
const tombolHapus = document.querySelector("#hapus-preferensi");

function setStatusPreferensi(teks) {
  if (statusPreferensi) {
    statusPreferensi.textContent = teks;
  }
}

function simpanPreferensi() {
  const data = new FormData(form);

  const preferensi = {
    paket: data.get("paket"),
    topik: data.get("topik"),
    channel: Array.from(channelInputs).filter((input) => input.checked).map((input) => input.value),
    updatedAt: new Date().toISOString(),
  };
  console.log("Preferensi yang akan disimpan:", preferensi);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    setStatusPreferensi("Preferensi tersimpan di browser ini.");
  } catch (error) {
    console.warn("Preferensi tidak bisa disimpan.", error);
    setStatusPreferensi("Preferensi gagal disimpan.");
  }
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);

    if (!tersimpan) {
      setStatusPreferensi("Belum ada preferensi tersimpan.");
      return;
    }

    const preferensi = JSON.parse(tersimpan);

    document.querySelector("#paket").value = preferensi.paket ?? "";

    if (preferensi.topik) {
      const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
      if (topik) topik.checked = true;
    }

    const channelTersimpan = Array.isArray(preferensi.channel) ? preferensi.channel : [];
    channelInputs.forEach((input) => {
      input.checked = channelTersimpan.includes(input.value);
    });

    setStatusPreferensi("Preferensi dimuat dari penyimpanan browser.");
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (errorHapus) {
      console.warn("Preferensi rusak tidak bisa dihapus.", errorHapus);
    }
    setStatusPreferensi("Data preferensi rusak dan sudah dibersihkan.");
  }
}

function hapusPreferensi() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Preferensi tidak bisa dihapus.", error);
  }

  document.querySelector("#paket").value = "";
  topikInputs.forEach((input) => {
    input.checked = false;
  });
  channelInputs.forEach((input) => {
    input.checked = false;
  });
  setStatusPreferensi("Preferensi dihapus.");
}

if (!form || !preview || !formFeedback || fields.some((field) => !field)) {
  console.warn("Elemen form kontak belum lengkap.");
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const hasil = fields.map((field) => validasiField(field));
    const semuaValid = hasil.every(Boolean);
    const topikValid = validasiTopik();

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
      formFeedback.classList.remove("success");
      preview.textContent = teksPreviewAwal;  
      form.reportValidity();

      form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
      return;
    }

    tampilkanPreview();
  });

  fields.forEach((field) => {
    ["input", "change"].forEach((namaEvent) => {
      field.addEventListener(namaEvent, () => {
        if (field.getAttribute("aria-invalid") === "true") {
          validasiField(field);
        }
      });
    });
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (topikGroup && topikGroup.getAttribute("aria-invalid") === "true") {
        validasiTopik();
      }
    });
  });

  tombolSimpan?.addEventListener("click", simpanPreferensi);
  tombolHapus?.addEventListener("click", hapusPreferensi);
  muatPreferensi();
}