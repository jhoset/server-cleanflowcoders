import * as moment from 'moment-timezone';
export class TimezoneAdapter {
  static isValidTimezone(timezone: string): boolean {
    return moment.tz.zone(timezone) !== null;
  }
  static convertToSystemTimezone(
    value: string,
    timezone: string,
  ): moment.Moment {
    return moment.tz(value, timezone).tz(process.env.TZ);
  }
  static convertFromSystemToSpecificTimezone(
    value: string,
    timezone: string,
  ): moment.Moment {
    return moment.tz(value, process.env.TZ).tz(timezone);
  }
}
