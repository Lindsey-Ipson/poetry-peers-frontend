import { formatDateFromDatetime } from './generalUtils';

describe('formatDateFromDatetime', () => {
  // Test for correctly formatting the current date
  it('formats current date correctly', () => {
    const currentDatetime = new Date().toISOString();
    const expectedMonth = new Date().getMonth() + 1; // Get current month and adjust for zero-based index
    const expectedDay = new Date().getDate();
    const expectedYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year

    const expectedResult = `${expectedMonth.toString().padStart(2, '0')}/${expectedDay.toString().padStart(2, '0')}/${expectedYear}`;
    expect(formatDateFromDatetime(currentDatetime)).toEqual(expectedResult);
  });

  // Test for correctly formatting a specific date
  it('formats "2024-03-18T12:00:00Z" as "03/18/24"', () => {
    const datetimeString = "2024-03-18T12:00:00Z";
    const formattedDate = formatDateFromDatetime(datetimeString);
    expect(formattedDate).toEqual("03/18/24");
  });

});
