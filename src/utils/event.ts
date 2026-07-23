export const ageBracketNames: Record<string, string> = {
  'early_years':  'Ages 3–5',
  'early_kids':   'Ages 3–5',
  'kids':         'Ages 6–12',
  'teens':        'Ages 13–18',
  'young_adults': 'Ages 13–18',
};

export const ageBracketDisplayNames: Record<string, string> = {
  'early_years':  'Early Years',
  'early_kids':   'Early Years',
  'kids':         'Kids',
  'teens':        'Teens',
  'young_adults': 'Teens',
};

export const listingTypeNames: Record<string, string> = {
  event: 'Event',
  competition: 'Competition',
  course: 'Course',
  webinar: 'Webinar'
};

export function getTypeBadgeStyle(type: string | undefined): string {
  const t = type || 'event';
  switch (t) {
    case 'competition':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'course':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'webinar':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'event':
    default:
      return 'bg-purple-50 text-purple-700 border-purple-200';
  }
}

export function getListingTypeDisplayName(type: string | undefined): string {
  const t = type || 'event';
  return listingTypeNames[t] || 'Event';
}
