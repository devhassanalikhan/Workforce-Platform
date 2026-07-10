import type { ActiveJobOrder } from '@/types/domain'

export const mockActiveJobOrder: ActiveJobOrder = {
  jobOrderCode: 'JO-2841',
  candidateName: 'Ali Khan',
  candidateInitials: 'AK',
  origin: 'Rawalpindi, Pakistan',
  destination: 'Dubai, UAE',
  aiScore: 96,
  stage: 5,
  jobTitle: 'Construction Supervisor',
  complianceItems: [
    { label: 'Employment Contract', status: 'complete' },
    { label: 'Medical Clearance', status: 'complete' },
    { label: 'UAE Work Visa', status: 'complete' },
    { label: 'Flight & Logistics', status: 'pending' },
    { label: 'Emigration Clearance (OEC)', status: 'complete' },
    { label: 'Police Clearance Certificate', status: 'complete' },
    { label: 'Welfare Fund Enrollment', status: 'pending' },
  ],
}
