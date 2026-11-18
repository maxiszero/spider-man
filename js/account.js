(() => {
  "use strict";

  const sessionKey = "spider-index.session";
  const accountPrefix = "spider-index.user:";
  const accountKey = email => accountPrefix + email;
  const form = document.querySelector("[data-auth]");
  const profile = document.querySelector("[data-profile]");
  const status = document.querySelector("[data-form-status]");
  const signup = form?.dataset.auth === "signup";
  const rounds = 600000;

  function readAccount(email) {
    if (!email) return null;
    const stored = localStorage.getItem(accountKey(email));
    if (!stored) return null;
    try {
      const account = JSON.parse(stored);
      if (account?.email !== email || !/^[a-f\d]{32}$/i.test(account.salt) ||
          !/^[a-f\d]{64}$/i.test(account.verifier)) return null;
      return account;
    } catch {
      // One damaged record must not prevent other local profiles from signing in.
      return null;
    }
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
          element.textContent = account[element.dataset.detail] ?? "";
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

  function normalizePhone(value) {
    if (typeof value !== "string") return "";
    const input = value.trim().replace(/\s+/g, " ");
    if (input.length > 38 || !/^\+?[\d(][\d ()-]*\d$/.test(input) || input.includes("--")) return "";
    if (/[()]/.test(input) && !/^[^()]*\(\d{1,8}\)[^()]*$/.test(input)) return "";
    let digits = input.replace(/\D/g, "");
    if (input.startsWith("+") || input.startsWith("00")) {
      if (input.startsWith("00")) digits = digits.slice(2);
      if (!/^[1-9]\d{7,14}$/.test(digits)) return "";
      if (/^[17]/.test(digits) && digits.length !== 11) return "";
      return "+" + digits;
    }
    // Kazakhstan numbers can be entered as 7xx…, 8 7xx… or 7 7xx….
    if (/^[78]7\d{9}$/.test(digits)) digits = digits.slice(1);
    return /^7\d{9}$/.test(digits) ? "+7" + digits : "";
  }

  const validEmail = value => /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value);

  function findAccountsByPhone(phone) {
    const matches = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(accountPrefix)) continue;
      const account = readAccount(key.slice(accountPrefix.length));
      if (account && normalizePhone(account.phone) === phone) matches.push(account);
    }
    return matches;
  }

  function validationError(input) {
    const value = input.value;
    switch (input.name) {
      case "name":
        return value.trim() ? "" : "Enter your name so we can identify your profile.";
      case "email":
        return validEmail(value.trim()) ? "" : "Enter an email address such as name@example.com.";
      case "identifier":
        if (!value.trim()) return "Enter your email or phone number.";
        if (value.includes("@")) return validEmail(value.trim()) ? "" : "Enter an email address such as name@example.com.";
        return normalizePhone(value) ? "" : "Enter a valid phone number, or use your email address.";
      case "phone":
        return normalizePhone(value) ? "" : "Enter a Kazakhstan phone number or use + and your country code.";
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
    const identifier = signup ? form.elements.email.value : form.elements.identifier.value;
    let email = identifier.trim().toLowerCase();
    const password = form.elements.password.value;
    const name = form.elements.name?.value.trim();
    const phone = form.elements.phone?.value.trim();
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    try {
      if (signup) {
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        const verifier = await deriveVerifier(password, salt);
        if (localStorage.getItem(accountKey(email)) !== null) {
          status.textContent = "An account with this email already exists in this browser. Sign in below.";
          return;
        }
        if (findAccountsByPhone(normalizePhone(phone)).length) {
          const field = form.elements.phone;
          field.setAttribute("aria-invalid", "true");
          document.getElementById("phone-error").textContent = "A profile already uses this number in this browser. Sign in below or use a different number.";
          field.focus();
          return;
        }
        localStorage.setItem(accountKey(email), JSON.stringify({ name, email, phone, salt, verifier }));
      } else {
        let account;
        if (validEmail(email)) {
          account = readAccount(email);
        } else {
          const matches = findAccountsByPhone(normalizePhone(identifier));
          if (matches.length > 1) {
            status.textContent = "This phone number belongs to more than one local profile. Use your email to sign in.";
            return;
          }
          account = matches[0];
        }
        if (!account || await deriveVerifier(password, account.salt) !== account.verifier) {
          status.textContent = "We couldn’t match those details to an account in this browser.";
          return;
        }
        email = account.email;
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
