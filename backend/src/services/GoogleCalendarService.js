const { google } = require('googleapis');

class GoogleCalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Set credentials when user authenticates
  setCredentials(tokens) {
    if (tokens) {
      this.oauth2Client.setCredentials(JSON.parse(tokens));
    }
  }

  async createWorkoutEvent(workout) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      const startTime = new Date(workout.date);
      // Default duration is 1 hour if not specified in exercises
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const event = {
        summary: `FlowTrack Workout: ${workout.title}`,
        description: `Type: ${workout.type}\nNotes: ${workout.notes || 'No notes'}\nLogged via FlowTrack.`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC', // Ensure frontend sends proper timezone config later
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC',
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      // Optionally re-throw or return null, so workout saves even if calendar fails
      return null;
    }
  }
}

module.exports = new GoogleCalendarService();
