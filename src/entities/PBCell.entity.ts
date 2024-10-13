import { Medication } from "./Medication.entity";

export class PBCell {
  position: { row: number; col: number; rowLabel: string; colLabel: string };
  label: string;
  medication: Medication | null;
  state: PBCellState;

  constructor(row: number, col: number) {
    this.position = {
      row,
      col,
      rowLabel: String.fromCharCode(65 + row), // Converts row number to letter (A-Z)
      colLabel: (col + 1).toString(), // Column numbers start from 1
    };
    this.label = `${this.position.rowLabel}${this.position.colLabel}`; // E.g. A1, B3
    this.medication = null;
    this.state = PBCellState.NotUsed; // Default state
  }
}

export enum PBCellState {
  Filled = "Filled",
  ToBeTakenNow = "ToBeTakenNow",
  Taken = "Taken",
  NotUsed = "NotUsed",
  Skipped = "Skipped",
  Overdue = "Overdue",
}
