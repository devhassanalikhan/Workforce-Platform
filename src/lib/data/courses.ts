import { supabase } from '@/lib/supabase'
import { mockCourses } from '@/data/mockCourses'
import type { Course } from '@/types/domain'

interface CourseRow {
  id: string
  title: string
  category: string
  image_url: string | null
  duration: string | null
  level: string | null
  enrolled_count: number
  rating: number | null
  provider: string | null
  price: string | null
  description: string | null
  modules: number | null
  certification: string | null
  skills: string[]
}

function mapRow(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image_url ?? '/images/training-placeholder.jpg',
    duration: row.duration ?? '',
    level: row.level ?? '',
    enrolled: row.enrolled_count,
    rating: row.rating ?? 0,
    provider: row.provider ?? '',
    price: row.price ?? '',
    description: row.description ?? '',
    modules: row.modules ?? 0,
    certification: row.certification ?? '',
    skills: row.skills,
    // Real per-user progress needs training_enrollments joined against the
    // signed-in applicant — not wired up yet, see Course type comment.
    progress: 0,
  }
}

// Falls back to bundled demo courses whenever the live `training_courses`
// table has no rows yet, so Skills Training keeps showing full content for
// client demos until real courses are published.
export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('training_courses')
    .select('id, title, category, image_url, duration, level, enrolled_count, rating, provider, price, description, modules, certification, skills')

  if (error || !data || data.length === 0) {
    return mockCourses
  }

  return (data as CourseRow[]).map(mapRow)
}
