# Invoice Memory Agent

## Overview
Memory-based invoice processing system that learns from past human corrections.

## Tech Stack
- TypeScript (strict)
- Node.js
- File-based persistent memory

## How It Works
1. Recall memory
2. Apply vendor-specific rules
3. Decide auto vs human
4. Learn from human approvals

## Running the Demo
npm install
npx ts-node src/demo/runDemo.ts

## Learning Demonstration
First run requires human review.
Second run applies learned memory with higher confidence.
