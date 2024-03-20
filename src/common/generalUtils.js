export function formatDateFromDatetime (datetimeString) {
  // Create a Date object from the datetime string
  const datetime = new Date(datetimeString);

  // Extract the date components
  const month = datetime.getMonth() + 1; // Months are zero-based, so add 1
  const day = datetime.getDate();
  const year = datetime.getFullYear().toString().slice(-2); // Get last two digits of the year

  // Format the date as MM/DD/YY
  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

  return formattedDate; // Output: 03/18/24
}