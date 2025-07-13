import axios from 'axios';

/**
 * GET /api/weather/rain-status
 * Returns { raining: true/false, message: string }
 * Uses data.gov.sg rainfall API for the next 1 hour.
 */
export const getRainStatus = async (req, res, next) => {
  try {
    // Singapore rainfall API (1-hour forecast)
    const url = 'https://api.data.gov.sg/v1/environment/rainfall';
    const response = await axios.get(url);
    // The API returns readings for multiple stations; check if any station reports rain > 0 in the last hour
    const items = response.data.items || [];
    let isRaining = false;
    let mm = 0;
    if (items.length > 0 && items[0].readings) {
      for (const reading of items[0].readings) {
        if (reading.value > 0) {
          isRaining = true;
          mm = reading.value;
          break;
        }
      }
    }
    // Compose a message for the frontend
    const message = isRaining
      ? `It's raining! (${mm}mm at some stations)`
      : "No rain detected in the last hour.";
    res.json({ raining: isRaining, message });
  } catch (err) {
    next(err);
  }
}; 