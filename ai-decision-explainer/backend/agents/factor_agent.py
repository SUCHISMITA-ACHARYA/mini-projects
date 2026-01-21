from pydantic_ai import Agent
from schemas.decision_output import DecisionFactors

factor_agent = Agent(
    model="openrouter:mistralai/mistral-7b-instruct",
    system_prompt=(
        "Extract 4 to 6 key factors influencing the decision."
    )
)
