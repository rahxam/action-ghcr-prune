const MS_IN_DAY = 1000 * 60 * 60 * 24

const daysBetween = (startDate, endDate = new Date()) =>
  Math.floor((endDate.getTime() - startDate.getTime()) / MS_IN_DAY)

const anyRegexMatch = regexes => tags =>
  regexes.some(regex => tags.some(tag => tag.match(regex)))

const versionFilter = options => version => {
  const { olderThan, untagged, tagRegex, keepTags, keepTagsRegexes } = options
  const createdAt = new Date(version.created_at)
  const age = daysBetween(createdAt)

  if (olderThan > age) {
    console.log('older', olderThan, age)
    return false
  }

  const tags = version.metadata.container.tags
  console.log(tags)

  if (untagged && (!tags || !tags.length)) {
    console.log('untagged')
    return true
  }

  if (keepTags && tags && keepTags.some(keepTag => tags.includes(keepTag))) {
    console.log('keepTags')
    return false
  }

  if (keepTagsRegexes && tags && anyRegexMatch(keepTagsRegexes)(tags)) {
    console.log('keepTagsRegexes')
    return false
  }

  if (tagRegex && tags && tags.some(tag => tag.match(tagRegex))) {
    console.log('tagRegex')
    return true
  }

  return false
}

module.exports = {
  versionFilter
}
