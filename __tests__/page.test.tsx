import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

test('Home renders heading', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
})
