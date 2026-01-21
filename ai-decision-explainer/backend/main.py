from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, HTTPException
from pydantic_ai import Agent
from schemas.decision_input import DecisionInput

app = FastAPI(title="AI Decision Explainer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


agent = Agent(
    model="gpt-3.5-turbo",
    system_prompt=(
        "You are a strict decision analysis assistant.\n\n"
        "IMPORTANT RULES (must follow all):\n"
        "1. Use ONLY the information explicitly provided in the context.\n"
        "2. Do NOT invent ingredients, tools, skills, or conditions.\n"
        "3. If a requirement is missing, you MUST explicitly state it.\n"
        "4. If the decision is not feasible, clearly say it is NOT feasible.\n"
        "5. Never assume substitutes (e.g., flavor, milk, cream) unless stated.\n\n"
        "ANALYSIS INSTRUCTIONS:\n"
        "- First, list what is REQUIRED to fulfill the decision.\n"
        "- Then compare it with what is AVAILABLE in the context.\n"
        "- Any mismatch MUST appear in the cons.\n\n"
        "OUTPUT FORMAT (valid JSON only):\n"
        "- factors: factual elements affecting feasibility\n"
        "- pros: advantages ONLY if truly supported by context\n"
        "- cons: missing ingredients, tools, or constraints\n"
        "- explanation: step-by-step logical reasoning\n"
        "- recommendation: realistic and honest final advice\n"
    )
)



@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/explain-decision")
async def explain_decision(data: DecisionInput):
    try:
        result = await agent.run(
    f"""
Decision: {data.decision}

Context (these are the ONLY items available):
{data.user_context}

Do a feasibility check before recommending anything.
"""
)

        return result.output  # plain JSON text from model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
