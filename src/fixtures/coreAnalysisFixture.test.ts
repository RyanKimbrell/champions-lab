import { describe, expect, it } from 'vitest'

import { coreAnalysisFixture } from './coreAnalysisFixture'

describe('coreAnalysisFixture', () => {
  it('contains ten tournament teams', () => {
    expect(coreAnalysisFixture.teams).toHaveLength(10)
  })

  it('contains one tournament event', () => {
    expect(coreAnalysisFixture.events).toHaveLength(1)
  })

  it('contains ten tournament entries', () => {
    expect(coreAnalysisFixture.entries).toHaveLength(10)
  })
})