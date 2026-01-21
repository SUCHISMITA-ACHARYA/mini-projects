from pydantic import BaseModel

class DecisionInput(BaseModel):
    decision: str
    user_context: str
