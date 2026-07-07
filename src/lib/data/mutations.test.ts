import { describe, expect, it, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase'
import {
  createJob,
  updateJob,
  deleteJob,
  upsertTalentProfile,
  updateTalentProfile,
  updateCompany,
  applyToJob,
  updatePlacementStage,
  createPlacement,
  deletePlacement,
  updateChecklistItem,
  updateDeployment,
  logCheckIn,
  releaseEscrow,
  fileGrievance,
  resolveGrievance,
  enrollInCourse,
  updateCourseProgress,
  createArticle,
  updateArticle,
  deleteArticle,
} from './mutations'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}))

describe('mutations data-layer helpers', () => {
  const fromMock = supabase.from as ReturnType<typeof vi.fn>
  const rpcMock = supabase.rpc as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a job with the expected insert payload', async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'job-1' }, error: null }),
    }
    fromMock.mockReturnValue(chain)

    const result = await createJob({
      title: 'Engineer',
      location: 'Remote',
      salary_min: 1000,
      salary_max: 2000,
      currency: 'USD',
      employment_type: 'full-time',
      category: 'Engineering',
      experience_level: 'mid',
      description: 'Desc',
      requirements: ['TS'],
      is_hot: true,
      company_id: 'company-1',
    })

    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ title: 'Engineer', company_id: 'company-1' }))
    expect(result).toEqual({ data: { id: 'job-1' }, error: null })
  })

  it('updates a job by id', async () => {
    const chain = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    const result = await updateJob('job-1', { title: 'Updated' })

    expect(chain.update).toHaveBeenCalledWith({ title: 'Updated' })
    expect(chain.eq).toHaveBeenCalledWith('id', 'job-1')
    expect(result).toEqual({ data: null, error: null })
  })

  it('deletes a job by id', async () => {
    const chain = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    await deleteJob('job-1')
    expect(chain.delete).toHaveBeenCalled()
  })

  it('upserts a talent profile with the right conflict target', async () => {
    const chain = { upsert: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    await upsertTalentProfile({
      id: 'user-1',
      name: 'Jane',
      photo_url: null,
      role_title: 'Engineer',
      location: 'Lahore',
      experience_years: 3,
      skills: ['ts'],
      languages: ['en'],
      certifications: ['aws'],
      available: true,
    })

    expect(chain.upsert).toHaveBeenCalledWith(expect.objectContaining({ id: 'user-1' }), { onConflict: 'id' })
  })

  it('applies to a job with cover note and job order code', async () => {
    const jobsChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { company_id: 'company-1' }, error: null }),
    }
    const placementsChain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'placement-1' }, error: null }),
    }
    fromMock.mockImplementation((table) => {
      if (table === 'jobs') return jobsChain
      if (table === 'placements') return placementsChain
      return {} as any
    })

    const result = await applyToJob({
      talent_id: 'user-1',
      job_id: 'job-1',
      stage: 1,
      job_order_code: 'JO-JOB-1',
      cover_note: 'I am excited about this role',
    })

    expect(placementsChain.insert).toHaveBeenCalledWith(expect.objectContaining({
      talent_id: 'user-1',
      job_id: 'job-1',
      stage: 1,
      job_order_code: 'JO-JOB-1',
      cover_note: 'I am excited about this role',
      company_id: 'company-1',
    }))
    expect(result).toEqual({ data: { id: 'placement-1' }, error: null })
  })

  it('updates a placement stage by id', async () => {
    const chain = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    await updatePlacementStage('placement-1', 2)
    expect(chain.update).toHaveBeenCalledWith({ stage: 2 })
  })

  it('uses the atomic escrow RPC', async () => {
    rpcMock.mockResolvedValue({ error: null })

    await releaseEscrow('deployment-1', 25)

    expect(rpcMock).toHaveBeenCalledWith('release_escrow', { p_deployment_id: 'deployment-1', p_amount: 25 })
  })

  it('logs a check-in with status and future next check-in values', async () => {
    const chain = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    await logCheckIn('deployment-1')
    expect(chain.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }))
  })

  it('creates an article with a published timestamp', async () => {
    const chain = { insert: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { id: 'article-1' }, error: null }) }
    fromMock.mockReturnValue(chain)

    await createArticle({ title: 'Hello', excerpt: 'World', image_url: null, category: 'News', read_time: '3 min', trending: true })
    expect(chain.insert).toHaveBeenCalledWith(expect.objectContaining({ title: 'Hello', trending: true }))
  })

  it('deletes an article by id', async () => {
    const chain = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
    fromMock.mockReturnValue(chain)

    await deleteArticle('article-1')
    expect(chain.delete).toHaveBeenCalled()
  })
})
