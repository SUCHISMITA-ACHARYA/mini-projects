const form = document.getElementById("decision-form");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const themeToggle = document.getElementById("theme-toggle");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

 
  const factorsList = document.getElementById("factors");
  const prosList = document.getElementById("pros");
  const consList = document.getElementById("cons");
  const explanationList = document.getElementById("explanation");
  const recommendationEl = document.getElementById("recommendation");

  factorsList.innerHTML = "";
  prosList.innerHTML = "";
  consList.innerHTML = "";
  explanationList.innerHTML = "";
  recommendationEl.innerText = "";

  const decision = document.getElementById("decision").value.trim();
  const context = document.getElementById("context").value.trim();

  loading.classList.remove("hidden");
  result.classList.add("hidden");

  try {
    const response = await fetch(
      "https://ai-decision-explainer.onrender.com/explain-decision",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: decision,
          user_context: context,
        }),
      }
    );

    const raw = await response.json();
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;

   
    if (data.factors && typeof data.factors === "object") {
      for (const [key, value] of Object.entries(data.factors)) {
        const li = document.createElement("li");

        const formattedKey = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        if (value === true) {
          li.textContent = `${formattedKey} is available.`;
        } else if (value === false) {
          li.textContent = `${formattedKey} is not available.`;
        } else {
          li.textContent = `${formattedKey}: ${value}`;
        }

        factorsList.appendChild(li);
      }
    } else {
      const li = document.createElement("li");
      li.textContent = "No clear factors identified.";
      factorsList.appendChild(li);
    }

    
    if (Array.isArray(data.pros) && data.pros.length > 0) {
      data.pros.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        prosList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No advantages with the given context.";
      prosList.appendChild(li);
    }



    if (Array.isArray(data.cons) && data.cons.length > 0) {
      data.cons.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        consList.appendChild(li);
      });
    }

    
    if (Array.isArray(data.explanation)) {
      data.explanation.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        explanationList.appendChild(li);
      });
    } else if (typeof data.explanation === "string") {
      const li = document.createElement("li");
      li.textContent = data.explanation;
      explanationList.appendChild(li);
    }

    
    if (data.recommendation === "NOT FEASIBLE") {
      recommendationEl.innerText =
        "This decision is not feasible with the given context.";
    } else {
      recommendationEl.innerText = data.recommendation;
    }

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  } catch (error) {
    loading.classList.add("hidden");
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
});


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});
