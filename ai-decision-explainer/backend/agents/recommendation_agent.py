from pydantic_ai import Agent
from schemas.decision_output import Explanation

explanation_agent = Agent(
    model="openrouter:mistralai/mistral-7b-instruct",
    system_prompt="Explain reasoning step by step in simple language."
)
