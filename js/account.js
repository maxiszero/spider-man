(() => {
  "use strict";

  const sessionKey = "spider-index.session";
  const accountKey = email => "spider-index.user:" + email;
  const form = document.querySelector("[data-auth]");
  const profile = document.querySelector("[data-profile]");
  const status = document.querySelector("[data-form-status]");
  const signup = form?.dataset.auth === "signup";
  const rounds = 600000;

  function readAccount(email) {
    if (!email) return null;
    const stored = localStorage.getItem(accountKey(email));
    return stored ? JSON.parse(stored) : null;
  }

  function showStorageError() {
    status.textContent = "Your browser could not open the local account data. Allow site storage in this browser, then try again.";
  }

  function refreshAccountPage() {
    try {
      const email = localStorage.getItem(sessionKey);
      const account = readAccount(email);
      if (email && (!account || account.email !== email)) localStorage.removeItem(sessionKey);
      if (profile && (!account || account.email !== email)) {
        location.replace("login.html");
      } else if (form && account && account.email === email) {
        location.replace("profile.html");
      } else if (profile) {
        profile.querySelectorAll("[data-detail]").forEach(element => {
          element.textContent = account[element.dataset.detail];
        });
        const count = window.SpiderIndexFilms?.getSavedIds().length;
        profile.querySelector("[data-saved-count]").textContent = count == null ? "" : "(" + count + ")";
        profile.querySelector("[data-profile-details]").hidden = false;
      }
    } catch {
      if (profile) profile.querySelector("[data-profile-details]").hidden = true;
      showStorageError();
    }
  }

  function validPhone(value) {
    if (!/^\+?[\d ()-]+$/.test(value)) return false;
    const digits = value.replace(/\D/g, "");
    if (value.startsWith("+7") || value.startsWith("+1")) return digits.length === 11;
    if (value.startsWith("+")) return /^[1-9]\d{7,14}$/.test(digits);
    return /^(?:[78])?7\d{9}$/.test(digits);
  }

  function validationError(input) {
    const value = input.value;
    switch (input.name) {
      case "name":
        return value.trim() ? "" : "Enter your name so we can identify your profile.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter an email address such as name@example.com.";
      case "phone":
        return validPhone(value.trim()) ? "" : "Enter a Kazakhstan phone number or use + and your country code.";
      case "password":
        if (!value) return "Enter your password.";
        if (value.length < 8 || !/\p{Lu}/u.test(value) || !/\p{Ll}/u.test(value) || !/\p{Nd}/u.test(value)) {
          return "Use at least 8 characters, including an uppercase letter, a lowercase letter and a number.";
        }
        return "";
      case "confirm":
        return value && value === form.elements.password.value ? "" : "Enter the same password in both fields.";
      default:
        return "";
    }
  }

  function markField(input) {
    const message = validationError(input);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    document.getElementById(input.id + "-error").textContent = message;
    return !message;
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  // Only the salt and derived verifier are persisted in the local classroom account.
  async function deriveVerifier(password, saltHex) {
    const salt = Uint8Array.from(saltHex.match(/../g), pair => parseInt(pair, 16));
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: rounds, hash: "SHA-256" }, key, 256);
    return toHex(bits);
  }

  async function submitAccount(event) {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    if (submit.disabled) return;
    status.textContent = "";
    const fields = [...form.querySelectorAll("input")];
    const invalid = fields.filter(input => !markField(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    if (!globalThis.crypto?.subtle) {
      status.textContent = "Open the secure HTTPS version of Spider Index or use localhost to access your account.";
      return;
    }
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const name = form.elements.name?.value.trim();
    const phone = form.elements.phone?.value.trim();
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    try {
      if (signup) {
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        const verifier = await deriveVerifier(password, salt);
        if (readAccount(email)) {
          status.textContent = "An account with this email already exists in this browser. Sign in below.";
          return;
        }
        localStorage.setItem(accountKey(email), JSON.stringify({ name, email, phone, salt, verifier }));
      } else {
        const account = readAccount(email);
        if (!account || await deriveVerifier(password, account.salt) !== account.verifier) {
          status.textContent = "We couldn’t match that email and password to an account in this browser.";
          return;
        }
      }
      localStorage.setItem(sessionKey, email);
      form.reset();
      location.replace("profile.html");
    } catch {
      showStorageError();
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  }

  if (form) {
    form.addEventListener("submit", submitAccount);
    form.querySelector("button[type=submit]").disabled = false;
  }
  form?.addEventListener("input", event => {
    const input = event.target;
    status.textContent = "";
    if (input.getAttribute("aria-invalid") === "true") markField(input);
    if (input.name === "password" && form.elements.confirm?.value) markField(form.elements.confirm);
  });
  document.querySelector("[data-signout]")?.addEventListener("click", () => {
    try {
      localStorage.removeItem(sessionKey);
      location.replace("login.html");
    } catch {
      showStorageError();
    }
  });
  window.addEventListener("storage", refreshAccountPage);
  window.addEventListener("pageshow", refreshAccountPage);
  refreshAccountPage();
})();
