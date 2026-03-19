import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const slug = createSlug(title);

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          slug,
          title: title.trim(),
          description: description.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ course: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while creating the course." },
      { status: 500 }
    );
  }
}