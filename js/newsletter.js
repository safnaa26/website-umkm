const NEWSLETTER_KEY = "kopi-ku-newsletter";
const formNewsletter = document.querySelector("#form-newsletter");
const inputNewsletter = document.querySelector("#newsletter-email");
const errorNewsletter = document.querySelector("#newsletter-error");
const statusNewsletter = document.querySelector("#newsletter-status");

function pesanErrorNewsletter(input) {
  if (input.validity.valueMissing) return "Email wajib diisi.";
  if (input.validity.typeMismatch) return "Format email belum sesuai, contoh: nama@email.com.";
  return "";
}

function simpanNewsletter(email) {
  const data = { email, subscribedAt: new Date().toISOString() };

  try {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Newsletter tidak bisa disimpan.", error);
    return false;
  }
}

function muatNewsletter() {
  try {
    const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
    if (!tersimpan) return;

    const data = JSON.parse(tersimpan);
    if (data && typeof data.email === "string") {
      inputNewsletter.value = data.email;
      statusNewsletter.textContent = `Email terakhir yang didaftarkan: ${data.email}`;
    }
  } catch (error) {
    console.warn("Data newsletter tidak valid.", error);
    try {
      localStorage.removeItem(NEWSLETTER_KEY);
    } catch (errorHapus) {
      console.warn("Data newsletter rusak tidak bisa dihapus.", errorHapus);
    }
  }
}

if (formNewsletter && inputNewsletter && errorNewsletter && statusNewsletter) {
  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    const pesan = pesanErrorNewsletter(inputNewsletter);
    errorNewsletter.textContent = pesan;
    inputNewsletter.setAttribute("aria-invalid", pesan ? "true" : "false");

    if (pesan) {
      statusNewsletter.textContent = "";
      inputNewsletter.focus();
      return;
    }

    const email = inputNewsletter.value.trim();
    statusNewsletter.textContent = simpanNewsletter(email)
      ? `Terima kasih, ${email} sudah terdaftar (data dummy).`
      : "Pendaftaran gagal disimpan di browser ini.";
  });

  inputNewsletter.addEventListener("input", () => {
    if (inputNewsletter.getAttribute("aria-invalid") === "true") {
      const pesan = pesanErrorNewsletter(inputNewsletter);
      errorNewsletter.textContent = pesan;
      inputNewsletter.setAttribute("aria-invalid", pesan ? "true" : "false");
    }
  });

  muatNewsletter();
}