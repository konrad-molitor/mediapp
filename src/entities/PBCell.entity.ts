import { v4 as uuidv4 } from 'uuid';

export class PBCell {
  id: string;
  position: { row: number; col: number; rowLabel: string; colLabel: string };
  label: string;
  medicationId: string | null;
  state: PBCellState;

  constructor(row: number, col: number) {
    this.id = uuidv4();
    this.position = {
      row,
      col,
      rowLabel: String.fromCharCode(65 + row),
      colLabel: (col + 1).toString(),
    };
    this.label = `${this.position.rowLabel}${this.position.colLabel}`;
    this.medicationId = null;
    this.state = PBCellState.NotUsed;
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
