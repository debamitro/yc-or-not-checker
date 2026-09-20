import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const client = new TypeSafeClient();

// Middleware
app.use(cors());
app.use(express.json());

// Available YC batches
const BATCHES = [
  'Summer 2026',
  'Spring 2026',
  'Winter 2026',
  'Fall 2025',
  'Summer 2025',
  'Spring 2025',
  'Winter 2025',
  'Fall 2024',
  'Summer 2024',
  'Spring 2024',
  'Winter 2024',
];

// Cache for batch data to avoid re-fetching
const batchCache: Record<string, string[]> = {};

function batchToSlug(batch: string): string {
  return batch.toLowerCase().replace(' ', '-');
}

// Get the list of available batches
app.get('/api/batches', (_req: Request, res: Response) => {
  res.json({ batches: BATCHES });
});

// Fetch and cache long descriptions for a batch
async function getBatchDescriptions(batch: string): Promise<string[]> {
  if (batchCache[batch]) {
    return batchCache[batch];
  }

  const slug = batchToSlug(batch);
  const url = `https://yc-oss.github.io/api/batches/${slug}.json`;

  try {
    const response = await axios.get(url);
    const companies = response.data;
    const descriptions: string[] = companies
      .map((c: any) => c.long_description)
      .filter((d: string | null | undefined): d is string => d != null);
    
    batchCache[batch] = descriptions;
    return descriptions;
  } catch (error) {
    console.error(`Failed to fetch batch ${batch}:`, error);
    throw new Error(`Could not fetch data for batch "${batch}"`);
  }
}

// Check if an idea would qualify for a YC batch
app.post('/api/check_idea', async (req: Request, res: Response) => {
  try {
    const { idea, batch } = req.body;

    if (!idea || typeof idea !== 'string') {
      res.status(400).json({ error: 'Please provide an idea description.' });
      return;
    }

    if (!batch || typeof batch !== 'string') {
      res.status(400).json({ error: 'Please select a YC batch.' });
      return;
    }

    // Fetch company descriptions for the selected batch
    const descriptions = await getBatchDescriptions(batch);

    // Build a condensed summary of existing companies (limit to avoid huge prompts)
    // Take a sample of up to 50 companies to keep the prompt manageable
    const sampleDescriptions = descriptions.slice(0, 50);
    const companiesSummary = sampleDescriptions
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    const state = [
      `User's startup idea: "${idea}"`,
      '',
      `Below are the descriptions of YC companies from the ${batch} batch:`,
      companiesSummary,
      '',
      `There are ${descriptions.length} companies total in this batch (showing a sample of ${sampleDescriptions.length}).`,
    ].join('\n');

    const response = await client.systemOne({
      state,
      questions: {
        verdict: choice(
          `Given the user's startup idea and the YC companies listed above, would this idea have qualified for the ${batch} YC batch? Consider whether the idea is in a similar space, has similar ambition, solves a real problem, and is the kind of thing YC funds.`,
          {
            yes: "The idea would likely have qualified — it's similar in nature, scope, and quality to companies YC funded in this batch.",
            maybe: "The idea might have qualified — it has some overlap with funded companies but also notable differences or uncertainties.",
            no: "The idea would likely not have qualified — it's too different from what YC funded in this batch, or lacks key qualities YC looks for.",
          },
        ),
      },
    });

    res.json({
      verdict: response.answers.verdict.choice,
      confidence: response.answers.verdict.confidence,
      probabilities: response.answers.verdict.probabilities,
    });
  } catch (error: any) {
    console.error('Error checking idea:', error);
    res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
