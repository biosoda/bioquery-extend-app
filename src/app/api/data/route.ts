'use server';

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface DataSourceItem {
  id: number;
  fetchUrl: string;
  fetchQuery: string;
}

interface DataSourceObj {
  [key: string]: DataSourceItem;
}

interface DataSourcesArrayItem {
  id: number;
  code: string;
  url: string;
  query: string;
}

export async function GET(request: Request) {
  try {
    // Fetch all services
    const services = await prisma.$queryRaw`
      SELECT id, name, url AS "moreinfo", query_url AS "urlquery"
      FROM service
      ORDER BY id;`;

    // Fetch all template categories
    const template_categories = await prisma.$queryRaw`
      SELECT id, name AS "title", parent_id AS "parentId"
      FROM template_category
      ORDER BY id;`;

    // Fetch all templates
    const templates = await prisma.$queryRaw`
      SELECT id, question, query AS "SPARQL", url AS "fetchUrlShort",
        COALESCE(variables, '[]'::jsonb) AS "vars", json_build_array(category_id) AS "parentIds"
      FROM template
      ORDER BY id;`;

    // Fetch all data sources
    const data_sources = await prisma.$queryRaw`
            SELECT id, code, url, query
            FROM data_source
            ORDER BY id;`;
    const data_sources_obj: DataSourceObj = (data_sources as Array<DataSourcesArrayItem>).reduce(
      (obj: DataSourceObj, item: DataSourcesArrayItem) => {
        obj[item.code] = {
          id: item.id,
          fetchUrl: item.url,
          fetchQuery: item.query,
        };
        return obj;
      },
      {} as DataSourceObj
    );

    // Combine all data
    const data = {
      possibleServices: services,
      structure: template_categories,
      questions: templates,
      datasources: data_sources_obj,
    };
  
    return NextResponse.json({ ...data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
