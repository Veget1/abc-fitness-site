// Utility: get cart from localStorage
function getCart() {
  const stored = localStorage.getItem("cartItems");
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const totalEl = document.getElementById("cartTotal");
  if (!container || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is currently empty.</p>";
    totalEl.textContent = "";
    return;
  }

  let html = "<ul>";
  let total = 0;
  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    html += `<li>${item.name} &times; ${item.quantity} – $${lineTotal.toFixed(2)}</li>`;
  });
  html += "</ul>";
  container.innerHTML = html;
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function openCartModal() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  renderCart();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeCartModal() {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Subscribe feature
function setupSubscribeForm() {
  const form = document.getElementById("subscribeForm");
  const emailInput = document.getElementById("subscribeEmail");
  const messageEl = document.getElementById("subscribeMessage");
  if (!form || !emailInput || !messageEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      messageEl.textContent = "Please enter a valid email address.";
      messageEl.style.color = "red";
      return;
    }

    // Store subscribers in localStorage
    const stored = localStorage.getItem("subscribers");
    const subscribers = stored ? JSON.parse(stored) : [];
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem("subscribers", JSON.stringify(subscribers));

    messageEl.textContent = "Thanks for subscribing! Check your inbox for updates.";
    messageEl.style.color = "green";
    form.reset();
  });
}

// Add to Cart buttons
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price") || "0");
      if (!name || !price) return;

      const cart = getCart();
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      saveCart(cart);
      alert(`${name} has been added to your cart.`);
    });
  });
}

// Contact form (simple status message)
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactMessageStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    if (!name || !email) {
      status.textContent = "Please provide your name and email.";
      status.style.color = "red";
      return;
    }
    status.textContent = "Thank you for contacting us! We will follow up soon.";
    status.style.color = "green";
    form.reset();
  });
}

// Customer feedback with localStorage
function setupFeedbackForm() {
  const form = document.getElementById("feedbackForm");
  const list = document.getElementById("feedbackList");
  if (!form || !list) return;

  function renderFeedback() {
    const stored = localStorage.getItem("feedbackEntries");
    const entries = stored ? JSON.parse(stored) : [];
    if (!entries.length) {
      list.innerHTML = "<p>No feedback submitted yet.</p>";
      return;
    }
    let html = "";
    entries.forEach((entry) => {
      html += `
        <article class="feedback-card">
          <h3>${entry.name} (Rating: ${entry.rating}/5)</h3>
          <p>${entry.comments || ""}</p>
        </article>
      `;
    });
    list.innerHTML = html;
  }

  renderFeedback();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("feedbackName").value.trim();
    const rating = document.getElementById("feedbackRating").value;
    const comments = document.getElementById("feedbackComments").value.trim();

    if (!name) {
      alert("Please provide your name for feedback.");
      return;
    }

    const stored = localStorage.getItem("feedbackEntries");
    const entries = stored ? JSON.parse(stored) : [];
    entries.push({ name, rating, comments, date: new Date().toISOString() });
    localStorage.setItem("feedbackEntries", JSON.stringify(entries));

    form.reset();
    renderFeedback();
  });
}

// Custom Program: sessionStorage
function setupCustomProgram() {
  const form = document.getElementById("customProgramForm");
  const summary = document.getElementById("programSummary");
  const message = document.getElementById("customProgramMessage");
  if (!form || !summary || !message) return;

  function renderProgramFromSession() {
    const stored = sessionStorage.getItem("customProgram");
    if (!stored) return;
    const program = JSON.parse(stored);
    summary.innerHTML = `
      <p><strong>Goal:</strong> ${program.goal}</p>
      <p><strong>Days per Week:</strong> ${program.daysPerWeek}</p>
      <p><strong>Intensity:</strong> ${program.intensity}</p>
      <p><strong>Notes:</strong> ${program.preferences || "None provided."}</p>
      <p>This plan suggests a mix of strength, cardio, and recovery sessions tailored to your selections.</p>
    `;
  }

  renderProgramFromSession();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const goal = document.getElementById("goal").value;
    const daysPerWeek = document.getElementById("daysPerWeek").value || "3";
    const intensity = document.getElementById("intensity").value;
    const preferences = document.getElementById("preferences").value.trim();

    const program = { goal, daysPerWeek, intensity, preferences };
    sessionStorage.setItem("customProgram", JSON.stringify(program));
    message.textContent = "Your custom program has been generated and saved for this session.";
    message.style.color = "green";
    renderProgramFromSession();
  });
}

// Navigation toggle
function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });
}

// Cart modal buttons
function setupCartButtons() {
  const viewBtns = document.querySelectorAll("#viewCartBtn");
  const closeBtn = document.getElementById("closeCartBtn");

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", openCartModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartModal);
  }

  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeCartModal();
      }
    });
  }
}

// Year in footer
function setYear() {
  const yearSpans = document.querySelectorAll("#year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => (span.textContent = currentYear));
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSubscribeForm();
  setupAddToCartButtons();
  setupCartButtons();
  setupContactForm();
  setupFeedbackForm();
  setupCustomProgram();
  setYear();
});
