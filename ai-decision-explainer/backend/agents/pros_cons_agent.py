from pydantic_ai import Agent
from schemas.decision_output import ProsCons

pros_cons_agent = Agent(
    model="openrouter:mistralai/mistral-7b-instruct",
    system_prompt="Generate clear pros and cons."
)
