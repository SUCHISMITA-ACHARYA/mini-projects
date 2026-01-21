from pydantic import BaseModel
from typing import List

class DecisionResult(BaseModel):
    factors: List[str]
    pros: List[str]
    cons: List[str]
    explanation: List[str]
    recommendation: str
