// Generated by https://quicktype.io

export interface MockDataTypes {
  title: string;
  creator: Creator;
  trigger: Trigger;
  recipients: string[];
  interval: Interval;
  next_delivery: string;
}

export interface Creator {
  id: number;
  name: string;
}

export enum Interval {
  Monthly = "monthly",
  OneTime = "one-time",
  Weekly = "weekly",
}

export enum Trigger {
  Data = "data",
  OneTime = "one-time",
  Time = "time",
}
