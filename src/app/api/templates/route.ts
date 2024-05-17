'use server';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

const templateSchema = z.object({
  question: z.string(),
  sparqlQuery: z.string(),
  serviceUrl: z.string().url(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const submittedData = await request.json();
    const parsedData = templateSchema.parse(submittedData);
    const createdTemplate = await prisma.template.create({
      data: {
        question: parsedData.question,
        query: parsedData.sparqlQuery,
        url: parsedData.serviceUrl,
        author_name: parsedData.name,
        author_email: parsedData.email,
        category_id: 26,
      },
    });
    return NextResponse.json({ createdTemplate }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}