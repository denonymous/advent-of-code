// https://adventofcode.com/2024/day/9

export const run1 = (input: string): number => {
  const expanded = expandDisk(input)
  const compacted = compact(expanded)
  return calculateChecksum(compacted)
}

export const run2 = (input: string): number => {
  const expanded = expandDisk(input)
  const compacted = compactIntact(expanded)
  return calculateChecksum(compacted)
}

const expandDisk = (input: string): readonly Position[] => {
  const bits = input.split('').map((v) => Number.parseInt(v))

  let isFile = 1
  let fileId = 0
  let ret: Position[] = []
  
  for (let i = 0; i < input.length; i++) {
    if (isFile > 0) {
      ret.push({ fileId, num: bits[i] })
      fileId++
    } else {
      ret.push({ num: bits[i] })
    }

    isFile *= -1
  }

  return ret
}

const calculateChecksum = (positions: readonly Position[]): number => {
  let idx = 0
  return positions.reduce((acc, curr) => {
    if (curr.fileId !== undefined) {
      for (let i = 0; i < curr.num; i++) {
        acc += curr.fileId * (idx + i)
      }
    }

    idx += curr.num

    return acc
  }, 0)
}

const positionsToString = (positions: readonly Position[]): string =>
  positions.reduce((acc, val) => val.num > 0 ? acc.concat((val.fileId !== undefined ? `${val.fileId}` : '.').repeat(val.num)) : acc, '')

const compact = (positions: readonly Position[]): readonly Position[] => {
  let compactedPositions = positions
  let firstSpaceIdx = 0
  let lastFileIdx = compactedPositions.length + 1
  
  while (firstSpaceIdx < lastFileIdx) {
    firstSpaceIdx = compactedPositions.findIndex((pos) => pos.fileId === undefined && pos.num > 0)
    lastFileIdx = compactedPositions.findLastIndex((pos) => pos.fileId !== undefined && pos.num > 0)

    if (firstSpaceIdx > lastFileIdx || firstSpaceIdx === -1 || lastFileIdx === -1) {
      break
    }

    const firstSpace = compactedPositions[firstSpaceIdx]
    const lastFile = compactedPositions[lastFileIdx]
    
    const a = compactedPositions.slice(0, firstSpaceIdx)
    const b = { ...lastFile, num: 1 }
    const c = { num: firstSpace.num - 1 }
    const d = compactedPositions.slice(firstSpaceIdx + 1, lastFileIdx)
    const e = { ...lastFile, num: lastFile.num - 1 }
    const f = { num: 1 }

    compactedPositions = [ ...a, b, c, ...d, e, f ]

    let ret = []
    for (let i = 0; i < compactedPositions.length; i++) {
      const a = compactedPositions[i]
      const b = compactedPositions[i + 1]
      if (a && b && a.fileId === b.fileId) {
        ret.push({
          fileId: a.fileId,
          num: a.num + b.num
        })
        i++
      } else {
        ret.push(a)
      }
    }

    compactedPositions = ret
  }

  return compactedPositions
}

const compactIntact = (positions: readonly Position[]): readonly Position[] => {
  let compactedPositions = positions
  let firstSpaceIdx = 0
  let lastFileIdx = compactedPositions.length + 1
  
  let unable = new Set<number>()
  
  while (lastFileIdx >= 0) {
    lastFileIdx = compactedPositions.findLastIndex((pos) => pos.fileId !== undefined && pos.num > 0 && !unable.has(pos.fileId))

    if (lastFileIdx === -1) {
      break
    }

    const lastFile = compactedPositions[lastFileIdx]

    firstSpaceIdx = compactedPositions.findIndex((pos, idx) => pos.fileId === undefined && pos.num > 0 && pos.num >= lastFile.num && idx < lastFileIdx)

    if (firstSpaceIdx === -1) {
      if (lastFile.fileId !== undefined && unable.has(lastFile.fileId)) {
        break
      }
      lastFile.fileId !== undefined && unable.add(lastFile.fileId)
      continue
    }

    const firstSpace = compactedPositions[firstSpaceIdx]
    
    const a = compactedPositions.slice(0, firstSpaceIdx)
    const b = lastFile
    const c = { num: firstSpace.num - lastFile.num }
    const d = compactedPositions.slice(firstSpaceIdx + 1, lastFileIdx)
    const e = { num: lastFile.num }
    const f = compactedPositions.slice(lastFileIdx + 1)

    compactedPositions = [ ...a, b, c, ...d, e, ...f ]

    let ret = []
    for (let i = 0; i < compactedPositions.length; i++) {
      const a = compactedPositions[i]
      const b = compactedPositions[i + 1]
      if (a && b && a.fileId === b.fileId) {
        ret.push({
          fileId: a.fileId,
          num: a.num + b.num
        })
        i++
      } else {
        ret.push(a)
      }
    }

    compactedPositions = ret
  }

  return compactedPositions
}

type Position = {
  fileId?: number
  num: number
}