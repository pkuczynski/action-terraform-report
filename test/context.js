import { URL, fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { test } from 'tap'

const root = fileURLToPath(new URL('./', import.meta.url))

test('context', async assert => {
  // set up
  process.env['INPUT_SHOW-DIFF'] = 'false'
  process.env['INPUT_SHOW-PLAN'] = 'true'
  process.env['INPUT_GITHUB-TOKEN'] = 'abc'

  process.env['INPUT_TERRAFORM-TEXT'] = join(root, 'fixtures/terraform.txt')
  process.env['INPUT_TERRAFORM-JSON'] = join(root, 'fixtures/terraform.json')

  process.env.GITHUB_EVENT_PATH = join(root, 'fixtures/payloads/pull_request/opened.payload.json')

  const { default: context } = await import('../lib/context.js')
  const data = context()

  assert.equal(data.showDiff, 'false')
  assert.equal(data.showPlan, 'true')
  assert.equal(data.token, 'abc')
  assert.match(data.textPath, 'fixtures/terraform.txt')
  assert.match(data.jsonPath, 'fixtures/terraform.json')
})
