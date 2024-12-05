// https://adventofcode.com/2024/day/2

const debug = false
const problemThreshold = 1

export const run1 = (input: string): number => {
  const reports = getReports(input)

  const safeCount = reports.reduce((acc, curr) => acc += (isReportSafe(curr) ? 1 : 0), 0)

  return safeCount
}

export const run2 = (input: string): number => {
  const reports = getReports(input)

  const safeCount = reports.reduce((acc, curr) => acc += (isReportSafe(curr) || validIfDampened(curr) ? 1 : 0), 0)

  return safeCount
}

const getReports = (input: string) => input.split('\n').map((line) => line.split(/\s+/))

const isReportSafe = (report: readonly string[]): boolean => {
  let reportDirection = 0
  let problems = 0

  debug && console.log('analyzing report', report)

  if (problems >= problemThreshold) {
    debug && console.log('skipping report', report, 'because', problems, '>=', problemThreshold)
    return false
  }

  for (let i = 1; i < report.length; i++) {
    if (problems >= problemThreshold) {
      debug && console.log('breaking because report', report, 'has', problems, '>=', problemThreshold)
      return false
    }

    const curr = Number.parseInt(report[i])
    const prev = Number.parseInt(report[i - 1])
    
    const gap = curr - prev
    if (Math.abs(gap) < 1 || Math.abs(gap) > 3) {
      problems++
      debug && console.log('marking problem due to unsafe gap', gap)
    }

    if (problems >= problemThreshold) {
      debug && console.log('breaking because report', report, 'has', problems, '>=', problemThreshold)
      return false
    }

    const direction = gap === 0 ? 0 : gap < 0 ? -1 : 1
    if (i === 1) {
      debug && console.log('first record, marking reportDirection', direction)
      reportDirection = direction
      continue
    }
    
    if (direction === 0 || direction !== reportDirection) {
      problems++
      debug && console.log('marking problem because report changed direction from', reportDirection, 'to', direction)
    }
  }

  if (problems < problemThreshold) {
    debug && console.log('marking report safe')
    return true
  }

  debug && console.log('marking report unsafe because', problems, '>', problemThreshold)
  return false
}

const validIfDampened = (report: readonly string[]): boolean => {
  let hasSafeSubReport = false

  let skipIdx = 0
  while (!hasSafeSubReport && skipIdx < report.length) {
    const subReport = report.reduce((acc, curr, idx) => idx === skipIdx ? [ ...acc ] : [ ...acc, curr ], [] as readonly string[])
    const isSubReportSafe = isReportSafe(subReport)
    debug && console.log('marking subreport', subReport, 'safe:', isSubReportSafe)
    hasSafeSubReport = isSubReportSafe
    skipIdx++
  }

  return hasSafeSubReport
}
