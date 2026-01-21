🧠 AI Decision Explainer

AI Decision Explainer is a full-stack web application that helps users make better decisions by breaking them down into clear factors, pros and cons, structured reasoning, and a final recommendation.

🌐 Live Demo<br>
 https://ai-decision-explainer.netlify.app/

🚀 What It Does

-Users enter a decision and personal context<br>
-An AI agent analyzes the input

The app returns:<br>
-Key factors<br>
-Pros and cons<br>
-Step-by-step reasoning<br>
-A clear final recommendation<br>

The goal is to improve clarity and confidence in everyday decision-making.

🛠️ Tech Stack

Frontend:<br>
HTML, CSS, JavaScript

Backend:<br>
-FastAPI<br>
-Pydantic AI<br>
-OpenRouter (LLM-based reasoning)<br>

Deployment:<br>
Backend: Render<br>
Frontend: Netlify<br>

⚙️ Run Locally<br>
cd backend<br>
pip install -r requirements.txt<br>
uvicorn main:app --port 8001<br>


Open frontend using Live Server or directly in the browser.

