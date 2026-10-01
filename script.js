const phoneInput = document.getElementById("telefone");

phoneInput.addEventListener("input", (event) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);

  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, "($1) $2");
  } else if (value.length > 0) {
    value = value.replace(/^(\d+)/, "($1");
  }

  event.target.value = value;
});

const form = document.getElementById("rsvpForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    nome: document.getElementById("nome").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    presenca: document.getElementById("presenca").value,
    acompanhantes: Number(document.getElementById("acompanhantes").value)
  };

  if (!data.nome || !data.telefone || !data.presenca) {
    message.textContent = "Preencha os campos obrigatórios.";
    return;
  }

  const supabaseReady =
    typeof SUPABASE_URL !== "undefined" &&
    typeof SUPABASE_ANON_KEY !== "undefined" &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("COLE_AQUI") &&
    !SUPABASE_ANON_KEY.includes("COLE_AQUI");

  if (!supabaseReady) {
    message.textContent = "O formulário está pronto. A conexão com o Supabase será configurada na próxima etapa.";
    return;
  }

  message.textContent = "Enviando sua confirmação...";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/confirmacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Não foi possível salvar a confirmação.");
    }

    form.reset();
    message.textContent = "Presença enviada com carinho! Esperamos você. 🤎";
  } catch (error) {
    console.error(error);
    message.textContent = "Não foi possível enviar agora. Tente novamente.";
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}
