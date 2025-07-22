import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'input', // MUST match adapter format condition
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};
