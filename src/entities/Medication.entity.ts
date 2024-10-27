export class Medication {
  id: string;
  name: string;
  timeType: MedicationTimeType;
  times: Date[];
  interval?: number;
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    timeType: MedicationTimeType,
    times: Date[],
    interval?: number,
    createdAt?: Date
  ) {
    this.id = id;
    this.name = name;
    this.timeType = timeType;
    this.times = times;
    this.interval = interval;
    this.createdAt = createdAt || new Date();
  }

  static fromJSON(json: any): Medication {
    return new Medication(
      json.id,
      json.name,
      json.timeType,
      json.times.map((time: string) => new Date(time)),
      json.interval,
      new Date(json.createdAt)
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      timeType: this.timeType,
      times: this.times.map((time) => time.toISOString()),
      interval: this.interval,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

export enum MedicationTimeType {
  ByTime = 'By Time',
  EveryNDays = 'Every N Days',
}
