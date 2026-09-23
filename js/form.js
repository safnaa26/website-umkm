const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

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

if (form && preview) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

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
  });
}