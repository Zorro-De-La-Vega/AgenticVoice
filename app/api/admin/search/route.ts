import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import { UserRole } from '@/types/auth';

const SERPER_API_KEY = process.env.SERPER_API_KEY!;

// Helper function to check admin access
async function checkAdminAccess(session: any) {
  if (!session?.user?.role) return false;
  
  const adminRoles = [UserRole.GOD_MODE, UserRole.ADMIN, UserRole.MARKETING];
  return adminRoles.includes(session.user.role);
}

// POST /api/admin/search - Search web using SerperAPI for competitive intelligence
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await checkAdminAccess(session)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { query, type = 'search', gl = 'us', hl = 'en' } = body;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Make request to Serper API
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        type,
        gl, // Geographic location
        hl, // Language
        num: 10 // Number of results
      })
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`);
    }

    const data = await response.json();

    // Process and return relevant data
    return NextResponse.json({
      query,
      searchInformation: data.searchInformation,
      organic: data.organic?.map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        date: result.date,
        source: result.source
      })) || [],
      news: data.news?.map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        date: result.date,
        source: result.source,
        imageUrl: result.imageUrl
      })) || [],
      relatedSearches: data.relatedSearches || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

// GET /api/admin/search/trends - Get trending topics for AI voice assistants
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !await checkAdminAccess(session)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'ai voice assistants';

    // Predefined trending searches for AI voice assistant industry
    const trendingQueries = [
      `${category} market trends 2024`,
      `${category} competition analysis`,
      `${category} industry news`,
      `${category} technology updates`,
      `${category} customer reviews`
    ];

    const trendResults = [];

    // Search each trending query
    for (const query of trendingQueries) {
      try {
        const response = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: query,
            type: 'search',
            gl: 'us',
            hl: 'en',
            num: 3
          })
        });

        if (response.ok) {
          const data = await response.json();
          trendResults.push({
            query,
            results: data.organic?.slice(0, 3) || [],
            newsCount: data.news?.length || 0
          });
        }
      } catch (error) {
        console.error(`Error searching for ${query}:`, error);
      }
    }

    return NextResponse.json({
      category,
      trends: trendResults,
      timestamp: new Date().toISOString(),
      totalQueries: trendingQueries.length
    });

  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
  }
}
